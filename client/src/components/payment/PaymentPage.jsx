import React, { useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { useCreatePaymentIntent } from "@/query/queries/paymentQueries";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, ShieldCheck, AlertCircle, Wallet } from "lucide-react";
import { useStripeTheme } from "@/hooks/use-stripe-theme";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function PaymentPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const serviceId = location.state?.serviceId;

    const appearance = useStripeTheme();

    // Use React Query for data fetching - handles loading, error, and caching automatically
    const { data, isLoading, error } = useCreatePaymentIntent(serviceId);

    // Derived state from query data
    const clientSecret = data?.clientSecret;
    const amount = data?.amount;

    // Show error if serviceId is missing from navigation state
    if (!serviceId) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <div className="bg-destructive/10 text-destructive p-6 rounded-lg max-w-md text-center">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                    <h2 className="text-lg font-bold mb-2">Invalid Access</h2>
                    <p className="mb-4">Please access this page from your services list.</p>
                    <Button onClick={() => navigate('/customers/myservices')}>Go Back</Button>
                </div>
            </div>
        );
    }

    const options = {
        clientSecret,
        appearance,
    };

    return (
        <main className="max-w-6xl mx-auto p-4 sm:p-8 min-h-[calc(100vh-100px)] flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
                    <p className="text-muted-foreground mt-1">
                        Secure payment gateway
                    </p>
                </div>
                <Button variant="ghost" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
            </header>

            {/* Horizontal Split Layout */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Side: Summary & Details (Takes 5/12 columns) */}
                <div className="lg:col-span-5 space-y-6">
                    <Card className="bg-muted/30 border-none shadow-none">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Wallet className="w-5 h-5" />
                                Order Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center py-4 border-b">
                                <span className="text-muted-foreground">Service ID</span>
                                <span className="font-mono font-bold">#{serviceId}</span>
                            </div>
                            <div className="bg-muted p-6 rounded-xl flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Total Amount</span>
                                <div className="flex items-baseline gap-1">
                                    {isLoading ? (
                                        <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
                                    ) : (
                                        <>
                                            <span className="text-4xl font-bold tracking-tight">₹{amount || 0}</span>
                                            <span className="text-sm text-muted-foreground font-medium">INR</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="text-xs text-muted-foreground pt-2">
                                * Includes all taxes and platform fees.
                            </div>
                        </CardContent>
                    </Card>

                    <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground p-4 bg-muted/20 rounded-lg">
                        <ShieldCheck className="w-5 h-5 text-green-600" />
                        <p>Your payment information is encrypted and processed securely.</p>
                    </div>
                </div>

                {/* Right Side: Payment Form (Takes 7/12 columns) */}
                <div className="lg:col-span-7">
                    <Card className="border shadow-lg overflow-hidden">
                        <CardHeader className="bg-muted/10 border-b">
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="w-5 h-5" />
                                Payment Method
                            </CardTitle>
                            <CardDescription>
                                Enter your card details securely
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="p-6 md:p-8">
                            {error ? (
                                <div className="flex items-center gap-3 text-destructive bg-destructive/10 p-4 rounded-lg border border-destructive/20 mb-6">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <p className="text-sm font-medium">{error.message || "Failed to initialize payment"}</p>
                                </div>
                            ) : clientSecret ? (
                                <Elements options={options} stripe={stripePromise}>
                                    <CheckoutForm amount={amount} serviceId={serviceId} />
                                </Elements>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-20 space-y-4">
                                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-muted border-t-foreground"></div>
                                    <p className="text-sm text-muted-foreground">Initializing...</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="lg:hidden flex items-center justify-center gap-2 text-xs text-muted-foreground mt-6">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Secured by Stripe</span>
                    </div>
                </div>

            </div>
        </main>
    );
}
