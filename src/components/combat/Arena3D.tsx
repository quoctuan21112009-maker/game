import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { CameraMode, GestureMode } from '../../types/game';
import { useGame } from '../../context/GameContext';

interface Arena3DProps {
  cameraMode: CameraMode;
  speedMultiplier: number;
  isAutoBattle: boolean;
  gestureMode: GestureMode;
  onScreenShakeTrigger?: () => void;
}

export const Arena3D: React.FC<Arena3DProps> = ({
  cameraMode,
  speedMultiplier,
  isAutoBattle,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const physicsCanvasRef = useRef<HTMLCanvasElement>(null);

  const { activeBoss, activeHero, dealDamageToBoss, comboHits, player } = useGame();

  const [floatingDamages, setFloatingDamages] = useState<
    { id: number; text: string; x: number; y: number; isCrit: boolean; color: string }[]
  >([]);
  const [hitMarker, setHitMarker] = useState(false);

  // FPS Attack swing animation state
  const isSwingingRef = useRef(false);
  const swingProgressRef = useRef(0);

  const threeRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    bossGroup: THREE.Group;
    heroThirdPersonGroup: THREE.Group;
    fpsViewmodel: THREE.Group;
    fpsWeaponMesh: THREE.Object3D;
    particles: THREE.Points;
    wings: THREE.Mesh[];
    keyLight: THREE.PointLight;
    animFrameId: number;
    pitch: number;
    yaw: number;
    isDragging: boolean;
    lastMouseX: number;
    lastMouseY: number;
  } | null>(null);

  const physicsRef = useRef<{
    sparks: { x: number; y: number; vx: number; vy: number; gravity: number; life: number; decay: number; size: number; color: string }[];
    slashes: { x1: number; y1: number; x2: number; y2: number; life: number; decay: number; color: string; width: number }[];
  }>({
    sparks: [],
    slashes: [],
  });

  const spawnSparks = (x: number, y: number, count = 24, color = '#4cd7f6', scale = 1) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (Math.random() * 8 + 3) * scale;
      physicsRef.current.sparks.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.5,
        gravity: 0.32,
        life: 1.0,
        decay: Math.random() * 0.035 + 0.02,
        size: Math.random() * 3.5 + 1.5,
        color,
      });
    }
  };

  const addLaserSlash = (x1: number, y1: number, x2: number, y2: number, color = '#4cd7f6') => {
    physicsRef.current.slashes.push({
      x1,
      y1,
      x2,
      y2,
      life: 1.0,
      decay: 0.08,
      color,
      width: 5,
    });
  };

  const spawnDamageNumber = (amount: number, isCrit = false, label = '') => {
    const id = Date.now() + Math.random();
    const x = 40 + Math.random() * 30;
    const y = 30 + Math.random() * 20;
    const color = isCrit ? '#ffb95f' : activeHero.accentColor || '#4cd7f6';
    const text = `${label ? label + ' ' : ''}${amount.toLocaleString()}${isCrit ? '!' : ''}`;

    setFloatingDamages((prev) => [...prev.slice(-6), { id, text, x, y, isCrit, color }]);
    setHitMarker(true);
    setTimeout(() => setHitMarker(false), 120);

    setTimeout(() => {
      setFloatingDamages((prev) => prev.filter((d) => d.id !== id));
    }, 850);
  };

  // Trigger FPS melee/ranged attack animation
  const triggerFpsAttack = () => {
    isSwingingRef.current = true;
    swingProgressRef.current = 0;
  };

  // Three.js Scene Setup adapting to FPS & activeBoss
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 360;
    const height = container.clientHeight || 390;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0d0d17, 0.035);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.05, 1000);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lights
    const ambientLight = new THREE.AmbientLight(activeBoss.model3DConfig.ambientColor, 2.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(activeBoss.model3DConfig.hornColor, 2.8);
    dirLight.position.set(4, 8, 5);
    scene.add(dirLight);

    const keyLight = new THREE.PointLight(activeBoss.model3DConfig.wingColor, 4, 18);
    keyLight.position.set(0, 1.5, 0.5);
    scene.add(keyLight);

    // Floor Platform Grid
    const floorGeo = new THREE.CylinderGeometry(5.2, 5.5, 0.3, 32);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x141423,
      metalness: 0.85,
      roughness: 0.25,
      emissive: 0x070712,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = -1.2;
    scene.add(floor);

    const ringMat = new THREE.MeshBasicMaterial({
      color: activeBoss.model3DConfig.hornColor,
      transparent: true,
      opacity: 0.45,
    });
    const ringMesh = new THREE.Mesh(new THREE.RingGeometry(4.2, 4.35, 48), ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = -1.04;
    scene.add(ringMesh);

    // ==========================================
    // BOSS 3D MODEL GENERATION BASED ON CONFIG
    // ==========================================
    const bossGroup = new THREE.Group();
    bossGroup.position.set(0, 0.6, -1.8);
    const wings: THREE.Mesh[] = [];
    const bConfig = activeBoss.model3DConfig;

    if (bConfig.geometryType === 'colossus') {
      // Ignis Colossus
      const bodyGeo = new THREE.DodecahedronGeometry(1.5, 0);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: bConfig.coreColor,
        metalness: 0.9,
        roughness: 0.3,
        emissive: bConfig.wingColor,
        emissiveIntensity: 1.8,
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      bossGroup.add(body);

      const crownGeo = new THREE.TorusGeometry(1.8, 0.12, 8, 24);
      const crown = new THREE.Mesh(crownGeo, new THREE.MeshBasicMaterial({ color: bConfig.hornColor }));
      crown.rotation.x = Math.PI / 2.5;
      bossGroup.add(crown);
    } else if (bConfig.geometryType === 'archon') {
      // Abyssal Archon
      const bodyGeo = new THREE.IcosahedronGeometry(1.3, 1);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: bConfig.coreColor,
        metalness: 0.95,
        roughness: 0.1,
        emissive: bConfig.wingColor,
        emissiveIntensity: 1.8,
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      bossGroup.add(body);

      const ringGeo = new THREE.TorusGeometry(2.0, 0.09, 12, 48);
      const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: bConfig.hornColor }));
      ring.rotation.x = Math.PI / 3;
      bossGroup.add(ring);
    } else if (bConfig.geometryType === 'hydra') {
      // Frostborne Hydra
      const bodyGeo = new THREE.ConeGeometry(1.2, 2.8, 8);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: bConfig.coreColor,
        metalness: 0.7,
        roughness: 0.1,
        emissive: bConfig.wingColor,
        emissiveIntensity: 1.6,
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      bossGroup.add(body);

      const spikesGeo = new THREE.TetrahedronGeometry(0.8, 0);
      const spikesMat = new THREE.MeshBasicMaterial({ color: 0xacedff, wireframe: true });
      const spike = new THREE.Mesh(spikesGeo, spikesMat);
      spike.position.y = 1.2;
      bossGroup.add(spike);
    } else if (bConfig.geometryType === 'wyrm') {
      // Tempest Wyrm
      const bodyGeo = new THREE.TorusKnotGeometry(1.1, 0.35, 64, 8, 2, 3);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: bConfig.coreColor,
        metalness: 0.85,
        roughness: 0.15,
        emissive: bConfig.wingColor,
        emissiveIntensity: 1.9,
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      bossGroup.add(body);
    } else if (bConfig.geometryType === 'goliath') {
      // Void Goliath
      const bodyGeo = new THREE.BoxGeometry(2.0, 2.4, 1.8);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: bConfig.coreColor,
        metalness: 0.95,
        roughness: 0.2,
        emissive: bConfig.wingColor,
        emissiveIntensity: 1.7,
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      bossGroup.add(body);

      const singGeo = new THREE.SphereGeometry(0.7, 16, 16);
      const singMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const singularity = new THREE.Mesh(singGeo, singMat);
      singularity.position.set(0, 0, 0.8);
      bossGroup.add(singularity);
    } else {
      // Chrono Chimera Void Devourer
      const bodyGeo = new THREE.OctahedronGeometry(1.4, 1);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: bConfig.coreColor,
        metalness: 0.95,
        roughness: 0.15,
        emissive: bConfig.wingColor,
        emissiveIntensity: 1.4,
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      bossGroup.add(body);

      const hornGeo = new THREE.ConeGeometry(0.3, 1.6, 5);
      const hornMat = new THREE.MeshStandardMaterial({
        color: 0x110e24,
        metalness: 0.9,
        emissive: bConfig.hornColor,
        emissiveIntensity: 1.5,
      });
      const leftHorn = new THREE.Mesh(hornGeo, hornMat);
      leftHorn.position.set(-0.8, 1.4, 0.2);
      leftHorn.rotation.z = 0.45;
      bossGroup.add(leftHorn);

      const rightHorn = new THREE.Mesh(hornGeo, hornMat);
      rightHorn.position.set(0.8, 1.4, 0.2);
      rightHorn.rotation.z = -0.45;
      bossGroup.add(rightHorn);

      const wingGeo = new THREE.TetrahedronGeometry(1.9, 0);
      const wingMat = new THREE.MeshStandardMaterial({
        color: 0x1a0f35,
        emissive: bConfig.wingColor,
        emissiveIntensity: 1.6,
        transparent: true,
        opacity: 0.88,
      });
      const leftWing = new THREE.Mesh(wingGeo, wingMat);
      leftWing.position.set(-2.2, 0.6, -0.6);
      leftWing.scale.set(0.3, 2.0, 1.0);
      leftWing.rotation.set(0.2, -0.4, 0.6);
      bossGroup.add(leftWing);
      wings.push(leftWing);

      const rightWing = new THREE.Mesh(wingGeo, wingMat);
      rightWing.position.set(2.2, 0.6, -0.6);
      rightWing.scale.set(0.3, 2.0, 1.0);
      rightWing.rotation.set(0.2, 0.4, -0.6);
      bossGroup.add(rightWing);
      wings.push(rightWing);
    }

    const eyeGeo = new THREE.SphereGeometry(0.14, 12, 12);
    const eyeMat = new THREE.MeshBasicMaterial({ color: bConfig.eyeColor });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.4, 0.4, 1.1);
    bossGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.4, 0.4, 1.1);
    bossGroup.add(rightEye);

    scene.add(bossGroup);

    // Swarm Particles
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 10;
      particlePositions[i + 1] = Math.random() * 5 - 1;
      particlePositions[i + 2] = (Math.random() - 0.5) * 10;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: bConfig.hornColor,
      size: 0.08,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Third-person Hero Mesh (only rendered in 3rd person / isometric modes)
    const heroThirdPersonGroup = new THREE.Group();
    heroThirdPersonGroup.position.set(0, -0.9, 1.6);

    const heroBodyGeo = new THREE.CylinderGeometry(0.25, 0.35, 1.1, 8);
    const heroBodyMat = new THREE.MeshStandardMaterial({
      color: activeHero.modelConfig.armorColor,
      metalness: 0.9,
      roughness: 0.2,
      emissive: activeHero.modelConfig.visorColor,
      emissiveIntensity: 0.5,
    });
    const heroBody = new THREE.Mesh(heroBodyGeo, heroBodyMat);
    heroThirdPersonGroup.add(heroBody);
    scene.add(heroThirdPersonGroup);

    // ==========================================
    // FIRST-PERSON (FPS) VIEWMODEL (HERO SPECIFIC WEAPONS)
    // Attached directly to Camera so it moves with player eyes!
    // ==========================================
    const fpsViewmodel = new THREE.Group();
    fpsViewmodel.position.set(0.35, -0.28, -0.65); // Bottom right of player's screen

    // Player Cybernetic Gauntlet Arm (First-Person)
    const fpsArmGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.6, 8);
    const fpsArmMat = new THREE.MeshStandardMaterial({
      color: activeHero.modelConfig.armorColor,
      metalness: 0.9,
      roughness: 0.2,
      emissive: activeHero.modelConfig.visorColor,
      emissiveIntensity: 0.4,
    });
    const fpsArm = new THREE.Mesh(fpsArmGeo, fpsArmMat);
    fpsArm.rotation.set(Math.PI / 3, 0, -Math.PI / 6);
    fpsArm.position.set(0, -0.05, 0.15);
    fpsViewmodel.add(fpsArm);

    // Build specific weapon model based on activeHero.modelConfig.weaponType
    let fpsWeaponMesh: THREE.Object3D;
    const wType = activeHero.modelConfig.weaponType;

    if (wType === 'crossbow') {
      // Valeria: Crossbow
      const crossGroup = new THREE.Group();
      const stock = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.5, 0.1),
        new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.9 })
      );
      const bowArms = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.04, 0.08),
        new THREE.MeshStandardMaterial({ color: activeHero.modelConfig.weaponColor, emissive: activeHero.modelConfig.weaponColor, emissiveIntensity: 2.0 })
      );
      bowArms.position.set(0, 0.2, -0.1);
      crossGroup.add(stock, bowArms);
      crossGroup.position.set(0.05, 0.2, -0.15);
      fpsWeaponMesh = crossGroup;
    } else if (wType === 'axe') {
      // Ignis: Battleaxe
      const axeGroup = new THREE.Group();
      const haft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, 0.8),
        new THREE.MeshStandardMaterial({ color: 0x260303 })
      );
      const head = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.25, 0.06),
        new THREE.MeshStandardMaterial({ color: 0x7f1d1d, emissive: activeHero.modelConfig.weaponColor, emissiveIntensity: 2.0 })
      );
      head.position.set(0, 0.3, 0);
      axeGroup.add(haft, head);
      axeGroup.position.set(0.05, 0.25, -0.15);
      fpsWeaponMesh = axeGroup;
    } else if (wType === 'staff') {
      // Lyra: Arcane Staff
      const staffGroup = new THREE.Group();
      const shaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, 0.9),
        new THREE.MeshStandardMaterial({ color: 0x1e1b4b })
      );
      const orb = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.12, 0),
        new THREE.MeshStandardMaterial({ color: activeHero.modelConfig.weaponColor, emissive: activeHero.modelConfig.weaponColor, emissiveIntensity: 2.5 })
      );
      orb.position.set(0, 0.45, 0);
      staffGroup.add(shaft, orb);
      staffGroup.position.set(0.05, 0.25, -0.15);
      fpsWeaponMesh = staffGroup;
    } else if (wType === 'daggers') {
      // Kaelen: Void Daggers
      const daggerGroup = new THREE.Group();
      const blade = new THREE.Mesh(
        new THREE.BoxGeometry(0.03, 0.5, 0.08),
        new THREE.MeshStandardMaterial({ color: 0x090714, emissive: activeHero.modelConfig.weaponColor, emissiveIntensity: 2.4 })
      );
      daggerGroup.add(blade);
      daggerGroup.position.set(0.05, 0.2, -0.15);
      fpsWeaponMesh = daggerGroup;
    } else if (wType === 'spear') {
      // Aurora: Solar Spear
      const spearGroup = new THREE.Group();
      const shaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, 1.0),
        new THREE.MeshStandardMaterial({ color: 0x713f12 })
      );
      const tip = new THREE.Mesh(
        new THREE.ConeGeometry(0.08, 0.35, 6),
        new THREE.MeshStandardMaterial({ color: activeHero.modelConfig.weaponColor, emissive: activeHero.modelConfig.weaponColor, emissiveIntensity: 2.5 })
      );
      tip.position.set(0, 0.5, 0);
      spearGroup.add(shaft, tip);
      spearGroup.position.set(0.05, 0.25, -0.15);
      fpsWeaponMesh = spearGroup;
    } else if (wType === 'scythe') {
      // Seraphina: Celestial Scythe
      const scytheGroup = new THREE.Group();
      const shaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, 1.1),
        new THREE.MeshStandardMaterial({ color: 0x3b0764, metalness: 0.9 })
      );
      const crescent = new THREE.Mesh(
        new THREE.TorusGeometry(0.24, 0.035, 8, 16, Math.PI * 0.8),
        new THREE.MeshStandardMaterial({ color: activeHero.modelConfig.weaponColor, emissive: activeHero.modelConfig.weaponColor, emissiveIntensity: 2.8 })
      );
      crescent.position.set(-0.12, 0.48, 0);
      crescent.rotation.z = Math.PI / 4;
      scytheGroup.add(shaft, crescent);
      scytheGroup.position.set(0.05, 0.25, -0.15);
      fpsWeaponMesh = scytheGroup;
    } else {
      // Aethel: Cyber-Paladin Greatsword
      const swordMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.85, 0.12),
        new THREE.MeshStandardMaterial({
          color: 0x090714,
          metalness: 0.95,
          roughness: 0.1,
          emissive: activeHero.modelConfig.weaponColor,
          emissiveIntensity: 2.2,
        })
      );
      swordMesh.position.set(0.05, 0.28, -0.15);
      swordMesh.rotation.set(-0.25, -0.2, 0.2);
      fpsWeaponMesh = swordMesh;
    }

    fpsViewmodel.add(fpsWeaponMesh);
    camera.add(fpsViewmodel);
    scene.add(camera);

    threeRef.current = {
      renderer,
      scene,
      camera,
      bossGroup,
      heroThirdPersonGroup,
      fpsViewmodel,
      fpsWeaponMesh,
      particles,
      wings,
      keyLight,
      animFrameId: 0,
      pitch: 0,
      yaw: 0,
      isDragging: false,
      lastMouseX: 0,
      lastMouseY: 0,
    };

    let clock = new THREE.Clock();
    const animate = () => {
      const elapsed = clock.getElapsedTime() * speedMultiplier;

      // Boss breathing
      if (bossGroup) {
        bossGroup.position.y = 0.5 + Math.sin(elapsed * 1.8) * 0.15;
        bossGroup.rotation.y = Math.sin(elapsed * 0.8) * 0.15;
        wings.forEach((w, idx) => {
          w.rotation.z = (idx === 0 ? 0.6 : -0.6) + (idx === 0 ? 1 : -1) * Math.sin(elapsed * 2.2) * 0.15;
        });
      }

      if (particles) {
        particles.rotation.y = elapsed * 0.15;
      }

      keyLight.intensity = 2.5 + Math.sin(elapsed * 3) * 0.8;

      // Handle Camera Modes & FPS Viewmodel visibility
      if (cameraMode === 'fps') {
        // TRUE FPS MODE: Camera at player eyes looking forward
        heroThirdPersonGroup.visible = false;
        fpsViewmodel.visible = true;

        camera.position.set(0, 0.6, 0.5);

        // FPS Aim Look (Pitch & Yaw)
        const lookTarget = new THREE.Vector3(
          Math.sin(threeRef.current!.yaw) * 6,
          0.6 + Math.sin(threeRef.current!.pitch) * 3,
          -4
        );
        camera.lookAt(lookTarget);

        // First-person weapon idle breathing sway
        fpsViewmodel.position.x = 0.35 + Math.sin(elapsed * 2.5) * 0.015;
        fpsViewmodel.position.y = -0.28 + Math.cos(elapsed * 3.0) * 0.01;

        // First-person attack swing physics animation
        if (isSwingingRef.current) {
          swingProgressRef.current += 0.12 * speedMultiplier;
          const swingVal = Math.sin(swingProgressRef.current * Math.PI);
          fpsWeaponMesh.rotation.z = 0.2 - swingVal * 1.5;
          fpsWeaponMesh.rotation.x = -0.25 - swingVal * 0.8;
          fpsViewmodel.position.x = 0.35 - swingVal * 0.25;

          if (swingProgressRef.current >= 1.0) {
            isSwingingRef.current = false;
            fpsWeaponMesh.rotation.set(-0.25, -0.2, 0.2);
            fpsViewmodel.position.x = 0.35;
          }
        }
      } else {
        // Third Person / Freelook / Isometric Modes
        heroThirdPersonGroup.visible = true;
        fpsViewmodel.visible = false;

        const targetCamY = cameraMode === 'isometric' ? 4.8 : cameraMode === 'overshoulder' ? 1.4 : 2.0;
        const targetCamZ = cameraMode === 'isometric' ? 7.5 : cameraMode === 'overshoulder' ? 4.8 : 6.2;
        const targetCamX = cameraMode === 'overshoulder' ? -0.8 : 0;

        camera.position.x += (targetCamX + threeRef.current!.yaw * 2.5 - camera.position.x) * 0.08;
        camera.position.y += (targetCamY - threeRef.current!.pitch * 1.5 - camera.position.y) * 0.08;
        camera.position.z += (targetCamZ - camera.position.z) * 0.08;

        camera.lookAt(0, 0.6, -1.2);
      }

      renderer.render(scene, camera);
      threeRef.current!.animFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current || !threeRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      threeRef.current.camera.aspect = w / h;
      threeRef.current.camera.updateProjectionMatrix();
      threeRef.current.renderer.setSize(w, h);

      if (physicsCanvasRef.current) {
        physicsCanvasRef.current.width = w;
        physicsCanvasRef.current.height = h;
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (threeRef.current) {
        cancelAnimationFrame(threeRef.current.animFrameId);
        threeRef.current.renderer.dispose();
      }
    };
  }, [cameraMode, speedMultiplier, activeBoss, activeHero]);

  // 2D Physics Canvas Loop
  useEffect(() => {
    const canvas = physicsCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render2D = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const slashes = physicsRef.current.slashes;
      for (let i = slashes.length - 1; i >= 0; i--) {
        const s = slashes[i];
        ctx.save();
        ctx.globalAlpha = Math.max(0, s.life);
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.width * s.life;
        ctx.shadowBlur = 12;
        ctx.shadowColor = s.color;
        ctx.beginPath();
        ctx.moveTo(s.x1, s.y1);
        ctx.lineTo(s.x2, s.y2);
        ctx.stroke();
        ctx.restore();

        s.life -= s.decay;
        if (s.life <= 0) slashes.splice(i, 1);
      }

      const sparks = physicsRef.current.sparks;
      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.life -= p.decay;

        if (p.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render2D);
    };

    render2D();
    return () => cancelAnimationFrame(animId);
  }, []);

  // Auto-battle
  useEffect(() => {
    if (!isAutoBattle) return;
    const interval = setInterval(() => {
      triggerFpsAttack();
      const canvas = physicsCanvasRef.current;
      const w = canvas ? canvas.width : 340;
      const h = canvas ? canvas.height : 300;
      const x1 = w * 0.2 + Math.random() * w * 0.6;
      const y1 = h * 0.3 + Math.random() * h * 0.4;
      const x2 = x1 + (Math.random() - 0.5) * 140;
      const y2 = y1 + (Math.random() - 0.5) * 90;

      addLaserSlash(x1, y1, x2, y2, Math.random() > 0.5 ? '#4cd7f6' : '#ffb95f');
      spawnSparks(x2, y2, 18, activeHero.accentColor, 1.2);
      
      const dmg = Math.round((player.stats.atk + player.level * 50) * (0.9 + Math.random() * 0.3));
      dealDamageToBoss(dmg, false, 'AUTO');
      spawnDamageNumber(dmg, false, 'AUTO');
    }, 1500 / speedMultiplier);

    return () => clearInterval(interval);
  }, [isAutoBattle, speedMultiplier, activeHero, player.stats.atk, player.level]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!threeRef.current) return;
    threeRef.current.isDragging = true;
    threeRef.current.lastMouseX = e.clientX;
    threeRef.current.lastMouseY = e.clientY;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    triggerFpsAttack();
    addLaserSlash(x - 60, y - 40, x + 70, y + 50, activeHero.accentColor);
    spawnSparks(x, y, 28, activeHero.accentColor, 1.8);

    const isCrit = Math.random() * 100 < player.stats.critRate;
    const baseDamage = player.stats.atk + player.level * 60;
    const dmg = Math.round(baseDamage * (isCrit ? 1.8 : 1.0) * (0.95 + Math.random() * 0.2));

    dealDamageToBoss(dmg, isCrit, isCrit ? 'FPS CRIT' : 'SLASH');
    spawnDamageNumber(dmg, isCrit, isCrit ? 'FPS CRIT' : 'SLASH');
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!threeRef.current || !threeRef.current.isDragging) return;
    const deltaX = (e.clientX - threeRef.current.lastMouseX) * 0.005;
    const deltaY = (e.clientY - threeRef.current.lastMouseY) * 0.005;
    threeRef.current.yaw = Math.max(-0.8, Math.min(0.8, threeRef.current.yaw + deltaX));
    threeRef.current.pitch = Math.max(-0.4, Math.min(0.4, threeRef.current.pitch - deltaY));
    threeRef.current.lastMouseX = e.clientX;
    threeRef.current.lastMouseY = e.clientY;
  };

  const handlePointerUp = () => {
    if (threeRef.current) threeRef.current.isDragging = false;
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="relative w-full h-[390px] rounded-2xl overflow-hidden bg-[#0d0d17] border border-[#3d494c]/40 shadow-2xl select-none touch-none cursor-crosshair"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d17] via-[#0d0d17]/20 to-[#0d0d17]/70 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d17]/50 via-transparent to-[#0d0d17]/50 pointer-events-none" />

      <canvas ref={physicsCanvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />

      {/* FPS Tactical Reticle / Crosshair with reactive hit marker */}
      {cameraMode === 'fps' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="relative w-9 h-9 flex items-center justify-center transition-transform duration-75">
            <div
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                hitMarker ? 'bg-[#ffb4ab] scale-150 shadow-[0_0_12px_#ffb4ab]' : 'bg-[#4cd7f6] shadow-[0_0_8px_#4cd7f6]'
              }`}
            />
            <div
              className={`absolute w-3.5 h-0.5 -left-1 transition-all ${
                hitMarker ? 'bg-[#ffb4ab] scale-x-125' : 'bg-[#4cd7f6]/80'
              }`}
            />
            <div
              className={`absolute w-3.5 h-0.5 -right-1 transition-all ${
                hitMarker ? 'bg-[#ffb4ab] scale-x-125' : 'bg-[#4cd7f6]/80'
              }`}
            />
            <div
              className={`absolute h-3.5 w-0.5 -top-1 transition-all ${
                hitMarker ? 'bg-[#ffb4ab] scale-y-125' : 'bg-[#4cd7f6]/80'
              }`}
            />
            <div
              className={`absolute h-3.5 w-0.5 -bottom-1 transition-all ${
                hitMarker ? 'bg-[#ffb4ab] scale-y-125' : 'bg-[#4cd7f6]/80'
              }`}
            />
            {hitMarker && (
              <div className="absolute inset-0 border border-[#ffb4ab] rounded-full scale-125 animate-ping opacity-75" />
            )}
          </div>
        </div>
      )}

      {/* Floating Damage Numbers */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {floatingDamages.map((dmg) => (
          <div
            key={dmg.id}
            style={{
              left: `${dmg.x}%`,
              top: `${dmg.y}%`,
              color: dmg.color,
              textShadow: `0 0 16px ${dmg.color}`,
            }}
            className={`absolute font-headline font-bold transition-all transform -translate-x-1/2 -translate-y-1/2 animate-bounce ${
              dmg.isCrit ? 'text-[22px]' : 'text-[16px]'
            }`}
          >
            {dmg.text}
          </div>
        ))}
      </div>

      {/* Dynamic Boss HUD */}
      <div className="relative z-30 w-full flex flex-col gap-1.5 p-3 pointer-events-none">
        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-[#292934]/90 backdrop-blur-md shadow-lg border border-[#3d494c]/30 pointer-events-auto">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#93000a]/40 flex items-center justify-center shrink-0 ring-1 ring-[#ffb4ab]/50">
              <span className="material-symbols-outlined text-[#ffb4ab] text-[20px]">skull</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-headline text-[15px] font-bold text-[#e4e1f0] truncate">{activeBoss.name}</span>
                <span className="px-1.5 py-0.5 rounded bg-[#6f00be] text-[#d6a9ff] font-hud text-[9px] uppercase tracking-wide font-bold">
                  {activeBoss.phase}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#06b6d4]/20 text-[#acedff] font-hud text-[9px] font-bold border border-[#06b6d4]/30">
                  Lv.{activeBoss.level}
                </span>
              </div>
              <span className="font-hud text-[10px] text-[#bcc9cd] mt-0.5 truncate">{activeBoss.subTitle}</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {activeBoss.weaknesses.map((w) => (
              <span
                key={w}
                className="px-1.5 py-0.5 rounded font-hud text-[9px] uppercase font-bold tracking-wider bg-[#3d494c]/40 text-[#4cd7f6] border border-[#4cd7f6]/30"
              >
                {w}
              </span>
            ))}
          </div>
        </div>

        {/* Boss HP Bar */}
        <div className="w-full flex flex-col gap-1 px-2.5 py-1.5 rounded-xl bg-[#1b1b25]/85 backdrop-blur-md border border-[#3d494c]/20">
          <div className="flex items-center justify-between text-[11px] font-hud font-bold">
            <span className="text-[#ffb4ab] flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">favorite</span>
              HP BOSS {activeBoss.currentHp > 0 ? ((activeBoss.currentHp / activeBoss.maxHp) * 100).toFixed(1) : 0}%
            </span>
            <span className="text-[#e4e1f0]">
              {activeBoss.currentHp.toLocaleString()} / {activeBoss.maxHp.toLocaleString()}
            </span>
          </div>

          <div className="relative w-full h-3 rounded-full bg-[#141423] overflow-hidden border border-[#93000a]/40 shadow-inner">
            <div
              style={{ width: `${Math.max(0, Math.min(100, (activeBoss.currentHp / activeBoss.maxHp) * 100))}%` }}
              className="h-full bg-gradient-to-r from-[#93000a] via-[#ba1a1a] to-[#ff5449] transition-all duration-300 rounded-full shadow-[0_0_12px_rgba(255,84,73,0.7)]"
            />
          </div>

          {/* Break Gauge */}
          <div className="flex items-center justify-between gap-2 mt-0.5">
            <span className="font-hud text-[9px] text-[#ffddb8] uppercase font-bold flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[11px]">bolt</span>
              BREAK GAUGE
            </span>
            <div className="flex-1 h-1.5 rounded-full bg-[#292934] overflow-hidden">
              <div
                style={{ width: `${activeBoss.breakGauge}%` }}
                className="h-full bg-gradient-to-r from-[#f59e0b] to-[#facc15] transition-all rounded-full shadow-[0_0_8px_#facc15]"
              />
            </div>
            <span className="font-hud text-[9px] text-[#facc15] font-bold">{activeBoss.breakGauge}%</span>
          </div>
        </div>

        {/* Player Vitals (HP & Mana) in 3D Arena */}
        <div className="grid grid-cols-2 gap-2 px-2.5 py-1.5 rounded-xl bg-[#1b1b25]/85 backdrop-blur-md border border-[#3d494c]/20">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center justify-between text-[10px] font-hud font-bold">
              <span className="text-[#22c55e] flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[11px]">health_and_safety</span>
                HP: {Math.max(0, Math.min(100, (player.stats.hp / player.stats.maxHp) * 100)).toFixed(0)}%
              </span>
              <span className="text-white font-mono text-[9px]">
                {player.stats.hp.toLocaleString()}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#141423] overflow-hidden border border-[#22c55e]/30">
              <div
                style={{ width: `${Math.max(0, Math.min(100, (player.stats.hp / player.stats.maxHp) * 100))}%` }}
                className="h-full bg-gradient-to-r from-[#15803d] to-[#22c55e] rounded-full"
              />
            </div>
          </div>

          <div className="flex flex-col gap-0.5">
            <div className="flex items-center justify-between text-[10px] font-hud font-bold">
              <span className="text-[#4cd7f6] flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[11px]">bolt</span>
                MP: {Math.max(0, Math.min(100, (player.mana / player.maxMana) * 100)).toFixed(0)}%
              </span>
              <span className="text-white font-mono text-[9px]">
                {player.mana}/{player.maxMana}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#141423] overflow-hidden border border-[#4cd7f6]/30">
              <div
                style={{ width: `${Math.max(0, Math.min(100, (player.mana / player.maxMana) * 100))}%` }}
                className="h-full bg-gradient-to-r from-[#0284c7] to-[#4cd7f6] rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Level Scaling Banner */}
        <div className="flex items-center justify-between px-2.5 py-1 rounded-lg bg-[#003640]/70 border border-[#06b6d4]/40 text-[#acedff] font-hud text-[9px]">
          <span className="flex items-center gap-1 font-bold">
            <span className="material-symbols-outlined text-[12px] text-[#4cd7f6]">tune</span>
            CÂN BẰNG MÁU THEO LV PLAYER: Lv.{player.level}
          </span>
          <span className="text-[#bcc9cd]">Combo x{comboHits}</span>
        </div>
      </div>
    </div>
  );
};
