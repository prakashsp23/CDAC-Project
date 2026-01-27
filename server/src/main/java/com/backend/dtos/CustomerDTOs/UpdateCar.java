package com.backend.dtos.CustomerDTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UpdateCar {
    private String regNumber;
    private String brand;
    private String model;
    private Integer year;
}
