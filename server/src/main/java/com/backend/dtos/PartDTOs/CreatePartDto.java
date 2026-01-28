
package com.backend.dtos.PartDTOs;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreatePartDto {

    @NotBlank
    private String name;

    private String description;

    @NotNull
    @Min(0)
    private Double price;

    @NotNull
    @Min(0)
    private Integer stock;
}
