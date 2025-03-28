import { Inventory } from './Inventory.js';
import { LevelManager } from './LevelManager.js';
import { Event } from './Interract.js';
import { TextBox } from './TextBox.js';

export class Game {
    constructor() {
        if (!Game.instance) {
            Game.instance = this;
        }
        this.textBox = new TextBox();
        this.minutes = 0;
        this.maxMinutes = 20;
        this.state = 'INTRO';
        this.inventory = Inventory.getInstance();
        this.levelManager = LevelManager.getInstance();
        this.level = this.levelManager.getCurrentLevel();
        this.event = new Event();
        this.firstCour = true;
        this.rightAnswer = false;
        this.backgroundAudio = null;
        this.currentTrack = null;
        this.isBackgroundPlaying = false;
        this.sfxVolume = 1;
        this.createMenu();
    }

    static getInstance() {
        if (!Game.instance) {
            Game.instance = new Game();
        }
        return Game.instance;
    }

    start() {
        this.showIntroMessage();
        this.displayTimer();
        document.addEventListener('keydown', this.handleKeydown.bind(this));
    }

    updateTimer() {
        this.minutes += 5;
        document.getElementById('timer').textContent = `Tempo trascorso: ${this.minutes} minuti`;

        if (this.firstCour) {
            this.maxMinutes = 30;
        } else
            this.maxMinutes = 60;

        if (this.minutes >= this.maxMinutes) {
            this.state = 'TIME_EXHAUSTED';
            this.rightAnswer = false;
            this.event.textBox.undergroungEmptyEvent = true;
            this.event.textBox.undergroungEmptyAnswerIsTrue = false;
            this.showTimeExhausted();
            setTimeout(() => {
                this.state = 'PLAYING';
                this.minutes = 0;
                this.displayTimer();
            }, 5500);
        }
    }

    resetTimer() {
        this.minutes = 0;
        this.displayTimer();
    }

    showTimeExhausted() {
        this.changeBackgroundMusic(null);
        const imgElement = document.getElementById('image');
        imgElement.src = './images/TimeExausted.png';

        const TimeExaustedVideo = document.createElement('video');
        TimeExaustedVideo.id = 'timeExhaustedVideo';
        TimeExaustedVideo.src = './images/Clock.mp4';
        TimeExaustedVideo.autoplay = true;

        const TimeExaustedText = document.createElement('div');
        TimeExaustedText.id = 'timeExhaustedMessage';
        if (this.firstCour) {
            TimeExaustedText.innerHTML = 'La ricreazione è finita!';
        }
        else {
            TimeExaustedText.innerHTML = 'Peccato, ci hai messo troppo tempo!';
        }
        document.body.appendChild(TimeExaustedText);
        document.body.appendChild(TimeExaustedVideo);


        TimeExaustedVideo.onended = () => {

            this.level = this.levelManager.getLevel('Classroom');

            if (!this.firstCour) {
                this.inventory.removeItemByName("Maschera di ossigeno");
            }
            this.level.showCurrentImage();
            TimeExaustedVideo.remove();
            TimeExaustedText.remove();
        };
    }

