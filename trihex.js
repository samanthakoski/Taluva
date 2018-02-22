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
	var boardBuildingArray = [];
	var templeArrayLen = 0;
	var towerArrayLen = 0;
	var hutArrayLen = 0;
	var theGrid = [];
	var settlements = [];
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
	// huts = purple, temples = pink, towers = black
	function drawScreen() {
		
		
		var fillImg = new Image();  
		fillImg.src = 'fill_20x20.gif';  
		
		fillImg.onload = function(){  
			//context.fillStyle = "blue";
			//context.fillRect(0, 0, 1000, 1000);
			theGrid = generateGridArray();
			drawGrid();
			context.shadowOffsetX = 4;
			context.shadowOffsetY = 4;
			context.shadowColor = 'black';
			context.shadowBlur = 4;
			context.fillStyle = 'rgba(209, 173, 113, 1)';
			context.fillRect(0, 0, 200, 500);
			stackTileArray = generateTileArray(48);
			templeArrayLen = 12;
			towerArrayLen = 8;
			hutArrayLen = 80;
			curTemple =new Building(new Point(90, 330), "purple", "temple");
			curHut = new Building(new Point(90, 230), "purple", "hut");
			curTower = new Building(new Point(90, 430), "purple", "tower");
			curTile = stackTileArray[0];
			drawTile(curTile, true);
			drawBuildings();
			drawRemainingText(stackTileArray.length, templeArrayLen, towerArrayLen, hutArrayLen);
			drawPlayerText();
			drawSettlementText();
			drawBuildingText();
		}
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
		var secondHex = new Hex(new Point(firstHex.center.x - (horz/2), firstHex.center.y + vert), getColor());
		var thirdHex = new Hex(new Point(firstHex.center.x + (horz/2), firstHex.center.y + vert), getColor());
		return new Tile(firstHex, secondHex, thirdHex);
	}
	
	// ok for now
	function getColor() {
		var color = colors[Math.floor(Math.random() * 6)];
		while (color == VOLCANOCOLOR) {
			color = colors[Math.floor(Math.random() * 6)];
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
	
		if (curTile.contains(mx, my)) {
			dragok = true;
			curTile.isDragging = true;
		}
		if (clickInBuilding(mx, my, curHut)) {
			dragok = true;
			curBuilding = 1;
			curHut.isDragging = true;
		}
		if (clickInBuilding(mx, my, curTemple)) {
			dragok = true;
			curBuilding = 2;
			curTemple.isDragging = true;
		}
		if (clickInBuilding(mx, my, curTower)) {
			dragok = true;
			curBuilding = 3;
			curTower.isDragging = true;
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
		return;
	}
	
	// working on
	function onMouseUp(e) {
		e.preventDefault();
		e.stopPropagation();
		
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
				//context.shadowColor = 'black';
				//context.shadowBlur = 4;
				//context.fillRect(0, 0, 200, 500);
				//drawPlayerText();
				if (ok[1] == 0) {
					drawOverlappingText();
				} else if (ok[1] == -2) {
					drawAdjacentText();
				} else if (ok[1] == -1) {
					drawWrongLevelsText();
				} else if (ok[1] == -3) {
					drawNotVolColorText();
				} else {
					drawSameDirectionText();
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
				context.fillRect(0, 0, 200, 500);
				boardTileArray.push(curTile);
		
				stackTileArray.shift();
				if (stackTileArray.length == 0) {
					noMoreTilesText();
					drawPlayerText();
					drawBuildingText();
					drawSettlementText();
					drawBuildings();
				} else {
					curTile = stackTileArray[0];
					drawTile(curTile, true);
					drawRemainingText(stackTileArray.length, templeArrayLen, towerArrayLen, hutArrayLen);
					drawPlayerText();
					drawBuildingText();
					drawSettlementText();
					drawBuildings();
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
					context.fillRect(0, 0, 200, 500);
					if (typeDrag == "to") {
						curTower.position = position;
						boardBuildingArray.push(curTower);
						if (settlements.length == 0) {
							context.clearRect(0, 0, 1000, 1000);
							context.shadowOffsetX = 0;
							context.shadowOffsetY = 0;
							context.shadowBlur = 0;
							drawGrid();
							drawTowerMustBeAddedToSettlementText();
						} else {
							add = isAddingToSettlement(position);
							if (add[0] == true) {
								if (!hasTower(settlements[add[1]])) {
									settlements[add[1]].push(curTower);
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
						towerArrayLen -= 1;
						if (towerArrayLen > 0) {
							curTower = new Building(new Point(20, 430), "purple", "tower");
						}
					} else if (typeDrag == "te") {
						curTemple.position = position;
						boardBuildingArray.push(curTemple);
						if (settlements.length == 0) {
							var settlement = [];
							settlement.push(curTemple);
							settlements.push(settlement);
						} else {
							add = isAddingToSettlement(position);
							if (add[0] == true) {
								settlements[add[1]].push(curTemple);
							} else {
								var settlement = [];
								settlement.push(curTemple);
								settlements.push(settlement);
							}
						}
						templeArrayLen -= 1;
						if (templeArrayLen > 0) {
							curTemple = new Building(new Point(20, 330), "purple", "temple");
						}
					} else {
						curHut.position = position;
						boardBuildingArray.push(curHut);
						if (settlements.length == 0) {
							var settlement = [];
							settlement.push(curHut);
							settlements.push(settlement);
						} else {
							add = isAddingToSettlement(position);
							if (add[0] == true) {
								settlements[add[1]].push(curHut);
							} else {
								var settlement = [];
								settlement.push(curHut);
								settlements.push(settlement);
							}
							
						}
						hutArrayLen -= 1;
						if (hutArrayLen > 0) {
							curHut = new Building(new Point(90, 230), "purple", "hut");
						}
					}
					drawTile(curTile, true);
					drawRemainingText(stackTileArray.length, templeArrayLen, towerArrayLen, hutArrayLen);
					drawPlayerText();
					drawBuildingText();
					drawSettlementText()
					drawBuildings();
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
	
	function hasTower(settlement) {
		for (var i = 0; i < settlement.length; i++) {
			var s = settlement[i];
			if (s.type == "tower") {
				return true;
			}
		}
		return false;
	}
	
	function getDistance(point1, point2) {
		return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
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
	
	// 0 = not on a field, 1 = on a volcano, 2 = tower not on lvl 3, 3 = tower field not empty, 4 = hut must be level 1 empty
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
				} 
				else {
					return [true, -1];
				}
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
	
	// returns t/f and the settlement index
	function isAddingToSettlement(position) {
		var row = position[0][0];
		var col = position[1][0];
		for (var i = 0; i < settlements.length; i++) {
			var s = settlements[i];
			for (var j = 0; j < s.length; j++) {
				var bRow = s[j].position[0];
				var bCol = s[j].position[1];
				if (bRow == row) {
					if (bCol == (col - 1) || bCol == (col + 1)) {
						return [true, i];
					}
				} else if (bRow == (row - 1)) {
					if (bCol == col || bCol == (col - 1)) {
						return [true, i];
					}
				}
				if (bRow == (row + 1)) {
					if (bCol == col || bCol == (col - 1)) {
						return [true, i];
					}
				}
			}	
		}
		return [false, -1];
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
		if (hutArrayLen > 0) {
			buildings.push(curHut);
		}
		if (templeArrayLen > 0) {
			buildings.push(curTemple);
		}
		if (towerArrayLen > 0) {
			buildings.push(curTower);
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
			context.fillRect(0, 0, 200, 500);
			drawPlayerText();
			drawBuildingText();
			drawRemainingText(stackTileArray.length, templeArrayLen, towerArrayLen, hutArrayLen);
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
		context.font = "18px Arial";
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
	function drawPlayerText() {
		context.font = "24px Arial";
		context.shadowOffsetX = 2;
		context.shadowOffsetY = 2;
		context.shadowColor = 'black';
		context.shadowBlur = 2;
		context.fillStyle = 'white';
		context.fillText("Player 1's Turn...", 10, 20);
	}
	
	function drawSettlementText() {
		context.font = "14px Arial";
		context.shadowOffsetX = 1;
		context.shadowOffsetY = 1;
		context.shadowBlur = 1;
		context.fillStyle = "white";
		context.fillText("current settlements: " + settlements.length, 10, 190);
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
		context.strokeText("Tile must be placed on equal levels.", 100, 300);
		context.fillText("Tile must be placed on equal levels.", 100, 300);
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

	Tile.prototype.contains = function(mx, my) {
		return clickInTile(mx, my);
	}
}

