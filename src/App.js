import './App.css';
import {useEffect} from 'react';
import {MountainCar} from "./MountainCar";

function between(min, max) {
  return Math.random() * (max - min) + min
}

function createArrayOfSize(size){
  return Array.from({length: size}, () => between(-2,0))
}

function getDiscreteValue(value, minValue, space){
  const discreteValue = (value - minValue)
  let curr = space[0];
  let diff = Math.abs(discreteValue - curr);
  let index = 0;

  for (let val = 0; val < space.length; val++) {
    const newdiff = Math.abs(discreteValue - space[val]);
    if (newdiff < diff) {
      diff = newdiff;
      curr = space[val];
      index = val;
    }
  }
  return index;
}



const DISCRETE_OBSERVATION_SPACE_SIZE = 20;
const ACTIONS = 3;
const LEARNING_RATE = 0.1
const DISCOUNT = 0.95
const EPISODES = 25000

let positions = createArrayOfSize(DISCRETE_OBSERVATION_SPACE_SIZE).map((_,i)=>-1.2+i*0.09);
let velocities = createArrayOfSize(DISCRETE_OBSERVATION_SPACE_SIZE).map((_,i)=>-0.07+i*0.007);
let qTable = createArrayOfSize(DISCRETE_OBSERVATION_SPACE_SIZE).map(()=>createArrayOfSize(DISCRETE_OBSERVATION_SPACE_SIZE).map(()=>createArrayOfSize(ACTIONS)));

function App() {

  useEffect(()=>{
    const canvas = document.getElementsByTagName('canvas')[0];
    const mountainCar = new MountainCar();
    mountainCar.setRandomState();
    mountainCar.render(canvas);

    function step(timestamp) {
      const stateTensor = mountainCar.getStateTensor();
      const positionIndex = getDiscreteValue(stateTensor[0],mountainCar.minPosition,positions);
      const speedIndex = getDiscreteValue(stateTensor[1],mountainCar.minSpeed,velocities);
      const actions = qTable[positionIndex][speedIndex];
      const max = Math.max(...actions);
      const actionIndex = actions.indexOf(max);
      mountainCar.update(max);
      // mountainCar.update(between(0,2)-1);
      // console.log(stateTensor);
      mountainCar.render(canvas);
        window.requestAnimationFrame(step);
    }

    window.requestAnimationFrame(step);
  },[])

  return (
    <div className="App">
      <canvas></canvas>
    </div>
  );
}

export default App;
