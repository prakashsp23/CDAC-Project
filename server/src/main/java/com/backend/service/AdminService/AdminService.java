package com.backend.service.AdminService;

import com.backend.dtos.AdminDTOs.AdminServiceRequestDTO;
import com.backend.dtos.AdminDTOs.MechanicDTO;

import java.util.List;

public interface AdminService {

	List<AdminServiceRequestDTO> getAllServices();

	List<MechanicDTO> getAllMechanics();

	void acceptService(Long serviceId);

	void assignMechanic(Long serviceId, Long mechanicId);

	void rejectService(Long serviceId, String reason);
}
