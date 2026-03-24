"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Float } from "@react-three/drei";
import * as THREE from "three";

interface BlobMeshProps {
  color?: string;
  distort?: number;
  speed?: number;
}

function BlobMesh({ color = "#FF4D00", distort = 0.5, speed = 2 }: BlobMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
  });

  return (
    <Float speed={speed} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          distort={distort}
          speed={speed}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>
    </Float>
  );
}

interface ThreeBlobProps {
  className?: string;
  color?: string;
  distort?: number;
  speed?: number;
  opacity?: number;
}

export function ThreeBlob({
  className,
  color = "#FF4D00",
  distort = 0.5,
  speed = 2,
  opacity = 1,
}: ThreeBlobProps) {
  return (
    <div className={className} style={{ opacity }}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[2, 2, 2]} intensity={2} color={color} />
        <pointLight position={[-2, -2, 2]} intensity={0.5} color="#ffffff" />
        <BlobMesh color={color} distort={distort} speed={speed} />
      </Canvas>
    </div>
  );
}
