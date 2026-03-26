Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
  # config/routes.rb
  # config/routes.rb
  namespace :api do
    post '/login', to: 'auth#login'
    get '/health', to: 'health#index'
    get '/me', to: 'users#me'
    get '/application', to: 'applications#current'
    get '/form_structure', to: 'forms#show'
    post '/answers', to: 'answers#create'
    get '/answers', to: 'answers#index'
    get 'applications/current', to: 'applications#current'
    get 'applications', to: 'applications#admin_index'
    get 'applications/:id', to: 'applications#show'
  end
end
