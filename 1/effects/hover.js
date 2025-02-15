class SpiralHoverEffect {
    constructor(options = {}) {
        this.options = {
            spiralRadius: options.spiralRadius || 2,
            spiralSpeed: options.spiralSpeed || 0.5,
            verticalSpeed: options.verticalSpeed || 0.3,
            spiralTightness: options.spiralTightness || 2,
            distortionStrength: options.distortionStrength || 0.2
        };

        this.time = 0;
    }

    update(deltaTime) {
        this.time += deltaTime;
    }

    applyEffect(position, index = 0) {
        const timeOffset = index * 0.1;
        const spiralPhase = this.time * this.options.spiralSpeed + timeOffset;
        
        // Calculate spiral motion
        const spiralX = Math.cos(spiralPhase) * this.options.spiralRadius;
        const spiralZ = Math.sin(spiralPhase) * this.options.spiralRadius;
        
        // Add vertical oscillation
        const verticalMotion = Math.sin(this.time * this.options.verticalSpeed + timeOffset) 
            * this.options.distortionStrength;

        // Create spiral distortion
        const distortionFactor = Math.sin(this.time * this.options.spiralTightness + index) 
            * this.options.distortionStrength;

        return {
            x: position.x + spiralX * distortionFactor,
            y: position.y + verticalMotion,
            z: position.z + spiralZ * distortionFactor
        };
    }

    // Helper method to create a complex hover pattern
    createHoverPattern(basePosition, time, index) {
        const pattern = this.applyEffect(basePosition, index);
        
        // Add secondary motion layers
        const secondaryPhase = time * 0.7 + index * 0.2;
        pattern.x += Math.sin(secondaryPhase) * 0.1;
        pattern.y += Math.cos(secondaryPhase * 1.3) * 0.1;
        pattern.z += Math.sin(secondaryPhase * 0.9) * 0.1;

        return pattern;
    }
}

// Usage example in MagicalEnvironment class:
/*
const hoverEffect = new SpiralHoverEffect({
    spiralRadius: 2,
    spiralSpeed: 0.5,
    verticalSpeed: 0.3,
    spiralTightness: 2,
    distortionStrength: 0.2
});

// In the animate loop:
const newPosition = hoverEffect.createHoverPattern(
    element.position,
    time,
    elementIndex
);
element.position.set(newPosition.x, newPosition.y, newPosition.z);
*/

export default SpiralHoverEffect;