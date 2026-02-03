package com.backend.dtos.ServiceDTO;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceDto {
    private Long id;

    // Nested objects
    private ServiceCatalogInfo catalog;
    private CustomerInfo customer;
    private VehicleInfo vehicle;
    private MechanicInfo mechanic;

    // Service details
    private String status;
    private Double partsTotal;
    private Double totalAmount;
    private String customerNotes;

    // Payment
    private String paymentStatus;

    // Feedback
    private boolean hasFeedback;

    // Cancellation
    private Boolean cancelledByAdmin;
    private String cancellationReason;
    private LocalDateTime cancelledAt;

    // Timestamps
    private LocalDate createdOn;
    private LocalDateTime lastUpdated;
    private LocalDate bookingDate;
    private LocalDate completionDate;
    private LocalDate rescheduledDate;
}
