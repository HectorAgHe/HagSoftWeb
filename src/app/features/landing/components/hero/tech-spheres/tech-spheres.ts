import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild
} from '@angular/core';

/* ----------------------------------------------------------------
 * Catálogo de tecnologías HagSoft
 * ---------------------------------------------------------------- */
interface Tech {
  readonly id: string;
  readonly name: string;
  readonly label: string;
  readonly category: string;
  readonly description: string;
  readonly color: string;
  readonly labelColor?: string;
  readonly featured?: boolean;
}

const TECHS: readonly Tech[] = [
  { id: 'dotnet',    name: '.NET / C#',     label: '.NET', category: 'Backend',  description: 'Backend enterprise para sistemas de control.', color: '#22D3EE', featured: true },
  { id: 'angular',   name: 'Angular',       label: 'NG',   category: 'Frontend', description: 'Apps SPA modernas y mantenibles.', color: '#DD0031' },
  { id: 'react',     name: 'React',         label: 'R',    category: 'Frontend', description: 'UIs reactivos y componentizados.', color: '#61DAFB', labelColor: '#0F172A' },
  { id: 'ts',        name: 'TypeScript',    label: 'TS',   category: 'Lenguaje', description: 'Tipado fuerte y refactor seguro.', color: '#3178C6' },
  { id: 'java',      name: 'Java',          label: 'JV',   category: 'Backend',  description: 'Sistemas robustos e integraciones.', color: '#F89820' },
  { id: 'node',      name: 'Node.js',       label: 'JS',   category: 'Backend',  description: 'APIs y procesos en tiempo real.', color: '#339933' },
  { id: 'sqlserver',  name: 'Sql Server',    label: 'SQL',   category: 'Datos',    description: 'Base de datos relacional confiable.', color: '#336791' },
  { id: 'mongo',     name: 'MongoDB',       label: 'M',    category: 'Datos',    description: 'Base de datos documental flexible.', color: '#47A248' },
  { id: 'github',    name: 'GitHub',        label: 'GH',   category: 'DevOps',   description: 'Control de versiones y CI/CD.', color: '#A1A1AA' },
  { id: 'docker',    name: 'Docker',        label: 'DK',   category: 'DevOps',   description: 'Contenedores para despliegues limpios.', color: '#2496ED' },
  { id: 'gcp',       name: 'Google Cloud',  label: 'GC',   category: 'Cloud',    description: 'Infraestructura cloud escalable.', color: '#4285F4' },
  { id: 'azure',     name: 'Azure',         label: 'AZ',   category: 'Cloud',    description: 'Servicios cloud y AI de Microsoft.', color: '#0078D4' }
];

/* ----------------------------------------------------------------
 * Componente TechSpheres (ahora cubos facetados con neon glow)
 * Three.js + EffectComposer (bloom) lazy-loaded
 * ---------------------------------------------------------------- */
@Component({
  selector: 'app-tech-spheres',
  standalone: true,
  imports: [],
  templateUrl: './tech-spheres.html',
  styleUrl: './tech-spheres.css'
})
export class TechSpheres {
  private readonly host = viewChild.required<ElementRef<HTMLDivElement>>('host');
  private readonly destroyRef = inject(DestroyRef);

  readonly hoveredTech = signal<Tech | null>(null);
  readonly selectedTech = signal<Tech | null>(null);
  readonly hintVisible = signal(true);

  readonly hoverLabel = computed(() => this.hoveredTech()?.name ?? '');

  constructor() {
    afterNextRender(() => this.bootstrap());
  }

  closeTooltip(): void {
    this.selectedTech.set(null);
  }

  private async bootstrap(): Promise<void> {
    try {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
      const THREE = await import('three');
      const { EffectComposer } = await import('three/examples/jsm/postprocessing/EffectComposer.js');
      const { RenderPass } = await import('three/examples/jsm/postprocessing/RenderPass.js');
      const { UnrealBloomPass } = await import('three/examples/jsm/postprocessing/UnrealBloomPass.js');
      this.initScene(THREE, EffectComposer, RenderPass, UnrealBloomPass);
    } catch (error) {
      console.warn('[TechSpheres] Falta three.js. Ejecuta: npm install three @types/three', error);
    }
  }

