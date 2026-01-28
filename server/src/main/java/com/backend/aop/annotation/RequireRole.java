package com.backend.aop.annotation;

import java.lang.annotation.*;
import com.backend.entity.Role;

@Target({ ElementType.METHOD, ElementType.ANNOTATION_TYPE })
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface RequireRole {
    Role value();
}