# 贪吃蛇游戏 (Snake Game)

A simple web-based Snake Game built with HTML, CSS, and JavaScript.

## Features

- Classic snake gameplay with arrow key controls
- Touch controls for mobile devices
- Score tracking with persistent high score
- Increasing difficulty as the snake grows
- Pause/Resume functionality
- Fully immersive gameplay with canvas covering the entire screen
- Transparent overlay UI that doesn't interfere with the game experience
- Mobile-friendly design with optimized layout

## How to Play

1. Open `index.html` in your web browser
2. The game takes up the full screen with transparent overlays
3. Click "开始游戏" (Start Game) to begin
4. Use arrow keys to control the snake on desktop:
   - ↑ - Move up
   - ↓ - Move down
   - ← - Move left
   - → - Move right
5. On mobile devices, swipe in the direction you want the snake to move
6. Eat the red food to grow and increase your score
7. Avoid hitting the walls or the snake's own body
8. Click "暂停" (Pause) to pause the game
9. Click "重新开始" (Restart) to start a new game

## Game Rules

- The snake moves continuously in the current direction
- Each food eaten increases your score by 10 points
- The game ends when the snake hits a wall or itself
- The snake speed increases slightly as you eat more food
- Your highest score is saved locally and persists between sessions

## UI Features

- Transparent header with game title and score display
- Transparent controls that don't block gameplay
- Semi-transparent instructions panel in the bottom-right corner (hover to see full details)
- Overlay game-over screen with final score and high score
- Background grid for better visual reference

## Files

- `index.html` - Main HTML file
- `style.css` - CSS styles for the game
- `script.js` - JavaScript game logic

## Development

This is a simple implementation using vanilla JavaScript and HTML5 Canvas. Feel free to modify and extend the game with additional features. 