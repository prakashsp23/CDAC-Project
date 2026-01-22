package com.backend.service.CustomerService;

import com.backend.dtos.CustomerDTOs.AddCar;
import com.backend.dtos.CustomerDTOs.CarResponse;
import com.backend.dtos.CustomerDTOs.CompletedServiceDto;
import com.backend.dtos.CustomerDTOs.FeedbackHistoryDto;
import com.backend.dtos.CustomerDTOs.FeedbackReq;
import com.backend.dtos.CustomerDTOs.OngoingServiceDto;
import com.backend.entity.Car;
import com.backend.entity.Feedback;
import com.backend.entity.ServiceCatalog;
import com.backend.entity.ServiceStatus;
import com.backend.entity.User;
import com.backend.repository.UserRepository;
import com.backend.repository.Customer.CarRepository;
import com.backend.repository.Customer.FeedbackRepository;
import com.backend.repository.Customer.ServiceRepository;
import com.backend.repository.Customer.scRepository;
import lombok.RequiredArgsConstructor;

import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import com.backend.entity.Services;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {
    private final CarRepository carRepository;
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final scRepository scRepository;
    private final FeedbackRepository feedbackRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<Services> getMyServices(Long userId) {
        return serviceRepository.findByUser_UserId(userId);
    }

    @Override
    public List<OngoingServiceDto> getOngoingService(Long userId) {
        List<Services> services = serviceRepository
                .findByStatusInAndUser_UserId(List.of(ServiceStatus.ONGOING, ServiceStatus.PENDING), userId);
        List<OngoingServiceDto> ongoingServices = new ArrayList<>();
        for (Services service : services) {
            OngoingServiceDto dto = modelMapper.map(service, OngoingServiceDto.class);
            // Manual mapping for nested fields
            if (service.getCatalog() != null) {
                dto.setServiceName(service.getCatalog().getServiceName());
            }

            if (service.getCar() != null) {
                dto.setCarBrand(service.getCar().getBrand());
                dto.setCarModel(service.getCar().getModel());
                if (service.getCar().getYear() != null) {
                    dto.setCarYear(String.valueOf(service.getCar().getYear()));
                }
            }

            ongoingServices.add(dto);
        }
        return ongoingServices;
    }

    @Override
    public List<ServiceCatalog> getAllServices() {
        return scRepository.findAll();
    }

    @Override
    public List<CarResponse> getVehicle(Long userId) {
        List<Car> cars = carRepository.findByOwner_UserId(userId);
        List<CarResponse> carResponses = new ArrayList<>();
        for (Car car : cars) {
            CarResponse carResponse = modelMapper.map(car, CarResponse.class);
            carResponses.add(carResponse);
        }
        return carResponses;
    }

    @Override
    public Car addCar(AddCar carData, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NullPointerException());
        Car car = modelMapper.map(carData, Car.class);
        car.setOwner(user);
        return carRepository.save(car);
    }

    @Override
    public void deleteCar(Long carId, Long userId) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Car not found"));

        if (!car.getOwner().getUserId().equals(userId)) {
            throw new SecurityException("Unauthorized to delete this car");
        }

        carRepository.delete(car);
    }

    @Override
    public List<FeedbackHistoryDto> getMyFeedbacks(Long userId) {
        List<Feedback> fb = feedbackRepository.findByUser_UserId(userId);
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
    public List<CompletedServiceDto> getCompletedServices(Long userId) {
        List<Services> services = serviceRepository
                .findByStatusInAndUser_UserId(List.of(ServiceStatus.COMPLETED), userId);
        List<CompletedServiceDto> completedServices = new ArrayList<>();
        for (Services service : services) {
            CompletedServiceDto dto = modelMapper.map(service, CompletedServiceDto.class);
            if (service.getCatalog() != null) {
                dto.setServiceName(service.getCatalog().getServiceName());
            }
            completedServices.add(dto);
        }
        return completedServices;
    }

    @Override
    public String submitFeedback(FeedbackReq feedbackReq, Long userId) {
        Feedback feedback = modelMapper.map(feedbackReq, Feedback.class);
        feedback.setUser(userRepository.findById(userId)
                .orElseThrow(() -> new NullPointerException()));
        feedback.setService(serviceRepository.findById(feedbackReq.getServiceId())
                .orElseThrow(() -> new NullPointerException()));
        feedback.setDate(LocalDate.now());
        feedbackRepository.save(feedback);
        return "Feedback Has Been Submitted Successfully";
    }

}
