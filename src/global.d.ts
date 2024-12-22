import { ReactThreeFiber } from '@react-three/fiber';
import { Object3DNode } from '@react-three/fiber';
import * as THREE from 'three';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            mesh: ReactThreeFiber.Object3DNode<THREE.Mesh, typeof THREE.Mesh>;
            boxGeometry: ReactThreeFiber.Object3DNode<THREE.BoxGeometry, typeof THREE.BoxGeometry>;
            meshStandardMaterial: ReactThreeFiber.Object3DNode<
                THREE.MeshStandardMaterial,
                typeof THREE.MeshStandardMaterial
            >;
        }
    }
}