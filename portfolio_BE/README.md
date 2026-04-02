# Portfolio Backend project.
A Spring Boot backend application for a portfolio website that manages portfolio projects and contact messages.

### **Table of contents:**
- [Overview](#Overview)
- [Tech](#tech)
- [Features](#features)
- [Project structure](#project-structure)
- [API endpoints](#api-endpoints)
- [Database](#database)
- [Email integration](#email-integration)
- [Testing](#testing)
- [Deployment](#deployment)
- [Monitoring](#monitoring)
- [Contributing](#contributing)
- [License](#license)

---

# 🤔 **Overview**
The backend provides RESTful API services for a portfolio website, enabling portfolio project and contact message handling.
The application is built with Kotlin and Spring Boot, trying to follow best practices for security, performance and maintainablity.

### ⚙️ **Tech**
Using:
- Kotlin (1.9.25)
- Spring Boot (2.5.6)
- Gradle.
- Java SDK 21.
- Flyway database migration.
- Resend email service.
- Testing: JUnit5, Mockito, MockK.
- Monitoring with Spring Actuator, Prometheus
- Deployment: Docker.

### 🐣 **Features**
- CRUD
- Contact form message handling.
- Authentication and authorization.
- Database migrations
- Small test suite.
- Metrics and monitoring
- Docker containerization.

### 📂 **Project structure**
```text
src
├── main
│   ├── kotlin/com/gaurgle/portfolio
│   │   ├── config          # Configuration classes
│   │   ├── controller      # REST controllers
│   │   ├── entities        # JPA entities
│   │   ├── repository      # Spring Data JPA repositories
│   │   ├── service         # Business logic services
│   │   └── PortfolioApplication.kt # Main application class
│   │
│   └── resources
│       ├── application.properties  # Application properties
│       └── db/migration            # Flyway migration scripts
└── test
    └── kotlin/com/gaurgle/portfolio # Test classes
```


### ↔ **API endpoints**
- ##### Portfolio projects:
- `GET /api/projects` 			- Get all portfolio projects
- `GET /api/projects/{id}` 		- Get project by ID
- `POST /api/projects` 			- Create new project
- `PUT /api/projects/{id}` 		- Update project
- `DELETE /api/projects/{id}` 	- Delete project

- ##### ✉️ **Contact Messages**
- `GET /api/contact` - Get all contact messages (admin only)
- `POST /api/contact` - Submit a contact message
- `PUT /api/contact/{id}/handle` - Mark a contact message as handled
- `DELETE /api/contact/{id}` - Delete a contact message

### 📊 **Database**
The application uses PostgreSQL for data persistance. The schema is managed by Flyway migration.

### Entity models:
##### PotfolioProject:
- Represents a portfolio project with details like title, description, links etc.

##### ContactMessages.
- Stores contact form submissions with name, emailaddress, message and status.

### 📬 **Email integration**
The application uses [Resend](https://resend.com) for sending email notifications when new messages are received.

### ⚠️ **Testing**
The project includes an expanding set of tests with:
- Unit tests for services and controllers.
- Integration tests with TestContainers for database operations.
- Security tests for authentication and authorization.


### Deployment:
The application can be deployed using Docker. 
Dockerfile and docker-compose.yml are provided for containerization.

### Hosting:
The backend service is hosted on Railway.

### Monitoring:
The application exposes metrics via Spring actuator and Prometheus for monitoring of:
- Health checks: `/actuator/health`
- Metrics: `/actuator/prometheus`

### License:
This projects in licensed under the [MIT](https://opensource.org/license/mit) license - see the license file for details.

