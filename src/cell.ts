import { Rectangle } from "two.js/src/shapes/rectangle";
import Two from "two.js";
import { Candidate } from "./candidate";

class Cell {
    alive: boolean;
    toDie: boolean;
    body: Rectangle;
    x: number;
    y: number;

    constructor(two: Two, x: number, y: number, cellEdgeSize: number, cellColor: string) {
        this.alive = true;
        this.toDie = false;
        this.x = x;
        this.y = y;
        this.body = two.makeRectangle(x * cellEdgeSize + cellEdgeSize / 2, y * cellEdgeSize + cellEdgeSize / 2, cellEdgeSize, cellEdgeSize);
        this.body.fill = cellColor;
        this.body.stroke = cellColor;
    }

    check(cells: Cell[], candidates: Candidate[]) {
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

        console.log('Alive near', aliveNear);
    }
}

export {
    Cell
}