function drawEdgesAndNodes(svg, nodes, edges) {
//Tilføj kanter(edges) til SVG
svg.selectAll('line')
    .data(edges)
    .enter()
    .append('line')
    .attr('x1', d => {
        let sourceNode = nodes.find(n => n.id === d.source);
        if (!sourceNode) {
            console.error(`Source node ${d.source} not found`);
            return 0;
        }
        return sourceNode.x;
    })    
        
    .attr('y1', d => {
        let sourceNode = nodes.find(n => n.id === d.source);
        if (!sourceNode) {
                console.error(`Source node ${d.source} not found`);
                return 0;
            }
            return sourceNode.y;
    })
        
    .attr('x2', d => {
        let targetNode = nodes.find(n => n.id === d.target);
            if (!targetNode) {
                console.error(`Target node ${d.target} not found`);
                return 0;
            }
            return targetNode.x;
    })

    .attr('y2', d => {
        let targetNode = nodes.find(n => n.id === d.target);
        if (!targetNode) {
            console.error(`Target node ${d.target} not found`);
            return 0;
        }
        return targetNode.y;
    })
    .attr('stroke', 'black')
    .attr('class', 'edge');


   //Tilføj nodes til SVG
svg.selectAll('circle')
   .data(nodes)
   .enter()
   .append('circle')
   .attr('cx', d => d.x)
   .attr('cy', d => d.y)
   .attr('r', 10)
   .attr('fill', 'blue')
   .attr('class', 'node');


//Tilføj labels til nodes
svg.selectAll('text')
   .data(nodes)
   .enter()
   .append('text')
   .attr('x', d => d.x)
   .attr('y', d => d.y - 15)
   .attr('text-anchor', 'middle')
   .text(d => d.id)
   .attr('class', 'node-label');

}    

function highlightNode(svg, node, color) {
    if (!node) {
        console.error('Node is undefined or null:', node);
        return;
    }
    if (!node.id) {
        console.error('Node does not have an id:', node);
        return;
    }
    svg.selectAll('circle')
        .filter(d => d.id === node)
        .attr('fill', color);
}

function highlightEdge(svg, source, target, color) {
    svg.selectAll('line')
        .filter(d => (d.source === source && d.target === target) || (d.source === target && d.target === source))
        .attr('stroke', color)
        .attr('stroke-width', 3);
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

        explored.add(minNode);
        highlightNode(svg, minNode, 'orange');

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
    return [];
}

function aStarWithHighlights(svg, start, end) {
    let distances = {};
    let prev = {};
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
    return [];
}
