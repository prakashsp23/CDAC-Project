package com.backend.dtos.PartDTOs;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServicePartDto {
    private Long id;
    private Long serviceId;
    private String serviceName; // from ServiceCatalog
    private String customerName; // from User (Customer)
    private Long partId;
    private String partName;
    private Integer quantity;
    private Double priceAtTime;
    private Double totalCost;
    private LocalDate serviceDate;
}
