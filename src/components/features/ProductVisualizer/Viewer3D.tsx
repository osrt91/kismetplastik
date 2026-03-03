"use client";

import { Suspense, useRef, useCallback, forwardRef, useImperativeHandle } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
} from "@react-three/drei";
import * as THREE from "three";
import { Loader2 } from "lucide-react";
import { colorMap } from "@/components/ui/ProductSVG";
import type { CategorySlug } from "@/types/product";

interface Props {
  categorySlug: CategorySlug;
  color: string;
  customHex?: string;
}

export interface Viewer3DRef {
  exportScreenshot: () => string | null;
}

function getThreeColor(colorName: string, customHex?: string): string {
  if (customHex) return customHex;
  return colorMap[colorName] || "#e8f4fd";
}

/* 3D Models — derived from Product3DViewer but without auto-rotation */

function BottleModel({ color }: { color: string }) {
  const bodyColor = new THREE.Color(color);
  const isTransparent = color === "#e8f4fd";

  return (
    <group position={[0, -0.5, 0]}>
      {/* Cap/neck */}
      <mesh position={[0, 2.3, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.4, 48]} />
        <meshPhysicalMaterial color="#1a237e" metalness={0.7} roughness={0.2} clearcoat={0.5} clearcoatRoughness={0.3} />
      </mesh>
      {/* Shoulder */}
      <mesh position={[0, 2.0, 0]}>
        <cylinderGeometry args={[0.3, 0.45, 0.4, 48]} />
        <meshPhysicalMaterial color={bodyColor} transparent={isTransparent} opacity={isTransparent ? 0.55 : 0.95} roughness={0.12} metalness={0.05} clearcoat={isTransparent ? 1 : 0.3} clearcoatRoughness={0.1} ior={1.5} thickness={isTransparent ? 0.5 : 0} envMapIntensity={1.5} />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 2.0, 48]} />
        <meshPhysicalMaterial color={bodyColor} transparent={isTransparent} opacity={isTransparent ? 0.55 : 0.95} roughness={0.12} metalness={0.05} clearcoat={isTransparent ? 1 : 0.3} clearcoatRoughness={0.1} ior={1.5} thickness={isTransparent ? 1 : 0} envMapIntensity={1.5} />
      </mesh>
      {/* Bottom */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.55, 0.50, 0.5, 48]} />
        <meshPhysicalMaterial color={bodyColor} transparent={isTransparent} opacity={isTransparent ? 0.55 : 0.95} roughness={0.12} metalness={0.05} clearcoat={isTransparent ? 1 : 0.3} />
      </mesh>
      {/* Label area */}
      <mesh position={[0, 1.1, 0.56]}>
        <boxGeometry args={[0.6, 0.9, 0.01]} />
        <meshStandardMaterial color="white" transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

