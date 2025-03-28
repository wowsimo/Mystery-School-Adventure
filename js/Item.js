export class Item {
    constructor(name, imageUrl) {
        this.name = name;
        this.imageUrl = imageUrl;
        this.originalPosition = null; // Salva la posizione originale
    }

    pickUp(inventory, row, col) {
        if (inventory.heldItem === null) { 
            this.originalPosition = { row, col }; // Salviamo la posizione originale
            inventory.heldItem = this;
            inventory.items[row][col] = null; // Rimuoviamo l'oggetto dall'inventario
            inventory.showMessage(`Hai preso ${this.name}`);
            inventory.updateUI();
        }
    }

    
        place(inventory){
            // Cerca la prima casella libera
            let found = false;
            let row, col;
        
            for (let i = 0; i < inventory.items.length; i++) {
                for (let j = 0; j < inventory.items[i].length; j++) {
                    if (inventory.items[i][j] === null) { // Se lo slot è libero
                        row = i;
                        col = j;
                        found = true;
                        break;
                    }
                }
                if (found) break; // Esce dal ciclo quando trova il primo slot libero
            }
        
            if (!found) {
                inventory.showMessage("Inventario pieno!");
                return;
            }
        
            // Posiziona l'oggetto nella prima casella libera
            inventory.items[row][col] = this;
            inventory.heldItem = null;
            inventory.showMessage(`Hai messo ${this.name} nell'inventario.`);
            inventory.updateUI();
        }
    

    use(inventory, row, col) {
        if (inventory.heldItem === this) {
            this.place(inventory);
            inventory.clearHeldItemUI(); // Rimuove la visualizzazione dell'oggetto in mano
        } else {
            this.pickUp(inventory, row, col);
            inventory.updateHeldItemUI(this); // Mostra l'oggetto in mano
        }
    }
}