var updateHeading = function(_this){
  var angle = 90;
  var distance = 200;

  // current heading
  _this.currentHeading.x = _this.position.x + Math.cos(_this.rotation) * distance;
  _this.currentHeading.y = _this.position.y + Math.sin(_this.rotation) * distance;
  
  // If NPC is dosile, we just randomly wander

  if(_this.state == "alert") {
    _this.heading = {
      x: _this.game.player.position.x,
      y: _this.game.player.position.y
    };
    _this.movementStack = [];
    
  }
  else{
    
    var offsetAngle = (Math.floor(Math.random() * angle) -  angle/2) * (Math.PI / 180);

    var coneX = _this.position.x + Math.cos(_this.rotation + offsetAngle) * distance;
    var coneY = _this.position.y + Math.sin(_this.rotation + offsetAngle) * distance;

    _this.line = new Phaser.Line(_this.position.x, _this.position.y, Math.cos(_this.rotation) * distance, Math.cos(_this.rotation) * distance);

    // if the new heading is outside the world we need to grab a new one
    sanitized = areYouOutside(coneX, coneY, _this.game.world);
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
  }
  
}

var wander = function(_this, game){
    var coord;

    
    var speed = (typeof _this.speed != "undefined")? _this.speed: 60;
    if(coord = _this.movementStack.pop()){
      game.physics.arcade.moveToXY(_this, coord.x, coord.y, speed);
      var dx = coord.x - _this.position.x;
      var dy = coord.y - _this.position.y;
      _this.rotation = Math.atan2(dy, dx);
    } else {
      
      game.physics.arcade.moveToXY(_this, _this.heading.x, _this.heading.y, speed);
      
      var dx = _this.heading.x - _this.position.x;
      var dy = _this.heading.y - _this.position.y;
      _this.rotation = Math.atan2(dy, dx);
    }
  }