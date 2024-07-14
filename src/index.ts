import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import shaders from "./shaders";
import { createPlanes } from "./models/createPlanes";
import { createSpheres } from "./models/createSpheres";
import { createPolyhedrons } from "./models/createPolyhedrons";

function init(audio: HTMLAudioElement, container: HTMLElement | Window = document.body) {
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
            value: new THREE.Color( 0xffffff),
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
        spotLight.position.set(-10, 40, 20);
        spotLight.castShadow = true;

        const camera = new THREE.PerspectiveCamera(
            85,
            width / height,
            1,
            1000
        );
        camera.position.z = 80;

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearAlpha(0);

        const canvas = renderer.domElement;
        canvas.style.opacity = "1";
        canvas.style.transition = "opacity 0.4s";
        _container.appendChild(canvas);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.zoomSpeed = 1.2;

        const planeGroup = createPlanes(uniforms);
        const polyhedronGroup = createPolyhedrons(uniforms);
        scene.add(polyhedronGroup);
        scene.add(planeGroup);

        // const loader = new GLTFLoader();
        // loader.load(
        //     'C:/Users/racha/OneDrive/Desktop/neo_spiderman_with_new_costume_design/scene.gltf',
        //     (gltf) => {
        //         scene.add(gltf.scene);
        //     },
        //     (xhr) => {
        //         console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        //     },
        //     (error) => {
        //         console.error('An error happened', error);
        //     }
        // );

        scene.add(ambientLight);
        scene.add(spotLight);

        const render = () => {
            analyser.getByteFrequencyData(dataArray);
            uniforms.u_data_arr.value = dataArray;

            const averageFreq = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
            const hue = Math.random() * 360; // Random hue value between 0 and 360
            const saturation = 100; // Full saturation
            const lightness = Math.min(50, (averageFreq / 255) * 100); // Scaled lightness between 0 and 50
            const color = new THREE.Color(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
            uniforms.u_color.value = color;
            controls.update();
            renderer.render(scene, camera);
        }

        let idRequestAnimationFrame = 0;
        let idTimeout: NodeJS.Timeout;
        let animate = () => {
            idRequestAnimationFrame = requestAnimationFrame(animate);
            render();
        }

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

        const panSpeed = 10;

        window.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowLeft':
                    camera.position.x -= panSpeed;
                    controls.target.x -= panSpeed;
                    break;
                case 'ArrowUp':
                    camera.position.y += panSpeed;
                    controls.target.y += panSpeed;
                    break;
                case 'ArrowRight':
                    camera.position.x += panSpeed;
                    controls.target.x += panSpeed;
                    break;
                case 'ArrowDown':
                    camera.position.y -= panSpeed;
                    controls.target.y -= panSpeed;
                    break;
                case '+':
                    camera.position.z -= panSpeed;
                    break;
                case '-':
                    camera.position.z += panSpeed;
                    break;
            }
            controls.update();
        });
    }
}

module.exports = {
    init
}
