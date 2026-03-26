"use client";

import { useRef, useEffect, useCallback, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

const MODEL_URL = "https://dvsxt5681pvqm.cloudfront.net/portfolio/models/sofa/sofa.glb";

// ─── 6 hotspot positions — sofa scale 6.0 ────────────────────────────────────
export const HOTSPOT_WORLD = [
  new THREE.Vector3(-1.97, 0.82, 1.10),  // coussin gauche
  new THREE.Vector3( 0.0,  0.82, 1.10),  // coussin centre
  new THREE.Vector3( 1.97, 0.82, 1.10),  // coussin droit
  new THREE.Vector3(-1.54, 1.71, 0.38),  // dossier gauche
  new THREE.Vector3( 0.0,  1.71, 0.18),  // dossier centre
  new THREE.Vector3( 1.54, 1.71, 0.38),  // dossier droit
] as const;

const CAMERA_ZOOMED = [
  { pos: [-2.6, 1.0, 4.5], target: [-2.0, 0.6, 0] },
  { pos: [ 0.0, 1.0, 4.5], target: [ 0.0, 0.6, 0] },
  { pos: [ 2.6, 1.0, 4.5], target: [ 2.0, 0.6, 0] },
  { pos: [-2.0, 1.9, 4.5], target: [-1.5, 1.5, 0] },
  { pos: [ 0.0, 1.9, 4.5], target: [ 0.0, 1.5, 0] },
  { pos: [ 2.0, 1.9, 4.5], target: [ 1.5, 1.5, 0] },
];
const CAMERA_DEFAULT = { pos: [0, 3.6, 5.5], target: [0, 0.9, 0] };

// ─── Hotspot bubble ───────────────────────────────────────────────────────────
function HotspotBubble({
  position, index, isDark, isActive, onClick,
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
    const delay = index * 0.35;
    gsap.to(coreRef.current.scale, {
      x: 1.3, y: 1.3, z: 1.3,
      duration: 1.2 + index * 0.12, repeat: -1, yoyo: true,
      ease: "sine.inOut", delay,
    });
    gsap.to(glowRef.current.scale, {
      x: 1.5, y: 1.5, z: 1.5,
      duration: 1.6 + index * 0.12, repeat: -1, yoyo: true,
      ease: "sine.inOut", delay: delay + 0.2,
    });
    if (ringRef.current) {
      gsap.to(ringRef.current.rotation, {
        z: Math.PI * 2, duration: 4 + index * 0.35, repeat: -1, ease: "none",
      });
    }
  }, [index]);

  useEffect(() => {
    if (!coreRef.current) return;
    gsap.to(coreRef.current.scale, isActive
      ? { x: 1.5, y: 1.5, z: 1.5, duration: 0.3, ease: "back.out(2)" }
      : { x: 1, y: 1, z: 1, duration: 0.3 }
    );
  }, [isActive]);

  return (
    <group
      position={[position.x, position.y, position.z]}
      onClick={(e) => { e.stopPropagation(); onClick(index); }}
      onPointerOver={() => { document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { document.body.style.cursor = "auto"; }}
    >
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshBasicMaterial color="#FF4D00" transparent opacity={isActive ? 1 : 0.92} />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.085, 16, 16]} />
        <meshBasicMaterial color="#FF4D00" transparent opacity={isDark ? 0.18 : 0.10} side={THREE.BackSide} />
      </mesh>
      <mesh ref={ringRef} rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[0.09, 0.007, 8, 28]} />
        <meshBasicMaterial color="#FF4D00" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

