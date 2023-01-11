//--------------------IMPORTS--------------------

import loop from './src/scripts/loop.js';



//--------------------VARIABLES--------------------

export const canvas = document.getElementById('game');
export const context = canvas.getContext('2d');

//grid size
export const grid = 15;

//paddle height
export const paddleHeight = grid * 5; //80

//max Y for paddle
export const maxPaddleY = canvas.height - grid - paddleHeight;

//speed
export let paddleSpeed = 8;
export let ballSpeed = 5;

//score
let _leftScore = 0;

export const leftScore = {
  get value(){
    return _leftScore;
  },
  set value(val){
    _leftScore = val;
  },
  increment(){
    _leftScore++;
  }
}

let _rightScore = 0;

export const rightScore = {
  get value(){
    return _rightScore;
  },
  set value(val){
    _rightScore = val;
  },
  increment(){
    _rightScore++;
  }
}

//colors
export let red = '#db0000';
export let blue = '#0049bf';

//text
export const upText = document.querySelector('.text');

//--------------------SOUNDS--------------------

export function playCollisionSFX() {
    let audio = new Audio('./src/audio/bonk.mp3');
    audio.play();
}

export function playPaddleSFX() {
    let audio = new Audio('./src/audio/bonk-wow.mp3');
    audio.play();
}

export function playScoreLeftSFX() {
    let audio = new Audio('./src/audio/yeet-high.mp3');
    audio.play();
}

export function playScoreRightSFX() {
    let audio = new Audio('./src/audio/yeet-low.mp3');
    audio.play();
}

export function playWinSFX() {
    let audio = new Audio('./src/audio/punch.mp3');
    audio.play();
}

//--------------------PADDLES AND BALL--------------------

export const leftPaddle = {
    x: grid * 2,
    y: canvas.height / 2 - paddleHeight / 2,
    width: grid,
    height: paddleHeight,
    dy: 0,
};

export const rightPaddle = {
    x: canvas.width - grid * 3,
    y: canvas.height / 2 - paddleHeight / 2,
    width: grid,
    height: paddleHeight,
    dy: 0
};

export const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: grid,
    height: grid,
    resetting: false,
    dx: ballSpeed,
    dy: -ballSpeed
};

//--------------------MAIN LOOP--------------------

requestAnimationFrame(loop);


