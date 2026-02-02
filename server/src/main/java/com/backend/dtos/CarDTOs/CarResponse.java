package com.backend.dtos.CarDTOs;

import lombok.Data;

@Data
public class CarResponse {
    private Long id;
    private String regNumber;
    private String brand;
    private String model;
    private Integer year;
    private String licenseNumber;
}
