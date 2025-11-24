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

        // Drag state
        this.isDragging = false;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;
        this.onDragStart = null;
        this.onDragEnd = null;

        this.setupDragHandlers();
    }

    setupDragHandlers() {
        this.pet.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.isMoving = false; // Stop wandering

            // Calculate offset from pet center to mouse
            const rect = this.pet.getBoundingClientRect();
            this.dragOffsetX = e.clientX - (rect.left + rect.width / 2);
            this.dragOffsetY = e.clientY - (rect.top + rect.height / 2);

            this.pet.style.cursor = 'grabbing';

            // Notify that dragging started
            if (this.onDragStart) this.onDragStart();
        });

        window.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                this.posX = e.clientX - this.dragOffsetX;
                this.posY = e.clientY - this.dragOffsetY;

                // Keep within bounds
                this.posX = Math.max(this.petWidth / 2, Math.min(window.innerWidth - this.petWidth / 2, this.posX));
                this.posY = Math.max(this.petHeight / 2, Math.min(window.innerHeight - this.petHeight / 2, this.posY));
            }
        });

        window.addEventListener('mouseup', () => {
            if (this.isDragging) {
                this.isDragging = false;
                this.pet.style.cursor = 'grab';

                // Notify that dragging ended
                if (this.onDragEnd) this.onDragEnd();
            }
        });
    }

    setRandomTarget() {
        if (this.isDragging) return; // Don't wander while being dragged

        const padding = 100;
        this.targetX = padding + Math.random() * (window.innerWidth - padding * 2);
        this.targetY = padding + Math.random() * (window.innerHeight - padding * 2);
        this.isMoving = true;
    }

    update() {
        if (this.isDragging) {
            // Position is updated in mousemove handler
        } else if (this.isMoving) {
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
        }

        // Update position using left/top to avoid conflict with CSS float animation
        this.pet.style.left = `${this.posX - this.petWidth / 2}px`;
        this.pet.style.top = `${this.posY - this.petHeight / 2}px`;
    }

    getPosition() {
        return { x: this.posX, y: this.posY };
    }
}
