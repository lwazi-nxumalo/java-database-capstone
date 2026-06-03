# Schema Architecture — Smart Clinic Management System

## Section 1: Architecture Summary

This Spring Boot application uses both MVC and REST controllers. Thymeleaf templates are used for the Admin and Doctor dashboards, while REST APIs serve all other modules including appointments, patient dashboards, and patient records. The application interacts with two databases — MySQL for structured relational data such as patients, doctors, appointments, and admin records, and MongoDB for flexible document-based data such as prescriptions. All controllers route requests through a common service layer, which applies business logic and coordinates workflows before delegating to the appropriate repositories. MySQL repositories use Spring Data JPA with annotated entity classes, while the MongoDB repository uses Spring Data MongoDB with document model classes.

## Section 2: Flow of Data and Control

1. The user accesses the application either through a Thymeleaf-rendered dashboard such as AdminDashboard or DoctorDashboard, or through a REST API client such as the Appointments or PatientDashboard modules.
2. The incoming request is routed to the appropriate controller based on the URL and HTTP method. Thymeleaf controllers handle server-rendered views while REST controllers handle JSON-based API requests.
3. The controller delegates all business logic to the service layer, which applies validations, enforces rules, and coordinates operations across multiple entities.
4. The service layer calls the appropriate repository — either a MySQL repository using Spring Data JPA or a MongoDB repository using Spring Data MongoDB — to read or write data.
5. The repository interfaces directly with the underlying database. MySQL stores structured relational data and MongoDB stores flexible nested document data such as prescriptions.
6. Data retrieved from the database is mapped into Java model classes. MySQL data is bound to JPA entities annotated with @Entity and MongoDB data is bound to document objects annotated with @Document.
7. The bound models are used to generate the response. In MVC flows, models are passed to Thymeleaf templates and rendered as HTML. In REST flows, models are serialized into JSON and returned to the client.