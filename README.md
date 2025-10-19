# MindFlow - Advanced Mental Training Platform

A sophisticated full-stack Rails 8 application for peak mental performance, flow state optimization, and cognitive enhancement through meditation and focus training.

## 🚀 Overview

MindFlow is a modern web application that combines cutting-edge Rails 8 features with React components to deliver a seamless experience for mental training and focus optimization. Built with performance, scalability, and user experience in mind.

## ✨ Key Features

### Core Functionality
- **🧠 Advanced Focus Training** - Track meditation sessions, monitor attention spans, and optimize mental clarity
- **📊 Real-time Analytics** - Comprehensive performance metrics with interactive visualizations using Visx
- **🎯 Goal Management** - Set, track, and achieve cognitive performance goals with progress visualization
- **📚 Learning Hub** - Curated courses and resources for mindfulness and flow state mastery
- **🏆 Achievement System** - Gamified progress tracking with earned achievements and milestones
- **👤 User Authentication** - Secure session management with Rails 8 authentication
- **📱 Responsive Design** - Mobile-first UI with Tailwind CSS and DaisyUI components

### Technical Features
- **⚡ React Dashboard** - Dynamic, interactive dashboard built with React and Vite
- **🎨 Modern UI/UX** - Glass-morphism effects, gradient designs, and smooth animations
- **📈 Data Visualization** - Interactive charts powered by Visx for performance tracking
- **🔄 Real-time Updates** - Turbo Streams for instant UI updates without page refreshes
- **🎭 Accessible Design** - WCAG-compliant with keyboard navigation and screen reader support
- **🌐 Demo Mode** - Comprehensive demo data system for showcasing capabilities

## 🛠 Tech Stack

### Backend
- **Ruby on Rails 8.0** - Latest Rails with Solid Queue and Solid Cache
- **SQLite** - Multi-database setup (primary, queue, cache, cable)
- **Active Storage** - File upload and processing with VIPS
- **Action Cable** - WebSocket support for real-time features
- **Solid Queue** - Modern background job processing

### Frontend
- **React 18** - Component-based UI with hooks and modern patterns
- **Vite** - Lightning-fast build tool with HMR
- **Hotwire** - Turbo and Stimulus for enhanced interactivity
- **Tailwind CSS 3** - Utility-first CSS framework
- **DaisyUI** - Pre-built component library
- **Visx** - Low-level visualization components for complex charts

### Development Tools
- **Foreman** - Process manager for development server
- **Brakeman** - Security vulnerability scanner
- **RuboCop** - Ruby code style checker
- **ESLint** - JavaScript linter
- **Minitest** - Testing framework with system tests

## 🏗 Architecture Highlights

### Modern Rails 8 Features
- **Solid Queue** - Built-in job processing without Redis
- **Solid Cache** - Efficient caching layer
- **Multi-database Support** - Separate databases for different concerns
- **Asset Pipeline** - Propshaft for modern asset management
- **Authentication** - Built-in authentication system

### Code Organization
- **Service Objects** - `DemoDataLoader` for data management
- **Reusable Partials** - Component-based view architecture
- **Stimulus Controllers** - Modular JavaScript functionality
- **React Components** - Complex interactive features
- **Database Normalization** - Well-designed relational schema

### Performance Optimizations
- **Lazy Loading** - Components load on demand
- **Asset Optimization** - Minified CSS/JS bundles
- **Database Indexing** - Optimized query performance
- **Caching Strategy** - Fragment and page caching
- **Turbo Frames** - Partial page updates

## 🚦 Getting Started

### Prerequisites

- Ruby 3.3.0+
- Rails 8.0+
- Node.js 18+
- SQLite 3.x

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Bryanprz/mind-flow.git
   cd mind-flow
   ```

2. **Install dependencies**
   ```bash
   bundle install
   npm install
   ```

3. **Setup database**
   ```bash
   rails db:create
   rails db:migrate
   rails db:seed
   ```

4. **Start the development server**
   ```bash
   bin/dev
   ```
   
   This command starts:
   - Rails server (port 3000)
   - Vite dev server with HMR
   - Tailwind CSS watcher

5. **Access the application**
   - Navigate to `http://localhost:3000`
   - Demo credentials:
     - Email: `sarah@demo.com`
     - Password: `demo123`

