import * as THREE from 'three';

export function updateModelPosition(model: THREE.Group, averageFreq: number, deltaPosition: number) {
    if (averageFreq < 50) {
        model.scale.y += 1.5 *   deltaPosition;
        model.scale.z += 1.5 * deltaPosition;
        model.scale.x += 1.5 * deltaPosition;
    } else if (averageFreq >= 50 && averageFreq <= 70) {
        model.scale.y += 1.4 *deltaPosition;
        model.scale.z += 1.4 * deltaPosition;
        model.scale.x += 1.4 * deltaPosition;
    } else if (averageFreq >= 70 && averageFreq <= 100) {
        model.scale.y += 1.3 *deltaPosition;
        model.scale.z += 1.3 * deltaPosition;
        model.scale.x += 1.3 * deltaPosition;
    } else if (averageFreq >= 100 && averageFreq <= 115) {
        model.scale.y +=  1.2 * deltaPosition;
        model.scale.z += 1.2 * deltaPosition;
        model.scale.x += 1.2 * deltaPosition;
    } else if (averageFreq >= 115 && averageFreq <= 120) {
        model.scale.y -= 1.2 * deltaPosition;
        model.scale.z -= 1.2 * deltaPosition;
        model.scale.x -= 1.2 * deltaPosition;
    } else if (averageFreq >= 120 && averageFreq <= 125) {
        model.scale.y -= 1.3 * deltaPosition;
        model.scale.z -= 1.3 * deltaPosition;
        model.scale.x -= 1.3 * deltaPosition;
    } else if (averageFreq >= 125 && averageFreq <= 140) {
        model.scale.y -= 1.4 * deltaPosition;
        model.scale.z -= 1.4 * deltaPosition;
        model.scale.x -= 1.4 * deltaPosition;
    } else if (averageFreq > 140 && averageFreq <= 150) {
        model.scale.x -= 1.5 * deltaPosition;
        model.scale.y -= 1.5 * deltaPosition;
        model.scale.z -= 1.5 * deltaPosition;
    }

    // Constrain model position within a 5x5x5 cube
    model.scale.x = THREE.MathUtils.clamp(model.scale.x, -2.5, 2.5);
    model.scale.y = THREE.MathUtils.clamp(model.scale.y, -2.5, 2.5);
    model.scale.z = THREE.MathUtils.clamp(model.scale.z, -2.5, 2.5);
}
