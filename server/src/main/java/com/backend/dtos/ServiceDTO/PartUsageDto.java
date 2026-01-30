package com.backend.dtos.ServiceDTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PartUsageDto {
    @NotNull(message = "Part ID is required")
    private Long id;
    
    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;
    
    // priceAtTime removed - system will use current part price from database
    // This prevents price manipulation by mechanics
}
