Rails.application.routes.draw do
  # Importmap routes
  mount Importmap::Engine => "/importmap"
  
  # Active Storage direct uploads
  direct :rails_direct_uploads do
    "/rails/active_storage/direct_uploads"
  end
  
  # Demo routes for UI demonstration (no backend functionality)
  get "/community", to: "pages#demo_community", as: :demo_community
  get "/messages", to: "pages#demo_messages", as: :demo_messages
  get "/saved_posts", to: "pages#demo_saved_posts", as: :demo_saved_posts
  
  # Habit tracking routes
  resources :habit_logs
  resources :habit_plans, except: [:new, :show] do
    collection do
      post 'log_item_progress'
      post 'save_journal_log'
      post 'create_daily_log'
    end
  end
  resource :habit_plan, only: [:show], as: :my_habit_plan

  # Core app routes
  resource :dashboard, only: [:show]
  resource :session
  resources :passwords, param: :token
  resources :users, param: :slug do
    member do
      patch :attach_avatar
      patch :attach_cover_image
    end
  end
  
  # MindFlow Navigation Pages
  get '/analytics', to: 'pages#analytics', as: :analytics
  get '/goals', to: 'pages#goals', as: :goals
  get '/learning', to: 'pages#learning', as: :learning
  get '/notifications', to: 'pages#notifications', as: :notifications
  get '/settings', to: 'pages#settings', as: :settings
  delete '/logout', to: 'sessions#destroy', as: :logout
  
  # Newsletter routes
  resources :newsletters, only: [:create]
  get 'newsletters/unsubscribe', to: 'newsletters#unsubscribe', as: :unsubscribe_newsletter

  # AI chat (demo mode with canned responses)
  post 'ai/ask', to: 'ai#ask'

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Test route for exception notifications - raises an exception to test email alerts
  get "fail" => "application#test_exception"

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Static pages
  get "terms-of-service", to: "pages#terms_of_service", as: :terms_of_service
  get "privacy-policy", to: "pages#privacy_policy", as: :privacy_policy
  get "contact-us", to: "pages#contact_us", as: :contact_us
  get 'profile', to: 'users#show', as: :profile

  # Defines the root path route ("/")
  root "home#index"
end