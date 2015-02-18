var Follower = function(game, sprite, followerGroup, player){
  this.game = game;
  this.player = player;
  this.coords = {
    x: game.world.randomX,
    y: game.world.randomY
  };
  this.sprite = sprite;
  this.follower = followerGroup.create(this.coords.x, this.coords.y, this.sprite);
  console.log(this);
}

Follower.prototype = Object.create(Phaser.Sprite.prototype);

Follower.prototype.constructor = Follower;

Follower.prototype.update = function(){
  console.log(this);
  var me = this.follower;
  var deltas = {
      original: {
          x: 0,
          y: 0
      },
      update: {
          x: 0,
          y: 0
      }
  }
  deltas.original.y = this.player.y - me.position.y;
  deltas.original.x = this.player.x - me.position.x;
  var randPoint = function() {
      this.x = Math.round(Math.random() * 200),
      this.y = Math.round(Math.random() * 200)
  }

  var rand1 = new randPoint();
  var rand2 = new randPoint();
  deltas.update.y = deltas.original.y + rand1.y - rand2.y;
  deltas.update.x = deltas.original.x + rand1.x - rand2.x
  angle = Math.atan2(deltas.original.y, deltas.original.x);
  me.rotation = angle;
  me.body.velocity.x = deltas.update.x;
  me.body.velocity.y = deltas.update.y;
}

var createFollowers = function(game, amnt, followerGroup, player){
  var sprite = 'car';
  followerGroup = game.add.group();
  for(var i = 0; i < amnt; i++){
    var follower = new Follower(game, sprite, followerGroup, player);
  }
}