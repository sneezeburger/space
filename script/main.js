function onkeydown(e){
	switch(e.key){ // TODO more efficient to check keycode?
		case 'ArrowRight':
			moveright=1;
			break;
		case 'ArrowLeft':
			moveleft=1;
			break;
		case ' ':
		case 'ArrowUp':
			if(!shooting){
				shooting=1;
				shoot();
			}
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
		case ' ':
		case 'ArrowUp':
			shooting=0;
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
		ship.style.left=String(Math.max(0,getElementLeft(ship)+delta))+'px';
	}
	for(i=0;i<shots.length;i++){
		if(shots[i].style.display=='none'){
			shots[i].parentNode.removeChild(shots[i]);
			shots.splice(i,1);
		}else{
			animateShot(elapsedSec, shots[i]);
		}
	}
	this.previousTime=thisTickTime;
}

function shoot(){
	var newShot=document.createElement('div');
	newShot.classList.add('shot');
	var text=document.createTextNode("|");
	newShot.appendChild(text);
	document.body.appendChild(newShot);
	newShot.style.left=String(getElementLeft(ship))+'px';
	newShot.style.top=String(getElementTop(ship))+'px';
	shots.push(newShot);
}

function animateShot(elapsedSec, shot){
	if(getElementTop(shot)<1){
		shot.style.display='none';
	}else{
		shot.style.top=String(getElementTop(shot)-elapsedSec*shotSpeedPixelsPerSec)+'px';
	}
}

function getElementLeft(element){
	return parseFloat(document.defaultView.getComputedStyle(element).left);
}

function getElementTop(element){
	return parseFloat(document.defaultView.getComputedStyle(element).top);
}

document.onkeydown=onkeydown;
document.onkeyup=onkeyup;
document.onload=function(e){ // TODO why isn't this working
	tick.previousTime=Date.now();
	console.log('window.onload via anonymous fn',e,Date.now());
}
// Elements
var ship=document.getElementById("ship");
var score=document.getElementById("score");

// States
var shooting=0;
var moveright=0;
var moveleft=0;
var shots=[]; // holds HTML shot elements

// Configurables
var tickInterval=10;
var shipSpeedPixelsPerSec=150;
var shotSpeedPixelsPerSec=450;

var tickTimer=setInterval(tick,tickInterval); // TODO null this on game over
