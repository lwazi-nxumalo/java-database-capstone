import { API_BASE_URL } from "../config/config.js";

const PATIENT_API = API_BASE_URL + '/patient';

export async function patientSignup(data) {
    try {
        const response = await fetch(PATIENT_API + '/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        return { success: response.ok, message: result.message };
    } catch (error) {
        console.error('Error signing up:', error);
        return { success: false, message: error.message };
    }
}

export async function patientLogin(data) {
    console.log('Logging in patient:', data);
    try {
        const response = await fetch(PATIENT_API + '/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response;
    } catch (error) {
        console.error('Error logging in:', error);
        return null;
    }
}

export async function getPatientData(token) {
    try {
        const response = await fetch(`${PATIENT_API}/data?token=${token}`);
        if (!response.ok) return null;
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching patient data:', error);
        return null;
    }
}

export async function getPatientAppointments(id, token, user) {
    try {
        const response = await fetch(`${API_BASE_URL}/${user}/appointments/${id}?token=${token}`);
        if (!response.ok) return null;
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching appointments:', error);
        return null;
    }
}

export async function filterAppointments(condition, name, token) {
    try {
        const response = await fetch(`${PATIENT_API}/appointments/filter/${condition}/${name}?token=${token}`);
        if (!response.ok) return [];
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error filtering appointments:', error);
        alert('Unexpected error: ' + error.message);
        return [];
    }
}