function aStarWithHighlights(svg, start, end) {
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

    const heuristic = (a, b) => {
        let nodeA = nodes.find(n => n.id === a);
        let nodeB = nodes.find(n => n.id === b);
        return distance(nodeA.x, nodeA.y, nodeB.x, nodeB.y);
    };

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

        explored.add(minNode);
        console.log(`Processing node in A*: ${minNode}`);
        highlightNode(svg, minNode, 'yellow');

        let neighbors = edges.filter(edge => edge.source === minNode || edge.target === minNode);
        neighbors.forEach(neighbor => {
            let neighborNode = neighbor.source === minNode ? neighbor.target : neighbor.source;
            if (!explored.has(neighborNode)) {
                let alt = distances[minNode] + neighbor.distance;
                let priority = alt + heuristic(neighborNode, end);
                if (alt < distances[neighborNode]) {
                    distances[neighborNode] = alt;
                    prev[neighborNode] = minNode;
                    pq.enqueue(neighborNode, priority);
                    highlightEdge(svg, minNode, neighborNode, 'yellow');
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
        if (node.id === start) {
            distances[node.id] = 0;
        } else {
            distances[node.id] = Infinity;
        }
        prev[node.id] = null;
    });
    return { distances, prev };
}
