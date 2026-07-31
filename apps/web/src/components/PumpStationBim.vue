<script setup lang="ts">
/**
 * Procedural BIM-style 3D viewer for the Chuhe First-Level pump station.
 * Real BIM (.rvt) files aren't bundled, so this synthesises a recognisable
 * pump-station scene in Three.js and demonstrates the "机组模型拆解"
 * (unit disassembly) capability the report specifies (15.5.3.10).
 *
 * Interactions: orbit (drag) / zoom (scroll) / pan (right-drag);
 * "拆解" toggle explodes the pump units into key components.
 */
import { ref, onMounted, onBeforeUnmount, shallowRef } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const canvasEl = ref<HTMLDivElement | null>(null)
const exploded = ref(false)
const selected = ref<string | null>(null)
const renderer = shallowRef<THREE.WebGLRenderer | null>(null)

interface PartInfo { name: string; desc: string }
const partInfo: Record<string, PartInfo> = {
  motor: { name: '电动机', desc: '机组动力核心，滁河一级站装机 19200kW' },
  shaft: { name: '主轴', desc: '传递扭矩，连接电机与叶轮' },
  impeller: { name: '叶轮', desc: '水流能量转换核心部件' },
  volute: { name: '蜗壳', desc: '汇集水流、转换动能 为压能' },
  house: { name: '泵房主体', desc: '钢筋混凝土结构，含行车、电气设备' },
  slab: { name: '进水底板', desc: '泵站基础，前后池连接' },
}

const components: Array<{ mesh: THREE.Object3D; home: THREE.Vector3; target: THREE.Vector3; key: string }> = []

onMounted(() => {
  const el = canvasEl.value
  if (!el) return
  const w = el.clientWidth
  const h = el.clientHeight

  const scene = new THREE.Scene()
  scene.background = new THREE.Color('#0a1929')
  scene.fog = new THREE.Fog('#0a1929', 30, 90)

  const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 200)
  camera.position.set(18, 14, 22)

  const r = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  r.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  r.setSize(w, h)
  el.appendChild(r.domElement)
  renderer.value = r

  const controls = new OrbitControls(camera, r.domElement)
  controls.enableDamping = true
  controls.maxPolarAngle = Math.PI / 2.05
  controls.minDistance = 10
  controls.maxDistance = 50
  controls.target.set(0, 3, 0)

  // Lights
  scene.add(new THREE.AmbientLight(0x4477aa, 0.6))
  const dir = new THREE.DirectionalLight(0xffffff, 1.1)
  dir.position.set(20, 30, 15)
  scene.add(dir)
  const fill = new THREE.DirectionalLight(0x00d4ff, 0.4)
  fill.position.set(-15, 10, -10)
  scene.add(fill)

  // Grid + ground
  const grid = new THREE.GridHelper(60, 30, 0x00d4ff, 0x113355)
  ;(grid.material as THREE.Material).opacity = 0.3
  ;(grid.material as THREE.Material).transparent = true
  scene.add(grid)

  // Water surface (front pool)
  const water = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 14),
    new THREE.MeshStandardMaterial({ color: 0x0a4a7a, transparent: true, opacity: 0.7, metalness: 0.6, roughness: 0.2 }),
  )
  water.rotation.x = -Math.PI / 2
  water.position.set(0, 0.1, -10)
  scene.add(water)

  const addPart = (mesh: THREE.Object3D, key: string, homeY: number, targetY: number) => {
    mesh.userData.key = key
    components.push({ mesh, home: mesh.position.clone(), target: new THREE.Vector3(mesh.position.x, targetY, mesh.position.z), key })
    scene.add(mesh)
    // store home Y offset for explode
    ;(mesh.userData as any).homeY = homeY
    ;(mesh.userData as any).targetY = targetY
  }

  // Slab
  const slab = new THREE.Mesh(
    new THREE.BoxGeometry(22, 1, 8),
    new THREE.MeshStandardMaterial({ color: 0x3a4a5a, roughness: 0.9 }),
  )
  slab.position.set(0, 0.5, 0)
  slab.userData.key = 'slab'
  scene.add(slab)

  // Pump house (walls, semi-transparent to see inside)
  const house = new THREE.Mesh(
    new THREE.BoxGeometry(20, 7, 7),
    new THREE.MeshStandardMaterial({ color: 0x2a4a6a, transparent: true, opacity: 0.25, roughness: 0.6 }),
  )
  house.position.set(0, 4.5, 0)
  house.userData.key = 'house'
  scene.add(house)

  // Gantry crane on top
  const crane = new THREE.Mesh(
    new THREE.BoxGeometry(20, 0.6, 1.2),
    new THREE.MeshStandardMaterial({ color: 0xffb100, metalness: 0.7, roughness: 0.3 }),
  )
  crane.position.set(0, 8.5, 0)
  scene.add(crane)

  // 6 pump units along X, each as a group of 4 disassemblable parts
  const unitColors = { motor: 0xffb100, shaft: 0xaaaaaa, impeller: 0x00d4ff, volute: 0x0066ff }
  for (let i = 0; i < 6; i++) {
    const x = -8 + i * 3.2
    // Motor (top)
    const motor = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 0.8, 1.6, 24),
      new THREE.MeshStandardMaterial({ color: unitColors.motor, metalness: 0.6, roughness: 0.3 }),
    )
    motor.position.set(x, 6.2, 0)
    addPart(motor, 'motor', 6.2, 9.5 + i * 0.3)
    // Shaft
    const shaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 2.2, 16),
      new THREE.MeshStandardMaterial({ color: unitColors.shaft, metalness: 0.8, roughness: 0.2 }),
    )
    shaft.position.set(x, 4.3, 0)
    addPart(shaft, 'shaft', 4.3, 6.5)
    // Impeller
    const impeller = new THREE.Mesh(
      new THREE.TorusGeometry(0.7, 0.22, 12, 24),
      new THREE.MeshStandardMaterial({ color: unitColors.impeller, metalness: 0.7, roughness: 0.25 }),
    )
    impeller.position.set(x, 3.0, 0)
    impeller.rotation.x = Math.PI / 2
    addPart(impeller, 'impeller', 3.0, 4.2)
    // Volute
    const volute = new THREE.Mesh(
      new THREE.SphereGeometry(0.9, 20, 16),
      new THREE.MeshStandardMaterial({ color: unitColors.volute, metalness: 0.5, roughness: 0.4 }),
    )
    volute.position.set(x, 1.8, 0)
    volute.scale.y = 0.7
    addPart(volute, 'volute', 1.8, 1.8)
  }

  // Raycaster for click selection
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()
  let hovered: THREE.Mesh | null = null

  function onMove(e: MouseEvent) {
    const rect = r.domElement.getBoundingClientRect()
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    raycaster.setFromCamera(mouse, camera)
    const hits = raycaster.intersectObjects(scene.children, true).filter((h) => h.object.userData.key)
    if (hits.length) {
      const obj = hits[0].object as THREE.Mesh
      if (hovered && hovered !== obj) (hovered.material as THREE.MeshStandardMaterial).emissive?.setHex(0x000000)
      hovered = obj
      ;(hovered.material as THREE.MeshStandardMaterial).emissive?.setHex(0x004466)
      r.domElement.style.cursor = 'pointer'
    } else {
      if (hovered) (hovered.material as THREE.MeshStandardMaterial).emissive?.setHex(0x000000)
      hovered = null
      r.domElement.style.cursor = 'grab'
    }
  }
  function onClick() {
    if (hovered) selected.value = (hovered.userData.key as string) ?? null
  }
  r.domElement.addEventListener('mousemove', onMove)
  r.domElement.addEventListener('click', onClick)

  // Animation loop
  let raf = 0
  const animate = () => {
    raf = requestAnimationFrame(animate)
    // animate explode
    for (const c of components) {
      const ud = c.mesh.userData as any
      const targetY = exploded.value ? ud.targetY : ud.homeY
      c.mesh.position.y += (targetY - c.mesh.position.y) * 0.12
    }
    controls.update()
    r.render(scene, camera)
  }
  animate()

  // Resize
  const ro = new ResizeObserver(() => {
    const nw = el.clientWidth
    const nh = el.clientHeight
    camera.aspect = nw / nh
    camera.updateProjectionMatrix()
    r.setSize(nw, nh)
  })
  ro.observe(el)

  onBeforeUnmount(() => {
    cancelAnimationFrame(raf)
    ro.disconnect()
    r.domElement.removeEventListener('mousemove', onMove)
    r.domElement.removeEventListener('click', onClick)
    controls.dispose()
    r.dispose()
    el.removeChild(r.domElement)
  })
})

