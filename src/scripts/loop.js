import { canvas } from '../../script.js';
import { context } from '../../script.js';
import { grid } from '../../script.js';
import { paddleHeight } from '../../script.js';
import { maxPaddleY } from '../../script.js';
import { paddleSpeed } from '../../script.js';
import { ballSpeed } from '../../script.js';
import { leftScore } from '../../script.js';
import { rightScore } from '../../script.js';
import { red } from '../../script.js';
import { blue } from '../../script.js';
import { upText } from '../../script.js';
import { playCollisionSFX } from '../../script.js';
import { playPaddleSFX } from '../../script.js';
import { playScoreLeftSFX } from '../../script.js';
import { playScoreRightSFX } from '../../script.js';
import { playWinSFX } from '../../script.js';
import { leftPaddle } from '../../script.js';
import { rightPaddle } from '../../script.js';
import { ball } from '../../script.js';
import { AILogic } from './aiLogic.js';
import { collides } from './collision.js';


export default function loop() {
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
    
    //run AI
    AILogic()
    
    //left paddle draw
    context.fillStyle = red;
    context.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    
     //right paddle draw
    context.fillStyle = blue;
    context.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);
    
    //general ball moving
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    //ball walls collision
    if (ball.y < grid) {
        playCollisionSFX()
        ball.y = grid;
        ball.dy *= -1;
      }

    else if (ball.y + grid > canvas.height - grid) {
        playCollisionSFX()
        ball.y = canvas.height - grid * 2;
        ball.dy *= -1;
    }

    //score right detecting
    if ( (ball.x < 0) && !ball.resetting) {
        ball.resetting = true;
        rightScore.increment();
        playScoreRightSFX();
        upText.classList.add('text_blue');
        setTimeout(() => {
            ball.resetting = false;
            ball.x = canvas.width / 2;
            ball.y = canvas.height / 2;
            ball.dx = -ballSpeed;
            ball.dy = ballSpeed;
            upText.classList.remove('text_blue');    
        }, 1000);
    }

    //score left detecting
    else if ( (ball.x > canvas.width) && !ball.resetting) {
        ball.resetting = true;
        leftScore.increment();
        playScoreLeftSFX();
        upText.classList.add('text_red');
        setTimeout(() => {
            ball.resetting = false;
            ball.x = canvas.width / 2;
            ball.y = canvas.height / 2;
            ball.dx = ballSpeed;
            ball.dy = -ballSpeed;
            upText.classList.remove('text_red');    
        }, 1000);
    }

    //paddles collision
    if (collides(ball, leftPaddle)) { //left paddle
        playPaddleSFX()
        ball.dx *= -1;
        ball.x = leftPaddle.x + leftPaddle.width;

        if (leftPaddle.dy != 0) {
            ball.dx += 2;
        }
        else if (leftPaddle.dy == 0){
            ball.dx = ballSpeed;
        }

    }
    
    else if (collides(ball, rightPaddle)) { //right paddle
        playPaddleSFX()

        ball.dx *= -1;
        ball.x = rightPaddle.x - ball.width;

        if (rightPaddle.dy !== 0) {
            ball.dx -= 2;
            
        }
        else if ((rightPaddle.dy === 0)){
            ball.dx = -ballSpeed;
        }
        
    }

    //draw a ball
    if (ball.dx > ballSpeed) {
        let gradient = context.createLinearGradient(ball.x - ball.dx, ball.y - ball.dy, ball.width/2, ball.height/2);
        gradient.addColorStop(0, 'gold');
        gradient.addColorStop(1, 'transparent');
        context.fillStyle = gradient;
        context.fillRect(ball.x - ball.dx, ball.y - ball.dy, ball.width, ball.height);
        // context.fillRect(ball.x - (ball.dx + ball.width/2), ball.y - ball.dy, ball.width, ball.height);
        
        context.fillStyle = 'lightgrey'; // change color with speed up from leftPaddle
      }
      
    else if (ball.dx === ballSpeed || ball.dx === -ballSpeed){
        context.fillStyle = 'lightgrey'; //base ballSpeed color
    }
    
    else if (ball.dx < ballSpeed) {
        let gradient = context.createLinearGradient(ball.x - ball.dx, ball.y - ball.dy, ball.width/2, ball.height/2);
        gradient.addColorStop(0, 'gold');
        gradient.addColorStop(1, 'transparent');
        context.fillStyle = gradient;
        context.fillRect(ball.x - ball.dx, ball.y - ball.dy, ball.width, ball.height);
        
        context.fillStyle = 'lightgrey'; // change color with speed up from rightPaddle
    }
   
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
    context.fillText(leftScore.value, canvas.width/2 - (grid * 6), canvas.height / 6);
    context.globalAlpha = 1;

    //draw right score
    context.font = "60px IBM Plex Mono";
    context.globalAlpha = 0.5;
    context.fillText(rightScore.value, canvas.width/2 + (grid * 3.4), canvas.height / 6);
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
    if (leftScore.value === 7) {
        playWinSFX()
        alert('Red wins!');
        let againButton = confirm('Wanna play again?');
        if (againButton){
            leftScore.value = 0;
            rightScore.value = 0;
            location.reload();
        } else {
            window.close();
            }
    }
        
    else if (rightScore.value === 7) {
        playWinSFX()
        alert('Blue wins!')
        let againButton = confirm('Wanna play again?');
            if (againButton){
                leftScore.value = 0;
                rightScore.value = 0;
                location.reload();
            }   else {
                window.close();
        }
    }
}
