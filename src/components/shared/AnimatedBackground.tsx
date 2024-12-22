'use client';
import { useRef } from 'react';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import type { Mesh } from 'three';

function AnimatedCube() {
    const meshRef = useRef<Mesh>(null);

    useFrame((_state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta;
            meshRef.current.rotation.y += delta * 0.5;
        }
    });

    return (
        <mesh ref={meshRef}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="royalblue" />
        </mesh>
    );
}

export function AnimatedBackground() {
    return (
        <div className="fixed inset-0 -z-10">
            <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <AnimatedCube />
            </Canvas>
        </div>
    );
}