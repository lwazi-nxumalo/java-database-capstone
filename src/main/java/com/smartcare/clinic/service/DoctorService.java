package com.smartcare.clinic.service;

import com.smartcare.clinic.dto.Login;
import com.smartcare.clinic.model.Appointment;
import com.smartcare.clinic.model.Doctor;
import com.smartcare.clinic.repository.AppointmentRepository;
import com.smartcare.clinic.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<String> getDoctorAvailability(Long doctorId, LocalDate date) {
        Optional<Doctor> doctorOpt = doctorRepository.findById(doctorId);
        if (doctorOpt.isEmpty()) return List.of();

        Doctor doctor = doctorOpt.get();
        List<String> allSlots = doctor.getAvailableTimes();

        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.atTime(23, 59, 59);

        List<Appointment> booked = appointmentRepository
                .findByDoctorIdAndAppointmentTimeBetween(doctorId, start, end);

        List<String> bookedSlots = booked.stream()
                .map(a -> {
                    int hour = a.getAppointmentTime().getHour();
                    return String.format("%02d:00-%02d:00", hour, hour + 1);
                })
                .collect(Collectors.toList());

        return allSlots.stream()
                .filter(slot -> !bookedSlots.contains(slot))
                .collect(Collectors.toList());
    }

    public int saveDoctor(Doctor doctor) {
        try {
            if (doctorRepository.findByEmail(doctor.getEmail()) != null) return -1;
            doctor.setPassword(passwordEncoder.encode(doctor.getPassword()));
            doctorRepository.save(doctor);
            return 1;
        } catch (Exception e) {
            return 0;
        }
    }

    public int updateDoctor(Doctor doctor) {
        try {
            Optional<Doctor> existing = doctorRepository.findById(doctor.getId());
            if (existing.isEmpty()) return -1;
            if (doctor.getPassword() != null && !doctor.getPassword().isEmpty()) {
                doctor.setPassword(passwordEncoder.encode(doctor.getPassword()));
            } else {
                doctor.setPassword(existing.get().getPassword());
            }
            doctorRepository.save(doctor);
            return 1;
        } catch (Exception e) {
            return 0;
        }
    }

    public List<Doctor> getDoctors() {
        return doctorRepository.findAll();
    }

    public int deleteDoctor(long id) {
        try {
            if (doctorRepository.findById(id).isEmpty()) return -1;
            appointmentRepository.deleteAllByDoctorId(id);
            doctorRepository.deleteById(id);
            return 1;
        } catch (Exception e) {
            return 0;
        }
    }

    public ResponseEntity<Map<String, String>> validateDoctor(Login login) {
        Map<String, String> response = new HashMap<>();
        try {
            Doctor doctor = doctorRepository.findByEmail(login.getIdentifier());
            if (doctor == null || !passwordEncoder.matches(login.getPassword(), doctor.getPassword())) {
                response.put("message", "Invalid credentials");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            String token = tokenService.generateToken(doctor.getEmail());
            response.put("token", token);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Internal server error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    public Map<String, Object> findDoctorByName(String name) {
        Map<String, Object> response = new HashMap<>();
        List<Doctor> doctors = doctorRepository.findByNameLike(name);
        response.put("doctors", doctors);
        return response;
    }

    public Map<String, Object> filterDoctorsByNameSpecilityandTime(String name, String specialty, String amOrPm) {
        Map<String, Object> response = new HashMap<>();
        List<Doctor> doctors = doctorRepository.findByNameContainingIgnoreCaseAndSpecialtyIgnoreCase(name, specialty);
        response.put("doctors", filterDoctorByTime(doctors, amOrPm));
        return response;
    }

    public Map<String, Object> filterDoctorByNameAndTime(String name, String amOrPm) {
        Map<String, Object> response = new HashMap<>();
        List<Doctor> doctors = doctorRepository.findByNameLike(name);
        response.put("doctors", filterDoctorByTime(doctors, amOrPm));
        return response;
    }

    public Map<String, Object> filterDoctorByNameAndSpecility(String name, String specialty) {
        Map<String, Object> response = new HashMap<>();
        List<Doctor> doctors = doctorRepository.findByNameContainingIgnoreCaseAndSpecialtyIgnoreCase(name, specialty);
        response.put("doctors", doctors);
        return response;
    }

    public Map<String, Object> filterDoctorByTimeAndSpecility(String specialty, String amOrPm) {
        Map<String, Object> response = new HashMap<>();
        List<Doctor> doctors = doctorRepository.findBySpecialtyIgnoreCase(specialty);
        response.put("doctors", filterDoctorByTime(doctors, amOrPm));
        return response;
    }

    public Map<String, Object> filterDoctorBySpecility(String specialty) {
        Map<String, Object> response = new HashMap<>();
        response.put("doctors", doctorRepository.findBySpecialtyIgnoreCase(specialty));
        return response;
    }

    public Map<String, Object> filterDoctorsByTime(String amOrPm) {
        Map<String, Object> response = new HashMap<>();
        List<Doctor> doctors = doctorRepository.findAll();
        response.put("doctors", filterDoctorByTime(doctors, amOrPm));
        return response;
    }

    private List<Doctor> filterDoctorByTime(List<Doctor> doctors, String amOrPm) {
        return doctors.stream().filter(doctor -> {
            if (doctor.getAvailableTimes() == null) return false;
            return doctor.getAvailableTimes().stream().anyMatch(slot -> {
                try {
                    int hour = Integer.parseInt(slot.split(":")[0]);
                    if (amOrPm.equalsIgnoreCase("AM")) return hour < 12;
                    if (amOrPm.equalsIgnoreCase("PM")) return hour >= 12;
                    return slot.equals(amOrPm);
                } catch (Exception e) {
                    return false;
                }
            });
        }).collect(Collectors.toList());
    }
}