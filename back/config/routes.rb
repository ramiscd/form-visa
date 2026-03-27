Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

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

    get 'applications/current/documents', to: 'documents#index'
    post 'applications/current/documents', to: 'documents#create'
    delete 'documents/:id', to: 'documents#destroy'
    post '/register', to: 'auth#register'
    post "/webhooks/asaas", to: "webhooks#asaas"
  end
end