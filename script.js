/**
    ask function, 
    runs the function supplied based on the probabiliy supplied
    parameters to be used in the function are passed via an object
**/
var ask = function(options){
    if(Math.floor(Math.random() * options.prob) == 0)
        options.func(options.params);
}

/*
 * returns sanitized x and y 
 * i.e. if the coord is outside the world flip it
 */
var areYouOutside = function(x, y, world){
  returner = {
    x : (x < 0 || x > world.bounds.width - 1)? x *= -1: x,
    y : (y < 0 || y > world.bounds.height - 1)? y *= -1: y
  }
  return returner;
}



var RandPoint = function(varience) {
    varience = varience || 200;
    this.x = Math.round(Math.random() * varience) - varience/2,
    this.y = Math.round(Math.random() * varience) - varience/2
}

var RandPoint = function(x, y, varience) {
    this.x = x + Math.round(Math.random() * varience) - varience/2,
    this.y = y + Math.round(Math.random() * varience) - varience/2
}

var lerp = function(first, second, fraction){
    var dx = first.x + (second.x - first.x) * fraction;
    var dy = first.y + (second.y - first.y) * fraction;
    return {
        x: dx,
        y: dy
    }
}

/**
 * A = enemy projected coord
 * B = enemy coord
 * C = player coord
 */
function findAngle(B,C,angle) {
    var A = {
      x: B.x + 200 * Math.cos(angle),
      y: B.y + 200 * Math.sin(angle)
    };

    var AB = Math.sqrt(Math.pow(B.x-A.x,2)+ Math.pow(B.y-A.y,2));    
    var BC = Math.sqrt(Math.pow(B.x-C.x,2)+ Math.pow(B.y-C.y,2)); 
    var AC = Math.sqrt(Math.pow(C.x-A.x,2)+ Math.pow(C.y-A.y,2));
    return Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB));
}

function findDistance(player, enemy){
  var x = player.x - enemy.x;
  var y = player.y - enemy.y;
  x *= x;
  y *= y;
  return Math.sqrt(x + y);
}

function toDegrees(radians){
  return radians * (180 / Math.PI);
}

