import Two from "two.js";
import { Rectangle } from "two.js/src/shapes/rectangle";
import { Vector } from "two.js/src/vector";

const two = new Two({
    fullscreen: true,
    autostart: true
  }).appendTo(document.body);

window.isRunning = false;

window.addEventListener('click', (e) => {
    console.log('hit', e);
    const x = Math.round(e.clientX / 10);
    const y = Math.round(e.clientY / 10);
    console.log(x, y);
    cells.push(new Cell(x, y));
})

const bg = two.makeRectangle(0, 0, two.width, two.height);
bg.fill = '#111';
bg.origin = new Vector( -1 * two.width / 2, -1 * two.height / 2);

let gridX = 0;
while(gridX < two.width) {
    let line = two.makeLine(gridX, 0, gridX, two.height);
    line.stroke = '#222';
    gridX += 10;
}

let gridY = 0;
while(gridY < two.width) {
    let line = two.makeLine(0, gridY, two.width, gridY);
    line.stroke = '#222'
    gridY += 10;
}

interface Candidate {
    x: number,
    y: number,
    aliveNear: number
}


class Cell {
    alive: boolean;
    toDie: boolean;
    body: Rectangle;
    x: number;
    y: number;
    // neighbors: Cell[];

    constructor(x: number, y: number) {
        this.alive = true;
        this.toDie = false;
        this.x = x;
        this.y = y;
        this.body = two.makeRectangle(x * 10 + 5, y * 10 + 5, 10, 10);
        this.body.fill = '#454ae5';
        this.body.stroke = '#454ae5';
    }

    check() {
        let aliveNear = 0;
        let startX = -1;
        while( startX <= 1) {
            let startY = -1;
            while(startY <= 1) {
                if(startX === 0 && startY === 0) {
                    startY++;
                    continue;
                }
                let n = cells.find(cell => {
                    return cell.x === this.x + startX
                        && cell.y === this.y + startY
                        && cell.alive 
                })
                if(n) {
                    aliveNear++;
                } else {
                    let newCandidate = candidates.find(cell => {
                        return cell.x === this.x + startX
                        && cell.y === this.y + startY;
                        
                    });
                    if(newCandidate) {
                        newCandidate.aliveNear++;
                    }
                    candidates.push({
                        x: this.x + startX, 
                        y: this.y + startY,
                        aliveNear: 1
                    });
                }
                startY++;
            }
            startX++;
        }

        if(aliveNear < 2 || aliveNear > 3) {
            this.toDie = true;
            this.body.fill = '#009900';
        }

        // if(aliveNear === 3 && this.alive === false) {
        //     this.toDie = true;
        // }

        console.log('Alive near', aliveNear);
    }
}

let candidates: Candidate[] = [];
let cells = [
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
        cells.forEach(cell => cell.check());
        const newCells = turnCandidates(candidates);
        cells = removeDead(cells);
        cells = joinCells(cells, newCells);
        
        timerElapsed = 0;
        console.dir(cells);
        console.dir(candidates);

        candidates = [];
    }

});

function turnCandidates(candidates: Candidate[]) : Cell[] {
    return candidates.filter(q => q.aliveNear === 3).map(candidate => new Cell(candidate.x, candidate.y));
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