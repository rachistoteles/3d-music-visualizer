import * as THREE from 'three';

export function updateModelRotation(model: THREE.Group, averageFreq: number, speed: number) {
    if (averageFreq < 50) {
        model.rotation.y += (1.5 * averageFreq / 1000) * speed/2;
        model.rotation.x += (1.5 * averageFreq / 1000) * speed/2;
    } else if (averageFreq >= 50 && averageFreq <= 70) {
        model.rotation.y += (1.5 * averageFreq / 1000) * speed/2;
        model.rotation.x += (1.5 * averageFreq / 1000) * speed/2;
    } else if (averageFreq >= 70 && averageFreq <= 100) {
        model.rotation.y += (1.35 * averageFreq / 1000) * speed/2;
        model.rotation.x += (1.35 * averageFreq / 1000)* speed/2;
    } else if (averageFreq >= 100 && averageFreq <= 115) {
        model.rotation.y += (averageFreq / 5000) * speed/2;
        model.rotation.x += (averageFreq / 5000) * speed/2;
    } else if (averageFreq >= 115 && averageFreq <= 120) {
        model.rotation.y += (2 * averageFreq / 10000) * speed/2;
        model.rotation.x += (2 * averageFreq / 10000) * speed/2;
    } else if (averageFreq >= 120 && averageFreq <= 125) {
        model.rotation.y -= (1.2 * averageFreq / 10000) * speed/2;
        model.rotation.x -= (1.2 * averageFreq / 10000) * speed/2;
    } else if (averageFreq >= 125 && averageFreq <= 140) {
        model.rotation.y -= (averageFreq / 6000) * speed/2;
        model.rotation.x -= (averageFreq / 6000) * speed/2;
    } else if (averageFreq > 140 && averageFreq <= 150) {
        model.rotation.y -= (1.3 * averageFreq / 2000) * speed/2;
        model.rotation.x -= (1.3 * averageFreq / 2000) * speed/2;
    } else {
        model.rotation.y -= (averageFreq / 1000) * speed/2;
    }
}
