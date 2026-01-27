package com.backend.dtos.MechanicDTOs;

import lombok.Data;

@Data
public class PartDto {
    private String partName;
    private Double unitPrice;
    private Integer stockQuantity;
}
