class SessionsController < ApplicationController
  def new
  end

  def create
    cookies.signed[:username] = session_params[:username]
  end

  private

  def session_params
    params.require(:session).permit(:username)
  end
end
