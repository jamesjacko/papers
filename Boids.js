function Boid(game, texture, index, vel){
  this.maxVelocity = vel;
  this.n = index;
  this.xVelocity = Math.floor(Math.random() * this.maxVelocity) - this.maxVelocity / 2;
  this.yVelocity = Math.floor(Math.random() * this.maxVelocity) - this.maxVelocity / 2;
  Phaser.Sprite.call(this, game, Math.floor(Math.random() * 800), Math.floor(Math.random() * 800), texture);
  game.physics.enable(this);
}

/*
 * Send extended object back to the Sprite object
 */
Boid.prototype = Object.create(Phaser.Sprite.prototype);

/*
 * Override the sprite constructor for new instances of the class
 */
Boid.prototype.constructor = Boid;

/*
 * Phaser will call any game objects update function on game.update
 */
Boid.prototype.update = function(){
  this.body.velocity.x = this.xVelocity;
  this.body.velocity.y = this.yVelocity;
};


var distance = function(dX, dY) {
  return Math.sqrt((dX * dX) + (dY * dY)) * 1.0;
};


var distanceBetween = function(A, B) {
  return distance(
    A.position.x - B.position.x,
    A.position.y - B.position.y
    );
};

var areBoidsTooClose = function(boid, otherBoid, safeDist) {
  return distanceBetween(boid, otherBoid) < safeDist;
};

