class GameChannel < ApplicationChannel
  periodically :update_users, every: 3.second

  def subscribed
    stream_from "game_channel"
  end

  private

  def update_users
    ActionCable.server.broadcast "game_channel", { players: players, connection: params }
  end

end

