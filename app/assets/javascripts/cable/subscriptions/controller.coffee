App.controller = App.cable.subscriptions.create "ControllerChannel",
   move: (data) ->
    @perform 'action', { data: data, user: $('.pad').data('username') }

$( ->
  $('.control').bind 'touchstart mousedown', ->
    console.log($(this).data('action'))
    App.controller.move($(this).data('action'))

)
