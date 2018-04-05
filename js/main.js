var ctx = document.getElementById("ctx").getContext("2d");

//setting properties use = sign for assigning
ctx.font = "30px Aerial";

var touchZone;

var HEIGHT;
var WIDTH;

var mouseX;
var mouseY;

var enemyList;
var pointBox;
var shield;
var hasShield = false;
var shieldWithPlayer = false;
var stealthMode = 100;
var frameCount = 0;
var score = 0;
var notOut = true;
var startLoop;

function start() {
    touchZone = document.getElementById("ctx");
    touchZone.addEventListener('touchmove',setCoordinates,false);
    touchZone.addEventListener('touchend',endGame,false);
    touchZone.width = window.innerWidth;
    touchZone.height = window.innerHeight;

    HEIGHT = window.innerHeight;//600
    WIDTH = window.innerWidth;//1000

    removeHeader();

    newGame();
    startLoop = setInterval(update,25);
    notOut = true;
}

function endGame() {
    if(notOut){
        console.log('GAME END!................'+score);
        touchZone.width = 0;
        touchZone.height = 0;
        addHeader();
        notOut = false;
        clearInterval(startLoop);
    }
}
function getScore() {
    var val =  window.location.href;
    return (val.substring(val.indexOf('value=')+6)-23);
}

function addHeader() {
    var elem = document.createElement("headPart");
    var text = "whatsapp://send?text=I Challenge you to beat my Score in Dashboard Game! Follow the link below http://orulab.com/games/dashboard/html/main.html?value=";
    var text1 = "data-action=\"share/whatsapp/share\"";
    var link = "<a href=\"whatsapp://send?text=I Challenge you to beat my Score in Dashboard Game! Follow the " +
        "link below http://orulab.com/games/dashboard/html/main.html?value="+(score+23)+"\""+
        "        ' data-action=\"share/whatsapp/share\">";
    elem.innerHTML = '<div id="headPart">\n' +
        '        <p align="center" class="a1">\n' +
        '            DASHBOARD\n' +
        '            <br><br>\n' +
        '            <button type="button" class="button" onclick="start()">play</button>\n' +
        '        </p>\n' +
        '        <p align="center" class="a2">' +
        '            OPPONENT SCORE:' +getScore()+
        '            <br><br>' +
        '            SCORE:\n' +score+
        '        <br>' +link+
        '<br>Challenge via Whatsapp' +
        '<img src="../resource/whatsapp.png" style="width: 10%;height: 10%;">' +
        '</a>' +
        '</p>\n' +
        ' <br>\n' +
        '        <p>\n' +
        '            <h1 align="center">INSTRUCTIONS</h1>\n' +
        '            <h2 align="center">1) Catch the Orage/Yellow Blocks</h2>\n' +
        '            <h2 align="center">2) Catch the Shield -- Rectangular Box</h2>\n' +
        '            <h2 align="center">3) Avoid the Red Blocks</h2>' +
        '            <h2 align="center">4) Don\'t Lift the Finger</h2> \n' +
        '        </p>   </div>';
    document.getElementById("overHead").appendChild(elem);
}

function removeHeader() {
    var elem = document.getElementById("headPart");
    elem.parentNode.removeChild(elem);
    return false;
}

var player = {
    x:0,
    y:0,
    width:20,
    height:20
};

function setCoordinates() {
    mouseX = event.touches[0].pageX - touchZone.getBoundingClientRect().left;
    mouseY = event.touches[0].pageY - touchZone.getBoundingClientRect().top;

    if(mouseX < player.width)
        mouseX = player.width/2;
    if(mouseY < player.height)
        mouseY = player.height/2;
    if(mouseX > WIDTH)
        mouseX = WIDTH-player.width;
    if(mouseY > HEIGHT)
        mouseY = HEIGHT-player.height;
}


function newGame() {
    frameCount = 0;
    score = 0;
    enemyList = {};
    hasShield = false;
    shieldWithPlayer = false;
    stealthMode = 100;

    createRandomEnemy();
    createRandomEnemy();
    createRandomEnemy();

    pointBox = createRandomPoints();

}

function createRandomPoints() {
    var point = {
        x:Math.random()*(WIDTH-45),
        y:Math.random()*(HEIGHT-45),
        xSpd:0,
        ySpd:0,
        width:45,
        height:45,
        color:"orange"
    };

    return point;
}

function createRandomEnemy() {
    var enemy = {
        x:Math.random()*WIDTH,
        y:Math.random()*HEIGHT,
        xSpd:Math.random()*15,
        ySpd:Math.random()*15,
        width:Math.random()*40+10,
        height:Math.random()*40+10,
        color:"red",
        id:Math.random()
    };
    enemyList[enemy.id] = enemy;
}

/**This function is the frame*/
function update() {

    ctx.clearRect(0,0,WIDTH,HEIGHT);
    frameCount++;
    if(frameCount%160 === 0) {
        createRandomEnemy();
        frameCount = 0;
        if(!hasShield){
            shield = createRandomPoints();
            hasShield = true;
        }
    }
    updatePlayer();
    for(var key in enemyList){
        updateEnemy(enemyList[key]);
        if(isColloiding(enemyList[key])){
            if(hasShield && shieldWithPlayer){
                hasShield = false;
                shieldWithPlayer = false;
                stealthMode = 0;
            }else if(stealthMode > 50){
                endGame();
                break;
            }
        }
        stealthMode++;
    }
    updatePointBox();
    updateShield();

}

function updatePlayer() {
    drawPlayer(player);

}

function updateEnemy(enemy) {
    drawEntity(enemy);
}

function updatePointBox() {
    if(isColloiding(pointBox)){
        score++;
        pointBox = createRandomPoints();
    }
    drawEntity(pointBox);
}

function updateShield() {
    if(hasShield && (!shieldWithPlayer)){
        drawShield(shield);
        if(isColloiding(shield)){
            shieldWithPlayer = true;
        }
    }
    if(hasShield){
        updateShieldPos();
    }
}

function updateShieldPos() {

    if(shieldWithPlayer){
        drawShieldWithPlayer();
    }
}

function drawShieldWithPlayer() {
    ctx.strokeRect(player.x - 10 , player.y-10,player.width+20,player.height+20);
}
function drawPlayer(player) {
    player.x = mouseX;
    player.y = mouseY;
    ctx.fillStyle = "green";
    ctx.fillRect(player.x,player.y,player.width,player.height);
}

function drawShield(shield) {
    ctx.lineWidth = "4";
    ctx.strokeStyle = "black";
    ctx.strokeRect(shield.x,shield.y,shield.width,shield.height);

}

function drawEntity(something) {

    if (something.x >= WIDTH-something.width || something.x <= 0)
        something.xSpd = -something.xSpd;
    if (something.y >= HEIGHT-something.height || something.y <= 0)
        something.ySpd = -something.ySpd;

    something.x += something.xSpd;
    something.y += something.ySpd;
    ctx.fillStyle = something.color;
    ctx.fillRect(something.x,something.y,something.width,something.height);
}

function isColloiding(entity) {
    if(((player.x > entity.x && player.x < entity.x+entity.width )&& ((player.y+player.width)>entity.y &&(player.y+player.width)<=(entity.y+entity.width))
           ||
            ((player.x+player.width)>=entity.x && (player.x+player.width)<=(entity.x+entity.width)))
        &&(player.y > entity.y && player.y < entity.y+entity.height)){
        return true;
    }
    return false;
}