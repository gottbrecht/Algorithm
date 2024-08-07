function dijkstraWithHighlights(svg, start, end) {
    let { distances, prev } = initializeDistancesAndPrev(nodes, start);
    
    let pq = new PriorityQueue();
    let explored = new Set();

    nodes.forEach(node => {
        if (node.id === start) {
            distances[node.id] = 0;
            pq.enqueue(node.id, 0);
        } else {
            distances[node.id] = Infinity;
            pq.enqueue(node.id, Infinity);
        }
        prev[node.id] = null;
    });

    while (!pq.isEmpty()) {
        let minNode = pq.dequeue().element;

        if (minNode === end) {
            let path = [];
            let temp = end;
            while (prev[temp]) {
                path.push(temp);
                temp = prev[temp];
            }
            path.push(start);
            return path.reverse();
        }

        explored.add(minNode); //Tilføjer til explored - som er et sæt der holder styr på nodes der allerede er blevet behandlet, så de ikke skal besøges igen 
        console.log(`Processing node: ${minNode}`); // Tilføjet logning
        highlightNode(svg, minNode, 'orange'); //ændrer node-farven i SVG'en for at indikere at den er blevet besøgt

        let neighbors = edges.filter(edge => edge.source === minNode || edge.target === minNode);
        neighbors.forEach(neighbor => {
            let neighborNode = neighbor.source === minNode ? neighbor.target : neighbor.source;
            if (!explored.has(neighborNode)) {
                let alt = distances[minNode] + neighbor.distance;
                if (alt < distances[neighborNode]) {
                    distances[neighborNode] = alt;
                    prev[neighborNode] = minNode;
                    pq.enqueue(neighborNode, alt);
                    highlightEdge(svg, minNode, neighborNode, 'orange');
                }
            }
        });
    }
    updatePathDistances();
    return [];
}



function initializeDistancesAndPrev(nodes, start) {
    let distances = {};
    let prev = {};
    nodes.forEach(node => {
        distances[node.id] = Infinity;
        prev[node.id] = null;
    });
    distances[start] = 0;
    
    return { distances, prev };
}



/* Implementering af Dijkstra's algoritme beregner den korteste vej i en graf ved at:

Initialisere afstande og prioritetskøen.
Iterativt vælge den node med den korteste kendte afstand, opdatere afstande til dens naboer og tilføje naboerne til køen.
Konstruere og returnere den korteste vej, når slutnoden nås, eller returnere en tom liste, hvis ingen vej findes.*/
