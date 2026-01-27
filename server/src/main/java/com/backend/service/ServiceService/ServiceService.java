package com.backend.service.ServiceService;

import java.util.List;

import com.backend.dtos.ServiceDTO.AdminServiceRequestDTO;
import com.backend.dtos.ServiceDTO.CreateServiceDto;
import com.backend.dtos.ServiceDTO.ServiceDto;

public interface ServiceService {

    public ServiceDto createService(CreateServiceDto createDto, Long userId);

    public List<AdminServiceRequestDTO> getAllServices();

    public List<ServiceDto> getMyServices(Long userId);

    public ServiceDto getServiceById(Long id);

	public void acceptService(Long serviceId);
	
	void assignMechanic(Long serviceId, Long mechanicId);

	void rejectService(Long serviceId, String reason);

}
