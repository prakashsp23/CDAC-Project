package com.backend.dtos.CustomerDTOs;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class CompletedServiceDto {

    private Long serviceId;
    private String serviceName;
    private LocalDateTime createdAt;
}
