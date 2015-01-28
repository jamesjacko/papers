/*
 * BadGuy Class, extends the Phaser sprite class
 * @param game the game objct for use in the instnance
 * @param textrue the texture to use to draw the sprite
 * @param player the player sprite to be used for game logic
*/
var BadGuy = function(game, texture, index){
  this.player = game.player;
  this.index = index;
  this.game = game;
  this.movementStack = new Array();
  this.state = "dosile";  
  this.visionCone = game.add.bitmapData(game.world.width, game.world.height);
  this.isSelected = false;
  this.onWater = false;
  this.seekTimer = 0;
  this.health = 1;

  // setup constant variables

  //vision
  this.VISION_ANGLE = 60;
  this.VISION_LENGTH = 200;
  this.FIRE_RATE = 400;

  // seek
  this.SEEK_TIME = 1000;
  this.SEEK_SPEED = 150;

  // is ammended during seek
  this.visionMagnifier = 1;

  // used to limit fir rate
  this.nextRound = 0;
  
  // add drawing sprite to the world
  this.visionCone.addToWorld();

  this.heading = {
    x: 0,
    y: 0
  };
  this.currentHeading = {
    x: 0,
    y: 0
  };

  //this.goal = game.add.sprite(this.heading.x, this.heading.y, 'ball');

  /*this.goal.anchor = {
    x: 0.5,
    y: 0.5
  };*/

  // Get new random point to place the bad guy in the world
  var rand = new RandPoint();

  rand.x += 100;
  rand.y += 100;
  // Call the Sprite constructor using the JS.prototype call function
  Phaser.Sprite.call(this, game, game.world.randomX, game.world.randomY, texture);


  
  var _this = this;
  var _world = game.world;

  // pick random rotation on initialisation
  this.rotation = Math.floor(Math.random() * 2*Math.PI );

  // update heading function, creates a new heading ahead of the npc 
  this.updateHeading = function(){

    var angle = 90;
    var distance = 200;

    // current heading
    _this.currentHeading.x = _this.position.x + Math.cos(_this.rotation) * distance;
    _this.currentHeading.y = _this.position.y + Math.sin(_this.rotation) * distance;
    
    // If NPC is dosile, we just randomly wander
    if(_this.state == "dosile"){
      
      var offsetAngle = (Math.floor(Math.random() * angle) -  angle/2) * (Math.PI / 180);

      var coneX = _this.position.x + Math.cos(_this.rotation + offsetAngle) * distance;
      var coneY = _this.position.y + Math.sin(_this.rotation + offsetAngle) * distance;

      this.line = new Phaser.Line(_this.position.x, _this.position.y, Math.cos(_this.rotation) * distance, Math.cos(_this.rotation) * distance);

      // if the new heading is outside the world we need to grab a new one
      sanitized = areYouOutside(coneX, coneY, _world);
      coneX = sanitized.x;
      coneY = sanitized.y;

      _this.heading = {
        x: coneX,
        y: coneY
      };
      // rotate the npc towards the new heading
      _this.movementStack = [];
      // get 60 step coords to move npc toward new heading
      for(var i = 1; i <= 60; i++){
        _this.movementStack.push(lerp(_this.heading, _this.currentHeading, i/60));
      }
    } else if(_this.state == "alert") {
      _this.heading = {
        x: _this.player.position.x,
        y: _this.player.position.y
      };
      _this.movementStack = [];
      
    }
    
  }
  this.updateHeading();

  // fills movement stack towards current heading (used in seek)
  this.fillMovementStack = function(number){

    this.movementStack = [];
    for(var i = 1; i <= number; i++){
      _this.movementStack.push({
        x: _this.heading.x, 
        y: _this.heading.y
      });
    }
  }

  this.setOnWater = function(on){
    this.onWater = on;
  }
  
  //set central anchor point.

  this.anchor = {
    x: 0.5,
    y: 0.5
  }
  game.physics.enable(this);

  this.inputEnabled = true;

  // sets current state of the NPC
  this.setState = function(){

    this.visionMagnifier = (this.state == "alert" || this.state == "seek")? 2 : 1;

    var angle = findAngle(this.position, this.player.position, this.rotation);
      if(Math.abs(toDegrees(angle)) < this.VISION_ANGLE && 
      findDistance(this.player.position, this.position, this.rotation) < this.VISION_LENGTH * this.visionMagnifier){
      this.state = "alert";
      this.seekTimer = this.game.time.now + this.SEEK_TIME;
      this.heading.x = this.player.position.x;
      this.heading.y = this.player.position.y;
    } else if(this.game.time.now > this.seekTimer) {
      this.state = "dosile";
    } else {
      this.state = "seek";
    }
  }
  // draws the vision cone.
  this.drawCone = function(){
    var angle = this.VISION_ANGLE * (Math.PI / 180);
    var coneX = this.position.x + Math.cos(this.rotation + angle) * this.VISION_LENGTH * this.visionMagnifier;
    var coneY = this.position.y + Math.sin(this.rotation + angle) * this.VISION_LENGTH * this.visionMagnifier;
    var coneMidX = this.position.x + Math.cos(this.rotation) * this.VISION_LENGTH * 1.4 * this.visionMagnifier;
    var coneMidY = this.position.y + Math.sin(this.rotation) * this.VISION_LENGTH * 1.4 * this.visionMagnifier;
    var coneX2 = this.position.x + Math.cos(this.rotation - angle) * this.VISION_LENGTH * this.visionMagnifier;
    var coneY2 = this.position.y + Math.sin(this.rotation - angle) * this.VISION_LENGTH * this.visionMagnifier;
    this.visionCone.clear();
    this.visionCone.context.beginPath();
    this.visionCone.context.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this.visionCone.context.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    this.visionCone.context.moveTo(this.position.x, this.position.y);
    this.visionCone.context.lineTo(coneX, coneY);
    
    this.visionCone.context.quadraticCurveTo(coneMidX, coneMidY, coneX2, coneY2);

    this.visionCone.context.closePath();
    this.visionCone.context.fill();
    this.visionCone.dirty = true;
  }

  this.wander = function(){
    var coord;

    // speed of bad guys increases as killCount goes higher
    var speed = 60 * (1 + (game.killCount / 15));
    if(coord = this.movementStack.pop()){
      game.physics.arcade.moveToXY(this, coord.x, coord.y, speed);
      var dx = coord.x - this.position.x;
      var dy = coord.y - this.position.y;
      this.rotation = Math.atan2(dy, dx);
    } else {
      
      game.physics.arcade.moveToXY(this, this.heading.x, this.heading.y, speed);
      
      var dx = this.heading.x - this.position.x;
      var dy = this.heading.y - this.position.y;
      this.rotation = Math.atan2(dy, dx);
    }
  }
  // move towards last known player position
  this.seek = function(speed){
      var speedChng = this.onWater? speed/2: speed
      game.physics.arcade.moveToXY(this, this.heading.x, this.heading.y, speedChng);
      
      var dx = this.heading.x - this.position.x;
      var dy = this.heading.y - this.position.y;
      this.rotation = Math.atan2(dy, dx);
  }
  // attack the player
  this.stopAndAttack = function(){
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    if(findDistance(this.player.position, this.position, this.rotation) > 100)
      this.seek(50);

    if(this.game.time.now > this.nextRound){
      var bullet = new Round(this.game, 'round', this, this.player);
      game.add.existing(bullet);
      bullet.fire();
      this.nextRound = this.game.time.now + this.FIRE_RATE;
    }
  }
  // avoid other NPCS
  this.avoidOthers = function(){
    _this = this;
    this.parent.forEach(function(item){

      if(item != _this){
        var angle = findAngle(_this.position, item.position, _this.rotation) * (180 / Math.PI);
        var dist = findDistance(_this.position, item.position);
        var increment = angle > 0? 1: -1;
        if(dist < 200){
          while(angle < 20){
            _this.rotation += increment;
            angle = findAngle(_this.position, item.position, _this.rotation) * (180 / Math.PI);
            _this.currentHeading.x = _this.position.x + Math.cos(_this.rotation) * _this.DIST;
            _this.currentHeading.y = _this.position.y + Math.sin(_this.rotation) * _this.DIST;
          }
        }
      }
    });
  }
  
}

