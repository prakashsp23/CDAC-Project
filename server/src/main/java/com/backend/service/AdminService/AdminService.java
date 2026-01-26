package com.backend.service.AdminService;

import com.backend.dtos.AdminDTOs.MechanicDTO;
import com.backend.entity.Services;
import java.util.List;

public interface AdminService {

    List<Services> getAllServices();
    List<MechanicDTO> getAllMechanics();
	void acceptService(Long serviceId);
	void assignMechanic(Long serviceId, Long mechanicId);
	void rejectService(Long serviceId, String reason);
}
