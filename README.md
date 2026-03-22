# InvoicePro

InvoicePro is a full-stack invoicing and analytics dashboard built with React, Vite, Tailwind CSS, Express, and MongoDB. It includes customer CRUD, invoice management, dashboard analytics, PDF export, dark mode, invoice search/filtering, and sample seed data.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Axios, React Router, Recharts, jsPDF
- Backend: Node.js, Express, MongoDB, Mongoose
- Architecture: MVC-style API structure with modular frontend components and services

## Features

- Dashboard with total revenue, invoice counts, paid vs pending stats, recent invoices, and charts
- Customer management with create, edit, delete, list, search, and pagination
- Invoice management with create, edit, delete, detail view, dynamic totals, search, filter, and pagination
- PDF export with company details and a clean invoice layout
- Responsive sidebar layout and reusable UI components
- Optional enhancements included: dark mode, search/filtering, pagination

## Project Structure

```text
.
|-- backend
|   |-- config
|   |-- controllers
|   |-- middleware
|   |-- models
|   |-- routes
|   |-- seed
|   |-- utils
|   `-- server.js
|-- frontend
|   |-- src
|   |   |-- components
|   |   |-- constants
|   |   |-- hooks
|   |   |-- pages
|   |   |-- services
|   |   `-- utils
|   `-- index.html
`-- package.json
```

## Environment Setup

Create local environment files from the examples:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Use these defaults unless you need to change them:

- `backend/.env`
  - `PORT=5000`
  - `MONGODB_URI=mongodb://127.0.0.1:27017/invoicepro`
  - `CLIENT_URL=http://localhost:5173`
- `frontend/.env`
  - `VITE_API_URL=/api`
  - Company contact fields used by the PDF export

## Run Locally

1. Install dependencies at the repo root:

   ```bash
   npm install
   ```

2. Start MongoDB locally.

3. Seed example data:

   ```bash
   npm run seed
   ```

4. Start both apps:

   ```bash
   npm run dev
   ```

5. Open `http://localhost:5173`

## Available Scripts

- `npm run dev` - run frontend and backend together
- `npm run dev:backend` - run the Express API only
- `npm run dev:frontend` - run the React app only
- `npm run build` - build the frontend for production
- `npm run seed` - populate MongoDB with example customers and invoices

## API Endpoints

### Customers

- `POST /api/customers`
- `GET /api/customers`
- `PUT /api/customers/:id`
- `DELETE /api/customers/:id`

### Invoices

- `POST /api/invoices`
- `GET /api/invoices`
- `GET /api/invoices/:id`
- `PUT /api/invoices/:id`
- `DELETE /api/invoices/:id`

### Dashboard

- `GET /api/dashboard/stats`

## Notes

- Revenue charts and total revenue are based on invoices marked as `paid`
- Customer deletion is blocked when invoices still reference that customer
- JWT authentication was intentionally left out to keep the codebase focused and beginner-friendly