/*
 * Send extended object back to the Sprite object
 */
BadGuy.prototype = Object.create(Phaser.Sprite.prototype);

/*
 * Override the sprite constructor for new instances of the class
 */
BadGuy.prototype.constructor = BadGuy;

/*
 * Phaser will call any game objects update function on game.update
 */
BadGuy.prototype.update = function(){


  if(this.health < 1){
    this.destroy();
  } else {

    this.avoidOthers();
  
    this.setState();
    

    Phaser.Sprite.prototype.update.call(this);
    // state machine
    switch(this.state){
      case "alert":
        this.stopAndAttack();
        break;
      case "dosile":
        ask({prob: 20, func: this.updateHeading, params: this});
        this.wander();
        break;
      case "seek":
        this.seek(this.SEEK_SPEED);
    }

    if(this.isSelected){
      this.drawCone();
    }
  }

}

var BadGuys = function(game, amnt, texture){
  Phaser.Group.call(this, game);

  this.averageCoord = {
    x: 0,
    y: 0
  }
  this.amnt = amnt;
  var _this = this;
  
  this.listener = function(sprite, pointer){
    console.log('clicked', sprite);
    sprite.parent.forEach(function(item){
      item.visionCone.clear();
      item.isSelected = (sprite === item);
    });
  };

  this.addBadGuys = function(amnt){
    for(var i = 0; i < amnt; i++){
      var aBadGuy = new BadGuy(game, texture, i);
      
      var sprite = this.add(aBadGuy);

      sprite.inputEnabled = true;
      sprite.events.onInputDown.add(_this.listener,this);
    }
  }
  
  this.addBadGuys(this.amnt);

  

}

BadGuys.prototype = Object.create(Phaser.Group.prototype);
BadGuys.prototype.constructor = BadGuys;

BadGuys.prototype.update = function(){
  Phaser.Group.prototype.update.call(this);
  var xs = 0;
  var ys = 0;
  var _this = this;



  if(this.children.length < 5){
    this.addBadGuys(this.amnt / 2);
  }
}