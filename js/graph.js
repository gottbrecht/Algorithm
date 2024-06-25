document.addEventListener('DOMContentLoaded', () => {
    //Opret SVG-container
    const svg = d3.select('#map').append('svg')
        .attr('width', '100%')
        .attr('height', '100%');

    //Tegner grafen
    drawGraph(svg, nodes, edges);

    //Finder korteste vej fra A til F
    let path = dijkstra('A', 'F'); //kalder Dijkstras algoritme for korteste vej
    console.log('Shortest path:', path);

    //Tegner den korteste vej på SVG
    drawPath(svg, path, nodes);
});
