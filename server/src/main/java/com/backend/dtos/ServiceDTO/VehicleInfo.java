package com.backend.dtos.ServiceDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleInfo {
    private Long id;
    private String brand;
    private String model;
    private String regNumber;
    private String licenseNumber;
}
