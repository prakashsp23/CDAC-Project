package com.backend.dtos.PaymentDTOs;

import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class PaymentResponse {
    private String clientSecret;
    private Double amount;
    private String paymentIntentId;
}
