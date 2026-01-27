package com.backend.service.CustomerService;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.dtos.FeedbackDTOs.FeedbackHistoryDto;
import com.backend.dtos.FeedbackDTOs.FeedbackReq;
import com.backend.entity.Feedback;
import com.backend.repository.UserRepository;
import com.backend.repository.Customer.FeedbackRepository;
import com.backend.repository.Customer.ServiceRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class FeedbackServiceImpl implements FeedbackService {

    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final FeedbackRepository feedbackRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<FeedbackHistoryDto> getMyFeedbacks(Long userId) {
        List<Feedback> fb = feedbackRepository.findByUser_Id(userId);
        List<FeedbackHistoryDto> fbh = new ArrayList<>();
        fb.forEach(f -> {
            FeedbackHistoryDto dto = modelMapper.map(f, FeedbackHistoryDto.class);
            if (f.getService() != null && f.getService().getCatalog() != null) {
                dto.setServiceName(f.getService().getCatalog().getServiceName());
            }
            fbh.add(dto);
        });
        return fbh;
    }

    @Override
    public String submitFeedback(FeedbackReq feedbackReq, Long userId) {
        Feedback feedback = modelMapper.map(feedbackReq, Feedback.class);
        feedback.setUser(userRepository.findById(userId)
                .orElseThrow(() -> new NullPointerException()));
        feedback.setService(serviceRepository.findById(feedbackReq.getServiceId())
                .orElseThrow(() -> new NullPointerException()));
        // feedback.setDate(LocalDate.now());
        feedbackRepository.save(feedback);
        return "Feedback Has Been Submitted Successfully";
    }

}
