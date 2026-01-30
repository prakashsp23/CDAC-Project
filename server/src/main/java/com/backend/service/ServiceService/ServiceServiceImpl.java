package com.backend.service.ServiceService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.custom_exceptions.ResourceNotFoundException;
import com.backend.dtos.ServiceDTO.AdminServiceRequestDTO;
import com.backend.dtos.ServiceDTO.CreateServiceDto;
import com.backend.dtos.ServiceDTO.CustomerInfo;
import com.backend.dtos.ServiceDTO.MechanicInfo;
import com.backend.dtos.ServiceDTO.ServiceCatalogInfo;
import com.backend.dtos.ServiceDTO.ServiceDto;
import com.backend.dtos.ServiceDTO.VehicleInfo;
import com.backend.entity.Car;
import com.backend.entity.PaymentStatus;
import com.backend.entity.Role;
import com.backend.entity.ServiceCatalog;
import com.backend.entity.ServiceStatus;
import com.backend.entity.Services;
import com.backend.entity.User;
import com.backend.repository.CarRepository;
import com.backend.repository.ScRepository;
import com.backend.repository.ServiceRepository;
import com.backend.repository.UserRepository;
import com.backend.repository.MechanicNoteRepository;
import com.backend.repository.PartRepository;
import com.backend.repository.ServicePartRepository;
import com.backend.entity.MechanicNote;
import com.backend.entity.Part;
import com.backend.entity.ServicePart;
import com.backend.dtos.ServiceDTO.WorkHistoryDto;
import com.backend.dtos.ServiceDTO.AssignedJobsDto;
import com.backend.dtos.ServiceDTO.UpdateServiceDto;
import com.backend.dtos.ServiceDTO.PartUsageDto;
import java.util.ArrayList;

