/**
 * Animals Group Class
 */
var animalsGroup;

function addAnimals(game){
  animalsGroup = game.add.group();
  animalsGroup.enableBody = true;
  animalsGroup.physicsBodyType = Phaser.Physics.ARCADE;
}

function createAnimals(howMany, game){
  for(int i = 0; i < howMany; i++){
    var position = {
      x: game.rnd.integerInRange(0, CANVAS_WIDTH),
      y: game.rnd.integerInRange(0, CANVAS_HEIGTH)
    }

    var an = this.animalsGroup.getFirstDead();

    if(an === null){
      an = new Animal(this.game, position.x, position.y, type);
      this.animalsGroup.add(an);
    }
  }
}
