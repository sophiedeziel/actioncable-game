function ActionCableGame (params) {
  this.players_list = new PlayersList();
  this.coins = [];
  this.canvas = document.getElementById('field'),
  this.context = this.canvas.getContext('2d');
  Position.prototype.default_x = $('#game').width() / 2;
  Position.prototype.default_y = $('#game').height() / 2;
  var game = this;

  this.actions = {
    'a-start': function(player){
      player.jump();
    },
    'right-start': function(player) {
      player.start_move_right();
    },
    'right-end': function(player) {
      player.stop_h();
    },
    'left-start': function(player) {
      player.start_move_left();
    },
    'left-end': function(player) {
      player.stop_h();
    }
  }

  window.addEventListener('resize', function(){game.resizeCanvas(game)}, false);

  this.createFrame = function(){
    $.each(game.players_list.get_players(), function(i, player) {
      game.applyGravity(player);
      game.applyFriction(player);
      game.applyBoundaries(player);
    });

    game.drawStuff();

    window.requestAnimationFrame(function() {
      game.canvas.width = game.canvas.width;
      game.createFrame();
    });
  }

  this.drawStuff = function() {
    $.each(game.players_list.get_players(), function(i, player) {
      player.render( game.context );
    });

    hits = [];
    $.each(game.coins, function(i, coin) {
      coin.render( game.context );

      $.each(game.players_list.get_players(), function(j, player) {
        if(CircleInsideRect(coin.position,player.position)) {
          hits.push({ 'player': player, 'coin': coin });
        }
      });
    });
    game.processHits(hits);
  }

  this.processHits = function(hits) {
    $.each(hits, function(i, hit) {
      var coin_index = game.coins.indexOf(hit['coin']);
        if(coin_index != -1) {
          game.coins.splice(coin_index, 1);
          hit['player'].give_points(100);
        }
    });

  }

  this.applyGravity = function(object) {
    var gravity_velocity = 0.5;
    if (object.position.y <= this.canvas.height - 140) {
      object.velY += gravity_velocity;
    } else if( object.velY > 0 ) {
      object.velY = 0;
    }
  }

  this.applyFriction = function(player) {
    var friction_factor = 0.2;
    if (player.velX > 1 && player.velX < player.speed) {
      player.velX -= friction_factor;
    } else if (player.velX < -1 && player.velX > -player.speed) {
      player.velX += friction_factor;
    } else if (player.velX < 1 && player.velX > -1) {
      player.velX = 0;
    }
  }

  this.applyBoundaries = function(player) {
    if (player.position.x >= (game.canvas.width - 135)) {
      player.position.x = game.canvas.width - 136;
      player.velX = 0;
    } else if (player.position.x <= -45 ) {
      player.position.x = -44;
      player.velX = 0;
    }
  }

  this.player_action = function(player_name, control) {
    var player = this.players_list.find(player_name);
    if ( player !== undefined ) {
      this.actions[control](player);
    }
  }

  this.drop_coins = function(number) {
    for(i=0; i < number; i++) {
      this.coins.push(new Coin(random(this.canvas.width),random(this.canvas.height)));
    }
  }

  this.resizeCanvas = function(game_instance) {
    this.canvas.width = $('#game').innerWidth();
    this.canvas.height = $('#game').innerHeight() - $('#players').height();
    this.drawStuff();
  }
  this.createFrame(this);
}

ActionCableGame.prototype.update_players = function(players) {
  var game = this;
  $.each(players.diff(game.players_list.names()), function(i, player_name) {
    var player = game.players_list.find(player_name)
      if(player == null) {
        player = game.players_list.push(player_name);
      }
  });
  $.each(game.players_list.names().diff(players), function(i, player_name) {
    var player = game.players_list.find(player_name)
      game.players_list.remove(player_name);
  });
}

function Coin(x, y) {
  this.position = new Position(x, y);
  var image = new Image();
  image.src = '/assets/coin.png';

  this.render = function (context) {
    context.drawImage(image, this.position.x, this.position.y, 20, 20);
  }
}

