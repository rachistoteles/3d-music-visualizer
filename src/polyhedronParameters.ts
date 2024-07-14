// Type of Polyhedron's parameters
type PolyhedronParameters = {
    rotation: { x?: number, y?: number, z?: number },
    scale: number,
    position: { x: number, y: number, z: number }
};

// Array of Polyhedron's parameters
const polyhedronParameters: PolyhedronParameters[] = [
    {
        rotation: {
            x: Math.PI / 4,
        },
        scale: 2,
        position: {
            x: 0,
            y: 30,
            z: 0
        }
    },
    {
        rotation: {
            y: Math.PI / 6,
        },
        scale: 3,
        position: {
            x: 50,
            y: -30,
            z: 10
        }
    },
    {
        rotation: {
            z: Math.PI / 3,
        },
        scale: 1.5,
        position: {
            x: -50,
            y: 20,
            z: -20
        }
    },
    {
        rotation: {
            x: Math.PI / 5,
            y: Math.PI / 5
        },
        scale: 2.5,
        position: {
            x: 30,
            y: -50,
            z: 40
        }
    }
];

export default polyhedronParameters;
