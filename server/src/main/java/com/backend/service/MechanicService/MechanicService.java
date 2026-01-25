package com.backend.service.MechanicService;
import java.util.List;

import com.backend.dtos.MechanicDTOs.WorkHistoryDto;
import com.backend.dtos.MechanicDTOs.AssignedJobsDto;
import com.backend.dtos.MechanicDTOs.PartDto;

public interface MechanicService {
     List<WorkHistoryDto> getWorkLogs(Long userId);
     
     List<AssignedJobsDto> getAssignedJobs(Long userId);
     
     List<PartDto> getAllParts();

     }
