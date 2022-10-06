"use strict";
var State;
(function (State) {
    State[State["Clicked"] = 0] = "Clicked";
    State[State["One"] = 1] = "One";
    State[State["Two"] = 2] = "Two";
    State[State["Three"] = 3] = "Three";
    State[State["Four"] = 4] = "Four";
    State[State["Five"] = 5] = "Five";
    State[State["Six"] = 6] = "Six";
    State[State["Seven"] = 7] = "Seven";
    State[State["Eight"] = 8] = "Eight";
    State[State["Mine"] = 9] = "Mine";
    State[State["Not Clicked"] = 10] = "Not Clicked";
})(State || (State = {}));
const imageMapping = [
    [State.Clicked, 'minesweeper_tiles/Minesweeper_LAZARUS_21x21_mine_hit.png'],
    [State.One, 'minesweeper_tiles/Minesweeper_LAZARUS_21x21_1.png'],
    [State.Two, 'minesweeper_tiles/Minesweeper_LAZARUS_21x21_2.png'],
    [State.Three, 'minesweeper_tiles/Minesweeper_LAZARUS_21x21_3.png'],
    [State.Four, 'minesweeper_tiles/Minesweeper_LAZARUS_21x21_4.png'],
    [State.Five, 'minesweeper_tiles/Minesweeper_LAZARUS_21x21_5.png'],
    [State.Six, 'minesweeper_tiles/Minesweeper_LAZARUS_21x21_6.png'],
    [State.Seven, 'minesweeper_tiles/Minesweeper_LAZARUS_21x21_7.png'],
    [State.Eight, 'minesweeper_tiles/Minesweeper_LAZARUS_21x21_8.png'],
    [State["Not Clicked"], 'minesweeper_tiles/Minesweeper_LAZARUS_21x21_unexplored.png']
];
class Tile {
    constructor(x, y, width, height, state) {
        this.height = 0;
        this.width = 0;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.State = state;
    }
    draw(canvas) {
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.addEventListener('load', () => {
            ctx.drawImage(img, this.x, this.y, this.width, this.height);
        });
        let src;
        if (imageMapping.findIndex(mapping => mapping[0] == this.State) != -1) {
            src = imageMapping[imageMapping.findIndex(mapping => mapping[0] == this.State)][1];
        }
        else {
            src = imageMapping[imageMapping.findIndex(mapping => mapping[0] == State["Not Clicked"])][1];
        }
        console.log(this.State);
        img.src = src;
    }
}
class TileSet {
    constructor(numRows, numCols, canvas) {
        this.tiles = [];
        console.log(canvas);
        const tileHeight = canvas.height / numRows;
        const tileWidth = canvas.width / numCols;
        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numCols; j++) {
                let tile = new Tile(i * tileWidth, j * tileHeight, tileWidth, tileHeight, State["Not Clicked"]);
                this.tiles.push(tile);
            }
        }
    }
    draw(canvas) {
        this.tiles.forEach(tile => tile.draw(canvas));
    }
    clicked(mousePos) {
        this.tiles.forEach(tile => {
            if ((mousePos.x < tile.x + tile.width) && (mousePos.x > tile.x)
                && (mousePos.y < tile.y + tile.height) && (mousePos.y > tile.y)) {
                tile.State = State.Clicked;
            }
        });
    }
}
class MousePos {
    constructor() {
        this.x = 0;
        this.y = 0;
    }
}
const tileSrc = "minesweeper_tiles/Minesweeper_LAZARUS_21x21_0.png";
const tileClickedSrc = "minesweeper_tiles/Minesweeper_LAZARUS_21x21_mine_hit.png";
const numRows = 8;
const numCols = 8;
window.addEventListener('load', () => {
    var _a;
    const canvas = document.querySelector('canvas');
    const tileSet = new TileSet(numRows, numCols, canvas);
    const mousePos = new MousePos();
    drawTiles(tileSet);
    (_a = document.querySelector('canvas')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', (e) => {
        canvasClicked(e, tileSet);
    });
});
function drawTiles(tileSet) {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    tileSet.draw(canvas);
}
function canvasClicked(e, tileSet) {
    var _a;
    const rect = (_a = document.querySelector('canvas')) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
    const mousePos = new MousePos();
    mousePos.x = e.clientX - rect.x;
    mousePos.y = e.clientY - rect.y;
    tileSet.clicked(mousePos);
    drawTiles(tileSet);
}
