var Round = function(game, texture, shooter, victim){
	this.game = game;
	this.shooter = shooter;
	this.victim = victim;
	Phaser.Sprite.call(this, game, shooter.position.x, shooter.position.y, texture);
	this.nextRound;
	_this = this;
	this.outOfBoundsKill = true;
	this.fire = function(offset){
		var off = offset || 0;
		_this.rotation = _this.shooter.rotation;
		_this.game.physics.arcade.velocityFromAngle(toDegrees(_this.shooter.rotation) + off, 400, _this.body.velocity);	
	}
	game.physics.enable(this);
	this.killVictim = function(round, victim){
		if(_this.shooter instanceof Hero){
			game.killCount++;
		}
		round.destroy();
		victim.health--;
	}
	this.anchor = {
	    x: 0,
	    y: 0.5
	  }	
}
/*
 * Send extended object back to the Sprite object
 */
Round.prototype = Object.create(Phaser.Sprite.prototype);
/*
 * Override the sprite constructor for new instances of the class
 */
Round.prototype.constructor = BadGuy;

Round.prototype.update = function(){
	Phaser.Sprite.prototype.update.call(this);
	game.physics.arcade.collide(this, this.victim, this.killVictim);
}

var Mine = function(game, texture, shooter, victim){
	this.game = game;
	this.shooter = shooter;
	this.victim = victim;
	Phaser.Sprite.call(this, game, shooter.position.x, shooter.position.y, texture);
	var _this = this;
	this.killVictim = function(mine, victim){
		if(_this.shooter instanceof Hero){
			game.killCount++;
		}
		mine.destroy();
		victim.health -= 10;
	}
	this.anchor = {
		x: 0.5,
		y: 0.5
	}
	game.physics.enable(this);
}
/*
 * Send extended object back to the Sprite object
 */
Mine.prototype = Object.create(Phaser.Sprite.prototype);
/*
 * Override the sprite constructor for new instances of the class
 */
Mine.prototype.constructor = BadGuy;

Mine.prototype.update = function(){
	Phaser.Sprite.prototype.update.call(this);
	game.physics.arcade.collide(this, this.victim, this.killVictim);
	game.physics.arcade.collide(this, this.shooter, this.killVictim);
}