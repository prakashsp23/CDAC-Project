package com.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "cars")
@AttributeOverride(name = "id", column = @Column(name = "car_id"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
// @ToString(exclude = {"services"})
public class Car extends BaseEntity {

    // @Id
    // @GeneratedValue(strategy = GenerationType.IDENTITY)
    // private Long carId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User owner;

    @Column(nullable = false, unique = true)
    private String regNumber;
    private String brand;
    private String model;
    private Integer year;
    // vin is out of scope

    // Bidirectional: Car has many Services
    // @OneToMany(mappedBy = "car", cascade = CascadeType.ALL)
    // private List<Services> services = new ArrayList<>();
}
