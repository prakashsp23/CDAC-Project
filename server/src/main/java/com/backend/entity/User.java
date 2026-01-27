package com.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@AttributeOverride(name="id",column = @Column(name="user_id"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"password"})
public class User extends BaseEntity{

//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long userId;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;
    private String phone;

    @Enumerated(EnumType.STRING)
    private Role role;

    // Bidirectional: User owns many Cars
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Car> cars = new ArrayList<>();

    // Bidirectional: User (as customer) has many Services
    // @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    // private List<Services> servicesAsCustomer = new ArrayList<>();

    // // Bidirectional: User (as mechanic) has many assigned Services
    // @OneToMany(mappedBy = "mechanic")
    // private List<Services> servicesAsMechanic = new ArrayList<>();

    // // Bidirectional: User has many Feedbacks
    // @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    // private List<Feedback> feedbacks = new ArrayList<>();

    // // Bidirectional: Mechanic has many notes
    // @OneToMany(mappedBy = "mechanic")
    // private List<MechanicNote> mechanicNotes = new ArrayList<>();
}
