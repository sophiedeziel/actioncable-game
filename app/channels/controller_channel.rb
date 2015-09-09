class ControllerChannel < ApplicationCable::Channel

  def action(data)
    puts data
  end

  def message(data)
    puts data
  end

  def move(data=nil)
    puts data
  end
end