function CapModel({ color }: { color: string }) {
  const bodyColor = new THREE.Color(color);
  return (
    <group>
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
  const bodyColor = new THREE.Color(color);
  const isTransparent = color === "#e8f4fd";
  return (
    <group position={[0, -0.3, 0]}>
      <mesh position={[0, 2.0, 0]}><cylinderGeometry args={[0.35, 0.35, 0.3, 32]} /><meshStandardMaterial color="#555" metalness={0.7} roughness={0.2} /></mesh>
      <mesh position={[-0.25, 2.2, 0]} rotation={[0, 0, Math.PI / 6]}><cylinderGeometry args={[0.06, 0.04, 0.4, 16]} /><meshStandardMaterial color="#666" metalness={0.8} roughness={0.2} /></mesh>
      <mesh position={[-0.45, 2.35, 0]}><sphereGeometry args={[0.06, 16, 16]} /><meshStandardMaterial color="#777" metalness={0.8} roughness={0.2} /></mesh>
      <mesh position={[0, 1.7, 0]}><cylinderGeometry args={[0.35, 0.4, 0.4, 32]} /><meshStandardMaterial color={bodyColor} transparent={isTransparent} opacity={isTransparent ? 0.6 : 0.95} roughness={0.15} metalness={0.1} /></mesh>
      <mesh position={[0, 0.6, 0]}><cylinderGeometry args={[0.4, 0.4, 1.8, 32]} /><meshStandardMaterial color={bodyColor} transparent={isTransparent} opacity={isTransparent ? 0.6 : 0.95} roughness={0.15} metalness={0.1} /></mesh>
      <mesh position={[0, -0.4, 0]}><cylinderGeometry args={[0.4, 0.35, 0.3, 32]} /><meshStandardMaterial color={bodyColor} transparent={isTransparent} opacity={isTransparent ? 0.6 : 0.95} roughness={0.15} metalness={0.1} /></mesh>
    </group>
  );
}

function PumpModel({ color }: { color: string }) {
  const bodyColor = new THREE.Color(color);
  const isTransparent = color === "#e8f4fd";
  return (
    <group position={[0, -0.3, 0]}>
      <mesh position={[0, 2.4, 0]}><cylinderGeometry args={[0.18, 0.18, 0.15, 32]} /><meshStandardMaterial color="#aaa" metalness={0.8} roughness={0.2} /></mesh>
      <mesh position={[0, 2.15, 0]}><cylinderGeometry args={[0.06, 0.06, 0.5, 16]} /><meshStandardMaterial color="#bbb" metalness={0.8} roughness={0.2} /></mesh>
      <mesh position={[0.2, 2.4, 0]} rotation={[0, 0, -Math.PI / 2]}><cylinderGeometry args={[0.04, 0.03, 0.35, 16]} /><meshStandardMaterial color="#aaa" metalness={0.8} roughness={0.2} /></mesh>
      <mesh position={[0, 1.75, 0]}><cylinderGeometry args={[0.35, 0.35, 0.3, 32]} /><meshStandardMaterial color="#888" metalness={0.6} roughness={0.3} /></mesh>
      <mesh position={[0, 0.7, 0]}><cylinderGeometry args={[0.5, 0.5, 1.8, 32]} /><meshStandardMaterial color={bodyColor} transparent={isTransparent} opacity={isTransparent ? 0.6 : 0.95} roughness={0.15} metalness={0.1} /></mesh>
      <mesh position={[0, -0.3, 0]}><cylinderGeometry args={[0.5, 0.45, 0.3, 32]} /><meshStandardMaterial color={bodyColor} transparent={isTransparent} opacity={isTransparent ? 0.6 : 0.95} roughness={0.15} metalness={0.1} /></mesh>
    </group>
  );
}

function FunnelModel({ color }: { color: string }) {
  const bodyColor = new THREE.Color(color);
  return (
    <group>
      <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.7, 0.2, 1.0, 32, 1, true]} /><meshStandardMaterial color={bodyColor} side={THREE.DoubleSide} roughness={0.3} transparent opacity={0.9} /></mesh>
      <mesh position={[0, -0.5, 0]}><cylinderGeometry args={[0.2, 0.2, 0.6, 32]} /><meshStandardMaterial color={bodyColor} roughness={0.3} transparent opacity={0.9} /></mesh>
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

function ProductModel({ category, hexColor }: { category: CategorySlug; hexColor: string }) {
  const modelType = categoryTo3DModel[category] || "bottle";
  switch (modelType) {
    case "bottle": return <BottleModel color={hexColor} />;
    case "cap": return <CapModel color={hexColor} />;
    case "spray": return <SprayModel color={hexColor} />;
    case "pump": return <PumpModel color={hexColor} />;
    case "funnel": return <FunnelModel color={hexColor} />;
    default: return <BottleModel color={hexColor} />;
  }
}

function Scene({ categorySlug, color, customHex }: Props) {
  const hexColor = getThreeColor(color, customHex);
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
      <directionalLight position={[-4, 3, -4]} intensity={0.4} />
      <pointLight position={[0, 6, 3]} intensity={0.2} color="#e0e8ff" />
      <ProductModel category={categorySlug} hexColor={hexColor} />
      <ContactShadows position={[0, -1, 0]} opacity={0.3} scale={4} blur={2.5} far={3} />
      <Environment preset="city" />
      <OrbitControls
        enablePan={false}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 1.6}
        minDistance={3}
        maxDistance={8}
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
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        <span className="text-xs text-neutral-500">3D...</span>
      </div>
    </div>
  );
}

const Viewer3D = forwardRef<Viewer3DRef, Props>(function Viewer3D(
  { categorySlug, color, customHex },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const exportScreenshot = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.toDataURL("image/png");
  }, []);

  useImperativeHandle(ref, () => ({ exportScreenshot }), [exportScreenshot]);

  return (
    <div className="relative h-full w-full">
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          ref={canvasRef}
          camera={{ position: [0, 1, 5], fov: 40 }}
          gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
          style={{ width: "100%", height: "100%" }}
        >
          <Scene categorySlug={categorySlug} color={color} customHex={customHex} />
        </Canvas>
      </Suspense>

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
});

export default Viewer3D;
