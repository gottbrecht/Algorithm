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


svg.selectAll('text.edge-label')//text.weight
    .data(edges)
    .enter()
    .append('text')
    .attr('x', d => (getNodePosition(d.source, 'x', nodes) + getNodePosition(d.target, 'x', nodes)) / 2)
    .attr('y', d => (getNodePosition(d.source, 'y', nodes) + getNodePosition(d.target, 'y', nodes)) / 2)
    .attr('text-anchor', 'middle')
    //.attr('dy', -5)
    .text(d => d.distance)
    .attr('class',  'edge-label');

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

//Path distance variables
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
        .attr('class', `node ${color}`);
}

function highlightEdge(svg, source, target, color) {
    const edge = edges.find(e => (e.source === source && e.target === target) || (e.source === target && e.target === source));
    if (!edge) {
        console.error('Edge not found:', source, target);
        return;
    }

    console.log(`Highlighting edge: ${source} -> ${target} with color: ${color}`);

    if (color === 'orange') {
        dijkstraExploredDistance += edge.distance;
    } else if (color === 'yellow') {
        aStarExploredDistance += edge.distance;
    }

    svg.selectAll('line')
        .filter(d => d && ((d.source === source && d.target === target) || (d.source === target && d.target === source)))
        .attr('stroke', color)
        .attr('stroke-width', 3);

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

//Initialize distances and previous nodes
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
