package com.backend.dtos.ServiceDTO;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateServiceDto {
	@NotNull(message = "Service catalog is required")
    private Long catalogId;

    @NotNull(message = "Car is required")
    private Long carId;

    @Size(max = 500, message = "Customer notes can be max 500 characters")
    private String customerNotes;
}
