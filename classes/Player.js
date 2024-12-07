  class Player{
    constructor(name){
        this.name = name;
        this.score = 0;
        this.bilder = [];
        this.active = false;
    }
    addScore(value){
        this.score+=value;
    }
    setBilder(value){
        console.log(`Setting Bilder for ${this.name} with src: ${value}`);
        this.bilder.push(value);
    }
    getScore(){
        return this.score;
    }
    getBilder(){
        return this.bilder;
    }
    getName(){
        return this.name;
    }
    resetScore(){
        this.score = 0;
    }
    resetBilder(){
        this.bilder = [];
    }
    isActive(){
        return this.active;
    }
    setActive(value){
        this.active = value;
    }
    // Rehydrate a plain object to a Player instance
    static fromJSON(obj) {
        const player = new Player(obj.name);
        player.score = obj.score;
        player.bilder = obj.bilder;
        player.active = obj.active;
        return player;
    }
}
export {Player};