package com.backend.dtos.PartDTOs;

import lombok.Data;


import lombok.*;
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PartDto {

    private Long id;
    private String name;
    private String description;
    private Double price;
    private Integer stock;
    private String status; // derived (In Stock / Out of Stock)
}