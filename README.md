# MindMetrics - Wellness Habit Tracker (Demo)

> **⚠️ Important Notice**: This is a **sanitized demo repository** created for portfolio demonstration purposes. All proprietary logic, real user data, and production configurations have been removed or replaced with demo equivalents.

## Overview

MindMetrics is a full-stack Rails 8 wellness application that helps users track daily habits, visualize progress, and maintain accountability in their wellness journey. This demo showcases the application architecture, UI/UX design, and technical capabilities while protecting proprietary information.

## Key Features (Demo)

### ✅ Fully Functional
- **Habit Tracking**: Daily logging of wellness habits (sleep, meditation, exercise, nutrition)
- **Progress Visualization**: Streak tracking, completion metrics, and trend analysis
- **User Authentication**: Secure login and session management
- **Dashboard**: Personalized wellness metrics and insights
- **Responsive Design**: Mobile-first UI with Tailwind CSS

### 🎨 UI Demonstrations Only
- **Community Feed**: Social post interface (static demo data)
- **Messaging**: Chat interface (static demo conversations)
- **AI Wellness Tips**: Canned responses instead of real AI integration

## Tech Stack

- **Backend**: Ruby on Rails 8.0
- **Frontend**: Hotwire (Turbo, Stimulus), Tailwind CSS
- **Database**: SQLite (with multi-database support)
- **Job Processing**: Solid Queue
- **Real-time**: Action Cable (demo mode)
- **Storage**: Local disk (Active Storage)

## Architecture Highlights

- **Modern Rails 8**: Leverages latest Rails features including Solid Queue and Solid Cache
- **Clean MVC Pattern**: Well-organized controllers, models, and views
- **Service Objects**: Encapsulated business logic for complex operations
- **Database Normalization**: Proper relational schema with foreign keys
- **RESTful API Design**: Standard Rails conventions throughout

## Getting Started

### Prerequisites

- Ruby 3.2+
- Rails 8.0+
- Node.js 18+ (for asset compilation)
- SQLite 3.x

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/mind-metrics.git
   cd mind-metrics
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

5. **Access the application**
   - Open your browser to `http://localhost:3000`
   - Login with demo credentials:
     - Email: `sarah@demo.com`
     - Password: `demo123`

### Demo Users

Three demo users are pre-configured with sample data:
- `sarah@demo.com` / `demo123`
- `mike@demo.com` / `demo123`
- `emma@demo.com` / `demo123`

## Project Structure

```
app/
├── controllers/      # Request handling and business logic
├── models/           # Data models and ActiveRecord
├── views/            # ERB templates and partials
├── javascript/       # Stimulus controllers
├── jobs/             # Background job processing
└── services/         # Business logic services

config/
├── routes.rb         # Application routing
├── database.yml      # Database configuration
└── initializers/     # App initialization

db/
├── migrate/          # Database migrations
├── schema.rb         # Current database schema
└── seeds/            # Demo data seeds

lib/
└── demo_stubs/       # Stubbed services for demo mode
```

## Demo Mode Limitations

This demo version has the following limitations:

### Removed Features
- ❌ Real-time AI wellness recommendations (uses canned responses)
- ❌ Cloud storage integration (uses local disk only)
- ❌ Private messaging backend (UI demonstration only)
- ❌ Social post creation backend (UI demonstration only)
- ❌ Admin panel functionality
- ❌ Production deployment configurations
- ❌ Third-party API integrations

### Stubbed Services
- `lib/demo_stubs/ai_service.rb` - Returns preset wellness tips
- `lib/demo_stubs/recommendation_engine.rb` - Generic habit suggestions
- `lib/demo_stubs/messaging_service.rb` - Demo mode notifications

## Testing

Run the test suite:
```bash
rails test
rails test:system
```

## Code Quality

- **Linting**: Rubocop with Rails Omakase style guide
- **Security**: Brakeman for vulnerability scanning
- **Type Safety**: Strong parameters and input validation
- **Test Coverage**: Model and integration tests

## Development Workflow

1. Create feature branch
2. Implement changes
3. Run tests and linters
4. Commit with descriptive message
5. Push and create pull request

## Environment Variables

For local development, no environment variables are required. All configurations use sensible defaults and local storage.

For production deployment (not included in demo):
- `RAILS_MASTER_KEY` - Rails credentials encryption key
- `SECRET_KEY_BASE` - Session encryption key
- `DATABASE_URL` - Production database connection

## Contributing

This is a demo repository and is not open for contributions. However, feel free to fork it for your own learning purposes.

## License

This is a portfolio demonstration project. All rights reserved.

## Contact

For questions about this demo or to discuss the full application:
- Email: your.email@example.com
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)
- Portfolio: [Your Website](https://yourwebsite.com)

## Acknowledgments

- Built with Ruby on Rails 8
- UI components inspired by modern wellness apps
- Icons from Heroicons
- Demo data is fictional and generated for demonstration purposes

---

**Last Updated**: October 2025

*This demo showcases technical capabilities while respecting proprietary information. The production version includes additional features, optimizations, and integrations not shown here.*
