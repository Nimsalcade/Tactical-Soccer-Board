export class PlayerManager {
    constructor(canvas, field) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.field = field;
    this.players = [];
    this.ball = null;
    this.colors = ['#ff0000', '#0000ff', '#000000', '#800080'];
    this.attachedObject = null;
    this.initPlayers();
    this.setupEventListeners();
    }
    initPlayers() {
        const tokenSize = Math.min(this.canvas.width, this.canvas.height) * 0.03;
        const spacing = tokenSize * 1.2;
        const startX = this.field.fieldX - tokenSize * 1.5;
        const startY = this.field.fieldY + this.field.fieldHeight / 2;
    
        this.colors.forEach((color, colorIndex) => {
            for (let i = 0; i < 11; i++) {
                this.players.push({
                    x: startX,
                    y: startY + (colorIndex * spacing),
                    radius: tokenSize / 2,
                    color: color,
                    number: i + 1,
                    zIndex: i
                });
            }
        });
    }
    
    addBall() {
        if (!this.ball) {
            const ballSize = Math.min(this.canvas.width, this.canvas.height) * 0.02;
            this.ball = {
                x: this.canvas.width / 2,
                y: this.canvas.height - ballSize,
                radius: ballSize / 2,
                zIndex: this.players.length
            };
        }
    }
    
    drawSoccerBall(x, y, radius) {
        // ... (keep the existing drawSoccerBall method)
    }
    
    setupEventListeners() {
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
    }
    
    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (this.attachedObject) {
            this.placeObject(x, y);
        } else {
            this.attachObject(x, y);
        }
    }
    
    handleMouseMove(e) {
        if (this.attachedObject) {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.moveAttachedObject(x, y);
        }
    }
    
    handleMouseUp() {
        // No need to do anything here as we're not using drag-and-drop anymore
    }
    
    handleTouchStart(e) {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            
            if (this.attachedObject) {
                this.placeObject(x, y);
            } else {
                this.attachObject(x, y);
            }
        }
    }
    
    handleTouchMove(e) {
        if (this.attachedObject && e.touches.length === 1) {
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            this.moveAttachedObject(x, y);
        }
    }
    
    handleTouchEnd() {
        // No need to do anything here as we're not using drag-and-drop anymore
    }
    
    attachObject(x, y) {
        const allObjects = [...this.players, this.ball].filter(obj => obj !== null);
        this.attachedObject = allObjects
            .reverse()
            .find(obj => Math.sqrt((x - obj.x) ** 2 + (y - obj.y) ** 2) < obj.radius);
    
        if (this.attachedObject) {
            this.attachedObject.zIndex = Math.max(...allObjects.map(obj => obj.zIndex)) + 1;
        }
    }
    
    moveAttachedObject(x, y) {
        if (this.attachedObject) {
            this.attachedObject.x = x;
            this.attachedObject.y = y;
        }
    }
    
    placeObject(x, y) {
        if (this.attachedObject) {
            this.attachedObject.x = x;
            this.attachedObject.y = y;
            this.attachedObject = null;
        }
    }
    
    draw() {
        const allObjects = [...this.players, this.ball].filter(obj => obj !== null);
        allObjects.sort((a, b) => a.zIndex - b.zIndex);
    
        allObjects.forEach(obj => {
            if (obj === this.ball) {
                this.drawSoccerBall(obj.x, obj.y, obj.radius);
            } else {
                this.ctx.beginPath();
                this.ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = obj.color;
                this.ctx.fill();
                this.ctx.strokeStyle = 'white';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
    
                this.ctx.fillStyle = 'white';
                this.ctx.font = `${obj.radius}px Arial`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(obj.number.toString(), obj.x, obj.y);
            }
        });
    
        // Draw the attached object at the cursor position
        if (this.attachedObject) {
            this.ctx.globalAlpha = 0.5;
            if (this.attachedObject === this.ball) {
                this.drawSoccerBall(this.attachedObject.x, this.attachedObject.y, this.attachedObject.radius);
            } else {
                this.ctx.beginPath();
                this.ctx.arc(this.attachedObject.x, this.attachedObject.y, this.attachedObject.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = this.attachedObject.color;
                this.ctx.fill();
                this.ctx.strokeStyle = 'white';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
    
                this.ctx.fillStyle = 'white';
                this.ctx.font = `${this.attachedObject.radius}px Arial`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(this.attachedObject.number.toString(), this.attachedObject.x, this.attachedObject.y);
            }
            this.ctx.globalAlpha = 1;
        }
    }
    
    reset() {
        this.players = [];
        this.ball = null;
        this.attachedObject = null;
        this.initPlayers();
    }
}