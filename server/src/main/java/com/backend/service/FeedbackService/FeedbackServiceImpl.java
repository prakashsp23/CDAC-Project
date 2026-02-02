package com.backend.service.FeedbackService;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.dtos.FeedbackDTOs.AdminFeedbackDTO;
import com.backend.dtos.FeedbackDTOs.FeedbackHistoryDto;
import com.backend.dtos.FeedbackDTOs.FeedbackReq;
import com.backend.entity.Feedback;
import com.backend.repository.FeedbackRepository;
import com.backend.repository.MechanicNoteRepository;
import com.backend.repository.ServiceRepository;
import com.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class FeedbackServiceImpl implements FeedbackService {

    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final FeedbackRepository feedbackRepository;
    private final MechanicNoteRepository mechanicNoteRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<FeedbackHistoryDto> getMyFeedbacks(Long userId) {
        List<Feedback> fb = feedbackRepository.findByUser_Id(userId);
        List<FeedbackHistoryDto> fbh = new ArrayList<>();
        fb.forEach(f -> {
            FeedbackHistoryDto dto = modelMapper.map(f, FeedbackHistoryDto.class);
            if (f.getService() != null && f.getService().getCatalog() != null) {
                dto.setServiceName(f.getService().getCatalog().getServiceName());

                List<com.backend.entity.MechanicNote> notes = mechanicNoteRepository
                        .findByService_Id(f.getService().getId());
                if (!notes.isEmpty()) {
                    dto.setMechanicNote(notes.get(0).getNotes());
                }
            }
            fbh.add(dto);
        });
        return fbh;
    }

    @Override
    public String submitFeedback(FeedbackReq feedbackReq, Long userId) {
        // Fetch user
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Fetch service
        var service = serviceRepository.findById(feedbackReq.getServiceId())
                .orElseThrow(() -> new RuntimeException("Service not found"));

        // SECURITY: Verify service belongs to the user
        if (service.getUser() == null || !service.getUser().getId().equals(userId)) {
            throw new SecurityException("You can only submit feedback for your own services");
        }

        // Verify service is completed
        if (service.getStatus() != com.backend.entity.ServiceStatus.COMPLETED) {
            throw new IllegalArgumentException("Feedback can only be submitted for completed services");
        }

        Feedback feedback = modelMapper.map(feedbackReq, Feedback.class);
        feedback.setUser(user);
        feedback.setService(service);
        feedbackRepository.save(feedback);
        return "Feedback Has Been Submitted Successfully";
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
