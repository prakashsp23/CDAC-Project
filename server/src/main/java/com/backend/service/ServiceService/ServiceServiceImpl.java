package com.backend.service.ServiceService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.custom_exceptions.ResourceNotFoundException;
import com.backend.dtos.PartDTOs.ServicePartDto;
import com.backend.dtos.ServiceDTO.AdminServiceRequestDTO;
import com.backend.dtos.ServiceDTO.CreateServiceDto;
import com.backend.dtos.ServiceDTO.CustomerInfo;
import com.backend.dtos.ServiceDTO.MechanicInfo;
import com.backend.dtos.ServiceDTO.ServiceCatalogInfo;
import com.backend.dtos.ServiceDTO.ServiceDto;
import com.backend.dtos.ServiceDTO.VehicleInfo;
import com.backend.entity.Car;
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

import com.backend.repository.FeedbackRepository;

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
        private final FeedbackRepository feedbackRepo;

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

                                        dto.setLicenseNumber(
                                                        service.getCar() != null ? service.getCar().getLicenseNumber()
                                                                        : null);

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

                // Set hasFeedback flag
                dto.setHasFeedback(feedbackRepo.existsByService(service));

                // Populate used parts
                List<ServicePart> parts = servicePartRepo.findByService_Id(service.getId());
                List<ServicePartDto> partsDto = parts.stream()
                                .map(sp -> ServicePartDto.builder()
                                                .id(sp.getId())
                                                .partId(sp.getPart().getId())
                                                .partName(sp.getPart().getPartName())
                                                .quantity(sp.getQuantity())
                                                .priceAtTime(sp.getPriceAtTime())
                                                .totalCost(sp.getPriceAtTime() * sp.getQuantity())
                                                .build())
                                .collect(Collectors.toList());
                dto.setUsedParts(partsDto);

                // Populate mechanic notes
                List<MechanicNote> notes = mechanicNoteRepo.findByService_Id(service.getId());
                if (!notes.isEmpty()) {
                        dto.setMechanicNotes(notes.get(notes.size() - 1).getNotes());
                } else {
                        dto.setMechanicNotes("");
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
        public void rejectService(Long serviceId, String reason, String rescheduledDate) {

                Services service = serviceRepository.findById(serviceId)
                                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

                service.setStatus(ServiceStatus.CANCELLED);
                service.setCancelledByAdmin(true);
                service.setCancellationReason(reason);
                service.setCancelledAt(LocalDateTime.now());

                if (rescheduledDate != null && !rescheduledDate.trim().isEmpty()) {
                        service.setRescheduledDate(java.time.LocalDate.parse(rescheduledDate));
                }

                serviceRepository.save(service);
        }

        @Override
        public void acceptReschedule(Long serviceId, Long userId) {
                Services service = serviceRepository.findById(serviceId)
                                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

                // Check if the service belongs to the current user
                if (!service.getUser().getId().equals(userId)) {
                        throw new SecurityException("You can only accept reschedule for your own services");
                }

                if (service.getStatus() != ServiceStatus.CANCELLED) {
                        throw new IllegalStateException("Service is not in cancelled state");
                }

                if (service.getRescheduledDate() == null) {
                        throw new IllegalStateException("No reschedule date proposed for this service");
                }

                // Update service details
                service.setBookingDate(service.getRescheduledDate());
                service.setStatus(ServiceStatus.ACCEPTED); // Or PENDING based on flow, but ACCEPTED makes sense for a
                                                           // re-booking

                // Clear cancellation details
                service.setRescheduledDate(null);
                service.setCancelledByAdmin(null);
                service.setCancellationReason(null);
                service.setCancelledAt(null);

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
                        dto.setLicenseNumber(s.getCar().getLicenseNumber());
                        dto.setServiceName(s.getCatalog().getServiceName());
                        dto.setServiceDate(s.getCreatedOn());
                        dto.setStatus(s.getStatus().toString());
                        // Fetch mechanic notes
                        java.util.List<MechanicNote> notes = mechanicNoteRepo.findByService_Id(s.getId());
                        if (!notes.isEmpty()) {
                                dto.setNotes(notes.get(notes.size() - 1).getNotes());
                        } else {
                                dto.setNotes("");
                        }
                        dto.setCreatedOn(s.getCreatedOn());

                        // Fetch used parts
                        List<ServicePart> parts = servicePartRepo.findByService_Id(s.getId());
                        List<ServicePartDto> partsDto = parts.stream()
                                        .map(sp -> ServicePartDto.builder()
                                                        .id(sp.getId())
                                                        .partId(sp.getPart().getId())
                                                        .partName(sp.getPart().getPartName())
                                                        .quantity(sp.getQuantity())
                                                        .priceAtTime(sp.getPriceAtTime())
                                                        .totalCost(sp.getPriceAtTime() * sp.getQuantity())
                                                        .build())
                                        .collect(Collectors.toList());
                        dto.setUsedParts(partsDto);

                        assignedJobs.add(dto);
                }

                return assignedJobs;
        }

        @Override
        public void updateServiceExecution(Long serviceId, UpdateServiceDto updateDto, Long mechanicId) {
                Services service = serviceRepository.findById(serviceId)
                                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

                // SECURITY: Verify mechanic is assigned to this service
                if (service.getMechanic() == null || !service.getMechanic().getId().equals(mechanicId)) {
                        throw new SecurityException("You are not assigned to this service");
                }

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

                                // Check if part already exists for this service
                                java.util.Optional<ServicePart> existingPartOpt = servicePartRepo
                                                .findByService_IdAndPart_Id(service.getId(), part.getId());

                                Double partPrice = part.getUnitPrice();

                                if (existingPartOpt.isPresent()) {
                                        ServicePart existingPart = existingPartOpt.get();
                                        existingPart.setQuantity(existingPart.getQuantity() + quantity);
                                        // We keep the original priceAtTime or should we update?
                                        // Keeping original to avoid changing history of past added items,
                                        // effectively averaging would require more complex logic.
                                        // For now, we just update quantity.
                                        servicePartRepo.save(existingPart);
                                } else {
                                        ServicePart servicePart = new ServicePart();
                                        servicePart.setService(service);
                                        servicePart.setPart(part);
                                        servicePart.setQuantity(quantity);
                                        servicePart.setPriceAtTime(partPrice);
                                        servicePartRepo.save(servicePart);
                                }

                                currentPartsTotal += (partPrice * quantity);
                        }
                        service.setPartsTotal(currentPartsTotal);

                        // SECURITY FIX: Recalculate total amount (basePrice + parts)
                        // Ensures accurate billing
                        Double basePrice = service.getCatalog() != null ? service.getCatalog().getBasePrice() : 0.0;
                        service.setTotalAmount(basePrice + currentPartsTotal);
                }

                serviceRepository.save(service);
        }

        @Override
        public void addServiceNote(Long serviceId, Long userId, String noteContent) {
                Services service = serviceRepository.findById(serviceId)
                                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

                // SECURITY: Verify mechanic is assigned to this service
                if (service.getMechanic() == null || !service.getMechanic().getId().equals(userId)) {
                        throw new SecurityException("You are not assigned to this service");
                }

                java.util.List<MechanicNote> existingNotes = mechanicNoteRepo.findByService_Id(serviceId);
                MechanicNote note;

                if (existingNotes.isEmpty()) {
                        note = new MechanicNote();
                        note.setService(service);
                        User mechanic = new User();
                        mechanic.setId(userId);
                        note.setMechanic(mechanic);
                } else {
                        // If multiple notes exist (legacy data), update the last one
                        note = existingNotes.get(existingNotes.size() - 1);
                }

                note.setNotes(noteContent);
                mechanicNoteRepo.save(note);
        }

        @Override
        public List<ServiceDto> getMyCompletedServicesWithoutFeedback(Long userId) {
                // Return all completed services. Frontend will filter based on hasFeedback
                // flag.
                List<Services> services = serviceRepository.findByStatusInAndUser_Id(List.of(ServiceStatus.COMPLETED),
                                userId);
                List<ServiceDto> completedServices = new ArrayList<>();
                for (Services service : services) {
                        completedServices.add(convertToDto(service));
                }
                return completedServices;
        }

}
