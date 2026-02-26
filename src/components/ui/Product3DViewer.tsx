"use client";

import { Suspense, useState, useRef, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Float,
} from "@react-three/drei";
import * as THREE from "three";
import { Loader2, RotateCcw, Maximize2, Minimize2 } from "lucide-react";
import { colorMap } from "@/components/ui/ProductSVG";
import type { Product, CategorySlug } from "@/types/product";
import { useLocale } from "@/contexts/LocaleContext";

interface Props {
  product: Product;
  selectedColor?: string;
}

function getThreeColor(colorName: string): string {
  return colorMap[colorName] || "#e8f4fd";
}

function BottleModel({ color, roughness = 0.12 }: { color: string; roughness?: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
    }
  });

  const bodyColor = new THREE.Color(color);
  const isTransparent = color === "#e8f4fd";

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      <mesh position={[0, 2.3, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.4, 48]} />
        <meshPhysicalMaterial color="#1a237e" metalness={0.7} roughness={0.2} clearcoat={0.5} clearcoatRoughness={0.3} />
      </mesh>

      <mesh position={[0, 2.0, 0]}>
        <cylinderGeometry args={[0.3, 0.45, 0.4, 48]} />
        <meshPhysicalMaterial
          color={bodyColor}
          transparent={isTransparent}
          opacity={isTransparent ? 0.55 : 0.95}
          roughness={roughness}
          metalness={0.05}
          clearcoat={isTransparent ? 1 : 0.3}
          clearcoatRoughness={0.1}
          ior={1.5}
          thickness={isTransparent ? 0.5 : 0}
          envMapIntensity={1.5}
        />
      </mesh>

      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 2.0, 48]} />
        <meshPhysicalMaterial
          color={bodyColor}
          transparent={isTransparent}
          opacity={isTransparent ? 0.55 : 0.95}
          roughness={roughness}
          metalness={0.05}
          clearcoat={isTransparent ? 1 : 0.3}
          clearcoatRoughness={0.1}
          ior={1.5}
          thickness={isTransparent ? 1 : 0}
          envMapIntensity={1.5}
        />
      </mesh>

      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.55, 0.50, 0.5, 48]} />
        <meshPhysicalMaterial
          color={bodyColor}
          transparent={isTransparent}
          opacity={isTransparent ? 0.55 : 0.95}
          roughness={roughness}
          metalness={0.05}
          clearcoat={isTransparent ? 1 : 0.3}
          clearcoatRoughness={0.1}
        />
      </mesh>

      <mesh position={[0, 1.1, 0.56]}>
        <boxGeometry args={[0.6, 0.9, 0.01]} />
        <meshStandardMaterial color="white" transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

function CapModel({ color }: { color: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  const bodyColor = new THREE.Color(color);

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.15, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.3} metalness={0.2} />
      </mesh>

      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.58, 0.58, 0.9, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.25} metalness={0.2} />
      </mesh>

      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.58, -0.2, Math.sin(angle) * 0.58]}>
            <boxGeometry args={[0.02, 0.85, 0.06]} />
            <meshStandardMaterial color={bodyColor} roughness={0.4} metalness={0.1} />
          </mesh>
        );
      })}

      <mesh position={[0, -0.7, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.1, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.2} metalness={0.3} />
      </mesh>
    </group>
  );
}

function SprayModel({ color }: { color: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  const bodyColor = new THREE.Color(color);
  const isTransparent = color === "#e8f4fd";

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      <mesh position={[0, 2.0, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.3, 32]} />
        <meshStandardMaterial color="#555" metalness={0.7} roughness={0.2} />
      </mesh>

      <mesh position={[-0.25, 2.2, 0]} rotation={[0, 0, Math.PI / 6]}>
        <cylinderGeometry args={[0.06, 0.04, 0.4, 16]} />
        <meshStandardMaterial color="#666" metalness={0.8} roughness={0.2} />
      </mesh>

      <mesh position={[-0.45, 2.35, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#777" metalness={0.8} roughness={0.2} />
      </mesh>

      <mesh position={[0, 1.7, 0]}>
        <cylinderGeometry args={[0.35, 0.4, 0.4, 32]} />
        <meshStandardMaterial
          color={bodyColor}
          transparent={isTransparent}
          opacity={isTransparent ? 0.6 : 0.95}
          roughness={0.15}
          metalness={0.1}
        />
      </mesh>

      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 1.8, 32]} />
        <meshStandardMaterial
          color={bodyColor}
          transparent={isTransparent}
          opacity={isTransparent ? 0.6 : 0.95}
          roughness={0.15}
          metalness={0.1}
        />
      </mesh>

      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.4, 0.35, 0.3, 32]} />
        <meshStandardMaterial
          color={bodyColor}
          transparent={isTransparent}
          opacity={isTransparent ? 0.6 : 0.95}
          roughness={0.15}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}

