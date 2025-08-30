Rails.application.routes.draw do
  namespace :admin do
    root "dashboard#index"
    resources :foods
    resources :users do
      resources :healing_plans
      resources :healing_plan_foods
    end
  end

  resources :verses
  resources :books
  resource :dashboard, only: [:show]
  resource :session
  resources :passwords, param: :token
  resources :lifestyle_plans
  resources :cures
  resources :herbs
  resources :foods
  resources :users
  resources :healing_plans

  # Assessment routes
  post 'original_nature_assessment', to: 'health_assessments#start_prakruti_assessment', as: :start_prakruti_assessment
  post 'current_imbalance_assessment', to: 'health_assessments#start_vikruti_assessment', as: :start_vikruti_assessment

  post 'assessment/answer', to: 'health_assessments#answer_question', as: :answer_assessment_question
  post 'assessment/back', to: 'health_assessments#go_back_question', as: :go_back_assessment_question
  post 'assessment/submit', to: 'health_assessments#submit_answers', as: :submit_assessment_answers
  get 'assessment/results', to: 'health_assessments#show_results', as: 'assessment_results'

  get 'profile', to: 'users#show', as: :profile
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  root "home#index"
end
