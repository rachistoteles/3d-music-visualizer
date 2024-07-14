import * as THREE from 'three';

export function updateCameraPosition(camera: THREE.PerspectiveCamera, averageFreq: number) {
    if (averageFreq < 50) {
        camera.position.set(0, 10, 50);
    } else if (averageFreq >= 50 && averageFreq <= 70) {
        camera.position.set(10, 0, 50);
    } else if (averageFreq >= 70 && averageFreq <= 100) {
        camera.position.set(0, -10, 50);
    } else if (averageFreq >= 100 && averageFreq <= 115) {
        camera.position.set(-10, 0, 50);
    } else if (averageFreq >= 115 && averageFreq <= 120) {
        camera.position.set(5, 5, 50);
    } else if (averageFreq >= 120 && averageFreq <= 125) {
        camera.position.set(-5, -5, 50);
    } else if (averageFreq >= 125 && averageFreq <= 140) {
        camera.position.set(5, -5, 50);
    } else if (averageFreq > 140 && averageFreq <= 150) {
        camera.position.set(-5, 5, 50);
    }
}
