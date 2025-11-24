/* =====================
* renderer.js (Coordinator)
* ===================== */

import { PetBrain } from './js/PetBrain.js';
import { PetView } from './js/PetView.js';
import { EyeController } from './js/controllers/EyeController.js';
import { MovementController } from './js/controllers/MovementController.js';

// Initialize modules
const brain = new PetBrain();
const view = new PetView();
const eyeController = new EyeController(
    document.getElementById('pupil-left'),
    document.getElementById('pupil-right'),
    document.getElementById('pet')
);
const movementController = new MovementController(
    document.getElementById('pet')
);

// === Wiring ===

// Brain -> View
brain.on('say', (text) => view.say(text));
brain.on('mood-change', (mood) => view.updateMood(mood));
brain.on('blink', () => view.blink());

// Brain -> Movement
brain.on('wander', () => movementController.setRandomTarget());

// View Interactions -> Brain
view.bindEvents({
    onClick: () => brain.handleInteraction()
});

// Main -> Brain (Environment)
if (window.petAPI && window.petAPI.onEnvUpdate) {
    window.petAPI.onEnvUpdate((data) => {
        brain.updateEnv(data.envState);
    });
}

// === Animation Loop ===

function loop() {
    // Update movement
    movementController.update();

    // Update eye tracking
    eyeController.update();

    requestAnimationFrame(loop);
}

// Start
brain.init();
requestAnimationFrame(loop);