function toggleExplode() {
  exploded.value = !exploded.value
}
</script>

<template>
  <div class="bim">
    <div ref="canvasEl" class="bim__canvas" />
    <div class="bim__hud">
      <button class="bim__btn" :class="{ 'bim__btn--active': exploded }" @click="toggleExplode">
        {{ exploded ? '🔀 收合机组' : '🔍 拆解机组' }}
      </button>
      <div class="bim__hint">拖动旋转 · 滚轮缩放 · 右键平移 · 点击部件查看</div>
    </div>
    <transition name="bim-info">
      <div v-if="selected && partInfo[selected]" class="bim__info wd-panel">
        <div class="bim__info-name">{{ partInfo[selected].name }}</div>
        <div class="bim__info-desc">{{ partInfo[selected].desc }}</div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.bim {
  position: relative;
  height: 480px;
  border-radius: 12px;
  overflow: hidden;
  background: #0a1929;
  border: 1px solid rgba(0, 212, 255, 0.15);
}
.bim__canvas {
  width: 100%;
  height: 100%;
}
.bim__canvas :deep(canvas) {
  display: block;
  cursor: grab;
}
.bim__hud {
  position: absolute;
  top: 14px;
  left: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 2;
}
.bim__btn {
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 8px;
  background: rgba(6, 21, 40, 0.7);
  color: var(--wd-text);
  backdrop-filter: blur(8px);
  transition: all 0.18s;
}
.bim__btn:hover {
  border-color: var(--wd-primary);
}
.bim__btn--active {
  background: var(--wd-gradient);
  border-color: transparent;
  color: #fff;
}
.bim__hint {
  font-size: 11px;
  color: var(--wd-text-dim);
}
.bim__info {
  position: absolute;
  bottom: 14px;
  right: 14px;
  padding: 12px 16px;
  width: 240px;
  z-index: 2;
}
.bim__info-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--wd-primary);
  margin-bottom: 4px;
}
.bim__info-desc {
  font-size: 12px;
  color: var(--wd-text-dim);
  line-height: 1.6;
}
.bim-info-enter-active,
.bim-info-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.bim-info-enter-from,
.bim-info-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
