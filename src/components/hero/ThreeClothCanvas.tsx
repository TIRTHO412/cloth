'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function ThreeClothCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Create a subtle 3D luxury mesh (an abstract ribbon/cloth geometric wave)
    const geometry = new THREE.IcosahedronGeometry(1.8, 4);
    const count = geometry.attributes.position.count;

    // Custom wireframe/particle mesh material for ultra clean Apple aesthetics
    const material = new THREE.MeshStandardMaterial({
      color: 0x111111,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
      roughness: 0.2,
      metalness: 0.8,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 2);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX = (e.clientX - innerWidth / 2) / 100;
      mouseY = (e.clientY - innerHeight / 2) / 100;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Deform mesh vertices subtly to mimic fluid fabric wave
      const positionAttribute = geometry.attributes.position;
      for (let i = 0; i < count; i++) {
        const x = positionAttribute.getX(i);
        const y = positionAttribute.getY(i);
        const z = positionAttribute.getZ(i);

        // Sinusoidal wave deformation
        const wave = Math.sin(elapsedTime * 1.2 + x * 2 + y * 2) * 0.04;
        positionAttribute.setZ(i, z + wave * 0.01);
      }
      positionAttribute.needsUpdate = true;

      // Smooth mouse follow interpolation
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      mesh.rotation.y = elapsedTime * 0.15 + targetX * 0.4;
      mesh.rotation.x = Math.sin(elapsedTime * 0.1) * 0.2 + targetY * 0.4;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 pointer-events-none z-0 opacity-60" />;
}
