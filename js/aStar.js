function aStar(start, end) {
    let distances = {}; //Aktuel korteste afstand fra start til slut
    let prev = {}; //forrige node på den korteste vej
    let pq = new PriorityQueue(); //Prioritetskø

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

        //Hvis mål(node) er nået, returnerer hurtigste vej
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
        
        //Opdater naboer
        let neighbors = edges.filter(edge => edge.source === minNode || edge.target === minNode);
        neighbors.forEach(neighbor => {
            let neighborNode = neighbor.source === minNode ? neighbor.target : neighbor.source;
            let alt = distances[minNode] + neighbor.distance;
            let heuristic = distance(nodes.find(n => n.id === neighborNode).x, nodes.find(n => n.id === neighborNode).y,
                                    nodes.find(n => n.id === end).x, nodes.find(n => n.id === end).y);
            if (alt + heuristic < distances[neighborNode]) {
                distances[neighborNode] = alt + heuristic;
                prev[neighborNode] = minNode;
                pq.enqueue(neighborNode, distances[neighborNode]);
            }
        });
    }
    return [];
}
function distance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2); // Euklidisk afstand
}
