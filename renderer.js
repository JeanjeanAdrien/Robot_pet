/* =====================
* renderer.js (Coordinator)
* ===================== */

import { PetBrain } from './js/PetBrain.js';
import { PetView } from './js/PetView.js';
import { PetPhysics } from './js/PetPhysics.js';

const brain = new PetBrain();
const view = new PetView();
const physics = new PetPhysics();

// Mouse tracking state
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

// === Wiring ===

// Brain -> View
brain.on('say', (text) => view.say(text));
brain.on('mood-change', (mood) => view.updateMood(mood));
brain.on('blink', () => view.blink());
brain.on('jump', () => physics.jump());

// Brain -> Physics
brain.on('wander', () => physics.setTargetRandom());

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

// Input -> Physics/View
window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// === Loop ===

function loop() {
    // Update Physics
    const pos = physics.update();

    // Update View Position
    view.updatePosition(pos.x, pos.y);

    // Update Eyes (Pupils follow mouse)
    const pupilOffset = physics.calculatePupilOffset(mouseX, mouseY);
    view.updatePupils(pupilOffset.x, pupilOffset.y);

    requestAnimationFrame(loop);
}

// Start
brain.init();
requestAnimationFrame(loop);