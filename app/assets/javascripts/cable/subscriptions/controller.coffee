$( ->
  if $('.pad').length
    console.log 'initializing controller websocket'
    App.controller = App.cable.subscriptions.create "ControllerChannel",
      connected: ->
        @perform 'set_user', { user: $('.pad').data('username') }
      move: (data) ->
        @perform 'action', { move: data, user: $('.pad').data('username') }

    console.log 'initializing controls'
    $('.control').bind 'touchstart', ->
      App.controller.move($(this).data('action') + '-start')

    $('.holdcontrol').bind 'touchend', ->
      App.controller.move($(this).data('action') + '-end')
)
