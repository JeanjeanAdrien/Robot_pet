export class PetView {
    constructor() {
        this.elements = {
            pet: document.getElementById('pet'),
            mouth: document.getElementById('mouth'),
            speech: document.getElementById('speech'),
            eyesContainer: document.querySelector('.eyes')
        };

        this.speechTimeout = null;
    }

    updateMood(mood) {
        const { mouth } = this.elements;

        // Reset styles
        mouth.style.borderRadius = '50%';
        mouth.style.height = '10px';
        mouth.style.width = '20px';

        switch (mood) {
            case 'happy':
                mouth.style.borderRadius = '0 0 20px 20px';
                mouth.style.height = '15px';
                break;
            case 'sleepy':
                mouth.style.width = '10px';
                mouth.style.height = '10px';
                mouth.style.borderRadius = '50%';
                break;
            case 'excited':
                mouth.style.borderRadius = '50%';
                mouth.style.height = '20px';
                mouth.style.width = '20px';
                break;
        }
    }

    say(text, duration = 3000) {
        const { speech } = this.elements;
        speech.textContent = text;
        speech.classList.add('visible');

        if (this.speechTimeout) clearTimeout(this.speechTimeout);
        this.speechTimeout = setTimeout(() => {
            speech.classList.remove('visible');
        }, duration);
    }

    blink() {
        const { eyesContainer } = this.elements;
        eyesContainer.style.transform = 'scaleY(0.1)';
        setTimeout(() => {
            eyesContainer.style.transform = 'scaleY(1)';
        }, 150);
    }

    // Interaction events
    bindEvents(callbacks) {
        const { pet } = this.elements;

        pet.addEventListener('mousedown', callbacks.onClick);

        pet.addEventListener('mouseenter', () => {
            if (window.petAPI) window.petAPI.setIgnoreMouseEvents(false);
        });

        pet.addEventListener('mouseleave', () => {
            if (window.petAPI) window.petAPI.setIgnoreMouseEvents(true, { forward: true });
        });
    }
}
