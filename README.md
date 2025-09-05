# Ancient Herb: A Wellness Platform

Ancient Herb is a full-stack wellness platform designed to help users track and plan natural healing practices for chronic illnesses.

## Overview

Built a comprehensive wellness management platform leveraging Rails 8's modern stack with SQLite for rapid development and deployment. The system features a normalized relational schema supporting complex many-to-many relationships between users, health metrics, and personalized wellness protocols. Architected with clear separation of concerns and extensible APIs to accommodate planned integrations including ML-driven recommendation engines via RubyLLM and payment processing through Stripe. The codebase emphasizes maintainability through established Rails conventions while supporting horizontal scaling as user growth demands.

## Key Features

*   **User-specific health tracking:** Track your health metrics and wellness plans.
*   **Personalized healing plans:** (Coming soon) Personalized healing recommendations.
*   **Subscription plans:** (Coming soon) Subscription plans for premium features.

## Tech Stack

*   **Backend:** Ruby on Rails 8
*   **Frontend:** Hotwire (Turbo, Stimulus)
*   **Database:** SQLite

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Ruby
*   Rails
*   Node.js
*   Yarn

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/Bryanprz/ancientherb.git
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```
3.  Install Ruby gems
    ```sh
    bundle install
    ```
4.  Run the application
    ```sh
    rails server
    ```

## Future Roadmap

*   **RubyLLM Integration:** for personalized healing recommendations.
*   **Stripe Payments:** for subscription plans.