// ─── Sofa mesh ────────────────────────────────────────────────────────────────
function SofaMesh({ isDark }: { isDark: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_URL);

  useEffect(() => {
    if (!groupRef.current) return;
    // Reset to identity before measuring so we always use raw model dimensions
    groupRef.current.scale.setScalar(1);
    groupRef.current.position.set(0, 0, 0);
    const box = new THREE.Box3().setFromObject(groupRef.current);
    const size = box.getSize(new THREE.Vector3());
    const scale = 6.0 / size.x;
    groupRef.current.scale.setScalar(scale);

    const scaled = new THREE.Box3().setFromObject(groupRef.current);
    const center = scaled.getCenter(new THREE.Vector3());
    const min = scaled.min;
    groupRef.current.position.set(-center.x, -min.y, -center.z);
  }, [scene]);

  useEffect(() => {
    scene.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat?.isMeshStandardMaterial) {
          mat.envMapIntensity = isDark ? 0.65 : 1.4;
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

// ─── Camera controller ────────────────────────────────────────────────────────
function CameraController({
  posTarget, lookTarget,
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

// ─── Floor shadow ─────────────────────────────────────────────────────────────
function FloorShadow({ isDark }: { isDark: boolean }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
      <planeGeometry args={[14, 14]} />
      <shadowMaterial opacity={isDark ? 0.45 : 0.10} transparent />
    </mesh>
  );
}

// ─── Loading fallback ─────────────────────────────────────────────────────────
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

// ─── Scene interne ────────────────────────────────────────────────────────────
function SceneInner({
  isDark, isMobile, activeHotspot, onHotspotClick, showHotspots,
}: {
  isDark: boolean;
  isMobile: boolean;
  activeHotspot: number | null;
  onHotspotClick: (i: number) => void;
  showHotspots: boolean;
}) {
  const posTarget = useRef(new THREE.Vector3(...CAMERA_DEFAULT.pos as [number,number,number]));
  const lookTarget = useRef(new THREE.Vector3(...CAMERA_DEFAULT.target as [number,number,number]));

  const handleHotspot = useCallback((index: number) => {
    const { pos, target } = CAMERA_ZOOMED[index];
    gsap.to(posTarget.current, { x: pos[0], y: pos[1], z: pos[2], duration: 1.4, ease: "power3.inOut" });
    gsap.to(lookTarget.current, { x: target[0], y: target[1], z: target[2], duration: 1.4, ease: "power3.inOut" });
    onHotspotClick(index);
  }, [onHotspotClick]);

  useEffect(() => {
    if (activeHotspot === null) {
      const { pos, target } = CAMERA_DEFAULT;
      gsap.to(posTarget.current, { x: pos[0], y: pos[1], z: pos[2], duration: 1.1, ease: "power2.inOut" });
      gsap.to(lookTarget.current, { x: target[0], y: target[1], z: target[2], duration: 1.1, ease: "power2.inOut" });
    }
  }, [activeHotspot]);

  return (
    <>
      {/* Camera: orbit (no zoom) in showroom mode, lerp when hotspots active */}
      {showHotspots
        ? <CameraController posTarget={posTarget} lookTarget={lookTarget} />
        : <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 8}
            maxPolarAngle={Math.PI / 2.1}
            rotateSpeed={0.55}
            target={[0, 0.6, 0]}
          />
      }

      {isDark ? (
        <>
          {/* Base fill — enough to read the shape without washing it out */}
          <ambientLight intensity={0.30} color="#1a1020" />
          {/* Main key light — high and slightly right, warm white */}
          <spotLight position={[2, 5.5, 4]} intensity={60} color="#fff4e8"
            angle={0.36} penumbra={0.80} castShadow shadow-mapSize={[1024, 1024]} />
          {/* Accent fill — left side, warm orange */}
          <spotLight position={[-3, 3.5, 3.5]} intensity={22} color="#ff6020" angle={0.48} penumbra={1} />
          {/* Front warm rim — ABOVE the sofa, not below */}
          <pointLight position={[0, 1.8, 5]} intensity={8} color="#ffb060" />
        </>
      ) : (
        <>
          <ambientLight intensity={0.75} color="#fffaf5" />
          <directionalLight position={[3, 5, 4]} intensity={2.2} color="#fff5e8"
            castShadow shadow-mapSize={[1024, 1024]} />
          <directionalLight position={[-3, 3, -1]} intensity={0.9} color="#e8f0ff" />
          <pointLight position={[0, 2, 5]} intensity={0.8} color="#ffffff" />
        </>
      )}

      <FloorShadow isDark={isDark} />

      <Suspense fallback={<LoadingFallback />}>
        <SofaMesh isDark={isDark} />
      </Suspense>

      {showHotspots && HOTSPOT_WORLD.map((pos, i) => (
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

// ─── Composant public ─────────────────────────────────────────────────────────
interface ThreeSofaSceneProps {
  isDark: boolean;
  isMobile: boolean;
  activeHotspot: number | null;
  onHotspotClick: (i: number) => void;
  showHotspots?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function ThreeSofaScene({ isDark, isMobile, activeHotspot, onHotspotClick, showHotspots = true, className, style }: ThreeSofaSceneProps) {
  // Showroom mode: wider FOV + much closer camera to fill the panel
  const fov = showHotspots ? (isMobile ? 82 : 70) : 85;
  const camPos: [number, number, number] = showHotspots ? [0, 3.6, 5.5] : [0, 1.6, 3.8];
  return (
    <div className={className} style={{ touchAction: "none", ...style }}>
      <Canvas
        camera={{ position: camPos, fov }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, isMobile ? 1.5 : 2]}
        shadows="variance"
      >
        <SceneInner isDark={isDark} isMobile={isMobile} activeHotspot={activeHotspot} onHotspotClick={onHotspotClick} showHotspots={showHotspots} />
      </Canvas>
    </div>
  );
}

if (typeof window !== "undefined") {
  useGLTF.preload(MODEL_URL);
}
