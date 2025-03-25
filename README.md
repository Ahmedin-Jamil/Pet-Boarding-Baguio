# Baguio Pet Boarding Website

A full-stack web application for a pet hotel that offers boarding and grooming services. The application includes a React frontend and Node.js backend with Gemini AI integration for the chatbot feature.

## Features

- Interactive booking system for pet boarding and grooming services
- Admin panel for managing bookings
- AI-powered chatbot with multilingual support (English and Tagalog)
- Responsive design for all devices

## Technology Stack

### Frontend
- React 19
- React Router 7
- React Bootstrap
- FontAwesome icons

### Backend
- Node.js with Express
- MySQL database
- Google Gemini AI integration

## Deployment

This project is deployed using:
- Frontend: GitHub Pages
- Backend: Render.com

## Setup Instructions

### Prerequisites
- Node.js and npm
- MySQL database
- Google Gemini AI API key

### Local Development

1. Clone the repository
2. Set up the backend:
   ```
   cd backend
   npm install
   ```
3. Configure environment variables in `.env`
4. Set up the frontend:
   ```
   cd pet-hotel
   npm install
   ```
5. Start the backend server:
   ```
   cd backend
   npm start
   ```
6. Start the frontend development server:
   ```
   cd pet-hotel
   npm start
   ```

## Deployment Configuration

### Frontend (GitHub Pages)

The frontend is configured to be deployed on GitHub Pages. The production build connects to the deployed backend API.

### Backend (Render.com)

The backend is deployed on Render.com with the following environment variables:
- PORT: Automatically assigned by Render
- DB_HOST: MySQL database host
- DB_USER: MySQL database user
- DB_PASSWORD: MySQL database password
- DB_NAME: MySQL database name
- API_KEY: Google Gemini AI API key

## Contact

Developed by Jamil (jamil.al.amin1100@gmail.com)