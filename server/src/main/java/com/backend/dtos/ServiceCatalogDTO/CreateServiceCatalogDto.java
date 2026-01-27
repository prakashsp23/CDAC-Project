package com.backend.dtos.ServiceCatalogDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateServiceCatalogDto {
    private String serviceName;
    private String description;
    private String fullDetails;
    private Double basePrice;
}
