$( ->
  if $('#game').length
    console.log 'initializing log'
    App.game = App.cable.subscriptions.create "GameChannel",
      received: (data) ->
        #$('#log').append($('<p>').html(data['move']))
        if data['players']
          Game.update_players data['players']
)
