import { Item } from './Item.js';

export class Inventory {
    constructor() {
        if (Inventory.instance) {
            return Inventory.instance;
        }

        this.items = Array.from({ length: 4 }, () => Array(4).fill(null));
        this.inventoryElement = document.getElementById('inventory');
        this.heldItemElement = document.getElementById('held-item'); // Area per l'oggetto in mano
        if (!this.inventoryElement) {
            console.error("Elemento 'inventory' non trovato nel DOM.");
        }
        this.equationVisible = false;
        this.correctAnswer = '';
        this.equationGenerated = false;
        this.correctlyAnswered = false;
        this.showCorrectAnswerDirectly = false;
        this.equationText = '';
        this.heldItem = null;

        Inventory.instance = this;
    }

    static getInstance() {
        if (!Inventory.instance) {
            Inventory.instance = new Inventory();
        }
        return Inventory.instance;
    }

    toggleVisibility() {
        this.inventoryElement.style.display = this.inventoryElement.style.display === 'none' ? 'grid' : 'none';
    }

    checkItem(itemName) {
        for (let i = 0; i < this.items.length; i++) {
            for (let j = 0; j < this.items[i].length; j++) {
                if (this.items[i][j] && this.items[i][j].name === itemName) {
                    return true;
                }
            }
        }
        return false;
    }

    getHeldItem() {
        return this.heldItem;
    }

    addItem(row, col, item, showMessage = true) {
        if (this.items[row][col] === null) {
            this.items[row][col] = item;
            this.updateUI();
            if (showMessage && item.name !== 'Letter') {  
                this.showMessage("Oggetto aggiunto all'inventario.");
            }
        } else {
            console.log("Slot già occupato.");
        }
    }

    removeItemByName(itemName) {
        for (let i = 0; i < this.items.length; i++) {
            for (let j = 0; j < this.items[i].length; j++) {
                if (this.items[i][j] && this.items[i][j].name === itemName) {
                    this.items[i][j] = null;
                    this.updateUI();
                    this.showMessage(`Hai usato l'oggetto ${itemName}.`);
                    return;
                }
            }
        }
        console.log(`Oggetto ${itemName} non trovato nell'inventario.`);
    }

    removeHeldItem() {
        if (this.heldItem) {
            const itemName = this.heldItem.name;
            this.heldItem = null;
            this.clearHeldItemUI();
            this.showMessage(`Hai usato l'oggetto ${itemName}.`);
        } else {
            console.log("Nessun oggetto in mano da rimuovere.");
        }
    }

    removeItem(row, col) {
        if (this.items[row][col] !== null) {
            this.items[row][col] = null;
            this.updateUI();
        } 
    }

    useItem(row, col) {
        const item = this.items[row][col];
        if (this.heldItem!=null) {
            this.heldItem.place(this);
            this.clearHeldItemUI();
        } else if (item) {
            if (item.name === 'Letter') {
                this.showEquation();
            } else if (item.name === 'Registro persone scomparse') {
                this.showRegistro();
            } else {
                item.use(this, row, col);
            }
        }
    }

    showRegistro() {
        const registroContainer = document.createElement('div');
        registroContainer.id = 'registroContainer';

        const registroImage = document.createElement('img');
        registroImage.id = 'registroImage';
        registroImage.src = './images/registro.png';
        registroImage.alt = 'Registro';

        const registroText = document.createElement('div');
        registroText.id = 'registroText';
        registroText.innerHTML = 'Ecco l\'elenco degli studenti scomparsi durante l\'esperimento, non ti scordare di ricontrollare dentro l\'armadietto!';

        registroContainer.appendChild(registroImage);
        registroContainer.appendChild(registroText);
        document.body.appendChild(registroContainer);

        document.addEventListener('keydown', this.handleRegistroKeydown.bind(this));
    }

    handleRegistroKeydown(event) {
        if (event.key === 'Escape') {
            this.hideRegistro();
        }
    }

    hideRegistro() {
        const registroContainer = document.getElementById('registroContainer');
        if (registroContainer) {
            registroContainer.remove();
        }
        document.removeEventListener('keydown', this.handleRegistroKeydown.bind(this));
    }

    showMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.id = 'inventoryMessage';
        messageElement.textContent = message;
        document.body.appendChild(messageElement);

