import { Inventory } from './Inventory.js';
import { Item } from './Item.js';
import { LevelManager } from './LevelManager.js';
import { Event } from './Interract.js';
import { Game } from './Game.js';

export class TextBox {
    constructor() {
        this.game = Game.getInstance();
        this.inventory = Inventory.getInstance();
        this.levelManager = LevelManager.getInstance();
        this.currentDialogueIndex = 0;
        this.level = null;
        this.doorOpen = false;
        this.undergroungEmptyEvent = true;
        this.undergroungEmptyAnswerIsTrue = false;
        this.deathDialogue=false;
        document.addEventListener('keydown', this.handleDialogueKeydown.bind(this));
        this.gameFinisched = false;
    }


    obtainEvent(event) {
        this.event = event;
    }

    openDialogue() {
        if(!this.gameFinisched){
            this.level = this.levelManager.getCurrentLevel();
            this.levelManager.setEvent();
            if(this.deathDialogue){
                this.currentDialogueIndex = 2;
            }else{
                this.currentDialogueIndex = 0;
            }
            this.openWindow();
            this.showNextDialogue();
        }
    }

    showNextDialogue() {
        if (this.currentDialogueIndex >= this.getDialoguesLength()) {
            this.closeWindow();
            this.event.eventActive = false;
            this.levelManager.setEvent();
            this.event.updateEventButton(); // Update button color when dialogue ends
            this.game.hideOpenImage();
            return;
        }

        this.displayDialogue();
        this.currentDialogueIndex++;
    }

    getDialoguesLength() {
            switch (this.level.levelName) {
                case 'Hallway':
                    if (this.levelManager.getCurrentLevel().currentX == 0 || this.levelManager.getCurrentLevel().currentX == 2) {
                        return 3;
                    } else {
                        if (this.level.currentY >= 14) {

                            return 3;
                        } else {

                            return 6;
                        }
                    }

                case 'SecondHallway':
                    if (this.levelManager.getCurrentLevel().currentX == 0 || this.levelManager.getCurrentLevel().currentX == 2) {
                        return 3;
                    } else {
                        return 6;
                    }

                case 'Class205':
                    return 20;

                case 'BedRoom':
                    return 4;
                case 'Infirmary':
                    if (this.game.firstCour || this.inventory.checkItem('Maschera di ossigeno')) {
                        return 1;
                    }
                    return 3;
                case 'U_Start':
                    return 3;

                case 'U_Library':
                    return 2;
                case 'U_Books':
                    return 3;
                case 'U_Gas':
                    return 3;
                case 'U_Empty':
                    return 5;
                case 'U_Lab':
                    return 2;
                case 'U_LabPC':
                    return 1;
                default:
                    return 0;
            }
        }
    

    displayDialogue() {
        const dialogueWindow = document.getElementById('dialogueWindow');
        if (!dialogueWindow) return;

        dialogueWindow.innerHTML = '';
        const text = this.getCurrentDialogueText();
        dialogueWindow.innerHTML = text;
    }

    getCurrentDialogueText() {
            switch (this.level.levelName) {
                case 'Hallway':
                    if (this.levelManager.getCurrentLevel().currentX == 0 || this.levelManager.getCurrentLevel().currentX == 2) {
                        return this.getdoorDialogue();
                    } else {
                        if (this.level.currentY >= 14) {
                            return this.getJanitorDialogue();
                        } else {
                            return this.getHallwayDialogue();
                        }
                    }

                case 'SecondHallway':
                    if (this.levelManager.getCurrentLevel().currentX == 0 || this.levelManager.getCurrentLevel().currentX == 2) {
                        return this.getdoorDialogue();
                    } else {
                        return this.getHallwayDialogue();
                    }


                case 'Class205':
                    return this.getStudentDialogue();

                case 'BedRoom':
                    return this.getBedroomDialogue();
                case 'Infirmary':
                    return this.getInfirmaryDialogue();
                case 'U_Start':
                    return this.getUndergroundStartDialogue();
                case 'U_Library':
                    return this.getUndergroundLibraryDialogue();
                case 'U_Books':
                    return this.getUndergroundBooksDialogue();
                case 'U_Gas':
                    return this.getUndergroundGasDialogue();
                case 'U_Lab':
                    return this.getUndergroundLabDialogue();
                case 'U_Empty':
                    return this.getUndergroundEmptyDialogue();
                case 'U_LabPC':
                    return this.getUndergroundLabPCDialogue();
                default:
                    return "Nessun dialogo disponibile";
            }
        }
    

