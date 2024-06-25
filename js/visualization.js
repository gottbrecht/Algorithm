function drawGraph(svg, nodes, edges) {
//Tilføj kanter(edges) til SVG
svg.selectAll('line')
    .data(edges)
    .enter()
    .append('line')
    .attr('x1', d => nodes.find(n => n.id === d.source).x)
    .attr('y1', d => nodes.find(n => n.id === d.source).y)
    .attr('x2', d => nodes.find(n => n.id === d.target).x)
    .attr('y2', d => nodes.find(n => n.id === d.target).y)
    .attr('stroke', 'black');


   //Tilføj nodes til SVG
svg.selectAll('circle')
   .data(nodes)
   .enter()
   .append('circle')
   .attr('cx', d => d.x)
   .attr('cy', d => d.y)
   .attr('r', 10)
   .attr('fill', 'blue');

//Tilføj labels til nodes
svg.selectAll('text')
   .data(nodes)
   .enter()
   .append('text')
   .attr('x', d => d.x)
   .attr('y', d => d.y - 15)
   .attr('text-anchor', 'middle')
   .text(d => d.id);
}    



/*/Find korteste vej fra A til F
let path = dijkstra('A', 'F'); //let path gemmer resultatet af D's algoritme, som en liste af node-id'er, der udgør korteste vej
console.log('Shortest path:', path);
*/

function drawGraph(svg, nodes, edges) {
// Draw the shortest path on the SVG
for (let i = 0; i < path.length - 1; i++) {
    let node1 = nodes.find(n => n.id === path[i]);
    let node2 = nodes.find(n => n.id === path[i + 1]);
    svg.append('line')
        .attr('x1', node1.x)
        .attr('y1', node1.y)
        .attr('x2', node2.x)
        .attr('y2', node2.y)
        .attr('stroke', 'red')
        .attr('stroke-width', 2);
}
}
