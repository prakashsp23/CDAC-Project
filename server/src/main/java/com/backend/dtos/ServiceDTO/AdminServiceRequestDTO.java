package com.backend.dtos.ServiceDTO;

import java.time.LocalDateTime;

import com.backend.entity.PaymentStatus;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AdminServiceRequestDTO {

    private Long Id;
    private String status;

    private String customerName;

    private String carBrand;
    private String carModel;
    private String licenseNumber;

    private String serviceName;

    private String mechanicName;

    private Double partsTotal;
    private Double totalAmount;

    private PaymentStatus paymentStatus;

    private LocalDateTime createdAt;
}