    getBedroomDialogue() {
        switch (this.currentDialogueIndex) {
            case 0:
                return "Fine primo Capitolo!";
            case 1:
                return "Inizio secondo Capitolo: I sotteranei! <br> Ora dovrai recarti nei sotterranei e risolvere il mistero!";
            case 2:
                if(!this.deathDialogue){
                    this.currentDialogueIndex = 3;
                }else{
                    this.deathDialogue = false;
                }
                return "E non impiegare troppo tempo!";
            case 3:
                return "Hai come una senzazione di dejavu...";
            default:
                return "";
        }
    }

    getUndergroundStartDialogue() {
        switch (this.currentDialogueIndex) {
            case 0:
                return "Benvenuto nei sotterranei!";
            case 1:
                return "Qui troverai diversi percorsi, stai attento a non cadere nelle trappole.";
            case 2:
                return "Da qui puoi andare dritto o a sinistra, scegli con attenzione. <br><br>Per tornare alle scale vai indietro";
            default:
                return "";
        }
    }

    getUndergroundLibraryDialogue() {
        switch (this.currentDialogueIndex) {
            case 0:
                return "Ti trovi nella biblioteca sotterranea della scuola";
            case 1:
                return "Vai avanti e interagisci con i libri!";
            default:
                return "";
        }
    }

    getUndergroundBooksDialogue() {
        switch (this.currentDialogueIndex) {
            case 0:
                return "Hai trovato un libro che fuori esce dalla libreria";
            case 1:
                //this.game.showOpenBook();
                return "Dentro il libro c'è la parte finale di un codice: *...001*";
            case 2:
                //this.game.hideOpenBook();
                return "Assicurati di conoscere il codice completo prima di proseguire! <br><br> *Puoi solo tornare indietro*";
            default:
                return "";
        }
    }

    getUndergroundGasDialogue() {
        switch (this.currentDialogueIndex) {
            case 0:
                return "Hai trovato un diario lasciato da qualcuno";
            case 1:
                this.game.showOpenImage("Se sei arrivato fino a questo punto ti devo ringraziare. Ormai non manca molto, assicurati di aver trovato le due parti che compongono il codice e attiva il portale.", 'openBook.png');
                return "";
            case 2:
                this.game.hideOpenImage();
                return "Da qui puoi tornare indietro o andare a destra";
            default:
                return "";
        }
    }

    getUndergroundEmptyDialogue() {
        if(this.undergroungEmptyEvent){
            switch (this.currentDialogueIndex) {
                case 0:
                    return "Ben fatto giocatore, sei quasi giunto alla fine!";
                case 1:
                    return "Per poter proseguire, dovrai prima risovere un indovinello...";
                case 2:
                    this.game.showOpenImage("La mia vita può durare qualche ora, quello che produco mi divora. Sottile, sono veloce, grossa, sono lenta e il vento molto mi spaventa. Chi sono?", 'blackboard.png');
                    return;
                case 3:
                    this.game.hideOpenImage();
                    if(this.undergroungEmptyAnswerIsTrue){
                        return "Risposta corretta!";
                    }else{
                    return "La risposta non è corretta, riprova";
                    }
                case 4:
                    return "Da qui puoi tornare indietro o andare a destra";
                default:
                    return "";
            }
        }else {
            this.currentDialogueIndex = 5;
            return "Da qui puoi tornare indietro o andare a destra";
        }
    }

    getUndergroundLabDialogue() {
        switch (this.currentDialogueIndex) {
            case 0:
                return "Ti trovi nella stanza con il portale";
            case 1:
                return "Vai avanti e inserisci il codice per attivare il portale";
            default:
                return "";
        }
    }

