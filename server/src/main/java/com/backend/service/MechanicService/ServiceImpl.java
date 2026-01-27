package com.backend.service.MechanicService;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.backend.dtos.MechanicDTOs.WorkHistoryDto;
import com.backend.dtos.MechanicDTOs.AssignedJobsDto;
import com.backend.dtos.MechanicDTOs.PartDto;

import com.backend.entity.ServiceStatus;
import com.backend.entity.Services;
import com.backend.entity.Part;
import com.backend.repository.MechanicNoteRepository;
import com.backend.repository.PartRepository;
import com.backend.repository.ServicePartRepository;
import com.backend.repository.ServiceRepository;
import com.backend.entity.User;
import com.backend.entity.MechanicNote;
import com.backend.entity.ServicePart;

import com.backend.dtos.MechanicDTOs.UpdateServiceDto;
import com.backend.dtos.MechanicDTOs.PartUsageDto;

import jakarta.persistence.EntityNotFoundException;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ServiceImpl implements MechanicService {

    private final ServiceRepository serviceRepo;
    private final PartRepository partRepo;
    private final MechanicNoteRepository mechanicNoteRepo;
    private final ServicePartRepository servicePartRepo;
    private final ModelMapper modelMapper;

    @Override
    public List<WorkHistoryDto> getWorkLogs(Long userId) {
        List<WorkHistoryDto> workHistory = new ArrayList<>();
        List<Services> services = serviceRepo.findByStatusAndMechanic_Id(ServiceStatus.COMPLETED, userId);

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
    public List<AssignedJobsDto> getAssignedJobs(Long userId) {
        if (userId == null) {
            return new ArrayList<>();
        }

        List<AssignedJobsDto> assignedJobs = new ArrayList<>();

        // Get all services assigned to this mechanic that are ongoing
        List<Services> services = serviceRepo.findByMechanic_IdAndStatus(userId, ServiceStatus.ONGOING);

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
    public List<PartDto> getAllParts() {
        List<PartDto> partDtos = new ArrayList<>();
        List<Part> parts = partRepo.findAll();

        for (Part p : parts) {
            PartDto dto = modelMapper.map(p, PartDto.class);
            partDtos.add(dto);
        }

        return partDtos;
    }

    @Override
    public void updateServiceStatus(Long serviceId, String status) {
        Services service = serviceRepo.findById(serviceId)
                .orElseThrow(() -> new EntityNotFoundException("Service not found"));

        try {
            ServiceStatus newStatus = ServiceStatus.valueOf(status.toUpperCase());
            service.setStatus(newStatus);
            serviceRepo.save(service);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + status);
        }
    }

    @Override
    public void addServiceNote(Long serviceId, Long userId, String noteContent) {
        Services service = serviceRepo.findById(serviceId)
                .orElseThrow(() -> new EntityNotFoundException("Service not found"));

        // Create user with ID only (proxy) since we just need to link relation
        User mechanic = new User();
        mechanic.setId(userId);

        MechanicNote note = new MechanicNote();
        note.setService(service);
        note.setMechanic(mechanic);
        note.setNotes(noteContent);

        mechanicNoteRepo.save(note);
    }

    @Override
    public void updateService(Long serviceId, UpdateServiceDto updateDto) {
        Services service = serviceRepo.findById(serviceId)
                .orElseThrow(() -> new EntityNotFoundException("Service not found"));

        // 1. Update Status
        if (updateDto.getStatus() != null && !updateDto.getStatus().isEmpty()) {
            try {
                ServiceStatus newStatus = ServiceStatus.valueOf(updateDto.getStatus().toUpperCase());
                service.setStatus(newStatus);
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid status: " + updateDto.getStatus());
            }
        }

        // 2. Process Parts
        List<PartUsageDto> parts = updateDto.getParts();
        if (parts != null && !parts.isEmpty()) {
            double currentPartsTotal = service.getPartsTotal() != null ? service.getPartsTotal() : 0.0;

            for (PartUsageDto partData : parts) {
                Long partId = partData.getId();
                Integer quantity = partData.getQuantity();

                Part part = partRepo.findById(partId)
                        .orElseThrow(() -> new EntityNotFoundException("Part not found: " + partId));

                if (part.getStockQuantity() < quantity) {
                    throw new RuntimeException("Insufficient stock for part: " + part.getPartName());
                }

                // Deduct stock
                part.setStockQuantity(part.getStockQuantity() - quantity);
                partRepo.save(part);

                // Record usage
                ServicePart servicePart = new ServicePart();
                servicePart.setService(service);
                servicePart.setPart(part);
                servicePart.setQuantity(quantity);

                // Use price from DTO if available, otherwise use current part price
                Double finalPrice = partData.getPriceAtTime() != null ? partData.getPriceAtTime() : part.getUnitPrice();
                servicePart.setPriceAtTime(finalPrice);

                servicePartRepo.save(servicePart);

                // Update total cost
                currentPartsTotal += (finalPrice * quantity);

            }
            service.setPartsTotal(currentPartsTotal);
        }

        serviceRepo.save(service);
    }

}