        setTimeout(() => {
            messageElement.remove();
        }, 2000);
    }

    generateEquation() {
        const root1 = Math.floor(Math.random() * 9) + 1;
        const root2 = Math.floor(Math.random() * 9) + 1;
        const a = 1;
        const b = root1 + root2;
        const c = root1 * root2;

        this.correctAnswer = `${root1} ${root2}`;
        return `x^2 + ${b}x + ${c}`;
    }

    generateLockerCode() {
        const [root1, root2] = this.correctAnswer.split(' ');
        const codes = [
            `${root1}${root2}${root1}${root2}`
        ];
        return codes[Math.floor(Math.random() * codes.length)];
    }

    showEquation() {
        this.equationVisible = true;

        if (!this.equationGenerated) {
            this.equationText = `Per aprire l'armadietto, risolvi: ${this.generateEquation()}. Anonimo<br>Inserisci risposte (separate da uno spazio):`;
            this.equationGenerated = true;
        }

        const equationContainer = document.createElement('div');
        equationContainer.id = 'equationContainer';

        const equationImage = document.createElement('img');
        equationImage.id = 'equationImage';
        equationImage.src = './images/equazione.jpg';
        equationImage.alt = 'Equazione';

        const equationText = document.createElement('div');
        equationText.id = 'equationText';
        equationText.innerHTML = this.equationText;

        const inputElement = document.createElement('input');
        inputElement.id = 'equationInput';
        inputElement.type = 'text';

        const instructions = document.createElement('div');
        instructions.id = 'equationInstructions';
        instructions.innerHTML = 'Premi Enter per inviare<br>Esc per uscire';

        equationContainer.appendChild(equationImage);
        equationContainer.appendChild(equationText);
        equationText.appendChild(inputElement);
        equationText.appendChild(instructions);

        document.body.appendChild(equationContainer);

        document.addEventListener('keydown', this.handleEquationKeydown.bind(this));
    }

    handleEquationKeydown(event) {
        if (this.equationVisible && event.key === 'Enter') {
            this.checkEquationAnswer();
        }

        if (this.equationVisible && event.key === 'Escape') {
            this.hideEquation();
        }
    }

    checkEquationAnswer() {
        const inputElement = document.getElementById('equationInput');
        const answer = inputElement.value.trim();
        if (answer === this.correctAnswer || answer === this.correctAnswer.split(' ').reverse().join(' ')) {
            this.correctlyAnswered = true;
            this.showCorrectAnswerDirectly = true;
            this.showCorrectAnswer();
        } else {
            inputElement.value = '';
        }
    }

    showCorrectAnswer(equationContainer = null) {
        if (!equationContainer) {
            equationContainer = document.getElementById('equationContainer');
        }
        const lockerCode = this.generateLockerCode();
        const equationText = document.getElementById('equationText');
        equationText.innerHTML = `Corretto! Hai inserito le risposte giuste. Potrebbe essere un codice per sbloccare qualcosa: ${lockerCode}.<br><br>Premi Esc per uscire`;
    }

    hideEquation() {
        this.equationVisible = false;
        const equationContainer = document.getElementById('equationContainer');
        if (equationContainer) {
            equationContainer.remove();
        }
        document.removeEventListener('keydown', this.handleEquationKeydown.bind(this));
    }

    updateUI() {
        this.inventoryElement.innerHTML = '';

        this.items.forEach((row, rowIndex) => {
            row.forEach((item, colIndex) => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('inventory-item');

                if (item !== null) {
                    const imgElement = document.createElement('img');
                    imgElement.src = item.imageUrl;
                    imgElement.onclick = () => this.useItem(rowIndex, colIndex);
                    itemElement.appendChild(imgElement);
                }

                this.inventoryElement.appendChild(itemElement);
            });
        });
    }
    updateHeldItemUI(item) {
        this.heldItemElement.innerHTML = ''; // Pulisce il div prima di aggiungere un nuovo oggetto

        const img = document.createElement('img');
        img.src = item.imageUrl;
        img.alt = item.name;
        this.heldItemElement.appendChild(img);
    }

    clearHeldItemUI() {
        this.heldItemElement.innerHTML = ''; // Rimuove l'immagine dell'oggetto in mano
    }
}