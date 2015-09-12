class ControllerChannel < ApplicationCable::Channel
  def action(data)
    ActionCable.server.broadcast "game_channel", data
  end
end
