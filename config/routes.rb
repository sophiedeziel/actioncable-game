Rails.application.routes.draw do


  resource :game, only: [:show]
  resource :controller, only: [:show]
  resources :sessions, only: [:new, :create]

  root 'sessions#new'

end
