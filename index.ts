// Import stylesheets
import './style.css';

// import Bath class & interfaces
// import Crane class & interfaces
// import various interfaces
// set all the cosstants

// import Bath configuration
// init Bath & plant
// import Auftrags

/* start simulation
  cicle to all baths
    if bath is Working
      countdown bath.remainingTime
      if bath.remainingTime still > 0
        do nothing
      if bath.remainingTime goest to 0
        set bath to "Waiting"
        append operation to Crane
        set bath.remainingTime to 0
    if bath is Waiting
      do nothing
    if bath is Free
      do nothing
  update che Crane
    if Crane is Working
      countdown crane.remainingTime
        if crane.remainingTime still > 0
          do nothing
        if crane.remainigTime goes to 0
          set current bath to Working
          set bath.remainingTime
          set crane to Waiting
          transfer Auftrag from Crane to Bath
          set crane.remainingTime to 0
    if Crane is Waiting (TO BE BETTER IMPLEMENTED)
      read operation list
      filter out operation that cannot be completed now (destinations not free)
        if we have no operation left
          do nothing
        if we have only one operation left
          calculate needed time for the operation based on:
            currentposition, pickup position, pickuptimes, dropposition, droptimes
          do the operation
            set crane.remainingTime
            set crane to Working
        if we have more than one operation
          for the number of pending operations (max the first 3)
            calculate every order and corresponding time to execute
            choose the order which have less time
            start doing the first operation of the order
              set crane.remainingTime
              set crane to Working

==> repeat cicle! */

/* how to calculate all possible combinations
const operation = ['A', 'B', 'C', 'D'];
operation.forEach((firstBath) => {
  operation.forEach((secondBath) => {
    operation.forEach((thirdBath) => {
      const tempOrder = [firstBath, secondBath, thirdBath];
      const finalOrder = [...new Set(tempOrder)];
      if (finalOrder.length == 3) {
        console.log(finalOrder);
      }
    });
  });
});
*/

/*function addEdge(adj, src, dest) {
  adj[src].push(dest);
}

function printGraph(adj, v) {
  for (let i = 0; i < v; i++) {
    var temp = i + ' --> ';
    for (let j = 0; j < adj[i].length; j++) {
      temp = temp + adj[i][j] + ' ';
    }
    console.log(temp);
  }
}

// Initialize data structure of the directed graph connections list
const v = 32;
let adj = new Array(v).fill(0).map(() => new Array());

// Build graph
addEdge(adj, 3, 7);
addEdge(adj, 7, 8);
addEdge(adj, 8, 9);
addEdge(adj, 9, 10);
addEdge(adj, 10, 11);
addEdge(adj, 11, 12);
addEdge(adj, 12, 13);
addEdge(adj, 13, 14);
addEdge(adj, 13, 15);
addEdge(adj, 14, 16);
addEdge(adj, 15, 16);
addEdge(adj, 16, 17);
addEdge(adj, 17, 18);
addEdge(adj, 13, 20);
addEdge(adj, 13, 21);
addEdge(adj, 18, 20);
addEdge(adj, 18, 21);
addEdge(adj, 20, 23);
addEdge(adj, 21, 23);
addEdge(adj, 23, 24);
addEdge(adj, 24, 26);
addEdge(adj, 24, 30);
addEdge(adj, 26, 31);
addEdge(adj, 30, 31);
addEdge(adj, 31, 3);
addEdge(adj, 18, 31);
/* addEdge(adj, 31, 27);
addEdge(adj, 31, 28);
addEdge(adj, 31, 29);
addEdge(adj, 27, 31);
addEdge(adj, 28, 31);
addEdge(adj, 29, 31);

printGraph(adj, v); */

// HTML Code
const appDiv: HTMLElement = document.getElementById('app');
appDiv.innerHTML = `<h1>Silberanlage Simulation</h1>`;
