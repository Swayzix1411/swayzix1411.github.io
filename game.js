
// Canvas créé

var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
document.body.appendChild(canvas);
function adjustCanvasSize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}
window.addEventListener('resize',adjustCanvasSize())

// Image d'arrière plan

var bgReady=false;
var bgImage= new Image();
bgImage.onload= function() {
    bgReady=true;
};
bgImage.src="images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Monster2 image
var monster2Ready = false;
var monster2Image = new Image();
monster2Image.onload = function () {
    monster2Ready = true;
};
monster2Image.src = "images/monster2.png";

// Objets du jeu (personnages)

var hero = {
    speed: 350,  //mouvement pixel par secondes
    x:0,
    y:0
};
var monster = {
    x:0,
    y:0
};
var monster2 = {
    x: 0,
    y: 0
};

var nbreMonstre=0;
var monstersCaught=0;
var monstersShow=0

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const nbmonster= urlParams.get('nbremonstre');

nbreMonstre=nbmonster;

//touches clavier

var keysDown= {};

addEventListener("keydown",function(e) {
    keysDown[e.keyCode]=true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
},false);

// Recommencer le jeu quand le joueur attrape le monstre

function reset() {
   		if (monstersShow == 0 || monstersCaught == 0){
		hero.x = canvas.width / 2;
        hero.y = canvas.height / 2;

        // Déplacer les monstres aléatoirement sur l'écran
        
		let treeSize = 32;

		if (nbreMonstre == 1){
        monster.x = treeSize + (Math.random() * (canvas.width - (treeSize * 2)));
        monster.y = treeSize + (Math.random() * (canvas.height - (treeSize * 2)));
		monstersShow =1;
	} else if (nbreMonstre=2){
        // Réinitialiser le deuxième monstre de la même manière
        monster.x = treeSize + (Math.random() * (canvas.width - (treeSize * 2)));
        monster.y = treeSize + (Math.random() * (canvas.height - (treeSize * 2)));
		monster2.x = treeSize + (Math.random() * (canvas.width - (treeSize * 2)));
        monster2.y = treeSize + (Math.random() * (canvas.height - (treeSize * 2)));

		monstersShow =2;
		}
	}
}

// mettre a jour les objets du jeu

var update = function (modifier) {
	if (38 in keysDown && hero.y > 0) { // joueur vers le haut
        hero.y -= hero.speed * modifier;
	}
	if (40 in keysDown && hero.y < canvas.height-64) { // joueur vers le bas
		hero.y += hero.speed * modifier;
	}
	if (37 in keysDown && hero.x >0) { // joueur vers la gauche
		hero.x -= hero.speed * modifier;
	}
	if (39 in keysDown && hero.x < canvas.width-64) { // joueur vers la droite
		hero.x += hero.speed * modifier;	
	}



    // Est-ce qu'ils touchent ?
    if (
        nbreMonstre == 1
		&& hero.x <= (monster.x + 32)
        && monster.x <= (hero.x + 32)
        && hero.y <= (monster.y + 32)
        && monster.y <= (hero.y + 32)
    ) {
        ++monstersCaught;
		--monstersShow;
		monster.x = -100; 
    	monster.y = -100;
        reset();
    } else if (
		nbreMonstre ==2
		&& hero.x <= (monster2.x + 32)
		&& monster2.x <= (hero.x + 32)
		&& hero.y <= (monster2.y + 32)
		&& monster2.y <= (hero.y + 32)
	
		
		
	) {
		++monstersCaught;
		--monstersShow;
		monster2.x = -100;
		monster2.y = -100;

		reset();
	} if ( 
		nbreMonstre== 2
		&& hero.x <= (monster.x + 32)
        && monster.x <= (hero.x + 32)
        && hero.y <= (monster.y + 32)
        && monster.y <= (hero.y + 32)
	){
        ++monstersCaught;
		--monstersShow;
		monster.x = -100; 
    	monster.y = -100;
        reset();
    }
};


// Tout dessiner

var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady && nbreMonstre==1 || nbreMonstre==2) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}
	
	if (monster2Ready && nbreMonstre ==2){ 
		ctx.drawImage(monster2Image, monster2.x, monster2.y);
	}
	

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Goblins caught: " + monstersCaught, 64, 32);
	
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "right";
	ctx.textBaseline = "top";
	ctx.fillText("Goblins remaining: " + monstersShow, canvas.width-70, 32 );


};

// Boucle principale du jeu
var main=function () {
    var now=Date.now();
    var delta=now - then;


    update(delta/1000);
    render();

    then=now

    // demander à recommencer dès que possible
    requestAnimationFrame(main);
};

var w=window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Jouons à ce jeu!
var then=Date.now();
reset();
main();

