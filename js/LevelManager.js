export class LevelManager {
    constructor() {
        if (LevelManager.instance) {
            return LevelManager.instance;
        }

        this.levels = {};
        this.currentLevel = null;
        LevelManager.instance = this;
    }

    static getInstance() {
        if (!LevelManager.instance) {
            LevelManager.instance = new LevelManager();
        }
        return LevelManager.instance;
    }

    setEvent() {
        this.currentLevel.setEventActive();
    }

    addLevel(name, levelInstance) {
        this.levels[name] = levelInstance;
    }

    setCurrentLevel(name) {
        if (name === 'Classroom') {
            this.currentLevel = this.levels[name];   
        }else if(name === 'Hallway') {
            this.currentLevel = this.levels[name];
        }else if(name === 'SecondHallway') {
            this.currentLevel = this.levels[name];
        }else if(name === 'Stairs') {
            this.currentLevel = this.levels[name];
        }else if(name === 'Infirmary') {
            this.currentLevel = this.levels[name];
        }else if(name === 'Class205') {
            this.currentLevel = this.levels[name];
        }else if(name == 'BedRoom'){
            this.currentLevel = this.levels[name];
        }else if(name == 'U_Start'){
            this.currentLevel = this.levels[name];
        }else if(name == 'U_Gas'){
            this.currentLevel = this.levels[name];
        }else if(name == 'U_Library'){
            this.currentLevel = this.levels[name];
        }else if(name == 'U_Books'){
            this.currentLevel = this.levels[name];  
        }else if(name == 'U_Empty'){
            this.currentLevel = this.levels[name];
        }else if(name == 'U_Lab'){
            this.currentLevel = this.levels[name];
        }else if(name == 'U_LabPC'){
            this.currentLevel = this.levels[name];
        }    }

    getCurrentLevel() {
        return this.currentLevel;
    }

    setCurrentX(x) {
        this.currentLevel.SetCurrentX(x);
    }

    setCurrentY(y) {
        this.currentLevel.SetCurrentY(y);
    }
    getLevel(name) {
        return this.levels[name];
    }
}