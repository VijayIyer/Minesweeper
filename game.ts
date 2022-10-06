
enum State {
	'Clicked',
	'Zero', 
	'One',
	'Two',
	'Three',
	'Four',
	'Five',
	'Six',
	'Seven',
	'Eight',
	'Mine',
	'Not Clicked'     
	}
const imageMapping : Array<[State, string]>= 
[
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
]
class Tile {
	x:number;
	y:number;
	height:number = 0;
	width:number = 0;
	hasMine:boolean;
	isClicked = false;
	State:State;
	constructor(x:number, y:number, width:number, height:number, hasMine:boolean, state:State){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.State = state;
		this.hasMine = hasMine; 
	}
	draw(canvas:HTMLCanvasElement){
		const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
		const img = new Image();
		
		img.addEventListener('load', ()=>{
			ctx.drawImage(img,
				this.x,
				this.y,
				this.width,
				this.height);
		});
		let src:string;
		if(this.isClicked != true){
			src = imageMapping[imageMapping.findIndex(mapping=>mapping[0] == State["Not Clicked"])][1];
		}
		else{
			console.log('tile has mine');
			if(this.hasMine){
				src = imageMapping[imageMapping.findIndex(mapping=>mapping[0]
					== State.Mine)][1];
			}
			else{
				src = imageMapping[imageMapping.findIndex(mapping=>mapping[0] == this.State)][1];	
			}
		}
		console.log(this.State);
		img.src = src;
	}
}
class TileSet{
	tiles:Array<[number, number, Tile]> = [];
	constructor(numRows:number, numCols:number, canvas:HTMLCanvasElement){
		console.log(canvas);
		const tileHeight = canvas.height / numRows;
		const tileWidth = canvas.width / numCols;
		for(let i = 0; i < numRows;i++){
	    	for(let j = 0; j < numCols; j++){
				let tile = new Tile(i*tileWidth, j*tileHeight,
					 tileWidth,
					 tileHeight,
					[true, false][Math.floor(Math.random()*2)],
					State["Not Clicked"]);
				this.tiles.push([i, j, tile]);
			}
		}
	}
	draw(canvas:HTMLCanvasElement){
		this.tiles.forEach(tile=>tile[2].draw(canvas));
	}
	clicked(mousePos:MousePos):void{
		
		this.tiles.forEach(tileChild=>{
			const tile:Tile = tileChild[2];
			if( (mousePos.x < tile.x + tile.width) && (mousePos.x > tile.x)
			&& (mousePos.y < tile.y + tile.height) && (mousePos.y > tile.y)){
				
				tile.isClicked = true;
				tile.State = this.getNumMines(tileChild);
			}
		});
	}
	getNumMines(currentTile:[number, number, Tile]):State{
		let neighborMines:number = 0;
		const topLeft = this.tiles.find(tile=>tile[0] == (currentTile[0] - 1) && tile[1] == currentTile[1]-1);
		if(topLeft != undefined){
			const tile = topLeft[2];
			if(tile.hasMine){neighborMines += 1}
		}
		const top = this.tiles.find(tile=>tile[0] == (currentTile[0] - 1) && tile[1] == currentTile[1]);
		if(top != undefined){
			const tile = top[2];
			if(tile.hasMine){neighborMines += 1}
		}
		const topRight = this.tiles.find(tile=>tile[0] == (currentTile[0] - 1) && tile[1] == currentTile[1]+1);
		if(topRight != undefined){
			const tile = topRight[2];
			if(tile.hasMine){neighborMines += 1}
		}
		const left = this.tiles.find(tile=>tile[0] == currentTile[0] && tile[1] == currentTile[1]-1);
		if(left != undefined){
			const tile = left[2];
			if(tile.hasMine){neighborMines += 1}
		}
		const right = this.tiles.find(tile=>tile[0] == currentTile[0] && tile[1] == currentTile[1]+1);
		if(right != undefined){
			const tile = right[2];
			if(tile.hasMine){neighborMines += 1}
		}
		const downLeft = this.tiles.find(tile=>tile[0] == (currentTile[0] + 1) && tile[1] == currentTile[1]-1);
		if(downLeft != undefined){
			const tile = downLeft[2];
			if(tile.hasMine){neighborMines += 1}
		}
		const down = this.tiles.find(tile=>tile[0] == (currentTile[0] + 1) && tile[1] == currentTile[1]);
		if(down != undefined){
			const tile = down[2];
			if(tile.hasMine){neighborMines += 1}
		}
		const downRight = this.tiles.find(tile=>tile[0] == (currentTile[0] + 1) && tile[1] == currentTile[1] + 1);
		if(downRight != undefined){
			const tile = downRight[2];
			if(tile.hasMine){neighborMines += 1}
		}
		switch(neighborMines){
			case 1:return State.One;
			case 2:return State.Two;
			case 3:return State.Three;
			case 4:return State.Four;
			case 5:return State.Five;
			case 6:return State.Six;
			case 7:return State.Seven;
			case 8:return State.Eight;
			default: return State.Zero;
		}
	}
}
class MousePos{
	x:number = 0;
	y:number = 0;
}
const numRows = 8;
const numCols = 8;
window.addEventListener('load', ()=>{
	const canvas = document.querySelector('canvas') as HTMLCanvasElement;
	const tileSet:TileSet = new TileSet(numRows, numCols, canvas);
	const mousePos:MousePos = new MousePos();
	drawTiles(tileSet);
	document.querySelector('canvas')?.addEventListener('click', (e)=>{
		canvasClicked(e, tileSet);
	});
	
});


function drawTiles(tileSet:TileSet){
	const canvas  = document.querySelector('canvas') as HTMLCanvasElement;
	const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	tileSet.draw(canvas);	
}
function canvasClicked(e:MouseEvent, tileSet:TileSet){

    const rect = document.querySelector('canvas')?.getBoundingClientRect() as DOMRect;
    const mousePos = new MousePos();
	mousePos.x = e.clientX - rect.x;
    mousePos.y = e.clientY - rect.y;
    tileSet.clicked(mousePos);
	drawTiles(tileSet);
}
