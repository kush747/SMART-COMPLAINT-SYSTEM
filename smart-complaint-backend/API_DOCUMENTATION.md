# Smart Complaint API

Base URL: `http://localhost:8080/api`

All protected endpoints require `Authorization: Bearer <jwt>`.

## Authentication

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | Public | Register a `USER` or `OFFICER` |
| POST | `/auth/login` | Public | Login and receive JWT |
| POST | `/auth/logout` | Authenticated | Client-side logout acknowledgement |

## Complaints

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/complaints?status=&category=&location=&q=&page=&size=&sort=` | Authenticated | Search and browse complaints |
| GET | `/complaints/{id}` | Authenticated | Complaint details |
| POST | `/complaints` | USER | Create complaint |
| GET | `/complaints/me` | USER | Current user's complaints |
| PUT | `/complaints/{id}` | USER | Update own open complaint |
| DELETE | `/complaints/{id}` | USER | Delete own complaint |
| POST | `/complaints/{id}/support` | USER | Support complaint |
| DELETE | `/complaints/{id}/support` | USER | Remove support |
| GET | `/complaints/assigned` | OFFICER | Assigned complaints |
| PATCH | `/complaints/{id}/status` | OFFICER | Update assigned complaint status |
| POST | `/complaints/{id}/remarks` | OFFICER | Add officer remark |
| PATCH | `/complaints/{id}/assign` | ADMIN | Assign officer |
| DELETE | `/complaints/admin/{id}` | ADMIN | Delete any complaint |


## Authentication

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | Public | Register a `USER` or `OFFICER` |
| POST | `/auth/login` | Public | Login and receive JWT |
| POST | `/auth/logout` | Authenticated | Client-side logout acknowledgement |
| POST | `/auth/verify` | Public | Verify OTP to activate account |
| POST | `/auth/resend-otp` | Public | Resend verification OTP |
| POST | `/auth/forgot-password` | Public | Request password reset OTP |
| POST | `/auth/verify-reset-otp` | Public | Verify reset OTP |
| POST | `/auth/reset-password` | Public | Reset password using OTP |

## Dashboards

| Method | Endpoint | Access |
| --- | --- | --- |
| GET | `/dashboards/user` | USER |
| GET | `/dashboards/officer` | OFFICER |
| GET | `/dashboards/admin` | ADMIN |

## Users

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/users/me` | Authenticated | Current profile |
| GET | `/users?role=&q=&page=&size=&sort=` | ADMIN | List users |
| POST | `/users` | ADMIN | Create user, officer, or admin |
| PUT | `/users/{id}` | ADMIN | Update profile/status |
| DELETE | `/users/{id}` | ADMIN | Delete user |

Responses use:

```json
{
  "success": true,
  "message": "Operation message",
  "data": {},
  "timestamp": "2026-06-21T00:00:00Z"
}
```
