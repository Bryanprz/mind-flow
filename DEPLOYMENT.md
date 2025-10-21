# MindFlow Deployment Guide

## 🚀 Deploy to Render

### Prerequisites
- GitHub repository with your code
- Render account (free)

### Step 1: Prepare Your App
The app is already configured for Render deployment with:
- ✅ `render.yaml` configuration
- ✅ `bin/render-build.sh` build script
- ✅ PostgreSQL for production
- ✅ SQLite for development
- ✅ Puma configuration optimized for Render

### Step 2: Deploy on Render

#### 1. Sign Up
- Go to [render.com](https://render.com)
- Sign up with GitHub

#### 2. Create Web Service
- Click "New +" → "Web Service"
- Connect your GitHub repository
- Select your MindFlow repository

#### 3. Configure Service
- **Name**: `mindflow`
- **Environment**: `Ruby`
- **Build Command**: `./bin/render-build.sh`
- **Start Command**: `bundle exec puma -C config/puma.rb`

#### 4. Add Environment Variables
- `RAILS_MASTER_KEY`: (copy from `config/master.key`)
- `RAILS_ENV`: `production`

#### 5. Add Database
- Click "New +" → "PostgreSQL"
- Name: `mindflow-db`
- Connect to your web service

#### 6. Deploy
- Click "Create Web Service"
- Render will build and deploy automatically
- Get your URL: `https://mindflow.onrender.com`

### Step 3: Set Up Database
After deployment, run database setup:
1. Go to your service dashboard
2. Click "Shell"
3. Run: `bundle exec rails db:seed`

### Step 4: Test Your App
- Visit your URL: `https://mindflow.onrender.com`
- Test all features
- Check database connections

## 🔧 Configuration Details

### Database Setup
- **Development**: SQLite (local)
- **Production**: PostgreSQL (Render)
- **Automatic**: Database URL from environment

### Build Process
1. Install dependencies (`bundle install`)
2. Run migrations (`rails db:migrate`)
3. Precompile assets (`rails assets:precompile`)

### Performance
- **Workers**: 2 (configurable via `WEB_CONCURRENCY`)
- **Threads**: 3 per worker
- **Memory**: Optimized with `preload_app!`

## 🆓 Free Tier Limits
- **750 hours/month** (not 24/7)
- **App sleeps** when inactive
- **Wakes up** when someone visits (30 seconds)
- **Perfect for**: Testing and low-traffic use

## 💰 Upgrade Options
- **Starter Plan**: $7/month (always on)
- **Standard Plan**: $25/month (more resources)

## 🎉 You're Done!
Your MindFlow app is now live with:
- ✅ Free hosting
- ✅ PostgreSQL database
- ✅ HTTPS certificate
- ✅ Automatic deployments
- ✅ No credit card required
