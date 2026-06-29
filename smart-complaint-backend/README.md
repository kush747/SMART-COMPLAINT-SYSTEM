# Smart Complaint Backend

Spring Boot 3 API for a smart city complaint management platform with JWT authentication, role-based authorization, complaint tracking, supports, remarks, dashboards, pagination, sorting, and search.

## Tech Stack

- Java 21
- Spring Boot 3
- Spring Security + JWT
- Spring Data JPA + Hibernate
- MySQL
- Maven
- Lombok

## Setup

1. Create MySQL database manually or let Hibernate create it:

```bash
mysql -u root -p < schema.sql
```

2. Configure environment variables. A template is provided in `.env.example`:

```bash
DB_URL=jdbc:mysql://localhost:3306/smart_complaints?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=root
DB_PASSWORD=your_password
JWT_SECRET=replace-with-a-long-random-secret-at-least-32-characters
JWT_EXPIRATION_MS=86400000
CORS_ALLOWED_ORIGINS=http://localhost:5173
ADMIN_EMAIL=admin@smartcity.gov
ADMIN_PASSWORD=Admin@12345
```

3. Run:

```bash
mvn spring-boot:run
```

The API starts at `http://localhost:8080/api`.

## Default Admin

On startup, the app creates an admin if one does not exist:

- Email: `admin@smartcity.gov`
- Password: `Admin@12345`

Override these with `ADMIN_EMAIL` and `ADMIN_PASSWORD`.

## Project Structure

```text
src/main/java/com/smartcity/complaints
  config
  controller
  dto
  entity
  exception
  mapper
  repository
  security
  service
```

See `API_DOCUMENTATION.md` for endpoints.
