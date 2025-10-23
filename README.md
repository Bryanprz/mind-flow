# MindFlow - Advanced Mental Training Platform

A sophisticated full-stack Rails 8 and React application for peak mental performance, flow state optimization, and cognitive enhancement through meditation and focus training.

## 🌐 Live Demo

**🔗 [Try MindFlow Now](https://mind-flow-yfaq.onrender.com/)**

Experience the full application with demo data and interactive features.

**Demo Login Credentials:**
- **Email**: `sarah@demo.com` | **Password**: `demo123`
- **Email**: `mike@demo.com` | **Password**: `demo123`  
- **Email**: `emma@demo.com` | **Password**: `demo123`

## 🚀 Overview

MindFlow is a modern web application that combines cutting-edge Rails 8 features with React components to deliver a seamless experience for mental training and focus optimization. Built with performance, scalability, and user experience in mind.

### Recent Enhancements (October 2025)
- ✅ **Real Analytics System** - Replaced demo data with actual aggregations from user habit logs
- ✅ **Goals Management** - Built complete CRUD system for goal tracking with progress visualization
- ✅ **Code Cleanup** - Removed 11 legacy models and 17 unused controllers for cleaner architecture
- ✅ **Demo Data Infrastructure** - Created YAML-based demo system for UI showcases while maintaining real functionality

## ✨ Key Features

### Fully Functional Systems
- **🧠 Habit Tracking** - Complete CRUD system for daily habits with comprehensive logging and streak tracking
- **📊 Real-time Analytics** - Performance metrics aggregated from actual user habit data with Visx visualizations
- **🎯 Goal Management** - Full CRUD for goals with progress tracking, deadline management, and auto-completion
- **👤 User Authentication** - Secure session management with Rails 8 built-in authentication
- **⚡ React Dashboard** - Dynamic, interactive dashboard built with React and Vite
- **📈 Data Visualization** - Interactive charts powered by Visx displaying real user progress
- **📱 Responsive Design** - Mobile-first UI with Tailwind CSS and DaisyUI components

### UI/UX Demonstrations
- **🎨 Learning Hub Interface** - Course browsing UI with demo content (showcase of layout and design patterns)
- **🏆 Achievement Gallery** - Achievement display interface with sample achievements (UI demonstration)

### Technical Features
- **🔄 Real-time Updates** - Turbo Streams for instant UI updates without page refreshes
- **🎭 Accessible Design** - WCAG-compliant with keyboard navigation and screen reader support
- **🌐 Demo Data System** - Comprehensive YAML-based demo data loader for UI showcases
- **🎨 Modern UI/UX** - Glass-morphism effects, gradient designs, and smooth animations

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

**Login to the live demo with these credentials:**

| Email | Password | Profile |
|-------|----------|---------|
| `sarah@demo.com` | `demo123` | Active user with progress |
| `mike@demo.com` | `demo123` | New user starting journey |
| `emma@demo.com` | `demo123` | Advanced user with achievements |

**How to login:**
1. Visit [https://mind-flow-yfaq.onrender.com/](https://mind-flow-yfaq.onrender.com/)
2. Click "Join" or "Sign In" 
3. Use any of the demo credentials above
4. Explore the dashboard, analytics, and goals features

## 🎯 Application Pages & Features

### 🏠 Landing Page
**Style**: Futuristic NASA-inspired design with glass morphism effects
**Functionality**: 
- Hero section with animated flow state visualization
- Performance metrics display with real-time data
- Feature showcase with interactive elements
- Responsive design with mobile-first approach
**Built with**: ERB templates, Tailwind CSS, custom animations

### 🧠 Dashboard (React)
**Style**: Modern glass-morphism cards with gradient backgrounds
**Functionality**:
- Real-time habit tracking with streak counters
- Interactive charts showing progress over time
- Quick action buttons for starting sessions
- Personalized recommendations based on user data
**Built with**: React 18, Vite, Visx charts, Tailwind CSS

### 📊 Analytics Page
**Style**: Data-focused design with professional charts and metrics
**Functionality**:
- Comprehensive performance analytics
- Interactive charts with zoom and filtering
- Export capabilities for data analysis
- Trend analysis with predictive insights
**Built with**: Visx visualization library, React components, real-time data aggregation

### 🎯 Goals Management
**Style**: Clean, task-oriented interface with progress indicators
**Functionality**:
- Full CRUD operations for goal management
- Progress tracking with visual indicators
- Deadline management and notifications
- Goal categorization and filtering
**Built with**: Rails controllers, ERB templates, Stimulus controllers, Tailwind CSS

### 📚 Learning Hub
**Style**: Educational interface with course cards and progress tracking
**Functionality**:
- Course browsing with categories
- Progress tracking for learning modules
- Interactive content with multimedia support
- Achievement system integration
**Built with**: Demo data system, YAML configuration, responsive grid layouts

### 🔔 Notifications
**Style**: Clean notification center with priority indicators
**Functionality**:
- Real-time notification delivery
- Priority-based sorting and filtering
- Mark as read/unread functionality
- Notification history and management
**Built with**: Turbo Streams, Stimulus controllers, real-time updates

### ⚙️ Settings
**Style**: Organized settings panels with clear navigation
**Functionality**:
- User profile management
- Privacy and security settings
- Notification preferences
- Data export and account management
**Built with**: Rails forms, validation, secure data handling

## 📁 Project Structure

```
mind-flow/
├── app/
│   ├── controllers/      # Request handling and business logic
│   │   ├── goals_controller.rb         # Full CRUD for goals
│   │   ├── habit_plans_controller.rb   # Habit tracking with logging
│   │   └── dashboards_controller.rb    # Main dashboard
│   ├── models/           # Data models and ActiveRecord
│   │   ├── goal.rb                     # Goal management (NEW)
│   │   ├── habit_plan.rb               # Habit plans
│   │   ├── habit_log.rb                # Daily habit logs
│   │   └── user.rb                     # User authentication
│   ├── views/            # ERB templates and partials
│   │   ├── goals/                      # Goal CRUD views (NEW)
│   │   ├── home/                       # Landing page partials
│   │   └── dashboards/                 # Dashboard components
│   ├── javascript/       # React components & Stimulus
│   │   ├── components/                 # React components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── HabitPlanView.jsx
│   │   │   └── dashboard/StatisticsChart.jsx
│   │   └── controllers/                # Stimulus controllers
│   ├── services/         # Business logic services
│   │   ├── analytics_service.rb        # Real data aggregation (NEW)
│   │   └── demo_data_loader.rb         # Demo UI data
│   └── assets/           # CSS and images
│       └── stylesheets/
│           ├── accessibility.css       # WCAG compliance
│           └── components/home.css     # Landing page styles
├── config/
│   ├── routes.rb         # Application routing
│   ├── database.yml      # Multi-database configuration
│   └── demo_data/        # YAML demo files for UI showcases
├── db/
│   ├── migrate/          # Database migrations
│   ├── schema.rb         # Current database schema
│   └── seeds/            # Demo data generation
└── test/                 # Test suite
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

## 📊 Data Architecture

### Real Data Systems
The following features use actual database records:
- **Habit Tracking** - `HabitPlan`, `HabitLog`, `PlanItem` models with full persistence
- **Analytics** - Aggregated from real habit logs via `AnalyticsService`
- **Goals** - Complete CRUD with `Goal` model storing all user goals

### Demo Data System (UI Showcases)
For UI demonstrations, the application includes a YAML-based demo system:

**Demo Data Files:**
- `courses.yml` - Learning courses for UI showcase
- `achievements.yml` - Achievement gallery for UI showcase

**DemoDataLoader Service:**
- Loads YAML data files for UI demonstrations
- Converts keys to symbols for consistency
- Provides default values when files missing
- Handles errors gracefully

**Note**: Demo features showcase UI/UX capabilities and design patterns. The core functionality (habits, analytics, goals) uses real database persistence.

## 🔒 Security

- **CSRF Protection** - Built-in Rails CSRF tokens
- **SQL Injection Prevention** - Parameterized queries
- **XSS Protection** - Content escaping
- **Secure Sessions** - Encrypted session cookies
- **Content Security Policy** - CSP headers configured

## 🚀 Deployment

Configured for deployment on:
- **Render** - Production deployment configuration included
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
*Last Updated: October 2025*
