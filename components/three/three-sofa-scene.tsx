"use client";

import { useRef, useEffect, useCallback, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

// ─── Hotspot positions (world space, after sofa auto-fit to width 3.5) ───────
export const HOTSPOT_WORLD = [
  new THREE.Vector3(-1.05, 0.52, 0.4),  // left cushion
  new THREE.Vector3(0.0,  0.68, 0.15),  // center back
  new THREE.Vector3(1.0,  0.52, 0.4),   // right cushion
] as const;

const CAMERA_ZOOMED = [
  { pos: [-1.4, 1.0, 3.6], target: [-1.0, 0.4, 0] },
  { pos: [0.0,  1.1, 3.6], target: [0.0,  0.4, 0] },
  { pos: [1.4,  1.0, 3.6], target: [1.0,  0.4, 0] },
];
const CAMERA_DEFAULT = { pos: [0, 0.85, 5.2], target: [0, 0.35, 0] };

// ─── Hotspot bubble ───────────────────────────────────────────────────────────
function HotspotBubble({
  position,
  index,
  isDark,
  isActive,
  onClick,
}: {
  position: THREE.Vector3;
  index: number;
  isDark: boolean;
  isActive: boolean;
  onClick: (i: number) => void;
}) {
  const coreRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (!coreRef.current || !glowRef.current) return;
    const delay = index * 0.55;

    // Breathing
    gsap.to(coreRef.current.scale, {
      x: 1.35, y: 1.35, z: 1.35,
      duration: 1.3 + index * 0.18,
      repeat: -1, yoyo: true,
      ease: "sine.inOut",
      delay,
    });
    gsap.to(glowRef.current.scale, {
      x: 1.6, y: 1.6, z: 1.6,
      duration: 1.7 + index * 0.18,
      repeat: -1, yoyo: true,
      ease: "sine.inOut",
      delay: delay + 0.25,
    });
    // Slow ring rotation
    if (ringRef.current) {
      gsap.to(ringRef.current.rotation, {
        z: Math.PI * 2,
        duration: 4 + index * 0.5,
        repeat: -1,
        ease: "none",
      });
    }
  }, [index]);

  // Pulse on active
  useEffect(() => {
    if (!coreRef.current) return;
    if (isActive) {
      gsap.to(coreRef.current.scale, { x: 1.6, y: 1.6, z: 1.6, duration: 0.3, ease: "back.out(2)" });
    } else {
      gsap.to(coreRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
    }
  }, [isActive]);

  return (
    <group
      position={[position.x, position.y, position.z]}
      onClick={(e) => { e.stopPropagation(); onClick(index); }}
      onPointerOver={() => document.body.style.cursor = "pointer"}
      onPointerOut={() => document.body.style.cursor = "auto"}
    >
      {/* Core sphere */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.072, 20, 20]} />
        <meshBasicMaterial color="#FF4D00" transparent opacity={isActive ? 1 : 0.92} />
      </mesh>

      {/* Outer glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.13, 20, 20]} />
        <meshBasicMaterial
          color="#FF4D00"
          transparent
          opacity={isDark ? 0.20 : 0.12}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Orbit ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[0.14, 0.009, 8, 32]} />
        <meshBasicMaterial color="#FF4D00" transparent opacity={0.55} />
      </mesh>

      {/* Number label (simple plane with index) */}
      <mesh position={[0, 0.2, 0]}>
        <planeGeometry args={[0, 0]} />
      </mesh>
    </group>
  );
}

// ─── Sofa mesh ────────────────────────────────────────────────────────────────
function SofaMesh({ isDark }: { isDark: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("https://dvsxt5681pvqm.cloudfront.net/portfolio/models/sofa/sofa.glb");

  // Auto-fit: center + scale to width 3.5
  useEffect(() => {
    if (!groupRef.current) return;
    const box = new THREE.Box3().setFromObject(groupRef.current);
    const size = box.getSize(new THREE.Vector3());
    const scale = 3.5 / size.x;
    groupRef.current.scale.setScalar(scale);

    const scaled = new THREE.Box3().setFromObject(groupRef.current);
    const center = scaled.getCenter(new THREE.Vector3());
    const min = scaled.min;
    groupRef.current.position.set(-center.x, -min.y, -center.z);
  }, [scene]);

  // Theme-aware material brightness
  useEffect(() => {
    scene.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat && mat.isMeshStandardMaterial) {
          mat.envMapIntensity = isDark ? 0.35 : 1.4;
          mat.roughness = isDark ? mat.roughness : Math.min(mat.roughness + 0.05, 1);
          mat.needsUpdate = true;
        }
      }
    });
  }, [scene, isDark]);

  return (
    <group ref={groupRef} receiveShadow castShadow>
      <primitive object={scene} />
    </group>
  );
}

