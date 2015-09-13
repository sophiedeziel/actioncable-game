class GameChannel < ApplicationChannel
  periodically :update_users, every: 1.second

  def subscribed
    stream_from "game_channel"
  end

  private

  def update_users
    ActionCable.server.broadcast "game_channel", { players: players}
  end

end

