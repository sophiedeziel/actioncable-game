@App = {}
App.cable = Cable.createConsumer 'ws://10.0.1.17:28080'
