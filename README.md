# Book My Show Clone 🎬

A full-stack movie ticket booking application built with the MERN stack (MongoDB, Express, React, Node.js). 

## Features ✨

- **User Authentication:** Secure registration and login using JWT.
- **Movies & Theatres:** Browse currently playing movies and find available theatres.
- **Showtimes & Slot Selection:** View different showtimes for a selected movie and date.
- **Interactive Seat Selection:** Real-time seat layout showing Available, Selected, Locked, and Booked seats.
- **Booking & Payments:** Lock seats for a period and proceed to simulated payment gateway.
- **My Bookings:** View past and current ticket bookings.

## Tech Stack 🛠️

### Frontend
- **React.js** with **Vite** for fast development and building.
- **Tailwind CSS** for modern, responsive styling.
- **React Router** for seamless client-side navigation.
- **Axios** for API requests.

### Backend
- **Node.js** & **Express.js** for the REST API.
- **MongoDB** & **Mongoose** for data modeling and storage.
- **JWT (JSON Web Tokens)** for secure user sessions.
- **Bcrypt.js** for password hashing.
- **dotenv** for environment variable management.

## Getting Started 🚀

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed and a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or a local MongoDB instance).

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/deepak-kumar9308/book_my_show.git
   cd book_my_show
   ```



   

2. **Setup the Backend:**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory and add your environment variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLIENT_URL=http://localhost:5173
   ```
   Run the backend:
   ```bash
   npm run dev
   ```

3. **Setup the Frontend:**
   ```bash
   # Open a new terminal
   cd client
   npm install
   ```
   Run the frontend:
   ```bash
   npm run dev
   ```

### Seeding Data (Optional)
If your database is empty, you can automatically populate some demo movies, theatres, and shows:
```bash
cd server
npm run seed
```

## Deployment 🌐
- **Backend:** Can be deployed to services like Render, Railway, or Heroku.
- **Frontend:** Can be deployed to Vercel or Netlify. 
*(Ensure your API base URL and CORS origins are updated for production!)*

## License 📄
This project is open-source and available under the [MIT License](LICENSE).
