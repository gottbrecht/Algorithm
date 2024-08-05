function getNodePosition(nodeId, coordinate, nodes) {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) {
        console.error(`Node with id ${nodeId} not found`);
        return 0;
    }
    return node[coordinate];
}

function drawEdgesAndNodes(svg, nodes, edges) {
//Tilføj kanter(edges) til SVG
svg.selectAll('line')
    .data(edges)
    .enter()
    .append('line')
    .attr('x1', d => getNodePosition(d.source, 'x', nodes))
    .attr('y1', d => getNodePosition(d.source, 'y', nodes))
    .attr('x2', d => getNodePosition(d.target, 'x', nodes))
    .attr('y2', d => getNodePosition(d.target, 'y', nodes))
    .attr('stroke', 'black')
    .attr('class', 'edge');

svg.selectAll('text.weight')
    .data(edges)
    .enter()
    .append('text')
    .attr('x', d => (getNodePosition(d.source, 'x', nodes) + getNodePosition(d.target, 'x', nodes)) / 2)
    .attr('y', d => (getNodePosition(d.source, 'y', nodes) + getNodePosition(d.target, 'y', nodes)) / 2)
    .attr('text-anchor', 'middle')
    .attr('dy', -5)
    .attr('class', 'weight')
    .text(d => d.distance);

   //Tilføj nodes til SVG
svg.selectAll('circle')
   .data(nodes)
   .enter()
   .append('circle')
   .attr('cx', d => d.x)
   .attr('cy', d => d.y)
   .attr('r', 7) 
   .attr('fill', 'blue')
   .attr('class', 'node');


//Tilføj labels til nodes
svg.selectAll('text.node-label')
   .data(nodes)
   .enter()
   .append('text')
   .attr('x', d => d.x)
   .attr('y', d => d.y - 15)
   .attr('text-anchor', 'middle')
   .attr('class', 'node-label')
   .text(d => d.id);

}  

//Path distance Variables
let dijkstraPathDistance = 0;
let aStarPathDistance = 0;
let dijkstraExploredDistance = 0;
let aStarExploredDistance = 0;


function highlightNode(svg, nodeId, color) {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) {
        console.error('Node is undefined or null:', nodeId);
        return;
    }
    console.log('Highlighting node:', nodeId, 'with color:', color);
    
    svg.selectAll('circle')
        .filter(d => d && d.id === nodeId)
        .attr('fill', color);
}

function highlightEdge(svg, source, target, color) {
    const edge = edges.find(e => (e.source === source && e.target === target) || (e.source === target && e.target === source));
    if (!edge) {
        console.error('Edge not found:', source, target);
        return;
    }

    svg.selectAll('line')
        .filter(d => d && ((d.source === source && d.target === target) || (d.source === target && d.target === source)))
        .attr('stroke', color)
        .attr('stroke-width', 3);
    
    if (color === 'orange') {
        dijkstraExploredDistance += edge.distance;
    } else if (color === 'yellow') {
        aStarExploredDistance += edge.distance;
    }

}



function updatePathDistances() {
    d3.select('#distance-info').html(''); //Clear previous distance information

    d3.select('#distance-info').append('div')
        .attr('class', 'totalDistanceText')
        .style('color', 'red')
        .text(`Total distance (Dijkstra): ${dijkstraPathDistance.toFixed(2)} meters`);

    d3.select('#distance-info').append('div')
        .attr('class', 'totalDistanceText')
        .style('color', 'blue')
        .text(`Total distance (A*): ${aStarPathDistance.toFixed(2)} meters`);

    d3.select('#distance-info').append('div')
        .attr('class', 'totalDistanceText')
        .style('color', 'orange')
        .text(`Total distance (Explored - Dijkstra): ${dijkstraExploredDistance.toFixed(2)} meters`);

    d3.select('#distance-info').append('div')
        .attr('class', 'totalDistanceText')
        .style('color', 'yellow')
        .text(`Total distance (Explored - A*): ${aStarExploredDistance.toFixed(2)} meters`);    
}

//Nyeste opdatering: beregner og vise ruteoplysninger:
function drawShortestPath(svg, path, nodes, color, label) {
    let totalDistance = 0;
    const pixelToMeter = 1;
    
//Draw the shortest path on the SVG
for (let i = 0; i < path.length - 1; i++) {
    let node1 = nodes.find(n => n.id === path[i]);
    let node2 = nodes.find(n => n.id === path[i + 1]);
    if (!node1 || !node2) {
        console.error(`Nodes not found for path segment: ${path[i]} to ${path[i + 1]}`);
        continue; //Spring over eller håndter fejlen
    }
    svg.append('line')
        .attr('x1', node1.x)
        .attr('y1', node1.y)
        .attr('x2', node2.x)
        .attr('y2', node2.y)
        .attr('stroke', color)
        .attr('stroke-width', 2)
        .attr('class', `shortest-path ${color}`);

    totalDistance += distance(node1.x, node1.y, node2.x, node2.y);    
}

const totalDistanceInMeters = totalDistance * pixelToMeter;
console.log(`Total distance for ${label}: ${totalDistanceInMeters.toFixed(2)} meters`);

if (color === 'red') {
    dijkstraPathDistance = totalDistanceInMeters;
} else if (color === 'blue') {
    aStarPathDistance = totalDistanceInMeters;
}

d3.select('#distance-info').append('div')
    .attr('class', 'totalDistanceText')
    .style('color', color)
            .text(`Total distance (${label}): ${totalDistanceInMeters.toFixed(2)} meters`);
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

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
       // console.log(`Processing node in A*: ${minNode}`);
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
