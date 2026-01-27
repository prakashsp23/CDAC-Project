package com.backend.dtos.ServiceCatalogDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceCatalogDto {
    private Long id;
    private String serviceName;
    private String description;
    private String fullDetails;
    private Double basePrice;
}
