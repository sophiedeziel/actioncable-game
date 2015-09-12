$( ->
  if $('.pad').length
    console.log 'initializing controller websocket'
    App.controller = App.cable.subscriptions.create "ControllerChannel",
      move: (data) ->
        @perform 'action', { data: data, user: $('.pad').data('username') }

    console.log 'initializing controls'
    $('.control').bind 'touchstart', ->
      App.controller.move($(this).data('action') + '-start')

    $('.holdcontrol').bind 'touchend', ->
      App.controller.move($(this).data('action') + '-end')
)
