import { createDoctorCard } from "./components/doctorCard.js";
import { openModal } from "./components/modals.js";
import { getDoctors, filterDoctors } from "./services/doctorServices.js";
import { patientLogin, patientSignup } from "./services/patientServices.js";

document.addEventListener("DOMContentLoaded", () => {
    loadDoctorCards();

    const signupBtn = document.getElementById("patientSignup");
    if (signupBtn) signupBtn.addEventListener("click", () => openModal("patientSignup"));

    const loginBtn = document.getElementById("patientLogin");
    if (loginBtn) loginBtn.addEventListener("click", () => openModal("patientLogin"));

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

    const list = Array.isArray(doctors) ? doctors : (doctors.doctors || []);

    if (!list || list.length === 0) {
        contentDiv.innerHTML = "<p>No doctors found.</p>";
        return;
    }

    list.forEach(doctor => {
        const card = createDoctorCard(doctor);
        contentDiv.appendChild(card);
    });
}

async function filterDoctorsOnChange() {
    const name = document.getElementById("searchBar").value || "null";
    const time = document.getElementById("filterTime").value || "null";
    const specialty = document.getElementById("filterSpecialty").value || "null";

    const response = await filterDoctors(name, time, specialty);
    const doctors = Array.isArray(response) ? response : (response.doctors || []);

    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML = "";

    if (!doctors || doctors.length === 0) {
        contentDiv.innerHTML = "<p>No doctors found with the given filters.</p>";
        return;
    }

    doctors.forEach(doctor => {
        const card = createDoctorCard(doctor);
        contentDiv.appendChild(card);
    });
}

window.signupPatient = async function () {
    const data = {
        name: document.getElementById("signupName").value,
        email: document.getElementById("signupEmail").value,
        password: document.getElementById("signupPassword").value,
        phone: document.getElementById("signupPhone").value,
        address: document.getElementById("signupAddress").value
    };

    const result = await patientSignup(data);

    if (result.success) {
        alert(result.message || "Signup successful!");
        document.getElementById("modal").style.display = "none";
        location.reload();
    } else {
        alert(result.message || "Signup failed.");
    }
};

window.loginPatient = async function () {
    const data = {
        email: document.getElementById("patientEmailInput").value,
        password: document.getElementById("patientPasswordInput").value
    };

    const response = await patientLogin(data);

    if (response && response.ok) {
        const result = await response.json();
        localStorage.setItem("token", result.token);
        selectRole("loggedPatient");
    } else {
        alert("Invalid credentials.");
    }
};