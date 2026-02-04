package com.backend.service.PaymentService;

import com.backend.dtos.PaymentDTOs.PaymentRequest;
import com.backend.dtos.PaymentDTOs.PaymentResponse;
import com.backend.entity.Payment;
import com.backend.entity.PaymentStatus;
import com.backend.entity.Services;
import com.backend.repository.PaymentRepository;
import com.backend.repository.ServiceRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.net.RequestOptions;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentService {

        @Value("${stripe.secret.key}")
        private String stripeSecretKey;

        private final PaymentRepository paymentRepository;
        private final ServiceRepository serviceRepository;

        @PostConstruct
        void initStripe() {
                if (stripeSecretKey == null || stripeSecretKey.isBlank()) {
                        throw new RuntimeException("Stripe secret key not configured");
                }
                Stripe.apiKey = stripeSecretKey.trim();
        }

        public PaymentResponse createPaymentIntent(PaymentRequest request) throws StripeException {

                Services service = serviceRepository.findById(request.getServiceId())
                                .orElseThrow(() -> new RuntimeException(
                                                "Service not found with ID: " + request.getServiceId()));

                // Basic validation
                if (service.getTotalAmount() == null || service.getTotalAmount() <= 0) {
                        throw new RuntimeException("Invalid service amount");
                }

                if (service.getPayment() != null &&
                                service.getPayment().getStatus() == PaymentStatus.PAID) {
                        throw new RuntimeException("Payment already completed for this service");
                }

                // Stripe PaymentIntent
                PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                                .setAmount(Math.round(service.getTotalAmount() * 100))
                                .setCurrency("inr")
                                .setDescription("Service Payment ID: " + service.getId())
                                .setShipping(
                                                PaymentIntentCreateParams.Shipping.builder()
                                                                .setName(service.getUser() != null
                                                                                && service.getUser().getName() != null
                                                                                                ? service.getUser()
                                                                                                                .getName()
                                                                                                : "Customer")
                                                                .setAddress(
                                                                                PaymentIntentCreateParams.Shipping.Address
                                                                                                .builder()
                                                                                                .setLine1("123 Test Street") // Placeholder
                                                                                                                             // for
                                                                                                                             // demo/export
                                                                                                                             // compliance
                                                                                                .setCity("Mumbai")
                                                                                                .setCountry("IN")
                                                                                                .build())
                                                                .build())
                                .addPaymentMethodType("card")
                                .build();

                PaymentIntent paymentIntent = PaymentIntent.create(
                                params,
                                RequestOptions.builder()
                                                .setIdempotencyKey("service_payment_" + service.getId() + "_"
                                                                + System.currentTimeMillis())
                                                .build());

                // Create or update payment entity
                Payment payment = paymentRepository
                                .findByService(service)
                                .orElse(new Payment());

                System.out.println(
                                "Processing Payment entity. Existing ID: "
                                                + (payment.getId() != null ? payment.getId() : "New"));

                payment.setService(service);
                payment.setStripePaymentIntentId(paymentIntent.getId());
                payment.setAmount(service.getTotalAmount());
                payment.setStatus(PaymentStatus.PENDING);
                payment.setPaymentDate(LocalDateTime.now());

                paymentRepository.save(payment);
                System.out.println(
                                "Payment saved to DB. ID: " + payment.getId() + ", Intent ID: "
                                                + payment.getStripePaymentIntentId());

                return new PaymentResponse(
                                paymentIntent.getClientSecret(),
                                service.getTotalAmount(),
                                paymentIntent.getId());
        }

        @Transactional
        public void updatePaymentStatus(String paymentIntentId) throws StripeException {

                System.out.println("Verifying payment with Stripe for Intent: " + paymentIntentId);

                PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);

                Payment payment = paymentRepository.findByStripePaymentIntentId(paymentIntentId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Payment not found for intent: " + paymentIntentId));

                System.out.println("Stripe status: " + paymentIntent.getStatus());

                if ("succeeded".equals(paymentIntent.getStatus())) {
                        payment.setStatus(PaymentStatus.PAID);
                        payment.setPaymentDate(LocalDateTime.now());

                        // Sync with Service entity
                        if (payment.getService() != null) {
                                payment.getService().setPaymentStatus(PaymentStatus.PAID);
                        }

                        paymentRepository.save(payment);

                        System.out.println("Payment status updated to PAID in DB");
                } else {
                        System.out.println("Payment not successful yet. Status: " + paymentIntent.getStatus());
                }
        }

}
