function createJSON(worldWidth, worldHeight){
    world = { 
        "height":worldHeight,
        "layers":[
            {
             "data": [],
             "height":worldHeight,
             "name":"Ground",
             "opacity":1,
             "type":"tilelayer",
             "visible":true,
             "width":worldWidth,
             "x":0,
             "y":0
            }],
        "orientation":"orthogonal",
        "properties":
        {

        },
        "tileheight":32,
        "tilesets":[
            {
             "firstgid":1,
             "image":"images/new_map.png",
             "imageheight":32,
             "imagewidth":64,
             "margin":0,
             "name":"Desert",
             "properties":
                {

                },
             "spacing":0,
             "tileheight":32,
             "tilewidth":32
            }],
        "tilewidth":32,
        "version":1,
        "width":worldWidth
    }


    world.data = Array();

    function isEdge(i){
        return i < world.width || 
        i > world.width * world.height - world.width || 
        i % world.width == 0 || 
        i % world.width == world.width - 1
    }



    for(i = 0; i < world.width * world.height; i++){
        if(isEdge(i)){
            // world.layers[0].data.push(Math.round(Math.random()*47) + 1);
            world.layers[0].data.push(2);
        } else {
            world.layers[0].data.push(1);
        }
    }

    for(i = 0; i < world.width * world.height; i++){
        if(world.layers[0].data[i] == 2){
          ask({prob:1, func:sea, params:i});
        }
    }

    /*
        Takes an index in the world and asks the overlord to turn it to sea based
        on a probability.

        x is the current position in the world
        a b c
        d x e
        f g h
    */
    function sea(i){
        
        var probability = 4;
        // immediate left (d)
        ask({prob:probability, func:makeSea, params:{point: i - 1}});
        // immediate right (e)
        ask({prob:probability, func:makeSea, params:{point: i + 1}});
        for(j = -1; j < 2; j++){
            // top row (a,b,c)
            ask({prob:probability, func:makeSea, params:{point: i - world.width + j}});
            // bottom row (a,b,c) 
            ask({prob:probability, func:makeSea, params:{point: i + world.width + j}});
        }
    }

    // Turns the required point in the world to sea.
    function makeSea(obj){
        world.layers[0].data[obj.point] = 2;
    }

    var json = JSON.stringify(world);

    var blob = new Blob([json], {type: "application/json"});
    var url  = URL.createObjectURL(blob);

    
    return url;
}