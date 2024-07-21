//Implementerer en prioritets Queue og bruger Djkstras algoritme til at finde og tegne korteste vej
class PriorityQueue {
    constructor() {
        this.items = [];
    }
    
    //Tilføjer element til kø med en bestemt prioritet
    enqueue(element, priority) { //Tilføjer et element til køen med en bestemt prioritet, hvor lavere prioritet behandles først.
        let qElement = { element, priority };
        let added = false;
        //Finder den korrekte position baseret på prioritet
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].priority > qElement.priority) {
                this.items.splice(i, 0, qElement);
                added = true;
                break;
            }
        }
        //Hvis elementet har den højeste prioritet, tilføjes det i slutningen
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