/**
 * All the game logic happens on the server, this object
 * is responsible for taking an area and giving back the information needed 
 * for the client to draw the objects in that area
 */
var config = require('../../../config.json');
var SimpleQuadtree = require('simple-quadtree');

class QuadtreeManager {
  constructor() {
    /**
     * Internally hold one quadtree, I can see someone wanting to write one that had multiple but
     * I'm not going to be concerned with that for now
     */
    this.quadtree = new SimpleQuadtree(0, 0, config.gameWidth, config.gameHeight);
  }
    
  /**
   * Use queryObject to query the internal quadtree
   * return exactly what the client needs to draw based on the results
   */
  queryGameObjects(queryObject){

      /**
      * visible players are players that are within the screen of the current player
      * use quadtree for efficiency
      */
      var visibleTanks = [];
      var visibleBullets = [];

      
      this.quadtree.get(queryObject, function(quadtreeObject){
          if(quadtreeObject.type === 'TANK'){
            visibleTanks.push({
              x: quadtreeObject.object.x,
              y: quadtreeObject.object.y,
              gunAngle: quadtreeObject.object.gunAngle
            });
          }else if(quadtreeObject.type === 'BULLET'){
            visibleBullets.push(quadtreeObject.object);
          }
          return true;
      });

      return {
        "perspective":{
            x: queryObject.x + queryObject.w/2,
            y: queryObject.y + queryObject.h/2
        },
        "tanks":visibleTanks,
        "bullets":visibleBullets
      };
  }

  getQuadtree(){
    return this.quadtree;
  }
}

module.exports = QuadtreeManager;