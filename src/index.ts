import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createPlanes } from './models/createPlanes';
import { createSpheres } from './models/createSpheres';
import { createPolyhedrons } from './models/createPolyhedrons';
import { loadModel } from './loadModel';
import { createCameraGUI } from './cameraGUI';
import { updateBackgroundColor } from './features/backgroundColor';
import { updateCameraPosition } from './features/cameraPosition';
import { updateModelPosition } from './features/modelPosition';
import { updateModelRotation } from './features/modelRotation';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


function init(
    audio: HTMLAudioElement,
    container: HTMLElement | Window = document.body,
    includeBackgroundColor: boolean = true,
    numModels: number,
    distanceBetween: number,
    rotationSpeedOdd: number,
    rotationSpeedEven: number,
    inOrderObjects: boolean,
    features: string
) {
    const uniforms = {
        u_time: { type: 'f', value: 2.0 },
        u_amplitude: { type: 'f', value: 4.0 },
        u_data_arr: { type: 'float[64]', value: new Uint8Array() },
        u_color: { type: 'v3', value: new THREE.Color(0xffffff) },
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

        const camera = new THREE.PerspectiveCamera(75, width / height, 1, 500);
        // camera.position.set(
        //     0,
        //    0,
        //     26.827895099407762
        // );
        camera.position.set(0, 0, 30); // Position the camera

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearAlpha(0);

        const canvas = renderer.domElement;
        canvas.style.opacity = '1';
        canvas.style.transition = 'opacity 0.4s';
        _container.appendChild(canvas);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.zoomSpeed = 1.2;
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;

        // const planeGroup = createPlanes(uniforms);
        // const polyhedronGroup = createPolyhedrons(uniforms);
        // const sphereGroup = createSpheres(uniforms);
        // scene.add(sphereGroup);
        // scene.add(polyhedronGroup);
        // scene.add(planeGroup);

        scene.add(ambientLight);
        scene.add(spotLight);

        // Load the models with parameters and store them for updates
        let gltfModels: {
            model: THREE.Group;
            speed: number;
            name: string;
            scale: number;
        }[] = [];
        const addGltfModel = (
            model: THREE.Group,
            speed: number,
            name: string,
            scale: number
        ) => gltfModels.push({ model, speed, name, scale });
        const modelPaths = [
            './models/naruto/scene.gltf',
            './models/spiderman/scene.gltf',
            './models/tobi/scene.gltf',
            './models/sasuke/scene.gltf',
        ];
       


        if (features === 'Moving Rotation') {
            const speeds = [];
            const positions = [];
            const sizes = [];
            for (let i = 1; i <= numModels; i++) {
                speeds.push(i * 1.2);
                positions.push(
                    0,
                    Math.ceil(i / numModels),
                    (distanceBetween * -2 * i) / numModels
                );
                sizes.push(modelPaths[i]);
            }

            speeds.sort((a, b) => a - b);
            positions.sort((a, b) => a - b);
            

  
            for (let i = 0; i < modelPaths.length; i++) {
                const modelPath = modelPaths[i];
                const modelName = modelPath.split('/').slice(-2, -1)[0];
                //make a unique size for each one. the farther the object the smaller the size so [0] is the biggest
                let size = 1;

                const rotation = new THREE.Euler(0, 0, 0); // Set your desired rotation
                const scale = new THREE.Vector3(size, size, size);
                const speed = 1; // Set your desired speed

                const position = new THREE.Vector3(
                    -(distanceBetween * -2 * i) / numModels,
                    0,
                    Math.ceil(i / numModels)
                );

                //const speed = speeds[i];

                loadModel(
                    scene,
                    modelPath,
                    {
                        name: modelName,
                        position: position,
                        rotation: rotation,
                        scale: scale,
                        speed: speed,
                        size: size,
                    },
                    (model, name) => addGltfModel(model, speed, name, size)
                );
            }
        } else {
            let inOrderObjects = true;
            if (inOrderObjects) {
                for (let i = 1; i <= numModels; i++) {
                    const speed = i % 2 === 0 ? rotationSpeedEven : rotationSpeedOdd;
                    const modelPath = modelPaths[(i - 1) % modelPaths.length];
                    const modelName = modelPath.split('/').slice(-2, -1)[0];
                

                    let size = 1;
                    let position;
                    switch (modelName) {
                        case 'sasuke':
                            size = 0.0022;
                            position =
                                i % 2 === 0
                                    ? new THREE.Vector3(
                                        0,
                                        Math.ceil(i / numModels),
                                        (distanceBetween * -2 * i) / numModels
                                    )
                                    : new THREE.Vector3(
                                        (-distanceBetween * 2 * i) / numModels,
                                        0,
                                        Math.ceil(i / numModels)
                                    );
                            break;
                        case 'tobi':
                            size = 1.5;
                            position =
                                i % 2 === 0
                                    ? new THREE.Vector3(
                                        (-distanceBetween * 2 * i) / numModels,
                                        0,
                                        Math.ceil(i / numModels)
                                    )
                                    : new THREE.Vector3(
                                        0,
                                        -(distanceBetween * 2 * i) / numModels,

                                        Math.ceil(i / numModels)
                                    );
                            break;
                        case 'naruto':
                            size = 1.3;
                            position =
                                i % 2 === 0
                                    ? new THREE.Vector3(
                                        -(distanceBetween * -2 * i) / numModels,
                                        0,
                                        Math.ceil(i / numModels)
                                    )
                                    : new THREE.Vector3(
                                        0,
                                        -(distanceBetween * 2 * i) / numModels,

                                        Math.ceil(i / numModels)
                                    );
                            break;
                        case 'spiderman':
                            size = 1.4;
                            position =
                                i % 2 === 0
                                    ? new THREE.Vector3(
                                        -(-distanceBetween * 2 * i) / numModels,
                                        0,
                                        Math.ceil(i / numModels)
                                    )
                                    : new THREE.Vector3(
                                        -(distanceBetween * -2 * i) / numModels,
                                        0,

                                        Math.ceil(i / numModels)
                                    );
                            break;
                        default:
                            size = 1;
                            position = new THREE.Vector3(0, 0, 0);
                            break;
                    }

                    loadModel(
                        scene,
                        modelPath,
                        {
                            name: modelName,
                            position: position,
                            rotation: new THREE.Euler(0, 0, 0),
                            scale: new THREE.Vector3(size, size, size),
                            speed: speed,
                            size: size,
                        },
                        (model, name) => addGltfModel(model, speed, name, size)
                    );
                }
            } else {
                for (let i = 1; i <= numModels; i++) {
                    const speed = i % 2 === 0 ? rotationSpeedEven : rotationSpeedOdd;
                    const modelPath = modelPaths[(i - 1) % modelPaths.length];
                    const modelName = modelPath.split('/').slice(-2, -1)[0];
                    console.log(modelName);

                    let size = 1;
                    let position;
                    const sizes = [1.4, 1.3, .15, 0.0022];

                    size = sizes[(i - 1) % sizes.length];
                    position = new THREE.Vector3(
                        0,
                        Math.ceil(i / numModels),
                        (distanceBetween * 2 * i) / numModels
                    );

                    loadModel(
                        scene,
                        modelPath,
                        {
                            name: modelName,
                            position: position,
                            rotation: new THREE.Euler(0, 0, 0),
                            scale: new THREE.Vector3(size, size, size),
                            speed: speed,
                            size: size,
                        },
                        (model, name) => addGltfModel(model, speed, name, size)
                    );
                }
            }
        }
        createCameraGUI(camera, controls, 15);

        const render = () => {
            analyser.getByteFrequencyData(dataArray);
            uniforms.u_data_arr.value = dataArray;

            const averageFreq =
                dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
            const hue = Math.random() * 360;
            const saturation = 100;
            const lightness = Math.min(50, (averageFreq / 255) * 250);
            const color = new THREE.Color(
                `hsl(${hue}, ${saturation}%, ${lightness}%)`
            );
            uniforms.u_color.value = color;

            gltfModels.forEach(({ model, speed, scale }) => {
                if (features === 'Moving Rotation') {
                    model.position.x += speed;
                    model.position.y += 0;
                    model.position.z += speed;
                } else {
                    updateModelRotation(model, averageFreq, speed);
                    //updateModelPosition(model, averageFreq, 0.001);
                    
                }
            
                if (includeBackgroundColor){
                    const rotationSpeed = 0.50;
                let targetRotation: THREE.Euler = new THREE.Euler();

                const deltaPosition = averageFreq / 1000 - 0.05;
                //updateModelRotation(model, averageFreq, speed);
                if (averageFreq < 50) {
                    scene.background = new THREE.Color('red');
                    camera.rotation.x += rotationSpeed/4;
                } else if (averageFreq >= 50 && averageFreq <= 70) {
                    scene.background = new THREE.Color('blue');
                    camera.rotation.x += rotationSpeed/3;
                    camera.rotation.y += rotationSpeed/4;
                } else if (averageFreq >= 70 && averageFreq <= 100) {
                    scene.background = new THREE.Color('green');
                    camera.rotation.x += rotationSpeed/5;
                    camera.rotation.y += rotationSpeed/6;
                //  targetRotation.set(camera.rotation.x, camera.rotation.y, camera.rotation.z + Math.PI / 3);
                } else if (averageFreq >= 100 && averageFreq <= 115) {
                    scene.background = new THREE.Color('purple');
                    camera.rotation.x += rotationSpeed/2;
                    camera.rotation.y += rotationSpeed/3;
                    
                    //   targetRotation.set(camera.rotation.x + Math.PI / 3, camera.rotation.y, camera.rotation.z);
                } else if (averageFreq >= 115 && averageFreq <= 120) {
                    scene.background = new THREE.Color('yellow');
                    targetRotation.set(camera.rotation.x, camera.rotation.y + Math.PI / 3, camera.rotation.z);
                } else if (averageFreq >= 120 && averageFreq <= 125) {
                    scene.background = new THREE.Color('orange');
                    camera.rotation.z -= rotationSpeed;
                } else if (averageFreq >= 125 && averageFreq <= 140) {
                    scene.background = new THREE.Color('pink');
                    camera.rotation.x += rotationSpeed;
                    camera.rotation.y += rotationSpeed;
                } else if (averageFreq > 140 && averageFreq <= 150) {
                    scene.background = new THREE.Color('cyan');
                    camera.rotation.x += rotationSpeed;
                    camera.rotation.z += rotationSpeed;
                } else {
                    scene.background = new THREE.Color('black');
                    camera.rotation.y += rotationSpeed;
                    camera.rotation.z += rotationSpeed;
                }
                camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, targetRotation.x, 0.1);
                camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, targetRotation.y, 0.1);
                camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, targetRotation.z, 0.1);}}
        );

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

        audio.addEventListener('play', () => {
            const canvas = renderer.domElement;
            canvas.style.opacity = '1';
            clearTimeout(idTimeout);
            animate();
            audioContext.resume();
        });

        audio.addEventListener('pause', () => {
            const canvas = renderer.domElement;
            canvas.style.opacity = '0';
            idTimeout = setTimeout(
                () => cancelAnimationFrame(idRequestAnimationFrame),
                400
            );
        });

        window.addEventListener('resize', () => {
            const width = isWindow ? window.innerWidth : container.clientWidth;
            const height = isWindow ? window.innerHeight : container.clientHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        });
    }
}

export { init };
