window.addEventListener('load', eventWindowLoaded, false);	
function eventWindowLoaded() {

	canvasApp();
	
}


function canvasApp(){

	var theCanvas = document.getElementById('canvas');
  	if (!theCanvas || !theCanvas.getContext) {
    		return;
  	}
  	// type: 1 is two Up, type:2 is two down
  	var context = theCanvas.getContext('2d');
	var horz = Math.sqrt(3)/2 * 50;
	var vert = 50 * 3/4;
	var JUNGLECOLOR  = 'rgba(0, 100, 0, 255)'; 
	var GRASSCOLOR   = 'rgba(0, 225, 0, 255)'; 
	var DESERTCOLOR  = 'rgba(255, 201, 102, 255)';
	var QUARRYCOLOR  = 'rgba(123, 123, 139, 255)';
	var LAGOONCOLOR  = 'rgba(0, 191, 255, 255)';
	var VOLCANOCOLOR = 'rgba(255, 48, 48, 255)'; 
	var colors = [JUNGLECOLOR, GRASSCOLOR, DESERTCOLOR, QUARRYCOLOR, LAGOONCOLOR, VOLCANOCOLOR];
	var tileIndex = 0;
	var mouseX = 0;
	var mouseY = 0;
	var tileArray;
	theCanvas.addEventListener("mousemove", onMouseMove, false);
	theCanvas.addEventListener("click", onMouseClick, false);
	
	if (!context) {
   	 	return;
  	}
	
	
	
	drawScreen(); 

	function drawScreen() {
		
		
		var fillImg = new Image();  
		fillImg.src = 'fill_20x20.gif';  
		
		fillImg.onload = function(){  
			context.fillStyle = "purple";
			context.fillRect(0, 0, 500, 500);
			tileArray = generateTileArray(48);
			drawText(tileArray.length);
  
	
		}
	}
	
	function generateTileArray(num) {
		var tiles = [];
		var type;
		for (i = 0; i < num; i++) {
			type = Math.floor(Math.random() * 2) + 1;
			if (type == 1) {
				if (i == 0 || i % 2 == 0) {
					tiles[i] = drawTileTwoUp(new Hex(new Point(50, 50), getColor()));
				} else {
					tiles[i] = drawTileTwoUp(new Hex(new Point(45, 55), getColor()));
				}
			} else {
				if (i == 0 || i % 2 == 0) {
					tiles[i] = drawTileTwoDown(new Hex(new Point(50, 50), getColor()));
				} else {
					tiles[i] = drawTileTwoDown(new Hex(new Point(45, 55), getColor()));
				}
			}
		}
		return tiles;
	}
	
	function reDrawArray(num) {
		var tiles = [];
		for (i = 0; i < num; i++) {
			if (tileArray[i].type == 1) {
				if (i == 0 || i % 2 == 0) {
					tiles[i] = reDrawTwoUp(tileArray[i]);
				} else {
					tiles[i] = reDrawTwoUp(tileArray[i]);
				}
			} else {
				if (i == 0 || i % 2 == 0) {
					tiles[i] = reDrawTwoDown(tileArray[i]);
				} else {
					tiles[i] = reDrawTwoDown(tileArray[i]);
				}
			}
		}
		return tiles;
	}

	function drawTileTwoUp(firstHex) {
		context.beginPath();
		drawHex(firstHex.center);
		context.closePath();
		context.stroke();
		context.fillStyle = firstHex.color;
		context.fill();
		if (firstHex.color == VOLCANOCOLOR) {
			addArrow(firstHex);
		}
		
		var secondHex = new Hex(new Point(firstHex.center.x + horz, firstHex.center.y), getColor());
		context.beginPath();
		drawHex(secondHex.center);
		context.closePath();
		context.fillStyle = secondHex.color;
		context.fill();
		if (secondHex.color == VOLCANOCOLOR) {
			addArrow(secondHex);
		}

		var thirdHex = new Hex(new Point(firstHex.center.x + (horz/2), firstHex.center.y + vert), getColor());
		context.beginPath();
		drawHex(thirdHex.center);
		context.closePath();
		context.fillStyle = thirdHex.color;
		context.fill();	
		if (thirdHex.color == VOLCANOCOLOR) {
			addArrow(thirdHex);
		}
		return new Tile(firstHex, secondHex, thirdHex, 1);
	}
	
	function reDrawTwoUp(tile) {
		context.beginPath();
		drawHex(tile.firstHex.center);
		context.closePath();
		context.stroke();
		context.fillStyle = tile.firstHex.color;
		context.fill();
		if (tile.firstHex.color == VOLCANOCOLOR) {
			addArrow(tile.firstHex);
		}
		
		context.beginPath();
		drawHex(tile.secondHex.center);
		context.closePath();
		context.fillStyle = tile.secondHex.color;
		context.fill();
		if (tile.secondHex.color == VOLCANOCOLOR) {
			addArrow(tile.secondHex);
		}

		context.beginPath();
		drawHex(tile.thirdHex.center);
		context.closePath();
		context.fillStyle = tile.thirdHex.color;
		context.fill();	
		if (tile.thirdHex.color == VOLCANOCOLOR) {
			addArrow(tile.thirdHex);
		}
		return tile;
	}
	
	function drawTileTwoDown(firstHex) {
		context.beginPath();
		drawHex(firstHex.center);
		context.closePath();
		context.stroke();
		context.fillStyle = firstHex.color;
		context.fill();
		if (firstHex.color == VOLCANOCOLOR) {
			addArrow(firstHex);
		}

		var secondHex = new Hex(new Point(firstHex.center.x - (horz/2), firstHex.center.y + vert), getColor());
		context.beginPath();
		context.beginPath();
		drawHex(secondHex.center);
		context.closePath();
		context.fillStyle = secondHex.color;
		context.fill();
		if (secondHex.color == VOLCANOCOLOR) {
			addArrow(secondHex);
		}

		var thirdHex = new Hex(new Point(firstHex.center.x + (horz/2), firstHex.center.y + vert), getColor());
		context.beginPath();
		drawHex(thirdHex.center);
		context.closePath();
		context.fillStyle = thirdHex.color;
		context.fill();
		if (thirdHex.color == VOLCANOCOLOR) {
			addArrow(thirdHex);
		}
		return new Tile(firstHex, secondHex, thirdHex, 2);
	}
	
	function reDrawTwoDown(tile) {
		context.beginPath();
		drawHex(tile.firstHex.center);
		context.closePath();
		context.stroke();
		context.fillStyle = tile.firstHex.color;
		context.fill();
		if (tile.firstHex.color == VOLCANOCOLOR) {
			addArrow(tile.firstHex);
		}

		context.beginPath();
		context.beginPath();
		drawHex(tile.secondHex.center);
		context.closePath();
		context.fillStyle = tile.secondHex.color;
		context.fill();
		if (tile.secondHex.color == VOLCANOCOLOR) {
			addArrow(tile.secondHex);
		}

		context.beginPath();
		drawHex(tile.thirdHex.center);
		context.closePath();
		context.fillStyle = tile.thirdHex.color;
		context.fill();
		if (tile.thirdHex.color == VOLCANOCOLOR) {
			addArrow(tile.thirdHex);
		}
		return tile;
	}
	
	function drawHex(center) {
		for (var i = 0; i < 6; i += 1) {
			var p = hex_corner(center, 25, i);
			var o;
			if (i == 5) {
				o = hex_corner(center, 25, 0);
			} else {
				o = hex_corner(center, 25, i+1);
			}
			context.lineTo(o.x, o.y);
		}
	}
	
	function hex_corner(center, size, i) {
		var angle_deg = 60 * i + 30;
		var angle_rad = Math.PI / 180 * angle_deg;
		return new Point(center.x + size * Math.cos(angle_rad), center.y + size * Math.sin(angle_rad));
	}
	
	function getColor() {
		return colors[Math.floor(Math.random() * 6)];
	}
	
	function addArrow(hex) {
		var headlen = 10;  
		var fromx = hex.center.x;
		var fromy = hex.center.y;
		var tox = hex.center.x + 15;
		var toy = hex.center.y + 15; 
		var angle = Math.atan2(toy-fromy,tox-fromx);
		context.beginPath();
		context.moveTo(fromx, fromy);
		context.lineTo(tox, toy);
		context.lineTo(tox-headlen*Math.cos(angle-Math.PI/6),toy-headlen*Math.sin(angle-Math.PI/6));
		context.moveTo(tox, toy);
		context.lineTo(tox-headlen*Math.cos(angle+Math.PI/6),toy-headlen*Math.sin(angle+Math.PI/6));
		context.stroke();
		context.closePath();
	}
	
	function onMouseMove(e) {
	   mouseX = e.clientX-theCanvas.offsetLeft;
	   mouseY = e.clientY-theCanvas.offsetTop;
	}
	
	function onMouseClick(e) {
		var a = tileArray.pop();
		context.clearRect(0, 0, 500, 500);
		context.fillStyle = "purple";
		context.fillRect(0, 0, 500, 500);
		tileArray = reDrawArray(tileArray.length);
		if (tileArray.length == 0) {
			noMoreTilesText();
		} else {
			drawText(tileArray.length);
		}
	}
	
	function drawText(length) {
		context.font = "20px Arial";
		context.fillStyle = "black";
		context.fillText("remaining: " + length,10,20);
	}
	
	function noMoreTilesText() {
		context.font = "20px Arial";
		context.fillStyle = "black";
		context.fillText("NO MORE TILES", 10, 20);
	}
		
	function Point(x, y) {
		this.x = x;
		this.y = y;
	}
	
	function Hex(center, color) {
		this.center = center;
		this.color = color;
	}
	
	function Tile(firstHex, secondHex, thirdHex, type) {
		this.firstHex = firstHex;
		this.secondHex = secondHex;
		this.thirdHex = thirdHex;
		this.type = type;
	}
		
	

}

