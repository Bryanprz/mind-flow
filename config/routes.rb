Rails.application.routes.draw do
  resources :chronic_illnesses
  namespace :admin do
    root "dashboard#index"
    
    resources :users do
      resources :healing_plans
    end
  end

  resources :verses
  resources :books
  resource :dashboard, only: [:show]
  resource :session
  resources :passwords, param: :token
  resources :lifestyle_plans
  resources :cures
  
  
  resources :users
  resources :healing_plans, except: [:new, :show] do
    collection do
      post 'log_item_progress'
      post 'save_journal_log'
      post 'create_daily_log'
    end
  end
  resource :healing_plan, only: [:show], as: :my_healing_plan

  # Assessment routes
  get 'prakruti_assessment_intro', to: 'health_assessments#intro_prakruti_assessment', as: :prakruti_assessment_intro
  get 'vikruti_assessment_intro', to: 'health_assessments#intro_vikruti_assessment', as: :vikruti_assessment_intro

  get '/start_prakruti_assessment', to: 'health_assessments#start_prakruti_assessment', as: :start_prakruti_assessment
  get '/start_vikruti_assessment', to: 'health_assessments#start_vikruti_assessment', as: :start_vikruti_assessment

  post 'assessment/answer', to: 'health_assessments#answer_question', as: :answer_assessment_question
  post 'assessment/back', to: 'health_assessments#go_back_question', as: :go_back_assessment_question
  post 'health_assessments/:health_assessment_id/submit_answers', to: 'health_assessments#submit_answers', as: :health_assessment_submit_answers
  get 'assessment/results', to: 'health_assessments#show_results', as: 'assessment_results'
  get 'assessment/current_imbalance_results', to: 'health_assessments#current_imbalance_results', as: 'current_imbalance_results'

  get 'profile', to: 'users#show', as: :profile

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  root "home#index"
end
