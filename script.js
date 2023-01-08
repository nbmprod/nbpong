//--------------------VARIABLES--------------------

const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

//grid size
const grid = 15;

//paddle height
const paddleHeight = grid * 5; //80

//max Y for paddle
const maxPaddleY = canvas.height - grid - paddleHeight;

//speed
let paddleSpeed = 6;
let ballSpeed = 5;

//score
let leftScore = 0;
let rightScore = 0;

//--------------------PADDLES AND BALL--------------------

const leftPaddle = {
    x: grid * 2,
    y: canvas.height / 2 - paddleHeight / 2,
    width: grid,
    height: paddleHeight,
    dy: 0,
};

const rightPaddle = {
    x: canvas.width - grid * 3,
    y: canvas.height / 2 - paddleHeight / 2,
    width: grid,
    height: paddleHeight,
    dy: 0
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: grid,
    height: grid,
    resetting: false,
    dx: ballSpeed,
    dy: -ballSpeed
};

//--------------------COLLISIONS--------------------

function collides(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
  }

//--------------------MAIN LOOP--------------------

function loop() {
    //clear the field
    requestAnimationFrame(loop);
    context.clearRect(0,0,canvas.width,canvas.height);
    
    //general moving
    leftPaddle.y += leftPaddle.dy;
    rightPaddle.y += rightPaddle.dy;

    //limit Y moving
    if (leftPaddle.y < grid) {
        leftPaddle.y = grid;
    } 
    else if (leftPaddle.y > maxPaddleY) {
        leftPaddle.y = maxPaddleY;
      }
    
    if (rightPaddle.y < grid) {
        rightPaddle.y = grid;
    }
    else if (rightPaddle.y > maxPaddleY) {
        rightPaddle.y = maxPaddleY;
      }

    //left paddle draw
    context.fillStyle = 'red';
    context.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    
     //right paddle draw
    context.fillStyle = 'blue';
    context.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);
    
    //general ball moving
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    //ball walls collision
    if (ball.y < grid) {
        ball.y = grid;
        ball.dy *= -1;
      }

    else if (ball.y + grid > canvas.height - grid) {
      ball.y = canvas.height - grid * 2;
      ball.dy *= -1;
    }

    //score detecting
    if ( (ball.x < 0) && !ball.resetting) {
        ball.resetting = true;
        rightScore++;
        setTimeout(() => {
            ball.resetting = false;
            ball.x = canvas.width / 2;
            ball.y = canvas.height / 2;
        }, 1000);
    }

    else if ( (ball.x > canvas.width) && !ball.resetting) {
        ball.resetting = true;
        leftScore++;
        setTimeout(() => {
            ball.resetting = false;
            ball.x = canvas.width / 2;
            ball.y = canvas.height / 2;
        }, 1000);
    }

    //paddles collision
    if (collides(ball, leftPaddle)) {
        ball.dx *= -1;
        ball.x = leftPaddle.x + leftPaddle.width;
    }
    else if (collides(ball, rightPaddle)) {
        ball.dx *= -1;
        ball.x = rightPaddle.x - ball.width;
    }

    //draw a ball
    context.fillStyle = 'yellow';
    context.fillRect(ball.x, ball.y, ball.width, ball.height);

    //draw walls
    context.fillStyle = 'lightgrey';
    context.fillRect(0, 0, canvas.width, grid);
    context.fillRect(0, canvas.height - grid, canvas.width, canvas.height);

    //draw middle wall
    for (let i = grid; i < canvas.height - grid; i += grid * 2) {
        context.fillRect(canvas.width / 2 - grid / 2, i, grid, grid);
    }

    //draw left score
    context.font = "60px IBM Plex Mono";
    context.globalAlpha = 0.5;
    context.fillText(leftScore, canvas.width/2 - (grid * 6), canvas.height / 6);
    context.globalAlpha = 1;

    //draw right score
    context.font = "60px IBM Plex Mono";
    context.globalAlpha = 0.5;
    context.fillText(rightScore, canvas.width/2 + (grid * 3.4), canvas.height / 6);
    context.globalAlpha = 1;

    //key press listener
    document.addEventListener('keydown', function (e) {
        // Если нажата клавиша вверх,
        if (e.which === 38) {
          // то двигаем правую платформу вверх
          rightPaddle.dy = -paddleSpeed;
        }
        // Если нажата клавиша вниз,
        else if (e.which === 40) {
          // то двигаем правую платформу вниз
          rightPaddle.dy = paddleSpeed;
        }
        // Если нажата клавиша W,
        if (e.which === 87) {
          // то двигаем левую платформу вверх
          leftPaddle.dy = -paddleSpeed;
        }
        // Если нажата клавиша S,
        else if (e.which === 83) {
          // то двигаем левую платформу вниз
          leftPaddle.dy = paddleSpeed;
        }
      });

    document.addEventListener('keyup', function (e) {
        if (e.which === 38 || e.which === 40) {
          rightPaddle.dy = 0;
        }
        if (e.which === 83 || e.which === 87) {
          leftPaddle.dy = 0;
        }
      });

    //endgame
    if (leftScore === 7) {
        alert('Red wins!');
        let againButton = confirm('Wanna play again?');
        if (againButton){
            leftScore = 0;
            rightScore = 0;
            location.reload();
        } else {
            window.close();
            }
    }
        
    else if (rightScore === 7) {
        alert('Blue wins!')
        let againButton = confirm('Wanna play again?');
            if (againButton){
                leftScore = 0;
                rightScore = 0;
                location.reload();
            }   else {
                window.close();
        }
    }
}

requestAnimationFrame(loop);


