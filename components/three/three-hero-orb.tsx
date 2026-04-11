"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Float, Sphere, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function StatueMesh() {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const modelRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("https://dvsxt5681pvqm.cloudfront.net/portfolio/models/ancient-baoule-queen-statue/source/model.glb");

  // Auto-fit: center and scale the model to fill the viewport
  useEffect(() => {
    if (!modelRef.current) return;
    const box = new THREE.Box3().setFromObject(modelRef.current);
    const size = box.getSize(new THREE.Vector3());
    const targetHeight = 3.8;
    const scale = targetHeight / size.y;
    modelRef.current.scale.setScalar(scale);
    const scaledBox = new THREE.Box3().setFromObject(modelRef.current);
    const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
    modelRef.current.position.set(-scaledCenter.x, -scaledCenter.y, -scaledCenter.z);
  }, [scene]);

  // Enhance material brightness
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (mat) {
          mat.envMapIntensity = 0.8;
          mat.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  // Animate rings only
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = state.clock.elapsedTime * 0.25;
      ringRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <Float speed={1.0} rotationIntensity={0.08} floatIntensity={0.5}>
      <group ref={groupRef}>
        {/* 3D Statue */}
        <group ref={modelRef}>
          <primitive object={scene} />
        </group>

        {/* Outer orbital ring */}
        <mesh ref={ringRef}>
          <torusGeometry args={[1.4, 0.015, 16, 120]} />
          <meshBasicMaterial color="#FF4D00" opacity={0.35} transparent />
        </mesh>

        {/* Secondary ring at angle */}
        <mesh rotation={[Math.PI / 3, 0, Math.PI / 6]}>
          <torusGeometry args={[1.8, 0.008, 16, 120]} />
          <meshBasicMaterial color="#FF4D00" opacity={0.15} transparent />
        </mesh>

        {/* Glow halo */}
        <Sphere args={[1.5, 32, 32]}>
          <meshBasicMaterial color="#FF4D00" opacity={0.04} transparent side={THREE.BackSide} />
        </Sphere>
      </group>
    </Float>
  );
}

const STATUE_URL = "https://dvsxt5681pvqm.cloudfront.net/portfolio/models/ancient-baoule-queen-statue/source/model.glb";

interface ThreeHeroOrbProps {
  className?: string;
}

export function ThreeHeroOrb({ className }: ThreeHeroOrbProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [preloaded, setPreloaded] = useState(false);

  // Preload model only when the canvas container enters the viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el || preloaded) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          useGLTF.preload(STATUE_URL);
          setPreloaded(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [preloaded]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        maskImage: "radial-gradient(ellipse 80% 85% at 50% 50%, black 55%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 85% at 50% 50%, black 55%, transparent 100%)",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 3.8], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.9} />
        <pointLight position={[3, 5, 4]} intensity={8} color="#FF4D00" />
        <pointLight position={[-4, 2, 3]} intensity={4} color="#D4A852" />
        <pointLight position={[0, 2, 5]} intensity={3} color="#ffffff" />
        <pointLight position={[0, -1, -3]} intensity={2} color="#FF4D00" />
        <pointLight position={[0, -4, 2]} intensity={2} color="#FF6A20" />

        {/* Mouse drag to rotate */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableDamping={true}
          dampingFactor={0.06}
          rotateSpeed={0.6}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI - Math.PI / 6}
        />

        <StatueMesh />
      </Canvas>
    </div>
  );
}
