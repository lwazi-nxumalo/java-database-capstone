# Schema Design — Smart Clinic Management System

## MySQL Database Design

### Table: admin
- id: INT, Primary Key, Auto Increment
- name: VARCHAR(100), Not Null
- email: VARCHAR(100), Not Null, Unique
- password: VARCHAR(255), Not Null
- created_at: TIMESTAMP, Default CURRENT_TIMESTAMP

### Table: doctors
- id: INT, Primary Key, Auto Increment
- name: VARCHAR(100), Not Null
- email: VARCHAR(100), Not Null, Unique
- password: VARCHAR(255), Not Null
- specialization: VARCHAR(100), Not Null
- phone: VARCHAR(20), Not Null
- available: BOOLEAN, Default TRUE
- created_at: TIMESTAMP, Default CURRENT_TIMESTAMP

### Table: patients
- id: INT, Primary Key, Auto Increment
- name: VARCHAR(100), Not Null
- email: VARCHAR(100), Not Null, Unique
- password: VARCHAR(255), Not Null
- phone: VARCHAR(20), Not Null
- date_of_birth: DATE, Not Null
- created_at: TIMESTAMP, Default CURRENT_TIMESTAMP

### Table: appointments
- id: INT, Primary Key, Auto Increment
- doctor_id: INT, Foreign Key → doctors(id), Not Null
- patient_id: INT, Foreign Key → patients(id), Not Null
- appointment_time: DATETIME, Not Null
- status: INT, Not Null
  -- 0 = Scheduled
  -- 1 = Completed
  -- 2 = Cancelled
- notes: TEXT
- created_at: TIMESTAMP, Default CURRENT_TIMESTAMP

-- If a doctor is deleted, their appointments are set to null.
-- If a patient is deleted, their appointments are also deleted (CASCADE).
-- A doctor should not have two appointments at the same appointment_time.

## MongoDB Collection Design

### Collection: prescriptions

```json
{
  "_id": "ObjectId('64abc123def')",
  "appointmentId": 101,
  "patientName": "Sipho Dlamini",
  "doctorName": "Dr. Ayanda Mokoena",
  "issuedAt": "2026-06-01T10:30:00Z",
  "medications": [
    {
      "name": "Amoxicillin",
      "dosage": "500mg",
      "frequency": "3 times daily",
      "durationDays": 7
    },
    {
      "name": "Ibuprofen",
      "dosage": "400mg",
      "frequency": "as needed",
      "durationDays": 5
    }
  ],
  "doctorNotes": "Patient presented with bacterial infection. Monitor for allergic reaction.",
  "refillsAllowed": 1,
  "pharmacy": {
    "name": "MedPharm Sandton",
    "location": "Sandton City, Johannesburg"
  },
  "tags": ["antibiotic", "infection", "follow-up-required"]
}
```

-- Prescriptions are stored in MongoDB because their structure varies per condition.
-- The medications field is an array to support multiple drugs per prescription.
-- appointmentId links back to the MySQL appointments table by ID.
-- Tags allow flexible categorization without altering the schema.