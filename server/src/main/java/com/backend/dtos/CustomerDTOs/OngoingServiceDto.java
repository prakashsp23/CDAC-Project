package com.backend.dtos.CustomerDTOs;

import java.time.LocalDateTime;

import com.backend.entity.ServiceStatus;

import lombok.Data;

@Data
public class OngoingServiceDto {

    private Long serviceId;
    private String serviceName;
    private String carBrand;
    private String carModel;
    private String carYear;
    private LocalDateTime createdAt;
    private ServiceStatus status;

}
