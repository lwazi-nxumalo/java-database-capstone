import { getAllAppointments } from "./services/appointmentRecordService.js";
import { createPatientRow } from "./components/patientRows.js";

const tableBody = document.getElementById("patientTableBody");
let selectedDate = new Date().toISOString().split("T")[0];
let token = localStorage.getItem("token");
let patientName = null;

document.addEventListener("DOMContentLoaded", () => {
    const datePicker = document.getElementById("datePicker");
    if (datePicker) datePicker.value = selectedDate;

    loadAppointments();

    document.getElementById("searchBar").addEventListener("input", (e) => {
        patientName = e.target.value || "null";
        loadAppointments();
    });

    document.getElementById("todayButton").addEventListener("click", () => {
        selectedDate = new Date().toISOString().split("T")[0];
        if (datePicker) datePicker.value = selectedDate;
        loadAppointments();
    });

    document.getElementById("datePicker").addEventListener("change", (e) => {
        selectedDate = e.target.value;
        loadAppointments();
    });
});

async function loadAppointments() {
    try {
        const appointments = await getAllAppointments(selectedDate, patientName, token);

        tableBody.innerHTML = "";

        if (!appointments || appointments.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="noPatientRecord">No appointments found for today.</td>
                </tr>
            `;
            return;
        }

        appointments.forEach(appointment => {
            const row = createPatientRow(appointment);
            tableBody.appendChild(row);
        });

    } catch (error) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="noPatientRecord">Error loading appointments.</td>
            </tr>
        `;
    }
}