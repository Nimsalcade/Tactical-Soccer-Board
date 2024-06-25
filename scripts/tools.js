export class ToolManager {
    constructor(canvas, field) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.field = field;
        this.currentTool = null;
        this.currentColor = 'white';
        this.isDrawing = false;
        this.startX = 0;
        this.startY = 0;
        this.shapes = [];
        this.texts = [];
        this.undoStack = [];
        this.redoStack = [];
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));

        document.getElementById('color-picker').addEventListener('change', (e) => {
            this.currentColor = e.target.value;
        });
        
        document.getElementById('undo-btn').addEventListener('click', this.undo.bind(this));
        document.getElementById('redo-btn').addEventListener('click', this.redo.bind(this));
    }

    setTool(tool) {
        this.currentTool = tool;
    }

    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.startX = e.clientX - rect.left;
        this.startY = e.clientY - rect.top;
        this.isDrawing = true;

        if (this.currentTool === 'text') {
            this.addText(this.startX, this.startY);
        }
    }

    handleMouseMove(e) {
        if (!this.isDrawing) return;
        const rect = this.canvas.getBoundingClientRect();
        const endX = e.clientX - rect.left;
        const endY = e.clientY - rect.top;
        this.drawShape(endX, endY);
    }

    handleMouseUp(e) {
        if (!this.isDrawing) return;
        const rect = this.canvas.getBoundingClientRect();
        const endX = e.clientX - rect.left;
        const endY = e.clientY - rect.top;
        this.finalizeShape(endX, endY);
        this.isDrawing = false;
    }

    handleTouchStart(e) {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            this.startX = touch.clientX - rect.left;
            this.startY = touch.clientY - rect.top;
            this.isDrawing = true;

            if (this.currentTool === 'text') {
                this.addText(this.startX, this.startY);
            }
        }
    }

    handleTouchMove(e) {
        if (!this.isDrawing || e.touches.length !== 1) return;
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const endX = touch.clientX - rect.left;
        const endY = touch.clientY - rect.top;
        this.drawShape(endX, endY);
    }

    handleTouchEnd(e) {
        if (!this.isDrawing) return;
        const touch = e.changedTouches[0];
        const rect = this.canvas.getBoundingClientRect();
        const endX = touch.clientX - rect.left;
        const endY = touch.clientY - rect.top;
        this.finalizeShape(endX, endY);
        this.isDrawing = false;
    }

    drawShape(endX, endY) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineWidth = 2;

        switch (this.currentTool) {
            case 'line':
                this.ctx.moveTo(this.startX, this.startY);
                this.ctx.lineTo(endX, endY);
                break;
            case 'arrow':
                this.drawArrow(this.startX, this.startY, endX, endY);
                break;
            case 'circle':
                const radius = Math.sqrt((endX - this.startX) ** 2 + (endY - this.startY) ** 2);
                this.ctx.arc(this.startX, this.startY, radius, 0, Math.PI * 2);
                break;
            case 'rectangle':
                this.ctx.rect(this.startX, this.startY, endX - this.startX, endY - this.startY);
                break;
        }

        this.ctx.stroke();
    }

    finalizeShape(endX, endY) {
        this.shapes.push({
            tool: this.currentTool,
            color: this.currentColor,
            startX: this.startX,
            startY: this.startY,
            endX: endX,
            endY: endY
        });

        // Clear redo stack on new action
        this.redoStack = [];
        // Save the current state for undo
        this.saveState();
    }

    drawArrow(fromX, fromY, toX, toY) {
        const headLength = 10;
        const dx = toX - fromX;
        const dy = toY - fromY;
        const angle = Math.atan2(dy, dx);
        
        this.ctx.moveTo(fromX, fromY);
        this.ctx.lineTo(toX, toY);
        this.ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
        this.ctx.moveTo(toX, toY);
        this.ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));
    }

    addText(x, y) {
        const text = prompt("Enter text:");
        if (text) {
            this.texts.push({ x, y, text, color: this.currentColor });
            this.saveState();
        }
    }

    drawAllShapes() {
        this.shapes.forEach(shape => {
            this.ctx.beginPath();
            this.ctx.strokeStyle = shape.color;
            this.ctx.lineWidth = 2;

            switch (shape.tool) {
                case 'line':
                    this.ctx.moveTo(shape.startX, shape.startY);
                    this.ctx.lineTo(shape.endX, shape.endY);
                    break;
                case 'arrow':
                    this.drawArrow(shape.startX, shape.startY, shape.endX, shape.endY);
                    break;
                case 'circle':
                    const radius = Math.sqrt((shape.endX - shape.startX) ** 2 + (shape.endY - shape.startY) ** 2);
                    this.ctx.arc(shape.startX, shape.startY, radius, 0, Math.PI * 2);
                    break;
                case 'rectangle':
                    this.ctx.rect(shape.startX, shape.startY, shape.endX - shape.startX, shape.endY - shape.startY);
                    break;
            }

            this.ctx.stroke();
        });

        this.texts.forEach(textObj => {
            this.ctx.fillStyle = textObj.color;
            this.ctx.font = '16px Arial';
            this.ctx.fillText(textObj.text, textObj.x, textObj.y);
        });
    }

    saveState() {
        this.undoStack.push({
            shapes: JSON.parse(JSON.stringify(this.shapes)),
            texts: JSON.parse(JSON.stringify(this.texts))
        });
    }

    undo() {
        if (this.undoStack.length > 0) {
            this.redoStack.push({
                shapes: JSON.parse(JSON.stringify(this.shapes)),
                texts: JSON.parse(JSON.stringify(this.texts))
            });
            const lastState = this.undoStack.pop();
            this.shapes = lastState.shapes;
            this.texts = lastState.texts;
        }
    }

    redo() {
        if (this.redoStack.length > 0) {
            this.undoStack.push({
                shapes: JSON.parse(JSON.stringify(this.shapes)),
                texts: JSON.parse(JSON.stringify(this.texts))
            });
            const nextState = this.redoStack.pop();
            this.shapes = nextState.shapes;
            this.texts = nextState.texts;
        }
    }

    reset() {
        this.shapes = [];
        this.texts = [];
        this.undoStack = [];
        this.redoStack = [];
        this.saveState();
    }
}
