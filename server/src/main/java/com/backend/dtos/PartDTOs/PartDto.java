package com.backend.dtos.PartDTOs;

import lombok.Data;

import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PartDto {

    private Long id;
    private String partName;
    private String description;
    private Double unitPrice;
    private Integer stockQuantity;
    private String status; // derived (In Stock / Out of Stock)
}