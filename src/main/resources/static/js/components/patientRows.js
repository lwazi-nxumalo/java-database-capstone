export function createPatientRow(appointment) {
    const row = document.createElement("tr");

    const patient = appointment.patient || {};

    const idCell = document.createElement("td");
    idCell.textContent = patient.id || "";

    const nameCell = document.createElement("td");
    nameCell.textContent = patient.name || "";

    const phoneCell = document.createElement("td");
    phoneCell.textContent = patient.phone || "";

    const emailCell = document.createElement("td");
    emailCell.textContent = patient.email || "";

    const prescriptionCell = document.createElement("td");
    const prescriptionBtn = document.createElement("button");
    prescriptionBtn.textContent = "Add Prescription";
    prescriptionBtn.classList.add("prescription-btn");
    prescriptionBtn.addEventListener("click", () => {
        window.location.href = `/pages/addPrescription.html?appointmentId=${appointment.id}`;
    });
    prescriptionCell.appendChild(prescriptionBtn);

    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(phoneCell);
    row.appendChild(emailCell);
    row.appendChild(prescriptionCell);

    return row;
}