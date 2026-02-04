import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { PaymentApi } from '@/services/apiService';
import { serviceKeys } from '@/query/queries/serviceQueries';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

// eslint-disable-next-line react/prop-types
export default function CheckoutForm({ amount, serviceId }) {
    const stripe = useStripe();
    const elements = useElements();

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        try {
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/payment-success`, // Adjust as needed or handle inline
                },
                redirect: "if_required",
            });

            if (error) {
                toast.error(error.message);
            } else if (paymentIntent && paymentIntent.status === "succeeded") {
                toast.success("Payment successful!");

                // Update backend status
                try {
                    // Call api with updated backend signature
                    await PaymentApi.confirmPaymentOnBackend(paymentIntent.id);

                    // Invalidate keys to refresh data
                    await queryClient.invalidateQueries({ queryKey: serviceKeys.myServices() });
                    await queryClient.invalidateQueries({ queryKey: serviceKeys.detail(String(serviceId)) });

                    navigate(`/customers/services/${serviceId}`); // Redirect to Service Details page
                } catch (err) {
                    console.error("Failed to update backend status", err);
                    toast.error("Payment successful but failed to update order status. Please contact support.");
                }
            } else {
                // Unexpected state, maybe processing
                console.log("Unexpected payment state:", paymentIntent);
            }
        } catch (err) {
            console.error("Payment confirmation failed:", err);
            toast.error("An unexpected error occurred during payment. Please try again.");
        }

        setIsLoading(false);
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="p-1">
                <PaymentElement id="payment-element" />
            </div>

            <Button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold shadow-lg shadow-black/5 transition-all hover:scale-[1.01] active:scale-[0.99] rounded-lg"
            >
                <div className="flex items-center justify-center gap-2">
                    {isLoading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                            <span>Processing...</span>
                        </>
                    ) : (
                        <>
                            <Lock className="w-4 h-4" />
                            <span>Pay ₹{amount}</span>
                        </>
                    )}
                </div>
            </Button>


        </form>
    );
}
