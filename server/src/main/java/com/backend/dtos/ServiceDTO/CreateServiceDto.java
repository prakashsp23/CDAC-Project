package com.backend.dtos.ServiceDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateServiceDto {
    private Long catalogId;
    private Long carId;
    private String customerNotes;
}
