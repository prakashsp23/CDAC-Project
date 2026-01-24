package com.backend.service.MechanicService;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.backend.dtos.MechanicDTOs.WorkHistoryDto;
import com.backend.entity.Feedback;
import com.backend.entity.ServiceStatus;
import com.backend.entity.Services;
import com.backend.repository.Mechanic.FeedBackRepo;
import com.backend.repository.Mechanic.ServiceRepo;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;



@Service
@Transactional
@RequiredArgsConstructor
public class ServiceImpl implements MechanicService {

    private final ServiceRepo serviceRepo;

    private final FeedBackRepo feedBackRepo;

    @Override
    public List<WorkHistoryDto> getWorkLogs(Long userId) {
        List<WorkHistoryDto> workHistory = new ArrayList<>();
        List<Services> services = serviceRepo.findByStatusAndMechanic_UserId(ServiceStatus.COMPLETED, userId);
        
        for (Services s : services) {
            Feedback feedbacks = feedBackRepo.findByService(s);          
            WorkHistoryDto dto = new WorkHistoryDto();
            dto.setServiceId(s.getServiceId());
            dto.setVehicleName(s.getCar().getBrand() + " " + s.getCar().getModel());
            dto.setCompletionDate(s.getCompletionDate());
            
            if (feedbacks != null) {
                dto.setRating(feedbacks.getRating() != null ? feedbacks.getRating().intValue() : 0);
                dto.setFeedback(feedbacks.getComments());
            } else {
                dto.setRating(0);
                dto.setFeedback("No feedback provided yet. Customer has not rated this service.");
            }
            
            workHistory.add(dto);
        }
        return workHistory;
    }


}

