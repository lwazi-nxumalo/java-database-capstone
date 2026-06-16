function selectRole(role, token) {
    localStorage.setItem("userRole", role);

    if (role === "admin") {
        window.location.href = "/adminDashboard/" + token;
    } else if (role === "doctor") {
        window.location.href = "/doctorDashboard/" + token;
    } else if (role === "patient") {
        window.location.href = "/pages/patientDashboard.html";
    } else if (role === "loggedPatient") {
        window.location.href = "/pages/loggedPatientDashboard.html";
    }
}

function renderContent() {
    const role = localStorage.getItem("userRole");
    if (!role) {
        localStorage.setItem("userRole", "patient");
    }
    renderHeader();
    renderFooter();
}