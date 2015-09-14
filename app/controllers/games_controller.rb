class GamesController < ApplicationController
  after_action :allow_iframe, only: :show

  def show
    cookies.signed[:game_monitor] = true
  end

private

  def allow_iframe
    response.headers.except! 'X-Frame-Options'
  end
end
