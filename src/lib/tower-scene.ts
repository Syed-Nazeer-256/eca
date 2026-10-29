import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

/**
 * "Blueprint to built". One procedural tower, built by a rising clipping plane
 * (threejs-towers technique): finished work below the working level, green
 * blueprint edges above it, scaffolding one step ahead.
 * Driven by a single 0..1 value; the caller owns the clock (GSAP ticker).
 */

const N = 30; // storeys
const FH = 0.32; // storey height
const W = 2.4; // base width
const BODY = N * FH;
const TOP = BODY + 2.35; // crown and spire
const widthAt = (y: number) => W * (1 - 0.16 * Math.min(Math.max(y, 0), BODY) / BODY);

const C = {
  ground: 0x0b1110,
  accent: 0x3db75a,
  ink: 0xeceFEa,
  line: 0x2a3a34,
};

export type TowerScene = {
  setTarget: (v: number) => void;
  setPointer: (x: number, y: number) => void;
  tick: (time: number, deltaMs: number) => void;
  setVisible: (v: boolean) => void;
  destroy: () => void;
};

type Opts = {
  onUpdate?: (build: number) => void;
  /** Render the finished tower immediately (poster capture). */
  complete?: boolean;
  /** Right-to-left pages: frame the tower on the left of the copy. */
  mirror?: boolean;
};

function box(sx: number, sy: number, sz: number, x: number, y: number, z: number) {
  const g = new THREE.BoxGeometry(sx, sy, sz);
  g.translate(x, y, z);
  return g;
}

