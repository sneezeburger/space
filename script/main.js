function onkeydown(e){
	switch(e.key){
		case 'ArrowRight':
			moveright=1;
			break;
		case 'ArrowLeft':
			moveleft=1;
			break;
		case ' ':
		case 'ArrowUp':
			shoot();
			break;
	}
}

function onkeyup(e){
	switch(e.key){
		case 'ArrowRight':
			moveright=0;
			break;
		case 'ArrowLeft':
			moveleft=0;
			break;
	}
}

function tick(){
	var thisTickTime=Date.now();
	var elapsedSec=(thisTickTime-this.previousTime)/1000;
	var delta=0;
	if(moveright){
		ship.style.color='blue';
		delta=shipSpeedPixelsPerSec*elapsedSec;
	}
	if(moveleft){
		ship.style.color='green';
		delta=-shipSpeedPixelsPerSec*elapsedSec;
	}
	if(delta){
		left=Math.max(0,left+delta);
		ship.style.left=String(left)+'px';
	}
	animateShot(elapsedSec);
	this.previousTime=thisTickTime;
}

function shoot(){
	shot.style.display='inline';
	shot.style.left=String(left)+'px';
	shotTop=parseInt(document.defaultView.getComputedStyle(ship).top);
	shot.style.top=String(shotTop)+'px';
}

function animateShot(elapsedSec){
	shotTop-=shotSpeedPixelsPerSec*elapsedSec;
	if(shotTop<1){
		shot.style.display='none';
	}else{
		shot.style.top=String(shotTop)+'px';
	}
}

document.onkeydown=onkeydown;
document.onkeyup=onkeyup;
document.onload=onload; // TODO WTF
document.onload=function(e){ // TODO why isn't this working
	tick.previousTime=Date.now();
	console.log('window.onload via anonymous fn',e,Date.now());
}
var ship=document.getElementById("ship");
var shot=document.getElementById("shot");
var score=document.getElementById("score");
var left=parseInt(document.defaultView.getComputedStyle(ship).left);
var shotTop=parseInt(document.defaultView.getComputedStyle(ship).top);
var moveright=0;
var moveleft=0;
var tickInterval=10;
var shipSpeedPixelsPerSec=150;
var shotSpeedPixelsPerSec=450;
var tickTimer=setInterval(tick,tickInterval); // TODO null this on game over
