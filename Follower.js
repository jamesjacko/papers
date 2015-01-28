var Follower = function(game, sprite, followerGroup, player){
  this.game = game;
  this.player = player;
  this.coords = {
    x: game.world.randomX,
    y: game.world.randomY
  };
  this.sprite = sprite;
  this.follower = followerGroup.create(this.coords.x, this.coords.y, this.sprite);
}

Follower.prototype.update = function(){

}