window.onload = function() {
  var width = 100;
  var height = 100;
  var counter = 0;
  game = new Phaser.Game(800, 500, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render });

  /**
    preload the game, mainly for preloading images and the tilemap
  */
  function preload() {
    game.load.tilemap('desert', createJSON(width, height) , null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'images/new_map.png');
    game.load.image('car', 'images/car90.png');
    game.load.image('goodGuy', 'images/goodGuy.png');
    game.load.image('badGuy', 'images/badGuy.png');
    game.load.image('ball', 'images/heading.png');
    game.load.image('round', 'images/round.png');
    game.load.image('mine', 'images/mine.png');
    game.load.image('healthbar', 'images/healthbar.png');
    game.load.image('follower0', 'images/follower_m.png');
    game.load.image('follower1', 'images/follower_f.png');
    game.load.image('follower2', 'images/follower_r.png');
    game.load.image('arrow', 'images/arrow.png');
    game.time.advancedTiming = true;

  }

  game.broadcast = function(message){
    objDiv = document.getElementById('game-messages');
    objDiv.getElementsByTagName('p')[0].innerHTML += message + "<br />";
    objDiv.scrollTop = objDiv.scrollHeight;
  }


  var FOLLOWER_AMNT = 1;

  var BAD_GUY_AMNT = 20;
  var map;
  var layer;
  var starttime;

  var cursors;

  function create() {
    starttime = game.time.time;
    game.physics.startSystem(Phaser.Physics.ARCADE);

    map = game.add.tilemap('desert');

    map.addTilesetImage('Desert', 'tiles');

    layer = map.createLayer('Ground');

    layer.resizeWorld();
    // initialize player and npc groups
    game.player = new Hero(game, 'goodGuy', false);
    game.player = game.add.existing(game.player);
    
    var followerType = Math.floor((Math.random() * 3));

    game.follower = new Follower(game, 'follower' + followerType, i);
    game.follower = game.add.existing(game.follower);
    game.badGuyGroup = new BadGuys(game, BAD_GUY_AMNT, 'badGuy', followerType);

    // water and land collision detections
    map.setTileIndexCallback(1, collide, this, layer);
    map.setTileIndexCallback(2, collide, this, layer);

    game.killCount = 0;

  }

  // set the object that has collided with water to be on water
  function collide(dude, layer){
    dude.setOnWater(layer.index == 2);
  }

  function update() {
    // send user to survey on death
    if((game.player.health < 1 && !game.player.god)){
      alert("You died");
      console.log(game.time.time - starttime)
      var data = {
        time: game.time.time - starttime,
        score: game.killCount,
        companionSurvived: game.follower.health > 0,
        
      }
      game.paused = true;
    } else {
      game.physics.arcade.collide(game.follower, game.follower);
      game.physics.arcade.collide(game.badGuyGroup, game.badGuyGroup);
      // enable tilemap collision
      this.game.physics.arcade.collide(game.player, layer, collide);
    }

    if(game.killCount % 10 == 0 && game.killCount > 0)
      game.badGuyGroup.addBadGuys(10 + killCount / 10);
  

  }

  function render() {
    // screen text
    game.debug.text(game.follower.moniker + ' Lives: ' + game.follower.health, 32, 96, 'rgb(0,255,0)');
    game.debug.text('Lives: ' + game.player.health, 32, 64, 'rgb(0,255,0)');
    var follDead = (game.follower.health < 1)? " (-25)": "";
    game.debug.text('Points: ' + game.killCount + follDead, 32, 32, 'rgb(0,255,0)');

  }

};