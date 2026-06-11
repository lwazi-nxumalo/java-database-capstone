function selectRole(role) {
    localStorage.setItem("userRole", role);

    if (role === "admin") {
        window.location.href = "/admin/dashboard";
    } else if (role === "doctor") {
        window.location.href = "/doctor/dashboard";
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