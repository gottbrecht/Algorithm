function initializeDistancesAndPrev(nodes, start) {
    let distances = {};
    let prev = {};
    nodes.forEach(node => {
        distances[node.id] = node.id === start ? 0 : Infinity;
        prev[node.id] = null;
    });
    return { distances, prev };
}

//Dijkstras algoritme
function dijkstra(start, end) {
    let { distances, prev } = initializeDistancesAndPrev(nodes, start); //Objekt, gemmer den korteste afstand fra startnoden til hver anden node.
    let pq = new PriorityQueue(); //en prioritetskø til at vælge den node med den mindste afstand, der endnu ikke er blevet behandlet
    let explored = new Set(); //Et sæt, der holder styr på de noder, som allerede er blevet behandlet. Dette sikrer, at vi ikke behandler den samme node flere gange.

   
    nodes.forEach(node => {
        pq.enqueue(node.id, distances[node.id]);
    });

    while (!pq.isEmpty()) {
        let minNode = pq.dequeue().element; //fjern og returner den node med den mindste afstand

        if (minNode === end) {
            let path = [];
            let temp = end;
            while (prev[temp]) {
                path.push(temp);
                temp = prev[temp];
            }
            path.push(start);
            return path.reverse(); //Returner den fundne vej i korrekt rækkefølge.
        }

        explored.add(minNode);

        //Naboer
        let neighbors = edges.filter(edge => edge.source === minNode || edge.target === minNode);
        neighbors.forEach(neighbor => {
            let neighborNode = neighbor.source === minNode ? neighbor.target : neighbor.source;
            let alt = distances[minNode] + neighbor.distance;
            if (alt < distances[neighborNode]) {
                distances[neighborNode] = alt;
                prev[neighborNode] = minNode;
                pq.enqueue(neighborNode, distances[neighborNode]);
            }
        });
    }
    return []; //Returnerer tom vej
}
/* Implementering af Dijkstra's algoritme beregner den korteste vej i en graf ved at:

Initialisere afstande og prioritetskøen.
Iterativt vælge den node med den korteste kendte afstand, opdatere afstande til dens naboer og tilføje naboerne til køen.
Konstruere og returnere den korteste vej, når slutnoden nås, eller returnere en tom liste, hvis ingen vej findes.*/
