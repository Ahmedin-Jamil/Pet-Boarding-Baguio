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

## Repository Structure

```
/
├── pet-hotel/         # Frontend React application
└── backend/          # Backend Node.js application
```

## Deployment

This project is deployed using:
- Frontend: GitHub Pages
- Backend: Render.com

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

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
3. Configure environment variables in `.env` (see `.env.example` for required variables)
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
7. Access the application at `http://localhost:3000`

## License

This project is licensed under the MIT License - see the LICENSE file for details.