// ─── Camera controller: GSAP → ref → lerp to real camera ─────────────────────
function CameraController({
  posTarget,
  lookTarget,
}: {
  posTarget: React.MutableRefObject<THREE.Vector3>;
  lookTarget: React.MutableRefObject<THREE.Vector3>;
}) {
  const { camera } = useThree();
  const _look = useRef(new THREE.Vector3());

  useFrame(() => {
    camera.position.lerp(posTarget.current, 0.06);
    _look.current.lerp(lookTarget.current, 0.06);
    camera.lookAt(_look.current);
  });

  return null;
}

// ─── Floor shadow catcher ─────────────────────────────────────────────────────
function FloorShadow({ isDark }: { isDark: boolean }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
      <planeGeometry args={[12, 12]} />
      <shadowMaterial opacity={isDark ? 0.45 : 0.12} transparent />
    </mesh>
  );
}

// ─── Fallback while model loads ───────────────────────────────────────────────
function LoadingFallback() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (meshRef.current) meshRef.current.rotation.y = s.clock.elapsedTime * 0.5;
  });
  return (
    <mesh ref={meshRef} position={[0, 0.3, 0]}>
      <boxGeometry args={[2.5, 0.55, 0.9]} />
      <meshBasicMaterial color="#FF4D00" wireframe opacity={0.3} transparent />
    </mesh>
  );
}

// ─── Inner scene (needs useThree, must be inside Canvas) ─────────────────────
function SceneInner({
  isDark,
  isMobile,
  activeHotspot,
  onHotspotClick,
}: {
  isDark: boolean;
  isMobile: boolean;
  activeHotspot: number | null;
  onHotspotClick: (i: number) => void;
}) {
  const posTarget = useRef(new THREE.Vector3(...CAMERA_DEFAULT.pos as [number,number,number]));
  const lookTarget = useRef(new THREE.Vector3(...CAMERA_DEFAULT.target as [number,number,number]));

  const handleHotspot = useCallback(
    (index: number) => {
      const { pos, target } = CAMERA_ZOOMED[index];
      gsap.to(posTarget.current, { x: pos[0], y: pos[1], z: pos[2], duration: 1.4, ease: "power3.inOut" });
      gsap.to(lookTarget.current, { x: target[0], y: target[1], z: target[2], duration: 1.4, ease: "power3.inOut" });
      onHotspotClick(index);
    },
    [onHotspotClick]
  );

  // Reset camera when card is closed
  useEffect(() => {
    if (activeHotspot === null) {
      const { pos, target } = CAMERA_DEFAULT;
      gsap.to(posTarget.current, { x: pos[0], y: pos[1], z: pos[2], duration: 1.1, ease: "power2.inOut" });
      gsap.to(lookTarget.current, { x: target[0], y: target[1], z: target[2], duration: 1.1, ease: "power2.inOut" });
    }
  }, [activeHotspot]);

  return (
    <>
      <CameraController posTarget={posTarget} lookTarget={lookTarget} />

      {/* ── Lighting ── */}
      {isDark ? (
        <>
          <ambientLight intensity={0.12} color="#0d0812" />
          <spotLight
            position={[1.5, 4.5, 3.5]}
            intensity={45}
            color="#fff8f0"
            angle={0.38}
            penumbra={0.85}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <spotLight position={[-2.5, 3, 4]} intensity={18} color="#ff6a20" angle={0.5} penumbra={1} />
          <pointLight position={[0, -0.3, 2.5]} intensity={4} color="#ff4d00" />
        </>
      ) : (
        <>
          <ambientLight intensity={0.75} color="#fffaf5" />
          <directionalLight
            position={[3, 5, 4]}
            intensity={2.2}
            color="#fff5e8"
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <directionalLight position={[-3, 3, -1]} intensity={0.9} color="#e8f0ff" />
          <pointLight position={[0, 2, 5]} intensity={0.8} color="#ffffff" />
        </>
      )}

      <FloorShadow isDark={isDark} />

      {/* ── Sofa model ── */}
      <Suspense fallback={<LoadingFallback />}>
        <SofaMesh isDark={isDark} />
      </Suspense>

      {/* ── Hotspot bubbles ── */}
      {HOTSPOT_WORLD.map((pos, i) => (
        <HotspotBubble
          key={i}
          position={pos}
          index={i}
          isDark={isDark}
          isActive={activeHotspot === i}
          onClick={handleHotspot}
        />
      ))}
    </>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────
interface ThreeSofaSceneProps {
  isDark: boolean;
  isMobile: boolean;
  activeHotspot: number | null;
  onHotspotClick: (i: number) => void;
  className?: string;
}

export function ThreeSofaScene({
  isDark,
  isMobile,
  activeHotspot,
  onHotspotClick,
  className,
}: ThreeSofaSceneProps) {
  const fov = isMobile ? 70 : 52;

  return (
    <div className={className} style={{ touchAction: "none" }}>
      <Canvas
        camera={{ position: [0, 0.85, 5.2], fov }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, isMobile ? 1.5 : 2]}
        shadows="variance"
      >
        <SceneInner
          isDark={isDark}
          isMobile={isMobile}
          activeHotspot={activeHotspot}
          onHotspotClick={onHotspotClick}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload("https://dvsxt5681pvqm.cloudfront.net/portfolio/models/sofa/sofa.glb");
