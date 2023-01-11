import { rightPaddle } from '../../script.js';
import { ball } from '../../script.js';
import { paddleSpeed } from '../../script.js';

export function AILogic() {
    //calculate the distance between the ball and the center of the paddle
    let paddleCenter = rightPaddle.y + rightPaddle.height / 2;
    let distance = ball.y - paddleCenter;

    //if the ball is above the center of the paddle
    if (distance < -20) {
        rightPaddle.dy = -paddleSpeed + 3.4; // 4 - easy; 3.2 - normal; 3.125 - hard
    }
    //if the ball is below the center of the paddle
    else if (distance > 20) {
        rightPaddle.dy = paddleSpeed + 3.4;
    }
    //if the ball is close to the center of the paddle
    else {
        rightPaddle.dy = 0;
    }
}