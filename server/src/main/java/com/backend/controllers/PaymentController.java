package com.backend.controllers;

import com.backend.dtos.PaymentDTOs.PaymentRequest;
import com.backend.dtos.PaymentDTOs.PaymentResponse;
import com.backend.services.PaymentService;
import com.stripe.exception.StripeException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Adjust as needed
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-payment-intent")
    public ResponseEntity<PaymentResponse> createPaymentIntent(@RequestBody PaymentRequest paymentRequest)
            throws StripeException {
        PaymentResponse response = paymentService.createPaymentIntent(paymentRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/confirm-payment")
    public ResponseEntity<?> confirmPayment(@RequestBody Map<String, String> payload) {
        String paymentIntentId = payload.get("paymentIntentId");

        try {
            paymentService.updatePaymentStatus(paymentIntentId);
            return ResponseEntity.ok().body(Map.of("message", "Payment status updated"));
        } catch (StripeException e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to verify with Stripe: " + e.getMessage()));
        }
    }
}
