import { API_BASE_URL } from "../config/config.js";

export async function getAllAppointments(date, patientName, token) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/doctor/appointments/${date}/${patientName}?token=${token}`
        );
        if (!response.ok) return null;
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching appointments:', error);
        return null;
    }
}