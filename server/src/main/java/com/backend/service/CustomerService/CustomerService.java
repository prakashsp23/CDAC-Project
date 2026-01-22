package com.backend.service.CustomerService;

import java.util.List;

import com.backend.dtos.CustomerDTOs.AddCar;
import com.backend.dtos.CustomerDTOs.CarResponse;
import com.backend.dtos.CustomerDTOs.CompletedServiceDto;
import com.backend.dtos.CustomerDTOs.FeedbackHistoryDto;
import com.backend.dtos.CustomerDTOs.FeedbackReq;
import com.backend.dtos.CustomerDTOs.OngoingServiceDto;
import com.backend.entity.Car;
import com.backend.entity.Feedback;
import com.backend.entity.ServiceCatalog;
import com.backend.entity.Services;

public interface CustomerService {

    public List<Services> getMyServices(Long userId);

    public List<OngoingServiceDto> getOngoingService(Long userId);

    public List<ServiceCatalog> getAllServices();

    public List<CarResponse> getVehicle(Long userId);

    public Car addCar(AddCar car, Long userId);

    public void deleteCar(Long carId, Long userId);

    public List<FeedbackHistoryDto> getMyFeedbacks(Long userId);

    public List<CompletedServiceDto> getCompletedServices(Long userId);

    public String submitFeedback(FeedbackReq feedbackReq, Long userId);

}
