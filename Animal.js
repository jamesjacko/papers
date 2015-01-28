/**
 * Andimal Class
 */ 
var Animal = function(game, x, y, type){
  this.xspeed = 1;
  this.yspeed = 1;
  this.anType = type;
}

Animal.prototype = Object.create(Phaser.Sprite.prototype);
Animal.prototype.constructor = Animal;