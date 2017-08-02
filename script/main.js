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
			if(!shooting){ // TODO may need to cap number of shots
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
		ship.style.left=String(Math.min(document.body.clientWidth-ship.offsetWidth,getElementLeft(ship)))+'px'; // TODO not quite right
	}
	for(i=0;i<shots.length;++i){ // TODO shots.foreach?
		if(shots[i].style.display=='none'){
			shots[i].parentNode.removeChild(shots[i]);
			shots.splice(i,1);
		}else{
			animateShot(elapsedSec, shots[i]);
		}
	}

	for(i=0;i<shots.length;++i){ // TODO shots.foreach?
		for(j=0;j<invaders.length;++j){
			if(overlap(shots[i],invaders[j])){
				shots[i].style.display='none';
				invaders[j].style.display='none'; // TODO add a HTML5 canvas and use it to draw fancy particle explosions
			}
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
	newShot.style.top=String(getElementTop(ship)-ship.offsetHeight)+'px'; // TODO not quite right

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

function createInvaders(){
	for(i=1;i<=12;++i){
		for(j=1;j<=5;++j){
			var newInvader=document.createElement('div');
			newInvader.classList.add('invader');
			var text=document.createTextNode("$");
			newInvader.appendChild(text);
			document.body.appendChild(newInvader);
			newInvader.style.left=String(i*50)+'px'; // TODO center this
			newInvader.style.top=String(j*50)+'px';
			invaders.push(newInvader);
		}
	}
}

function createShip(){
	ship=document.createElement('div');
	ship.classList.add('ship');
	var text=document.createTextNode("X");
	ship.appendChild(text);
	ship.style.left='50%';
	ship.style.bottom='40px';
	document.body.appendChild(ship);
}

function createScore(){
	score=document.createElement('div');
	score.classList.add('score');
	var text=document.createTextNode("000000");
	score.style.left='20px';
	score.style.top='20px';
	score.appendChild(text);
	document.body.appendChild(score);
}

function onload(e){
	document.onkeydown=onkeydown;
	document.onkeyup=onkeyup;
	tick.previousTime=Date.now();
	tickTimer=setInterval(tick,tickInterval); // TODO null this on game over
	createInvaders();
	createShip();
	createScore();
}

function overlap(a,b){
	var rectA=a.getBoundingClientRect();
	var rectB=b.getBoundingClientRect();
	return !(rectA.right < rectB.left || 
		rectA.left > rectB.right || 
 		rectA.bottom < rectB.top || 
		rectA.top > rectB.bottom);
}

// TODO make this all OO with these globals instead members of a singleton GameState class
var tickTimer;

// Elements
var ship;
var score;

// States
var shooting=0;
var moveright=0;
var moveleft=0;
var shots=[]; // holds HTML shot elements
var invaders=[]; // holds HTML invader elements

// Configurables
var tickInterval=10;
var shipSpeedPixelsPerSec=150;
var shotSpeedPixelsPerSec=450;

window.addEventListener('load',onload);
