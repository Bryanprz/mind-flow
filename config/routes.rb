Rails.application.routes.draw do
  resource :session
  resources :passwords, param: :token
  resources :lifestyle_plans
  resources :cures
  resources :herbs
  resources :foods
  resources :users, except: [:show]
  post 'users/create_from_assessment', to: 'users#create_from_assessment', as: :create_user_from_assessment
  post 'what_is_my_original_nature', to: 'health_assessments#start_prakruti_assessment', as: :start_prakruti_assessment
  post 'assessment/answer', to: 'health_assessments#answer_question', as: :answer_assessment_question
  post 'assessment/back', to: 'health_assessments#go_back_question', as: :go_back_assessment_question

  # Profile route (works for both guests and logged-in users)
  get 'self', to: 'users#show', as: :self_profile
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  root "dashboard#index"
end
