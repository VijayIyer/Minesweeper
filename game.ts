
enum State {
	'Clicked', 
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
]
class Tile {
	x:number;
	y:number;
	height:number = 0;
	width:number = 0;
	State:State;
	constructor(x:number, y:number, width:number, height:number, state:State){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.State = state;
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
		if(imageMapping.findIndex(mapping=>mapping[0] == this.State) != -1){
			src = imageMapping[imageMapping.findIndex(mapping=>mapping[0] == this.State)][1];
		} 
		else{
			src = imageMapping[imageMapping.findIndex(mapping=>mapping[0] == State["Not Clicked"])][1];
		}
		console.log(this.State);
		
		img.src = src;
	}
}
class TileSet{
	tiles:Tile[] = [];
	constructor(numRows:number, numCols:number, canvas:HTMLCanvasElement){
		console.log(canvas);
		const tileHeight = canvas.height / numRows;
		const tileWidth = canvas.width / numCols;
		for(let i = 0; i < numRows;i++){
	    	for(let j = 0; j < numCols; j++){
				let tile = new Tile(i*tileWidth, j*tileHeight,
					 tileWidth,
					 tileHeight
					, State["Not Clicked"]);
				this.tiles.push(tile);
			}
		}
	}
	draw(canvas:HTMLCanvasElement){
		this.tiles.forEach(tile=>tile.draw(canvas));
	}
	clicked(mousePos:MousePos):void{
		
		this.tiles.forEach(tile=>{
			if( (mousePos.x < tile.x + tile.width) && (mousePos.x > tile.x)
			&& (mousePos.y < tile.y + tile.height) && (mousePos.y > tile.y)){
				tile.State = State.Clicked;
			}
		});
	}
}
class MousePos{
	x:number = 0;
	y:number = 0;
}

const tileSrc = "minesweeper_tiles/Minesweeper_LAZARUS_21x21_0.png";
const tileClickedSrc = "minesweeper_tiles/Minesweeper_LAZARUS_21x21_mine_hit.png";
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
