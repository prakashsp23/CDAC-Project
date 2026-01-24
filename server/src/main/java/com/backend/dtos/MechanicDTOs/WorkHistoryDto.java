package com.backend.dtos.MechanicDTOs;

import org.springframework.cglib.core.Local;

import lombok.Data;

import java.time.LocalDate;

@Data
public class WorkHistoryDto {
    private Long serviceId;

    private String vehicleName;

    private String serviceDone;

    private LocalDate completionDate;

    private Integer rating;

    private String feedback;
}
