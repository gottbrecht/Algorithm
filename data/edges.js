const edges = [
    { source: 'A', target: 'B', distance: 5 }, //source: startnode for kant
    { source: 'A', target: 'C', distance: 9 }, //target: slutnode for kant
    { source: 'A', target: 'E', distance: 3 }, //distance: aftsand mellem to nodes
    { source: 'B', target: 'D', distance: 2 },
    { source: 'B', target: 'E', distance: 1 },
    { source: 'C', target: 'E', distance: 4 },
    { source: 'D', target: 'E', distance: 3 },
    { source: 'D', target: 'F', distance: 6 },
    { source: 'E', target: 'H', distance: 1 },
    { source: 'F', target: 'I', distance: 1 },
    { source: 'G', target: 'H', distance: 1 },
    { source: 'H', target: 'I', distance: 3 },
    { source: 'I', target: 'F', distance: 4 },
    { source: 'F', target: 'J', distance: 8 },
    { source: 'J', target: 'K', distance: 6 },
    { source: 'K', target: 'L', distance: 7 }
];