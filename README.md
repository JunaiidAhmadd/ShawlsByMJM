# Male Fashion E-commerce Website

A stylish e-commerce website for men's fashion with a Node.js backend.

## Features

- Responsive design
- Product catalog
- Shopping cart functionality
- Blog section
- Contact page

## Backend Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Run the server:
   ```
   npm start
   ```
   
   For development with auto-restart:
   ```
   npm run dev
   ```

3. Access the website:
   Open your browser and navigate to `http://localhost:3000`

## Environment Variables

Create a `.env` file in the root directory with the following variables:
```
PORT=3000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
```

## Project Structure

- `server.js` - Main entry point for the Node.js backend
- `routes/` - Contains all route definitions
- `views/` - EJS templates for server-side rendering
- `public/` - Static assets (CSS, JS, images)
- `models/` - MongoDB models
- `middleware/` - Express middleware functions
- `config/` - Configuration files

## Deployment

This is a full-stack Node.js application and requires a hosting service that supports Node.js backends.

### Option 1: Render.com

1. Create a Git repository (GitHub, GitLab)
2. Sign up at [Render.com](https://render.com)
3. Create a new Web Service:
   - Connect your Git repository
   - Select "Node" as the runtime
   - Build command: `npm install`
   - Start command: `node server.js`
4. Add environment variables in the Render dashboard

### Option 2: Railway

1. Sign up at [Railway.app](https://railway.app)
2. Create a new project
3. Deploy from your GitHub repository
4. Add environment variables
5. Optionally add a MongoDB database from Railway's dashboard

### Option 3: Heroku

1. Install Heroku CLI: `npm install -g heroku`
2. Login: `heroku login`
3. Create a new app: `heroku create your-app-name`
4. Set environment variables: `heroku config:set MONGO_URI=your_mongo_uri SESSION_SECRET=your_secret`
5. Deploy: `git push heroku main`

### File Uploads in Production

This application uses local file storage for uploads. For production, consider using:
- Amazon S3
- Cloudinary
- Firebase Storage

## Original Template

This project is based on a template by Colorlib. For more awesome templates, please visit https://colorlib.com/wp/templates/ 