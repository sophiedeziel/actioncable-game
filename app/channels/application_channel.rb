class ApplicationChannel < ApplicationCable::Channel

  private

  def players
    JSON.parse(redis.get('connected-users') || [].to_json)
  end

  def push_user(user)
    redis.set('connected-users', (players + [user]).to_json)
  end

  def remove_user(user)
    redis.set('connected-users', (players - [user]).to_json)
  end

  def redis
    @redis ||= Redis.new((YAML.load(ERB.new(Rails.root.join('config/redis/cable.yml').read).result) || {})[Rails.env] || {})
  end
end

