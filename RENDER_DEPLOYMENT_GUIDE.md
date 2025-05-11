# Render.com Free Deployment Guide

## Backend Deployment

1. **Create a Render Account**
   - Go to [Render.com](https://dashboard.render.com/register) and sign up for a free account

2. **Create a New Web Service**
   - Go to [New Web Service](https://dashboard.render.com/new/web-service)
   - Connect your GitHub repository or use the manual deploy option

3. **Configure the Web Service**
   - Name: `baguio-pet-boarding-api`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Root Directory: `backend`

4. **Set Environment Variables**
   - Click on "Environment" tab and add the following variables:
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
   - For free deployment, you can use a free MySQL database from providers like [PlanetScale](https://planetscale.com/) or [Clever Cloud](https://www.clever-cloud.com/)

5. **Deploy the Service**
   - Click "Create Web Service"
   - Wait for the deployment to complete
   - Note the deployment URL (e.g., `https://baguio-pet-boarding-api.onrender.com`)

## Frontend Deployment on Render (Instead of GitHub Pages)

1. **Update Frontend Configuration**
   - Open `pet-hotel/src/config.js`
   - Make sure the `productionApiUrl` points to your deployed backend URL

2. **Create a New Static Site on Render**
   - Go to [New Static Site](https://dashboard.render.com/new/static-site)
   - Connect your GitHub repository or use the manual deploy option

3. **Configure the Static Site**
   - Name: `baguio-pet-boarding`
   - Build Command: `cd pet-hotel && npm install && npm run build`
   - Publish Directory: `pet-hotel/build`
   - Click "Create Static Site"

4. **Verify the Deployment**
   - Once deployed, Render will provide a URL for your static site
   - Visit the URL to ensure your frontend is working correctly
   - Test the connection to the backend by trying to log in or access pet listings

## Important Notes

1. **Free Tier Limitations**
   - Render's free tier for web services will spin down after 15 minutes of inactivity
   - The first request after inactivity may take a few seconds to respond
   - Static sites on Render's free tier do not have this limitation

2. **Database Considerations**
   - For a completely free deployment, use a free MySQL database provider
   - Update the database environment variables in the Render dashboard accordingly

3. **Custom Domain**
   - If you want to use a custom domain, you'll need to upgrade to a paid plan on Render
   - For the free tier, you'll use the default Render subdomain