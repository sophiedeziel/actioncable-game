class GamesController < ApplicationController
  def show
    cookies.signed[:game_monitor] = true
  end
end
