import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

/**
 * Function to load and scale a GLTF model.
 * @param url - The URL of the GLTF model.
 * @param targetSize - The desired size to scale the model to.
 * @returns A promise that resolves with the loaded and scaled model.
 */
export async function loadAndScaleGLTF(url: string, targetSize: number): Promise<THREE.Group> {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();

        loader.load(
            url,
            (gltf) => {
                const model = gltf.scene;
                model.traverse((object: THREE.Object3D) => {
                    if ((object as THREE.Mesh).isMesh) {
                        object.castShadow = true;
                        object.receiveShadow = true;
                    }
                });

                // Compute the bounding box
                const boundingBox = new THREE.Box3().setFromObject(model);

                // Get the size of the bounding box
                const size = boundingBox.getSize(new THREE.Vector3());

                // Determine the scale factor
                const maxDimension = Math.max(size.x, size.y, size.z);
                const scaleFactor = targetSize / maxDimension;

                // Scale the model
                model.scale.set(scaleFactor, scaleFactor, scaleFactor);

                resolve(model);
            },
            undefined,
            (error) => {
                reject(error);
            }
        );
    });
}

/**
 * Function to load a model and add it to the scene.
 * @param scene - The Three.js scene.
 * @param modelPath - The path to the GLTF model.
 * @param params - The parameters for the model (name, position, rotation, scale, speed, size).
 * @param callback - The callback to call once the model is loaded.
 */
export async function loadModel(
    scene: THREE.Scene,
    modelPath: string,
    params: {
        name: string;
        position: THREE.Vector3;
        rotation: THREE.Euler;
        scale: THREE.Vector3;
        speed: number;
        size: number;
    },
    callback: (model: THREE.Group, name: string) => void
) {
    try {
        const { name, position, rotation, scale, size } = params;
        const model = await loadAndScaleGLTF(modelPath, size);
        model.name = name;
        model.position.copy(position);
        model.rotation.copy(rotation);
        model.scale.copy(scale);
        scene.add(model);
        callback(model, name);
    } catch (error) {
        console.error('Error loading model:', error);
    }
}
