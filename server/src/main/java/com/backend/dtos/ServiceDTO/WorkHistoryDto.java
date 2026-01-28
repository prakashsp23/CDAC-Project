package com.backend.dtos.ServiceDTO;

import lombok.Data;

import java.time.LocalDate;

@Data
public class WorkHistoryDto {
    private Long id;

    private String vehicleName;

    private String serviceName;

    private LocalDate completionDate;

}