### Demo Users

Three users with sample data:
- `sarah@demo.com` / `demo123` - Active user with progress
- `mike@demo.com` / `demo123` - New user starting journey
- `emma@demo.com` / `demo123` - Advanced user with achievements

## 📁 Project Structure

```
mind-flow/
├── app/
│   ├── controllers/       # MVC controllers
│   ├── models/            # ActiveRecord models
│   ├── views/             # ERB templates & partials
│   ├── javascript/        # React components & Stimulus
│   │   ├── components/    # React components
│   │   ├── controllers/   # Stimulus controllers
│   │   └── entrypoints/   # Vite entry points
│   ├── services/          # Business logic services
│   ├── jobs/              # Background jobs
│   └── assets/            # CSS and images
├── config/
│   ├── demo_data/         # YAML demo data files
│   ├── routes.rb          # Application routes
│   └── database.yml       # Multi-DB configuration
├── db/
│   ├── migrate/           # Database migrations
│   ├── schema.rb          # Current schema
│   └── seeds/             # Seed data scripts
└── test/                  # Test suite
```

## 🎨 Design Features

### Visual Design
- **Futuristic Aesthetic** - NASA-inspired typography and space themes
- **Glass Morphism** - Translucent cards with backdrop blur
- **Gradient Effects** - Dynamic color transitions
- **Dark Mode** - Optimized for low-light environments
- **Responsive Layout** - Adapts from mobile to desktop

### Accessibility
- **Keyboard Navigation** - Full keyboard support
- **Screen Reader** - ARIA labels and semantic HTML
- **High Contrast** - Optimized for contrast preferences
- **Reduced Motion** - Respects user motion preferences
- **Focus Management** - Clear focus indicators

## 🧪 Testing

```bash
# Run all tests
rails test

# Run system tests
rails test:system

# Run specific test file
rails test test/models/user_test.rb

# Check code quality
rubocop
brakeman
```

## 📊 Demo Data System

The application includes a comprehensive demo data system:

### Demo Data Files
- `focus_sessions.yml` - Historical session data
- `active_goals.yml` - User goals with progress
- `courses.yml` - Learning courses
- `performance_metrics.yml` - Analytics data
- `achievements.yml` - Earned achievements

### DemoDataLoader Service
- Loads YAML data files
- Converts keys to symbols
- Provides default values
- Handles errors gracefully

## 🔒 Security

- **CSRF Protection** - Built-in Rails CSRF tokens
- **SQL Injection Prevention** - Parameterized queries
- **XSS Protection** - Content escaping
- **Secure Sessions** - Encrypted session cookies
- **Content Security Policy** - CSP headers configured

## 🚀 Deployment

Configured for deployment on:
- **Kamal** - Deployment configuration included
- **Docker** - Dockerfile ready for containerization
- **Cloud Platforms** - Compatible with Heroku, Render, Fly.io

## 🤝 Contributing

This is a portfolio project, but feedback and suggestions are welcome!

## 📝 License

All rights reserved - Portfolio demonstration project

## 👨‍💻 About the Developer

Built by **Bryan Perez**, a full-stack developer passionate about creating performant, accessible web applications with modern technologies.

### Technical Highlights
- Rails 8 early adopter with Solid Queue/Cache
- React expertise with modern hooks and patterns
- Performance optimization and code organization
- Accessibility-first development approach
- Clean, maintainable architecture

## 📧 Contact

Interested in discussing this project or similar work?

- **Email**: bryan.perez.dev@gmail.com
- **LinkedIn**: [linkedin.com/in/bryanprz](https://www.linkedin.com/in/bryanprz/)
- **Portfolio**: [bryanperezocampo.com](http://bryanperezocampo.com/)

## 🙏 Acknowledgments

- Built with Ruby on Rails 8
- React and Vite for modern frontend
- Tailwind CSS and DaisyUI for styling
- Visx for data visualization
- Heroicons for UI icons

---

**Built with** ❤️ **using Rails 8 and React**

*Last Updated: October 2025*