function PumpModel({ color }: { color: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  const bodyColor = new THREE.Color(color);
  const isTransparent = color === "#e8f4fd";

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      <mesh position={[0, 2.4, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.15, 32]} />
        <meshStandardMaterial color="#aaa" metalness={0.8} roughness={0.2} />
      </mesh>

      <mesh position={[0, 2.15, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.5, 16]} />
        <meshStandardMaterial color="#bbb" metalness={0.8} roughness={0.2} />
      </mesh>

      <mesh position={[0.2, 2.4, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.03, 0.35, 16]} />
        <meshStandardMaterial color="#aaa" metalness={0.8} roughness={0.2} />
      </mesh>

      <mesh position={[0, 1.75, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.3, 32]} />
        <meshStandardMaterial color="#888" metalness={0.6} roughness={0.3} />
      </mesh>

      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 1.8, 32]} />
        <meshStandardMaterial
          color={bodyColor}
          transparent={isTransparent}
          opacity={isTransparent ? 0.6 : 0.95}
          roughness={0.15}
          metalness={0.1}
        />
      </mesh>

      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.5, 0.45, 0.3, 32]} />
        <meshStandardMaterial
          color={bodyColor}
          transparent={isTransparent}
          opacity={isTransparent ? 0.6 : 0.95}
          roughness={0.15}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}

function FunnelModel({ color }: { color: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  const bodyColor = new THREE.Color(color);

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.7, 0.2, 1.0, 32, 1, true]} />
        <meshStandardMaterial color={bodyColor} side={THREE.DoubleSide} roughness={0.3} transparent opacity={0.9} />
      </mesh>

      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.6, 32]} />
        <meshStandardMaterial color={bodyColor} roughness={0.3} transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

const categoryTo3DModel: Record<CategorySlug, "bottle" | "cap" | "spray" | "pump" | "funnel"> = {
  "pet-siseler": "bottle",
  "plastik-siseler": "bottle",
  "kapaklar": "cap",
  "tipalar": "cap",
  "parmak-spreyler": "spray",
  "pompalar": "pump",
  "tetikli-pusturtuculer": "spray",
  "huniler": "funnel",
};

function ProductModel({ category, color }: { category: CategorySlug; color: string }) {
  const modelType = categoryTo3DModel[category] || "bottle";
  const hexColor = getThreeColor(color);

  switch (modelType) {
    case "bottle":
      return <BottleModel color={hexColor} />;
    case "cap":
      return <CapModel color={hexColor} />;
    case "spray":
      return <SprayModel color={hexColor} />;
    case "pump":
      return <PumpModel color={hexColor} />;
    case "funnel":
      return <FunnelModel color={hexColor} />;
    default:
      return <BottleModel color={hexColor} />;
  }
}

function Scene({ product, selectedColor }: Props) {
  const color = selectedColor || product.colors[0] || "Şeffaf";

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-4, 3, -4]} intensity={0.4} />
      <pointLight position={[0, 6, 3]} intensity={0.2} color="#e0e8ff" />

      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.2}>
        <ProductModel category={product.category} color={color} />
      </Float>

      <ContactShadows
        position={[0, -1, 0]}
        opacity={0.35}
        scale={4}
        blur={2}
        far={3}
      />

      <Environment preset="city" />

      <OrbitControls
        enablePan={false}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 1.6}
        minDistance={3.5}
        maxDistance={7}
        autoRotate
        autoRotateSpeed={0.8}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
}

function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        <span className="text-xs text-neutral-400">3D...</span>
      </div>
    </div>
  );
}

export default function Product3DViewer({ product, selectedColor }: Props) {
  const { dict } = useLocale();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen && containerRef.current) {
      containerRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, [isFullscreen]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-2xl border border-slate-200/60 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none" : ""
      }`}
      style={{ minHeight: isFullscreen ? "100vh" : 420 }}
    >
      <div className="absolute right-3 top-3 z-10 flex gap-2">
        <button
          onClick={toggleFullscreen}
          className="rounded-xl bg-white/80 p-2 text-slate-600 shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-blue-600"
          aria-label={isFullscreen ? dict.components.reset : dict.components.zoomIn}
        >
          {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
      </div>

      <div className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2">
        <span className="rounded-full bg-white/70 px-3 py-1 text-[10px] font-medium text-slate-400 backdrop-blur-sm">
          360° · {dict.components.zoomIn}
        </span>
      </div>

      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          camera={{ position: [0, 1, 5], fov: 40 }}
          style={{ width: "100%", height: "100%", minHeight: isFullscreen ? "100vh" : 420 }}
          gl={{ antialias: true, alpha: true }}
        >
          <Scene product={product} selectedColor={selectedColor} />
        </Canvas>
      </Suspense>
    </div>
  );
}
