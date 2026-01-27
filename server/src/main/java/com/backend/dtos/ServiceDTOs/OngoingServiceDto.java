package com.backend.dtos.ServiceDTOs;

import java.time.LocalDate;

import com.backend.entity.ServiceStatus;

import lombok.Data;

@Data
public class OngoingServiceDto {

    private Long serviceId;
    private String serviceName;
    private String carBrand;
    private String carModel;
    private String carYear;
    private LocalDate createdOn;
    private ServiceStatus status;

}
