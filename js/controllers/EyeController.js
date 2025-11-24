export class EyeController {
    constructor(pupilLeftElement, pupilRightElement, petElement) {
        this.pupilLeft = pupilLeftElement;
        this.pupilRight = pupilRightElement;
        this.pet = petElement;
        this.mouseX = window.innerWidth / 2;
        this.mouseY = window.innerHeight / 2;

        // Curious behavior
        this.lookAtX = 0;
        this.lookAtY = 0;
        this.nextLookTime = Date.now() + 2000;
        this.trackingRange = 300; // Pixels - how close mouse needs to be

        this.setupMouseTracking();
    }

    setupMouseTracking() {
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
    }

    update() {
        const rect = this.pet.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Check distance to mouse
        const mouseDistX = this.mouseX - centerX;
        const mouseDistY = this.mouseY - centerY;
        const mouseDist = Math.sqrt(mouseDistX * mouseDistX + mouseDistY * mouseDistY);

        let targetX, targetY;

        if (mouseDist < this.trackingRange) {
            // Mouse is near - track it!
            targetX = this.mouseX;
            targetY = this.mouseY;
        } else {
            // Mouse is far - look around curiously
            const now = Date.now();
            if (now > this.nextLookTime) {
                // Pick a new random look direction
                const angle = Math.random() * Math.PI * 2;
                const distance = 100 + Math.random() * 200;
                this.lookAtX = centerX + Math.cos(angle) * distance;
                this.lookAtY = centerY + Math.sin(angle) * distance;
                this.nextLookTime = now + 1000 + Math.random() * 3000;
            }
            targetX = this.lookAtX;
            targetY = this.lookAtY;
        }

        // Calculate pupil offset
        const dx = targetX - centerX;
        const dy = targetY - centerY;
        const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
        const maxOffset = 6;

        const offX = (dx / dist) * maxOffset;
        const offY = (dy / dist) * maxOffset;

        // Combine centering (-50%, -50%) with tracking offset
        this.pupilLeft.style.transform = `translate(calc(-50% + ${offX}px), calc(-50% + ${offY}px))`;
        this.pupilRight.style.transform = `translate(calc(-50% + ${offX}px), calc(-50% + ${offY}px))`;
    }
}
