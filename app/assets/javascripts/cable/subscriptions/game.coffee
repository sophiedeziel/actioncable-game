$( ->
  if $('#log').length
    console.log 'initializing log'
    App.game = App.cable.subscriptions.create "GameChannel",
      received: (data) ->
        $('#log').append($('<p>').html(data['move']))
        if data['players']
          $('#players-list').html('')
          $.each data['players'], (i,player) ->
            $('#players-list').append($('<li>').html(player))

    $('#log').append($('<div id="players">').append('Players List'))
    $('#players').append($('<ul id="players-list">'))
)
