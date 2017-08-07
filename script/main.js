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
		case 'l':
			doThing();
			break;
	}
}

function doThing(){
	console.log("invader: ",invaders.length,"shots ", shots.length);
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
	if(!this.previousTime){
		this.previousTime=thisTickTime;
		return;
	}
	var elapsedSec=(thisTickTime-this.previousTime)/1000;
	animateShip(elapsedSec);
	animateShots(elapsedSec);
	animateInvaders(elapsedSec);
	checkForCollisions();
	removeStaleShots();
	removeStaleInvaders();
	checkForVictory();
	this.previousTime=thisTickTime;
}

function shoot(){
	var newShot=document.createElement('div');
	newShot.classList.add('shot');
	newShot.innerHTML='|';
	document.body.appendChild(newShot);
	newShot.style.left=String(getElementLeft(ship))+'px';
	newShot.style.top=String(getElementTop(ship)-ship.offsetHeight)+'px'; // TODO not quite right
	shots.push(newShot);
}

function checkForVictory(){
	if(invaders.length<1){
		var text=document.createElement('div');
		text.classList.add('victory');
		text.innerHTML='CONGRATULATIONS YOU HAVE SAVED THE PRINCESS';
		document.body.appendChild(text);
		clearInterval(tickTimer);
	}
}

function animateShip(elapsedSec){
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
		var proposedRight=getElementRight(ship)-delta;
		var proposedLeft=getElementLeft(ship)+delta;
		if(proposedRight<0){
			ship.style.left=null;
			ship.style.right='0px';
		} else {
			ship.style.right=null;
			ship.style.left=String(Math.max(0,proposedLeft))+'px';
		}
	}
}

function animateShots(elapsedSec){
	for(i=0;i<shots.length;++i){ // TODO shots.foreach?
		if(getElementTop(shots[i])<0){ // TODO let it go off 
			shots[i].parentNode.removeChild(shots[i]);
			shots.splice(i,1);
		}else{
			shots[i].style.top=String(getElementTop(shots[i])-elapsedSec*shotSpeedPixelsPerSec)+'px';
		}
	}
}

function animateInvaders(elapsedSec){
	if(isNaN(this.time)){
		this.time=0;
	}
	this.time+=elapsedSec;
	if(this.time>1){
		this.time-=1;
//		console.log("Animate!");
	}
}

function checkForCollisions(){
	for(i=0;i<shots.length;++i){ // TODO shots.foreach?
		for(j=0;j<invaders.length;++j){
			if(overlap(shots[i],invaders[j])){
				shots[i].style.display='none';
				invaders[j].style.display='none';
				// TODO add a HTML5 canvas and use it to draw fancy particle explosions
				addPoints(invaders[j].pointValue);
			}
		}
	}
}

function addPoints(points){
	var newScore=parseInt(score.innerHTML)+points;
	score.innerHTML='0'.repeat(Math.max(0,6-String(newScore).length)) + String(parseInt(score.innerHTML)+points);
}

function removeStaleShots(){
	for(i=0;i<shots.length;++i){ // TODO shots.foreach?
		if(shots[i].style.display=='none'){
			shots[i].parentNode.removeChild(shots[i]);
			shots.splice(i,1);
		}
	}
}

function removeStaleInvaders(){
	for(j=0;j<invaders.length;++j){
		if(invaders[j].style.display=='none'){
			invaders[j].parentNode.removeChild(invaders[j]);
			invaders.splice(j,1);
		}
	}
}

function getElementLeft(element){
	return parseFloat(document.defaultView.getComputedStyle(element).left);
}

function getElementRight(element){
	return parseFloat(document.defaultView.getComputedStyle(element).right);
}

function getElementTop(element){
	return parseFloat(document.defaultView.getComputedStyle(element).top);
}

function getElementBottom(element){
	return parseFloat(document.defaultView.getComputedStyle(element).bottom);
}

function createInvaders(){
	for(i=1;i<=12;++i){ // TODO better positioning
		createInvader(10,i*50,50);
		createInvader(5,i*50,100);
		createInvader(5,i*50,150);
		createInvader(1,i*50,200);
		createInvader(1,i*50,250);
	}
}

function createInvader(pointValue, posX, posY){
	var invader=document.createElement('div');
	invader.classList.add('invader');
	invader.innerHTML='$';
	invader.style.left=String(posX)+'px';
	invader.style.top=String(posY)+'px';
	invader.pointValue=pointValue;
	document.body.appendChild(invader);
	invaders.push(invader);
}

function createShip(){
	ship=document.createElement('div');
	ship.classList.add('ship');
	ship.innerHTML='X';
	ship.style.left='50%';
	ship.style.bottom='40px';
	document.body.appendChild(ship);
}

function createScore(){
	score=document.createElement('div');
	score.classList.add('score');
	score.innerHTML='000000';
	document.body.appendChild(score);
}

function onload(e){ // TODO more appropriately, "gameStart". onload should call gameStart.
	document.onkeydown=onkeydown;
	document.onkeyup=onkeyup;
	tickTimer=setInterval(tick,tickInterval);
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
