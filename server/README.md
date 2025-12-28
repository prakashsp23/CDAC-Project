##Spring Boot Backend Template

### Tech Stack

- **Backend**: Spring Boot (3.5.8)
- **Database**: MySQL
- **Build Tool**: Maven
- **Version Control**: Git
- **API Documentation**: Springdoc OpenAPI
- **Object Mapping**: ModelMapper
- **Validation**: Bean Validation
- **Actuator**: Spring Boot Actuator
- **JPA**: Spring Data JPA
- **Lombok**: Lombok for reducing boilerplate code
- **DevTools**: Spring Boot DevTools for development
- **Testing**: JUnit 5 for unit testing
- **Dependency Management**: Maven for dependency management

### Project Structure

```
spring_boot_backend_template/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── backend/
│   │   │           ├── controller/
│   │   │           ├── model/
│   │   │           ├── repository/
│   │   │           ├── service/
│   │   │           └── Application.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/
│           └── com/
│               └── backend/
│                   └── ApplicationTests.java
├── pom.xml
└── README.md
```

### API Documentation

The API documentation is available at:

```
http://localhost:8080/swagger-ui.html
```

### Spring Security Flow
```
CLIENT (React / Postman)
    ↓
Spring Security Filter Chain
    ↓
JWT Filter
    ↓
Authentication
    ↓
Authorization (ROLE check)
    ↓
Controller → Service → Repository → DB
```

### Database Configuration

The application uses Postgres database by default. You can configure it to use a MySQL database by modifying the `application.properties` file.

### License

This project is licensed under the MIT License - see the LICENSE file for details.

### Contact

For any questions or issues, please contact the project maintainer at <your-email>.