  private initScene(
    THREE: typeof import('three'),
    EffectComposer: any,
    RenderPass: any,
    UnrealBloomPass: any
  ): void {
    const host = this.host().nativeElement;
    let width = host.clientWidth;
    let height = host.clientHeight;
    if (width === 0 || height === 0) return;

    // ---- Scene + Camera + Renderer ----
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x052E16, 0.045);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 15);

    // Helper para ajustar cámara y escala del orbital según aspect ratio.
    // Se llama al iniciar y en cada resize. La referencia a `group` viene
    // de un alcance superior (declarado más abajo); por eso usamos un
    // closure que lo lee al momento de ejecutarse.
    const adjustForAspect = (): void => {
      const aspect = width / height;
      if (aspect < 0.8) {
        // Móvil vertical
        camera.position.set(0, 0.3, 18);
        if (group) group.scale.setScalar(0.55);
      } else if (aspect < 1.3) {
        // Tablet vertical / cuadrado
        camera.position.set(0, 0.4, 16);
        if (group) group.scale.setScalar(0.78);
      } else {
        // Desktop wide
        camera.position.set(0, 0.5, 15);
        if (group) group.scale.setScalar(1.0);
      }
    };

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    host.appendChild(renderer.domElement);

    // ---- Post-processing: bloom para el neón ----
    const composer = new EffectComposer(renderer);
    composer.setSize(width, height);
    composer.addPass(new RenderPass(scene, camera));

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      0.85,   // strength
      0.55,   // radius
      0.25    // threshold
    );
    composer.addPass(bloomPass);

    // ---- Lighting ----
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.9);
    keyLight.position.set(6, 6, 8);
    scene.add(keyLight);

    const cyanRim = new THREE.PointLight(0x22D3EE, 1.5, 60);
    cyanRim.position.set(-6, 2, 4);
    scene.add(cyanRim);

    const greenFill = new THREE.PointLight(0x4ADE80, 1.1, 50);
    greenFill.position.set(6, -3, 2);
    scene.add(greenFill);

    // ---- Suelo grid en perspectiva ----
    const gridSize = 40;
    const gridDivs = 40;
    const grid = new THREE.GridHelper(gridSize, gridDivs, 0x22D3EE, 0x166534);
    const gridMat = grid.material as import('three').LineBasicMaterial;
    gridMat.transparent = true;
    gridMat.opacity = 0.18;
    grid.position.y = -4;
    scene.add(grid);

    // Fade del grid hacia el horizonte: plane semi-transparente sobre el grid
    const fadeGeo = new THREE.PlaneGeometry(gridSize, gridSize);
    const fadeMat = new THREE.MeshBasicMaterial({
      color: 0x052E16,
      transparent: true,
      opacity: 0.55,
      depthWrite: false
    });
    const fade = new THREE.Mesh(fadeGeo, fadeMat);
    fade.rotation.x = -Math.PI / 2;
    fade.position.y = -3.99;
    scene.add(fade);

    // ---- Partículas flotantes ----
    const particleCount = 140;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 24;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x67E8F9,
      size: 0.04,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ---- Group: contenedor orbital ----
    const group = new THREE.Group();
    scene.add(group);

    // Aplica el ajuste inicial ahora que `group` existe
    adjustForAspect();

    // ---- Cubos tech ----
    const cubeMeshes: Array<import('three').Group> = [];

    // Pre-cálculo para distribución con gap alrededor del cubo featured
    const totalNonFeatured = TECHS.filter(t => !t.featured).length;
    const featuredAngle = Math.PI / 2;        // top
    const gapAround = Math.PI / 6;             // 30° de espacio antes/después del .NET
    const usableArc = 2 * Math.PI - 2 * gapAround;
    const startAngle = featuredAngle + gapAround;

    TECHS.forEach((tech, i) => {
      const cubeGroup = new THREE.Group();

      // Distribución orbital: .NET fijo arriba, resto repartido en el arco restante
      let angle: number;
      if (tech.featured) {
        angle = featuredAngle;
      } else {
        const nonFeaturedIndex = TECHS.slice(0, i).filter(t => !t.featured).length;
        angle = startAngle + (nonFeaturedIndex / (totalNonFeatured - 1)) * usableArc;
      }

      const ringRadiusX = 8.0;
      const ringRadiusY = 5.3;
      const x = Math.cos(angle) * ringRadiusX;
      const y = Math.sin(angle) * ringRadiusY;
      const z = Math.cos(angle * 2 + 0.4) * 1.6;

      cubeGroup.position.set(x, y, z);

      // Tamaño: featured más grande (visible aún en pantalla mediana)
      const size = tech.featured ? 1.85 : 1.25;

      // Cube body — semi-transparente con emissive
      const boxGeo = new THREE.BoxGeometry(size, size, size);
      const labelTexture = new THREE.CanvasTexture(this.createTechCanvas(tech));
      labelTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      labelTexture.colorSpace = THREE.SRGBColorSpace;

      const cubeMat = new THREE.MeshStandardMaterial({
        map: labelTexture,
        color: 0xffffff,
        metalness: 0.35,
        roughness: 0.40,
        transparent: true,
        opacity: 0.92,
        emissive: new THREE.Color(tech.color),
        emissiveIntensity: 0.18
      });
      const cube = new THREE.Mesh(boxGeo, cubeMat);
      cubeGroup.add(cube);

      // Edges glow (cyan/verde según tech)
      const edgesGeo = new THREE.EdgesGeometry(boxGeo);
      const edgesMat = new THREE.LineBasicMaterial({
        color: tech.featured ? 0x67E8F9 : 0x4ADE80,
        transparent: true,
        opacity: 0.9
      });
      const edges = new THREE.LineSegments(edgesGeo, edgesMat);
      // Mini escalado para que las edges queden levemente por fuera
      edges.scale.setScalar(1.005);
      cubeGroup.add(edges);

      // userData para interacción
      cubeGroup.userData['tech'] = tech;
      cubeGroup.userData['basePos'] = cubeGroup.position.clone();
      cubeGroup.userData['phase'] = i * 0.6;
      cubeGroup.userData['speed'] = 0.35 + (i % 4) * 0.10;
      // Referencias para hover
      cubeGroup.userData['cube'] = cube;
      cubeGroup.userData['edges'] = edges;
      cubeGroup.userData['baseScale'] = tech.featured ? 1.20 : 1.05;

      // Rotación inicial diferente para variar
      cubeGroup.rotation.x = Math.random() * Math.PI;
      cubeGroup.rotation.y = Math.random() * Math.PI;
      cubeGroup.scale.setScalar(tech.featured ? 1.20 : 1.05);

      group.add(cubeGroup);
      cubeMeshes.push(cubeGroup);
    });

    // ---- Tubos conectores curvados (3 capas por conexión) ----
    // Cada conexión es un TubeGeometry sobre una curva Bezier que se
    // arquea hacia AFUERA del centro del orbital. Tres tubos concéntricos:
    //   - Core fino blanco (el "filamento" interno)
    //   - Cuerpo cian medio (el "tubo" propiamente)
    //   - Halo difuso ancho (el "glow" exterior que el bloom amplifica)
    const connectionMeshes: import('three').Mesh[] = [];

    // Ordenar cubos por ángulo para conectar adyacentes
    const orderedCubes = [...cubeMeshes].sort((a, b) => {
      const angleA = Math.atan2(
        (a.userData['basePos'] as import('three').Vector3).y,
        (a.userData['basePos'] as import('three').Vector3).x
      );
      const angleB = Math.atan2(
        (b.userData['basePos'] as import('three').Vector3).y,
        (b.userData['basePos'] as import('three').Vector3).x
      );
      return angleA - angleB;
    });

    const tubeLayers: ReadonlyArray<{ radius: number; color: number; opacity: number }> = [
      { radius: 0.050, color: 0xECFEFF, opacity: 0.95 },  // filamento blanco (core)
      { radius: 0.120, color: 0x67E8F9, opacity: 0.50 },  // tubo cian (cuerpo)
      { radius: 0.240, color: 0x22D3EE, opacity: 0.18 },  // halo cian (glow)
      { radius: 0.420, color: 0x4ADE80, opacity: 0.07 }   // halo verde lejano (atmósfera)
    ];

    for (let i = 0; i < orderedCubes.length; i++) {
      const a = orderedCubes[i];
      const b = orderedCubes[(i + 1) % orderedCubes.length];

      const start = (a.userData['basePos'] as import('three').Vector3).clone();
      const end = (b.userData['basePos'] as import('three').Vector3).clone();

      // Midpoint empujado radialmente HACIA AFUERA del centro
      // + ligero offset en Z para que el arco se sienta 3D (no plano)
      const mid = start.clone().lerp(end, 0.5);
      const radialDir = new THREE.Vector3(mid.x, mid.y, 0).normalize();
      mid.add(radialDir.multiplyScalar(1.2));
      mid.z = (start.z + end.z) / 2 + 0.5;

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);

      tubeLayers.forEach(layer => {
        const tubeGeo = new THREE.TubeGeometry(curve, 36, layer.radius, 10, false);
        const tubeMat = new THREE.MeshBasicMaterial({
          color: layer.color,
          transparent: true,
          opacity: layer.opacity,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        const tube = new THREE.Mesh(tubeGeo, tubeMat);
        group.add(tube);
        connectionMeshes.push(tube);
      });
    }

    // ---- Interaction state ----
    const mouse = new THREE.Vector2(-2, -2);
    const raycaster = new THREE.Raycaster();
    let hoveredGroup: import('three').Group | null = null;

    let isPointerDown = false;
    let dragStart = { x: 0, y: 0 };
    let dragOffset = { x: 0, y: 0 };
    let didDrag = false;
    const dragRotation = { x: 0, y: 0 };
    const target = { rotX: 0, rotY: 0 };

    const onPointerMove = (event: PointerEvent): void => {
      const rect = host.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      this.hintVisible.set(false);

      if (isPointerDown) {
        dragOffset.x = event.clientX - dragStart.x;
        dragOffset.y = event.clientY - dragStart.y;
        if (Math.abs(dragOffset.x) > 6 || Math.abs(dragOffset.y) > 6) {
          didDrag = true;
        }
        target.rotY = dragRotation.x + dragOffset.x * 0.005;
        target.rotX = dragRotation.y + dragOffset.y * 0.005;
      } else {
        target.rotY = dragRotation.x + mouse.x * 0.22;
        target.rotX = dragRotation.y + -mouse.y * 0.14;
      }
    };

    const onPointerDown = (event: PointerEvent): void => {
      isPointerDown = true;
      didDrag = false;
      dragStart = { x: event.clientX, y: event.clientY };
      dragOffset = { x: 0, y: 0 };

      // CRÍTICO para mobile: actualizar mouse desde el pointerdown.
      // En desktop, mouse se actualiza con pointermove (hover continuo).
      // En mobile, un tap NO dispara pointermove — solo pointerdown/up.
      // Si no sincronizamos aquí, el raycaster apunta a la última posición
      // de hover (o a -2,-2 del init) y nunca detecta el cubo tapeado.
      const rect = host.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      host.setPointerCapture?.(event.pointerId);
    };

    const onPointerUp = (event: PointerEvent): void => {
      if (isPointerDown && didDrag) {
        dragRotation.x += dragOffset.x * 0.005;
        dragRotation.y += dragOffset.y * 0.005;
      } else if (isPointerDown && !didDrag) {
        raycaster.setFromCamera(mouse, camera);
        const meshes = cubeMeshes.map(g => g.userData['cube'] as import('three').Mesh);
        const hits = raycaster.intersectObjects(meshes);
        if (hits.length > 0) {
          // Encontrar el group dueño del mesh
          const found = cubeMeshes.find(g => g.userData['cube'] === hits[0].object);
          if (found) {
            this.selectedTech.set(found.userData['tech'] as Tech);
          }
        } else {
          this.selectedTech.set(null);
        }
      }
      isPointerDown = false;
      host.releasePointerCapture?.(event.pointerId);
    };

    const onPointerLeave = (): void => {
      mouse.set(-2, -2);
      this.hoveredTech.set(null);
      hoveredGroup = null;
      host.style.cursor = 'grab';
    };

    host.addEventListener('pointermove', onPointerMove);
    host.addEventListener('pointerdown', onPointerDown);
    host.addEventListener('pointerup', onPointerUp);
    host.addEventListener('pointercancel', onPointerUp);
    host.addEventListener('pointerleave', onPointerLeave);

    // ---- Resize ----
    const onResize = (): void => {
      width = host.clientWidth;
      height = host.clientHeight;
      if (width === 0 || height === 0) return;
      camera.aspect = width / height;
      adjustForAspect();
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      composer.setSize(width, height);
    };
    window.addEventListener('resize', onResize, { passive: true });

    // ---- Visibilidad: pausar render si el canvas no está en pantalla ----
    // Sin esto, three.js sigue corriendo bloom + raycast + 12 cubos animando
    // incluso cuando el usuario ya hizo scroll a las secciones de abajo →
    // GPU desperdiciada y micro-stutters en el scroll del resto de la página.
    let isVisible = true;
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          isVisible = entry.isIntersecting;
        }
      },
      { threshold: 0, rootMargin: '50px' }  // 50px de margen para reanudar antes
    );
    visibilityObserver.observe(host);

    const onTabVisibility = (): void => {
      // Belt-and-suspenders: el navegador ya throttlea RAF a ~1fps en tabs
      // ocultos, pero esto evita incluso ese 1fps de trabajo inútil.
      if (document.hidden && frameId) {
        // se pausa automáticamente porque el check de abajo retorna early
      }
    };
    document.addEventListener('visibilitychange', onTabVisibility);

    // ---- Animation loop ----
    const clock = new THREE.Clock();
    let frameId = 0;

    const animate = (): void => {
      frameId = requestAnimationFrame(animate);

      // Skip todo el trabajo cuando el canvas no está en viewport
      // o el tab está oculto. RAF sigue corriendo pero retorna en
      // microsegundos en lugar de hacer todo el render pipeline.
      if (!isVisible || document.hidden) {
        return;
      }

      const t = clock.getElapsedTime();

      // Cubos: float + autorrotación + hover scale/emissive
      cubeMeshes.forEach(cubeGroup => {
        const basePos = cubeGroup.userData['basePos'] as import('three').Vector3;
        const phase = cubeGroup.userData['phase'] as number;
        const speed = cubeGroup.userData['speed'] as number;
        const baseScale = cubeGroup.userData['baseScale'] as number;

        cubeGroup.position.x = basePos.x + Math.cos(t * speed + phase) * 0.10;
        cubeGroup.position.y = basePos.y + Math.sin(t * speed + phase) * 0.18;
        cubeGroup.rotation.y += 0.006 * speed;
        cubeGroup.rotation.x += 0.003 * speed;

        const isHovered = cubeGroup === hoveredGroup;
        const targetScale = isHovered ? baseScale * 1.20 : baseScale;
        cubeGroup.scale.x += (targetScale - cubeGroup.scale.x) * 0.12;
        cubeGroup.scale.y = cubeGroup.scale.x;
        cubeGroup.scale.z = cubeGroup.scale.x;

        const cube = cubeGroup.userData['cube'] as import('three').Mesh;
        const mat = cube.material as import('three').MeshStandardMaterial;
        const targetEmissive = isHovered ? 0.55 : 0.18;
        mat.emissiveIntensity += (targetEmissive - mat.emissiveIntensity) * 0.12;

        const edges = cubeGroup.userData['edges'] as import('three').LineSegments;
        const edgesMat = edges.material as import('three').LineBasicMaterial;
        const targetEdgesOpacity = isHovered ? 1 : 0.85;
        edgesMat.opacity += (targetEdgesOpacity - edgesMat.opacity) * 0.12;
      });

      // Tubos pre-baked sobre basePos (no se actualizan por frame —
      // la flotación de los cubos es de solo ~0.18u, los tubos siguen pareciendo
      // anclados a ellos. Trade-off: ahorro 432 cálculos por frame).

      // Group rotation (drag + parallax)
      group.rotation.x += (target.rotX - group.rotation.x) * 0.05;
      group.rotation.y += (target.rotY - group.rotation.y) * 0.05;

      // Partículas drift suave
      particles.rotation.y = t * 0.015;

      // Hover detection
      if (!isPointerDown && mouse.x > -1.5) {
        raycaster.setFromCamera(mouse, camera);
        const meshes = cubeMeshes.map(g => g.userData['cube'] as import('three').Mesh);
        const hits = raycaster.intersectObjects(meshes);
        if (hits.length > 0) {
          const found = cubeMeshes.find(g => g.userData['cube'] === hits[0].object) ?? null;
          if (hoveredGroup !== found) {
            hoveredGroup = found;
            this.hoveredTech.set(found?.userData['tech'] as Tech);
            host.style.cursor = 'pointer';
          }
        } else if (hoveredGroup !== null) {
          hoveredGroup = null;
          this.hoveredTech.set(null);
          host.style.cursor = 'grab';
        }
      }

      composer.render();
    };
    animate();

    // ---- Cleanup ----
    this.destroyRef.onDestroy(() => {
      cancelAnimationFrame(frameId);
      visibilityObserver.disconnect();
      document.removeEventListener('visibilitychange', onTabVisibility);
      host.removeEventListener('pointermove', onPointerMove);
      host.removeEventListener('pointerdown', onPointerDown);
      host.removeEventListener('pointerup', onPointerUp);
      host.removeEventListener('pointercancel', onPointerUp);
      host.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('resize', onResize);

      // Dispose three.js
      cubeMeshes.forEach(g => {
        const cube = g.userData['cube'] as import('three').Mesh;
        const edges = g.userData['edges'] as import('three').LineSegments;
        (cube.material as import('three').MeshStandardMaterial).map?.dispose();
        (cube.material as import('three').MeshStandardMaterial).dispose();
        cube.geometry.dispose();
        (edges.material as import('three').LineBasicMaterial).dispose();
        edges.geometry.dispose();
      });
      connectionMeshes.forEach(tube => {
        tube.geometry.dispose();
        (tube.material as import('three').MeshBasicMaterial).dispose();
      });
      particleGeo.dispose();
      particleMat.dispose();
      fadeGeo.dispose();
      fadeMat.dispose();
      (grid.material as import('three').Material).dispose();
      grid.geometry.dispose();
      composer.dispose?.();
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    });
  }

  /* --------------------------------------------------------------
   * Textura del cubo: gradient brand + label tipográfico
   * Mismo texto en todas las caras
   * -------------------------------------------------------------- */
  private createTechCanvas(tech: Tech): HTMLCanvasElement {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    // Fondo: gradiente del color brand al verde oscuro
    const bg = ctx.createLinearGradient(0, 0, size, size);
    bg.addColorStop(0, this.lightenHex(tech.color, 10));
    bg.addColorStop(0.6, this.darkenHex(tech.color, 15));
    bg.addColorStop(1, '#052E16');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, size, size);

    // Highlight sutil arriba-izquierda
    const high = ctx.createRadialGradient(size * 0.30, size * 0.25, 0, size * 0.30, size * 0.25, size * 0.55);
    high.addColorStop(0, 'rgba(255,255,255,0.30)');
    high.addColorStop(0.6, 'rgba(255,255,255,0.05)');
    high.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = high;
    ctx.fillRect(0, 0, size, size);

    // Borde interno glow
    ctx.strokeStyle = 'rgba(103, 232, 249, 0.55)';
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, size - 40, size - 40);

    // Label
    const labelLen = tech.label.length;
    const fontSize =
      labelLen <= 1 ? 280 :
      labelLen === 2 ? 220 :
      labelLen === 3 ? 170 :
      130;

    ctx.fillStyle = tech.labelColor ?? '#FFFFFF';
    ctx.font = `800 ${fontSize}px Orbitron, Outfit, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 6;

    ctx.fillText(tech.label, size / 2, size / 2 + size * 0.03);

    return canvas;
  }

  private lightenHex(hex: string, percent: number): string {
    const { r, g, b } = this.hexToRgb(hex);
    const delta = Math.round(255 * (percent / 100));
    return `rgb(${Math.min(255, r + delta)}, ${Math.min(255, g + delta)}, ${Math.min(255, b + delta)})`;
  }

  private darkenHex(hex: string, percent: number): string {
    const { r, g, b } = this.hexToRgb(hex);
    const delta = Math.round(255 * (percent / 100));
    return `rgb(${Math.max(0, r - delta)}, ${Math.max(0, g - delta)}, ${Math.max(0, b - delta)})`;
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const clean = hex.replace('#', '');
    const num = parseInt(clean, 16);
    return { r: (num >> 16) & 0xff, g: (num >> 8) & 0xff, b: num & 0xff };
  }
}
