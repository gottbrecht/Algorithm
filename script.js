//Definerer nodernes X/Y koordinat for nnodens punkter på kortet
const nodes = [
    { id: 'A', x: 100, y: 100 },
    { id: 'B', x: 300, y: 100 },
    { id: 'C', x: 500, y: 100 },
    { id: 'D', x: 200, y: 300 },
    { id: 'E', x: 400, y: 300 },
    { id: 'F', x: 300, y: 500 }
];
//edges repræsenterer stier mellem punkterne og angiver afstanden mellem dem.
const edges = [
    { source: 'A', target: 'B', distance: 1 },
    { source: 'B', target: 'C', distance: 3 },
    { source: 'A', target: 'D', distance: 1 },
    { source: 'B', target: 'D', distance: 1 },
    { source: 'C', target: 'E', distance: 1 },
    { source: 'D', target: 'E', distance: 2 },
    { source: 'D', target: 'F', distance: 1 },
    { source: 'E', target: 'F', distance: 1 }
];

//SVG container
const svg = d3.select('#map').append('svg')
    .attr('width', '100%')
    .attr('height', '100%');

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

