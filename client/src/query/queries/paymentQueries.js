import { useMutation, useQuery } from "@tanstack/react-query";
import { PaymentApi } from "@/services/apiService";

export const useCreatePaymentIntent = (serviceId) => {
  return useQuery({
    queryKey: ['payment-intent', serviceId],
    queryFn: () => PaymentApi.createPaymentIntent({ serviceId }),
    enabled: !!serviceId,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useConfirmPaymentOnBackend = () => {
  return useMutation({
    mutationFn: (paymentIntentId) => PaymentApi.confirmPaymentOnBackend(paymentIntentId),
  });
};
