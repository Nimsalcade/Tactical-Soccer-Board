export class SoccerField {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.fieldImage = new Image();
        this.fieldImage.src = 'assets/field.png';
        this.fieldImage.onload = () => {
            this.resize();
            this.draw();
        };
    }

    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.calculateFieldSize();
    }

    calculateFieldSize() {
        const aspectRatio = this.fieldImage.width / this.fieldImage.height;
        if (this.canvas.width / this.canvas.height > aspectRatio) {
            this.fieldHeight = this.canvas.height;
            this.fieldWidth = this.fieldHeight * aspectRatio;
        } else {
            this.fieldWidth = this.canvas.width;
            this.fieldHeight = this.fieldWidth / aspectRatio;
        }
        this.fieldX = (this.canvas.width - this.fieldWidth) / 2;
        this.fieldY = (this.canvas.height - this.fieldHeight) / 2;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear the canvas before drawing
        this.ctx.drawImage(this.fieldImage, this.fieldX, this.fieldY, this.fieldWidth, this.fieldHeight);
    }
}

