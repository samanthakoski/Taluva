window.addEventListener('load', eventWindowLoaded, false);	
function eventWindowLoaded() {

	canvasApp();
	
}


function canvasApp(){

	var theCanvas = document.getElementById('canvas');
  	if (!theCanvas || !theCanvas.getContext) {
    		return;
  	}
  	var context = theCanvas.getContext('2d');
	var size = 30;
	var horz = (Math.sqrt(3)/2 * 60);
	var vert = 60 * 3/4;
	var JUNGLECOLOR  = 'rgba(0, 100, 0, 255)'; 
	var GRASSCOLOR   = 'rgba(0, 225, 0, 255)'; 
	var DESERTCOLOR  = 'rgba(255, 201, 102, 255)';
	var QUARRYCOLOR  = 'rgba(123, 123, 139, 255)';
	var LAGOONCOLOR  = 'rgba(0, 191, 255, 255)';
	var VOLCANOCOLOR = 'rgba(255, 48, 48, 255)'; 
	var colors = [JUNGLECOLOR, GRASSCOLOR, DESERTCOLOR, QUARRYCOLOR, LAGOONCOLOR, VOLCANOCOLOR];
	var stackTileArray;
	var boardTileArray = [];
	var hutsToPlace = 0;
	var player1 = new Player(1);
	var player2 = new Player(2);
	var boardBuildingArray = [];
	var templeArrayLen1 = 0;
	var towerArrayLen1 = 0;
	var templeArrayLen2 = 0;
	var towerArrayLen2 = 0;
	var expanding = false;
	var hutArrayLen1 = 0;
	var hutArrayLen2 = 0;
	var theGrid = [];
	var terrainHexs = [];
	var placing = false;
	var placingHuts = false;
	var terrainColor = -1;
	var chosenSettlement = 0;
	var chosenSettlementIndex = -1;
	var settlements = [];
	var jungleRight = 13;
	var jungleLeft = 15;
	var grassRight = 12;
	var grassLeft = 11;
	var desertRight = 9;
	var desertLeft = 10;
	var quarryRight = 8;
	var quarryLeft = 7;
	var lagoonRight = 6;
	var hutsToPlace = 0;
	var lagoonLeft = 5;
	var player = 1;
	var picking = false;
	var curTurn = new Turn(player1, false, false);
	var curTile;
	var curHut;
	var curTower;
	var curTemple;
	var curBuilding = 0; // 1 = hut, 2 = temple, 3 = tower
	var BB = theCanvas.getBoundingClientRect();
	var dragok = false;
	var startX;
	var startY;
	var origCens = [new Point(100, 90), new Point(100 - (horz/2), 90 + vert), new Point(100 + (horz/2), 90 + vert)];
	var gridTiles = [[,,,,,,,,,,], [,,,,,,,,,,], [,,,,,,,,,,], [,,,,,,,,,,], [,,,,,,,,,,], [,,,,,,,,,,], [,,,,,,,,,,], [,,,,,,,,,,], [,,,,,,,,,,], [,,,,,,,,,,]];
	theCanvas.addEventListener("mouseup", onMouseUp, false);
	theCanvas.addEventListener("mousedown", onMouseDown, false);
	theCanvas.addEventListener("mousemove", onMouseMove, false);
	theCanvas.addEventListener("click", onMouseClick, false);
	window.addEventListener("keydown", eventKeyPressed, false);
	
	if (!context) {
   	 	return;
  	}
	
	drawScreen(); 
	// player1 = purple, player2 = blue
	function drawScreen() {
		
		
		
			//context.fillStyle = "blue";
			//context.fillRect(0, 0, 1000, 1000);
			theGrid = generateGridArray();
			drawGrid();
			context.shadowOffsetX = 4;
			context.shadowOffsetY = 4;
			context.shadowColor = 'black';
			context.fillStyle = 'rgba(209, 173, 113, 1)';
			context.fillRect(0, 0, 200, 540);
			context.shadowOffsetX = 0;
			context.shadowOffsetY = 0;
			context.shadowBlur = 0;
			context.fillStyle = "purple"
			context.fillRect(40, 490, 130, 30);
			drawExpandText();
			stackTileArray = generateTileArray(24);
			templeArrayLen1 = 3;
			towerArrayLen1 = 2;
			hutArrayLen1 = 20;
			templeArrayLen2 = 3;
			towerArrayLen2 = 2;
			hutArrayLen2 = 20;
			curTemple =new Building(new Point(90, 330), "purple", "temple");
			curHut = new Building(new Point(90, 230), "purple", "hut");
			curTower = new Building(new Point(90, 430), "purple", "tower");
			curTile = stackTileArray[0];
			drawTile(curTile, true);
			drawBuildings();
			drawRemainingText(stackTileArray.length, templeArrayLen1, towerArrayLen1, hutArrayLen1);
			drawPlayerText(curTurn.player.num);
			drawPlaceTileText();
			drawSettlementText();
			drawBuildingText();
			
		
	}
	
	//works
	function drawGrid() {
		for (var i =0; i < 18; i++){
			for(var j = 0; j < 18; j++) {
				context.beginPath();
				if (theGrid[i][j].rotated){
					rotateHex(theGrid[i][j], theGrid[i][j].deg);;
				} else {
					drawHex(theGrid[i][j]);
				}
				context.closePath();
				context.fillStyle = theGrid[i][j].color;
				context.fill();
				context.shadowOffsetX = 0;
				context.shadowOffsetY = 0;
				context.shadowBlur = 0;
				context.strokeStyle = "black";
				context.lineWidth = 1;
				context.stroke();
				if (theGrid[i][j].color == VOLCANOCOLOR) {
					addArrowOnGrid(theGrid[i][j]);
				}
				if (theGrid[i][j].color != "white") {
					addLevelNum(theGrid[i][j]);
				}
				if (theGrid[i][j].buildings.length > 0) {
					drawBuildingsOnGrid(theGrid[i][j]);
				}
			}
		}	
	}
	
	function drawSelectedSettlement(settlement) {
		for (var i = 0; i < settlement.length; i++) {
			var position = settlement[i].position
			var corners = theGrid[position[0]][position[1]].corners;
			context.beginPath();
			context.strokeStyle = "yellow";
			context.lineWidth = 3;
			context.shadowOffsetX = 0;
			context.shadowOffsetY = 0;
			context.shadowBlur = 0;
			context.moveTo(corners[0].x, corners[0].y);
			for (var j = 1; j < corners.length; j++) {
				context.lineTo(corners[j].x, corners[j].y);
				context.moveTo(corners[j].x, corners[j].y);
			}
			context.lineTo(corners[0].x, corners[0].y);
			context.stroke();
			context.closePath();
		}
	}
	
	function drawSelectedTerrain(hexs) {
		for (var i = 0; i < hexs.length; i++) {
			var corners = hexs[i].corners;
			context.beginPath();
			context.strokeStyle = "yellow";
			context.lineWidth = 3;
			context.shadowOffsetX = 0;
			context.shadowOffsetY = 0;
			context.shadowBlur = 0;
			context.moveTo(corners[0].x, corners[0].y);
			for (var j = 1; j < corners.length; j++) {
				context.lineTo(corners[j].x, corners[j].y);
				context.moveTo(corners[j].x, corners[j].y);
			}
			context.lineTo(corners[0].x, corners[0].y);
			context.stroke();
			context.closePath();
		}
	}
	
	function generateGridArray() {
		var grid = [];
		var x = 60;
		var y = 30;
		for (var i = 0; i < 18; i++) {
			var row = [];
			if (i == 0 || i %2 == 0) {
				x = 60;
			} else {
				x = 60 -(horz/2);
			}
			for (var j = 0; j < 18; j++) {
				row.push(new Hex(new Point(x, y), "white"));
				x += horz;			
			}
			y += vert;
			grid.push(row);
		}
		return grid;
	}
	
	// ok for now
	function generateTileArray(num) {
		var tiles = [];
		for (i = 0; i < num; i++) {
			tiles[i] = makeTile(new Hex(new Point(100, 90), VOLCANOCOLOR));
			tiles[i].order = [1, 2, 3];
		}
		return tiles;
	}
	
	// ok for now
	function makeTile(firstHex) {
		var secondHex = new Hex(new Point(firstHex.center.x - (horz/2), firstHex.center.y + vert), getColor(2));
		var thirdHex = new Hex(new Point(firstHex.center.x + (horz/2), firstHex.center.y + vert), getColor(3));
		return new Tile(firstHex, secondHex, thirdHex);
	}
	
	// ok for now
	function getColor(num) {
		var color = VOLCANOCOLOR;
		while (color == VOLCANOCOLOR) {
			color = colors[Math.floor(Math.random() * 6)];
			if (num == 2) {
				if (color == JUNGLECOLOR) {
					if (jungleLeft > 0) {
						jungleLeft -= 1;
					} else {
						color = VOLCANOCOLOR;
					}
				} else if (color == GRASSCOLOR) {
					if (grassLeft > 0) {
						grassLeft -= 1;
					} else {
						color = VOLCANOCOLOR;
					}
				} else if (color == DESERTCOLOR) {
					if (desertLeft > 0) {
						desertLeft -= 1;
					} else {
						color = VOLCANOCOLOR;
					}
				} else if (color == QUARRYCOLOR) {
					if (quarryLeft > 0) {
						quarryLeft -= 1;
					} else {
						color = VOLCANOCOLOR;
					}
				} else if (color == LAGOONCOLOR) {
					if (lagoonLeft > 0) {
						lagoonLeft -= 1;
					} else {
						color = VOLCANOCOLOR;
					}
				}
			} else {
				if (color == JUNGLECOLOR) {
					if (jungleRight > 0) {
						jungleRight -= 1;
					} else {
						color = VOLCANOCOLOR;
					}
				} else if (color == GRASSCOLOR) {
					if (grassRight > 0) {
						grassRight -= 1;
					} else {
						color = VOLCANOCOLOR;
					}
				} else if (color == DESERTCOLOR) {
					if (desertRight > 0) {
						desertRight -= 1;
					} else {
						color = VOLCANOCOLOR;
					}
				} else if (color == QUARRYCOLOR) {
					if (quarryRight > 0) {
						quarryRight -= 1;
					} else {
						color = VOLCANOCOLOR;
					}
				} else if (color == LAGOONCOLOR) {
					if (lagoonRight > 0) {
						lagoonRight -= 1;
					} else {
						color = VOLCANOCOLOR;
					}
				}
			}
		}
		return color;
	}
	
	// ok for now
	function drawTile(tile, isOk) {
		var cen1 = tile.firstHex.center;
		var cen2 = tile.secondHex.center;
		var cen3 = tile.thirdHex.center;
		var order = getOrder(tile);
		for (var i = 0; i < 3; i++) {
			var hex;
			var hexNum = order[i];
			if (hexNum == 1) {
				hex = tile.firstHex;
			} else if (hexNum == 2) {
				hex = tile.secondHex;
			} else {
				hex = tile.thirdHex;
			}
			context.beginPath();
			context.shadowOffsetX = 8;
			context.shadowOffsetY = 8;
			context.shadowColor = 'black';
			context.shadowBlur = 8;
			drawHex(hex);
			context.closePath();
			context.fillStyle = hex.color;
			context.fill();
			context.shadowOffsetX = 0;
			context.shadowOffsetY = 0;
			context.shadowBlur = 0;
			if (isOk) {
				context.strokeStyle = "white";
			} else {
				context.strokeStyle = "red";
			}
			context.lineWidth = 4;
			context.stroke();
			
			if (hexNum == 1) {
				addArrow(tile.firstHex);
				
			}
			
		}	
		tile.corners.push(tile.firstHex.corners[2]);
		tile.corners.push(tile.firstHex.corners[3]);
		tile.corners.push(tile.firstHex.corners[4]);
		tile.corners.push(tile.firstHex.corners[5]);
		tile.center = tile.firstHex.corners[0];
		tile.corners.push(tile.thirdHex.corners[4]);
		tile.corners.push(tile.thirdHex.corners[5]);
		tile.corners.push(tile.thirdHex.corners[0]);
		tile.corners.push(tile.thirdHex.corners[1]);
		tile.corners.push(tile.secondHex.corners[0]);
		tile.corners.push(tile.secondHex.corners[1]);
		tile.corners.push(tile.secondHex.corners[2]);
		tile.corners.push(tile.secondHex.corners[3]);
	}
	
	// ok for now
	function getOrder(tile) {
		if (tile.deg == 0) {
			return [1, 2, 3];
		}
		if (tile.deg == 120) {
			return [2, 3, 1];
		}
		if (tile.deg == 180) {
			return [3, 2, 1];
		}
		if (tile.deg == 240) {
			return [3, 1, 2];
		} else {
			return [1, 2, 3];
		}
	}
	
	// ok for now
	function drawHex(hex) {
		hex.corners = [];
		for (var i = 0; i < 6; i += 1) {
			var p = hex_corner(hex.center, 30, i);
			var o;
			if (i == 5) {
				o = hex_corner(hex.center, 30, 0);
			} else {
				o = hex_corner(hex.center, 30, i+1);
			}
			hex.corners.push(o);
			context.lineTo(o.x, o.y);
		}
	}
	
	// ok for now
	function hex_corner(center, size, i) {
		var angle_deg = 60 * i + 30;
		var angle_rad = Math.PI / 180 * angle_deg;
		return new Point(center.x + size * Math.cos(angle_rad), center.y + size * Math.sin(angle_rad));
	}
	
	// ok for now
	function addArrow(hex) {
		var headlen = 7;  
		var fromx = hex.center.x;
		var fromy = hex.center.y;
		var tox = hex.center.x + 13;
		var toy = hex.center.y + 13;
		
		var angle = Math.atan2(toy-fromy,tox-fromx);
		context.beginPath();
		context.moveTo(fromx, fromy);
		context.lineTo(tox, toy);
		context.lineTo(tox-headlen*Math.cos(angle-Math.PI/6),toy-headlen*Math.sin(angle-Math.PI/6));
		context.moveTo(tox, toy);
		context.lineTo(tox-headlen*Math.cos(angle+Math.PI/6),toy-headlen*Math.sin(angle+Math.PI/6));
		context.lineWidth = 2;
		context.strokeStyle = "black";
		context.stroke();
		context.closePath();
	}
	
	function addLevelNum(hex) {
		context.font = "10px Arial";
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
		context.shadowBlur = 0;
		context.fillStyle = 'black';
		context.fillText(hex.level + "", hex.corners[5].x - 10, hex.corners[5].y);
	}
	
	function drawBuildingsOnGrid(hex) {
		for (var i = 0; i < hex.buildings.length; i++) {
			var building = hex.buildings[i];
			context.beginPath();
			context.shadowOffsetX = 0;
			context.shadowOffsetY = 0;
			context.shadowBlur = 0;
			drawBuilding(building);
			context.closePath();
			context.fillStyle = building.color;
			context.fill();
			context.strokeStyle = "white";
			context.lineWidth = 2;
			context.stroke();
			context.fill();
			addLetter(building);
		}
	}
	
	function addLetter(building) {
		var letter;
		var yDiff;
		if (building.type == "hut") {
			letter = "H";
			xDiff = 3;
		} else if (building.type == "temple") {
			letter = "Te";
			xDiff = 4;
		} else {
			letter = "To";
			xDiff = 4;
		}
		context.font = "10px Arial";
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
		context.shadowBlur = 0;
		context.fillStyle = 'white';
		context.fillText(letter, building.center.x - xDiff, building.center.y + 3);
	}
	
	function addArrowOnGrid(hex) {
		var headlen = 7;
		var fromx = hex.center.x;
		var fromy = hex.center.y;
		var tox;
		var toy;
		if (hex.deg == 120) {
			tox = fromx - 20;
			toy = fromy;
		} else if (hex.deg == 240) {
			tox = fromx + 11;
			toy = fromy - 13;
		} else if (hex.deg == 180) {
			tox = fromx - 11;
			toy = fromy - 13;
		} else if (hex.deg == 300) {
			tox = fromx + 20;
			toy = fromy;
		} else {
			tox = fromx + 11;
			toy = fromy + 13;
		}
		
		var angle = Math.atan2(toy-fromy,tox-fromx);
		context.beginPath();
		context.moveTo(fromx, fromy);
		context.lineTo(tox, toy);
		context.lineTo(tox-headlen*Math.cos(angle-Math.PI/6),toy-headlen*Math.sin(angle-Math.PI/6));
		context.moveTo(tox, toy);
		context.lineTo(tox-headlen*Math.cos(angle+Math.PI/6),toy-headlen*Math.sin(angle+Math.PI/6));
		context.lineWidth = 2;
		context.strokeStyle = "black";
		context.stroke();
		context.closePath();	
	}
	
	function drawBuilding(building) {
		building.corners = [];
		for (var i = 0; i < 6; i += 1) {
			var p = hex_corner(building.center, 10, i);
			var o;
			if (i == 5) {
				o = hex_corner(building.center, 10, 0);
			} else {
				o = hex_corner(building.center, 10, i+1);
			}
			building.corners.push(o);
			context.lineTo(o.x, o.y);
		}
	}
	
	// ok for now
	function onMouseDown(e) {
		e.preventDefault();
		e.stopPropagation();
		var mx = e.clientX - 50;
		var my = e.clientY - 50;
		dragok = false;
	
		if (placingHuts) {
			if (clickInBuilding(mx, my, curTower) || clickInBuilding(mx, my, curTemple)) {
				terrainHexs = getTerrainHexs(chosenSettlement, terrainColor);
				context.clearRect(0, 0, 1000, 1000);
				context.shadowOffsetX = 0;
				context.shadowOffsetY = 0;
				context.shadowBlur = 0;
				drawGrid();
				drawSelectedTerrain(terrainHexs);
				drawMustPlaceHutsText();
			} 
			
		}
	
		if (curTile.contains(mx, my)) {
			if (curTurn.placedTile) {
				context.clearRect(0, 0, 1000, 1000);
				context.shadowOffsetX = 0;
				context.shadowOffsetY = 0;
				context.shadowBlur = 0;
				drawGrid();
				drawAlreadyPlacedTileText();
			} else {
				dragok = true;
				curTile.isDragging = true;
			}
		}
		if (clickInBuilding(mx, my, curHut)) {
			if (!curTurn.placedTile) {
				context.clearRect(0, 0, 1000, 1000);
				context.shadowOffsetX = 0;
				context.shadowOffsetY = 0;
				context.shadowBlur = 0;
				drawGrid();
				drawPlaceTileFirstText();
			} else {
				dragok = true;
				curBuilding = 1;
				curHut.isDragging = true;
			}
		}
		if (clickInBuilding(mx, my, curTemple)) {
			if (!curTurn.placedTile) {
				context.clearRect(0, 0, 1000, 1000);
				context.shadowOffsetX = 0;
				context.shadowOffsetY = 0;
				context.shadowBlur = 0;
				drawGrid();
				drawPlaceTileFirstText();
			} else {
				dragok = true;
				curBuilding = 2;
				curTemple.isDragging = true;
			}
		}
		if (clickInBuilding(mx, my, curTower)) {
			if (!curTurn.placedTile) {
				context.clearRect(0, 0, 1000, 1000);
				context.shadowOffsetX = 0;
				context.shadowOffsetY = 0;
				context.shadowBlur = 0;
				drawGrid();
				drawPlaceTileFirstText();
			} else {
				dragok = true;
				curBuilding = 3;
				curTower.isDragging = true;
			}
		}

		startX = mx;
		startY = my;
	}
	
	// ok for now
	function onMouseMove(e) {
		if (dragok) {
			e.preventDefault();
			e.stopPropagation();
		
	   		mx = e.clientX-50;
	   		my= e.clientY-50;
			var dx = mx - startX;
			var dy = my - startY;
			var index = 0;
			if (curTile.isDragging) {
				adjustTile(curTile, dx, dy);
				curTile.center.x += dx;
				curTile.center.y += dy;
				if (curTile.rotated) {
					movingARotatedTile(curTile);
				} else {
					movingATile(curTile);
				}
			}	
			if (curBuilding > 0) {
				if (curBuilding == 1 && curHut.isDragging) {
					curHut.center.x += dx;
					curHut.center.y += dy;
					movingABuilding(curHut);
				} else if (curBuilding == 2 && curTemple.isDragging) {
					curTemple.center.x += dx;
					curTemple.center.y += dy;
					movingABuilding(curTemple);
				} else if (curTower.isDragging) {
					curTower.center.x += dx;
					curTower.center.y += dy;
					movingABuilding(curTower);
				}
			}
						
			startX = mx;
			startY = my;
		}
	}
	
	// ok for now
	function onMouseClick(e) {
		e.preventDefault();
		e.stopPropagation();
		var mx = e.clientX - 50;
		var my = e.clientY - 50;
		
		if (picking) {
			terrainColor = pickingATerrain(mx, my, chosenSettlement);
			if (terrainColor == -1) {
				context.clearRect(0, 0, 1000, 1000);
				context.shadowOffsetX = 0;
				context.shadowOffsetY = 0;
				context.shadowBlur = 0;
				drawGrid();
				drawMustClickOnAdjTerrainText();
			}
			else {
				picking = false;
				placing = true;
			}
		}
		
		if (placing) {
			console.log("PLACING");
			terrainHexs = getTerrainHexs(chosenSettlement, terrainColor);
			console.log("ORIG TERRAIN HEXS");
			console.log(terrainHexs);
			hutsToPlace = getHutNum(terrainHexs);
			console.log(hutsToPlace);
			context.clearRect(0, 0, 1000, 1000);
			context.shadowOffsetX = 0;
			context.shadowOffsetY = 0;
			context.shadowBlur = 0;
			drawGrid();
			drawSelectedTerrain(terrainHexs);
			context.shadowOffsetX = 4;
			context.shadowOffsetY = 4;
			context.shadowColor = 'black';
			context.fillStyle = 'rgba(209, 173, 113, 1)';
			context.fillRect(0, 0, 200, 540);
			context.shadowOffsetX = 0;
			context.shadowOffsetY = 0;
			context.shadowBlur = 0;
			if (curTurn.player.num == 1) {
				context.fillStyle = "purple";
			} else {
				context.fillStyle = "blue";
			}
			context.fillRect(40, 490, 130, 30);
			drawExpandText();
			drawTile(curTile, true);
			drawBuildings();
			if (curTurn.player.num == 1) {
				drawRemainingText(stackTileArray.length, templeArrayLen1, towerArrayLen1, hutArrayLen1);
			} else {
				drawRemainingText(stackTileArray.length, templeArrayLen2, towerArrayLen2, hutArrayLen2);
			}
			drawPlayerText(curTurn.player.num);
			drawSettlementText();
			drawBuildingText();
			drawPlaceBuildingsText();
			placing = false;
			placingHuts = true;
		}
		
		if (expanding) {
			var clicked = clickOnASettlement(mx, my, curTurn.player.settlements);
			if (clicked >= 0) {
				// highlight that settlement
				chosenSettlement = curTurn.player.settlements[clicked];
				chosenSettlementIndex = clicked;
				context.clearRect(0, 0, 1000, 1000);
				context.shadowOffsetX = 0;
				context.shadowOffsetY = 0;
				context.shadowBlur = 0;
				drawGrid();
				drawSelectedSettlement(chosenSettlement);
				context.shadowOffsetX = 4;
				context.shadowOffsetY = 4;
				context.shadowColor = 'black';
				context.fillStyle = 'rgba(209, 173, 113, 1)';
				context.fillRect(0, 0, 200, 540);
				context.shadowOffsetX = 0;
				context.shadowOffsetY = 0;
				context.shadowBlur = 0;
				if (curTurn.player.num == 1) {
					context.fillStyle = "purple";
				} else {
					context.fillStyle = "blue";
				}
				context.fillRect(40, 490, 130, 30);
				drawExpandText();
				drawTile(curTile, true);
				drawBuildings();
				if (curTurn.player.num == 1) {
					drawRemainingText(stackTileArray.length, templeArrayLen1, towerArrayLen1, hutArrayLen1);
				} else {
					drawRemainingText(stackTileArray.length, templeArrayLen2, towerArrayLen2, hutArrayLen2);
				}
				drawPlayerText(curTurn.player.num);
				drawSettlementText();
				drawBuildingText();
				drawChooseTerrainText();
				picking = true;
				exanding = false;
				
				// prompt user to click on a terain type
				// highlight new owned hex's 
				// player must put one hut for each level on each newly owned hex
			}
		}
		
		if (clickOnExpand(mx, my)) {
			context.clearRect(0, 0, 1000, 1000);
			context.shadowOffsetX = 0;
			context.shadowOffsetY = 0;
			context.shadowBlur = 0;
			drawGrid();
			context.shadowOffsetX = 4;
			context.shadowOffsetY = 4;
			context.shadowColor = 'black';
			context.fillStyle = 'rgba(209, 173, 113, 1)';
			context.fillRect(0, 0, 200, 540);
			context.shadowOffsetX = 0;
			context.shadowOffsetY = 0;
			context.shadowBlur = 0;
			context.fillStyle = "purple"
			context.fillRect(40, 490, 130, 30);
			drawExpandText();
			drawTile(curTile, true);
			drawBuildings();
			if (curTurn.player.num == 1) {
				drawRemainingText(stackTileArray.length, templeArrayLen1, towerArrayLen1, hutArrayLen1);
			} else {
				drawRemainingText(stackTileArray.length, templeArrayLen2, towerArrayLen2, hutArrayLen2);
			}
			drawPlayerText(curTurn.player.num);
			drawSettlementText();
			drawBuildingText();
			drawClickOnSettlementText();
			expanding = true;
			console.log(expanding);
				
			
			
		}
	}
	
	// working on
	function onMouseUp(e) {
		e.preventDefault();
		e.stopPropagation();
		var drawAll = false;
		dragok = false;
		if (curTile.isDragging) {
			curTile.isDragging = false;
			var positions = findTilePosition();
			var ok = putInGrid(positions);
		
			// 0 means overlapping, -1 means wrong lvls, -2 means not ajacent
			if (ok[0] == false) {
				context.clearRect(0, 0, 1000, 1000);
				context.shadowOffsetX = 0;
				context.shadowOffsetY = 0;
				context.shadowBlur = 0;
				drawGrid();
				context.fillStyle = 'rgba(209, 173, 113, 1)';
				context.shadowOffsetX = 4;
				context.shadowOffsetY = 4;
				if (ok[1] == 0) {
					drawOverlappingText();
				} else if (ok[1] == -2) {
					drawAdjacentText();
				} else if (ok[1] == -1) {
					drawWrongLevelsText();
				} else if (ok[1] == -3) {
					drawNotVolColorText();
				} else if (ok[1] == -4) {
					drawSameDirectionText();
				} else if (ok[1] == -5) {
					drawDontCoverTempleText();
				} else {
					drawCantCoverFullSettle();
				}
			} else {
				context.clearRect(0, 0, 1000, 1000);
				context.shadowOffsetX = 0;
				context.shadowOffsetY = 0;
				context.shadowBlur = 0;
				drawGrid();
				context.fillStyle = 'rgba(209, 173, 113, 1)';
				context.shadowOffsetX = 8;
				context.shadowOffsetY = 8;
				context.shadowColor = 'black';
				context.shadowBlur = 8;
				context.fillRect(0, 0, 200, 540);
				context.shadowOffsetX = 0;
				context.shadowOffsetY = 0;
				context.shadowBlur = 0;
				context.fillStyle = "purple"
				context.fillRect(40, 490, 130, 30);
				drawExpandText();
				if (placing || placingHuts) {
					drawSelectedTerrain(terrainHexs);
				}
				boardTileArray.push(curTile);
				
				curTurn.placedTile = true;
				
				
				stackTileArray.shift();
				if (stackTileArray.length == 0) {
					//noMoreTilesText();
					if (curTurn.player.num == 1) {
						drawRemainingText(stackTileArray.length, templeArrayLen1, towerArrayLen1, hutArrayLen1);
					} else {
						drawRemainingText(stackTileArray.length, templeArrayLen2, towerArrayLen2, hutArrayLen2);
					}
					drawPlayerText(curTurn.player.num);
					drawBuildingText();
					drawSettlementText();
					drawBuildings();
					drawPlaceBuildingText();
				} else {
					curTile = stackTileArray[0];
					drawTile(curTile, true);
					if (curTurn.player.num == 1) {
						drawRemainingText(stackTileArray.length, templeArrayLen1, towerArrayLen1, hutArrayLen1);
					} else {
						drawRemainingText(stackTileArray.length, templeArrayLen2, towerArrayLen2, hutArrayLen2);
					}
					drawPlayerText(curTurn.player.num);
					drawBuildingText();
					drawSettlementText();
					drawBuildings();
					drawPlaceBuildingText();
				}
			}
		} else if (curBuilding > 0) {
			var ok;
			var isDrag = false;
			var typeDrag;
			if (curBuilding == 1 && curHut.isDragging) {
				curHut.isDragging = false;
				var position = findBuildingPosition(curHut);
				ok = putBuildingOnTile(position, "hut");
				isDrag = true;
				typeDrag = "h";
			} else if (curBuilding == 2 && curTemple.isDragging) {
				curTemple.isDragging = false;
				var position = findBuildingPosition(curTemple);
				ok = putBuildingOnTile(position, "temple");
				isDrag = true;
				typeDrag = "te";
			} else if (curTower.isDragging) {
				curTower.isDragging = false;
				var position = findBuildingPosition(curTower);
				ok = putBuildingOnTile(position, "tower");
				isDrag = true;
				typeDrag = "to";
			}
			if (isDrag) {
				if (ok[0]) {
					var add = 0;
					if (typeDrag == "to") {
						if (curTurn.player.settlements.length == 0) {
							context.clearRect(0, 0, 1000, 1000);
							context.shadowOffsetX = 0;
							context.shadowOffsetY = 0;
							context.shadowBlur = 0;
							drawGrid();
							drawTowerMustBeAddedToSettlementText();
						} else {
							add = isAddingToSettlement(position);
							if (add[0] == true) {
								var hasTower;
								if (curTurn.player.num == 1) {
									hasTower = hasTower(player1.settlements, add[1]);
								} else {
									hasTower = hasTower(player2.settlements, add[1]);
								}
								if (!hasTower) {
									curTower.position.push(position[0][0]);
									curTower.position.push(position[1][0]);
									if (curTurn.player.num == 1) {
										if (add[1].length > 1) {
											player1.settlements = putInMultSettlements(player1.settlements, "tower", add[1]);
										} else {
											player1.settlements[add[1]].push(curTower);
										}
										player1.towerCount += 1;
									} else {
										if (add[1].length > 1) {
											player2.settlements = putInMultSettlements(player2.settlements, "tower", add[1]);
										} else {
											player2.settlements[add[1]].push(curTower);
										}
										player2.towerCount += 1;
									}
									boardBuildingArray.push(curTower);
									theGrid[curTower.position[0]][curTower.position[1]].buildings.push(curTower);
									if (curTurn.player.num == 1) {
										towerArrayLen1 -= 1;
										if (towerArrayLen1 > 0) {
											curTower = new Building(new Point(90, 430), "purple", "tower");
										}
									} else {
										towerArrayLen2 -= 1;
										if (towerArrayLen2 > 0) {
											curTower = new Building(new Point(90, 430), "blue", "tower");
										}
									}
									drawAll = true;
								} else {
									context.clearRect(0, 0, 1000, 1000);
									context.shadowOffsetX = 0;
									context.shadowOffsetY = 0;
									context.shadowBlur = 0;
									drawGrid();
									drawSettlementHasTowerText();
								}
							} else {
								context.clearRect(0, 0, 1000, 1000);
								context.shadowOffsetX = 0;
								context.shadowOffsetY = 0;
								context.shadowBlur = 0;
								drawGrid();
								drawTowerMustBeAddedToSettlementText();
							}
						}
					} else if (typeDrag == "te") {
						curTemple.position = position;
						add = isAddingToSettlement(position);
						var hasTemple;
						var settleLength = 0;
						if (curTurn.player.num == 1) {
							if (player1.settlements.length == 0) {
								context.clearRect(0, 0, 1000, 1000);
								context.shadowOffsetX = 0;
								context.shadowOffsetY = 0;
								context.shadowBlur = 0;
								drawGrid()
								drawTempleMustBeAddedToSettlementText();
							} else {
								hasTemple = hasTemple(player1.settlements, add[1]);
								settleLength = player1.settlements[add[1][0]].length;
							}
						} else {
							if (player2.settlements.length == 0) {
								context.clearRect(0, 0, 1000, 1000);
								context.shadowOffsetX = 0;
								context.shadowOffsetY = 0;
								context.shadowBlur = 0;
								drawGrid()
								drawTempleMustBeAddedToSettlementText();
							} else {
								hasTemple = hasTemple(player2.settlements, add[1]);
								settleLength = player2.settlements[add[1][0]].length;
							}
						}
						if (add[0] == true) {
							if (!hasTemple && settleLength >= 3) {
								curTemple.position.push(position[0][0]);
								curTemple.position.push(position[1][0]);
								if (curTurn.player.num == 1) {
									if (add[1].length > 1) {
										player1.settlements = putInMultSettlements(player1.settlements, "temple", add[1])
									} else {
										player1.settlements[add[1][0]].push(curTemple);
									}
									player1.templeCount += 1;
								} else {
									if (add[1].length > 1) {
										player2.settlements = putInMultSettlements(player2.settlements, "temple", add[1])
									} else {
										player2.settlements[add[1][0]].push(curTemple);
									}
									player2.temleCount += 1;
								}
								boardBuildingArray.push(curTemple);
								theGrid[curTemple.position[0]][curTemple.position[1]].buildings.push(curTemple);
								if (curTurn.player.num == 1) {
									templeArrayLen1 -= 1;
									if (templeArrayLen1 > 0) {
										curTemple = new Building(new Point(90, 330), "purple", "temple");
									}
								} else {
									templeArrayLen2 -= 1;
									if (templeArrayLen2 > 0) {
										curTemple = new Building(new Point(90, 330), "blue", "temple");
									}
								}
								drawAll = true;
							} else if (hasTemple) {
								context.clearRect(0, 0, 1000, 1000);
								context.shadowOffsetX = 0;
								context.shadowOffsetY = 0;
								context.shadowBlur = 0;
								drawGrid();
								drawSettlementHasTempleText();
							} else {
								context.clearRect(0, 0, 1000, 1000);
								context.shadowOffsetX = 0;
								context.shadowOffsetY = 0;
								context.shadowBlur = 0;
								drawGrid();
								drawSettlementMustBeLengthThreeText();
							}
						} else {
							context.clearRect(0, 0, 1000, 1000);
							context.shadowOffsetX = 0;
							context.shadowOffsetY = 0;
							context.shadowBlur = 0;
							drawGrid()
							drawTempleMustBeAddedToSettlementText();
						}
					} else {
						curHut.position.push(position[0][0]);
						curHut.position.push(position[1][0]);
						boardBuildingArray.push(curHut);
						if (curTurn.player.num == 1) {
							if (placingHuts) {
								player1.settlements[chosenSettlementIndex].push(curHut);
								hutsToPlace -= 1;
								console.log("grid builidng length: " + theGrid[position[0][0]][position[1][0]].buildings.length);
								console.log("grid level: " + theGrid[position[0][0]][position[1][0]].level);
								if(theGrid[position[0][0]][position[1][0]].buildings.length >= theGrid[position[0][0]][position[1][0]].level) {
									var index = -1;
									console.log("terr hexs before");
									console.log(terrainHexs);
									for (var i = 0; i < terrainHexs.length; i++) {
										if (terrainHexs[position[0]] == position[0][0] && terrainHexs[position[1]] == position[1][0]) {
											console.log("INDEX" +  i);
											index = i;
											break;
										}
									}
									terrainHexs.splice(index, 1);
									console.log("terr hexs after");
									console.log(terrainHexs);
								}
								if (hutsToPlace == 0) {
									placing = false;
									placingHuts = false;
								}
							} else {
								if (player1.settlements.length == 0) {
									var settlement = [];
									settlement.push(curHut);
									player1.settlements.push(settlement);
									player1.hutCount += 1;
								} else {
									add = isAddingToSettlement(position, player1.settlements);
									if (add[0]) {
										if (add[1].length > 1) {
											player1.settlements = putInMultSettlements(player1.settlements, "hut", add[1]);
										} else {
											player1.settlements[add[1][0]].push(curHut);
										}
										player1.hutCount += 1;
									} else {
										var settlement = [];
										settlement.push(curHut);
										player1.settlements.push(settlement);
										player1.hutCount += 1;
									}
								}
							}
						}
						if (curTurn.player.num == 2) {
							if (placingHuts) {
								player2.settlements[chosenSettlementIndex].push(curHut);
								hutsToPlace -= 1;
								console.log("grid builidng length: " + theGrid[position[0][0]][position[1][0]].buildings.length);
								console.log("grid level: " + theGrid[position[0][0]][position[1][0]].level);
								if(theGrid[position[0][0]][position[1][0]].buildings.length == theGrid[position[0][0]][position[1][0]].level) {
									var index = -1;
									for (var i = 0; i < terrainHexs.length; i++) {
										if (terrainHexs.position[0] == position[0][0] && terrainHexs.posiiton[1] == position[1][0]) {
											console.log("INDEX" +  i);
											index = i;
										}
									}
									terrainHexs.splice(index, 1);
								}
								if (hutsToPlace == 0) {
									placing = false;
									placingHuts = false;
								}
							} else {
								if (player2.settlements.length == 0) {
									var settlement = [];
									settlement.push(curHut);
									player2.settlements.push(settlement);
									player2.hutCount += 1;
								} else {
									add = isAddingToSettlement(position, player2.settlements);
									if (add[0]) {
										if (add[1].length > 1) {
											player2.settlements = putInMultSettlements(player2.settlements, "hut", add[1]);
										} else {
											player2.settlements[add[1][0]].push(curHut);
										}
										player2.hutCount += 1;
									} else {
										var settlement = [];
										settlement.push(curHut);
										player2.settlements.push(settlement);
										player2.hutCount += 1;
									}
								}
							}
						}
						
						if (curTurn.player.num == 1) {
							hutArrayLen1 -= 1;
							if (hutArrayLen1 > 0) {
								curHut = new Building(new Point(90, 230), "purple", "hut");
							}
						} else {
							hutArrayLen2 -= 1;
							if (hutArrayLen2 > 0) {
								curHut = new Building(new Point(90, 230), "blue", "hut");
							}
						}
						drawAll = true;
					}
					if (drawAll) {
						curTurn.placedBuilding = true;
						if (curTurn.placedBuilding && curTurn.placedTile && !placingHuts) {
							if (curTurn.player.num == 1) {
								curTurn = new Turn(player2, false, false);
								curTower.color = "blue";
								curHut.color = "blue";
								curTemple.color = "blue";
							} else {
								curTurn = new Turn(player1, false, false);
								curTower.color = "purple";
								curHut.color = "purple";
								curTemple.color = "purple";
							}
						}
						context.clearRect(0, 0, 1000, 1000);
						context.shadowOffsetX = 0;
						context.shadowOffsetY = 0;
						context.shadowBlur = 0;
						drawGrid();
						if (placingHuts || placing) {
							console.log("placing");
							console.log(terrainHexs);
							drawSelectedTerrain(terrainHexs);
						}
						if (stackTileArray.length == 0) {
							drawGameOverText();
							drawAll = false;
						} 
						if (curTurn.player.num == 1) {
							var zeros = 0;
							if (hutArrayLen1 == 0) {
								zeros += 1;
							} 
							if (towerArrayLen1 == 0) {
								zeros += 1;
							}
							if (templeArrayLen1 == 0) {
								zeros += 1;
							}
							if (zeros >= 2) {
								drawGameOverTextPlayer1();
							}
						} 
						if (curTurn.player.num == 2) {
							var zeros = 0;
							if (hutArrayLen2 == 0) {
								zeros += 1;
							} 
							if (towerArrayLen2 == 0) {
								zeros += 1;
							}
							if (templeArrayLen2 == 0) {
								zeros += 1;
							}
							if (zeros >= 2) {
								drawGameOverTextPlayer2();
							}
						} 
					}
					if (drawAll) {
							console.log("j,,");
							context.fillStyle = 'rgba(209, 173, 113, 1)';
							context.shadowOffsetX = 8;
							context.shadowOffsetY = 8;
							context.shadowColor = 'black';
							context.shadowBlur = 8;
							context.fillRect(0, 0, 200, 540);
							context.shadowOffsetX = 0;
							context.shadowOffsetY = 0;
							context.shadowBlur = 0;
							if (curTurn.player.num == 1) {
								context.fillStyle = "purple";
							} else {
								context.fillStyle = "blue";
							}
							context.fillRect(40, 490, 130, 30);
							drawExpandText();
							drawTile(curTile, true);
							if (curTurn.player.num == 1) {
								drawRemainingText(stackTileArray.length, templeArrayLen1, towerArrayLen1, hutArrayLen1);
							} else {
								drawRemainingText(stackTileArray.length, templeArrayLen2, towerArrayLen2, hutArrayLen2);
							}
							drawPlayerText(curTurn.player.num);
							drawBuildingText();
							drawSettlementText()
							drawBuildings();
							
							drawPlaceTileText();
						}
						
					
				} else {
					if (ok[1] == 0) {
						drawBuildingNotOnAFieldText();
					} else if (ok[1] == 1) {
						drawBuildingOnAVolcanoText();
					} else if (ok[1] == 4){
						drawHutMustBeOnOne();
					} else {
						drawTowerNeedsToBeOnLevelThree();
					}
				}
			}
		}
	}
	
	function hasTower(settlements, positions) {
		for (var j = 0; j < positions.length; j++) {
			var settlement = settlements[positons[j]];
			for (var i = 0; i < settlement.length; i++) {
				var s = settlement[i];
				if (s.type == "tower") {
					return true;
				}
			}
		}	
		return false;
	}

	function hasTemple(settlements, positions) {
		for (var j = 0; j < positions.length; j++) {
			var settlement = settlements[positons[j]];
			for (var i = 0; i < settlement.length; i++) {
				var s = settlement[i];
				if (s.type == "temple") {
					return true;
				}
			}
		}	
		return false;
	}
	
	function putInMultSettlements(settlements, building, positions) {
		var newSett = [];
		for (var i = 0; i < positions.length; i++) {
			var sett = settlements.splice(positions[i], 1);
			for (var j = 0; j < sett.length; j++) {
				newSett.push(sett[j]);
			}
		}
		if (building == "hut") {
			newSett.push(curHut);
		} else if (building == "temple") {
			newSett.push(curTemple);
		} else {
			newSett.push(curTower);
		}
		settlements.push(newSett);
		return settlements
	}
	
	function getDistance(point1, point2) {
		return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
	}
	
	function getHutNum(terrainHexs) {
		var huts = 0;
		for (var i = 0; i < terrainHexs.length; i++) {
			huts += terrainHexs[i].level;
		}
		return huts;
	}
	
	// works
	function findTilePosition() {
		var hex1cen;
		var hex2cen;
		var hex3cen;
		
		if (curTile.rotated) {
			hex1cen = getRotatedCenter(curTile.firstHex.center, curTile.firstHex.corners[0], curTile.deg);
			hex2cen = getRotatedCenter(curTile.secondHex.center, curTile.firstHex.corners[0], curTile.deg);
			hex3cen = getRotatedCenter(curTile.thirdHex.center, curTile.firstHex.corners[0], curTile.deg);
		} else {
			hex1cen = curTile.firstHex.center;
			hex2cen = curTile.secondHex.center;
			hex3cen = curTile.thirdHex.center;
		}
		
		var hex1dist = [];
		var hex2dist = [];
		var hex3dist = [];
	
		for (var i = 0; i < 18; i++) {
			var row1 = [];
			var row2 = [];
			var row3 = [];
			for (j = 0; j < 18; j++) {
				row1.push(getDistance(theGrid[i][j].center, hex1cen));
				row2.push(getDistance(theGrid[i][j].center, hex2cen));
				row3.push(getDistance(theGrid[i][j].center, hex3cen));
			}
			hex1dist.push(row1);
			hex2dist.push(row2);
			hex3dist.push(row3);
		}
		var minDistRow1 = [];
		var minDistRow2 = [];
		var minDistRow3 = [];
		for (var i = 0; i < 18; i++) {
			minDistRow1.push(Math.min.apply(null, hex1dist[i]));
			minDistRow2.push(Math.min.apply(null, hex2dist[i]));
			minDistRow3.push(Math.min.apply(null, hex3dist[i]));
		}
		var minDist1 = Math.min.apply(null, minDistRow1);
		var minDist2 = Math.min.apply(null, minDistRow2);
		var minDist3 = Math.min.apply(null, minDistRow3);
		
		var min1Pos = minDistRow1.indexOf(minDist1);
		var min2Pos = minDistRow2.indexOf(minDist2);
		var min3Pos = minDistRow3.indexOf(minDist3);
	
		var rowPost = hex1dist[min1Pos];
		var rowPost2 = hex2dist[min2Pos];
		var rowPost3 = hex3dist[min3Pos];
		
		var hex1Pos = [[min1Pos], [rowPost.indexOf(minDist1)]];
		var hex2Pos = [[min2Pos], [rowPost2.indexOf(minDist2)]];
		var hex3Pos = [[min3Pos], [rowPost3.indexOf(minDist3)]];
		
		return [hex1Pos, hex2Pos, hex3Pos];
	}
	
	function findBuildingPosition(building) {
		var dist = [];
		for (var i = 0; i < 18; i++) {
			var row = [];
			for (j = 0; j < 18; j++) {
				row.push(getDistance(theGrid[i][j].center, building.center));
			}
			dist.push(row);
		}
		var minDistRow = [];
		for (var i = 0; i < 18; i++) {
			minDistRow.push(Math.min.apply(null, dist[i]));
		}
		var minDist = Math.min.apply(null, minDistRow);
		
		var minPos = minDistRow.indexOf(minDist);	
	
		var rowPos = dist[minPos];
		
		var pos = [[minPos], [rowPos.indexOf(minDist)]];
		
		return pos;
	}
	
	// works
	function putInGrid(positions) {
		var hex1Pos = positions[0];
		var hex2Pos = positions[1];
		var hex3Pos = positions[2];
		var overlapAndLvl = isOverlapping(positions);
		if (overlapAndLvl[0]) {
			//drawOverlappingText();
			if (overlapAndLvl[1] == -1 ) {
				// -1 means not same lvls
				return [false, -1];
			} else if (overlapAndLvl[1] == -2) {
				// -3 means not right color for level
				return [false, -3];
			}
			// 0 means just overlapping
			return [false, 0]; 
		} else {
			curTile.firstHex.level = overlapAndLvl[1];
			curTile.secondHex.level = overlapAndLvl[1];
			curTile.thirdHex.level = overlapAndLvl[1];
		}
		if (boardTileArray.length != 0) {
			if (!isAdjacent(positions)) {
				return [false, -2];
			}
		}
		if (theGrid[hex1Pos[0]][hex1Pos[1]].color == VOLCANOCOLOR && theGrid[hex1Pos[0]][hex1Pos[1]].deg == curTile.firstHex.deg) {
			// means volcanos are same direction
			return [false, -4];
		}
		for (var i = 0; i < 3; i++) {
			var x;
			var y;
			if (i == 0) {
				x = hex1Pos[0];
				y = hex1Pos[1];
			} else if (i == 1) {
				x = hex2Pos[0];
				y = hex2Pos[1];
			} else {
				x = hex3Pos[0];
				y = hex3Pos[1];
			}
			var buildings = theGrid[x][y].buildings;
			for (var j = 0; j < buildings.length; j++) {
				if (buildings[j].type == "temple" || buildings[j].type == "tower") {
					// cant cover tower or temple
					return [false, -5];
				}
			}
		}
		
		if (player1.settlements.length > 0) {
			console.log(player1.settlements)
			for (var i = 0; i < player1.settlements.length; i++) {
				var s = player1.settlements[i];
				var sCovered = 0;	
				for (var j = 0; j < s.length; j++) {
					var x = s[j].position[0];
					var y = s[j].position[1];
					if (x == hex1Pos[0] && y == hex1Pos[1]) {
						sCovered += 1;
					} else if (x == hex2Pos[0] && y == hex2Pos[1]) {
						sCovered += 1;
					} else if (x == hex3Pos[0] && y == hex3Pos[1]) {
						sCovered += 1;
					}
				}
				console.log("slen: " + s.length);
				console.log("scovered: " + sCovered);
				if (s.length == sCovered) {
					//cant cover whole settlement
					return [false, -6];
				}
			}
		}
		if (player2.settlements.length > 0) {
			console.log(player2.settlements);
			for (var i = 0; i < player2.settlements.length; i++) {
				var s = player2.settlements[i];
				var sCovered = 0;	
				for (var j = 0; j < s.length; j++) {
					var x = s[j].position[0];
					var y = s[j].position[1];
					if (x == hex1Pos[0] && y == hex1Pos[1]) {
						sCovered += 1;
					} else if (x == hex2Pos[0] && y == hex2Pos[1]) {
						sCovered += 1;
					} else if (x == hex3Pos[0] && y == hex3Pos[1]) {
						sCovered += 1;
					}
				}
				if (s.Length == sCovered) {
					//cant cover whole settlement
					return [false, -6];
				}
			}
		}
		
		var newCen = theGrid[hex1Pos[0]][hex1Pos[1]].center;
		var dx = newCen.x - curTile.firstHex.center.x;
		var dy = newCen.y - curTile.firstHex.center.y;
		adjustTile2(1, dx, dy);
		curTile.firstHex.row = hex1Pos[0];
		curTile.firstHex.col = hex1Pos[1];
		theGrid[hex1Pos[0]][hex1Pos[1]] = curTile.firstHex;
		newCen = theGrid[hex2Pos[0]][hex2Pos[1]].center;
		dx = newCen.x - curTile.secondHex.center.x;
		dy = newCen.y - curTile.secondHex.center.y;
		adjustTile2(2, dx, dy);
		curTile.secondHex.row = hex2Pos[0];
		curTile.secondHex.col = hex2Pos[1];
		theGrid[hex2Pos[0]][hex2Pos[1]] = curTile.secondHex;
		newCen = theGrid[hex3Pos[0]][hex3Pos[1]].center;
		dx = newCen.x - curTile.thirdHex.center.x;
		dy = newCen.y - curTile.thirdHex.center.y;
		adjustTile2(3, dx, dy);
		curTile.thirdHex.row = hex3Pos[0];
		curTile.thirdHex.col = hex3Pos[1];
		theGrid[hex3Pos[0]][hex3Pos[1]] = curTile.thirdHex;
		
		return true;
		
	}
	
	// 0 = not on a field, 1 = on a volcano, 2 = tower not on lvl 3, 3 = tower or temple field not empty, 4 = hut must be level 1 empty
	function putBuildingOnTile(position, type) {
		var row = position[0];
		var col = position[1];
		if (theGrid[row][col].color == 'white') {
			return [false, 0];
		}
		if (theGrid[row][col].color == VOLCANOCOLOR) {
			return [false, 1];
		}
		if (type == "hut") {
			if (placingHuts) {
				var ok = false;
				for (var i = 0; i < terrainHexs.length; i++) {
					if (theGrid[row][col] == terrainHexs[i]) {
						if (theGrid[row][col].buildings.length < theGrid[row][col].level) {
							theGrid[row][col].buildings.push(curHut);
							ok = true;
						}
					}
				}
				if (ok == false) {
					return [false, 4];
				}
				
			}
			if (settlements.length == 0) {
				if (theGrid[row][col].level > 1) {
					return [false, 4]; 
				}
			}
			theGrid[row][col].buildings.push(curHut);
			return [true, -1];
		}
		if (type == "tower") {
			if (theGrid[row][col].level < 3) {
				return [false, 2];
			}  else {
				if (theGrid[row][col].buildings.length > 0) {
					return [false, 3];
				} else {
				//	theGrid[row][col].buildings.push(curTower);
					return [true, -1];
				}
			}
		}
		if (type == "temple") {
			if (theGrid[row][col].buildings.length > 0) {
				return [false, 3];
			} else {
			//	theGrid[row][col].buildings.push
				return [true, -1];
			}
		}
	}
	
	
	// returns if overlapping and level of hex 
	// -1 means not same lvls, 0 means just overlapping, -2 means ok levels but not right color for first
	function isOverlapping(positions) {
		var colors = [];
		
		for (var i = 0; i < 3; i++) {
			var position = positions[i];
			colors.push(theGrid[position[0]][position[1]].color);
		}
		if (colors.indexOf("white") != -1) {
			var numWhites = 0;
			for (var i = 0; i < 3; i++) {
				if (colors[i] == "white") {
					numWhites += 1;
				}
			}
			if (numWhites != 3) {
				return [true, 0];
			}
		} else {
			var lvls = [];
			for (var i = 0; i < 3; i++) {
				var position = positions[i];
				lvls.push(theGrid[position[0]][position[1]].level);
			}
			var first = lvls[0];
			if (lvls[1] != first || lvls[2] != first) {
				return [true, -1];
			} else {
				if (theGrid[positions[0][0]][positions[0][1]].color != VOLCANOCOLOR) {
					return [true, -2];
				}
				return [false, first + 1]
			}
		}
		return [false, 1];
	}
	
	function isAdjacent(positions) {
		for (var i = 0; i < 3; i++) {
			var position = positions[i];
			var x = position[0][0];
			var y = position[1][0];
			if (x > 0 && y > 0) {
				if (theGrid[x - 1][y - 1].color != "white") {
					 return true;
				}
				if (theGrid[x - 1][y].color != "white") {
					return true;
				}
				if (theGrid[x][y - 1].color != "white") {
					return true;
				}
				if (x < theGrid.length) {
					if (theGrid[x + 1][y].color != "white") {
						return true;
					}
					if (theGrid[x + 1][y - 1].color != "white") {
						return true;
					}
				}
				if (y < theGrid[0].length) {
					if (theGrid[x][y + 1].color != "white") {
						return true;
					}
				}
			} else if (x > 0 && y == 0) {
				if (theGrid[x][y + 1].color != "white") {
					return true;
				}
				if (theGrid[x - 1][y].color != "white") {
					return true;
				}
				if (x < theGrid.length) {
					if (theGrid[x + 1][y].color != "white") {
						return true;
					}
				}	
			} else if (x == 0 && y > 0) {
				if (theGrid[x][y - 1].color != "white") {
					return true;
				}
				if (theGrid[x + 1][y - 1].color != "white") {
					return true;
				}
				if (theGrid[x + 1][y].color != "white") {
					return true;
				}
				if (y < theGrid[0].length) {
					if (theGrid[x][y + 1].color != "white") {
						return true;
					}		
				}
			} else if (x == 0 && y == 0) {
				if (theGrid[x][y + 1].color != "white") {
					return true;
				}
				if (theGrid[x + 1][y].color != "white") {
					return true;
				}
				if (theGrid[x + 1][y + 1].color != "white") {
					return true;
				}
			}
		
		}
		return false;
	}
	
	function isAdjacentHex(mx, my, position) {
		var x = position[0];
		var y = position[1];
		if (x > 0 && y > 0) {
			console.log("x: " + x);
			console.log("Y: " + y);
			console.log("x is even: " + (x==0 || x%2 == 0));
			if (x!=0 && x%2 != 0) {
				if (clickInBuilding(mx, my, theGrid[x - 1][y - 1])) {
					return theGrid[x - 1][y - 1].color;
				}
			} else {
				if (clickInBuilding(mx, my, theGrid[x - 1][y + 1])) {
					return theGrid[x - 1][y + 1].color;
				}
			}
			if (clickInBuilding(mx, my, theGrid[x - 1][y])) {
				return theGrid[x - 1][y].color;
			}
			if (clickInBuilding(mx, my, theGrid[x][y - 1])) {
				return theGrid[x][y - 1].color;
			}
			if (x < theGrid.length) {
				if (clickInBuilding(mx, my, theGrid[x + 1][y])) {
					return theGrid[x + 1][y].color;
				}
				if (x!=0 && x%2 != 0) {
					if (clickInBuilding(mx, my, theGrid[x + 1][y - 1])) {
						return theGrid[x + 1][y - 1].color;
					}
				} else {
					if (clickInBuilding(mx, my, theGrid[x + 1][y + 1])) {   
						console.log("YEEEEEET");
						return theGrid[x + 1][y + 1].color;
					}
				}
				
			}
			if (y < theGrid[0].length) {
				if (clickInBuilding(mx, my, theGrid[x][y + 1])) {
					return theGrid[x][y + 1].color;
				}
			}
		} else if (x > 0 && y == 0) {
			if (clickInBuilding(mx, my, theGrid[x][y + 1])) {
				return theGrid[x][y + 1].color;
			}
			if (clickInBuilding(mx, my, theGrid[x - 1][y])) {
				return theGrid[x - 1][y].color;
			}
			if (x < theGrid.length) {
				if (clickInBuilding(mx, my, theGrid[x + 1][y])) {
					return theGrid[x + 1][y].color;
				}
			}	
		} else if (x == 0 && y > 0) {
			if (clickInBuilding(mx, my, theGrid[x][y - 1])) {
				return theGrid[x][y - 1].color;
			}
			if (clickInBuilding(mx, my, theGrid[x + 1][y + 1])) {
				return theGrid[x - 1][y + 1].color;
			}
			if (clickInBuilding(mx, my, theGrid[x + 1][y])) {
				return theGrid[x + 1][y].color;
			}
			if (y < theGrid[0].length) {
				if (clickInBuilding(mx, my, theGrid[x][y + 1])) {
						return theGrid[x][y + 1].color;
				}		
			}
		} else if (x == 0 && y == 0) {
			if (clickInBuilding(mx, my, theGrid[x][y + 1])) {
				return theGrid[x][y + 1].color;
			}
			if (clickInBuilding(mx, my, theGrid[x + 1][y])) {
				return theGrid[x + 1][y].color;
			}
			if (clickInBuilding(mx, my, theGrid[x + 1][y + 1])) {
				return theGrid[x + 1][y + 1].color;
			}
		}
		console.log("false for all");
		return "white";
	}
	
	// returns t/f and the settlement index
	function isAddingToSettlement(position, settlements) {
		var row = position[0][0];
		var col = position[1][0];
		var adjTo = [];
		console.log("SETTLEMENTS");
		console.log(settlements);
		for (var i = 0; i < settlements.length; i++) {
			var s = settlements[i];
			for (var j = 0; j < s.length; j++) {
				var bRow = s[j].position[0];
				var bCol = s[j].position[1];
				if (bRow == row) {
					if (bCol == (col - 1) || bCol == (col + 1)) {
					}
				} else if (bRow == (row - 1)) {
					if (bCol == col || bCol == (col - 1)) {
						adjTo.push(i);
					}
				}
				if (bRow == (row + 1)) {
					if (bCol == col || bCol == (col - 1)) {
						adjTo.push(i);
					}
				}
			}	
		}
		if (adjTo.length == 0) {
			return [false, -1];
		} else {
			return [true, adjTo];
		}
	}

	// this combines settlements if it is possible to - NEEDS TO BE FINISHED
	function combineSettlements() {
		var newSettlements = [];
		for (var i = 0; i < settlements.length - 1; i++) {
			var s1 = settlements[i];
			var s2 = settlements[i+1];
			var done = false;
			for (var j = 0; j < s1.length; j++) {
				for (var k = 0; k < s2.length; k++) {
					if (!done) {
						if (settlementIsAdj(s1[j], s2[k])) {
							var s = s1.concact(s2);
							newSettlements.push(s);

						}
					}
				}
			}
		}
	}
	
	function settlementIsAdj(building1, building2) {
		var b1Row = building1.position[0];
		var b1Col = building1.position[1];
		var b2Row = building2.position[0];
		var b2Col = building2.position[1];
		if (b2Row == b1Row) {
			if (b2Col == (b1Col - 1) || b2Col == (b1Col + 1)) {
				return true;
			}
		} else if (b2Row == (b1Row + 1)) {
			if (b2Col == (b1Col - 1) || b2Col == b1Col) {
				return true;
			}
		} else if (b2Row == (b1Row - 1)) {
			if (b2Col == (b1Col - 1) || b2Col == b1Col) {
				return true;
			}
		}
		return false;
	}

	//works
	function adjustTile2(num, dx, dy) {
		if (num == 1) {
			curTile.firstHex.center.x += dx;
			curTile.firstHex.center.y += dy;
			var corners = curTile.firstHex.corners
			for (var i = 0; i < 6; i++) {
				corners[i].x += dx;
				corners[i].y += dy;
			}
		} else if (num == 2) {
			curTile.secondHex.center.x += dx;
			curTile.secondHex.center.y += dy;
			var corners = curTile.secondHex.corners
			for (var i = 0; i < 6; i++) {
				corners[i].x += dx;
				corners[i].y += dy;
			}
		} else {
			curTile.thirdHex.center.x += dx;
			curTile.thirdHex.center.y += dy;
			var corners = curTile.thirdHex.corners
			for (var i = 0; i < 6; i++) {
				corners[i].x += dx;
				corners[i].y += dy;
			}
		}
	}
	
	// ok for now
	function adjustTile(tile, dx, dy) {
		var hexs = [tile.firstHex, tile.secondHex, tile.thirdHex];
		for (var i = 0; i < 3; i++) {
			var hex = hexs[i];
			hex.center.x += dx;
			hex.center.y += dy;
		}
	}
	
	// true: ok to drop, false: not ok
	// 1 = not adjacent, 2 = overlapping, 3 = wrong levels, 4 = not volcano, 5 = same direction
	function isOkToDrop() {
		var positions = findTilePosition();
		if (boardTileArray.length > 0) {
			if (!isAdjacent(positions)) {
				return [false, 1];
			}
			var over = isOverlapping(positions)
			if (over[0]) {
				if (over[1] == -1) {
					return [false, 3];
				} else if (over[1] == 0) {
					return [false, 2];
				} else {
					return [false, 4];
				}
			}
			if (theGrid[positions[0][0]][positions[0][1]].color == VOLCANOCOLOR && theGrid[positions[0][0]][positions[0][1]].deg == curTile.firstHex.deg) {
				return [false, 5];
			}
		} 
		return [true, -1];	
	}
	
	function drawBuildings() {
		var buildings = [];
		if (curTurn.player.num == 1) {
			if (hutArrayLen1 > 0) {
				buildings.push(curHut);
			}
			if (templeArrayLen1 > 0) {
				buildings.push(curTemple);
			}
			if (towerArrayLen1 > 0) {
				buildings.push(curTower);
			}
		} else {
			if (hutArrayLen2 > 0) {
				buildings.push(curHut);
			}
			if (templeArrayLen2 > 0) {
				buildings.push(curTemple);
			}
			if (towerArrayLen2 > 0) {
				buildings.push(curTower);
			}
		}
		for (var i = 0; i < buildings.length; i++) {
			var building = buildings[i];
			context.beginPath();
			context.shadowOffsetX = 0;
			context.shadowOffsetY = 0;
			context.shadowBlur = 0;
			drawBuilding(building);
			context.closePath();
			context.fillStyle = building.color;
			context.fill();
			context.strokeStyle = "white";
			context.lineWidth = 2;
			context.stroke();
			context.fill();
			addLetter(building);
		}
	}
	
	function movingABuilding(building) {
		context.clearRect(0, 0, 1000, 1000);
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
		context.shadowBlur = 0;
		drawGrid();
		if (placing || placingHuts) {
			drawSelectedTerrain(terrainHexs);
		}
		context.beginPath();
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
		context.shadowBlur = 0;
		drawBuilding(building);
		context.closePath();
		context.fillStyle = building.color;
		context.fill();
		context.strokeStyle = "white";
		context.lineWidth = 2;
		context.stroke();
		context.fill();
		addLetter(building);
	}
	
	// ok for now
	function movingATile(tile) {
		context.clearRect(0, 0, 1000, 1000);
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
		context.shadowBlur = 0;
		drawGrid();	
		// 1 = not adjacent, 2 = overlapping, 3 = wrong levels, 4 = not volcano, 5 = same direction
		var isOk = isOkToDrop();
		
		if (isOk[0]) {
			context.globalAlpha = 0.8
			drawTile(tile, true);
			context.globalAlpha = 1;
		} else {
			context.globalAlpha = 0.8;
			drawTile(tile, false);
			context.globalAlpha = 1;
		}
	}
	
	
	// needs work
	function movingARotatedTile(tile) {
		var deg = tile.deg;
		context.clearRect(0, 0, 1000, 1000);
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
		context.shadowBlur = 0;
		drawGrid();
		rotateTile(tile, tile.firstHex.corners[0].x, tile.firstHex.corners[0].y, tile.deg);
	}
	
	function getRotatedCenter(center, around, angle) {
		var x = around.x + (center.x - around.x)*Math.cos(angle * Math.PI/180) - (center.y - around.y)*Math.sin(angle * Math.PI/180);
		var y = around.y + (center.x - around.x)*Math.sin(angle * Math.PI/180) + (center.y - around.y)*Math.cos(angle * Math.PI/180);
		return new Point(x, y);
	}
	
	// ok
	function clickInTile(mousePosX, mousePosY) {
		var corners = curTile.corners;
		// initial square check
		if (mousePosX > corners[5].x || mousePosX < corners[9].x || mousePosY > corners[6].y || mousePosY < corners[1].y) {
			return false;
		}
		// right half
		if (mousePosX >= corners[1].x) {
			// bottom part
			if (mousePosY > corners[3].y) {
				// check if above 5->6 line
				var slope = (corners[6].y - corners[5].y)/(corners[6].x - corners[5].x);
				var b = corners[5].y - (corners[5].x * slope);
				if (mousePosY > ((slope * mousePosX) + b)) {
					// below -> not in tile
					return false;
				}
				// check if above 6 -> 7 line
				slope = (corners[7].y - corners[6].y)/(corners[7].x - corners[6].x);
				b = corners[6].y - (corners[6].x * slope);
				if (mousePosY > ((slope * mousePosX) + b)) {
					// below -> not in tile
					return false;
				}
				// check if below 3 -> 4 line
				slope = (corners[4].y - corners[3].y)/(corners[4].x - corners[3].x);
				b = corners[3].y - (corners[3].x * slope);
				if (mousePosY < ((slope * mousePosX) + b)) {
					// above -> not in tile
					return false;
				}
			// top part
			} else {
				// check if below 1 -> 2 line
				var slope = (corners[2].y - corners[1].y)/(corners[2].x - corners[1].x);
				var b = corners[1].y - (corners[1].x * slope);
				if (mousePosY < ((slope * mousePosX) + b)) {
					// above -> not in tile
					return false;
				}
			}
		} else {
			// bottom part
			if (mousePosY > corners[3].y) {
				// check if above 7->8 line
				var slope = (corners[8].y - corners[7].y)/(corners[8].x - corners[7].x);
				var b = corners[7].y - (corners[7].x * slope);
				if (mousePosY > ((slope * mousePosX) + b)) {
					// below -> not in tile
					return false;
				}
				// check if above 8 -> 9 line
				slope = (corners[9].y - corners[8].y)/(corners[9].x - corners[8].x);
				b = corners[8].y - (corners[8].x * slope);
				if (mousePosY > ((slope * mousePosX) + b)) {
					// below -> not in tile
					return false;
				}
				// check if below 10 -> 11 line
				slope = (corners[11].y - corners[10].y)/(corners[11].x - corners[10].x);
				b = corners[10].y - (corners[10].x * slope);
				if (mousePosY < ((slope * mousePosX) + b)) {
					// above -> not in tile
					return false;
				}
			// top part
			} else {
				// check if below 0 -> 1 line
				var slope = (corners[1].y - corners[0].y)/(corners[1].x - corners[0].x);
				var b = corners[0].y - (corners[0].x * slope);
				if (mousePosY < ((slope * mousePosX) + b)) {
					// above -> not in tile
					return false;
				}
			}
		}
		return true;
	}
	

	
	function clickInBuilding(mx, my, building) {
		var corners = building.corners
		if (mx > corners[5].x || mx < corners[1].x) {
			return false;
		}
		if (my > corners[0].y || my < corners[3].y) {
			return false;
		}
		
		var slope = (corners[4].y - corners[3].y)/(corners[4].x - corners[3].x);
		var b = corners[3].y - (corners[3].x * slope);
		if (my < ((slope * mx) + b)) {
			// above -> not in tile
			return false;
		} 
		
		var slope = (corners[2].y - corners[3].y)/(corners[2].x - corners[3].x);
		var b = corners[3].y - (corners[3].x * slope);
		if (my < ((slope * mx) + b)) {
			// above -> not in tile
			return false;
		} 
		
		var slope = (corners[0].y - corners[1].y)/(corners[0].x - corners[1].x);
		var b = corners[1].y - (corners[1].x * slope);
		if (my > ((slope * mx) + b)) {
			// below -> not in tile
			return false;
		} 
		
		var slope = (corners[5].y - corners[0].y)/(corners[5].x - corners[0].x);
		var b = corners[0].y - (corners[0].x * slope);
		if (my > ((slope * mx) + b)) {
			// below -> not in tile
			return false;
		} 
		return true;
	}
	
	function clickOnExpand(mx, my) {
		if (mx > 40 && my > 490 && mx < 170 && my < 520) {
			if (curTurn.player.settlements.length > 0) {
				return true;
			}
		} 
		return false;
	}
	
	function clickOnASettlement(mx, my, settlements) {
		for (var i = 0; i < settlements.length; i++) {
			var settlement = settlements[i];
			for (var j = 0; j < settlement.length; j++) {
				var x = settlement[j].position[0];
				var y = settlement[j].position[1];
				if (clickInBuilding(mx, my, theGrid[x][y])) {
					return i;
				}
			}
		} 
		return -1;
	}
	
	function pickingATerrain(mx, my, settlement) {
		for (var i = 0; i < settlement.length; i++) {
			var x = settlement[i].position[0];
			var y = settlement[i].position[1];
			var color = isAdjacentHex(mx, my, settlement[i].position);
			console.log(color);
			if (color != "white") {
				return color;
			} else {
				return -1;
			}
		}
	}
	
	function getTerrainHexs(s, color) {
		var positions = [];
		var hexs = [];
		for (var i = 0; i < s.length; i++) {
			positions.push(s[i].position);
		}
		console.log("COLRO: " + color);
		for (var i = 0; i < positions.length; i++) {
			var x = positions[i][0];
			var y = positions[i][1];
			if (x > 0 && y > 0) {
				if (x!=0 && x%2 !=0)  {
					if (theGrid[x - 1][y - 1].color == color && positions.indexOf([(x-1), (y-1)]) == -1) {
						hexs.push(theGrid[x][y-1]);
					}
				} else {
					if (theGrid[x - 1][y + 1].color == color && positions.indexOf([(x-1), (y-1)]) == -1) {
						hexs.push(theGrid[x][y-1]);
					}
				}
				if (theGrid[x - 1][y].color == color && positions.indexOf([(x-1), y]) == -1) {
					hexs.push(theGrid[x - 1][y]);
				}
				if (theGrid[x][y - 1].color == color && positions.indexOf([x, (y-1)]) == -1) {
					hexs.push(theGrid[x][y-1]);
				}
				if (y < theGrid[0].length) {
					if (theGrid[x][y + 1].color == color && positions.indexOf([x, (y+1)]) == -1) {
						hexs.push(theGrid[x][y+1]);
					}
				}
				if (x < theGrid.length) {
					if (x!=0 && x%2 !=0)  {
						if (theGrid[x+1][y - 1].color == color && positions.indexOf([(x+1), (y-1)]) == -1) {
							hexs.push(theGrid[x+1][y-1]);
						}
					} else {
						if (theGrid[x+1][y + 1].color == color && positions.indexOf([(x+1), (y+1)]) == -1) {
							hexs.push(theGrid[x+1][y+1]);
						}
					}
					if (theGrid[x+1][y].color == color && positions.indexOf([(x+1), y]) == -1) {
						hexs.push(theGrid[x+1][y]);
					}
				} 
			} else if (x == 0 && y == 0) {
				if (theGrid[x][y + 1].color == color && positions.indexOf([x, (y+1)]) == -1) {
					hexs.push(theGrid[x][y+1]);
				}
				if (theGrid[x+1][y].color == color && positions.indexOf([(x+1), y]) == -1) {
					hexs.push(theGrid[x+1][y]);
				}
			} else if (x == 0 && y > 0) {
				if (theGrid[x][y - 1].color == color && positions.indexOf([x, (y-1)]) == -1) {
					hexs.push(theGrid[x][y-1]);
				}
				if (y < theGrid[0].length) {
					if (theGrid[x][y + 1].color == color && positions.indexOf([x, (y+1)]) == -1) {
						hexs.push(theGrid[x][y+1]);
					}
				}
				if (theGrid[x+1][y - 1].color == color && positions.indexOf([(x+1), (y-1)]) == -1) {
					hexs.push(theGrid[x+1][y-1]);
				}
				if (theGrid[x+1][y].color == color && positions.indexOf([(x+1), y]) == -1) {
					hexs.push(theGrid[x+1][y]);
				}
			} else if (x > 0 && y == 0) {
				if (theGrid[x - 1][y].color == color && positions.indexOf([(x-1), y]) == -1) {
					hexs.push(theGrid[x - 1][y]);
				}
				if (theGrid[x][y + 1].color == color && positions.indexOf([x, (y+1)]) == -1) {
					hexs.push(theGrid[x][y+1]);
				}
				if (x < theGrid.length) {
					if (theGrid[x+1][y].color == color && positions.indexOf([(x+1), y]) == -1) {
						hexs.push(theGrid[x+1][y]);
					}
				} 
			}
		}
		console.log(hexs);
		return hexs;
	}
	
	// needs work
	function eventKeyPressed(e) {
		var letter = String.fromCharCode(e.keyCode);
		letter = letter.toLowerCase();
		if (letter == 'r' || letter == 'f') {
			context.clearRect(0, 0, 1000, 1000);
			context.shadowOffsetX = 0;
			context.shadowOffsetY = 0;
			context.shadowBlur = 0;
			drawGrid();
			context.fillStyle = 'rgba(209, 173, 113, 1)';
			curTile.rotated = true;
			curTile.firstHex.rotated = true;
			if (letter == 'r') {
				adjustDeg(curTile, 120);
				rotateTile(curTile, startX, startY, curTile.deg);		
			} else {
				adjustDeg(curTile, 180);
				rotateTile(curTile, startX, startY, curTile.deg);
			}
		}
		if (e.keyCode == 13) {
			context.clearRect(0, 0, 1000, 1000);
			context.shadowOffsetX = 0;
			context.shadowOffsetY = 0;
			context.shadowBlur = 0;
			drawGrid();
			context.fillStyle = 'rgba(209, 173, 113, 1)';
			context.shadowOffsetX = 4;
			context.shadowOffsetY = 4;
			context.shadowColor = 'black';
			context.shadowBlur = 4;
			context.fillRect(0, 0, 200, 540);
			context.shadowOffsetX = 0;
			context.shadowOffsetY = 0;
			context.shadowBlur = 0;
			context.fillStyle = "purple"
			context.fillRect(40, 490, 130, 30);
			drawExpandText();
			drawPlayerText(curTurn.player.num);
			if (curTurn.placedTile) {
				drawPlaceBuildingText(); 
			} else {
				drawPlaceTileText();
			}
			drawBuildingText();
			if (curTurn.player.num == 1) {
				drawRemainingText(stackTileArray.length, templeArrayLen1, towerArrayLen1, hutArrayLen1);
			} else {
				drawRemainingText(stackTileArray.length, templeArrayLen2, towerArrayLen2, hutArrayLen2);
			}
			moveTileToOrig();
			moveBuildingsToOrig();
			drawTile(curTile, true);
			drawBuildings();
			drawSettlementText();
		}
	}
	
	function getNonRotatedCen(cen, deg, around) {
		var cos = Math.cos(deg * Math.PI/180);
		var sin = Math.sin(deg * Math.PI/180);
		var x = (cos * (cen.x - around.x)) + (sin * (cen.y - around.y)) + around.x;
		var y = (cos * (cen.y - around.y)) - (sin * (cen.x - around.x)) + around.y;
		return [x, y];
	}
	
	function adjustDeg(tile, deg) {
		tile.deg += deg;
		tile.firstHex.deg += deg;
		if (tile.deg >= 360) {
			tile.deg -= 360;
			tile.firstHex.deg -= 360;
		}
	}
	
	function moveTileToOrig() {
		adjustTile2(1, origCens[0].x - curTile.firstHex.center.x, origCens[0].y - curTile.firstHex.center.y);
		adjustTile2(2, origCens[1].x - curTile.secondHex.center.x, origCens[1].y - curTile.secondHex.center.y);
		adjustTile2(3, origCens[2].x - curTile.thirdHex.center.x, origCens[2].y - curTile.thirdHex.center.y);
	}
	
	function moveBuildingsToOrig() {
		curHut.center.x = 90;
		curHut.center.y = 230;
		curTemple.center.x = 90;
		curTemple.center.y = 330;
		curTower.center.x = 90;
		curTower.center.y = 430;
	}
	
	// needs work
	function rotateTile(curTile, x, y, deg) {
		var angle = deg * Math.PI/180;
		context.save();
		context.setTransform(1, 0, 0, 1, 0, 0);
		context.translate(startX, startY);
		context.rotate(angle);
		context.translate(-startX, -startY)
		context.globalAlpha = 0.8;
		drawTile(curTile, true);
		context.globalAlpha = 1;
		context.restore();
	}
	
	function rotateHex(hex, deg) {
		var angle = deg * Math.PI/180;
		context.save();
		context.setTransform(1, 0, 0, 1, 0, 0);
		context.translate(hex.center.x, hex.center.y);
		context.rotate(angle);
		context.translate(-hex.center.x, -hex.center.y)
		drawHex(hex);
		context.restore();
	}
	
	// ok for now
	function drawRemainingText(tileLength, templeLength, towerLength, hutLength) {
		context.font = "14px Arial";
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
		context.shadowBlur = 0;
		context.fillStyle = "black";
		context.fillText("remaining: " + tileLength,10,50);
		context.fillText("remaining: " + hutLength, 10, 210);
		context.fillText("remaining: " + templeLength, 10, 300);
		context.fillText("remaining: " + towerLength, 10, 400);
	}
	
	// ok for now
	function noMoreTilesText() {
		context.font = "20px Arial";
		context.fillStyle = "black";
		context.fillText("NO MORE TILES", 10, 70);
	}
	
	// ok for now
	function drawPlayerText(player) {
		context.font = "16px Arial";
		context.shadowOffsetX = 2;
		context.shadowOffsetY = 2;
		context.shadowColor = 'white';
		context.shadowBlur = 2;
		if (player == 1) {
			context.fillStyle = 'purple';
		} else {
			context.fillStyle = 'blue';
		}
		context.fillText("Player " + player + "'s Turn...", 10, 15);
	}
	
	function drawPlaceTileText() {
		context.font = "16px Arial";
		context.shadowOffsetX = 2;
		context.shadowOffsetY = 2;
		context.shadowColor = 'white';
		context.shadowBlur = 2;
		context.fillStyle = 'green';
		context.fillText("Place a tile.", 10, 30);
	}
	
	function drawClickOnSettlementText() {
		context.font = "16px Arial";
		context.shadowOffsetX = 2;
		context.shadowOffsetY = 2;
		context.shadowColor = 'white';
		context.shadowBlur = 2;
		context.fillStyle = 'green';
		context.fillText("Click on a settlement.", 10, 30);
	}
	
	function drawPlaceBuildingText() {
		context.font = "16px Arial";
		context.shadowOffsetX = 2;
		context.shadowOffsetY = 2;
		context.shadowColor = 'white';
		context.shadowBlur = 2;
		context.fillStyle = 'green';
		context.fillText("Place a building.", 10, 30);
	}
	
	function drawChooseTerrainText() {
		context.font = "13px Arial";
		context.shadowOffsetX = 2;
		context.shadowOffsetY = 2;
		context.shadowColor = 'white';
		context.shadowBlur = 2;
		context.fillStyle = 'green';
		context.fillText("Choose a surrounding terrain type.", 10, 30);
	}
	
	function drawSettlementText() {
		context.font = "14px Arial";
		context.shadowOffsetX = 1;
		context.shadowOffsetY = 1;
		context.shadowBlur = 1;
		context.shadowColor = 'black';
		context.fillStyle = "white";
		if (curTurn.player.num == 1) {
			context.fillText("current settlements: " + player1.settlements.length, 10, 190);
		} else {
			context.fillText("current settlements: " + player2.settlements.length, 10, 190);
		}
	}
	
	function drawPlaceBuildingsText() {
		context.font = "13px Arial";
		context.shadowOffsetX = 2;
		context.shadowOffsetY = 2;
		context.shadowColor = 'white';
		context.shadowBlur = 2;
		context.fillStyle = 'green';
		context.fillText("Place one hut/level on each highlighted terrain.", 10, 30);
	}
	
	function drawBuildingText() {
		context.font = "14px Arial";
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
		context.shadowBlur = 0;
		context.fillStyle = "black";
		context.fillText("huts", 70, 270);
		context.fillText("temples", 70, 370);
		context.fillText("towers", 75, 470);
	}
		
	function drawOverlappingText() {
		context.font = "50px Arial";
		context.shadowOffsetX = 4;
		context.shadowOffsetY = 4;
		context.shadowColor = 'black';
		context.shadowBlur = 4;
		context.fillStyle = 'red';
		context.strokeStyle = 'black';
		context.lineWidth = 4;
		context.strokeText("INVALID MOVE!", 300, 200);
		context.fillText("INVALID MOVE!", 300, 200);
		context.font = "35px Arial";
		context.strokeText("Overlapping tiles.", 300, 300);
		context.fillText("Overlapping tiles.", 300, 300);
	}
	
	function drawAdjacentText() {
		context.font = "50px Arial";
		context.shadowOffsetX = 4;
		context.shadowOffsetY = 4;
		context.shadowColor = 'black';
		context.shadowBlur = 4;
		context.fillStyle = 'red';
		context.strokeStyle = 'black';
		context.lineWidth = 4;
		context.strokeText("INVALID MOVE!", 300, 200);
		context.fillText("INVALID MOVE!", 300, 200);
		context.font = "35px Arial";
		context.strokeText("Tile must be adjacent.", 300, 300);
		context.fillText("Tile must be adjacent.", 300, 300);
	}
	
	function drawCantCoverFullSettle() {
		context.font = "50px Arial";
		context.shadowOffsetX = 4;
		context.shadowOffsetY = 4;
		context.shadowColor = 'black';
		context.shadowBlur = 4;
		context.fillStyle = 'red';
		context.strokeStyle = 'black';
		context.lineWidth = 4;
		context.strokeText("INVALID MOVE!", 300, 200);
		context.fillText("INVALID MOVE!", 300, 200);
		context.font = "35px Arial";
		context.strokeText("Tile must be adjacent.", 300, 300);
		context.fillText("Tile must be adjacent.", 300, 300);
	}
	
	function drawWrongLevelsText() {
		context.font = "50px Arial";
		context.shadowOffsetX = 4;
		context.shadowOffsetY = 4;
		context.shadowColor = 'black';
		context.shadowBlur = 4;
		context.fillStyle = 'red';
		context.strokeStyle = 'black';
		context.lineWidth = 4;
		context.strokeText("INVALID MOVE!", 300, 200);
		context.fillText("INVALID MOVE!", 300, 200);
		context.font = "35px Arial";
		context.strokeText("Cannot cover an entire settlement.", 100, 300);
		context.fillText("Cannot cover an entire settlement.", 100, 300);
	}
	
	function drawNotVolColorText() {
		context.font = "50px Arial";
		context.shadowOffsetX = 4;
		context.shadowOffsetY = 4;
		context.shadowColor = 'black';
		context.shadowBlur = 4;
		context.fillStyle = 'red';
		context.strokeStyle = 'black';
		context.lineWidth = 4;
		context.strokeText("INVALID MOVE!", 300, 200)
		context.fillText("INVALID MOVE!", 300, 200);
		context.font = "35px Arial";
		context.strokeText("Volcano hexs can only have volcano hexs stacked on it.", 50, 300);
		context.fillText("Volcano hexs can only have volcano hexs stacked on it.", 50, 300);
	}
	
	function drawSameDirectionText() {
		context.font = "50px Arial";
		context.shadowOffsetX = 4;
		context.shadowOffsetY = 4;
		context.shadowColor = 'black';
		context.shadowBlur = 4;
		context.fillStyle = 'red';
		context.strokeStyle = 'black';
		context.lineWidth = 4;
		context.strokeText("INVALID MOVE!", 300, 200)
		context.fillText("INVALID MOVE!", 300, 200);
		context.font = "30px Arial";
		context.strokeText("Volcano hex can't be in same direction", 250, 250);
		context.strokeText("as the volcano hex it is stacked on.", 250, 300);
		context.fillText("Volcano hex can't be in same direction", 250, 250);
		context.fillText("as the volcano hex it is stacked on.", 250, 300);
	}
	
	function drawSettlementHasTowerText() {
		context.font = "50px Arial";
		context.shadowOffsetX = 4;
		context.shadowOffsetY = 4;
		context.shadowColor = 'black';
		context.shadowBlur = 4;
		context.fillStyle = 'red';
		context.strokeStyle = 'black';
		context.lineWidth = 4;
		context.strokeText("INVALID MOVE!", 300, 200)
		context.fillText("INVALID MOVE!", 300, 200);
		context.font = "35px Arial";
		context.strokeText("Settlement already has a tower in it.", 50, 300);
		context.fillText("Settlement already has a tower in it.", 50, 300);
	}

	function drawSettlementHasTempleText() {
		context.font = "50px Arial";
		context.shadowOffsetX = 4;
		context.shadowOffsetY = 4;
		context.shadowColor = 'black';
		context.shadowBlur = 4;
		context.fillStyle = 'red';
		context.strokeStyle = 'black';
		context.lineWidth = 4;
		context.strokeText("INVALID MOVE!", 300, 200)
		context.fillText("INVALID MOVE!", 300, 200);
		context.font = "35px Arial";
		context.strokeText("Settlement already has a temple in it.", 50, 300);
		context.fillText("Settlement already has a temple in it.", 50, 300);	
	}
	
	function drawTowerMustBeAddedToSettlementText() {
		context.font = "50px Arial";
		context.shadowOffsetX = 4;
		context.shadowOffsetY = 4;
		context.shadowColor = 'black';
		context.shadowBlur = 4;
		context.fillStyle = 'red';
		context.strokeStyle = 'black';
		context.lineWidth = 4;
		context.strokeText("INVALID MOVE!", 300, 200)
		context.fillText("INVALID MOVE!", 300, 200);
		context.font = "35px Arial";
		context.strokeText("Tower must be added to a settlement.", 150, 300);
		context.fillText("Tower must be added to a settlement", 150, 300);
	}
	
	function drawTempleMustBeAddedToSettlementText() {
		context.font = "50px Arial";
		context.shadowOffsetX = 4;
		context.shadowOffsetY = 4;
		context.shadowColor = 'black';
		context.shadowBlur = 4;
		context.fillStyle = 'red';
		context.strokeStyle = 'black';
		context.lineWidth = 4;
		context.strokeText("INVALID MOVE!", 300, 200)
		context.fillText("INVALID MOVE!", 300, 200);
		context.font = "35px Arial";
		context.strokeText("Temple must be added to a settlement.", 150, 300);
		context.fillText("Temple must be added to a settlement", 150, 300);
	}
	
	function drawBuildingNotOnAFieldText() {
		context.font = "50px Arial";
		context.shadowOffsetX = 4;
		context.shadowOffsetY = 4;
		context.shadowColor = 'black';
		context.shadowBlur = 4;
		context.fillStyle = 'red';
		context.strokeStyle = 'black';
		context.lineWidth = 4;
		context.strokeText("INVALID MOVE!", 300, 200)
		context.fillText("INVALID MOVE!", 300, 200);
		context.font = "35px Arial";
		context.strokeText("Building needs to be on a field.", 50, 300);
		context.fillText("Building needs to be on a field.", 50, 300);
	}
	
	function drawBuildingOnAVolcanoText() {
		context.font = "50px Arial";
		context.shadowOffsetX = 4;
		context.shadowOffsetY = 4;
		context.shadowColor = 'black';
		context.shadowBlur = 4;
		context.fillStyle = 'red';
		context.strokeStyle = 'black';
		context.lineWidth = 4;
		context.strokeText("INVALID MOVE!", 300, 200)
		context.fillText("INVALID MOVE!", 300, 200);
		context.font = "35px Arial";
		context.strokeText("Building cannot be on a volcano.", 200, 300);
		context.fillText("Building cannot be on a volcano.", 200, 300);
	}
	
	function drawTowerNeedsToBeOnLevelThree() {
		context.font = "50px Arial";
		context.shadowOffsetX = 4;
		context.shadowOffsetY = 4;
		context.shadowColor = 'black';
		context.shadowBlur = 4;
		context.fillStyle = 'red';
		context.strokeStyle = 'black';
		context.lineWidth = 4;
		context.strokeText("INVALID MOVE!", 300, 200)
		context.fillText("INVALID MOVE!", 300, 200);
		context.font = "35px Arial";
		context.strokeText("Tower must be on an empty level three field.", 100, 300);
		context.fillText("Tower must be on an empty level three field.", 100, 300);
	}

	function drawSettlementMustBeLengthThreeText() {
		context.font = "50px Arial";
		context.shadowOffsetX = 4;
		context.shadowOffsetY = 4;
		context.shadowColor = 'black';
		context.shadowBlur = 4;
		context.fillStyle = 'red';
		context.strokeStyle = 'black';
		context.lineWidth = 4;
		context.strokeText("INVALID MOVE!", 300, 200)
		context.fillText("INVALID MOVE!", 300, 200);
		context.font = "30px Arial";
		context.strokeText("Settlement must have a size of at least three fields to add temple.", 40, 300);
		context.fillText("Settlement must have a size of at least three fields to add temple.", 40, 300);
	}
	
	
	function drawHutMustBeOnOne() {
		context.font = "50px Arial";
		context.shadowOffsetX = 4;
		context.shadowOffsetY = 4;
		context.shadowColor = 'black';
		context.shadowBlur = 4;
		context.fillStyle = 'red';
		context.strokeStyle = 'black';
		context.lineWidth = 4;
		context.strokeText("INVALID MOVE!", 300, 200)
		context.fillText("INVALID MOVE!", 300, 200);
		context.font = "35px Arial";
		context.strokeText("New settlement must be started on an empty level one field.", 100, 300);
		context.fillText("New settlement must be started on an empty level one field.", 100, 300);
	}
	
	function drawDontCoverTempleText() {
		context.font = "50px Arial";
		context.shadowOffsetX = 4;
		context.shadowOffsetY = 4;
		context.shadowColor = 'black';
		context.shadowBlur = 4;
		context.fillStyle = 'red';
		context.strokeStyle = 'black';
		context.lineWidth = 4;
		context.strokeText("INVALID MOVE!", 300, 200)
		context.fillText("INVALID MOVE!", 300, 200);
		context.font = "35px Arial";
		context.strokeText("Cannot cover a temple or a tower.", 100, 300);
		context.fillText("Cannot cover a temple or a tower.", 100, 300);
	}
	
	function drawAlreadyPlacedTileText() {
		context.font = "50px Arial";
		context.shadowOffsetX = 4;
		context.shadowOffsetY = 4;
		context.shadowColor = 'black';
		context.shadowBlur = 4;
		context.fillStyle = 'red';
		context.strokeStyle = 'black';
		context.lineWidth = 4;
		context.strokeText("INVALID MOVE!", 300, 200)
		context.fillText("INVALID MOVE!", 300, 200);
		context.font = "35px Arial";
		context.strokeText("Player " + curTurn.player.num + " already placed a tile this turn", 150, 300);
		context.strokeText("Player " + curTurn.player.num + " must now place a building.", 150, 350);
		context.fillText("Player " + curTurn.player.num + " already placed a tile this turn", 150, 300);
		context.fillText("Player " + curTurn.player.num + " must now place a building.", 150, 350);
	}
	
	function drawPlaceTileFirstText() {
		context.font = "50px Arial";
		context.shadowOffsetX = 4;
		context.shadowOffsetY = 4;
		context.shadowColor = 'black';
		context.shadowBlur = 4;
		context.fillStyle = 'red';
		context.strokeStyle = 'black';
		context.lineWidth = 4;
		context.strokeText("INVALID MOVE!", 300, 200)
		context.fillText("INVALID MOVE!", 300, 200);
		context.font = "35px Arial";
		context.strokeText("Player " + curTurn.player.num + " must place a tile before placing a building", 100, 300);
		context.fillText("Player " + curTurn.player.num + " must place a tile before placing a building", 100, 300);
	} 
	
	function drawMustClickOnAdjTerrainText() {
		context.font = "50px Arial";
		context.shadowOffsetX = 4;
		context.shadowOffsetY = 4;
		context.shadowColor = 'black';
		context.shadowBlur = 4;
		context.fillStyle = 'red';
		context.strokeStyle = 'black';
		context.lineWidth = 4;
		context.strokeText("INVALID MOVE!", 300, 200)
		context.fillText("INVALID MOVE!", 300, 200);
		context.font = "35px Arial";
		context.strokeText("Must click on an adjacent terrain.", 100, 300);
		context.fillText("Must click on an adjacent terrain.", 100, 300);
	}
	
	function drawGameOverText() {
		context.font = "50px Arial";
		context.shadowOffsetX = 4;
		context.shadowOffsetY = 4;
		context.shadowColor = 'black';
		context.shadowBlur = 4;
		context.fillStyle = 'red';
		context.strokeStyle = 'black';
		context.lineWidth = 4;
		context.strokeText("GAME OVER", 300, 200)
		context.fillText("GAME OVER", 300, 200);
		if (player1.templeCount > player2.templeCount) {
			context.strokeText("Winner: Player 1!", 300, 250);
			context.fillText("Winner: Player 1!", 300, 250);
		} else if (player1.templeCount < player2.templeCount) {
			context.strokeText("Winner: Player 2!", 300, 250);
			context.fillText("Winner: Player 2!", 300, 250);
		} else if ((player1.towerCount + player1.templeCount) > (player1.towerCount + player1.templeCount)) {
			context.strokeText("Winner: Player 1!", 300, 250);
			context.fillText("Winner: Player 1!", 300, 250);
		} else if ((player1.towerCount + player1.templeCount) < (player1.towerCount + player1.templeCount)) {
			context.strokeText("Winner: Player 2!", 300, 250);
			context.fillText("Winner: Player 2!", 300, 250);
		} else if ((player1.towerCount + player1.templeCount + player1.hutCount) > (player1.towerCount + player1.templeCount + player2.hutCount)) {
			context.strokeText("Winner: Player 1!", 300, 250);
			context.fillText("Winner: Player 1!", 300, 250);
		} else {
			context.strokeText("Winner: Player 2!", 300, 250);
			context.fillText("Winner: Player 2!", 300, 250);
		}
	}
	
	function drawGameOverTextPlayer1() {
		context.font = "50px Arial";
		context.shadowOffsetX = 4;
		context.shadowOffsetY = 4;
		context.shadowColor = 'black';
		context.shadowBlur = 4;
		context.fillStyle = 'red';
		context.strokeStyle = 'black';
		context.lineWidth = 4;
		context.strokeText("GAME OVER", 300, 200)
		context.fillText("GAME OVER", 300, 200);
		context.strokeText("Player 1 wins, finished placing all buildings of two types.", 100, 250);
		context.fillText("Player 1 wins, finished placing all buildings of two types.", 100, 250);
	}
	
	function drawGameOverTextPlayer2() {
		context.font = "50px Arial";
		context.shadowOffsetX = 4;
		context.shadowOffsetY = 4;
		context.shadowColor = 'black';
		context.shadowBlur = 4;
		context.fillStyle = 'red';
		context.strokeStyle = 'black';
		context.lineWidth = 4;
		context.strokeText("GAME OVER", 300, 200)
		context.fillText("GAME OVER", 300, 200);
		context.strokeText("Player 2 wins, finished placing all buildings of two types.", 100, 250);
		context.fillText("Player 2 wins, finished placing all buildings of two types.", 100, 250);
	}
	
	function drawMustPlaceHutsText() {
		context.font = "50px Arial";
		context.shadowOffsetX = 4;
		context.shadowOffsetY = 4;
		context.shadowColor = 'black';
		context.shadowBlur = 4;
		context.fillStyle = 'red';
		context.strokeStyle = 'black';
		context.lineWidth = 4;
		context.strokeText("Must place huts.", 300, 200)
		context.fillText("Must place huts.", 300, 200);
	}
	
	function drawExpandText() {
		context.font = "12px Arial";
		context.shadowOffSetX = 0;
		context.shadowOffSetY = 0;
		context.shadowBlur = 0;
		context.fillStyle = "white"
		context.fillText("Expand a settlement", 50, 510);
	}
	
	
	// ok for now
	function Point(x, y) {
		this.x = x;
		this.y = y;
	}
	
	// ok for now
	function Hex(center, color) {
		this.center = center;
		this.color = color;
		this.corners = [];
		this.rotated = false;
		this.deg = 0;
		this.level = 0;
		this.row = 0;
		this.col = 0;
		this.buildings = [];
	}
	
	function Building(center, color, type) {
		this.center = center;
		this.color = color;
		this.type = type;
		this.corners = [];
		this.isDragging = false;
		this.position = [];
	}
	
	// ok for now
	function HexState(row, col, level, type, rotation, orientation) {
		this.row = row;
		this.col = col;
		this.level = level;
		this.type = type;
		this.rotation = rotation;
		this.orientation = orientation;
	}
	
	// ok for now
	function Tile(firstHex, secondHex, thirdHex) {
		this.firstHex = firstHex;
		this.secondHex = secondHex;
		this.thirdHex = thirdHex;
		this.corners = [];
		this.isDragging = false;
		this.center = 0;
		this.rotated = false;
		this.deg = 0;
		this.top = [1];
	}
	
	function Player(num) {
		this.num = num;
		this.settlements = [];
		this.hutCount = 0;
		this.templeCount = 0;
		this.towerCount = 0;
	}
	
	function Turn(player, placedTile, placedBuilding) {
		this.player = player;
		this.placedTile = placedTile;
		this.placedBuilding = placedBuilding;
	}

	Tile.prototype.contains = function(mx, my) {
		return clickInTile(mx, my);
	}
}

