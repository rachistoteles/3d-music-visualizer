import * as THREE from 'three';

export function updateBackgroundColor(scene: THREE.Scene, averageFreq: number) {
    if (averageFreq < 50) {
        scene.background = new THREE.Color('red');
    } else if (averageFreq >= 50 && averageFreq <= 70) {
        scene.background = new THREE.Color('blue');
    } else if (averageFreq >= 70 && averageFreq <= 100) {
        scene.background = new THREE.Color('green');
    } else if (averageFreq >= 100 && averageFreq <= 115) {
        scene.background = new THREE.Color('purple');
    } else if (averageFreq >= 115 && averageFreq <= 120) {
        scene.background = new THREE.Color('yellow');
    } else if (averageFreq >= 120 && averageFreq <= 125) {
        scene.background = new THREE.Color('orange');
    } else if (averageFreq >= 125 && averageFreq <= 140) {
        scene.background = new THREE.Color('pink');
    } else if (averageFreq > 140 && averageFreq <= 150) {
        scene.background = new THREE.Color('cyan');
    } else {
        scene.background = new THREE.Color('black');
    }
}
