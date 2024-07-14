import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import shaders from "./shaders";
import { createPlanes } from "./models/createPlanes";
import { createSpheres } from "./models/createSpheres";
import { createPolyhedrons } from "./models/createPolyhedrons";
import { loadModel } from "./loadModel";
import { createCameraGUI } from "./cameraGUI";
import { updateBackgroundColor } from "./features/backgroundColor";
import { updateCameraPosition } from "./features/cameraPosition";
import { updateModelPosition } from "./features/modelPosition";
import { updateModelRotation } from "./features/modelRotation";

function init(audio: HTMLAudioElement, container: HTMLElement | Window = document.body, includeBackgroundColor: boolean = true) {
    const uniforms = {
        u_time: {
            type: "f",
            value: 2.0,
        },
        u_amplitude: {
            type: "f",
            value: 4.0,
        },
        u_data_arr: {
            type: "float[64]",
            value: new Uint8Array(),
        },
        u_color: {
            type: "v3",
            value: new THREE.Color(0xffffff),
        },
    };

    const audioContext = new window.AudioContext();
    const source = audioContext.createMediaElementSource(audio);
    const analyser = audioContext.createAnalyser();
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 1024;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    _initThree();

    function _initThree() {
        const isWindow = container instanceof Window;
        const _container = isWindow ? document.body : container;
        const width = isWindow ? window.innerWidth : container.clientWidth;
        const height = isWindow ? window.innerHeight : container.clientHeight;
        const scene = new THREE.Scene();

        const ambientLight = new THREE.AmbientLight(0x87ceeb); // Light Blue
        ambientLight.castShadow = false;

        const spotLight = new THREE.SpotLight(0xffffff);
        spotLight.intensity = 0.6;
        spotLight.position.set(10, 40, 20);
        spotLight.castShadow = true;

        const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
        camera.position.set(-0.6145785416817605, 0.9600509884487783, 26.827895099407762);

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearAlpha(0);

        const canvas = renderer.domElement;
        canvas.style.opacity = "1";
        canvas.style.transition = "opacity 0.4s";
        _container.appendChild(canvas);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.zoomSpeed = 1.2;
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;

        const planeGroup = createPlanes(uniforms);
        const polyhedronGroup = createPolyhedrons(uniforms);
        const sphereGroup = createSpheres(uniforms);
        scene.add(sphereGroup);
        scene.add(polyhedronGroup);
        scene.add(planeGroup);

        scene.add(ambientLight);
        scene.add(spotLight);

        // Load the models with parameters and store them for updates
        let gltfModels: { model: THREE.Group, speed: number }[] = [];
        const addGltfModel = (model: THREE.Group, speed: number) => gltfModels.push({ model, speed });

        loadModel(scene, './models/spiderman/scene.gltf', {
            position: new THREE.Vector3(0, 0, 0),
            rotation: new THREE.Euler(0, 0, 0),
            scale: new THREE.Vector3(2, 2, 2),
            speed: 1
        }, addGltfModel);

        loadModel(scene, './models/naruto/scene.gltf', {
            position: new THREE.Vector3(-60, -60, 0),
            rotation: new THREE.Euler(0, 0, 0),
            scale: new THREE.Vector3(2, 2, 2),
            speed: 1.3
        }, addGltfModel);

        loadModel(scene, './models/naruto/scene.gltf', {
            position: new THREE.Vector3(60, 60, 0),
            rotation: new THREE.Euler(0, 0, 0),
            scale: new THREE.Vector3(2, 2, 2),
            speed: 1.3
        }, addGltfModel);

        createCameraGUI(camera, controls, 15); // Create the camera GUI

        const render = () => {
            analyser.getByteFrequencyData(dataArray);
            uniforms.u_data_arr.value = dataArray;

            const averageFreq = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
            const hue = Math.random() * 360; // Random hue value between 0 and 360
            const saturation = 100; // Full saturation
            const lightness = Math.min(50, (averageFreq / 255) * 100); // Scaled lightness between 0 and 50
            const color = new THREE.Color(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
            uniforms.u_color.value = color;

            // Update GLTF models
            gltfModels.forEach(({ model, speed }) => {
                const deltaPosition = (averageFreq / 1000) - 0.05; // Calculate position change

                updateModelPosition(model, averageFreq, deltaPosition);
                updateModelRotation(model, averageFreq, speed);
             //   updateCameraPosition(camera, averageFreq);
                if (includeBackgroundColor) updateBackgroundColor(scene, averageFreq);

                // Scale model based on average frequency
                const scaleFactor = 2 + (averageFreq / 256);
                model.scale.set(scaleFactor, scaleFactor, scaleFactor);
            });

            controls.update();
            renderer.render(scene, camera);
        };

        let idRequestAnimationFrame = 0;
        let idTimeout: NodeJS.Timeout;
        let animate = () => {
            idRequestAnimationFrame = requestAnimationFrame(animate);
            render();
        };

        document.getElementById('print-button')?.addEventListener('click', () => {
            console.log('Camera Position:', camera.position);
            console.log('Camera Rotation:', camera.rotation);
        });

        audio.addEventListener("play", () => {
            canvas.style.opacity = "1";
            clearTimeout(idTimeout);
            animate();
            audioContext.resume();
        });

        audio.addEventListener("pause", () => {
            canvas.style.opacity = "0";
            idTimeout = setTimeout(() => cancelAnimationFrame(idRequestAnimationFrame), 400);
        });

        window.addEventListener("resize", () => {
            const width = isWindow ? window.innerWidth : container.clientWidth;
            const height = isWindow ? window.innerHeight : container.clientHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        });
    }
}

module.exports = {
    init
}
