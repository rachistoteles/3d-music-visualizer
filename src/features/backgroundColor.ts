import * as THREE from 'three';

export function updateBackgroundColor(scene: THREE.Scene, camera: THREE.Camera, averageFreq: number) {
    // Set a default rotation speed for smooth transitions
    const rotationSpeed = 0.10;
    let targetRotation: THREE.Euler = new THREE.Euler();

    if (averageFreq < 50) {
        scene.background = new THREE.Color('red');
      
    } else if (averageFreq >= 50 && averageFreq <= 70) {
        scene.background = new THREE.Color('blue');
    } else if (averageFreq >= 70 && averageFreq <= 100) {
        scene.background = new THREE.Color('green');
        targetRotation.set(camera.rotation.x + Math.PI*rotationSpeed / 2, camera.rotation.y + Math.PI*rotationSpeed / 2, camera.rotation.z);

    } else if (averageFreq >= 100 && averageFreq <= 115) {
        scene.background = new THREE.Color('purple');
        targetRotation.set(camera.rotation.x + Math.PI*rotationSpeed / 2, -camera.position.y, camera.position.z + Math.PI*rotationSpeed / 2);

    } else if (averageFreq >= 115 && averageFreq <= 120) {
        scene.background = new THREE.Color('yellow');
        targetRotation.set(-camera.rotation.x + -Math.PI*rotationSpeed / 2, -camera.rotation.y + Math.PI*-rotationSpeed / 2, -camera.rotation.z);

    } else if (averageFreq >= 120 && averageFreq <= 125) {
        scene.background = new THREE.Color('orange');
        targetRotation.set(-camera.rotation.x + Math.PI*-rotationSpeed / 2, camera.position.y, -camera.position.z + Math.PI*-rotationSpeed / 2);

    } else if (averageFreq >= 125 && averageFreq <= 140) {
        scene.background = new THREE.Color('pink');
    } else if (averageFreq > 140 && averageFreq <= 150) {
        scene.background = new THREE.Color('cyan');
    } else {
        scene.background = new THREE.Color('black');
    }

    // Smoothly interpolate the camera rotation towards the target rotation
    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, targetRotation.x, 1);
    camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, targetRotation.y, 1);
    camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, targetRotation.z, 1);
}
