# LeadDesk Mini

LeadDesk Mini is a simple full-stack lead management application built using the MERN stack. It allows users to submit lead information through a landing page, stores the data in MongoDB, and provides an admin dashboard to manage lead statuses.

---

## Live Demo

- **Frontend:** https://YOUR-VERCEL-URL.vercel.app
- **Backend:** https://leaddesk-mini-backend-hmnq.onrender.com

---

## GitHub Repository

https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME

---

## Features

- Responsive landing page
- Lead submission form
- Stores leads in MongoDB Atlas
- Admin dashboard to view all leads
- Update lead status (New, Contacted, Qualified, Closed)
- Frontend deployed on Vercel
- Backend deployed on Render

---

## Tech Stack

### Frontend
- React
- Axios
- CSS

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose

### Deployment
- Vercel
- Render

---

## Folder Structure

```
LeadDeskMini/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── models/
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## Installation

### Clone the repository

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME.git
```

### Go to the project folder

```bash
cd LeadDeskMini
```

### Backend Setup

```bash
cd server
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URL=YOUR_MONGODB_CONNECTION_STRING
```

Start the backend:

```bash
node server.js
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

The frontend will run on:

```
http://localhost:5173
```

---

## API Endpoints

### Get Home

```
GET /
```

### Add Lead

```
POST /add-lead
```

### Get All Leads

```
GET /leads
```

### Update Lead Status

```
PUT /lead/:id
```

---

## Future Improvements

- User authentication
- Search and filter leads
- Delete lead option
- Email notifications
- Better dashboard analytics

---

## AI Usage

AI tools (ChatGPT) were used for learning concepts, debugging deployment issues, and understanding implementation. All code was reviewed, tested, and integrated manually.

---

## Author

**Niharika Chinnupati**

GitHub: https://github.com/niharikaInTech

LinkedIn: https://www.linkedin.com/in/niharika-chinnupati/
