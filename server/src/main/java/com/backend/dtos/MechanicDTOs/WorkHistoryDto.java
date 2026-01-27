package com.backend.dtos.MechanicDTOs;

import lombok.Data;

import java.time.LocalDate;

@Data
public class WorkHistoryDto {
    private Long serviceId;

    private String vehicleName;

    private String serviceName;

    private LocalDate completionDate;

}