function Player(name, color) {
  this.name = name;
  this.score = 0;
  this.color = color;
  this.speed = 10;
  this.velX = 0.0;
  this.velY = 0.0;
  this.position = new Position(Position.prototype.default_x, Position.prototype.default_y);

  var img = new Image();
  var buffer = document.createElement('canvas');
  var bcontext = buffer.getContext('2d');

  img.src = '/assets/moving_player.gif';
  var the_player = this;

  img.onload = function() {
    bcontext.drawImage(this, 0, 0, 175, 175);
    var imageData = bcontext.getImageData(0, 0, 175, 175);
    var pixels = imageData.data;
    var numPixels = imageData.width * imageData.height;
    for (var i = 0; i < numPixels; i++) {
      var r = pixels[i*4];
      var g =  pixels[i*4+1];
      var b = pixels[i*4+2];
      var hsv = [0.0, 0.0, 0.0];
      var rgb = [0, 0, 0];

      RGB2HSV(r, g, b, hsv);
      hsv[0] = hsv[0] + (the_player.color/360.0);
      if (hsv[0] >= 1.0) {
        hsv[0] -= 1.0;
      }

      hsvToRgb(rgb, hsv);
      pixels[i*4] = rgb[0];
      pixels[i*4+1] = rgb[1];
      pixels[i*4+2] = rgb[2];
    };
    buffer.width = buffer.width;
    bcontext.putImageData(imageData, 0, 0);
  };

  this.jump = function(){
    if (this.velY == 0) this.velY -= this.speed * 2;
  }

  this.start_move_right = function() {
    this.velX = this.speed;
  }

  this.start_move_left = function() {
    this.velX = - this.speed;
  }

  this.stop_h = function() {
    this.velX *= 0.8;
  }

  this.give_points = function(points) {
    this.score += points;
    $('li[data-player="'+ this.name +'"] .score').html(this.score);
  }

  this.render = function(context) {
    this.position.x += this.velX;
    this.position.y += this.velY;
    context.drawImage(buffer, this.position.x, this.position.y);
  }
}

function PlayersList() {
  var colors = [0, 90, 180, 270, 45, 135]
  var players = []
  $('#game').append($('<div id="players">'));
  $('#players').append($('<ul id="players-list">'));

  this.get_players = function(){
    return players;
  }

  this.names = function() {
    var array = []
    $.each(players, function(i, player) {
      array.push(player.name);
    });
    return array;
  };
  this.push = function(name) {
    var new_player = new Player(name, colors[players.length]);
    players.push(new_player);
    update_displays();
    return new_player;
  }
  this.find = function(name) {
    var found = null;
    $.each(players, function(i, player) {
      if(name == player.name) { found = player }
    });
    return found;
  }
  this.remove = function(name) {
    $.each(players, function(i, player) {
      if(name == player.name) { players.splice(i, 1) }
    });
    update_displays();
  }

  var update_displays = function() {
    $('#players-list').html('');
    $.each(players, function(i, player) {
      $('#players-list')
        .append($('<li data-player="' + player.name + '" style="-webkit-filter: hue-rotate('+ player.color +'deg)">')
            .append($('<span class="username">').html(player.name))
            .append($('<span class="score">').html(player.score))
            );
    });
    Game.resizeCanvas();
  }
}

function Position(x, y) {
  this.x = (x === undefined) ? Position.prototype.default_x : x;
  this.y = (y === undefined) ? Position.prototype.default_y : y;
}

Array.prototype.diff = function(a) {
  return this.filter(function(i) {return a.indexOf(i) < 0;});
};

Array.prototype.equals = function (array) {
  if (!array)
    return false;

  if (this.length != array.length)
    return false;

  for (var i = 0, l=this.length; i < l; i++) {
    if (this[i] instanceof Array && array[i] instanceof Array) {
      if (!this[i].equals(array[i]))
        return false;
    }
    else if (this[i] != array[i]) {
      return false;
    }
  }
  return true;
}

function CircleInsideRect(circle,rect){
  return(
      circle.x-20>rect.x &&
      circle.x+20<rect.x+175 &&
      circle.y-20>rect.y &&
      circle.y+20<rect.y+175
      )
}

function random(end) {
  return Math.floor(Math.random() * (end)) + 1;
}

function RGB2HSV(r, g, b, hsv) {
  var K = 0.0,
  swap = 0;
  if (g < b) {
    swap = g;
    g = b;
    b = swap;
    K = -1.0;
  }
  if (r < g) {
    swap = r;
    r = g;
    g = swap;
    K = -2.0 / 6.0 - K;
  }
  var chroma = r - (g < b ? g : b);
  hsv[0] = Math.abs(K + (g - b) / (6.0 * chroma + 1e-20));
  hsv[1] = chroma / (r + 1e-20);
  hsv[2] = r;
}

function hsvToRgb(rgb, hsv) {
  var h = hsv[0];
  var s = hsv[1];
  var v = hsv[2];

  // The HUE should be at range [0, 1], convert 1.0 to 0.0 if needed.
  if (h >= 1.0) h -= 1.0;

  h *= 6.0;
  var index = Math.floor(h);

  var f = h - index;
  var p = v * (1.0 - s);
  var q = v * (1.0 - s * f);
  var t = v * (1.0 - s * (1.0 - f));

  switch (index) {
    case 0:
      rgb[0] = v;
      rgb[1] = t;
      rgb[2] = p;
      return;
    case 1:
      rgb[0] = q;
      rgb[1] = v;
      rgb[2] = p;
      return;
    case 2:
      rgb[0] = p;
      rgb[1] = v;
      rgb[2] = t;
      return;
    case 3:
      rgb[0] = p;
      rgb[1] = q;
      rgb[2] = v;
      return;
    case 4:
      rgb[0] = t;
      rgb[1] = p;
      rgb[2] = v;
      return;
    case 5:
      rgb[0] = v;
      rgb[1] = p;
      rgb[2] = q;
      return;
  }
}
