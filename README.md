# 🛍️ Pixel Kala

An online electronics & digital goods store — a full-stack project with a custom frontend (HTML, CSS, Bootstrap, JavaScript) and a REST API backend (Node.js, Express, MongoDB).

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![Node](https://img.shields.io/badge/node-%3E%3D18-green)
![MongoDB](https://img.shields.io/badge/database-MongoDB-4EA94B)

---

## ✨ About the Project

Pixel Kala is a complete online store made up of three main parts:

- **Home page** — product categories, best-selling products, store introduction
- **Product page** — image gallery, technical specs, related products, order placement
- **Admin dashboard** — sales stats, weekly chart, order management, low-stock alerts

All data is served in real time by a REST API secured with JWT authentication.

<!-- TODO: REMOVE THIS SECTION ONCE THE DASHBOARD/ADMIN PANEL IS FINISHED -->
> ### 🚧 Work in Progress
> The **admin dashboard / admin panel** is **not finished yet** and is still being actively built. Some features may be missing, incomplete, or subject to change. **Remove this notice once the dashboard is complete.**
<!-- END TODO -->

## 🧰 Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | HTML5, CSS3, Bootstrap 5 (RTL), Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT (JSON Web Token) + bcrypt |
| API Testing | Postman |

## 📁 Project Structure
pixel-kala-project/
├── backend/ # REST API — Express + MongoDB
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ └── server.js
└── store/ # Frontend — client-side pages and scripts
├── index.html
├── product.html
├── dashboard.html
└── js/


## 🚀 Getting Started

### Backend
```bash
cd backend
npm install
cp .env.example .env      # set MONGO_URI and JWT_SECRET
npm run seed                # populate the database with sample data
npm run dev                  # runs on http://localhost:4000
```

### Frontend
Open the `store` folder with the **Live Server** extension in VS Code — not by double-clicking the HTML file directly.

## 🔑 Default Admin User

After running `npm run seed`:
- Email: `admin@pixelkala.ir`
- Password: `admin123`

## 📮 API Documentation

A full Postman collection (`pixel-kala-api.postman_collection.json`) is included in the `backend` folder — with every endpoint, sample requests, and pre-set variables.

## 🗺️ Roadmap

- [ ] Multi-step shopping cart
- [ ] Product management panel (add/edit from the dashboard)
- [ ] Reviews and ratings system

## 👤 Author

**Fayegh Ayoubi** — Frontend Developer
