# Deployment Guide

## Backend Deployment (Render.com)

1. Create a new Web Service on Render.com
2. Connect your GitHub repository
3. Configure the service with these settings:
   - Name: baguio-pet-boarding-api
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Root Directory: `backend`

4. Set up the following environment variables in Render.com dashboard:
   ```
   PORT=10000
   DB_HOST=[Your MySQL host]
   DB_USER=[Your MySQL username]
   DB_PASSWORD=[Your MySQL password]
   DB_NAME=pet_hotel
   API_KEY=[Your Google Gemini AI API key]
   OPENAI_API_KEY=[Your OpenAI API key]
   DOG_API_KEY=https://api.thedogapi.com/v1
   CAT_API_KEY=[Your Cat API key]
   ```

5. Deploy the service and note down the deployment URL (e.g., https://baguio-pet-boarding-api.onrender.com)

## Frontend Deployment (GitHub Pages)

1. In the frontend config file (`pet-hotel/src/config.js`), the production API URL is already configured to use the Render.com backend URL.

2. Build the frontend for production:
   ```bash
   cd pet-hotel
   npm run build
   ```

3. Deploy to GitHub Pages:
   - Push your code to GitHub
   - Go to repository Settings > Pages
   - Set source to GitHub Actions
   - The frontend will be automatically deployed

## Verifying the Deployment

1. Access your frontend application through the GitHub Pages URL
2. Test the connection to the backend by:
   - Trying to log in
   - Accessing the pet listings
   - Testing the chat functionality

## Troubleshooting

- If the frontend can't connect to the backend, verify the `productionApiUrl` in `config.js`
- Check Render.com logs for any backend errors
- Ensure all environment variables are properly set in Render.com
- Verify that the database connection is successful