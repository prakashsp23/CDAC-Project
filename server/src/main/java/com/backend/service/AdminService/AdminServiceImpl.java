package com.backend.service.AdminService;

import java.time.LocalDateTime;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.customException.ResourceNotFoundException;
import com.backend.dtos.AdminDTOs.AdminFeedbackDTO;
import com.backend.dtos.AdminDTOs.AdminServiceRequestDTO;
import com.backend.dtos.AdminDTOs.MechanicDTO;
import com.backend.entity.Role;
import com.backend.entity.ServiceStatus;
import com.backend.entity.Services;
import com.backend.entity.User;
import com.backend.repository.UserRepository;
import com.backend.repository.Admin.AdminServicesRepository;
import com.backend.repository.Customer.FeedbackRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

        private final AdminServicesRepository adminServicesRepository;
        private final UserRepository userRepository;
        private final FeedbackRepository feedbackRepository;
        private final ModelMapper modelMapper;

        @Override
        public List<AdminServiceRequestDTO> getAllServices() {
                return adminServicesRepository.findAll()
                                .stream()
                                .map(service -> {
                                        AdminServiceRequestDTO dto = modelMapper.map(service,
                                                        AdminServiceRequestDTO.class);

                                        dto.setStatus(service.getStatus().name());

                                        dto.setCustomerName(
                                                        service.getUser() != null ? service.getUser().getName() : null);

                                        dto.setCarBrand(
                                                        service.getCar() != null ? service.getCar().getBrand() : null);

                                        dto.setCarModel(
                                                        service.getCar() != null ? service.getCar().getModel() : null);

                                        dto.setServiceName(
                                                        service.getCatalog() != null
                                                                        ? service.getCatalog().getServiceName()
                                                                        : null);

                                        dto.setMechanicName(
                                                        service.getMechanic() != null
                                                                        ? service.getMechanic().getName()
                                                                        : "Unassigned");

                                        return dto;
                                })
                                .toList();
        }

        @Override
        public List<MechanicDTO> getAllMechanics() {

                return userRepository.findByRole(Role.MECHANIC)
                                .stream()
                                .map(user -> {
                                        MechanicDTO dto = new MechanicDTO();
                                        dto.setMechanicId(user.getId());
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

        @Override
        public List<AdminFeedbackDTO> getAllFeedback() {
                return feedbackRepository.findAll()
                                .stream()
                                .map(f -> {
                                        AdminFeedbackDTO dto = modelMapper.map(f, AdminFeedbackDTO.class);

                                        dto.setServiceId(f.getService().getId());
                                        dto.setServiceType(f.getService().getCatalog().getServiceName());
                                        dto.setCustomerName(f.getUser().getName());
                                        dto.setMechanicName(
                                                        f.getService().getMechanic() != null
                                                                        ? f.getService().getMechanic().getName()
                                                                        : null);

                                        return dto;
                                })
                                .toList();
        }

}
