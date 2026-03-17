// app/components/PrivacyAnimation.js

"use client"; // Marks this as a Client Component, allowing the use of hooks

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';

// The animating 3D shape
function AnimatedShape() {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[2, 0]} />
      <meshStandardMaterial color="#a78bfa" wireframe />
    </mesh>
  );
}

// The component that sets up the 3D canvas
export default function PrivacyAnimation() {
  return (
    <div className="absolute inset-0 z-0 h-full w-full">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={1.5} />
        <AnimatedShape />
      </Canvas>
    </div>
  );
}