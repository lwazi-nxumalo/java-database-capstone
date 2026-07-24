package com.smartcare.clinic.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.password.Pbkdf2PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new Pbkdf2PasswordEncoder(
            "smartclinic_salt",
            16,
            310000,
            Pbkdf2PasswordEncoder.SecretKeyFactoryAlgorithm.PBKDF2WithHmacSHA256
        );
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/", "/index.html", "/pages/**", "/js/**", "/assets/**").permitAll()
                .requestMatchers("/adminDashboard/**", "/doctorDashboard/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/admin").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/doctor/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/patient").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/patient/login").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/doctor", "/api/doctor/filter/**").permitAll()

                // Admin only
                .requestMatchers(HttpMethod.POST, "/api/doctor/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/doctor/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/doctor/**").hasRole("ADMIN")

                // Doctor only
                .requestMatchers(HttpMethod.GET, "/api/appointments/**").hasRole("DOCTOR")
                .requestMatchers(HttpMethod.POST, "/api/prescription/**").hasRole("DOCTOR")
                .requestMatchers(HttpMethod.GET, "/api/prescription/**").hasRole("DOCTOR")
                .requestMatchers(HttpMethod.GET, "/api/doctor/availability/**").hasAnyRole("DOCTOR", "PATIENT", "ADMIN")

                // Patient only
                .requestMatchers(HttpMethod.POST, "/api/appointments/**").hasRole("PATIENT")
                .requestMatchers(HttpMethod.PUT, "/api/appointments/**").hasRole("PATIENT")
                .requestMatchers(HttpMethod.DELETE, "/api/appointments/**").hasRole("PATIENT")
                .requestMatchers(HttpMethod.GET, "/api/patient/**").hasRole("PATIENT")

                // Everything else requires authentication
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}