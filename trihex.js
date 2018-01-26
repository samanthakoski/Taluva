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
	/*
	HEX POSITIONS: 
		1=soloTop
		2=leftBottom
		3=rightBottom
		4=leftTop
		5=rightTop
		6=soloBottom
	*/
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
					tiles[i] = drawTileTwoUp(new Hex(new Point(50, 50), getColor(false), 4));
				} else {
					tiles[i] = drawTileTwoUp(new Hex(new Point(45, 55), getColor(false), 4));
				}
			} else {
				if (i == 0 || i % 2 == 0) {
					tiles[i] = drawTileTwoDown(new Hex(new Point(50, 50), getColor(false), 1));
				} else {
					tiles[i] = drawTileTwoDown(new Hex(new Point(45, 55), getColor(false), 1));
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
		var hasVolcano = false;
		if (firstHex.color == VOLCANOCOLOR) {
			hasVolcano = true;
		}
		context.beginPath();
		drawHex(firstHex.center);
		context.closePath();
		context.fillStyle = firstHex.color;
		context.fill();
		context.strokeStyle = "white";
		context.stroke();
		if (firstHex.color == VOLCANOCOLOR) {
			addArrow(firstHex);
		}
		
		var secondHex = new Hex(new Point(firstHex.center.x + horz, firstHex.center.y), getColor(hasVolcano), 5);
		if (secondHex.color == VOLCANOCOLOR) {
			hasVolcano = true;
		}
		context.beginPath();
		context.shadowOffsetX = 4;
		context.shadowOffsetY = 4;
		context.shadowColor = 'black';
		context.shadowBlur = 4;
		drawHex(secondHex.center);
		context.closePath();
		context.fillStyle = secondHex.color;
		context.fill();
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
		context.shadowBlur = 0;
		context.strokeStyle = "white";
		context.stroke();
		if (secondHex.color == VOLCANOCOLOR) {
			addArrow(secondHex);
		}
		
		var thirdHex;
		if (!hasVolcano) {
			thirdHex = new Hex(new Point(firstHex.center.x + (horz/2), firstHex.center.y + vert), VOLCANOCOLOR, 6);
		} else {
			thirdHex = new Hex(new Point(firstHex.center.x + (horz/2), firstHex.center.y + vert), getColor(hasVolcano), 6);
		}
		context.beginPath();
		context.shadowOffsetX = 4;
		context.shadowOffsetY = 4;
		context.shadowColor = 'black';
		context.shadowBlur = 4;
		drawHex(thirdHex.center);
		context.closePath();
		context.fillStyle = thirdHex.color;
		context.fill();	
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
		context.shadowBlur = 0;
		context.strokeStyle = "white";
		context.stroke();
		if (thirdHex.color == VOLCANOCOLOR) {
			addArrow(thirdHex);
		}
		return new Tile(firstHex, secondHex, thirdHex, 1);
	}
	
	function reDrawTwoUp(tile) {
		context.beginPath();
		context.shadowOffsetX = 4;
		context.shadowOffsetY = 4;
		context.shadowColor = 'black';
		context.shadowBlur = 4;
		drawHex(tile.firstHex.center);
		context.closePath();
		context.fillStyle = tile.firstHex.color;
		context.fill();
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
		context.shadowBlur = 0;
		context.strokeStyle = "white";
		context.stroke();
		if (tile.firstHex.color == VOLCANOCOLOR) {
			addArrow(tile.firstHex);
		}
		
		context.beginPath();
		context.shadowOffsetX = 4;
		context.shadowOffsetY = 4;
		context.shadowColor = 'black';
		context.shadowBlur = 4;
		drawHex(tile.secondHex.center);
		context.closePath();
		context.fillStyle = tile.secondHex.color;
		context.fill();
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
		context.shadowBlur = 0;
		context.strokeStyle = "white";
		context.stroke();
		if (tile.secondHex.color == VOLCANOCOLOR) {
			addArrow(tile.secondHex);
		}

		context.beginPath();
		context.shadowOffsetX = 4;
		context.shadowOffsetY = 4;
		context.shadowColor = 'black';
		context.shadowBlur = 4;
		drawHex(tile.thirdHex.center);
		context.closePath();
		context.fillStyle = tile.thirdHex.color;
		context.fill();	
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
		context.shadowBlur = 0;
		context.strokeStyle = "white";
		context.stroke();
		if (tile.thirdHex.color == VOLCANOCOLOR) {
			addArrow(tile.thirdHex);
		}
		return tile;
	}
	
	function drawTileTwoDown(firstHex) {
		var hasVolcano = false;
		if (firstHex.color == VOLCANOCOLOR) {
			hasVolcano = true;
		}
		context.beginPath();
		context.shadowOffsetX = 4;
		context.shadowOffsetY = 4;
		context.shadowColor = 'black';
		context.shadowBlur = 4;
		drawHex(firstHex.center);
		context.closePath();
		context.fillStyle = firstHex.color;
		context.fill();
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
		context.shadowBlur = 0;
		context.strokeStyle = "white";
		context.stroke();
		if (firstHex.color == VOLCANOCOLOR) {
			addArrow(firstHex);
		}

		var secondHex = new Hex(new Point(firstHex.center.x - (horz/2), firstHex.center.y + vert), getColor(hasVolcano), 2);
		if (secondHex.color == VOLCANOCOLOR) {
			hasVolcano = true;
		}
		context.beginPath();
		context.shadowOffsetX = 4;
		context.shadowOffsetY = 4;
		context.shadowColor = 'black';
		context.shadowBlur = 4;
		drawHex(secondHex.center);
		context.closePath();
		context.fillStyle = secondHex.color;
		context.fill();
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
		context.shadowBlur = 0;
		context.strokeStyle = "white";
		context.stroke();
		if (secondHex.color == VOLCANOCOLOR) {
			addArrow(secondHex);
		}

		var thirdHex; 
		if (!hasVolcano) {
			thirdHex = new Hex(new Point(firstHex.center.x + (horz/2), firstHex.center.y + vert), VOLCANOCOLOR, 3);
		} else {
			thirdHex = new Hex(new Point(firstHex.center.x + (horz/2), firstHex.center.y + vert), getColor(hasVolcano), 3);
		}
		context.beginPath();
		context.shadowOffsetX = 4;
		context.shadowOffsetY = 4;
		context.shadowColor = 'black';
		context.shadowBlur = 4;
		drawHex(thirdHex.center);
		context.closePath();
		context.fillStyle = thirdHex.color;
		context.fill();
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
		context.shadowBlur = 0;
		context.strokeStyle = "white";
		context.stroke();
		if (thirdHex.color == VOLCANOCOLOR) {
			addArrow(thirdHex);
		}
		return new Tile(firstHex, secondHex, thirdHex, 2);
	}
	
	function reDrawTwoDown(tile) {
		context.beginPath();
		context.shadowOffsetX = 4;
		context.shadowOffsetY = 4;
		context.shadowColor = 'black';
		context.shadowBlur = 4;
		drawHex(tile.firstHex.center);
		context.closePath();
		context.fillStyle = tile.firstHex.color;
		context.fill();
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
		context.shadowBlur = 0;
		context.strokeStyle = "white";
		context.stroke();
		if (tile.firstHex.color == VOLCANOCOLOR) {
			addArrow(tile.firstHex);
		}

		context.beginPath();
		context.shadowOffsetX = 4;
		context.shadowOffsetY = 4;
		context.shadowColor = 'black';
		context.shadowBlur = 4;
		drawHex(tile.secondHex.center);
		context.closePath();
		context.fillStyle = tile.secondHex.color;
		context.fill();
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
		context.shadowBlur = 0;
		context.strokeStyle = "white";
		context.stroke();
		if (tile.secondHex.color == VOLCANOCOLOR) {
			addArrow(tile.secondHex);
		}

		context.beginPath();
		context.shadowOffsetX = 4;
		context.shadowOffsetY = 4;
		context.shadowColor = 'black';
		context.shadowBlur = 4;
		drawHex(tile.thirdHex.center);
		context.closePath();
		context.fillStyle = tile.thirdHex.color;
		context.fill();
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
		context.shadowBlur = 0;
		context.strokeStyle = "white";
		context.stroke();
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
	
	function getColor(hasVolcano) {
		var num = Math.floor(Math.random() *3);
		if (num == 2 && !hasVolcano) {
			return VOLCANOCOLOR;
		}
		console.log(num);
		var color = colors[Math.floor(Math.random() * 6)];
		if (hasVolcano) {
			while (color == VOLCANOCOLOR) {
				color = colors[Math.floor(Math.random() * 6)];
			}
		}
		return color;
	}
	
	function addArrow(hex) {
		var headlen = 5;  
		var fromx = hex.center.x;
		var fromy = hex.center.y;
		var tox;
		var toy;
		if (hex.position == 1) {
			tox = hex.center.x + 12;
			toy = hex.center.y + 12;
		} else if (hex.position == 2) {
			tox = hex.center.x + 12;
			toy = hex.center.y - 12;
		} else if (hex.position == 3) {
			tox = hex.center.x - 12;
			toy = hex.center.y;
		} else if (hex.position == 4) {
			tox = hex.center.x + 12;
			toy = hex.center.y;
		} else if (hex.position == 5) {
			tox = hex.center.x - 12;
			toy = hex.center.y + 12;
		} else {
			tox = hex.center.x - 12;
			toy = hex.center.y - 12;
		}
		var angle = Math.atan2(toy-fromy,tox-fromx);
		context.beginPath();
		context.moveTo(fromx, fromy);
		context.lineTo(tox, toy);
		context.lineTo(tox-headlen*Math.cos(angle-Math.PI/6),toy-headlen*Math.sin(angle-Math.PI/6));
		context.moveTo(tox, toy);
		context.lineTo(tox-headlen*Math.cos(angle+Math.PI/6),toy-headlen*Math.sin(angle+Math.PI/6));
		context.strokeStyle = "black";
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
	
	function Hex(center, color, position) {
		this.center = center;
		this.color = color;
		this.position = position;
	}
	
	function Tile(firstHex, secondHex, thirdHex, type) {
		this.firstHex = firstHex;
		this.secondHex = secondHex;
		this.thirdHex = thirdHex;
		this.type = type;
	}
		
	

}

