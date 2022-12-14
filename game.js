"use strict";
class ClickTileCommand {
    constructor(tileSet, mousePos) {
        this.tileSet = tileSet;
        this.mousePos = mousePos;
        this.tiles = [...this.tileSet.tiles];
    }
    execute() {
        console.log(this.mousePos);
        this.tileSet.clicked(this.mousePos);
    }
    undo() {
        console.log(this.mousePos);
        this.tileSet.unclicked(this.mousePos);
    }
}
class CommandList {
    constructor() {
        this.commands = [];
        this.currentIndx = 0;
    }
    add(command) {
        this.commands.push(command);
    }
    remove(command) {
        const indx = this.commands.findIndex(findCommand => findCommand == command);
        if (indx != -1) {
            this.commands.splice(indx, 1);
        }
    }
    execute() {
        let command = this.commands[this.currentIndx];
        command.execute();
        this.currentIndx += 1;
    }
    undo() {
        if (this.currentIndx > 0 && this.commands.length > 0) {
            this.currentIndx -= 1;
            let command = this.commands[this.currentIndx];
            command.undo();
        }
    }
}
var State;
(function (State) {
    State[State["Clicked"] = 0] = "Clicked";
    State[State["Zero"] = 1] = "Zero";
    State[State["One"] = 2] = "One";
    State[State["Two"] = 3] = "Two";
    State[State["Three"] = 4] = "Three";
    State[State["Four"] = 5] = "Four";
    State[State["Five"] = 6] = "Five";
    State[State["Six"] = 7] = "Six";
    State[State["Seven"] = 8] = "Seven";
    State[State["Eight"] = 9] = "Eight";
    State[State["Mine"] = 10] = "Mine";
    State[State["Not Clicked"] = 11] = "Not Clicked";
})(State || (State = {}));
const imageMapping = [
    [State.Mine, 'minesweeper_tiles/Minesweeper_LAZARUS_21x21_mine_hit.png'],
    [State.Zero, 'minesweeper_tiles/Minesweeper_LAZARUS_21x21_0.png'],
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
    constructor(x, y, width, height, hasMine, state) {
        this.height = 0;
        this.width = 0;
        this.isClicked = false;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.State = state;
        this.hasMine = hasMine;
    }
    draw(canvas) {
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.addEventListener('load', () => {
            ctx.drawImage(img, this.x, this.y, this.width, this.height);
        });
        let src;
        if (this.isClicked != true) {
            src = imageMapping[imageMapping.findIndex(mapping => mapping[0] == State["Not Clicked"])][1];
        }
        else {
            if (this.hasMine) {
                src = imageMapping[imageMapping.findIndex(mapping => mapping[0]
                    == State.Mine)][1];
            }
            else {
                src = imageMapping[imageMapping.findIndex(mapping => mapping[0] == this.State)][1];
            }
        }
        img.src = src;
    }
}
class TileSet {
    constructor(numRows, numCols, canvas) {
        this.tiles = [];
        const tileHeight = canvas.height / numRows;
        const tileWidth = canvas.width / numCols;
        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numCols; j++) {
                let tile = new Tile(i * tileWidth, j * tileHeight, tileWidth, tileHeight, [true, false][Math.floor(Math.random() * 2)], State["Not Clicked"]);
                this.tiles.push([i, j, tile]);
            }
        }
    }
    draw(canvas) {
        this.tiles.forEach(tile => tile[2].draw(canvas));
    }
    clicked(mousePos) {
        this.tiles.forEach(tileChild => {
            const tile = tileChild[2];
            if ((mousePos.x < tile.x + tile.width) && (mousePos.x > tile.x)
                && (mousePos.y < tile.y + tile.height) && (mousePos.y > tile.y)) {
                tile.isClicked = true;
                tile.State = this.getNumNeighboringMines(tileChild);
            }
        });
    }
    unclicked(mousePos) {
        this.tiles.forEach(tileChild => {
            const tile = tileChild[2];
            if ((mousePos.x < tile.x + tile.width) && (mousePos.x > tile.x)
                && (mousePos.y < tile.y + tile.height) && (mousePos.y > tile.y)) {
                tile.isClicked = false;
            }
        });
    }
    getNumNeighboringMines(currentTile) {
        let neighborMines = 0;
        if (this.neighborHasMine(currentTile, -1, -1)) {
            neighborMines += 1;
        }
        if (this.neighborHasMine(currentTile, -1, 0)) {
            neighborMines += 1;
        }
        if (this.neighborHasMine(currentTile, -1, 1)) {
            neighborMines += 1;
        }
        if (this.neighborHasMine(currentTile, 0, -1)) {
            neighborMines += 1;
        }
        if (this.neighborHasMine(currentTile, 0, 1)) {
            neighborMines += 1;
        }
        if (this.neighborHasMine(currentTile, 1, -1)) {
            neighborMines += 1;
        }
        if (this.neighborHasMine(currentTile, 1, 0)) {
            neighborMines += 1;
        }
        if (this.neighborHasMine(currentTile, 1, 1)) {
            neighborMines += 1;
        }
        switch (neighborMines) {
            case 1: return State.One;
            case 2: return State.Two;
            case 3: return State.Three;
            case 4: return State.Four;
            case 5: return State.Five;
            case 6: return State.Six;
            case 7: return State.Seven;
            case 8: return State.Eight;
            default: return State.Zero;
        }
    }
    neighborHasMine(currentTile, neighborRow, neighBorCol) {
        const neighboringTile = this.tiles.find(tile => tile[0] == currentTile[0] + neighborRow
            && tile[1] == currentTile[1] + neighBorCol);
        if (neighboringTile != undefined) {
            if (neighboringTile[2].hasMine) {
                return true;
            }
            else {
                return false;
            }
        }
        return false;
    }
}
class MousePos {
    constructor() {
        this.x = 0;
        this.y = 0;
    }
}
const numRows = 8;
const numCols = 8;
const clickTileCommands = new CommandList();
window.addEventListener('load', () => {
    var _a, _b, _c;
    const canvas = document.querySelector('canvas');
    const tileSet = new TileSet(numRows, numCols, canvas);
    const mousePos = new MousePos();
    drawTiles(tileSet);
    (_a = document.querySelector('canvas')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', (e) => {
        canvasClicked(e, tileSet);
    });
    (_b = document.getElementById('undoBtn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', (e) => {
        console.log('undo move');
        clickTileCommands.undo();
        drawTiles(tileSet);
    });
    (_c = document.getElementById('redoBtn')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', (e) => {
        console.log('redo move');
        clickTileCommands.execute();
        drawTiles(tileSet);
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
    const clickTileCommand = new ClickTileCommand(tileSet, mousePos);
    clickTileCommands.add(clickTileCommand);
    clickTileCommands.execute();
    drawTiles(tileSet);
}
