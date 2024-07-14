import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { createPlanes } from "./models/createPlanes";
import { createSpheres } from "./models/createSpheres";
import { createPolyhedrons } from "./models/createPolyhedrons";
import { loadModel } from "./loadModel";
import { createCameraGUI } from "./cameraGUI";
import { updateBackgroundColor } from "./features/backgroundColor";
import { updateCameraPosition } from "./features/cameraPosition";
import { updateModelPosition } from "./features/modelPosition";
import { updateModelRotation } from "./features/modelRotation";

function init(
  audio: HTMLAudioElement,
  container: HTMLElement | Window = document.body,
  includeBackgroundColor: boolean = true,
  numModels: number,
  distanceBetween: number,
  rotationSpeedOdd: number,
  rotationSpeedEven: number,
  inOrderObjects: boolean
) {
  const uniforms = {
    u_time: { type: "f", value: 2.0 },
    u_amplitude: { type: "f", value: 4.0 },
    u_data_arr: { type: "float[64]", value: new Uint8Array() },
    u_color: { type: "v3", value: new THREE.Color(0xffffff) },
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

    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 100);
    camera.position.set(
      -0.6145785416817605,
      0.9600509884487783,
      26.827895099407762
    );

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
    let gltfModels: { model: THREE.Group; speed: number; name: string; scale:number }[] = [];

    const modelPaths = [
      "./models/sasuke/scene.gltf",
      "./models/naruto/scene.gltf",
      "./models/spiderman/scene.gltf",
      "./models/tobi/scene.gltf",
    ];
    const addGltfModel = (model: THREE.Group, speed: number, name: string, scale:number) =>
      gltfModels.push({ model, speed, name, scale });
    let inOrderObjects = true;
    if (inOrderObjects) {
      for (let i = 1; i <= numModels; i++) {
        // Adjust the loop to start at i = 1
        const speed = i % 2 === 0 ? rotationSpeedEven : rotationSpeedOdd;
        const modelPath = modelPaths[(i - 1) % modelPaths.length];
        const modelName = modelPath.split("/").slice(-2, -1)[0]; // Extract the folder name
        console.log(modelName); // Debugging output

        // Set size based on model name
        let size =1;
        let position;
        switch (modelName) {
          case "sasuke":
            size = 0.0022;
            position =
              i % 2 === 0
                ? new THREE.Vector3(
                    0,
                    Math.ceil(i / numModels),
                    (distanceBetween * -2 * i) / numModels
                  ) // Even index -> y and z-axis
                : new THREE.Vector3(
                    (-distanceBetween * 2 * i) / numModels,
                    0,
                    Math.ceil(i / numModels)
                  ); // Odd index -> x and z-axis
            break;
          case "tobi":
            size = 1.5;
            position =
              i % 2 === 0
                ? new THREE.Vector3(
                    (-distanceBetween * 2 * i) / numModels,
                    0,
                    Math.ceil(i / numModels)
                  ) // Position next to Sasuke
                : new THREE.Vector3(
                    0,
                    -(distanceBetween * 2 * i) / numModels,

                    Math.ceil(i / numModels)
                  ); // Position next to Sasuke
            break;
          case "naruto":
            size = 1.3;
            position =
              i % 2 === 0
                ? new THREE.Vector3(
                    -(distanceBetween * -2 * i) / numModels,
                    0,
                    Math.ceil(i / numModels)
                  ) // Position next to Sasuke
                : new THREE.Vector3(
                    0,
                    -(distanceBetween * 2 * i) / numModels,

                    Math.ceil(i / numModels)
                  ); // Position next to Sasuke
            break;
          case "spiderman":
            size = 1.4;
            position =
              i % 2 === 0
                ? new THREE.Vector3(
                    -(-distanceBetween * 2 * i) / numModels,
                    0,
                    Math.ceil(i / numModels)
                  ) // Position next to Sasuke
                : new THREE.Vector3(
                    -(distanceBetween * -2 * i) / numModels,
                    0,

                    Math.ceil(i / numModels)
                  ); // Position next to Sasuke
            break;
          default:
            size = 1; // Default size
            position = new THREE.Vector3(0, 0, 0); // Default position if needed
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
        // Adjust the loop to start at i = 1
        const speed = i % 2 === 0 ? rotationSpeedEven : rotationSpeedOdd;
        const modelPath = modelPaths[(i - 1) % modelPaths.length];
        const modelName = modelPath.split("/").slice(-2, -1)[0]; // Extract the folder name
        console.log(modelName); // Debugging output

        // Set size and position based on index
        let size=1;
        let position;

        // Sizes based on the model
        const sizes = [0.0022, 0.15, 1.3, 1.4];

        // Calculate size and position
        size = sizes[(i - 1) % sizes.length];
        position =
        new THREE.Vector3(
            0,
            Math.ceil(i / numModels),
            (distanceBetween * 2 * i) / numModels
          ) // Even index -> y and z-axis

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
    createCameraGUI(camera, controls, 15); // Create the camera GUI

    const render = () => {
      analyser.getByteFrequencyData(dataArray);
      uniforms.u_data_arr.value = dataArray;

      const averageFreq =
        dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
      const hue = Math.random() * 360; // Random hue value between 0 and 360
      const saturation = 100; // Full saturation
      const lightness = Math.min(50, (averageFreq / 255) * 500); // Scaled lightness between 0 and 50
      const color = new THREE.Color(
        `hsl(${hue}, ${saturation}%, ${lightness}%)`
      );
      uniforms.u_color.value = color;

      // Update GLTF models
      gltfModels.forEach(({ model, speed, scale }) => {
        const deltaPosition = averageFreq / 1000 - 0.05; // Calculate position change

         updateModelPosition(model, averageFreq, deltaPosition*scale);
        updateModelRotation(model, averageFreq, speed);
        //  updateCameraPosition(camera, averageFreq/4);
        if (includeBackgroundColor) updateBackgroundColor(scene, averageFreq);

        // Scale model based on average frequency
        //  const scaleFactor = 2 + averageFreq / 256;
        //  model.scale.set(scaleFactor, scaleFactor, scaleFactor);
      });
      // Scale model based on average frequency

      controls.update();
      renderer.render(scene, camera);
    };

    let idRequestAnimationFrame = 0;
    let idTimeout: NodeJS.Timeout;
    let animate = () => {
      idRequestAnimationFrame = requestAnimationFrame(animate);
      render();
    };

    document.getElementById("print-button")?.addEventListener("click", () => {
      console.log("Camera Position:", camera.position);
      console.log("Camera Rotation:", camera.rotation);
    });

    audio.addEventListener("play", () => {
      const canvas = renderer.domElement;
      canvas.style.opacity = "1";
      clearTimeout(idTimeout);
      animate();
      audioContext.resume();
    });

    audio.addEventListener("pause", () => {
      const canvas = renderer.domElement;
      canvas.style.opacity = "0";
      idTimeout = setTimeout(
        () => cancelAnimationFrame(idRequestAnimationFrame),
        400
      );
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

export { init };
