package com.backend.service.AdminService;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.customException.ResourceNotFoundException;
import com.backend.dtos.AdminDTOs.MechanicDTO;
import com.backend.entity.Role;
import com.backend.entity.ServiceStatus;
import com.backend.entity.Services;
import com.backend.entity.User;
import com.backend.repository.UserRepository;
import com.backend.repository.Admin.AdminServicesRepository;

import lombok.RequiredArgsConstructor;


@Service
@Transactional
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
	
	private final AdminServicesRepository adminServicesRepository;
	private final UserRepository userRepository;

	@Override
	public List<Services> getAllServices() {
		
		return adminServicesRepository.findAll();
	}
	
	@Override
	public List<MechanicDTO> getAllMechanics() {

	    return userRepository.findByRole(Role.MECHANIC)
	        .stream()
	        .map(user -> {
	            MechanicDTO dto = new MechanicDTO();
	            dto.setMechanicId(user.getUserId());
	            dto.setName(user.getName());
	            return dto;
	        })
	        .toList();
	}

	/* ================= ACCEPT SERVICE ================= */
    // NEW → PENDING

    @Override
    public void acceptService(Long serviceId) {

        Services service = adminServicesRepository.findById(serviceId)
            .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

        service.setStatus(ServiceStatus.PENDING);

        adminServicesRepository.save(service);
    }

    /* ================= ASSIGN MECHANIC ================= */
    // PENDING → ONGOING

    @Override
    public void assignMechanic(Long serviceId, Long mechanicId) {

        Services service = adminServicesRepository.findById(serviceId)
            .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

        User mechanic = userRepository.findById(mechanicId)
            .orElseThrow(() -> new ResourceNotFoundException("Mechanic not found"));

        // Optional safety check
        if (mechanic.getRole() != Role.MECHANIC) {
            throw new IllegalArgumentException("Selected user is not a mechanic");
        }

        service.setMechanic(mechanic);
        service.setStatus(ServiceStatus.ONGOING);

        adminServicesRepository.save(service);
    }

    /* ================= REJECT / CANCEL SERVICE ================= */

    @Override
    public void rejectService(Long serviceId, String reason) {

        Services service = adminServicesRepository.findById(serviceId)
            .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

        service.setStatus(ServiceStatus.CANCELLED);
        service.setCancelledByAdmin(true);
        service.setCancellationReason(reason);
        service.setCancelledAt(LocalDateTime.now());

        adminServicesRepository.save(service);
    }

}
