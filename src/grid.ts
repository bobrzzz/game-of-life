import Two from "two.js";
import { Vector } from "two.js/src/vector";

function createGrid(two: Two, backgroundColor: string, linesColor: string, cellEdgeSize: number) {

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
}

export {
    createGrid
}