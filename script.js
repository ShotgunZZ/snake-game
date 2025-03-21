// Game canvas setup
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const gameContainer = document.querySelector('.game-container');
const gameOverElement = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const finalHighScoreElement = document.getElementById('final-high-score');

// Game settings
const gridSize = 20; // Size of each grid cell
let gridWidth, gridHeight;
let speed = 150; // Milliseconds between game updates
let currentGridSize;

// Game state
let snake = []; // Array of snake segments
let food = {}; // Position of food
let direction = ''; // Current direction
let nextDirection = ''; // Next direction after key press
let gameRunning = false;
let gameLoop = null;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;

// Touch controls
let touchStartX = 0;
let touchStartY = 0;

// Create high score element
const highScoreContainer = document.createElement('div');
highScoreContainer.className = 'high-score-container';
highScoreContainer.innerHTML = `<span>最高分: </span><span id="high-score">${highScore}</span>`;

// Insert high score element into score display
const scoreDisplay = document.querySelector('.score-display');
scoreDisplay.appendChild(highScoreContainer);

// Fill the entire screen with the canvas
function resizeCanvas() {
  // Set canvas dimensions to match window size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  // Calculate grid dimensions based on canvas size
  // Make grid cells larger on bigger screens
  currentGridSize = Math.max(20, Math.min(canvas.width, canvas.height) / 30);
  
  // Calculate grid width and height
  gridWidth = Math.floor(canvas.width / currentGridSize);
  gridHeight = Math.floor(canvas.height / currentGridSize);
  
  // Redraw game
  if (snake.length > 0) {
    drawGame();
  }
}

// Initialize game
function initGame() {
  // Initialize snake at the center of the canvas
  const centerX = Math.floor(gridWidth / 2);
  const centerY = Math.floor(gridHeight / 2);
  
  snake = [
    { x: centerX, y: centerY },
    { x: centerX - 1, y: centerY },
    { x: centerX - 2, y: centerY }
  ];
  
  // Reset direction and score
  direction = 'right';
  nextDirection = 'right';
  score = 0;
  scoreElement.textContent = score;
  
  // Hide game over message
  gameOverElement.style.display = 'none';
  
  // Generate first food
  generateFood();
  
  // Draw initial state
  drawGame();
}

// Generate food at random position
function generateFood() {
  let validPosition = false;
  
  // Keep generating until we find a valid position (not on snake)
  while (!validPosition) {
    food = {
      x: Math.floor(Math.random() * gridWidth),
      y: Math.floor(Math.random() * gridHeight)
    };
    
    // Ensure food is not too close to the edges
    if (food.x < 1 || food.x >= gridWidth - 1 || food.y < 1 || food.y >= gridHeight - 1) {
      continue;
    }
    
    // Check if food is on snake
    validPosition = true;
    for (let segment of snake) {
      if (segment.x === food.x && segment.y === food.y) {
        validPosition = false;
        break;
      }
    }
  }
}

// Update game state
function updateGame() {
  // Apply direction change
  direction = nextDirection;
  
  // Calculate new head position based on current direction
  const head = { ...snake[0] };
  
  switch (direction) {
    case 'up':
      head.y -= 1;
      break;
    case 'down':
      head.y += 1;
      break;
    case 'left':
      head.x -= 1;
      break;
    case 'right':
      head.x += 1;
      break;
  }
  
  // Check for collision with walls
  if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
    gameOver();
    return;
  }
  
  // Check for collision with self
  for (let i = 0; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      gameOver();
      return;
    }
  }
  
  // Add new head to snake
  snake.unshift(head);
  
  // Check if snake ate food
  if (head.x === food.x && head.y === food.y) {
    // Increase score
    score += 10;
    scoreElement.textContent = score;
    
    // Update high score if needed
    if (score > highScore) {
      highScore = score;
      document.getElementById('high-score').textContent = highScore;
      localStorage.setItem('snakeHighScore', highScore);
    }
    
    // Generate new food
    generateFood();
    
    // Increase speed slightly
    if (speed > 50) {
      speed -= 5;
    }
  } else {
    // Remove tail if snake didn't eat food
    snake.pop();
  }
  
  // Draw updated game
  drawGame();
}

