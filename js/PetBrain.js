export class PetBrain {
    constructor() {
        this.state = {
            mood: 'neutral', // neutral, happy, sleepy, excited
            env: 'day',      // day, evening, night
        };
        this.events = new EventTarget();
    }

    init() {
        this.emit('say', "Salut !");
        this.startBlinking();
        this.startWandering();
    }

    // === State Management ===

    setMood(newMood) {
        if (this.state.mood === newMood) return;
        this.state.mood = newMood;
        this.emit('mood-change', newMood);
    }

    updateEnv(envState) {
        if (this.state.env !== envState) {
            this.state.env = envState;
            this.emit('say', this.getEnvMessage(envState));
            this.reflectAndAdapt();
        }
    }

    reflectAndAdapt() {
        if (this.state.env === 'night' && this.state.mood !== 'sleepy') {
            this.setMood('sleepy');
            this.emit('say', "Zzz...");
        } else if (this.state.env === 'evening' && this.state.mood === 'neutral') {
            this.setMood('neutral');
        }
    }

    getEnvMessage(env) {
        switch (env) {
            case 'night': return "Il se fait tard...";
            case 'evening': return "Bonne soirée !";
            case 'day': return "Bonjour !";
            default: return "...";
        }
    }

    // === Actions ===

    startBlinking() {
        const schedule = () => {
            const nextBlink = 2000 + Math.random() * 4000;
            setTimeout(() => {
                if (this.state.mood !== 'sleepy') {
                    this.emit('blink');
                }
                schedule();
            }, nextBlink);
        };
        schedule();
    }

    startWandering() {
        const wander = () => {
            if (this.state.mood === 'sleepy') {
                setTimeout(wander, 5000);
                return;
            }

            this.emit('wander');

            // Wait time handled by Physics/Coordinator usually, but Brain decides WHEN to start moving
            // For simplicity, we just emit 'wander' periodically here, 
            // OR we can let Physics report back when done. 
            // Let's keep it simple: Brain triggers wander, Physics executes.
            // But Physics needs to know when to stop/start.
            // Actually, let's let Physics handle the "how to move" and Brain just says "Move now".

            const waitTime = 3000 + Math.random() * 5000;
            setTimeout(wander, waitTime);
        };
        // Initial delay
        setTimeout(wander, 1000);
    }

    handleInteraction() {
        if (this.state.mood === 'sleepy') {
            this.setMood('neutral');
            this.emit('say', "Mmh ? Je suis réveillé.");
        } else {
            this.setMood('happy');
            this.emit('say', "Chatouilles !");
            this.emit('jump');
        }
    }

    // === Events Helper ===
    on(event, callback) {
        this.events.addEventListener(event, (e) => callback(e.detail));
    }

    emit(event, data) {
        this.events.dispatchEvent(new CustomEvent(event, { detail: data }));
    }
}
