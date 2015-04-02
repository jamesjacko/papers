$(window).bind("load", function() {
  followerType = Math.floor((Math.random() * 3));

  followerObj = {
    moniker: "AH-BOT 897",
    pronoun: "it"
  }
  if(followerType < 2){
    followerObj.moniker = (followerType == 0) ? "Timmy" : "Daisy";
    followerObj.pronoun = (followerType == 0) ? "him" : "her";
  }

  document.getElementById("compName").innerHTML = followerObj.moniker;
  document.getElementById("compName2").innerHTML = followerObj.moniker;
  document.getElementById("compPN").innerHTML = followerObj.pronoun;
  runGame();

});

var go = function(){
  game.paused = false;
  document.getElementById("welcome").style.display = "none";
}

var runGame = function(){

  
  var width = 100;
  var height = 100;
  var counter = 0;

  
  

  game = new Phaser.Game(800, 500, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render });

  game.killedGuys = [];
  game.reactionTimes = [];
  game.followerDistance = 0;
  game.fCount = 0;
  game.bulletCounts = {
    player: 0,
    companion: 0,
    enemies: 0
  }
  /**
    preload the game, mainly for preloading images and the tilemap
  */
  function preload() {
    //game.load.tilemap('desert', createJSON(width, height) , null, Phaser.Tilemap.TILED_JSON);
    game.load.image("background", "images/bg.png");
    game.load.image('goodGuy', 'images/goodGuy.png');
    game.load.image('badGuy', 'images/badGuy.png');
    game.load.image('round', 'images/round.png');
    game.load.image('healthbar', 'images/healthbar.png');
    game.load.image('follower0', 'images/follower_m.png');
    game.load.image('follower1', 'images/follower_f.png');
    game.load.image('follower2', 'images/follower_r.png');
    game.load.image('arrowGreen', 'images/arrowGreen.png');
    game.load.atlasJSONHash('arrow', 'images/arrowNew.png', 'images/arrow.json');
    game.time.advancedTiming = true;

  }

  game.broadcast = function(message){
    objDiv = document.getElementById('game-messages');
    objDiv.getElementsByTagName('p')[0].innerHTML += message + "<br />";
    objDiv.scrollTop = objDiv.scrollHeight;
  }


  var FOLLOWER_AMNT = 1;

  var BAD_GUY_AMNT = 30;
  var map;
  var layer;
  var starttime;

  var cursors;

  function create() {
    starttime = game.time.time;
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //map = game.add.tilemap('desert');

    //map.addTilesetImage('Desert', 'tiles');

    //layer = map.createLayer('Ground');

    //layer.resizeWorld();
    // initialize player and npc groups
    var background = game.add.tileSprite(0, 0, 2000, 2000, "background");
    game.player = new Hero(game, 'goodGuy', false);
    game.player = game.add.existing(game.player);
    game.world.resize(2000,2000);
    
    
    

    document.getElementById("padd").style.backgroundImage = "url('images/profile"+followerType+".jpg')";

    game.follower = new Follower(game, 'follower' + followerType, followerType);
    game.follower = game.add.existing(game.follower);
    game.badGuyGroup = new BadGuys(game, BAD_GUY_AMNT, 'badGuy', followerType);

    game.bullets = game.add.group();
    for(var i = 0; i < 400; i++){
      var bull = new Round('round', null, null);
      game.add.existing(bull);
      bull.kill();
      game.bullets.add(bull);
    }



    // // water and land collision detections
    // map.setTileIndexCallback(1, collide, this, layer);
    // map.setTileIndexCallback(2, collide, this, layer);

    game.killCount = 0;
    game.paused = true;
  }

  // set the object that has collided with water to be on water
  function collide(dude, layer){
    dude.setOnWater(layer.index == 2);
  }

  function update() {
    game.fCount++;
    // send user to survey on death
    if((game.player.health < 1 && !game.player.god)){
      document.getElementById("grats").style.visibility = "visible";
      document.getElementById("gratsScore").innerHTML = (game.follower.health < 1)?  game.killCount - 25 : game.killCount;
      var data = {
        followerType: game.follower.followerType,
        time: game.time.time - starttime,
        score: game.killCount,
        companionSurvived: game.follower.health > 0,
        kills: game.killedGuys,
        reactions: game.reactionTimes,
        aveDistance: game.followerDistance / game.fCount,
        bulletCounts: game.bulletCounts
      }
      var firebaseRef = new Firebase("https://empathygame.firebaseio.com/");
      firebaseRef.push(data);
      game.paused = true;
    } else {
      game.physics.arcade.collide(game.follower, game.follower);
      game.physics.arcade.collide(game.badGuyGroup, game.badGuyGroup);
      // enable tilemap collision
      this.game.physics.arcade.collide(game.player, layer, collide);
    }

    if((game.killCount + 1) % 10 == 0 && game.killCount > 0)
      game.badGuyGroup.moreBadGuys(10, game.killCount);

    if(game.follower.health === 0)
      game.follower.kill();
  
    game.followerDistance += Math.abs(game.physics.arcade.distanceBetween(game.player, game.follower));
  }

  function render() {
    // screen text
    game.debug.text(game.follower.moniker + ' Lives: ' + game.follower.health, 32, 96, 'rgb(0,255,0)');
    game.debug.text('Lives: ' + game.player.health, 32, 64, 'rgb(0,255,0)');
    var follDead = (game.follower.health < 1)? " (-25)": "";
    game.debug.text('Points: ' + game.killCount + follDead, 32, 32, 'rgb(0,255,0)');

  }

};

window.onunload = function(){
  game.destoy(true);
  delete game;
}