    getUndergroundLabPCDialogue() {
        switch (this.currentDialogueIndex) {
            case 0:
                this.game.showOpenImage("INSERISCI IL CODICE A 6 CIFRE: <br>", 'pc.png');
                return;

            default:
                return "";
        }
    }
    getStudentDialogue() {
        switch (this.currentDialogueIndex) {

            case 0:
                return "*Entrando in classe senti un brivido lungo la schiena*";

            case 1:
                return "*Noti una strana presenza davanti a te*";

            case 2:
                return "*La presenza si avvicina a te*";

            case 3:
                return "???: Non spaventarti. <br><br> *Ah ora si che ti senti tranquillo* ";

            case 4:
                return "???: Sono un ex studente di questa scuola e al momento non dovrei trovarmi qui.";

            case 5:
                return "Gianfrax: Il mio nome è Gianfrax, e ho bisogno del tuo aiuto.";

            case 6:
                return "Gianfrax: Ho fatto in modo che tu trovassi il registro degli studenti scomparsi, e ora ti chiedo di darmi una mano.";

            case 7:
                return "Gianfrax: Tanti anni fa la scuola ha organizzato un esperimento, e io e altri studenti siamo stati coinvolti.";

            case 8:
                return "Gianfrax: Ci era stato detto che l'esperimento serviva a rendere gli studenti più intelligenti sviluppando in loro capacità superiori, con l'aiuto della tecnologia.";

            case 9:
                return "Gianfrax: Ma si è rivelato essere un progetto che mirava a creare portali dimensionali per esperimenti su esseri umani.";

            case 10:
                return "Gianfrax: Alcuni di noi sono riusciti a scappare, altri invece si trovano ancora intrappolati nel portale";

            case 11:
                return "Gianfrax: Tra loro c'è anche un ragazzo che ha vinto molti concorsi di informatica... <br> Si tratta di Dorina dell'ex 4AI!";

            case 12:
                return "*Ti rendi conto che la situazione è più grave di quanto pensassi, decidi di aiutarlo*";

            case 13:
                return "Granfrax: Grazie! Per poter salvare gli altri devi andare a riattivare il portale nei sotteranei.";

            case 14:
                return "Gianfrax: Ma fai attenzione perchè...";

            case 15:
                return "*Sentite un rumore provenire da fuori*";

            case 16:
                return "Granfrax: Oh no, sta arrivando qualcuno, tieni questa chiave, torna a scuola sta sera e recati nei sotterranei!";

            case 17:
                return "Hai ottenuto *Chiave dei sotteranei*";

            case 18:
                this.inventory.addItem(1, 3, new Item('Chiavi della scuola', './images/schoolKey.png'));
                return "*Chiave dei sotteranei* è stata aggiunta all'inventario";

            case 19:
                this.levelManager.levels['Class205'].levelImages[0][2] = './images/Classroom2.jpg';
                this.levelManager.levels['Class205'].showCurrentImage();
                this.levelManager.levels['Classroom'].levelImages[1][1] = './images/Classroom2.jpg';
                return "*Il broski è scomparso*";
            default:
                return "";
        }
    }

    getInfirmaryDialogue() {
        if (this.game.firstCour) {
            return "Non c'è nulla di interessante qui, prova a tornare più tardi.";
        } else if (this.inventory.checkItem('Maschera di ossigeno')) {
            return "Non c'è nulla di interessante qui, hai già preso la maschera di ossigeno.";
        } else {

            switch (this.currentDialogueIndex) {
                case 0:
                    return "C'è una maschera di ossigeno sul tavolo, potrebbe servirti.";

                case 1:
                    this.levelManager.levels['Infirmary'].levelImages[1][2] = './images/noMaskinfirmary.jpg';
                    this.levelManager.levels['Infirmary'].showCurrentImage();
                    return "Hai ottenuto l'oggetto 'Maschera di ossigeno'.";

                case 2:
                    this.inventory.addItem(0, 3, new Item('Maschera di ossigeno', './images/mask.png'));
                    return "Oggetto aggiunto all'inventario.";

                default:
                    return "";
            }
        }
    }

    getJanitorDialogue() {
        if(this.game.firstCour){
            if (this.level.currentY == 14) {
                this.currentDialogueIndex = 3;
                return "Sciao belo, sono il bidello, che succe te serve qualcosa? Se scerchi qualcosa guarda nel cassetto. <br><br> -Vai avanti per aprire lo scaffale-";

            } else {
                switch (this.currentDialogueIndex) {

                    case 0:
                        if (this.inventory.checkItem('Chiavi 205') || !this.game.firstCour) {
                            this.currentDialogueIndex = 4;
                            return "Lo scaffale è vuoto.";
                        } else {
                            return "Hai aperto lo scaffale e ci sono delle chiavi.";
                        }
                    case 1:
                        if (this.inventory.checkItem('Registro persone scomparse')) {
                            this.levelManager.levels['Hallway'].levelImages[15][1] = './images/NoKey.jpg';
                            this.levelManager.levels['Hallway'].showCurrentImage();
                            return "Hai ottenuto l'oggetto 'Chiavi 205'";
                        }
                        this.currentDialogueIndex = 4;
                        return "Adesso non puoi prendere le chiavi";
                    case 2:
                        if (!this.inventory.checkItem('Chiavi 205')) {
                            this.inventory.addItem(1, 1, new Item('Chiavi 205', './images/Key.png'));
                            return "Oggetto aggiunto all'inventario.";
                        } else {
                            this.currentDialogueIndex = 4;
                            return "Lo scaffale è vuoto.";
                        }
                    default:
                        return "";
                }
            }
        }else{
            this.currentDialogueIndex = 4;
            return "Se tu sei qui... vuol dire che quella storia è vera dopotutto...";
        }
    }

