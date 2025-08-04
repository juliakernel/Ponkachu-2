// Sound Manager for the game
class SoundManager {
    private audioContext: AudioContext | null = null;
    private sounds: Map<string, AudioBuffer> = new Map();
    private isMuted: boolean = false;
    private volume: number = 0.5;

    constructor() {
        this.initAudioContext();
    }

    private async initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            await this.loadSounds();
        } catch (error) {
            console.warn('Audio context not supported:', error);
        }
    }

    private async loadSounds() {
        if (!this.audioContext) return;

        const soundFiles = [
            { name: 'background', path: '/sounds/background.mp3' },
            { name: 'cardSelect', path: '/sounds/card-select.mp3' },
            { name: 'cardMatch', path: '/sounds/card-match.mp3' },
            { name: 'cardNotMatch', path: '/sounds/card-not-match.mp3' },
            { name: 'timeUp', path: '/sounds/time-up.mp3' },
            { name: 'levelComplete', path: '/sounds/level-complete.mp3' },
            { name: 'gameVictory', path: '/sounds/game-victory.mp3' },
        ];

        try {
            const loadPromises = soundFiles.map(async ({ name, path }) => {
                const response = await fetch(path);
                const arrayBuffer = await response.arrayBuffer();
                const audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer);
                this.sounds.set(name, audioBuffer);
            });

            await Promise.all(loadPromises);
            console.log('All sounds loaded successfully');
        } catch (error) {
            console.error('Error loading sounds:', error);
        }
    }

    private playSound(soundName: string, options: {
        volume?: number;
        loop?: boolean;
        rate?: number;
    } = {}) {
        if (this.isMuted || !this.audioContext || !this.sounds.has(soundName)) {
            return null;
        }

        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();

        source.buffer = this.sounds.get(soundName)!;
        source.loop = options.loop || false;
        source.playbackRate.value = options.rate || 1;

        gainNode.gain.value = (options.volume || 1) * this.volume;

        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        source.start(0);
        return { source, gainNode };
    }

    // Public methods
    playCardSelect() {
        return this.playSound('cardSelect', { volume: 0.6 });
    }

    playCardMatch() {
        return this.playSound('cardMatch', { volume: 0.8 });
    }

    playCardNotMatch() {
        return this.playSound('cardNotMatch', { volume: 0.5 });
    }

    playTimeUp() {
        return this.playSound('timeUp', { volume: 0.7 });
    }

    playLevelComplete() {
        return this.playSound('levelComplete', { volume: 0.8 });
    }

    playGameVictory() {
        return this.playSound('gameVictory', { volume: 0.9 });
    }

    playBackgroundMusic() {
        return this.playSound('background', { volume: 0.3, loop: true });
    }

    stopBackgroundMusic() {
        // Background music is handled separately
        // This would need to be implemented with a reference to the playing source
    }

    // Volume control
    setVolume(volume: number) {
        this.volume = Math.max(0, Math.min(1, volume));
    }

    getVolume(): number {
        return this.volume;
    }

    // Mute control
    mute() {
        this.isMuted = true;
    }

    unmute() {
        this.isMuted = false;
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }

    isMutedState(): boolean {
        return this.isMuted;
    }

    // Resume audio context (needed for browser autoplay policies)
    resumeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }
}

// Create singleton instance
const soundManager = new SoundManager();

export default soundManager; 