# Airport Issue Tracker - Render Deployment Guide

## 🚀 Deployment Steps for Render.com

### Step 1: Set up MongoDB Atlas (Required)

1. **Go to [MongoDB Atlas](https://www.mongodb.com/atlas)**
2. **Create a free account** if you don't have one
3. **Create a new cluster** (choose the free M0 tier)
4. **Set up database access:**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Create a username and password
   - Set privileges to "Read and write to any database"
5. **Set up network access:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Choose "Allow access from anywhere" (0.0.0.0/0)
6. **Get your connection string:**
   - Go to "Clusters"
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string (it looks like: `mongodb+srv://username:password@cluster.mongodb.net/airport_facilities`)

### Step 2: Deploy to Render

1. **Go to [Render.com](https://render.com)**
2. **Sign up/Login** with your GitHub account
3. **Connect your GitHub repository:**
   - Click "New +" → "Web Service"
   - Connect your GitHub account
   - Select the repository: `Ragampudi7/Airport_issue_tracker`

### Step 3: Configure Render Service

#### Basic Settings:
- **Name**: `airport-issue-tracker`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: Leave empty (uses root)
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

#### Environment Variables:
Add these environment variables in the Render dashboard:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/airport_facilities
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
PUBLIC_BASE_URL=https://your-app-name.onrender.com
```

**Important**: Replace the MongoDB URI with your actual Atlas connection string!

### Step 4: Deploy

1. **Click "Create Web Service"**
2. **Wait for deployment** (this may take 5-10 minutes)
3. **Check the logs** for any errors

### Step 5: Test Your Deployment

Once deployed, you'll get a URL like: `https://airport-issue-tracker.onrender.com`

Test these endpoints:
- **Main App**: `https://your-app-name.onrender.com`
- **Health Check**: `https://your-app-name.onrender.com/api/health`
- **SOS Portal**: `https://your-app-name.onrender.com/sos-portal`

## 🔧 Troubleshooting

### Common Issues:

#### 1. MongoDB Connection Error
```
ERROR: MONGODB_URI is not set in the environment.
```
**Solution**: Make sure you've set the MONGODB_URI environment variable in Render dashboard.

#### 2. Build Failures
**Solution**: Check that all dependencies are installed correctly. The build process includes:
- Backend dependencies (`npm install`)
- Frontend dependencies (`cd frontend-angular && npm install`)
- Frontend build (`npm run build`)

#### 3. Frontend Not Loading
**Solution**: Ensure the build command completed successfully and the static files are being served correctly.

### Environment Variables Reference:

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_long_random_secret_key` |
| `PUBLIC_BASE_URL` | Your app's public URL | `https://your-app.onrender.com` |

## 📱 Features Available After Deployment

- ✅ **User Registration & Login**
- ✅ **Staff Dashboard** (Report & Resolve Issues)
- ✅ **Passenger Dashboard** (Report Issues & View Status)
- ✅ **SOS Portal** (Emergency Reporting)
- ✅ **Red/Yellow/Green Status Tracking**
- ✅ **Responsive Design**
- ✅ **REST API Endpoints**

## 🔗 API Endpoints (Production)

Base URL: `https://your-app-name.onrender.com/api`

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /incidents` - Get incidents
- `POST /incidents` - Create incident
- `POST /incidents/:id/claim` - Claim incident (staff)
- `POST /incidents/:id/resolve` - Resolve incident (staff)
- `GET /incidents/meta/categories` - Get categories
- `GET /health` - Health check

## 💡 Tips for Production

1. **Use MongoDB Atlas** for reliable database hosting
2. **Set strong JWT secrets** for security
3. **Monitor your Render logs** for any issues
4. **Test all functionality** after deployment
5. **Keep your MongoDB credentials secure**

## 🆘 Support

If you encounter issues:
1. Check Render deployment logs
2. Verify MongoDB Atlas connection
3. Ensure all environment variables are set
4. Test API endpoints individually

Your Airport Issue Tracker should now be live and accessible to users worldwide! 🎉
