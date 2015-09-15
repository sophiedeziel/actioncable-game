class GameChannel < ApplicationChannel
  periodically :update_users, every: 3.second
  periodically :drop_coins, every: 5.second

  def subscribed
    stream_from "game_channel"
  end

  private

  def update_users
    ActionCable.server.broadcast "game_channel", { players: players, connection: params }
  end

  def drop_coins
    ActionCable.server.broadcast "game_channel", { coins: rand(2..6) }
  end
end

