class Player{
    constructor(name){
        this.name = name;
        this.score = 0;
        this.active =false  ; // true, wenn der Spieler an der Reihe ist
    }
    updateScore(){
        this.score++;
    }
    resetScore(){
        this.score = 0;
    }
    getScore(){
        return this.score;
    }
    getName(){
        return this.name;
    }
    setName(name){
        this.name = name;
    }
    setActive(active){
        this.active = active;
    }
    getActive(){
        return this.active;
    }
    isActive(){
        return this.active;
    }
    static fromJSON(obj){
        const player = new Player(obj.name);
        player.score = obj.score;
        player.active = obj.active;
        return player;
    }
    toJSON(){
        return {
            name: this.name,
            score: this.score,
            active: this.active
        };
    }
}

export default Player;