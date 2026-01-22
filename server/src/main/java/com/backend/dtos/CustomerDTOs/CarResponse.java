package com.backend.dtos.CustomerDTOs;

import lombok.Data;

@Data
public class CarResponse {
    private Long carId;
    private String regNumber;
    private String brand;
    private String model;
    private Integer year;
}
