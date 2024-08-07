document.addEventListener('DOMContentLoaded', () => {
    console.log('Nodes:', nodes); //Log nodes
    console.log('Edges:', edges); //Log edges
    
    //Opret SVG-container
    const svg = d3.select('#map').append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', '0 0 800 400') //Juster viewBox dimensioner efter behov
        .attr('preserveAspectRatio', 'xMidYMid meet'); 

    //Tegner grafen
    drawEdgesAndNodes(svg, nodes, edges);

    let startNode = null;
    let endNode = null;
    let selectedAlgorithm = 'dijkstra';

    d3.select('#algorithmSelect').on('change', function() {
            selectedAlgorithm = this.value;
    });
    
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
                .attr('fill', 'green')
                .attr('id', `startNode_${startNode.id}`); // Tilføj unik id
        } else if (!endNode) {
            endNode = closestNode;
            console.log('End node selected:', endNode.id);
            svg.append('circle')
                .attr('cx', endNode.x)
                .attr('cy', endNode.y)
                .attr('r', 12)
                .attr('fill', 'red')
                .attr('id', `endNode_${endNode.id}`); //Tilføj unik id

            //Find den korteste vej fra startNode til endNode
            let dijkstraPath = dijkstraWithHighlights(svg, startNode.id, endNode.id);
            console.log('Dijkstra path:', dijkstraPath);

            //korteste vej fra startNode til endNode med A*
            let aStarPath = aStarWithHighlights(svg, startNode.id, endNode.id);
            console.log('A* path:', aStarPath);
            
            d3.select('#distance-info').html(''); //Ryd totalDistanceText-div

            svg.selectAll('.totalDistanceText').remove();

            //Tegn korteste vej på SVG med forskellige farver
            drawShortestPath(svg, dijkstraPath, nodes, 'red', 'Dijkstra');
            drawShortestPath(svg, aStarPath, nodes, 'blue', 'A*');   
        }
    });
    
    document.getElementById('resetButton').addEventListener('click', () => {
        resetNodes();
        d3.selectAll('svg > *').remove();
        drawEdgesAndNodes(svg, nodes, edges);
        startNode = null;
        endNode = null;
  
    });

   
});

function resetNodes() {
    //Fjern start- og slutnoderne fra SVG'en
    d3.select('[id^=startNode_]').remove();
    d3.select('[id^=endNode_]').remove();

    //Nulstil startNode og endNode variablerne
    startNode = null;
    endNode = null;

    //Ryd ruteoplysningerne
    d3.select('#distance-info').html('');
}

function getClosestNode(x, y, nodes) {
    return nodes.reduce((closestNode, node) => {
        const dist = distance(x, y, node.x, node.y);
        return dist < distance(x, y, closestNode.x, closestNode.y) ? node : closestNode;
    }, nodes[0]);
}


function distance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}




