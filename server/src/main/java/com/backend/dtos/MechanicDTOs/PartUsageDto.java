package com.backend.dtos.MechanicDTOs;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PartUsageDto {
    private Long id;
    private Integer quantity;
    private Double priceAtTime;
}
