var Round = function(texture, shooter, victim){
	this.shooter = shooter;
	this.victim = victim;
	this.secondary = null;
	this.count = 0;
	Phaser.Sprite.call(this, game, 0, 0, texture);
	this.nextRound;
	this.outOfBoundsKill = true;
    this.checkWorldBounds = true;
	_this = this;

	this.setShooter = function(obj){
		this.shooter = obj;
	}
	this.setVictim = function(obj){
		this.victim = obj;
	}
	this.setSecondary = function(obj){
		this.secondary = obj;
	}

	this.resetRound = function(posX, posY){
		this.reset(posX, posY);
		this.secondary = null;
		this.count = 0;
	}


	this.fire = function(s, v, sec){
		this.setShooter(s);
		this.setVictim(v);
		this.rotation = s.rotation;
		game.physics.arcade.velocityFromAngle(toDegrees(s.rotation), 400, this.body.velocity);
		if(typeof sec != "undefined"){
			this.setSecondary(sec);
		}
		if(v === game.player){
			game.bulletCounts.player ++;
		} else if(v === game.follower) {
			game.bulletCounts.companion ++;
		} else {
			game.bulletCounts.enemies ++;
		}
	}
	game.physics.enable(this);
	this.killVictim = function(round, victim, s){
		if(victim instanceof BadGuy){
			var target = "none";
			if(victim.currentTarget != null)
				target = (victim.currentTarget == game.player)? "player": "companion";
			var kill = {
				followerUnderAttack: game.follower.underAttack,
				killTarget: target
			}
			game.killedGuys.push(kill);
		}
		
		if(round.shooter instanceof Hero){
			game.killCount++;
		}
		round.kill();
		victim.health--;
		if(typeof victim.attack != "undefined"){
			victim.attack();
		}
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
	if(this.alive){
		game.physics.arcade.collide(this, this.victim, this.killVictim);
		
		game.physics.arcade.collide(this, this.secondary, this.killVictim);
		
	}
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