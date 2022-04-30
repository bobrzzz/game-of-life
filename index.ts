import Two from "two.js";
import { Vector } from "two.js/src/vector";
import { Cell } from "./src/cell";
import { Candidate } from "./src/candidate";

const backgroundColor = '#111';
const linesColor = '#222';
const cellColor = '#454ae5';
const cellEdgeSize = 20;
let isRunning = false;
let iterationsDone = 0;
let counter: HTMLElement | null;
let button: HTMLElement | null;

const two = new Two({
    fullscreen: true,
    autostart: true
  }).appendTo(document.body);

window.onload = function() {
    window.addEventListener('click', (e) => {
        console.log('hit', e);
        const x = Math.round(e.clientX / cellEdgeSize);
        const y = Math.round(e.clientY / cellEdgeSize);
        console.log(x, y);
        cells.push(new Cell(two, x, y, cellEdgeSize, cellColor));
    });

    button = document.querySelector('.panel__button');
    button?.addEventListener('click', (e) => {
        e.stopImmediatePropagation();
        toggleGame();        
    });

    counter = document.querySelector('.panel__counter');
}

function toggleGame() {
    isRunning = !isRunning;
    if(button) {
        button.innerText = isRunning ? 'Pause' : 'Start';
    }
}



const bg = two.makeRectangle(0, 0, two.width, two.height);
bg.fill = backgroundColor;
bg.origin = new Vector( -1 * two.width / 2, -1 * two.height / 2);

let gridX = 0;
while(gridX < two.width) {
    let line = two.makeLine(gridX, 0, gridX, two.height);
    line.stroke = linesColor;
    gridX += cellEdgeSize;
}

let gridY = 0;
while(gridY < two.width) {
    let line = two.makeLine(0, gridY, two.width, gridY);
    line.stroke = linesColor
    gridY += cellEdgeSize;
}






let candidates: Candidate[] = [];
let cells: Cell[] = [
    // new Cell(4,4), 
    // new Cell(3,3), 
    // new Cell(2,4), 
    // new Cell(2,3), 
    // new Cell(3,1),

    // new Cell(10,9),
    // // new Cell(10,10),
    // new Cell(10,11),

    // new Cell(10,13),
    // // new Cell(10,14),
    // new Cell(10,15),

    // // new Cell(10,12),

    // new Cell(9,12),
    // // new Cell(8,12),
    // new Cell(7,12),

    // new Cell(11,12),
    // // new Cell(12,12),
    // new Cell(13,12),

];
let timerElapsed = 0;


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
        if(counter) {
            counter.innerText = iterationsDone.toString();
        }
        console.dir(cells);
        console.dir(candidates);

        candidates = [];
        if(cells.length === 0) {
            toggleGame();
        }
    }

});

function turnCandidates(candidates: Candidate[]) : Cell[] {
    return candidates.filter(q => q.aliveNear === 3).map(candidate => new Cell(two, candidate.x, candidate.y, cellEdgeSize, cellColor));
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