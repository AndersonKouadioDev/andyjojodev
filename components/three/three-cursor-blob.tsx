"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function CursorBlobMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  useFrame((state) => {
    if (!meshRef.current) return;
    const mx = (state.pointer.x * viewport.width) / 2;
    const my = (state.pointer.y * viewport.height) / 2;

    meshRef.current.position.x = THREE.MathUtils.lerp(
      meshRef.current.position.x,
      mx,
      0.06
    );
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      my,
      0.06
    );
    meshRef.current.rotation.z = state.clock.elapsedTime * 0.2;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2.5, 64, 64]} />
      <MeshDistortMaterial
        color="#FF4D00"
        distort={0.6}
        speed={3}
        roughness={0}
        metalness={0}
        opacity={0.07}
        transparent
      />
    </mesh>
  );
}

interface ThreeCursorBlobProps {
  className?: string;
}

export function ThreeCursorBlob({ className }: ThreeCursorBlobProps) {
  return (
    <div className={className} style={{ pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={1} />
        <CursorBlobMesh />
      </Canvas>
    </div>
  );
}
