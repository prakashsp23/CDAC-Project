package com.backend.service.MechanicService;
import java.util.List;

import com.backend.dtos.MechanicDTOs.WorkHistoryDto;

public interface MechanicService {
     List<WorkHistoryDto> getWorkLogs(Long userId);
     
}
