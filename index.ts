import Two from "two.js";
import { Cell } from "./src/cell";
import { Candidate } from "./src/candidate";
import { createGrid } from "./src/grid";
import { init as initInterface, addGlobalListener, initToggleButton, initSpeedDecreaseButton, initSpeedIncreaseButton, updateCycleMeter, updateSpeedMeter} from "./src/interface";


const backgroundColor = '#111';
const linesColor = '#222';
const cellColorAngle = 240;
const colorChangeSpeed = 15;
const cellEdgeSize = 20;
const speedOptions = [1000, 500, 100, 50, 20];
const speedDefaultIndex = 2;
const two = new Two({
    fullscreen: true,
    autostart: true
}).appendTo(document.body);

let isRunning = false;
let iterationsDone = 0;
let candidates: Candidate[] = [];
let cells: Cell[] = [];
let timerElapsed = 0;
let speedIndex = speedDefaultIndex;

function init() {
    createGrid(two, backgroundColor, linesColor, cellEdgeSize);
    initInterface().then(() => {
        addGlobalListener(addNewCell);
        initToggleButton(toggleGame);
        initSpeedIncreaseButton(changeSpeed(1));
        initSpeedDecreaseButton(changeSpeed(-1));
    })
}

function toggleGame() {
    isRunning = !isRunning;
    return isRunning;
}

function speedIncrease() {

}

function speedDecrease() {
    
}

function changeSpeed(delta: number) {
    return function() {
        const tempIndex = speedIndex + delta;
        
        if(tempIndex < 0 || tempIndex >= speedOptions.length) {
            return;
        }

        speedIndex = tempIndex;
        
        const speedRatio = speedOptions[speedDefaultIndex] / speedOptions[speedIndex];
        updateSpeedMeter(speedRatio);
    }
}



two.bind('update', function() {
    if(!isRunning) { // Try dispatching from Pablo
        return;
    }
    console.log();
    timerElapsed += two.timeDelta;
    if(timerElapsed >= speedOptions[speedIndex]) {
        cells.forEach(cell => cell.check(cells, candidates));
        const newCells = turnCandidates(candidates);
        cells = removeDead(cells);
        cells = joinCells(cells, newCells);
        
        timerElapsed = 0;
        iterationsDone++;
        updateCycleMeter(iterationsDone);
        console.dir(cells);
        console.dir(candidates);

        candidates = [];
        if(cells.length === 0) {
            toggleGame();
        }
    }

});

const addNewCell = function (e: MouseEvent) { // Interesting that I needed to use function expression to solve types
    console.log('hit', e);
    const x = Math.round(e.clientX / cellEdgeSize);
    const y = Math.round(e.clientY / cellEdgeSize);
    console.log(x, y);
    cells.push(new Cell(two, x, y, cellEdgeSize, cellColorAngle, colorChangeSpeed));
} as (e: Event) => void;

function turnCandidates(candidates: Candidate[]) : Cell[] {
    return candidates.filter(q => q.aliveNear === 3).map(candidate => new Cell(two, candidate.x, candidate.y, cellEdgeSize, cellColorAngle, colorChangeSpeed));
}

function joinCells(a: Cell[], b: Cell[]) {
    return [...a, ...b];
}

function removeDead(cells: Cell[]) {
    const alive = cells.filter(q => !q.toDie);
    let index = cells.findIndex(q => q.toDie);
    while(index >= 0) {
        let dead = cells.splice(index, 1);
        dead[0].body.remove();
        delete dead[0];
        index = cells.findIndex(q => q.toDie);
    }

    return alive;
}

init();