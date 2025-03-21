# 贪吃蛇游戏 (Snake Game)

A simple web-based Snake Game built with HTML, CSS, and JavaScript.

## Features

- Classic snake gameplay with arrow key controls
- Touch controls for mobile devices
- Score tracking with persistent high score
- Increasing difficulty as the snake grows
- Pause/Resume functionality
- Mobile-friendly design

## How to Play

1. Open `index.html` in your web browser
2. Click "开始游戏" (Start Game) to begin
3. Use arrow keys to control the snake on desktop:
   - ↑ - Move up
   - ↓ - Move down
   - ← - Move left
   - → - Move right
4. On mobile devices, swipe in the direction you want the snake to move
5. Eat the red food to grow and increase your score
6. Avoid hitting the walls or the snake's own body
7. Click "暂停" (Pause) to pause the game
8. Click "重新开始" (Restart) to start a new game

## Game Rules

- The snake moves continuously in the current direction
- Each food eaten increases your score by 10 points
- The game ends when the snake hits a wall or itself
- The snake speed increases slightly as you eat more food
- Your highest score is saved locally and persists between sessions

## Files

- `index.html` - Main HTML file
- `style.css` - CSS styles for the game
- `script.js` - JavaScript game logic

## Development

This is a simple implementation using vanilla JavaScript and HTML5 Canvas. Feel free to modify and extend the game with additional features. 