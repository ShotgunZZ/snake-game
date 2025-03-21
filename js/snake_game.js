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
const gridSize = 40; // Increased size of each grid cell (doubled from 20)
let gridWidth, gridHeight;
let speed = 200; // Slower speed (in milliseconds) to make the game easier to play
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

// Face images for food
const faceImages = [];
let currentFaceIndex = 0;
let foodImage = null;
let imagesLoaded = 0;

// Touch controls
let touchStartX = 0;
let touchStartY = 0;

// Debug element to show image loading status
const debugContainer = document.createElement('div');
debugContainer.style.position = 'absolute';
debugContainer.style.bottom = '20px';
debugContainer.style.left = '20px';
debugContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
debugContainer.style.color = 'white';
debugContainer.style.padding = '10px';
debugContainer.style.borderRadius = '5px';
debugContainer.style.zIndex = '10';
debugContainer.style.fontSize = '14px';
debugContainer.style.fontFamily = 'monospace';
debugContainer.style.maxWidth = '300px';
debugContainer.style.maxHeight = '200px';
debugContainer.style.overflow = 'auto';
debugContainer.innerHTML = 'Loading face images...';

// Add debug container to the page
document.body.appendChild(debugContainer);

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
  currentGridSize = Math.max(40, Math.min(canvas.width, canvas.height) / 20);
  
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
  
  // Choose a random face for the first food
  currentFaceIndex = Math.floor(Math.random() * faceImages.length);
  foodImage = faceImages[currentFaceIndex];
  
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
    
    // Rotate to next face image for the next food
    currentFaceIndex = (currentFaceIndex + 1) % faceImages.length;
    foodImage = faceImages[currentFaceIndex];
    
    // Generate new food
    generateFood();
    
    // Increase speed slightly
    if (speed > 70) {
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
    
    // Draw larger snake segments
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
  
  // Draw food with face image if loaded
  if (foodImage && foodImage.complete) {
    // Draw the face image as food
    try {
      // Draw circular clipping path
      ctx.save();
      ctx.beginPath();
      ctx.arc(
        food.x * currentGridSize + currentGridSize / 2,
        food.y * currentGridSize + currentGridSize / 2,
        currentGridSize / 1.5, // Larger food size (/ 1.5 instead of / 2)
        0,
        Math.PI * 2
      );
      ctx.clip();
      
      // Calculate dimensions to maintain aspect ratio while filling the circle
      const size = currentGridSize * 1.5;
      
      // Draw the face image inside the clipping path
      ctx.drawImage(
        foodImage,
        food.x * currentGridSize + currentGridSize / 2 - size / 2,
        food.y * currentGridSize + currentGridSize / 2 - size / 2,
        size,
        size
      );
      
      // Restore context
      ctx.restore();
      
      // Add a border around the food
      ctx.strokeStyle = '#e74c3c';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(
        food.x * currentGridSize + currentGridSize / 2,
        food.y * currentGridSize + currentGridSize / 2,
        currentGridSize / 1.5,
        0,
        Math.PI * 2
      );
      ctx.stroke();
    } catch (e) {
      console.error('Error drawing food image:', e);
      // Fallback to simple circle
      drawFallbackFood();
    }
  } else {
    // If image not loaded, draw a colored circle as fallback
    drawFallbackFood();
  }
}

// Draw fallback food (simple circle)
function drawFallbackFood() {
  ctx.fillStyle = '#e74c3c';
  ctx.beginPath();
  ctx.arc(
    food.x * currentGridSize + currentGridSize / 2,
    food.y * currentGridSize + currentGridSize / 2,
    currentGridSize / 1.5, // Larger food size
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
  // Preload face images first
  preloadFaceImages();
  
  // Initialize the game
  resizeCanvas();
  initGame();
});

// Preload face images
function preloadFaceImages() {
  debugContainer.innerHTML = 'Starting to load face images...<br>';
  
  // Check if directory exists
  console.log('Attempting to load face images from final_faces/');
  debugContainer.innerHTML += 'Attempting to load face images from final_faces/<br>';
  
  // Load all 5 face images from the final_faces folder
  for (let i = 1; i <= 5; i++) {
    const img = new Image();
    const imagePath = `final_faces/face_${i}.jpg`;
    img.src = imagePath;
    faceImages.push(img);
    
    debugContainer.innerHTML += `Loading image: ${imagePath}<br>`;
    
    // Log when images are loaded
    img.onload = () => {
      imagesLoaded++;
      console.log(`Face ${i} loaded successfully`);
      debugContainer.innerHTML += `✅ Face ${i} loaded successfully<br>`;
      
      // If all images loaded, hide debug container after a delay
      if (imagesLoaded === 5) {
        debugContainer.innerHTML += 'All images loaded successfully!<br>';
        setTimeout(() => {
          debugContainer.style.opacity = '0.2';
        }, 3000);
      }
    };
    
    // Log if there's an error loading images
    img.onerror = (e) => {
      console.error(`Error loading face ${i}:`, e);
      debugContainer.innerHTML += `❌ Error loading face ${i}: ${imagePath}<br>`;
    };
  }
} 