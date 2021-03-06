//variables of the game
var travling = false;
var MISSILE;
var TXT;
var score = 0;
var LIVE;
var countLives = 5;
var BALL;
var BALLS; //for hold balls group

//IMPORTING LEVELS
var LevelCount;
var CurrentLevel;
var RemainingBalls;

var CC;
var T;


// initiate variables
var theGame = function(game){}
theGame.prototype = {
	create: function(){

		LevelCount = 0;
		T = -1;

		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		TXT = this.add.bitmapText(10,10,'myfonts',"Score: 0",24);
		TXT.tint = '0x00000';


		LIVE = this.add.bitmapText(10,10,'myfonts',"Lives: 5",24);
		LIVE.x = W-LIVE.width-5;
		LIVE.tint = '0x00000';

		//BALL = this.game.add.sprite(0,H*0.25,"MC");
		//BALL.scale.x = 0.6;
		//BALL.scale.y = 0.6;
		//BALL.anchor.set(0.5,0.5);
		//
		//BALL.HEALTH = 3; // ball has three health, will lost if missile hit 3 times
		//
		//BALL.moveLeft = function(){
		//	this.game.physics.arcade.moveToXY(BALL,0,H*0.25, 1,2000);
		//}
		//BALL.moveRight = function(){
		//	this.game.physics.arcade.moveToXY(BALL,W,H*0.4, 1,2000);
		//}

		MISSILE = this.game.add.sprite(W*0.5,H*0.7);
		MISSILE.anchor.set(0.5,0.5);

		//CREATE A CIRCULE
		var MC = game.add.graphics(0,0);
		MC.lineStyle(2,0xffffff,1);
		MC.beginFill(0xffffff,1);
		MC.drawCircle(0,0,20);
		MISSILE.addChildAt(MC,0);

		CC = Math.random() * 0xFFFFFF;
		console.log(CC);
		MISSILE.getChildAt(0).tint = CC;

		this.game.physics.arcade.enable(MISSILE);


		game.input.onTap.add(this.shoot,this);

		BALLS = game.add.group(); // initiate the ball group

		this.start();
	},
	update: function(){

		T--;
		if(T == 0){
			travling = false;
			MISSILE.y = H-30;
			MISSILE.alpha = 1;
			MISSILE.hit = false;

			BALLS.removeAll(true, true);
			LevelCount++;
			this.start();
		}

		if (Math.floor(Math.abs(MISSILE.x-this.game.input.x))>2 && travling == false){//l4
			MISSILE.x =Math.floor(this.game.input.x);
			MISSILE.y = H-30;
		}
		if(travling){
			MISSILE.y -=20;
			//console.log(MISSILE.y);
			if(MISSILE.body.y<0){ // missile reach the top

				if(MISSILE.hit == true){ // if missile hit the bass score should increment
					this.add_score();
				}
				else{
					this.reduce_live(); // if missile hit the bass live should decrement
				}
				travling = false;
				MISSILE.y = H-30; // set back to initial position
				MISSILE.alpha = 1; // set the visibility of the missile true
				MISSILE.hit=false; // reset the hit value

				CC = Math.random() * 0xffffff;
				MISSILE.getChildAt(0).tint = CC;
			}
		}

		if(BALLS.total>0){
			BALLS.forEach(this.Checkballs,this);//l4

			game.physics.arcade.overlap(MISSILE, BALLS, this.collisionHandler, null, this);
		}

	},
	render: function(){},

	add_score : function() {

		score++;
		TXT.text = "Score: "+score;
	},

	reduce_live: function(){
		countLives--;
		LIVE.text = "Lives: "+countLives;
	},

	
	shoot: function(){
		if(travling){
			return;
		}
		MISSILE.body.reset(this.game.input.x,this.game.input.y);
		MISSILE.body.velocity.x=0;
		travling = true;
		console.log("shoot");

	},
	collisionHandler: function(M,B){
		if(M.hit == true || B.HEALTH == 0){
			return;
		}
		M.hit = true;
		//B.tint = 0xfee10; // change the colour of the ball when hit the missile
		console.log(CC);


		M.alpha = 0; // set the visibility of the missile false

		B.HEALTH -= 1;

		B.getChildAt(2-B.HEALTH).tint = CC;  // change the colour of the ball when hit the missile

		if(B.HEALTH ==  0){
			remaining--;
		}
		if(remaining == 0){
			console.log("going to next level");
			T = 200; //waiting time

		}
		console.log("missile hit the ball");
	},

	start: function(){
		MISSILE.hit = false;
		//import level 1
		CurrentLevel = LEVELS[LevelCount];
		remaining = CurrentLevel.length;
		this.createBalls()
	},

	createBalls: function(){
		BALLS.enableBody = true;
		BALLS.physicsBodyType = Phaser.Physics.ARCAD

		// loop to create many balls

		BALLS.setAll('checkWorldBounds', false);
		BALLS.setAll('outOfBoundsKill', false);

		for(var i=0;i < CurrentLevel.length;i++){
			var BALL = BALLS.create(CurrentLevel[i].x,CurrentLevel[i].y);

			//BALL.scale.x = 0.6;
			//BALL.scale.y = 0.6;
			BALL.anchor.set(0.5,0.5);

			BALL.HEALTH = 3; // ball has three health, will lost if missile hit 3 times

			BALL.xi = CurrentLevel[i].x;
			BALL.yi =CurrentLevel[i].y;

			BALL.xf = CurrentLevel[i].xf;
			BALL.yf = CurrentLevel[i].yf;

			BALL.speed = CurrentLevel[i].speed;

			BALL.moveLeft = function(){
				this.game.physics.arcade.moveToXY(this,this.xi,this.yi, 1,this.speed);
			}
			BALL.moveRight = function(){
				this.game.physics.arcade.moveToXY(this,this.xf,this.yf, 1,this.speed);
			}

			//crate circules
			for(var k=1;k < 4;k++){
				var circule = game.add.graphics(0,0);
				circule.lineStyle(2,0xffffff,1);
				circule.beginFill(0xffffff,1);

				circule.drawCircle(0,0,k*24);
				BALL.addChildAt(circule,0);

			}
		}
	},

	Checkballs: function(B){

		if(B.x >= W){
			B.moveLeft();
		}
		if(B.x <= 0){
			B.moveRight();
		}
	}


}



