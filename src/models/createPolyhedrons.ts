import * as THREE from 'three';
import polyhedronParameters from '../polyhedronParameters';
import shaders from '../shaders';

export function createPolyhedrons(uniforms: any): THREE.Object3D {
    const polyhedronGroup = new THREE.Object3D();

    polyhedronParameters.forEach(item => {
        const verticesOfCube = [
            -1,-1,-1,    1,-1,-1,    1, 1,-1,    -1, 1,-1,
            -1,-1, 1,    1,-1, 1,    1, 1, 1,    -1, 1, 1,
        ];
        
        const indicesOfFaces = [
            2,1,0,    0,3,2,
            0,4,7,    7,3,0,
            0,1,5,    5,4,0,
            1,2,6,    6,5,1,
            2,3,7,    7,6,2,
            4,5,6,    6,7,4
        ];

        const polyhedronGeometry = new THREE.PolyhedronGeometry( verticesOfCube, indicesOfFaces, 6, 2 );
        const polyhedronMaterial = new THREE.ShaderMaterial({
            vertexShader: shaders.vertex,
            fragmentShader: shaders.fragment,
            uniforms: uniforms,
            wireframe: true
        });
        const polyhedronMesh = new THREE.Mesh(polyhedronGeometry, polyhedronMaterial);

        if (item.rotation.x == undefined) {
            if (item.rotation.y != undefined)
                polyhedronMesh.rotation.y = item.rotation.y;
        } else {
            polyhedronMesh.rotation.x = item.rotation.x;
        }

        polyhedronMesh.scale.set(item.scale, item.scale, item.scale);
        polyhedronMesh.position.set(item.position.x, item.position.y, item.position.z);

        polyhedronGroup.add(polyhedronMesh);
    });

    return polyhedronGroup;
}
