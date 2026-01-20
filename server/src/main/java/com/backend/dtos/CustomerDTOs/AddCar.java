package com.backend.dtos.CustomerDTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AddCar {
    private String regNumber;
    private String brand;
    private String model;
    private Integer year;
}
