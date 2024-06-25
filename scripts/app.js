import { SoccerField } from './field.js';
import { PlayerManager } from './players.js';
import { ToolManager } from './tools.js';
class TacticalSoccerBoard {
constructor() {
this.canvas = document.getElementById('soccer-field');
this.ctx = this.canvas.getContext('2d');
this.resizeCanvas();
this.field = new SoccerField(this.canvas);
    this.playerManager = new PlayerManager(this.canvas, this.field);
    this.toolManager = new ToolManager(this.canvas, this.field);

    this.setupEventListeners();
    this.animate();
}

resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight - 100; // Adjust for toolbar and player selector
}

setupEventListeners() {
    window.addEventListener('resize', () => {
        this.resizeCanvas();
        this.field.resize();
        this.playerManager.initPlayers();
    });
    document.getElementById('text-tool').addEventListener('click', () => this.toolManager.setTool('text'));

    // Tool selection
    document.getElementById('line-tool').addEventListener('click', () => this.toolManager.setTool('line'));
    document.getElementById('arrow-tool').addEventListener('click', () => this.toolManager.setTool('arrow'));
    document.getElementById('circle-tool').addEventListener('click', () => this.toolManager.setTool('circle'));
    document.getElementById('rectangle-tool').addEventListener('click', () => this.toolManager.setTool('rectangle'));

    // Soccer ball
    document.getElementById('soccer-ball').addEventListener('click', () => this.playerManager.addBall());

    // Other toolbar buttons
    document.getElementById('menu-btn').addEventListener('click', this.toggleMenu.bind(this));
    document.getElementById('download-btn').addEventListener('click', this.downloadImage.bind(this));
    document.getElementById('fullscreen-btn').addEventListener('click', this.toggleFullscreen.bind(this));

    // Add reset button
    const resetBtn = document.createElement('button');
    resetBtn.textContent = '↺';
    resetBtn.id = 'reset-btn';
    resetBtn.addEventListener('click', this.reset.bind(this));
    document.getElementById('toolbar').appendChild(resetBtn);
}

animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    if (this.field.fieldImage.complete) {
        this.field.draw();
        }
    this.toolManager.drawAllShapes();
    this.playerManager.draw();

    requestAnimationFrame(this.animate.bind(this));
}


toggleMenu() {
    // Implement menu toggle functionality
    console.log('Menu toggled');
}

downloadImage() {
    const dataURL = this.canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'tactical-board.png';
    link.href = dataURL;
    link.click();
}

toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

reset() {
    this.playerManager.reset();
    this.toolManager.reset();
}
}
// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
new TacticalSoccerBoard();
});