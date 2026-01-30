package com.backend.service.ServiceService;

import java.util.List;

import com.backend.dtos.ServiceDTO.AdminServiceRequestDTO;
import com.backend.dtos.ServiceDTO.CreateServiceDto;
import com.backend.dtos.ServiceDTO.ServiceDto;
import com.backend.dtos.ServiceDTO.WorkHistoryDto;
import com.backend.dtos.ServiceDTO.AssignedJobsDto;
import com.backend.dtos.ServiceDTO.UpdateServiceDto;

public interface ServiceService {

    public ServiceDto createService(CreateServiceDto createDto, Long userId);

    public List<AdminServiceRequestDTO> getAllServices();

    public List<ServiceDto> getMyServices(Long userId);

    public ServiceDto getServiceById(Long id);

    public void acceptService(Long serviceId);

    void assignMechanic(Long serviceId, Long mechanicId);

    void rejectService(Long serviceId, String reason);

    // Mechanic related methods
    List<WorkHistoryDto> getMechanicWorkHistory(Long mechanicId);

    List<AssignedJobsDto> getMechanicAssignedJobs(Long mechanicId);

    void updateServiceExecution(Long serviceId, UpdateServiceDto updateDto, Long mechanicId);

    void addServiceNote(Long serviceId, Long userId, String noteContent);

}
