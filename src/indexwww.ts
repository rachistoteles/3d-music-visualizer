import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


async function main() {
    // Get a reference to the container element
    const container = document.querySelector('body');
    
    // Create a new scene
    const scene = new THREE.Scene();
    
    // Create a camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Create a renderer and add it to the DOM
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Add the renderer to the container if it exists
    if (container) {    
        container.appendChild(renderer.domElement);
    } else {
        console.error("Container element not found.");
    }

    // Add ambient light to the scene
    const ambientLight = new THREE.AmbientLight(0x404040, 3); // Soft white light
    scene.add(ambientLight);

    // Add directional light to the scene
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10).normalize();
    scene.add(directionalLight);

    // Load the GLTF model
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync('src/models/RobotExpressive.glb');

    // Extract the model and add it to the scene
    const model = gltf.scene;
    scene.add(model);

    // Set up the animation mixer
    const mixer = new THREE.AnimationMixer(model);
    gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
    });

    // Animation loop
    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);

        // Update the mixer on each frame
        const delta = clock.getDelta();
        mixer.update(delta);

        renderer.render(scene, camera);
    }

    // Start the animation loop
    animate();
}

// Handle potential errors
main().catch(err => {
    console.error(err);
});
