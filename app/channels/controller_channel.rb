class ControllerChannel < ApplicationChannel
  def subscribed
    push_user(current_user)
  end

  def unsubscribed
    remove_user(current_user)
  end

  def action(data)
    ActionCable.server.broadcast "game_channel", data.merge(player: current_user)
  end
end
