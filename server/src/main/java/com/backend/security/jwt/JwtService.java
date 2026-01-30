package com.backend.security.jwt;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

    // JWT secret loaded from environment variable
    @Value("${jwt.secret:#{null}}")
    private String secret;

    private static final long EXPIRATION = 1000 * 60 * 60 * 24; // 24 hours

    private SecretKey getSigningKey() {
        if (secret == null || secret.trim().isEmpty()) {
            throw new IllegalStateException(
                "JWT_SECRET environment variable is not set. Please configure jwt.secret in application.properties or set JWT_SECRET environment variable."
            );
        }
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // public String generateToken(String username) {
    public String generateToken(com.backend.entity.User user) {
        return Jwts.builder()
                .subject(user.getEmail())
                .claim("userId", user.getId())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(getSigningKey())
                .compact();
    }

    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public Long extractUserId(String token) {
        return extractAllClaims(token).get("userId", Long.class);
    }

    public boolean isTokenValid(String token) {
        try {
            return extractUsername(token) != null && !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    private boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
