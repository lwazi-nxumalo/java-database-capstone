package com.smartcare.clinic.mvc;

import com.smartcare.clinic.service.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class DashboardController {

    @Autowired
    private Service service;

    @GetMapping("/adminDashboard/{token:.+}")
    public String adminDashboard(@PathVariable String token) {
        if (service.validateToken(token, "admin").getStatusCode() == HttpStatus.OK) {
            return "admin/adminDashboard";
        }
        return "redirect:http://localhost:8080";
    }

    @GetMapping("/doctorDashboard/{token:.+}")
    public String doctorDashboard(@PathVariable String token) {
        if (service.validateToken(token, "doctor").getStatusCode() == HttpStatus.OK) {
            return "doctor/doctorDashboard";
        }
        return "redirect:http://localhost:8080";
    }
}