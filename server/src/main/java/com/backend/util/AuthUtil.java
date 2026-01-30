package com.backend.util;

import com.backend.entity.Role;
import com.backend.security.service.UserDetailsImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class AuthUtil {

    /**
     * Gets the authenticated userId from SecurityContext.
     * Returns null if not authenticated or principal is not UserDetailsImpl.
     */
    public static Long getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetailsImpl)) {
            return null;
        }
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userDetails.getUserId();
    }

    public static Role getAuthenticatedUserRole() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) return null;

        Object principal = auth.getPrincipal();

        if (principal instanceof UserDetailsImpl userDetails) {
            return userDetails.getRole();
        }
        return null;
    }
    /**
     * Helper method to get a standardized unauthorized response.
     */
    public static ResponseEntity<?> unauthorizedResponse() {
        return ResponseEntity.status(401).body("Unauthorized");
    }
}