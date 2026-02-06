package com.backend.dtos.ServiceDTO;

import lombok.Data;

import com.backend.dtos.PartDTOs.ServicePartDto;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class AssignedJobsDto {
    private Long id;

    private String customerName;

    private String customerPhone;

    private String carBrand;

    private String carModel;

    private String carPlate;

    private String licenseNumber;

    private String serviceName;

    private LocalDate serviceDate;

    private String status; // PENDING, IN_PROGRESS, COMPLETED

    private String notes; // Mechanic notes/updates

    private LocalDate createdOn;

    private List<ServicePartDto> usedParts;
}
