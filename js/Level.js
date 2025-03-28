import { LevelManager } from './LevelManager.js';

export class Level {
    constructor(name, images, currentX, currentY) {
        this.levelManager = LevelManager.getInstance();
        this.levelName = name;
        this.levelImages = images;
        this.currentX = currentX;
        this.currentY = currentY;
        this.eventActive = false;
    }

    
    showCurrentImage() {
        const imgElement = document.getElementById('image');
        if (imgElement) {
            imgElement.src = this.levelImages[this.currentY][this.currentX];

            console.log(`Mostrata immagine: ${this.levelImages[this.currentY][this.currentX]} a posizione (${this.currentX}, ${this.currentY})`);

            if (this.event) {
                this.event.updateEventButton();
            }
        } else {
            console.error("Elemento 'image' non trovato nel DOM.");
        }
    }

    setEventActive() {
        this.eventActive = !this.eventActive;
    }

    SetCurrentX(x){
        this.currentX = x;
    }

    SetCurrentY(y){
        this.currentY = y;
    }

    isValidMove(newX, newY) {
        // Controlliamo se la nuova posizione è fuori dai limiti o è nulla (quindi non attraversabile)
        if (newY < 0 || newY >= this.levelImages.length || newX < 0 || newX >= this.levelImages[0].length) {
            console.log("Movimento fuori dai limiti!");
            return false;
        }

        const nextImage = this.levelImages[newY][newX];
        if (nextImage === null) {
            console.log("Movimento bloccato! Destinazione non valida.");
            return false;
        }

        return true;
    }

    moveForward() {
        let newY = this.currentY + 1;
        if (this.isValidMove(this.currentX, newY) && !this.eventActive) {
            this.currentY = newY;
            this.showCurrentImage();
        }
    }

    moveBackward() {
        let newY = this.currentY - 1;
        if (this.isValidMove(this.currentX, newY) && !this.eventActive) {
            this.currentY = newY;
            this.showCurrentImage();
        }
    }

    moveRight() {
        let newX = this.currentX + 1;
        if (this.isValidMove(newX, this.currentY) && !this.eventActive) {
            this.currentX = newX;
            this.showCurrentImage();
        }
    }

    moveLeft() {
        let newX = this.currentX - 1;
        if (this.isValidMove(newX, this.currentY) && !this.eventActive) {
            this.currentX = newX;
            this.showCurrentImage();
        }
    }

    
}
