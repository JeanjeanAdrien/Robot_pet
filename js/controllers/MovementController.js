export class MovementController {
    constructor(petElement) {
        this.pet = petElement;
        this.posX = window.innerWidth / 2;
        this.posY = window.innerHeight / 2;
        this.targetX = this.posX;
        this.targetY = this.posY;
        this.isMoving = false;
        this.speed = 2;
        this.petWidth = 110;
        this.petHeight = 100;
    }

    setRandomTarget() {
        const padding = 100;
        this.targetX = padding + Math.random() * (window.innerWidth - padding * 2);
        this.targetY = padding + Math.random() * (window.innerHeight - padding * 2);
        this.isMoving = true;
    }

    update() {
        if (!this.isMoving) return;

        const dx = this.targetX - this.posX;
        const dy = this.targetY - this.posY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > this.speed) {
            this.posX += (dx / dist) * this.speed;
            this.posY += (dy / dist) * this.speed;
        } else {
            this.posX = this.targetX;
            this.posY = this.targetY;
            this.isMoving = false;
        }

        // Update position using left/top to avoid conflict with CSS float animation
        this.pet.style.left = `${this.posX - this.petWidth / 2}px`;
        this.pet.style.top = `${this.posY - this.petHeight / 2}px`;
    }

    getPosition() {
        return { x: this.posX, y: this.posY };
    }
}
