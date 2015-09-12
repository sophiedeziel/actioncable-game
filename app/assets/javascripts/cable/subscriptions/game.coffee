$( ->
  if $('#log').length
    console.log 'initializing log'
    App.game = App.cable.subscriptions.create "GameChannel",
      received: (data) ->
        console.log(data)
        $('#log').append($('<p>').html(data['data']))

)
