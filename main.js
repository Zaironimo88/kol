
/*creado por prashant shukla */

var paddle2 =10,paddle1=10;

var paddle1X = 10,paddle1Height = 110;
var paddle2Y = 685,paddle2Height = 70;

var score1 = 0, score2 =0;
var paddle1Y;

var  playerscore =0;
var audio1;
var pcscore =0;
//pelota x, y, y la velocidad speedx, y y radio
var ball = {
    x:350/2,
    y:480/2,
    r:20,
    dx:3,
    dy:3
}

rightWristY = 0;
rightWristX = 0;
scoreRightWrist = 0;

game_status ="";

function preload()
{
ball_touch_paddel = loadSound("ball_touch_paddel.wav");
missed = loadSound("missed.wav");
}
function setup(){
  var canvas =  createCanvas(700,600);
  canvas.parent("canvas");
  video=videoCapture(VIDEO);
  video.size(700,600);
  video.hide();
  poseNet = ml5.poseNet(video, modeLoaded);
  poseNet.on('pose', gotPoses);
}
function modeLoaded()
{
console.log("modelo cargado");
}

function gotPoses(results)
{
if(results.length > 0)
  {
  rightWristX = results[0].pose.rightWrist.x;
  rightWristY = results[0].pose.rightWrist.y;
  scoreRightWrist = results[0].pose.keypoints[10].score;
  console.log(scoreRightWrist);
  }
}

function startGame()
{
game_status = "start";
document.getElementById("status").innerHTML = "el juego esta cargando"
}

function draw(){

  if(game_status == "start")
    {
    
    
 background(0);

 image(video, 0, 0, 700, 600);

 fill("black");
 stroke("black");
 rect(680,0,20,700);

 fill("black");
 stroke("black");
 rect(0,0,20,700);

 if(scoreRightWrist > 0.2)
  {
  fill("red");
  stroke("red")
  circule(rightWristX, rightWristY, 30);
  }
 
   //llamar función paddleInCanvas  
   paddleInCanvas();
 
   //paleta izquierda
   fill(250,0,0);
    stroke(0,0,250);
    strokeWeight(0.5);
   paddle1Y = mouseY; 
   rect(paddle1X,paddle1Y,paddle1,paddle1Height,100);
   
   
    //paleta de la computadora
    fill("#FFA500");
    stroke("#FFA500");
   var paddle2y =ball.y-paddle2Height/2;  rect(paddle2Y,paddle2y,paddle2,paddle2Height,100);
    
    //llamar a la función midline 
    midline();
    
    //llamar a la función drawScore  
   drawScore();
   
   //llamar a la función models   
   models();
   
   //llamar a la función move que es muy importante
    move();
}
}



//la función reset cuando la pelota no haga contacto con la paleta
function reset(){
   ball.x = width/2+100,
   ball.y = height/2+100;
   ball.dx=3;
   ball.dy =3;
   
}


//la función midline dibuja una línea en el centro
function midline(){
    for(i=0;i<480;i+=10) {
    var y = 0;
    fill("white");
    stroke(0);
    rect(width/2,y+i,10,480);
    }
}


//la función drawScore muestra la puntuación
function drawScore(){
    textAlign(CENTER);
    textSize(20);
    fill("white");
    stroke(250,0,0)
    text("Jugador:",100,50)
    text(playerscore,140,50);
    text("Computadora:",500,50)
    text(pcscore,555,50)
}


//una función muy importante de este juego
function move(){
   fill(50,350,0);
   stroke(255,0,0);
   strokeWeight(0.5);
   ellipse(ball.x,ball.y,ball.r,20)
   ball.x = ball.x + ball.dx;
   ball.y = ball.y + ball.dy;
   if(ball.x+ball.r>width-ball.r/2){
       ball.dx=-ball.dx-0.5;       
   }
  if (ball.x-2.5*ball.r/2< 0){
  if (ball.y >= paddle1Y&& ball.y <= paddle1Y + paddle1Height) {
    ball.dx = -ball.dx+0.5;
    playerscore++;
  }
  else{
    pcscore++;
    reset();
    navigator.vibrate(100);
  }
}
if(pcscore ==4){
    fill("#FFA500");
    stroke(0)
    rect(0,0,width,height-1);
    fill("white");
    stroke("white");
    textSize(25)
    text("¡Fin del juego!☹☹",width/2,height/2);
    text("¡Volver a cargar la página!",width/2,height/2+30)
    noLoop();
    pcscore = 0;
}
   if(ball.y+ball.r > height || ball.y-ball.r <0){
       ball.dy =- ball.dy;
   }   
}


//ancho altura del canvas velocidad de la pelota 
function models(){
    textSize(18);
    fill(255);
    noStroke();
    text("Ancho:"+width,135,15);
    text("Velocidad:"+abs(ball.dx),50,15);
    text("Altura:"+height,235,15)
}


//esta función ayuda a que la paleta no salga del canvas
function paddleInCanvas(){
  if(mouseY+paddle1Height > height){
    mouseY=height-paddle1Height;
  }
  if(mouseY < 0){
    mouseY =0;
  }  
}
