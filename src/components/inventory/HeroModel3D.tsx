import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useGame } from '../../context/GameContext';

interface HeroModel3DProps {
  rotationAngle: number;
  onRotationChange?: (angle: number) => void;
}

export const HeroModel3D: React.FC<HeroModel3DProps> = ({ rotationAngle, onRotationChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { activeHero } = useGame();

  const [isDragging, setIsDragging] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [auraMode, setAuraMode] = useState<'normal' | 'awakened' | 'celestial'>('awakened');
  const heroGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 280;
    const height = container.clientHeight || 320;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 100);
    camera.position.set(0, 1.35, 4.3);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const config = activeHero.modelConfig;

    // Lights
    const ambientLight = new THREE.AmbientLight(0x281e4a, 2.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(config.visorColor, 3.4);
    keyLight.position.set(2, 4, 3);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(config.weaponColor, 4.5, 12);
    rimLight.position.set(-2, 2.5, -2);
    scene.add(rimLight);

    // Hero Group
    const hero = new THREE.Group();
    hero.position.set(0, -0.05, 0);

    const armorMat = new THREE.MeshStandardMaterial({
      color: config.armorColor,
      metalness: 0.92,
      roughness: 0.14,
      emissive: config.armorColor,
      emissiveIntensity: auraMode === 'celestial' ? 0.55 : 0.25,
    });

    // 1. Helmet & Cyber Crown
    const headGeo = new THREE.CylinderGeometry(0.28, 0.32, 0.5, 8);
    const head = new THREE.Mesh(headGeo, armorMat);
    head.position.set(0, 2.0, 0);
    hero.add(head);

    const visorGeo = new THREE.BoxGeometry(0.36, 0.09, 0.14);
    const visorMat = new THREE.MeshBasicMaterial({ color: config.visorColor });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 2.05, 0.28);
    hero.add(visor);

    // Cyber Horns / Fin on Helmet
    const crestGeo = new THREE.ConeGeometry(0.08, 0.38, 4);
    const crestMat = new THREE.MeshBasicMaterial({ color: config.weaponColor });
    const leftCrest = new THREE.Mesh(crestGeo, crestMat);
    leftCrest.position.set(-0.22, 2.3, 0);
    leftCrest.rotation.z = 0.35;
    const rightCrest = new THREE.Mesh(crestGeo, crestMat);
    rightCrest.position.set(0.22, 2.3, 0);
    rightCrest.rotation.z = -0.35;
    hero.add(leftCrest, rightCrest);

    // 2. Chestplate & Reactor Core
    const chestGeo = new THREE.CylinderGeometry(0.55, 0.42, 0.9, 8);
    const chest = new THREE.Mesh(chestGeo, armorMat);
    chest.position.set(0, 1.35, 0);
    hero.add(chest);

    const coreGeo = new THREE.OctahedronGeometry(0.16, 0);
    const coreMat = new THREE.MeshBasicMaterial({ color: config.visorColor });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.set(0, 1.42, 0.46);
    hero.add(core);

    // 3. Pauldrons (Shoulders)
    const pauldronGeo = new THREE.BoxGeometry(0.38, 0.32, 0.42);
    const leftPauldron = new THREE.Mesh(pauldronGeo, armorMat);
    leftPauldron.position.set(-0.72, 1.72, 0);
    leftPauldron.rotation.z = -0.35;
    hero.add(leftPauldron);

    const rightPauldron = new THREE.Mesh(pauldronGeo, armorMat);
    rightPauldron.position.set(0.72, 1.72, 0);
    rightPauldron.rotation.z = 0.35;
    hero.add(rightPauldron);

    // 4. Arms
    const armGeo = new THREE.CylinderGeometry(0.15, 0.13, 0.7, 6);
    const leftArm = new THREE.Mesh(armGeo, armorMat);
    leftArm.position.set(-0.65, 1.15, 0.1);
    leftArm.rotation.z = 0.15;
    hero.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, armorMat);
    rightArm.position.set(0.65, 1.15, 0.1);
    rightArm.rotation.z = -0.15;
    hero.add(rightArm);

    // 5. Signature Weapon Model
    const weaponMat = new THREE.MeshStandardMaterial({
      color: config.armorColor,
      metalness: 0.95,
      roughness: 0.1,
      emissive: config.weaponColor,
      emissiveIntensity: auraMode === 'celestial' ? 2.8 : 1.9,
    });

    if (config.weaponType === 'greatsword') {
      const swordBlade = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.75, 0.24), weaponMat);
      swordBlade.position.set(0.78, 1.6, 0.4);
      swordBlade.rotation.z = -0.1;
      hero.add(swordBlade);
    } else if (config.weaponType === 'crossbow') {
      const bow = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.07, 8, 16, Math.PI), weaponMat);
      bow.position.set(0.75, 1.2, 0.4);
      bow.rotation.y = Math.PI / 2;
      hero.add(bow);
    } else if (config.weaponType === 'axe') {
      const axePole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.85, 8), armorMat);
      axePole.position.set(0.75, 1.5, 0.4);
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.42, 0.09), weaponMat);
      blade.position.set(0.9, 2.1, 0.4);
      hero.add(axePole, blade);
    } else if (config.weaponType === 'daggers') {
      const d1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.85, 0.14), weaponMat);
      d1.position.set(0.75, 1.3, 0.35);
      const d2 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.85, 0.14), weaponMat);
      d2.position.set(-0.75, 1.3, 0.35);
      hero.add(d1, d2);
    } else if (config.weaponType === 'spear') {
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.4, 8), armorMat);
      shaft.position.set(0.75, 1.6, 0.4);
      const tip = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.55, 6), weaponMat);
      tip.position.set(0.75, 2.8, 0.4);
      hero.add(shaft, tip);
    } else if (config.weaponType === 'scythe') {
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.45, 8), armorMat);
      shaft.position.set(0.75, 1.55, 0.4);
      const crescent = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.06, 8, 20, Math.PI * 0.85), weaponMat);
      crescent.position.set(0.5, 2.55, 0.4);
      crescent.rotation.z = Math.PI / 4;
      hero.add(shaft, crescent);
    } else {
      const staff = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.0, 8), armorMat);
      staff.position.set(0.75, 1.5, 0.4);
      const orb = new THREE.Mesh(new THREE.OctahedronGeometry(0.22, 1), weaponMat);
      orb.position.set(0.75, 2.55, 0.4);
      hero.add(staff, orb);
    }

    // 6. Waist & Legs
    const waist = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.45, 0.4, 8), armorMat);
    waist.position.set(0, 0.75, 0);
    hero.add(waist);

    const legGeo = new THREE.CylinderGeometry(0.18, 0.14, 0.9, 6);
    const leftLeg = new THREE.Mesh(legGeo, armorMat);
    leftLeg.position.set(-0.25, 0.2, 0);
    const rightLeg = new THREE.Mesh(legGeo, armorMat);
    rightLeg.position.set(0.25, 0.2, 0);
    hero.add(leftLeg, rightLeg);

    // 7. Awakened Halo & Cyber Wings behind Hero
    const haloRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.95, 0.03, 12, 48),
      new THREE.MeshBasicMaterial({
        color: config.visorColor,
        transparent: true,
        opacity: auraMode === 'normal' ? 0.15 : 0.75,
      })
    );
    haloRing.position.set(0, 1.55, -0.35);
    hero.add(haloRing);

    const outerHalo = new THREE.Mesh(
      new THREE.TorusGeometry(1.25, 0.02, 8, 6),
      new THREE.MeshBasicMaterial({
        color: config.weaponColor,
        transparent: true,
        opacity: auraMode === 'celestial' ? 0.85 : 0.35,
      })
    );
    outerHalo.position.set(0, 1.55, -0.4);
    hero.add(outerHalo);

    // Pedestal
    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(1.2, 1.35, 0.16, 24),
      new THREE.MeshStandardMaterial({
        color: 0x090714,
        metalness: 0.85,
        roughness: 0.2,
        emissive: 0x1e1035,
      })
    );
    pedestal.position.set(0, -0.3, 0);
    hero.add(pedestal);

    const runeRing = new THREE.Mesh(
      new THREE.RingGeometry(0.85, 1.08, 32),
      new THREE.MeshBasicMaterial({
        color: config.visorColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      })
    );
    runeRing.rotation.x = Math.PI / 2;
    runeRing.position.set(0, -0.21, 0);
    hero.add(runeRing);

    scene.add(hero);
    heroGroupRef.current = hero;

    // Handle Resize
    const handleResize = () => {
      if (!containerRef.current || !renderer) return;
      const newW = containerRef.current.clientWidth || 280;
      const newH = containerRef.current.clientHeight || 320;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      const speed = auraMode === 'celestial' ? 2.4 : 1.5;
      hero.position.y = Math.sin(elapsed * speed) * 0.05;
      runeRing.rotation.z = elapsed * 0.35;
      haloRing.rotation.z = -elapsed * 0.6;
      outerHalo.rotation.z = elapsed * 0.9;
      core.rotation.y = elapsed * 2;
      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, [activeHero, auraMode]);

  useEffect(() => {
    if (heroGroupRef.current) {
      heroGroupRef.current.rotation.y = (rotationAngle * Math.PI) / 180;
    }
  }, [rotationAngle]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setLastX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !onRotationChange) return;
    const delta = e.clientX - lastX;
    const nextAngle = (rotationAngle + delta * 0.85) % 360;
    onRotationChange(nextAngle);
    setLastX(e.clientX);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const cycleAura = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAuraMode((prev) => (prev === 'normal' ? 'awakened' : prev === 'awakened' ? 'celestial' : 'normal'));
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="relative w-full h-[290px] sm:h-[320px] rounded-2xl bg-[#0d0d17]/95 overflow-hidden flex items-center justify-center border border-[#3d494c]/40 shadow-2xl cursor-grab active:cursor-grabbing touch-none select-none"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Top Left: 3D Rotate Badge */}
      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-[#292934]/85 backdrop-blur-md text-[#4cd7f6] font-hud text-[9px] font-bold flex items-center gap-1 border border-[#4cd7f6]/30">
        <span className="material-symbols-outlined text-[12px]">3d_rotation</span>
        <span>Xoay 360°</span>
      </div>

      {/* Top Right: Aura Mode Toggle */}
      <button
        onClick={cycleAura}
        className="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-[#6f00be]/80 backdrop-blur-md text-[#ffddb8] font-hud text-[9px] font-bold flex items-center gap-1 border border-[#ddb7ff]/40 active:scale-95 transition-all"
      >
        <span className="material-symbols-outlined text-[12px]">flare</span>
        <span>{auraMode === 'celestial' ? 'THẦN VŨ' : auraMode === 'awakened' ? 'THỨC TỈNH' : 'THƯỜNG'}</span>
      </button>

      {/* Stars Rating Floating Row */}
      <div className="absolute bottom-10 inset-x-0 flex items-center justify-center gap-0.5 pointer-events-none">
        {Array.from({ length: Math.min(10, activeHero.stars) }).map((_, idx) => (
          <span
            key={idx}
            className="material-symbols-outlined text-[#facc15] text-[13px] drop-shadow-[0_0_6px_rgba(250,204,21,0.9)]"
          >
            star
          </span>
        ))}
      </div>

      {/* Hero Badge Tag */}
      <div className="absolute bottom-2 inset-x-2 flex items-center justify-center pointer-events-none">
        <div
          style={{ borderColor: activeHero.accentColor }}
          className="px-2.5 py-1 rounded-xl bg-[#1b1b25]/90 backdrop-blur-md flex items-center gap-1.5 border shadow-lg max-w-full"
        >
          <span className="material-symbols-outlined text-[13px]" style={{ color: activeHero.accentColor }}>
            shield
          </span>
          <span className="font-hud text-[9px] text-[#e4e1f0] font-bold uppercase tracking-wider truncate">
            {activeHero.name} • {activeHero.classVi}
          </span>
        </div>
      </div>
    </div>
  );
};
