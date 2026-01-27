package com.backend.service.MechanicService;

import java.util.List;

import com.backend.dtos.MechanicDTOs.WorkHistoryDto;
import com.backend.dtos.MechanicDTOs.AssignedJobsDto;
import com.backend.dtos.MechanicDTOs.PartDto;
import com.backend.dtos.MechanicDTOs.UpdateServiceDto;

public interface MechanicService {
     List<WorkHistoryDto> getWorkLogs(Long userId);

     List<AssignedJobsDto> getAssignedJobs(Long userId);

     List<PartDto> getAllParts();

     void updateServiceStatus(Long serviceId, String status);

     void addServiceNote(Long serviceId, Long userId, String noteContent);

     void updateService(Long serviceId, UpdateServiceDto updateDto);

}
