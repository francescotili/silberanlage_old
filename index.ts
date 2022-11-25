// Import stylesheets
import './style.css';
import { plantSettings } from './settings';
const appDiv: HTMLElement = document.getElementById('app');

interface SimulationSettings {
  speed: number;
  maxTime: number;
  sampleTime: number;
}

// Simulation class
class Simulation {
  simulationTime: number;
  startBtn: HTMLElement;

  constructor() {
    this.startBtn = document.getElementById('start_btn');
    this.startBtn.addEventListener('click', (e: Event) => {
      // this.simulationTime = maxSimTime;
      this.simulate(plantSettings.simulation as SimulationSettings);
    });
  }

  // Async/Await test function
  async simulate(simulation: SimulationSettings) {
    let time = 0;
    setInterval(() => {
      if (time === simulation.maxTime) {
        // Stops the simulation
        return (appDiv.innerHTML = graphics.updateView(
          silberanlage.baths,
          silberanlage.crane,
          time
        ));
      } else {
        // Simulate next step

        // Update graphics
        appDiv.innerHTML = graphics.updateView(
          silberanlage.baths,
          silberanlage.crane,
          time
        );
        time += simulation.sampleTime;
      }
    }, 1000 / simulation.speed);
  }

  // silberanlage.updateBaths(sampleTime)

  // import Crane class & interfaces
  // import various interfaces
  // set all the cosstants

  // Initialize variables

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
}

import { SilberAnlage } from './plant';

// Import data
import { bathsInitData, aufragToWork } from './settings';
import { GraphicMotor } from './graphics';

/* * * * * * * * *
 *   SIMULATION  *
 * * * * * * * * */

// Initialize the plant
let silberanlage = new SilberAnlage(bathsInitData, aufragToWork);

// Initialize the graphics
let graphics = new GraphicMotor();

// Initialize view graphics
appDiv.innerHTML = graphics.updateView(
  silberanlage.baths,
  silberanlage.crane,
  0
);

// Initialize simulation
new Simulation();
