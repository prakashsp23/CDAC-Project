package com.backend.service.CustomerService;

import com.backend.dtos.CustomerDTOs.AddCar;
import com.backend.entity.Car;
import com.backend.entity.User;
import com.backend.repository.CarRepository;
import com.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class CustomerServiceImpl implements  CustomerService{
    private final CarRepository carRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Override
    public Car addCar(AddCar carData, Long userId) {
        User user = userRepository.findById(userId)
                    .orElseThrow(()->new NullPointerException());
        Car car = modelMapper.map(carData,Car.class);
        car.setOwner(user);
        return carRepository.save(car);
    }
}
