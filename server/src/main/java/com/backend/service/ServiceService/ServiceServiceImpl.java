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

    @Override
    public ServiceDto createService(CreateServiceDto createDto, Long userId) {
        // Validate and get user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Validate and get service catalog
        ServiceCatalog catalog = serviceCatalogRepository.findById(createDto.getCatalogId())
                .orElseThrow(() -> new ResourceNotFoundException("Service catalog not found with id: " + createDto.getCatalogId()));

        // Validate and get car
        Car car = carRepository.findById(createDto.getCarId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + createDto.getCarId()));

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

            service.setStatus(ServiceStatus.PENDING);

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

            Services service =serviceRepository.findById(serviceId)
                            .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

            service.setStatus(ServiceStatus.CANCELLED);
            service.setCancelledByAdmin(true);
            service.setCancellationReason(reason);
            service.setCancelledAt(LocalDateTime.now());

            serviceRepository.save(service);
    }
    
    
    
    
}