    handleKeydown(event) {
        if ((event.key === 'Escape' || event.key === 'm' || event.key === 'M')) {
            if(this.state === 'MENU' || this.state === 'PLAYING') {
                this.toggleMenu();
                event.stopImmediatePropagation();
                return;
            }
        }
        
        if (this.state === 'MENU') return;

        if (this.state === 'INTRO' && event.key === 'Enter') {
            this.showInstructions();
            this.state = 'INSTRUCTIONS';
            return;
        }
        if (this.state === 'TOXIC_GAS' || document.getElementById('overlay')) {
            if ((event.key === 'i' || event.key === 'I') && !this.event.eventActive && !this.event.textBox.gameFinisched) {
                this.toggleInventory();
                if(this.event.inventoryOpen){
                    this.event.inventoryOpen = false;
                }else{
                    this.event.inventoryOpen = true;
                }
                return;
            }
            return; // Impedisce al giocatore di muoversi durante il countdown
        }

        if (this.state === 'INSTRUCTIONS' && event.key === 'Enter') {
            this.hideInstructions();
            this.state = 'PLAYING';
            this.menuButton.style.display = 'block';
            return;
        }

        if ((event.key === 'i' || event.key === 'I') && (this.state === "PLAYING" || this.state === "INVENTORY")) {
            this.toggleInventory();
            if(this.event.inventoryOpen){
                this.event.inventoryOpen = false;
            }else{
                this.event.inventoryOpen = true;
            }
            return;
        }

        if (this.state === 'INVENTORY' && event.key === 'Escape' && !this.event.textBox.gameFinisched) {
            if(this.event.inventoryOpen){
                this.event.inventoryOpen = false;
            }else{
                this.event.inventoryOpen = true;
            }
            this.toggleInventory();
            return;
        }

        if (this.state === "PLAYING" && (event.key === 'e' || event.key === 'E')) {
            this.event.startEvent();
            return;
        }

        if (this.state === 'PLAYING' && !this.event.eventActive && this.state != 'TIME_EXHAUSTED') {
            

            switch (event.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    if (this.level.levelName === 'Hallway' && this.level.currentY === 6) {

                        this.playAudio('./audio/door.mp3');

                    } else if (this.level.levelName === 'Hallway' && this.level.currentY === 8 && this.level.currentX === 1) {
                        this.showTransitionMessage("A sinistra c'è l'infermeria");

                    } else if (this.level.levelName === 'Hallway' && this.level.currentY === 5) {
                        this.showTransitionMessage("A destra ci sono le scale");
                    }

                    if (this.level.levelName === 'SecondHallway') {
                        if (this.level.currentY === 1 && this.firstCour) {
                            this.showTransitionMessage("Hai sentito un rumore provenire dall'aula a sinistra..");
                        }
                    }

                    if (this.level.levelName === 'Classroom') {
                        this.showTransitionMessage("Sei nel corridoio del piano terra");
                        this.switchLevel();
                        this.updateTimer();
                    } else if (this.level.levelName === 'BedRoom') {
                        if (this.level.currentY === 2 && this.level.currentX === 1) {
                            this.showTransitionMessage("Ti trovi nuovamente a scuola, ma è sera ormai...");
                            this.switchLevel();
                        } else {
                            this.showTransitionMessage("Davanti a te c'è uno specchio...");
                            this.level.moveForward();
                        }
                    } else if (this.level.levelName == "Stairs") {
                        if (this.level.currentY === 1 && this.level.currentX === 0) {
                            this.showTransitionMessage("Ti trovi al primo piano");
                        } else if (this.level.currentY === 2 && this.level.currentX === 0) {
                            this.showTransitionMessage("Non si puo' salire di più");

                        } else if (this.level.currentY === 0 && this.level.currentX === 0) {
                            this.showTransitionMessage("Ti trovi al piano terra");

                        }
                        this.level.moveForward();
                    } else if (this.level.levelName === "U_Library") {
                        this.showTransitionMessage("Interagisci per vedere cosa c'è");
                        this.switchLevel();
                        this.updateTimer();
                    } else if (this.level.levelName == "U_Start") {
                        this.showTransitionMessage("Sei in una stanza particolare, cerca di capire cosa fare");
                        this.levelManager.setCurrentLevel('U_Gas');
                        this.level = this.levelManager.getCurrentLevel();
                        this.level.showCurrentImage();
                        this.updateTimer();
                    } else if (this.level.levelName == "U_Lab") {
                        this.showTransitionMessage("Interagisci per accendere il PC");
                        this.levelManager.setCurrentLevel('U_LabPC');
                        this.level = this.levelManager.getCurrentLevel();
                        this.level.showCurrentImage();
                    } else {
                        this.level.moveForward();
                    }
                    this.event.updateEventButton(); // Update button color when moving
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    if (this.level.levelName === 'Hallway') {
                        if (this.level.currentY === 7) {
                            this.playAudio('./audio/door.mp3');
                            this.showTransitionMessage("A destra ci sono le scale");
                            this.level.moveBackward();
                        } else if (this.level.currentY === 10 && this.level.currentX === 1) {
                            this.showTransitionMessage("A sinistra c'è l'infermeria");
                            this.level.moveBackward();
                        }
                        else if (this.level.currentY === 0) {

                            this.switchLevel();
                            this.updateTimer();
                        } else {
                            this.level.moveBackward();
                        }
                    } else if (this.level.levelName == "Stairs") {
                        if (this.level.currentY === 1 && this.level.currentX === 0) {
                            if (this.firstCour) {
                                this.showTransitionMessage("Non puoi accedere ai sotterranei in questo momento, dovresti tornare al momento giusto!");
                            } else {
                                this.showTransitionMessage("Ti trovi nei sotterranei");
                                this.level.moveBackward();
                            }
                        } else if (this.level.currentY === 2 && this.level.currentX === 0) {
                            this.showTransitionMessage("Ti trovi al piano terra");
                            this.level.moveBackward();
                        }
                    } else if (this.level.levelName == "U_Start") {
                        this.showTransitionMessage("Ti trovi nelle scale dei sotterranei");
                        this.levelManager.setCurrentLevel('Stairs'); // Passa al secondo corridoio
                        this.level = this.levelManager.getCurrentLevel();
                        this.level.SetCurrentX(0);
                        this.level.SetCurrentY(0);
                        this.level.showCurrentImage();
                    } else if (this.level.levelName === "U_Books") {
                        this.switchLevel();
                        this.updateTimer();
                    } else if (this.level.levelName == "U_Gas") {
                        this.showTransitionMessage("Ti trovi nella stanza iniziale dei sotterranei");
                        this.switchLevel();
                        this.updateTimer();
                    } else if (this.level.levelName == "U_LabPC") {
                        this.showTransitionMessage("Ti trovi nella stanza finale con il portale, puoi andare a sinistra o avanti");
                        this.levelManager.setCurrentLevel('U_Lab');
                        this.level = this.levelManager.getCurrentLevel();
                        this.level.showCurrentImage();
                    } else if (this.level.levelName == "U_Empty") {
                        this.showTransitionMessage("Ti trovi in una stanza particolare, cerca di capire cosa fare");
                        this.levelManager.setCurrentLevel('U_Gas');
                        this.level = this.levelManager.getCurrentLevel();
                        this.playAudio('./audio/door.mp3');
                        this.level.showCurrentImage();
                        this.updateTimer();
                    } else {
                        this.level.moveBackward();
                    }
                    this.event.updateEventButton(); // Update button color when moving
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    if (this.level.levelName === "Hallway" && this.level.currentY === 6 && this.level.currentX === 1) {
                        this.showTransitionMessage("Sei sulle scale, puoi salire al primo piano o scendere nei sotterranei");
                        this.levelManager.setCurrentLevel('Stairs');
                        this.level = this.levelManager.getCurrentLevel();
                        this.level.SetCurrentX(0);
                        this.level.SetCurrentY(1);

                        this.level.showCurrentImage()
                        // Cambia livello alle scale                       
                    } else if (this.level.levelName === "SecondHallway" && this.level.currentY === 0 && this.level.currentX === 1) {

                        this.showTransitionMessage("Sei sulle scale, puoi scendere al piano terra o nei sotterranei");
                        this.levelManager.setCurrentLevel('Stairs');
                        this.level = this.levelManager.getCurrentLevel();
                        this.playAudio('./audio/door.mp3');
                        this.level.showCurrentImage();

                    } else if (this.level.levelName === "Infirmary") {

                        this.switchLevel(); // Torna al corridoio
                    } else if (this.level.levelName === "Stairs") {
                        if (this.level.currentY === 0 && this.level.currentX === 0) {
                            this.showTransitionMessage("Stai attento a dove vai, potresti non tornare indietro...");
                            this.changeBackgroundMusic('sottofondo2');
                            this.levelManager.setCurrentLevel('U_Start');
                            this.level = this.levelManager.getCurrentLevel();
                            this.playAudio('./audio/door.mp3');
                            this.level.showCurrentImage();

                        }
                    } else if (this.level.levelName == "U_Library") {
                        this.levelManager.setCurrentLevel('U_Start');
                        this.level = this.levelManager.getCurrentLevel();
                        this.level.showCurrentImage();
                        this.updateTimer();
                    } else if (this.level.levelName == "U_Start") {
                        this.showTransitionMessage("Non puoi andare in questa direzione, la porta è chiusa");
                    } else if (this.level.levelName == "U_Gas") {
                        this.showTransitionMessage("Ti trovi in una stanza vuota, interagisci per vedere cosa c'è");
                        this.levelManager.setCurrentLevel('U_Empty');
                        this.level = this.levelManager.getCurrentLevel();
                        this.playAudio('./audio/door.mp3');
                        this.level.showCurrentImage();
                        this.updateTimer();

                    } else if (this.level.levelName == "U_Empty" && this.rightAnswer) {
                        this.showTransitionMessage("Ti trovi nella stanza finale con il portale");
                        this.levelManager.setCurrentLevel('U_Lab');
                        this.level = this.levelManager.getCurrentLevel();
                        this.playAudio('./audio/door.mp3');
                        this.level.showCurrentImage();
                        this.updateTimer();
                    }
                    else {
                        this.level.moveRight();
                    }
                    this.event.updateEventButton(); // Update button color when moving
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    if (this.level.levelName === "Stairs") {
                        if (this.level.currentY === 1 && this.level.currentX === 0) {
                            this.changeBackgroundMusic('sottofondo1');
                            this.showTransitionMessage("Ti trovi al piano terra");
                            this.levelManager.setCurrentLevel('Hallway'); // Torna al corridoio
                            this.level = this.levelManager.getCurrentLevel();
                        } else if (this.level.currentY === 2 && this.level.currentX === 0) {
                            this.showTransitionMessage("Ti trovi al primo piano");
                            this.levelManager.setCurrentLevel('SecondHallway'); // Passa al secondo corridoio
                            this.level = this.levelManager.getCurrentLevel();
                            this.level.SetCurrentX(1);
                            this.level.SetCurrentY(0);
                        }
                        this.level.showCurrentImage();
                        this.playAudio('./audio/door.mp3');
                    }
                    else if (this.level.levelName === "Hallway") {
                        if (this.level.currentY === 9 && this.level.currentX === 1) {

                            this.switchLevel(); // vai in infermeria
                            this.updateTimer();
                        } else {
                            this.level.moveLeft();
                        }
                    } else if (this.level.levelName === "SecondHallway" && this.level.currentY === 2 && this.level.currentX === 1 && this.firstCour) {

                        const heldItem = this.inventory.getHeldItem();
                        if (heldItem && heldItem.name === 'Chiavi 205') {
                            this.inventory.removeItemByName('Chiavi 205');
                            this.inventory.removeHeldItem();
                            this.updateTimer();
                            this.showTransitionMessage("Ti trovi nell'aula 205, ma non sei solo...");
                            this.switchLevel();
                            this.event.startEvent();
                        } else {
                            this.showTransitionMessage("La porta è chiusa! Hai bisogno di prendere le chiavi per aprirla");
                        }

                    } else if (this.level.levelName == "U_Start") {
                        this.updateTimer();
                        this.showTransitionMessage("Ti trovi in una libreria");
                        this.levelManager.setCurrentLevel('U_Library'); // Passa al secondo corridoio
                        this.level = this.levelManager.getCurrentLevel();
                        this.level.SetCurrentX(0);
                        this.level.SetCurrentY(0);
                        this.level.showCurrentImage();
                        this.handleToxicGas();
                    } else if (this.level.levelName == "U_Lab") {
                        this.showTransitionMessage("Ti trovi in una stanza vuota, puoi andare a sinistra o a destra");
                        this.levelManager.setCurrentLevel('U_Empty');
                        this.level = this.levelManager.getCurrentLevel();
                        this.playAudio('./audio/door.mp3');
                        this.level.showCurrentImage();
                        this.updateTimer();
                    }
                    else {
                        this.level.moveLeft();
                    }
                    this.event.updateEventButton(); // Update button color when moving
                    break;

            }
        }
    }

