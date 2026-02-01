package com.backend.dtos.PartDTOs;


import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreatePartDto {

    @NotBlank
    private String partName;

    private String description;

    @NotNull
    @Min(0)
    private Double unitPrice;

    @NotNull
    @Min(0)
    private Integer stockQuantity;
}