// Draw game on canvas
function drawGame() {
  // Clear canvas
  ctx.fillStyle = '#dcdcdc';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw grid (optional, for visual reference)
  drawGrid();
  
  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    // Use different color for head
    if (i === 0) {
      ctx.fillStyle = '#2c3e50';
    } else {
      ctx.fillStyle = '#3498db';
    }
    
    ctx.fillRect(
      snake[i].x * currentGridSize,
      snake[i].y * currentGridSize,
      currentGridSize,
      currentGridSize
    );
    
    // Add border to snake segments
    ctx.strokeStyle = '#f0f0f0';
    ctx.strokeRect(
      snake[i].x * currentGridSize,
      snake[i].y * currentGridSize,
      currentGridSize,
      currentGridSize
    );
  }
  
  // Draw food
  ctx.fillStyle = '#e74c3c';
  ctx.beginPath();
  ctx.arc(
    food.x * currentGridSize + currentGridSize / 2,
    food.y * currentGridSize + currentGridSize / 2,
    currentGridSize / 2 - 2,
    0,
    Math.PI * 2
  );
  ctx.fill();
}

// Draw grid as visual guide (optional)
function drawGrid() {
  ctx.strokeStyle = 'rgba(200, 200, 200, 0.2)';
  ctx.lineWidth = 0.5;
  
  // Draw vertical lines
  for (let x = 0; x <= gridWidth; x++) {
    ctx.beginPath();
    ctx.moveTo(x * currentGridSize, 0);
    ctx.lineTo(x * currentGridSize, canvas.height);
    ctx.stroke();
  }
  
  // Draw horizontal lines
  for (let y = 0; y <= gridHeight; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * currentGridSize);
    ctx.lineTo(canvas.width, y * currentGridSize);
    ctx.stroke();
  }
}

// Handle game over
function gameOver() {
  clearInterval(gameLoop);
  gameRunning = false;
  startBtn.textContent = '重新开始';
  
  // Update final score display
  finalScoreElement.textContent = score;
  finalHighScoreElement.textContent = highScore;
  
  // Show game over message
  gameOverElement.style.display = 'block';
}

// Handle keyboard input
document.addEventListener('keydown', (e) => {
  if (!gameRunning) return;
  
  // Prevent arrow keys from scrolling the page
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault();
  }
  
  // Change direction based on arrow key
  // Prevent 180 degree turns by checking current direction
  switch (e.key) {
    case 'ArrowUp':
      if (direction !== 'down') nextDirection = 'up';
      break;
    case 'ArrowDown':
      if (direction !== 'up') nextDirection = 'down';
      break;
    case 'ArrowLeft':
      if (direction !== 'right') nextDirection = 'left';
      break;
    case 'ArrowRight':
      if (direction !== 'left') nextDirection = 'right';
      break;
  }
});

// Handle touch input for mobile devices
canvas.addEventListener('touchstart', (e) => {
  if (!gameRunning) return;
  
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  
  e.preventDefault();
});

canvas.addEventListener('touchmove', (e) => {
  e.preventDefault(); // Prevent scrolling when touching the canvas
});

canvas.addEventListener('touchend', (e) => {
  if (!gameRunning) return;
  
  const touchEndX = e.changedTouches[0].clientX;
  const touchEndY = e.changedTouches[0].clientY;
  
  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;
  
  // Determine if the swipe is horizontal or vertical
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // Horizontal swipe
    if (deltaX > 0 && direction !== 'left') {
      nextDirection = 'right';
    } else if (deltaX < 0 && direction !== 'right') {
      nextDirection = 'left';
    }
  } else {
    // Vertical swipe
    if (deltaY > 0 && direction !== 'up') {
      nextDirection = 'down';
    } else if (deltaY < 0 && direction !== 'down') {
      nextDirection = 'up';
    }
  }
  
  e.preventDefault();
});

// Start/restart game button
startBtn.addEventListener('click', () => {
  if (gameRunning) {
    clearInterval(gameLoop);
    gameRunning = false;
    startBtn.textContent = '开始游戏';
  } else {
    if (gameOverElement.style.display === 'block') {
      initGame(); // Reinitialize game if it was game over
    }
    gameRunning = true;
    startBtn.textContent = '暂停';
    gameLoop = setInterval(updateGame, speed);
  }
});

// Restart game button
restartBtn.addEventListener('click', () => {
  clearInterval(gameLoop);
  initGame();
  gameRunning = true;
  startBtn.textContent = '暂停';
  gameLoop = setInterval(updateGame, speed);
});

// Handle window resize
window.addEventListener('resize', resizeCanvas);

// Initialize on page load
window.addEventListener('load', () => {
  resizeCanvas();
  initGame();
}); 