    switchCour() {
        if (this.firstCour) {
            this.firstCour = false;
            this.resetTimer();
        }

        this.showEndScreen();
        
        setTimeout(() => {
            this.switchLevel(); // Cambia livello dopo un po'
            this.event.startEvent(); // Avvia evento dopo la schermata
        }, 3000); // Aspetta 3 secondi (puoi cambiare il valore)
    }

    playAudio(audioPath) {
        const audio = new Audio(audioPath);
        audio.volume = this.sfxVolume; // Aggiungi questa riga
        audio.play().catch(error => {
            console.error('Errore nella riproduzione dell\'audio:', error);
        });
    }

    switchLevel() {
        this.playAudio('./audio/door.mp3');
        if (this.level.levelName === 'Classroom') {
            this.changeBackgroundMusic('sottofondo1');
            this.levelManager.setCurrentLevel('Hallway');
            this.level = this.levelManager.getCurrentLevel();
            this.level.SetCurrentX(1);
            this.level.SetCurrentY(0);
        } else if (this.level.levelName === 'Hallway') {
            if (this.level.currentY === 0) {
                this.levelManager.setCurrentLevel('Classroom'); // Torna in classe
                this.showTransitionMessage("Sei in classe");
            }

            else if (this.level.currentY === 9 && this.level.currentX === 1) {
                this.showTransitionMessage("Ti trovi nell'infermeria, interagisci per vedere cosa c'è");
                this.levelManager.setCurrentLevel('Infirmary'); // Passa all'infirmeria
            }
        } else if (this.level.levelName === 'SecondHallway') {
            if (this.level.currentY === 0) {
                this.levelManager.setCurrentLevel('Stairs'); // Torna alle scale per scendere
            } else if (this.level.currentY === 2) {
                this.levelManager.setCurrentLevel('Class205'); // Vai in classe 205
            }
        } else if (this.level.levelName === 'Infirmary') {
            this.levelManager.setCurrentLevel('Hallway'); // Torna al corridoio
        } else if (this.level.levelName === 'Class205') {
            this.changeBackgroundMusic(null);
            this.levelManager.setCurrentLevel('BedRoom');
        } else if (this.level.levelName === 'BedRoom') {
            if (this.level.currentY === 2 && this.level.currentX === 1) {
                this.levelManager.setCurrentLevel('Classroom');
            }
        } else if (this.level.levelName == "U_Library") {
            this.levelManager.setCurrentLevel('U_Books');
        } else if (this.level.levelName == "U_Books") {
            this.levelManager.setCurrentLevel("U_Library");
        } else if (this.level.levelName == "U_Gas") {
            this.levelManager.setCurrentLevel('U_Start');
        }
        this.level = this.levelManager.getCurrentLevel();
        this.level.showCurrentImage();
        this.event.updateEventButton(); // Update button color when switching levels
    }

