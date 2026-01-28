package com.backend.dtos.ServiceDTO;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateServiceDto {
    private String status;
    private List<PartUsageDto> parts;
}
