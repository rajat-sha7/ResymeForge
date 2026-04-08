"use client";
import React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Stars } from "@react-three/drei";
import * as THREE from "three";

const FloatingSphere: React.FC<{ position: [number, number, number]; color: string; speed?: number }> = ({ position, color, speed = 1 }) => {
  const meshRef = React.useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2 * speed;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3 * speed;
    }
  });
  return (
    <Float speed={speed * 2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} position={position}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial color={color} attach="material" distort={0.4} speed={2} roughness={0.2} metalness={0.8} />
      </mesh>
    </Float>
  );
};

const Particles: React.FC = () => {
  const particlesRef = React.useRef<THREE.Points>(null);
  const count = 500;
  const positions = React.useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      arr[i] = (Math.random() - 0.5) * 20;
      arr[i + 1] = (Math.random() - 0.5) * 20;
      arr[i + 2] = (Math.random() - 0.5) * 20;
    }
    return arr;
  }, [count]);
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#60a5fa" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
};

const InteractiveGalaxy: React.FC<{ mouseX: number; mouseY: number }> = ({ mouseX, mouseY }) => {
  const groupRef = React.useRef<THREE.Group>(null);
  useFrame(() => {
    if (groupRef.current) {
      const targetRotationX = (mouseY / window.innerHeight) * Math.PI * 0.3;
      const targetRotationY = (mouseX / window.innerWidth) * Math.PI * 0.3;
      groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.05;
      groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.05;
    }
  });
  return (
    <group ref={groupRef}>
      <Stars radius={50} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
      <Particles />
      <FloatingSphere position={[-4, 2, -2]} color="#8b5cf6" speed={0.8} />
      <FloatingSphere position={[4, -2, -3]} color="#3b82f6" speed={1.2} />
      <FloatingSphere position={[-3, -3, -4]} color="#06b6d4" speed={0.6} />
      <FloatingSphere position={[5, 3, -5]} color="#ec4899" speed={1} />
    </group>
  );
};

const HeroScene: React.FC<{ mouseX: number; mouseY: number }> = ({ mouseX, mouseY }) => {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 45 }} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#8b5cf6" />
      <pointLight position={[10, -10, 5]} intensity={0.5} color="#3b82f6" />
      <React.Suspense fallback={null}>
        <InteractiveGalaxy mouseX={mouseX} mouseY={mouseY} />
      </React.Suspense>
    </Canvas>
  );
};

export default HeroScene;
