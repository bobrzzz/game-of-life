import Two from "two.js";
import { Cell } from "./src/cell";
import { Candidate } from "./src/candidate";
import { createGrid } from "./src/grid";
import { init as initInterface, addGlobalListener, initToggleButton, initSpeedDecreaseButton, initSpeedIncreaseButton, updateCycleMeter} from "./src/interface";


const backgroundColor = '#111';
const linesColor = '#222';
const cellColorAngle = 240;
const colorChangeSpeed = 15;
const cellEdgeSize = 20; 1 * 2 / 1 / 2
const speed = 100;
const two = new Two({
    fullscreen: true,
    autostart: true
}).appendTo(document.body);

let isRunning = false;
let iterationsDone = 0;
let candidates: Candidate[] = [];
let cells: Cell[] = [];
let timerElapsed = 0;

function init() {

    createGrid(two, backgroundColor, linesColor, cellEdgeSize);
    initInterface().then(() => {
        addGlobalListener(addNewCell);
        initToggleButton(toggleGame);
        initSpeedIncreaseButton(speedIncrease);
        initSpeedDecreaseButton(speedDecrease);
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

two.bind('update', function() {
    if(!isRunning) {
        return;
    }
    console.log();
    timerElapsed += two.timeDelta;
    if(timerElapsed >= 1000) {
        cells.forEach(cell => cell.check(cells, candidates));
        const newCells = turnCandidates(candidates);
        cells = removeDead(cells);
        cells = joinCells(cells, newCells);
        
        timerElapsed = 0;
        iterationsDone++;
        updateCycleMeter(iterationsDone);
        // if(counter) {
        //     counter.innerText = iterationsDone.toString();
        // }
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