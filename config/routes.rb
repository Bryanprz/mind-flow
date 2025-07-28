Rails.application.routes.draw do
  resources :lifestyle_plans
  resources :cures
  resources :herbs
  resources :foods
  resources :users
  post 'users/create_from_quiz', to: 'users#create_from_quiz', as: :create_user_from_quiz
  post 'what_is_my_original_nature', to: 'quizzes#start_prakruti_quiz', as: :start_prakruti_quiz
  post 'quiz/answer', to: 'quizzes#answer_question', as: :answer_quiz_question
  post 'quiz/back', to: 'quizzes#go_back_question', as: :go_back_quiz_question
  get 'quiz_results/:quiz_entry_id', to: 'quizzes#show_results', as: :quiz_results
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
