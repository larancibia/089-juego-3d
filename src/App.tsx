import { Canvas, useFrame } from '@react-three/fiber';
import { KeyboardControls, useKeyboardControls } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise, ChromaticAberration } from '@react-three/postprocessing';
import { LevelManager } from './components/World/LevelManager';
import { MaskingHUD } from './components/UI/MaskingHUD';
import { useGameStore } from './store';
import { AudioManager } from './components/Logic/AudioManager';
import { sfx } from './components/Logic/SfxManager';
import { Vector3, Vector2 } from 'three';
import { Suspense, useRef } from 'react';

const keyboardMap = [
  { name: 'forward', keys: ['ArrowUp', 'w', 'W'] },
  { name: 'backward', keys: ['ArrowDown', 's', 'S'] },
  { name: 'left', keys: ['ArrowLeft', 'a', 'A'] },
  { name: 'right', keys: ['ArrowRight', 'd', 'D'] },
  { name: 'focus', keys: ['Space'] },
];

// Efectos visuales que reaccionan al estado mental
const DynamicPostProcessing = () => {
    const anxietyLevel = useGameStore(state => state.anxietyLevel);
    
    // Mapear ansiedad (0-100) a intensidad de efectos
    const aberrationOffset = (anxietyLevel / 100) * 0.01; // Glitch effect
    const vignetteDarkness = 0.8 + (anxietyLevel / 100) * 0.5; // Tunnel vision
    const noiseOpacity = 0.02 + (anxietyLevel / 100) * 0.1; // Visual noise/static

    return (
        <EffectComposer>
            <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} radius={0.4} />
            <ChromaticAberration offset={new Vector2(aberrationOffset, aberrationOffset)} />
            <Vignette eskil={false} offset={0.1} darkness={vignetteDarkness} />
            <Noise opacity={noiseOpacity} />
        </EffectComposer>
    );
};

const PlayerController = () => {
  const { phase, tutorialActive, dismissTutorial, currentLevel, setFocus, tickSimulation, isFocusing } = useGameStore();
  const [, getKeys] = useKeyboardControls();
  
  // Posiciones iniciales ajustadas por nivel
  // Nivel 1 (Trafico) y Nivel 3 (Bus) necesitan empezar más cerca
  const startPos = (currentLevel === 1 || currentLevel === 3) ? new Vector3(0, 1.8, 6) : new Vector3(0, 2.5, 8);
  
  const targetPos = useRef(startPos.clone()); 
  const headBobTimer = useRef(0);
  
  useFrame((state, delta) => {
    const keys = getKeys();
    
    // FOCUS MECHANIC
    const focusActive = keys.focus && phase === 'approach';
    if (focusActive !== isFocusing) setFocus(focusActive);

    // Time Dilation: Si enfocas, el mundo va lento (0.2x), sino normal (1.0x)
    const timeScale = focusActive ? 0.2 : 1.0;
    const speed = 5 * delta * timeScale; // Velocidad afectada por focus

    // SIMULATION LOOP
    if (phase === 'approach') {
        tickSimulation(delta); // Drenaje de bateria/ansiedad
    }

    const isMoving = keys.forward || keys.backward || keys.left || keys.right;

    if (tutorialActive && phase === 'approach' && isMoving) {
        dismissTutorial();
    }

    // Gaze Mechanic Simplificado: Solo visual, la lógica de ansiedad está en tickSimulation
    // Excepción: Nivel Trafico (Level 1) no tiene NPC central
    if (phase === 'approach' && currentLevel !== 1) {
        // Vector forward de la cámara
        const dir = new Vector3();
        state.camera.getWorldDirection(dir);
        
        // El NPC siempre está aprox en (0, 1.3, -4)
        // Vector hacia el NPC
        const target = new Vector3(0, 1.3, -4);
        const toTarget = target.sub(state.camera.position).normalize();
        
        // Dot product: 1 = mirando directo, 0 = 90 grados
        const dot = dir.dot(toTarget);
        
        // Si dot > 0.9 (ángulo cerrado), sube ansiedad
        if (dot > 0.92) {
            // tickAnxiety(0.15); // Movido a tickSimulation global
        } else {
            // tickAnxiety(-0.05); 
        }
    }

    if (phase === 'start') {
        // Reiniciar posición al arrancar nivel
        targetPos.current.copy(startPos);
    }
    else if (phase === 'approach') {
        if (isMoving) {
            // Movimiento
            if (keys.forward) targetPos.current.z -= speed;
            if (keys.backward) targetPos.current.z += speed;
            if (keys.left) targetPos.current.x -= speed;
            if (keys.right) targetPos.current.x += speed;

            // Head Bobbing (Oscilación al caminar)
            headBobTimer.current += delta * 15;
            state.camera.position.y = targetPos.current.y + Math.sin(headBobTimer.current) * 0.05;

            // Sonido de pasos (Trigger en el punto bajo del bobbing)
            if (Math.sin(headBobTimer.current) < -0.9) {
                sfx.playStep();
            }
        } else {
            // Reset altura suavemente al parar
            state.camera.position.y = targetPos.current.y; // Podría interpolarse pero está ok
        }

        // Límites de la habitación (paredes invisibles)
        targetPos.current.z = Math.max(2, Math.min(9, targetPos.current.z));
        targetPos.current.x = Math.max(-3, Math.min(3, targetPos.current.x));

        if (targetPos.current.z < 2.8) {
             useGameStore.setState({ phase: 'ordering' });
        }
    }
    else if (phase === 'ordering' || phase === 'success' || phase === 'failure') {
        targetPos.current.set(0, 2.2, 2.5); // Close up dialogue
        state.camera.lookAt(0, 1.4, -4);
    }
    // phase === 'start' is handled above to reset pos

    // Aplicar movimiento suave a la BASE de la cámara (sin el bobbing)
    state.camera.position.x += (targetPos.current.x - state.camera.position.x) * 0.1;
    state.camera.position.z += (targetPos.current.z - state.camera.position.z) * 0.1;
    
    // Eje Y: Interpolación base + Bobbing si estamos en approach
    const baseY = targetPos.current.y;
    const currentY = state.camera.position.y;
    let nextY = currentY + (baseY - currentY) * 0.1; // Lerp normal

    if (phase === 'approach' && isMoving) {
        // Sobrescribir con bobbing
        nextY = baseY + Math.sin(headBobTimer.current) * 0.05;
    }
    state.camera.position.y = nextY;

    // En approach permitimos mirar libremente para la mecanica de "Look Away"
    if (phase !== 'approach' && phase !== 'ordering' && phase !== 'success' && phase !== 'failure') {
        state.camera.lookAt(0, 1.5, -4);
    }
  });

  return null;
};

function App() {
  return (
    <div className="w-full h-screen bg-slate-950 relative overflow-hidden">
      <MaskingHUD />
      <KeyboardControls map={keyboardMap}>
        <Canvas shadows dpr={[1, 2]} camera={{ fov: 50, position: [0, 2.5, 8] }}>
            <Suspense fallback={null}>
                <AudioManager />
                <PlayerController />
                <LevelManager />
                <DynamicPostProcessing />
            </Suspense>
        </Canvas>
      </KeyboardControls>
    </div>
  );
}

export default App;
