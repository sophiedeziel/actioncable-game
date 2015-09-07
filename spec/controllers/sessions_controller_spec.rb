require 'rails_helper'

RSpec.describe SessionsController, type: :controller do
  describe 'GET #new' do
    it "renders the new template" do
      get :new
      expect(response).to be_successful
      expect(response).to render_template :new
    end
  end

  describe 'POST #create' do
    it 'stores a username in a signed cookie' do
      post :create, session: { username: "dude" }
      expect(cookies.signed[:username]).to eq "dude"
    end

    it "renders the create template" do
      post :create, session: { username: "dude" }
      expect(response).to redirect_to controller_path
    end
  end
end
