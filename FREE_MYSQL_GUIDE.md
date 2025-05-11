# Free MySQL Database Setup Guide

## Clever Cloud Setup (Free MySQL Database)

1. **Create a Clever Cloud Account**
   - Visit [Clever Cloud](https://www.clever-cloud.com/)
   - Sign up for a free account
   - Verify your email address

2. **Create a New MySQL Add-on**
   - Go to your organization dashboard
   - Click "Create" > "An add-on"
   - Select "MySQL"
   - Choose "DEV" (free) plan
   - Name your database (e.g., `pet_hotel`)
   - Click "Create"

3. **Set Up Database Schema**
   - In your add-on dashboard, find the connection information
   - Use MySQL Workbench or similar tool to connect
   - Import your schema from `backend/database.sql`

4. **Get Connection Details**
   - In your add-on dashboard, find:
     - `MYSQL_ADDON_HOST` (DB_HOST)
     - `MYSQL_ADDON_USER` (DB_USER)
     - `MYSQL_ADDON_PASSWORD` (DB_PASSWORD)
     - `MYSQL_ADDON_DB` (DB_NAME)

5. **Free Tier Limitations**
   - 256MB storage
   - 5 concurrent connections
   - Shared resources

## Update Deployment Configuration

1. **Update Environment Variables**
   - Go to your Render.com dashboard
   - Select your backend service
   - Click "Environment"
   - Update the following variables with your database credentials:
     ```
     DB_HOST=[Your database host]
     DB_USER=[Your database username]
     DB_PASSWORD=[Your database password]
     DB_NAME=[Your database name]
     ```

2. **Deploy Changes**
   - After updating the environment variables
   - Render will automatically redeploy your service
   - Monitor the deployment logs for any database connection issues

## Important Notes

1. **Security**
   - Never commit database credentials to your repository
   - Use environment variables for all sensitive information
   - Regularly rotate database passwords

2. **Backup**
   - Both services provide automated backups
   - PlanetScale offers point-in-time recovery
   - Clever Cloud provides daily backups

3. **Performance**
   - Choose the region closest to your application
   - Monitor database usage to stay within free tier limits
   - Consider upgrading if you need more resources