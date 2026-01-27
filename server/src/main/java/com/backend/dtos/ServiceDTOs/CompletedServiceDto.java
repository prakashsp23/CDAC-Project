package com.backend.dtos.ServiceDTOs;

import java.time.LocalDate;

import lombok.Data;

@Data
public class CompletedServiceDto {

    private Long serviceId;
    private String serviceName;
    private LocalDate createdOn;
}
