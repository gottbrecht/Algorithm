document.addEventListener('DOMContentLoaded', () => {
    //Opret SVG-container
    const svg = d3.select('#map').append('svg')
        .attr('width', '100%')
        .attr('height', '100%');

    //Tegner grafen
    drawEdgesAndNodes(svg, nodes, edges);

    let startNode = null;
    let endNode = null;

    svg.on('click', function(event) {
        const [x, y] = d3.pointer(event);
        const closestNode = getClosestNode(x, y, nodes);

        if (!startNode) {
            startNode = closestNode;
            console.log('Start node selected:', startNode.id);
            svg.append('circle')
                .attr('cx', startNode.x)
                .attr('cy', startNode.y)
                .attr('r', 12)
                .attr('fill', 'green');
        } else if (!endNode) {
            endNode = closestNode;
            console.log('End node selected:', endNode.id);
            svg.append('circle')
                .attr('cx', endNode.x)
                .attr('cy', endNode.y)
                .attr('r', 12)
                .attr('fill', 'red');

            //Find den korteste vej fra startNode til endNode
            let path = dijkstra(startNode.id, endNode.id);
            console.log('Shortest path:', path);

            //Tegn den korteste vej på SVG
            drawShortestPath(svg, path, nodes);
        }
    });
});

function getClosestNode(x, y, nodes) {
    let closestNode = nodes[0];
    let minDist = distance(x, y, closestNode.x, closestNode.y);
    nodes.forEach(node => {
        const dist = distance(x, y, node.x, node.y);
        if (dist < minDist) {
            closestNode = node;
            minDist = dist;
        }
    });
    return closestNode;
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}
    /*//Finder korteste vej fra A til F
    let path = dijkstra('A', 'F'); //kalder Dijkstras algoritme for korteste vej
    console.log('Shortest path:', path);

    //Tegner den korteste vej på SVG
    drawShortestPath(svg, path, nodes);
});*/
