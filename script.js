//Definerer nodernes X/Y koordinat for nnodens punkter på kortet
const nodes = [
    { id: 'A', x: 100, y: 100 },
    { id: 'B', x: 300, y: 100 },
    { id: 'C', x: 500, y: 100 },
    { id: 'D', x: 200, y: 300 },
    { id: 'E', x: 400, y: 300 },
    { id: 'F', x: 300, y: 500 }
];
//Kanterne repræsenterer stier mellem punkterne og angiver afstanden mellem dem.
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

