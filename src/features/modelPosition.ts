import * as THREE from 'three';

export function updateModelPosition(model: THREE.Group, averageFreq: number, deltaPosition: number) {
    if (averageFreq < 50) {
        model.position.y += 2.5 * deltaPosition;
        model.position.z += 2.5 * deltaPosition;
    } else if (averageFreq >= 50 && averageFreq <= 70) {
        model.position.y += 1.6 * deltaPosition;
        model.position.z += 1.6 * deltaPosition;
    } else if (averageFreq >= 70 && averageFreq <= 100) {
        model.position.y += 1.5 * deltaPosition;
        model.position.z += 1.5 * deltaPosition;
    } else if (averageFreq >= 100 && averageFreq <= 115) {
        model.position.y += 1.2 * deltaPosition;
        model.position.z += 1.2 * deltaPosition;
    } else if (averageFreq >= 115 && averageFreq <= 120) {
        model.position.y -= 1.2 * deltaPosition;
        model.position.z -= 1.2 * deltaPosition;
    } else if (averageFreq >= 120 && averageFreq <= 125) {
        model.position.y -= 1.5 * deltaPosition;
        model.position.z -= 1.5 * deltaPosition;
    } else if (averageFreq >= 125 && averageFreq <= 140) {
        model.position.y -= 1.6 * deltaPosition;
        model.position.z -= 1.6 * deltaPosition;
    } else if (averageFreq > 140 && averageFreq <= 150) {
        model.position.y -= 3 * deltaPosition;
        model.position.z -= 3 * deltaPosition;
    }

    // Constrain model position within a 5x5x5 cube
    model.position.x = THREE.MathUtils.clamp(model.position.x, -2.5, 2.5);
    model.position.y = THREE.MathUtils.clamp(model.position.y, -2.5, 2.5);
    model.position.z = THREE.MathUtils.clamp(model.position.z, -2.5, 2.5);
}
