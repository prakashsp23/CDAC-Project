package com.backend.dtos.PartDTOs;

import jakarta.validation.constraints.Min;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePartDto {

    private String partName;
    private String description;

    @Min(0)
    private Double unitPrice;

    @Min(0)
    private Integer stockQuantity;
}
