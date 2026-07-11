package com.smartcare.clinic.config;

import com.smartcare.clinic.repository.AdminRepository;
import com.smartcare.clinic.repository.DoctorRepository;
import com.smartcare.clinic.repository.PatientRepository;
import com.smartcare.clinic.service.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        String token = extractToken(path);

        if (token != null) {
            try {
                String identifier = tokenService.extractIdentifier(token);
                String role = determineRole(identifier);

                if (role != null) {
                    UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(
                            identifier,
                            null,
                            List.of(new SimpleGrantedAuthority("ROLE_" + role))
                        );
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            } catch (Exception e) {
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }

    private String extractToken(String path) {
        String[] parts = path.split("/");
        for (String part : parts) {
            if (part.startsWith("eyJ")) return part;
        }
        return null;
    }

    private String determineRole(String identifier) {
        if (adminRepository.findByUsername(identifier) != null) return "ADMIN";
        if (doctorRepository.findByEmail(identifier) != null) return "DOCTOR";
        if (patientRepository.findByEmail(identifier) != null) return "PATIENT";
        return null;
    }
}