/** Window atlas: one row per storey, so each floor gets its own lit pattern. */
function windowTexture(rand: () => number) {
  const cols = 16;
  const rowH = 8;
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = N * rowH;
  const g = c.getContext('2d')!;
  g.fillStyle = '#000';
  g.fillRect(0, 0, c.width, c.height);
  const cw = c.width / cols;
  for (let r = 0; r < N; r++) {
    for (let k = 0; k < cols; k++) {
      if (rand() > 0.42) continue;
      const v = Math.round(150 + rand() * 105);
      g.fillStyle = `rgb(${v},${v},${v})`;
      g.fillRect(k * cw + 2, c.height - (r + 1) * rowH + 2, cw - 4, rowH - 4);
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Deterministic random so the city and the windows are the same on every visit. */
function seeded(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

export function createTowerScene(host: HTMLElement, opts: Opts = {}): TowerScene | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: host.clientWidth >= 900, alpha: true, powerPreference: 'high-performance' });
  } catch {
    return null;
  }
  const isSmall = () => host.clientWidth < 900;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSmall() ? 1.25 : 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.localClippingEnabled = true;
  renderer.setClearColor(0x000000, 0);
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(C.ground, 0.034);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envRT.texture;
  scene.environmentIntensity = 0.38;

  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 200);

  // Light: one warm key, a cool sky fill, a brand-green rim from behind.
  scene.add(new THREE.HemisphereLight(0xdbe9e1, C.ground, 0.55));
  const key = new THREE.DirectionalLight(0xfff2e2, 1.7);
  key.position.set(8, 14, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(C.accent, 1.3);
  rim.position.set(-7, 5, -9);
  scene.add(rim);

  // Clipping planes. Solid keeps y <= h; blueprint keeps y >= h; the core leads the floors.
  const solidPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
  const bluePlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const corePlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);

  const rand = seeded(20261029);
  const winTex = windowTexture(rand);

  const M = {
    slab: new THREE.MeshStandardMaterial({ color: 0xc9d0cb, roughness: 0.82, metalness: 0, clippingPlanes: [solidPlane] }),
    glass: new THREE.MeshStandardMaterial({
      color: 0x0e2420,
      metalness: 0.88,
      roughness: 0.16,
      emissive: 0xffe6bd,
      emissiveMap: winTex,
      emissiveIntensity: 0.2,
      clippingPlanes: [solidPlane],
    }),
    fin: new THREE.MeshStandardMaterial({ color: 0x9aa7a0, metalness: 0.65, roughness: 0.32, clippingPlanes: [solidPlane] }),
    core: new THREE.MeshStandardMaterial({ color: 0x4d5651, roughness: 0.95, clippingPlanes: [corePlane] }),
    blue: new THREE.LineBasicMaterial({ color: C.accent, transparent: true, opacity: 0.5, clippingPlanes: [bluePlane] }),
    level: new THREE.LineBasicMaterial({ color: C.accent, transparent: true, opacity: 0.95 }),
    pour: new THREE.MeshBasicMaterial({ color: C.accent, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
    scaffold: new THREE.LineBasicMaterial({ color: C.ink, transparent: true, opacity: 0.38 }),
    city: new THREE.LineBasicMaterial({ color: 0x5c7268, transparent: true, opacity: 0.32 }),
    tip: new THREE.MeshBasicMaterial({ color: C.accent }),
    ground: new THREE.MeshStandardMaterial({ color: C.ground, roughness: 1, metalness: 0 }),
  };

  // ── Tower geometry, merged by material ──
  const slabs: THREE.BufferGeometry[] = [];
  const glass: THREE.BufferGeometry[] = [];
  const fins: THREE.BufferGeometry[] = [];
  const blueprint: THREE.BufferGeometry[] = [];

  for (let i = 0; i <= N; i++) {
    const y = i * FH;
    const w = widthAt(y) + 0.08;
    const s = box(w, 0.05, w, 0, y + 0.025, 0);
    slabs.push(s);
    blueprint.push(new THREE.EdgesGeometry(s));
  }
  for (let i = 0; i < N; i++) {
    const y0 = i * FH + 0.05;
    const h = FH - 0.05;
    const w = widthAt(y0 + h / 2) - 0.02;
    const g = box(w, h, w, 0, y0 + h / 2, 0);
    const uv = g.attributes.uv as THREE.BufferAttribute;
    for (let k = 0; k < uv.count; k++) uv.setY(k, (i + uv.getY(k)) / N);
    glass.push(g);
    // Vertical fins: the facade rhythm.
    const per = 8;
    for (let k = 0; k < per; k++) {
      const t = -w / 2 + ((k + 0.5) * w) / per;
      const o = w / 2 + 0.03;
      fins.push(box(0.026, h, 0.07, t, y0 + h / 2, o), box(0.026, h, 0.07, t, y0 + h / 2, -o));
      fins.push(box(0.07, h, 0.026, o, y0 + h / 2, t), box(0.07, h, 0.026, -o, y0 + h / 2, t));
    }
  }
  // Crown: stepped glass and metal, then the spire.
  const wTop = widthAt(BODY);
  const crown = [
    [wTop * 0.86, 0.5, BODY],
    [wTop * 0.6, 0.45, BODY + 0.5],
    [wTop * 0.36, 0.4, BODY + 0.95],
  ];
  crown.forEach(([w, h, y], i) => {
    const g = box(w, h, w, 0, y + h / 2, 0);
    if (i === 0) {
      const uv = g.attributes.uv as THREE.BufferAttribute;
      for (let k = 0; k < uv.count; k++) uv.setY(k, (N - 1 + uv.getY(k)) / N);
    }
    (i === 0 ? glass : fins).push(g);
    blueprint.push(new THREE.EdgesGeometry(box(w, h, w, 0, y + h / 2, 0)));
  });
  const corners: number[] = [];
  for (let i = 0; i < N; i++) {
    const y0 = i * FH;
    const y1 = y0 + FH;
    const a = (widthAt(y0) + 0.08) / 2;
    const b = (widthAt(y1) + 0.08) / 2;
    for (const [sx, sz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) corners.push(sx * a, y0, sz * a, sx * b, y1, sz * b);
  }
  const cornerGeo = new THREE.BufferGeometry();
  cornerGeo.setAttribute('position', new THREE.Float32BufferAttribute(corners, 3));
  blueprint.push(cornerGeo);
  const spire = new THREE.CylinderGeometry(0.014, 0.06, 1.0, 8);
  spire.translate(0, BODY + 1.35 + 0.5, 0);
  fins.push(spire);

  // Index-free copies so every merge input matches.
  const merge = (list: THREE.BufferGeometry[]) => mergeGeometries(list.map((g) => (g.index ? g.toNonIndexed() : g)), false)!;

  const tower = new THREE.Group();
  tower.add(new THREE.Mesh(merge(slabs), M.slab));
  tower.add(new THREE.Mesh(merge(glass), M.glass));
  tower.add(new THREE.Mesh(merge(fins), M.fin));
  const core = new THREE.Mesh(box(W * 0.36, BODY + 0.7, W * 0.36, 0, (BODY + 0.7) / 2, 0), M.core);
  tower.add(core);
  tower.add(new THREE.LineSegments(merge(blueprint), M.blue));
  scene.add(tower);

  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 8), M.tip);
  tip.position.y = TOP;
  scene.add(tip);

  // ── Working level: a laser line and a faint pour at the build height ──
  const levelGeo = new THREE.BufferGeometry().setFromPoints(
    [
      [-0.5, -0.5],
      [0.5, -0.5],
      [0.5, 0.5],
      [-0.5, 0.5],
    ].map(([x, z]) => new THREE.Vector3(x, 0, z)),
  );
  const level = new THREE.LineLoop(levelGeo, M.level);
  scene.add(level);
  const pour = new THREE.Mesh(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2), M.pour);
  scene.add(pour);

  // ── Scaffolding: ignores the clip, always one step ahead ──
  const sp: number[] = [];
  for (let side = 0; side < 4; side++) {
    for (let k = 0; k <= 8; k++) {
      const t = -0.5 + k / 8;
      const [x, z] = side === 0 ? [t, -0.5] : side === 1 ? [0.5, t] : side === 2 ? [-t, 0.5] : [-0.5, -t];
      sp.push(x, 0, z, x, 1, z);
    }
    for (const y of [0, 0.5, 1]) {
      const a = side === 0 ? [-0.5, -0.5, 0.5, -0.5] : side === 1 ? [0.5, -0.5, 0.5, 0.5] : side === 2 ? [0.5, 0.5, -0.5, 0.5] : [-0.5, 0.5, -0.5, -0.5];
      sp.push(a[0], y, a[1], a[2], y, a[3]);
    }
  }
  const scaffoldGeo = new THREE.BufferGeometry();
  scaffoldGeo.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3));
  const scaffold = new THREE.LineSegments(scaffoldGeo, M.scaffold);
  scene.add(scaffold);

  // ── Blueprint city: massing in dim line, a site grid, the plot ──
  const cityGeo: THREE.BufferGeometry[] = [];
  const cr = seeded(7);
  for (let i = 0; i < 34; i++) {
    const a = cr() * Math.PI * 2;
    const r = 5 + cr() * 13;
    const sx = 0.8 + cr() * 1.8;
    const sz = 0.8 + cr() * 1.8;
    const sy = 0.4 + cr() * (r < 9 ? 2.4 : 4.2);
    cityGeo.push(new THREE.EdgesGeometry(box(sx, sy, sz, Math.cos(a) * r, sy / 2, Math.sin(a) * r)));
  }
  scene.add(new THREE.LineSegments(merge(cityGeo), M.city));
  const grid = new THREE.GridHelper(70, 70, C.line, C.line);
  (grid.material as THREE.Material).transparent = true;
  (grid.material as THREE.Material).opacity = 0.55;
  grid.position.y = 0.002;
  scene.add(grid);
  const plotGeo = new THREE.EdgesGeometry(new THREE.PlaneGeometry(W + 2.6, W + 2.6).rotateX(-Math.PI / 2));
  const plot = new THREE.LineSegments(plotGeo, new THREE.LineBasicMaterial({ color: C.accent, transparent: true, opacity: 0.4 }));
  plot.position.y = 0.004;
  scene.add(plot);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(140, 140).rotateX(-Math.PI / 2), M.ground);
  scene.add(ground);

  // ── State ──
  let target = opts.complete ? 1 : 0;
  let cur = opts.complete ? 1 : 0;
  let px = 0;
  let py = 0;
  let spx = 0;
  let spy = 0;
  let visible = true;
  let small = isSmall();

  const resize = () => {
    const w = host.clientWidth;
    const h = host.clientHeight;
    if (!w || !h) return;
    small = isSmall();
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = small ? 42 : 34;
    // Frame the tower right of the copy on wide screens, high in frame on phones.
    if (small) camera.setViewOffset(w, h, 0, h * 0.16, w, h);
    else camera.setViewOffset(w, h, (opts.mirror ? 1 : -1) * w * 0.2, 0, w, h);
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  const smooth = (e0: number, e1: number, x: number) => {
    const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
    return t * t * (3 - 2 * t);
  };

  const render = (time: number, dt: number) => {
    cur += (target - cur) * Math.min(1, dt * 3.2);
    if (Math.abs(target - cur) < 0.0005) cur = target;
    const h = cur * TOP;
    const hb = Math.min(h, BODY);
    const done = smooth(0.94, 1, cur);

    solidPlane.constant = h;
    bluePlane.constant = -h;
    corePlane.constant = h + 0.6;

    const lw = widthAt(h) + 0.3;
    level.position.y = Math.min(h, TOP) + 0.01;
    level.scale.set(lw, 1, lw);
    pour.position.y = level.position.y;
    pour.scale.set(lw - 0.3, 1, lw - 0.3);
    const building = 1 - done;
    M.level.opacity = 0.95 * building;
    M.pour.opacity = 0.16 * building;
    level.visible = pour.visible = building > 0.01;

    const sw = widthAt(hb) + 0.34;
    scaffold.position.y = Math.max(0, hb - 0.28);
    scaffold.scale.set(sw, 0.95, sw);
    M.scaffold.opacity = 0.38 * (1 - smooth(0.8, 0.86, cur));
    scaffold.visible = M.scaffold.opacity > 0.01;

    M.glass.emissiveIntensity = 0.16 + 1.1 * done;
    M.tip.color.setHex(Math.sin(time * 3) > 0.2 ? C.accent : 0x1d4a2a);

    // Camera: low and close while the base goes in, rising and pulling back to frame the top-out.
    spx += (px - spx) * Math.min(1, dt * 2.5);
    spy += (py - spy) * Math.min(1, dt * 2.5);
    const p = cur;
    const radius = (small ? 30 : 22) - 3.5 * p;
    const angle = 0.72 + 0.6 * p + Math.sin(time * 0.12) * 0.05 + spx * 0.12;
    const camY = 2.8 + 4.8 * p + spy * 0.45;
    const tY = 5.2 + 1.4 * p;
    camera.position.set(Math.sin(angle) * radius, camY, Math.cos(angle) * radius);
    camera.lookAt(0, tY, 0);

    renderer.render(scene, camera);
    opts.onUpdate?.(cur);
  };

  let last = performance.now();
  const tick = (time: number) => {
    const now = performance.now();
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!visible) return;
    render(time, dt);
  };
  if (opts.complete) render(0, 0.016);

  return {
    setTarget: (v) => {
      target = Math.min(1, Math.max(0, v));
    },
    setPointer: (x, y) => {
      px = x;
      py = y;
    },
    tick,
    setVisible: (v) => {
      visible = v;
      last = performance.now();
    },
    destroy: () => {
      ro.disconnect();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose?.();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach((x) => x.dispose());
      });
      winTex.dispose();
      envRT.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}