    getHallwayDialogue() {
        switch (this.currentDialogueIndex) {
            case 0:
                if (this.level.currentY !== 6) {
                    this.currentDialogueIndex = 6;
                } else if (this.inventory.checkItem('Registro persone scomparse')) {
                    this.currentDialogueIndex = 6;
                    return "Sul fondo dell'armadietto ho trovato queste cifre *452*...";
                }
                return "Gli armadietti sembrano aperti ma non c'è nulla al loro interno.";
            case 1:
                return "Ce n'è uno chiuso! Sembra ci voglia un codice per aprirlo...";
            case 2:
                if (!this.inventory.correctlyAnswered) {
                    this.currentDialogueIndex = 6;
                    return "Non possiedi ancora il codice corretto.";
                }
                return "Codice corretto!";
            case 3:
                return "Si è aperto! Chissà cosa c'è al suo interno...";
            case 4:
                return "Hai ottenuto l'oggetto 'Registro persone scomparse'";
            case 5:
                this.inventory.addItem(0, 1, new Item('Registro persone scomparse', './images/registro.png'));
                return "Oggetto aggiunto all'inventario. ";
            default:
                return "";
        }
    }

    getDeathDialogue() {
        switch (this.currentDialogueIndex) {
            case 0:
                return "Sei morto!";
            case 1:
                this.deathDialogue = false;
                return "Ma la Strega Invidiosa ti ha preso in simpatia!";
            default:
                return "";
        }
    }

    getdoorDialogue() {
        console.log(this.levelManager.getCurrentLevel().currentY);
        console.log(this.levelManager.getCurrentLevel().currentX);
        if (this.levelManager.getCurrentLevel().currentY == 3 && this.levelManager.getCurrentLevel().currentX == 0) {
            if (this.doorOpen) {
                this.currentDialogueIndex = 2;
                return "La porta è aperta";
            } else {
                switch (this.currentDialogueIndex) {
                    case 0:
                        if (!this.inventory.checkItem('Chiavi 205')) {
                            this.currentDialogueIndex = 2;
                            return "La porta è chiusa, se avessi le chiavi potrei aprirla...";
                        }
                        return "Proviamo a usare le chiavi"
                    case 1:
                        return "Hai usato le chiavi per aprire la porta.";
                    case 2:
                        this.doorOpen = true
                        return "Ora la porta è aperta.";
                    default:
                        return "";
                }
            }
        } else {
            switch (this.currentDialogueIndex) {
                case 0:
                    if (!this.inventory.checkItem('Chiavi 205')) {
                        this.currentDialogueIndex = 2;
                        return "La porta è chiusa, se avessi le chiavi potrei aprirla...";
                    }
                    return "Proviamo a usare le chiavi"
                case 1:
                    this.currentDialogueIndex = 3;
                    return "Le chiavi non sembra aprino questa porta";
                default:
                    return "";
            }
        }
    }
    openWindow() {
        let dialogueWindow = document.getElementById('dialogueWindow');
        if (!dialogueWindow) {
            dialogueWindow = document.createElement('div');
            dialogueWindow.id = 'dialogueWindow';
            document.body.appendChild(dialogueWindow);
        }
    }

    closeWindow() {
        const dialogueWindow = document.getElementById('dialogueWindow');
        if (dialogueWindow) dialogueWindow.remove();
    }

    handleDialogueKeydown(event) {
        if (event.key === 'Enter' && this.event?.eventActive) {
            if (this.currentDialogueIndex == 20 && this.level.levelName === 'Class205') {
                this.closeWindow();
                this.event.eventActive = false;
                this.levelManager.setEvent();
                this.event.updateEventButton(); // Update button color when dialogue ends
                this.game.switchCour();

            } else {
                this.showNextDialogue();
            }
        }
    }
}