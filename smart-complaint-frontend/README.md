# Smart Complaint Frontend

React + Vite citizen and city-operations dashboard for the Smart Complaint Management System.

## Tech Stack

- React
- Vite
- TailwindCSS
- React Router
- Axios
- Lucide icons

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example`:

```bash
VITE_API_BASE_URL=http://localhost:8080/api
```

3. Start the app:

```bash
npm run dev
```

Open `http://localhost:5173`.

## Pages

- Login
- Register
- Home
- Complaint List
- Complaint Details
- Create Complaint
- Edit Complaint
- User Dashboard
- Officer Dashboard
- Admin Dashboard
- Profile Page
- Admin User Management

## Folder Structure

```text
src/
  components/
  context/
  hooks/
  layouts/
  pages/
  routes/
  services/
  utils/
```

JWT tokens are stored in `localStorage` and attached to API requests by the Axios interceptor in `src/services/api.js`.
