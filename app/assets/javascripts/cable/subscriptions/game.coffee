$( ->
  if $('#game').length
    console.log 'initializing log'
    App.game = App.cable.subscriptions.create "GameChannel",
      received: (data) ->
        if data['move']
          Game.player_action(data['player'], data['move'])
        if data['players']
          Game.update_players data['players']
)
