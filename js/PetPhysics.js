export class PetPhysics {
    constructor() {
        this.pos = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        };
        this.target = { ...this.pos };
        this.speed = 2;
        this.isMoving = false;
    }

    setTargetRandom() {
        const padding = 100;
        this.target.x = padding + Math.random() * (window.innerWidth - padding * 2);
        this.target.y = padding + Math.random() * (window.innerHeight - padding * 2);
        this.isMoving = true;
    }

    jump() {
        // Simple jump effect could be handled here or in View via CSS animation
        // For physics, we might just offset Y temporarily, but let's keep it simple for now
    }

    update() {
        if (!this.isMoving) return this.pos;

        const dx = this.target.x - this.pos.x;
        const dy = this.target.y - this.pos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > this.speed) {
            this.pos.x += (dx / dist) * this.speed;
            this.pos.y += (dy / dist) * this.speed;
        } else {
            this.pos.x = this.target.x;
            this.pos.y = this.target.y;
            this.isMoving = false;
        }

        return this.pos;
    }

    // Eye tracking math
    calculatePupilOffset(mouseX, mouseY) {
        const dx = mouseX - this.pos.x;
        const dy = mouseY - this.pos.y;
        const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
        const maxOffset = 6;

        return {
            x: (dx / dist) * maxOffset,
            y: (dy / dist) * maxOffset
        };
    }
}
