// Game canvas setup
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');

// Game settings
const gridSize = 20; // Size of each grid cell
const gridWidth = canvas.width / gridSize;
const gridHeight = canvas.height / gridSize;
let speed = 150; // Milliseconds between game updates

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

// Insert high score element after score container
const scoreContainer = document.querySelector('.score-container');
scoreContainer.parentNode.insertBefore(highScoreContainer, scoreContainer.nextSibling);

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
  
  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    // Use different color for head
    if (i === 0) {
      ctx.fillStyle = '#2c3e50';
    } else {
      ctx.fillStyle = '#3498db';
    }
    
    ctx.fillRect(
      snake[i].x * gridSize,
      snake[i].y * gridSize,
      gridSize,
      gridSize
    );
    
    // Add border to snake segments
    ctx.strokeStyle = '#f0f0f0';
    ctx.strokeRect(
      snake[i].x * gridSize,
      snake[i].y * gridSize,
      gridSize,
      gridSize
    );
  }
  
  // Draw food
  ctx.fillStyle = '#e74c3c';
  ctx.beginPath();
  ctx.arc(
    food.x * gridSize + gridSize / 2,
    food.y * gridSize + gridSize / 2,
    gridSize / 2 - 2,
    0,
    Math.PI * 2
  );
  ctx.fill();
}

// Handle game over
function gameOver() {
  clearInterval(gameLoop);
  gameRunning = false;
  startBtn.textContent = '重新开始';
  
  // Display game over message
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.font = '30px Arial';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.fillText('游戏结束!', canvas.width / 2, canvas.height / 2 - 20);
  
  ctx.font = '20px Arial';
  ctx.fillText(`得分: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
  
  // Show high score
  ctx.fillText(`最高分: ${highScore}`, canvas.width / 2, canvas.height / 2 + 50);
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
    initGame();
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

// Initialize game on load
initGame(); 