import * as THREE from 'three';
import { GUI } from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export function createCameraGUI(camera: THREE.PerspectiveCamera, controls: OrbitControls, panSpeed: number) {
    const gui = new GUI();
    const cameraFolder = gui.addFolder('Camera Controls');

    const cameraPosition = {
        'Move Left': () => {
            camera.position.x -= panSpeed;
            controls.update();
        },
        'Move Right': () => {
            camera.position.x += panSpeed;
            controls.update();
        },
        'Move Up': () => {
            camera.position.y += panSpeed;
            controls.update();
        },
        'Move Down': () => {
            camera.position.y -= panSpeed;
            controls.update();
        },
        'Zoom In': () => {
            camera.position.z += panSpeed;
            controls.update();
        },
        'Zoom Out': () => {
            camera.position.z -= panSpeed;
            controls.update();
        },
        'Rotate Left': () => {
            camera.position.set(32.109229475666982, 2.9325922245526577, -2.9512341599033354);
            controls.update();
        },
        'Rotate Right': () => {
            camera.position.set(-32.109229475666982, -2.9325922245526577, 2.9512341599033354);
            controls.update();
        },
        'Rotate Up': () => {
            camera.position.set(0.021265066568678027, 32.22505376356593, 4.0707690769219775);
            controls.update();
        },
        'Rotate Down': () => {
            camera.position.set(-0.021265066568678027, -32.22505376356593, -4.0707690769219775);
            controls.update();
        },
        'Rotate Back': () => {
            camera.position.set(-0.10981931997721935, 1.150738147992596, -11.284125567015448);
            controls.update();
        },
        'Rotate Front': () => {
            camera.position.set(-0.10981931997721935, 1.150738147992596, 11.284125567015448);
            controls.update();
        }
    };

    cameraFolder.add(cameraPosition, 'Move Left');
    cameraFolder.add(cameraPosition, 'Move Right');
    cameraFolder.add(cameraPosition, 'Move Up');
    cameraFolder.add(cameraPosition, 'Move Down');
    cameraFolder.add(cameraPosition, 'Zoom In');
    cameraFolder.add(cameraPosition, 'Zoom Out');
    cameraFolder.add(cameraPosition, 'Rotate Left');
    cameraFolder.add(cameraPosition, 'Rotate Right');
    cameraFolder.add(cameraPosition, 'Rotate Up');
    cameraFolder.add(cameraPosition, 'Rotate Down');
    cameraFolder.add(cameraPosition, 'Rotate Back');
    cameraFolder.add(cameraPosition, 'Rotate Front');
    cameraFolder.close(); // Initialize the folder closed

    const limitCameraMovement = () => {
        const maxX = 75; // adjust as needed
        const maxY = 75; // adjust as needed
        const maxZ = 75; // adjust as needed
        const minX = -75; // adjust as needed
        const minY = -75; // adjust as needed
        const minZ = -75; // adjust as needed

        camera.position.x = THREE.MathUtils.clamp(camera.position.x, minX, maxX);
        camera.position.y = THREE.MathUtils.clamp(camera.position.y, minY, maxY);
        camera.position.z = THREE.MathUtils.clamp(camera.position.z, minZ, maxZ);
        controls.target.x = THREE.MathUtils.clamp(controls.target.x, minX, maxX);
        controls.target.y = THREE.MathUtils.clamp(controls.target.y, minY, maxY);
        controls.target.z = THREE.MathUtils.clamp(controls.target.z, minZ, maxZ);
    };

    window.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowLeft':
                camera.rotation.x -= panSpeed;
                controls.target.x -= panSpeed;
                camera.rotation.y -= panSpeed;
                controls.target.y -= panSpeed;
                break;
            case 'ArrowUp':
                camera.position.y += panSpeed;
                controls.target.y += panSpeed;
                camera.rotation.x += panSpeed;
                controls.target.x += panSpeed;
            
                break;
            case 'ArrowRight':
                camera.position.x += panSpeed;
                controls.target.x += panSpeed;
                camera.rotation.y += panSpeed;
                controls.target.y += panSpeed;

                break;
            case 'ArrowDown':
                camera.position.y -= panSpeed;
                controls.target.y -= panSpeed;
                camera.rotation.x -= panSpeed;
                controls.target.x -= panSpeed;
                break;
            case '1':
                camera.position.z -= panSpeed;
                break;
            case '0':
                camera.position.z += panSpeed;
                break;
            case '2':
                camera.rotation.y -= panSpeed*30;// Rotate left by 10 degrees
                break;
            case '3':
                camera.rotation.y += panSpeed*30;// Rotate right by 10 degrees
                break;
            case '4':
                camera.rotation.x -= panSpeed*30;// Rotate up by 10 degrees
                break;
            case '5':
                camera.rotation.x += panSpeed*30;// Rotate down by 10 degrees
                break;
            case '7':
                camera.rotation.y += panSpeed*30;// Rotate 180 degrees
                break;
        }
        limitCameraMovement();
        controls.update();
    });
}
