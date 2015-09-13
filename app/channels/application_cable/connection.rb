module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
    end

    def find_verified_user
      if current_user = cookies.signed[:username]
        current_user
      else
        reject_unauthorized_connection unless cookies.signed[:game_monitor]
      end
    end
  end
end
