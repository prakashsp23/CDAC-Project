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
import com.backend.repository.Mechanic.ServiceRepo;
import com.backend.repository.Mechanic.PartRepo;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;


@Service
@Transactional
@RequiredArgsConstructor
public class ServiceImpl implements MechanicService {

    private final ServiceRepo serviceRepo;
    private final PartRepo partRepo;
    private final ModelMapper modelMapper;


    @Override
    public List<WorkHistoryDto> getWorkLogs(Long userId) {
        List<WorkHistoryDto> workHistory = new ArrayList<>();
        List<Services> services = serviceRepo.findByStatusAndMechanic_UserId(ServiceStatus.COMPLETED, userId);
        
        for (Services s : services) {      
            WorkHistoryDto dto = modelMapper.map(s, WorkHistoryDto.class);
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
        List<Services> services = serviceRepo.findByMechanic_UserIdAndStatus(userId, ServiceStatus.ONGOING);
        
        for (Services s : services) {
            AssignedJobsDto dto = new AssignedJobsDto();
            dto.setServiceId(s.getServiceId());
            dto.setCustomerName(s.getUser().getName());
            dto.setCustomerPhone(s.getUser().getPhone());
            dto.setCarBrand(s.getCar().getBrand());
            dto.setCarModel(s.getCar().getModel());
            dto.setCarPlate(s.getCar().getRegNumber());
            dto.setServiceName(s.getCatalog().getServiceName());
            dto.setServiceDate(s.getCreatedAt().toLocalDate());
            dto.setStatus(s.getStatus().toString());
            dto.setNotes(s.getCustomerNotes());
            dto.setCreatedAt(s.getCreatedAt());
            
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

}