import org.modelmapper.ModelMapper;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ServiceServiceImpl implements ServiceService {

        private final ServiceRepository serviceRepository;
        private final ScRepository serviceCatalogRepository;
        private final CarRepository carRepository;
        private final UserRepository userRepository;
        private final ModelMapper modelMapper;

        // Mechanic related repositories
        private final PartRepository partRepo;
        private final MechanicNoteRepository mechanicNoteRepo;
        private final ServicePartRepository servicePartRepo;

        @Override
        public ServiceDto createService(CreateServiceDto createDto, Long userId) {
                // Validate and get user
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

                // Validate and get service catalog
                ServiceCatalog catalog = serviceCatalogRepository.findById(createDto.getCatalogId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Service catalog not found with id: " + createDto.getCatalogId()));

                // Validate and get car
                Car car = carRepository.findById(createDto.getCarId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Vehicle not found with id: " + createDto.getCarId()));

                // Verify that the car belongs to the user
                if (car.getOwner() == null || !car.getOwner().getId().equals(userId)) {
                        throw new SecurityException("This vehicle does not belong to you");
                }

                // Create new service
                Services service = new Services();
                service.setCatalog(catalog);
                service.setUser(user);
                service.setCar(car);
                service.setStatus(ServiceStatus.PENDING);
                service.setPaymentStatus(PaymentStatus.PENDING);
                service.setCustomerNotes(createDto.getCustomerNotes());

                // Set initial pricing
                service.setPartsTotal(0.0);
                service.setTotalAmount(catalog.getBasePrice());

                // Cancellation fields default to null/false
                service.setCancelledByAdmin(false);

                Services savedService = serviceRepository.save(service);
                return convertToDto(savedService);
        }

        @Override
        public List<AdminServiceRequestDTO> getAllServices() {
                return serviceRepository.findAll()
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
        public List<ServiceDto> getMyServices(Long userId) {
                List<Services> services = serviceRepository.findByUser_Id(userId);
                return services.stream()
                                .map(this::convertToDto)
                                .collect(Collectors.toList());
        }

        @Override
        public ServiceDto getServiceById(Long id) {
                Services service = serviceRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + id));
                return convertToDto(service);
        }

        private ServiceDto convertToDto(Services service) {
                ServiceDto dto = modelMapper.map(service, ServiceDto.class);

                // Map nested objects
                if (service.getCatalog() != null) {
                        dto.setCatalog(modelMapper.map(service.getCatalog(), ServiceCatalogInfo.class));
                }

                if (service.getUser() != null) {
                        dto.setCustomer(modelMapper.map(service.getUser(), CustomerInfo.class));
                }

                if (service.getCar() != null) {
                        dto.setVehicle(modelMapper.map(service.getCar(), VehicleInfo.class));
                }

                if (service.getMechanic() != null) {
                        dto.setMechanic(modelMapper.map(service.getMechanic(), MechanicInfo.class));
                }

                return dto;
        }

        @Override
        public void acceptService(Long serviceId) {

                Services service = serviceRepository.findById(serviceId)
                                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

                service.setStatus(ServiceStatus.ACCEPTED);

                serviceRepository.save(service);
        }

        @Override
        public void assignMechanic(Long serviceId, Long mechanicId) {

                Services service = serviceRepository.findById(serviceId)
                                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

                User mechanic = userRepository.findById(mechanicId)
                                .orElseThrow(() -> new ResourceNotFoundException("Mechanic not found"));

                // Optional safety check
                if (mechanic.getRole() != Role.MECHANIC) {
                        throw new IllegalArgumentException("Selected user is not a mechanic");
                }

                service.setMechanic(mechanic);
                service.setStatus(ServiceStatus.ONGOING);

                serviceRepository.save(service);
        }

        @Override
        public void rejectService(Long serviceId, String reason) {

                Services service = serviceRepository.findById(serviceId)
                                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

                service.setStatus(ServiceStatus.CANCELLED);
                service.setCancelledByAdmin(true);
                service.setCancellationReason(reason);
                service.setCancelledAt(LocalDateTime.now());

                serviceRepository.save(service);
        }

        @Override
        public List<WorkHistoryDto> getMechanicWorkHistory(Long mechanicId) {
                List<WorkHistoryDto> workHistory = new ArrayList<>();
                List<Services> services = serviceRepository.findByStatusAndMechanic_Id(ServiceStatus.COMPLETED,
                                mechanicId);

                for (Services s : services) {
                        WorkHistoryDto dto = new WorkHistoryDto();
                        dto.setId(s.getId());
                        dto.setVehicleName(s.getCar().getBrand() + " " + s.getCar().getModel());
                        dto.setServiceName(s.getCatalog().getServiceName());
                        dto.setCompletionDate(s.getCompletionDate());
                        workHistory.add(dto);
                }
                return workHistory;
        }

        @Override
        public List<AssignedJobsDto> getMechanicAssignedJobs(Long mechanicId) {
                if (mechanicId == null) {
                        return new ArrayList<>();
                }

                List<AssignedJobsDto> assignedJobs = new ArrayList<>();

                List<Services> services = serviceRepository.findByMechanic_IdAndStatus(mechanicId,
                                ServiceStatus.ONGOING);

                for (Services s : services) {
                        AssignedJobsDto dto = new AssignedJobsDto();
                        dto.setId(s.getId());
                        dto.setCustomerName(s.getUser().getName());
                        dto.setCustomerPhone(s.getUser().getPhone());
                        dto.setCarBrand(s.getCar().getBrand());
                        dto.setCarModel(s.getCar().getModel());
                        dto.setCarPlate(s.getCar().getRegNumber());
                        dto.setServiceName(s.getCatalog().getServiceName());
                        dto.setServiceDate(s.getCreatedOn());
                        dto.setStatus(s.getStatus().toString());
                        dto.setNotes(s.getCustomerNotes());
                        dto.setCreatedOn(s.getCreatedOn());

                        assignedJobs.add(dto);
                }

                return assignedJobs;
        }

        @Override
        public void updateServiceExecution(Long serviceId, UpdateServiceDto updateDto) {
                Services service = serviceRepository.findById(serviceId)
                                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

                if (updateDto.getStatus() != null && !updateDto.getStatus().isEmpty()) {
                        try {
                                ServiceStatus newStatus = ServiceStatus.valueOf(updateDto.getStatus().toUpperCase());
                                service.setStatus(newStatus);
                        } catch (IllegalArgumentException e) {
                                throw new IllegalArgumentException("Invalid status: " + updateDto.getStatus());
                        }
                }

                List<PartUsageDto> parts = updateDto.getParts();
                if (parts != null && !parts.isEmpty()) {
                        double currentPartsTotal = service.getPartsTotal() != null ? service.getPartsTotal() : 0.0;

                        for (PartUsageDto partData : parts) {
                                Long partId = partData.getId();
                                Integer quantity = partData.getQuantity();

                                Part part = partRepo.findById(partId)
                                                .orElseThrow(() -> new ResourceNotFoundException(
                                                                "Part not found: " + partId));

                                if (part.getStockQuantity() < quantity) {
                                        throw new IllegalArgumentException(
                                                        "Insufficient stock for part: " + part.getPartName());
                                }

                                part.setStockQuantity(part.getStockQuantity() - quantity);
                                partRepo.save(part);

                                ServicePart servicePart = new ServicePart();
                                servicePart.setService(service);
                                servicePart.setPart(part);
                                servicePart.setQuantity(quantity);

                                Double finalPrice = partData.getPriceAtTime() != null ? partData.getPriceAtTime()
                                                : part.getUnitPrice();
                                servicePart.setPriceAtTime(finalPrice);

                                servicePartRepo.save(servicePart);

                                currentPartsTotal += (finalPrice * quantity);
                        }
                        service.setPartsTotal(currentPartsTotal);
                }

                serviceRepository.save(service);
        }

        @Override
        public void addServiceNote(Long serviceId, Long userId, String noteContent) {
                Services service = serviceRepository.findById(serviceId)
                                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

                User mechanic = new User();
                mechanic.setId(userId);

                MechanicNote note = new MechanicNote();
                note.setService(service);
                note.setMechanic(mechanic);
                note.setNotes(noteContent);

                mechanicNoteRepo.save(note);
        }

}
