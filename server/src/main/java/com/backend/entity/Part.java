package com.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "parts")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Part {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long partId;

    private String partName;
    private String description;
    private Double unitPrice;
    private String status;
}
