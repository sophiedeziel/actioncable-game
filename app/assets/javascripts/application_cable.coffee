@App = {}
App.cable = Cable.createConsumer 'ws://game.sophiedeziel.com:8020'