    toggleInventory() {
        this.state = this.state === 'INVENTORY' ? 'PLAYING' : 'INVENTORY';
        const inventoryElement = document.getElementById('inventory');
        inventoryElement.style.display = this.state === 'INVENTORY' ? 'grid' : 'none';
    }

    displayTimer() {
        const timerElement = document.getElementById('timer');
        timerElement.textContent = `Tempo trascorso: ${this.minutes} minuti`;
    }

    showIntroMessage() {
        const introMessageContainer = document.createElement('div');
        introMessageContainer.id = 'introMessageContainer';

        const introImageElement = document.createElement('img');
        introImageElement.id = 'introImage';
        introImageElement.src = './images/carta.png';
        introImageElement.alt = 'Carta';

        const introMessageElement = document.createElement('div');
        introMessageElement.id = 'introMessage';
        introMessageElement.innerHTML = 'Benvenuto!<br>Ti trovi a scuola<br><br>C\'è un mistero da risolvere senza perdere tempo. Divertiti!';

        introMessageContainer.appendChild(introImageElement);
        introMessageContainer.appendChild(introMessageElement);
        document.body.appendChild(introMessageContainer);
    }

    showOpenImage(message, image) {
        // Crea l'elemento per l'immagine del libro
        const openBookElement = document.createElement('div');
        openBookElement.id = 'openBook';
        openBookElement.style.position = 'fixed';
        openBookElement.style.top = '50%';
        openBookElement.style.left = '50%';
        openBookElement.style.transform = 'translate(-50%, -50%)';
        openBookElement.style.zIndex = '998'; // Assicurati che l'immagine del libro sia sotto il dialogo
        openBookElement.style.width = '35vw'; // Adatta la larghezza in base alla dimensione dello schermo
        openBookElement.style.height = '70vh'; // Adatta l'altezza in base alla dimensione dello schermo

        const imgElement = document.createElement('img');
        imgElement.src = `./images/${image}`;
        imgElement.alt = 'Open Book';
        imgElement.style.width = '100%';
        imgElement.style.height = '100%';

        const textElement = document.createElement('div');
        textElement.style.position = 'absolute';
        textElement.style.top  = image === 'openBook.png' ? '40%' : '30%';;
        textElement.style.left = '50%';
        textElement.style.transform = 'translate(-50%, -50%)';
        textElement.style.color = 'black';
        textElement.style.fontSize = image === 'openBook.png' ? '2vw' : '1.5vw'; // Adatta la dimensione del testo in base alla dimensione dello schermo
        textElement.style.textAlign = 'center';
        textElement.style.padding = '20px';
        textElement.style.boxSizing = 'border-box';
        textElement.innerHTML = message;

        // Imposta il font in base all'immagine passata
        switch (image) {
            case 'openBook.png':
                textElement.style.fontFamily = 'Feelfree';
                break;
            case 'blackboard.png':
                textElement.style.fontFamily = 'Pencilant Script';
                textElement.style.width = '85%'; // Estendi il testo orizzontalmente
                textElement.style.color = 'white';
                break;
            case 'pc.png':
                textElement.style.fontFamily = 'PC Senior';
                textElement.style.color = 'lime'; // Colore verde fluo
                break;
            default:
                textElement.style.fontFamily = 'Feelfree'; // Font di default
                break;
        }

        openBookElement.appendChild(imgElement);
        openBookElement.appendChild(textElement);

        // Aggiungi una casella di testo se l'immagine è blackboard.png o pc.jpg
        if (image === 'blackboard.png' || image === 'pc.png') {
            const inputElement = document.createElement('input');
            inputElement.type = 'text';
            inputElement.style.position = 'absolute';
            inputElement.style.top = '60%';
            inputElement.style.left = '50%';
            inputElement.style.transform = 'translate(-50%, -50%)';
            inputElement.style.padding = '10px';
            inputElement.style.boxSizing = 'border-box';
            inputElement.style.fontFamily = textElement.style.fontFamily;
            inputElement.style.textAlign = 'center';
            inputElement.style.backgroundColor = 'transparent'; // Rendi la casella di testo trasparente
            inputElement.style.border = '2px solid white'; // Mostra solo il bordo bianco
            inputElement.style.color = 'white';
            inputElement.id = 'answerInput';

            openBookElement.appendChild(inputElement);

            // Aggiungi un listener per verificare la risposta
            inputElement.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    const answer = inputElement.value.trim().toLowerCase();
                    if (image === 'blackboard.png') {
                        if (['candela', 'la candela'].includes(answer)) {
                            this.hideOpenImage();
                            this.event.textBox.undergroungEmptyEvent= false;
                            this.rightAnswer = true;
                        } else {
                            this.hideOpenImage();
                        }
                    } else if (image === 'pc.png') {
                        if (answer === '452') {
                            this.showTransitionMessage('Manca la parte finale del codice.');
                        } else if (answer === '001') {
                            this.showTransitionMessage('Manca la parte iniziale del codice.');
                        } else if (answer === '452001') {
                            this.event.textBox.gameFinisched = true;
                            this.hideOpenImage();
                            this.showTransitionMessage('Codice corretto! Hai attivato il portale.');
                            setTimeout(() => {
                                this.changeBackgroundMusic(null);
                                this.showEndScreen(true);
                            }, 2000);
                        } else {
                            this.showTransitionMessage('Codice errato.');
                        }
                    }
                }
            });
        }

        document.body.appendChild(openBookElement);

        // Aggiungi un listener per chiudere l'immagine con il tasto ESC
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.hideOpenImage();
            }
        });
    }

    hideOpenImage() {
        const openBookElement = document.getElementById('openBook');
        if (openBookElement) {
            openBookElement.remove();
        }
    }

    showEndScreen(isFinal = false) {
        const endScreen = document.createElement('div');
        endScreen.id = 'endScreen';
        endScreen.style.position = 'fixed';
        endScreen.style.top = '0';
        endScreen.style.left = '0';
        endScreen.style.width = '100vw';
        endScreen.style.height = '100vh';
        endScreen.style.backgroundColor = 'black';
        endScreen.style.display = 'flex';
        endScreen.style.justifyContent = 'center';
        endScreen.style.alignItems = 'center';
        endScreen.style.color = 'lime';
        endScreen.style.fontSize = '2rem';
        endScreen.style.textAlign = 'center';

        if (isFinal) {
            endScreen.innerHTML = "Complimenti, sei riuscito ad attivare il portale!<br><br>FINE";
        } else {
            endScreen.innerHTML = "Hai completato la prima parte del gioco.";
        }

        document.body.appendChild(endScreen);

        const overlay = document.createElement('div');
        overlay.id = 'overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.zIndex = '999';
        document.body.appendChild(overlay);

        if (!isFinal) {
            setTimeout(() => {
                endScreen.remove();  // Rimuove lo schermo nero dopo 3 secondi
                overlay.remove();
                this.switchLevel(); // Cambia livello dopo la schermata
                this.event.startEvent(); // Avvia evento dopo la schermata
            }, 3000);
        } else {
            const countdownAudio = new Audio('./audio/level-win-6416.mp3');
            countdownAudio.loop = false;
            countdownAudio.play().catch(error => {
                console.error('Errore nella riproduzione dell\'audio:', error);
            });
        }
    }


    showInstructions() {
        const introMessageElement = document.getElementById('introMessage');
        introMessageElement.innerHTML = 'Istruzioni:<br>1. Usa le frecce per muoverti.<br><br>2. Premi I per aprire l\'inventario, E per interagire.<br><br>3. Seleziona un oggetto dall\'inventario per usarlo.<br><br>4. Risolvi gli enigmi per avanzare nel gioco, e attento a non metterci troppo!.';
    }

    hideInstructions() {
        const introMessageContainer = document.getElementById('introMessageContainer');
        if (introMessageContainer) {
            introMessageContainer.remove();
        }
    }

    showTransitionMessage(message) {
        const transitionMessageElement = document.createElement('div');
        transitionMessageElement.id = 'transitionMessage';
        transitionMessageElement.textContent = message;
        document.body.appendChild(transitionMessageElement);

        if (this.level.levelName === "Stairs") {
            setTimeout(() => {
                transitionMessageElement.remove();
            }, 3000);
        } else if (this.level.levelName === "SecondHallway" && this.firstCour || this.level.levelName === "BedRoom" || this.level.levelName == "Classroom") {
            setTimeout(() => {
                transitionMessageElement.remove();
            }, 2200);

        } else if (this.level.levelName === "U_Library" || this.level.levelName == "U_Empty" || this.level.levelName == "U_Lab" || this.level.levelName == "U_Gas" || this.level.levelName == "U_LabPC" || this.level.levelName == "U_Start" || this.level.levelName == "Class205") {
            setTimeout(() => {
                transitionMessageElement.remove();
            }, 4100);

        } else {
            setTimeout(() => {
                transitionMessageElement.remove();
            }, 1500);
        }

    }
    
    handleToxicGas() {
        // Mostra il messaggio di avvertimento
        this.showTransitionMessage("Attento! La stanza è piena di gas tossico, procurati una maschera per entrare, o dovrai subirne le conseguenze!");

        // Verifica se il giocatore sta tenendo la maschera di ossigeno
        const heldItem = this.inventory.getHeldItem();
        if (heldItem && heldItem.name === 'Maschera di ossigeno') {
            return; // Se sta tenendo la maschera, non succede nulla
        }

        this.state = 'TOXIC_GAS';
        // Crea un elemento per il conto alla rovescia
        const countdownElement = document.createElement('div');
        countdownElement.id = 'countdown';
        countdownElement.style.position = 'fixed';
        countdownElement.style.top = '50%';
        countdownElement.style.left = '50%';
        countdownElement.style.fontFamily = 'Ancient';
        countdownElement.style.transform = 'translate(-50%, -50%)';
        countdownElement.style.color = 'red';
        countdownElement.style.fontSize = '4rem';
        countdownElement.style.zIndex = '1000';
        document.body.appendChild(countdownElement);

        let countdown = 15;
        let currentScreen = 0;
        countdownElement.textContent = countdown;

        const countdownAudio = new Audio('./audio/wall-clock-ticking.mp3');
        countdownAudio.loop = true;
        countdownAudio.play().catch(error => {
            console.error('Errore nella riproduzione dell\'audio:', error);
        });

        
        // Aggiorna il conto alla rovescia ogni secondo
        const countdownInterval = setInterval(() => {
            countdown -= 1;
            countdownElement.textContent = countdown;

            const heldItemDuringCountdown = this.inventory.getHeldItem();
            if (heldItemDuringCountdown && heldItemDuringCountdown.name === 'Maschera di ossigeno') {
                clearInterval(countdownInterval);
                countdownAudio.pause();
                countdownElement.remove();
                this.state = 'PLAYING';
                return; // Se sta tenendo la maschera, interrompe il countdown
            }

            if (countdown <= 0) {
                clearInterval(countdownInterval);
                countdownAudio.pause();
                countdownElement.remove();
                this.changeBackgroundMusic(null);
                const screenInterval = setInterval(() => {
                    this.changeBackgroundMusic('Respawn');
                    switch (currentScreen) {
                        case 1: 
                            this.levelManager.setCurrentLevel('U_Start');
                            this.level = this.levelManager.getCurrentLevel();
                            this.level.SetCurrentX(0);
                            this.level.SetCurrentY(0);
                            this.level.showCurrentImage();
                            break;
                        case 2:
                            this.levelManager.setCurrentLevel('Stairs');
                            this.level = this.levelManager.getCurrentLevel();
                            this.level.SetCurrentX(0);
                            this.level.SetCurrentY(0);
                            this.level.showCurrentImage();
                            break;
                        case 3:
                            this.levelManager.setCurrentLevel('Stairs');
                            this.level = this.levelManager.getCurrentLevel();
                            this.level.SetCurrentX(0);
                            this.level.SetCurrentY(1);
                            this.level.showCurrentImage();
                            break;
                        case 4:
                            this.levelManager.setCurrentLevel('Hallway');
                            this.level = this.levelManager.getCurrentLevel();
                            this.level.SetCurrentX(1);
                            this.level.SetCurrentY(6);
                            this.level.showCurrentImage();
                            break;
                        case 5:
                            this.levelManager.setCurrentLevel('Hallway');
                            this.level = this.levelManager.getCurrentLevel();
                            this.level.SetCurrentX(1);
                            this.level.SetCurrentY(5);
                            this.level.showCurrentImage();
                            break;
                        case 6:
                            this.levelManager.setCurrentLevel('Hallway');
                            this.level = this.levelManager.getCurrentLevel();
                            this.level.SetCurrentX(1);
                            this.level.SetCurrentY(4);
                            this.level.showCurrentImage();
                            break;
                        case 7:
                            this.levelManager.setCurrentLevel('Hallway');
                            this.level = this.levelManager.getCurrentLevel();
                            this.level.SetCurrentX(1);
                            this.level.SetCurrentY(3);
                            this.level.showCurrentImage();
                            break;
                        case 8:
                            this.levelManager.setCurrentLevel('Hallway');
                            this.level = this.levelManager.getCurrentLevel();
                            this.level.SetCurrentX(1);
                            this.level.SetCurrentY(2);
                            this.level.showCurrentImage();
                            break;
                        case 9:
                            this.levelManager.setCurrentLevel('Hallway');
                            this.level = this.levelManager.getCurrentLevel();
                            this.level.SetCurrentX(1);
                            this.level.SetCurrentY(1);
                            this.level.showCurrentImage();
                            break;
                        case 10:
                            this.levelManager.setCurrentLevel('Hallway');
                            this.level = this.levelManager.getCurrentLevel();
                            this.level.SetCurrentX(1);
                            this.level.SetCurrentY(0);
                            this.level.showCurrentImage();
                            break;
                        case 11:
                            this.levelManager.setCurrentLevel('Classroom');
                            this.level = this.levelManager.getCurrentLevel();
                            this.level.SetCurrentX(1);
                            this.level.SetCurrentY(1);
                            this.level.showCurrentImage();
                            break;
                        case 12:
                            this.levelManager.setCurrentLevel('BedRoom');
                            this.level = this.levelManager.getCurrentLevel();
                            this.level.SetCurrentX(1);
                            this.level.SetCurrentY(2);
                            this.level.showCurrentImage();
                            
                            break;
                        case 13:
                            this.levelManager.setCurrentLevel('BedRoom');
                            this.level = this.levelManager.getCurrentLevel();
                            this.resetTimer();
                            this.level.SetCurrentX(1);
                            this.level.SetCurrentY(1);
                            this.level.showCurrentImage();
                            clearInterval(screenInterval);
                            this.textBox.deathDialogue = true;
                            this.event.textBox.deathDialogue = true;
                            this.event.startEvent();
                            break;
                        default:
                            break;
                    }
                    console.log('currentScreen(prima di aumentarlo) = '+currentScreen);
                    currentScreen++;
                    console.log('currentScreen(dopo averlo aumentato) = '+currentScreen);
                }, 153); 
                console.log('Uscito');

                const overlay = document.createElement('div');
                overlay.id = 'overlay';
                overlay.style.position = 'fixed';
                overlay.style.top = '0';
                overlay.style.left = '0';
                overlay.style.width = '100vw';
                overlay.style.height = '100vh';
                overlay.style.zIndex = '999';
                document.body.appendChild(overlay);
                
                setTimeout(() => {
                    console.log('Stoppo suono di respawn');
                    this.changeBackgroundMusic(null);
                    currentScreen = 0;
                    this.resetTimer();
                    this.state = 'PLAYING';
                    overlay.remove();
                }, 3345);
                
            }
        }, 1000);
        
    }

    changeBackgroundMusic(trackName) {
        
        if (this.currentTrack === trackName && this.isBackgroundPlaying) {
            return;
        }

        
        if (this.backgroundAudio) {
            this.backgroundAudio.pause();
            this.backgroundAudio = null;
        }

        
        if (!trackName) {
            this.currentTrack = null;
            this.isBackgroundPlaying = false;
            return;
        }

        
        this.backgroundAudio = new Audio(`./audio/${trackName}.mp3`);
        this.backgroundAudio.volume = 0.1;
        this.backgroundAudio.loop = true;
        
        this.backgroundAudio.play().catch(error => {
            console.error('Errore nella riproduzione della musica di sottofondo:', error);
        });
        
        this.currentTrack = trackName;
        this.isBackgroundPlaying = true;
    }

    createMenu() {
        this.menuElement = document.createElement('div');
        this.menuElement.id = 'gameMenu';
        
        this.menuButton = document.createElement('button');
        this.menuButton.id = 'menuButton';
        this.menuButton.textContent = 'Menu (ESC)';
        this.menuButton.style.display = 'none';
        this.menuButton.addEventListener('click', () => this.toggleMenu());
        document.body.appendChild(this.menuButton);
        
        const menuContent = `
            <div class="menu-title">OPZIONI</div>
            <span class="menu-close">X</span>
            
            <div class="menu-section">
                <h3>Controlli</h3>
                <ul class="controls-list">
                    <li>Movimento: <span>Frecce/WASD</span></li>
                    <li>Interagisci: <span>E</span></li>
                    <li>Inventario: <span>I</span></li>
                    <li>Menu: <span>ESC/M</span></li>
                </ul>
            </div>
    
            <div class="menu-section">
                <h3>Volume Musica</h3>
                <div class="volume-control">
                    <input type="range" id="musicVolume" min="0" max="1" step="0.1" value="${this.backgroundAudio?.volume || 0.5}">
                </div>
            </div>
    
            <div class="menu-section">
                <h3>Volume Effetti</h3>
                <div class="volume-control">
                    <input type="range" id="sfxVolume" min="0" max="1" step="0.1" value="${this.sfxVolume}">
                </div>
            </div>
        `;
        
        this.menuElement.innerHTML = menuContent;
        document.body.appendChild(this.menuElement);
    
        // Gestori eventi
        this.menuElement.querySelector('.menu-close').addEventListener('click', () => this.toggleMenu());
        this.menuElement.querySelector('#musicVolume').addEventListener('input', (e) => {
            if(this.backgroundAudio) this.backgroundAudio.volume = e.target.value;
        });
        this.menuElement.querySelector('#sfxVolume').addEventListener('input', (e) => {
            this.sfxVolume = e.target.value;
        });
    }
    
    toggleMenu() {
        const shouldShow = !this.menuElement.classList.contains('visible');
        this.menuElement.classList.toggle('visible', shouldShow);

        this.menuButton.style.display = shouldShow ? 'none' : 'block';

        if(shouldShow) {
            this.menuElement.querySelector('#musicVolume').value = this.backgroundAudio?.volume ?? 0.5; // Default 0.5
            this.menuElement.querySelector('#sfxVolume').value = this.sfxVolume;
            this.state = 'MENU';
        } else {
            this.state = 'PLAYING';
        }
    }

}