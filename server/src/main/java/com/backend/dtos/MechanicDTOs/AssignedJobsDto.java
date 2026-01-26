package com.backend.dtos.MechanicDTOs;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class AssignedJobsDto {
    private Long serviceId;
    
    private String customerName;
    
    private String customerPhone;
    
    private String carBrand;
    
    private String carModel;
    
    private String carPlate;
    
    private String serviceName;
    
    private LocalDate serviceDate;
    
    private String status; // PENDING, IN_PROGRESS, COMPLETED
    
    private String notes; // Mechanic notes/updates
    
    private LocalDateTime createdAt;
}