var Boids = function(game){
  this.numBoids = 50;
  this.game = game;
  this.maxVelocity = 3;
  this.minSafeDistance = 25;
  this.locality = 200;
  this.minY = 0;
  this.maxY = game.world.height;
  this.minX = 0;
  this.maxX = game.world.width;

  this.followFlockTendency = 0.5;
  this.aimAtFlockCenterTendency = 0.3;

  var _this = this;

  

  // adjusts the boid direction to follow the flock
  this.followFlock = function(boid) {
    var xVelocityFlock = 0;
    var yVelocityFlock = 0;
    
    // find average flock velocity
    this.forEach(function(item) {
      var otherBoid = item;
      if (otherBoid.n !== boid.n && distanceBetween(item, boid) < _this.locality) {
        xVelocityFlock += otherBoid.xVelocity;
        yVelocityFlock += otherBoid.yVelocity;
      }
    });
    
    xVelocityFlock = xVelocityFlock / this.numBoids;
    yVelocityFlock = yVelocityFlock / this.numBoids;
    
    var dist = distance(
      this.position.x - xVelocityFlock, this.position.y - yVelocityFlock);
    if (dist === 0) {
      return;
    }
    
    // use distance to change bood's speed
    boid.xVelocity += (xVelocityFlock / dist) * this.followFlockTendency;
    boid.yVelocity += (yVelocityFlock / dist) * this.followFlockTendency;
  };

  /**
   * Move toward center of the flock
   */
  this.aimAtCenterOfFlock = function(boid) {
    var xFromCenter = 0;
    var yFromCenter = 0;
    
    this.forEach(function(item) {
      var otherBoid = item;
      if (otherBoid.n !== boid.n && distanceBetween(item, boid) < _this.locality) {
        xFromCenter += boid.position.x - otherBoid.position.x;
        yFromCenter += boid.position.y - otherBoid.position.y;
      }
    });
    
    xFromCenter = xFromCenter / this.numBoids;
    yFromCenter = yFromCenter / this.numBoids;
    
    var dist = distance(this.position.x - xFromCenter, this.position.y - yFromCenter);
    if (dist === 0) {
      return;
    }
    
    boid.xVelocity += (xFromCenter / dist) * -1 * this.aimAtFlockCenterTendency;
    boid.yVelocity += (yFromCenter / dist) * -1 * this.aimAtFlockCenterTendency;
  };

  this.avoidOtherBoids = function(boid) {
    var xAdjustment = 0;
    var yAdjustment = 0;

    this.forEach(function(item) {
      var otherBoid = item;
      if (otherBoid.n !== boid.n && distanceBetween(item, boid) < _this.locality) {
        
        var isTooClose = areBoidsTooClose(
          boid, otherBoid, _this.minSafeDistance);
        
        if (isTooClose) {
          var dX = boid.position.x - otherBoid.position.x;
          var dY = boid.position.y - otherBoid.position.y;
          var sqrtSafeDist = Math.sqrt(_this.minSafeDistance);
          
          if (dX < 0) {
            dX = -sqrtSafeDist - dX;
          }
          else {
            dX = sqrtSafeDist - dX;
          }
          
          if (dY < 0) {
            dY = -sqrtSafeDist - dY;
          }
          else {
            dY = sqrtSafeDist - dY;
          }
          
          
          xAdjustment += dX;
          yAdjustment += dY;
        }
      }
    });
    
    var soften = this.minSafeDistance / this.numBoids * 2.0;
    boid.xVelocity -= xAdjustment / soften;
    boid.yVelocity -= yAdjustment / soften;
  };


  this.keepBoidWithinBounds = function(boid) {
    if (boid.position.x > this.maxX) {
      boid.position.x = this.maxX;
      boid.xVelocity = -1 * boid.xVelocity;
    }
    if (boid.position.x < this.minX) {
      boid.position.x = this.minX;
      boid.xVelocity = -1 * boid.xVelocity;
    }
    
    if (boid.position.y > this.maxY) {
      boid.position.y = this.maxY;
      boid.yVelocity = -1 * boid.yVelocity;
    }
    if (boid.position.y < this.minY) {
      boid.position.y = this.minY;
      boid.yVelocity = -1 * boid.yVelocity;
    }
    
  };

  this.avoidOther = function(boid, other) {
    var xAdjustment = 0;
    var yAdjustment = 0;
    
    // Is this boid too close to the player?
    var playerSafeDistance = this.minSafeDistance * 2;
    var isTooClose = areBoidsTooClose(
                boid, other, playerSafeDistance);
                
    // If this boid is too close to the player, adjust this
    // boid's velocity so it'll fly away from it.
    if (isTooClose) {
        var dX = boid.x - other.position.x;
        var dY = boid.y - other.position.y;
        var sqrtSafeDist = Math.sqrt(playerSafeDistance);
                
        if (dX < 0) {
            dX = -sqrtSafeDist - dX;
        }
        else {
            dX = sqrtSafeDist - dX;
        }
                
        if (dY < 0) {
            dY = -sqrtSafeDist - dY;
        }
        else {
            dY = sqrtSafeDist - dY;
        }
        
        xAdjustment += dX;
        yAdjustment += dY;
    }
    
    boid.xVelocity -= xAdjustment / 1.2;
    boid.yVelocity -= yAdjustment / 1.2;
  };

  
  this.restrictVelocity = function(boid) {
    boid.xVelocity = Math.min(boid.xVelocity, this.maxVelocity);
    boid.yVelocity = Math.min(boid.yVelocity, this.maxVelocity);
  };

  /**
   * Main function that posiitons the boid in the world, invoking other
   * boid methods
   */
  this.positionBoid = function(boid) {
    this.followFlock(boid);
    this.aimAtCenterOfFlock(boid);
    this.avoidOtherBoids(boid);
    this.avoidOther(boid, this.game.player);
    var _this = this;
    this.game.badGuyGroup.forEach(function(guy){
      _this.avoidOther(boid, guy);
    })

    this.restrictVelocity(boid);

    
    boid.position.x += boid.xVelocity;
    boid.position.y += boid.yVelocity;
    
    // Make sure all boids are flying within the image
    this.keepBoidWithinBounds(boid);
  };

  Phaser.Group.call(this, game);

  for(var i = 0; i < this.numBoids; i++){
        var boid = new Boid(game, 'ball', i, this.maxVelocity);
        this.add(boid);
  }

  
};

Boids.prototype = Object.create(Phaser.Group.prototype);
Boids.prototype.constructor = Boids;

Boids.prototype.update = function(){
  var _this = this;
  this.forEach(function(boid){
    _this.positionBoid(boid);
  })
};