import { openModal } from "./components/modals.js";
import { getDoctors, filterDoctors, saveDoctor } from "./services/doctorServices.js";
import { createDoctorCard } from "./components/doctorCard.js";

document.addEventListener("DOMContentLoaded", () => {
    loadDoctorCards();

    document.getElementById("searchBar").addEventListener("input", filterDoctorsOnChange);
    document.getElementById("filterTime").addEventListener("change", filterDoctorsOnChange);
    document.getElementById("filterSpecialty").addEventListener("change", filterDoctorsOnChange);
});

async function loadDoctorCards() {
    const doctors = await getDoctors();
    renderDoctorCards(doctors);
}

function renderDoctorCards(doctors) {
    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML = "";

    if (!doctors || doctors.length === 0) {
        contentDiv.innerHTML = "<p>No doctors found.</p>";
        return;
    }

    doctors.forEach(doctor => {
        const card = createDoctorCard(doctor);
        contentDiv.appendChild(card);
    });
}

async function filterDoctorsOnChange() {
    const name = document.getElementById("searchBar").value || "null";
    const time = document.getElementById("filterTime").value || "null";
    const specialty = document.getElementById("filterSpecialty").value || "null";

    const doctors = await filterDoctors(name, time, specialty);

    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML = "";

    if (!doctors || doctors.length === 0) {
        contentDiv.innerHTML = "<p>No doctors found.</p>";
        return;
    }

    doctors.forEach(doctor => {
        const card = createDoctorCard(doctor);
        contentDiv.appendChild(card);
    });
}

window.adminAddDoctor = async function () {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Unauthorized. Please log in again.");
        return;
    }

    const availableTimes = [];
    document.querySelectorAll(".checkbox-group input[type='checkbox']:checked").forEach(cb => {
        availableTimes.push(cb.value);
    });

    const doctor = {
        name: document.getElementById("doctorName").value,
        specialty: document.getElementById("doctorSpecialty").value,
        email: document.getElementById("doctorEmailInput").value,
        password: document.getElementById("doctorPasswordInput").value,
        phone: document.getElementById("doctorPhone").value,
        availableTimes
    };

    const result = await saveDoctor(doctor, token);

    if (result.success) {
        alert("Doctor added successfully.");
        document.getElementById("modal").style.display = "none";
        loadDoctorCards();
    } else {
        alert("Failed to add doctor: " + result.message);
    }
};