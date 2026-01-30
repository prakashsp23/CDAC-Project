package com.backend.aop.annotation;

import com.backend.entity.Role;
import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface RequireAnyRole {
    Role[] value();
}