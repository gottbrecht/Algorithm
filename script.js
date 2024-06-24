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

//Dijkstras algoritme
function dijkstra(start, end) {
    let distances = {}; //Objekt, gemmer den korteste afstand fra startnoden til hver anden node.
    let prev = {}; //Object der gemmer den forrige node på den korteste vej til hver node
    let pq = new PriorityQueue(); //en prioritetskø til at vælge den node med den mindste afstand, der endnu ikke er blevet behandlet


    nodes.forEach(node => {
        if (node.id === start) {//Opsætning af startværdier
            distances[node.id] = 0; //Afstand fra startnode til sig selv er 0
            pq.enqueue(node.id, 0); //Tilføj startnoden til prioritetskøen med prioritet 0
        } else {
            distances[node.id] = Infinity; //Afstand til alle noder sættes til uendelig
            pq.enqueue(node.id, Infinity); //Tilføj de andre noder til prioritetskøen med prioritet uendelig
        }
        prev[node.id] = null; //For alle noder sættes den forrige node til null.
    });

    while (!pq.isEmpty()) {
        let minNode = pq.dequeue().element; //fjern og returner den node med den mindste afstand

        if (minNode === end) {
            let path = [];
            let temp = end;
            while (prev[temp]) {
                path.push(temp);
                temp = prev[temp];
            }
            path.push(start);
            return path.reverse(); //Returner den fundne vej i korrekt rækkefølge.
        }


        //Naboer
        let neighbors = edges.filter(edge => edge.source === minNode || edge.target === minNode);
        neighbors.forEach(neighbor => {
            let neighborNode = neighbor.source === minNode ? neighbor.target : neighbor.source;
            let alt = distances[minNode] + neighbor.distance;
            if (alt < distances[neighborNode]) {
                distances[neighborNode] = alt;
                prev[neighborNode] = minNode;
                pq.enqueue(neighborNode, distances[neighborNode]);
            }
        });
    }
    return []; //Returnerer tom vej
}
/* Implementering af Dijkstra's algoritme beregner den korteste vej i en graf ved at:

Initialisere afstande og prioritetskøen.
Iterativt vælge den node med den korteste kendte afstand, opdatere afstande til dens naboer og tilføje naboerne til køen.
Konstruere og returnere den korteste vej, når slutnoden nås, eller returnere en tom liste, hvis ingen vej findes.*/


