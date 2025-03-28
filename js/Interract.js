import { LevelManager } from './LevelManager.js';
import { TextBox } from './TextBox.js';
import { Inventory } from './Inventory.js';

export class Event {
    constructor() {
        this.levelManager = LevelManager.getInstance();
        this.textBox = new TextBox();
        this.eventActive = false;
        this.textBox.obtainEvent(this);
        this.createEventButton();
        this.inventoryOpen = false;
    }

    getInstance() {
        return Event.instance;
    }

    createEventButton() {
        const button = document.createElement('button');
        button.id = 'eventButton';
        button.textContent = 'Interagisci (E)';
        button.addEventListener('click', () => {
            this.startEvent();
        });
        if (!document.getElementById('eventButton')) {
    document.body.appendChild(button);
         }
    }

    updateEventButton() {
        const button = document.getElementById('eventButton');
        const level = this.levelManager.getCurrentLevel();

        if (level.levelName === 'Hallway') {
            if (level.currentY === 6 || level.currentY === 14 || level.currentY === 15 || level.currentX === 0 || level.currentX === 2) {
                button.style.borderColor = 'green';
                button.style.borderWidth= '4px';
            } else {
                button.style.borderColor = 'white';
                button.style.borderWidth= '2px';
            }
        }else if(level.levelName == 'Infirmary'){
            button.style.borderColor = 'green';
            button.style.borderWidth= '4px';

        } else if(level.levelName == 'Class205'){
            button.style.borderColor = 'green';
            button.style.borderWidth= '4px';

        } else if(level.levelName == 'U_Start'  || level.levelName == 'U_Library' || level.levelName == 'U_Books' || level.levelName == 'U_Gas' || level.levelName == 'U_Empty' || level.levelName == 'U_Lab' || level.levelName == 'U_LabPC'){
            button.style.borderColor = 'yellow';
            button.style.borderWidth= '4px';
        }
        
        else {
            button.style.borderColor = 'white';
            button.style.borderWidth= '2px';
        }
    }

    startEvent() {
        if(this.eventActive || this.inventoryOpen) {
           return;
        }    
        this.eventActive = true;
        this.textBox.openDialogue(); // Chiamata senza parametri
        this.updateEventButton(); // Update button color when event starts
    }
}