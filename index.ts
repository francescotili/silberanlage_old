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
        silberanlage.updateBaths(simulation.sampleTime);
        silberanlage.updateCrane(simulation.sampleTime);

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
