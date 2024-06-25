//Implementerer en prioritets Queue og bruger Djkstras algoritme til at finde og tegne korteste vej
class PriorityQueue {
    constructor() {
        this.items = [];
    }

    enqueue(element, priority) { //Tilføjer et element til køen med en bestemt prioritet, hvor lavere prioritet behandles først.
        let qElement = { element, priority };
        let added = false;
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].priority > qElement.priority) {
                this.items.splice(i, 0, qElement);
                added = true;
                break;
            }
        }
        if (!added) {
            this.items.push(qElement);
        }
    }

    dequeue() { //Fjerner og returnerer elementet med den højeste prioritet (laveste værdier først).
        if (this.isEmpty()) {
            return "Underflow";
        }
        return this.items.shift();
    }

    isEmpty() { //Kontrollerer, om køen er tom.
        return this.items.length === 0;
    }
}