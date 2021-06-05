Rails.application.routes.draw do
  resources :node_links
  resources :links
  resources :nodes
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
