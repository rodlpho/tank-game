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
    queryGameObjects(queryObject) {

        /**
         * Following arrays hold objects that are visible
         * (i.e. objects that are within the screen of the current player)
         * NOTE: QuadTree is used here for efficiency
         */
        var visibleTanks = [];
        var visibleBullets = [];
        var visibleWalls = [];
        var visibleTracks = [];

        this.quadtree.get(queryObject, function(quadtreeObject) {
            if(quadtreeObject.type === 'TANK') {
                var tank = quadtreeObject.object;
                visibleTanks.push({
                    id: tank.id,
                    x: tank.x,
                    y: tank.y,
                    screenName: tank.screenName,
                    kills: tank.kills,
                    hullDirection: tank.hullDirection,
                    gunAngle: tank.gunAngle,
                    rotationCorrection: tank.rotationCorrection,
                    spriteTankHull: tank.spriteTankHull,
                    spriteTankGun: tank.spriteTankGun
                });
            }
            else if(quadtreeObject.type === 'BULLET') {
                visibleBullets.push(quadtreeObject.object);
            }
            else if(quadtreeObject.type === 'WALL') {
                visibleWalls.push(quadtreeObject.object);
            }
            else if(quadtreeObject.type === 'TRACK') {
                visibleTracks.push(quadtreeObject.object);
            }
            return true;
        });

        return {
            "tanks": visibleTanks,
            "bullets": visibleBullets,
            "walls": visibleWalls,
            "tracks": visibleTracks
        };
    }

    /**
     * Queries the entire game board and returns all game objects of a specific type.
     *
     * @param {String} gameObjectType - The type of game object to return a list of all objects of this type.
     * @returns {Array} The array containing all game objects of the desired type.
     */
    queryGameObjectsForType(gameObjectType, queryArea = {x: 0, y: 0, w: config.gameWidth, h: config.gameHeight}) {
        // Get ALL game objects
        var gameObjects = this.queryGameObjects(queryArea);

        // Return only game objects of desired type
        switch(gameObjectType) {
            case 'TANK':
                return gameObjects.tanks;
            case 'BULLET':
                return gameObjects.bullets;
            case 'WALL':
                return gameObjects.walls;
            case 'TRACK':
                return gameObjects.tracks;
            default:
                return [];
        }
    }

    getQuadtree() {
        return this.quadtree;
    }
}

module.exports = QuadtreeManager;