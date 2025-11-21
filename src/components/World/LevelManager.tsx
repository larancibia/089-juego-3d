import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Cylinder, Box, Float, SpotLight, Sphere, Sparkles } from '@react-three/drei';
import { TeddyCharacter } from './TeddyCharacter';
import { useGameStore } from '../../store';

// --- COMPONENTE ARQUITECTÓNICO ESTÁNDAR ---
const RoomShell = ({ color = "#cbd5e1", floorColor = "#334155", darkness = false }) => (
    <group>
        {/* Suelo */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color={floorColor} roughness={darkness ? 0.9 : 0.6} />
        </mesh>
        {!darkness && (
            <>
                {/* Pared Trasera */}
                <mesh position={[0, 5, -8]} receiveShadow>
                    <boxGeometry args={[20, 10, 1]} />
                    <meshStandardMaterial color={color} />
                </mesh>
                {/* Pared Izq */}
                <mesh position={[-10, 5, 0]} rotation={[0, Math.PI/2, 0]} receiveShadow>
                    <boxGeometry args={[20, 10, 1]} />
                    <meshStandardMaterial color={color} />
                </mesh>
                {/* Pared Der */}
                <mesh position={[10, 5, 0]} rotation={[0, -Math.PI/2, 0]} receiveShadow>
                    <boxGeometry args={[20, 10, 1]} />
                    <meshStandardMaterial color={color} />
                </mesh>
                {/* Techo */}
                <mesh position={[0, 10, 0]} rotation={[Math.PI/2, 0, 0]}>
                    <boxGeometry args={[20, 20, 1]} />
                    <meshStandardMaterial color="#e2e8f0" />
                </mesh>
            </>
        )}
    </group>
);

const WoodMaterial = <meshStandardMaterial color="#4a3b32" roughness={0.7} />;

// --- NIVELES EXISTENTES (1-4) [Simplificados aquí para brevedad, asumiendo que se mantienen igual] ---
// (Copiaré los niveles 1-4 del anterior y añadiré los nuevos)

const CafeWorld = () => (
  <group>
    <RoomShell color="#f1f5f9" floorColor="#94a3b8" />
    <ambientLight intensity={0.4} />
    <SpotLight position={[0, 8, 0]} angle={0.5} penumbra={0.5} intensity={200} castShadow color="#fff7ed" />
    <group position={[0, 0, -3]}>
        <RoundedBox args={[8, 1.1, 1.5]} position={[0, 0.55, 0]} radius={0.05} castShadow receiveShadow>
            <meshStandardMaterial color="#e2e8f0" />
             <mesh position={[0, 0, 0.76]}><planeGeometry args={[7.5, 0.9]} />{WoodMaterial}</mesh>
        </RoundedBox>
        <RoundedBox args={[8.2, 0.15, 1.8]} position={[0, 1.15, 0.1]} radius={0.05} castShadow><meshStandardMaterial color="#1e293b" roughness={0.2} /></RoundedBox>
    </group>
    <TeddyCharacter role="barista" position={[0, 1.3, -4.5]} />
  </group>
);

const OfficeWorld = () => (
  <group>
    <RoomShell color="#e2e8f0" floorColor="#64748b" />
    <ambientLight intensity={0.6} />
    <SpotLight position={[0, 9, -2]} angle={0.6} penumbra={0.2} intensity={300} castShadow color="white" />
    <group position={[0, 0, -3]}>
        <Box args={[7, 0.1, 3.5]} position={[0, 1.1, 0]} castShadow>{WoodMaterial}</Box>
        <group position={[0, 1.2, 0.5]}>
             <Box args={[1.2, 0.05, 0.9]}><meshStandardMaterial color="#334155" /></Box>
             <Box args={[1.1, 0.7, 0.01]} position={[0, 0.4, -0.42]} rotation={[-0.2, 0, 0]}><meshBasicMaterial color="#0ea5e9" /></Box>
        </group>
    </group>
    <TeddyCharacter role="boss" position={[0, 1.3, -4.5]} />
  </group>
);

const BusWorld = () => (
  <group>
    <group>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow><planeGeometry args={[6, 30]} /><meshStandardMaterial color="#334155" roughness={0.8} /></mesh>
        <mesh position={[-3, 2, 0]} rotation={[0,0,0]}><boxGeometry args={[0.2, 6, 30]} /><meshStandardMaterial color="#cbd5e1" /></mesh>
        <mesh position={[3, 2, 0]} rotation={[0,0,0]}><boxGeometry args={[0.2, 6, 30]} /><meshStandardMaterial color="#cbd5e1" /></mesh>
        <mesh position={[0, 5, 0]} rotation={[Math.PI/2,0,0]}><boxGeometry args={[6, 30, 0.2]} /><meshStandardMaterial color="#e2e8f0" /></mesh>
    </group>
    <ambientLight intensity={0.3} />
    <SpotLight position={[0, 4.5, 5]} angle={0.8} intensity={100} color="#cffafe" />
    <group position={[0, 0, -3]}>
        <RoundedBox args={[2, 0.5, 1.5]} position={[-2, 0.6, 0]} radius={0.1}><meshStandardMaterial color="#1d4ed8" /></RoundedBox>
        <RoundedBox args={[2, 0.5, 1.5]} position={[2, 0.6, 0]} radius={0.1}><meshStandardMaterial color="#1d4ed8" /></RoundedBox>
    </group>
    <TeddyCharacter role="passenger" position={[0, 1.3, -3.5]} />
  </group>
);

// Componente Invitado Móvil (Party Level)
const MovingGuest = ({ position, color, speed = 1, range = 2 }: any) => {
    const ref = useRef<any>(null);
    const initialX = position[0];
    
    useFrame((state) => {
        if (ref.current) {
            // Movimiento oscilatorio
            ref.current.position.x = initialX + Math.sin(state.clock.elapsedTime * speed) * range;
            // Pequeño salto
            ref.current.position.y = position[1] + Math.abs(Math.sin(state.clock.elapsedTime * speed * 2)) * 0.2;
        }
    });

    return (
        <group ref={ref} position={position}>
            <Sphere args={[0.4]} position={[0, 1, 0]}>
                <meshStandardMaterial color={color} roughness={0.2} />
            </Sphere>
            <Cylinder args={[0.1, 0.4, 1]} position={[0, 0.5, 0]}>
                <meshStandardMaterial color={color} roughness={0.5} />
            </Cylinder>
        </group>
    );
};

const PartyWorld = () => (
  <group>
    <RoomShell color="#1e1b4b" floorColor="#0f172a" />
    <ambientLight intensity={0.1} />
    <Float speed={4}><SpotLight position={[-5, 8, 0]} target-position={[0,0,-4]} angle={0.3} intensity={500} color="#3b82f6" castShadow /></Float>
    <group position={[-4, 2, -5]} rotation={[0, 0.3, 0]}>
        <Box args={[2, 4, 2]} castShadow><meshStandardMaterial color="#020617" /></Box>
    </group>
    
    {/* INVITADOS QUE SE MUEVEN (Obstáculos visuales) */}
    <MovingGuest position={[-2, 0, -2]} color="#ec4899" speed={1.5} range={1.5} />
    <MovingGuest position={[2, 0, -1]} color="#8b5cf6" speed={1.2} range={1} />
    <MovingGuest position={[0, 0, -2.5]} color="#10b981" speed={2} range={2} />

    <TeddyCharacter role="party" position={[0, 1.3, -4]} />
  </group>
);

// --- NUEVOS NIVELES (5-8) ---

// NIVEL 5: CENA FAMILIAR (Suegra)
const DinnerWorld = () => (
    <group>
        <RoomShell color="#fef2f2" floorColor="#7f1d1d" /> {/* Paredes crema, suelo rojo alfombra */}
        <ambientLight intensity={0.5} />
        {/* Lámpara araña central */}
        <SpotLight position={[0, 7, -3]} angle={0.6} intensity={150} color="#fef3c7" castShadow />
        
        {/* Mesa Comedor */}
        <group position={[0, 0, -3]}>
            <Box args={[5, 0.1, 3]} position={[0, 1, 0]}><meshStandardMaterial color="white" /></Box> {/* Mantel blanco */}
            <Cylinder args={[0.2, 0.2, 1]} position={[0, 0.5, 0]}><meshStandardMaterial color="#4a3b32" /></Cylinder>
            
            {/* Platos */}
            <Cylinder args={[0.3, 0.2, 0.05]} position={[0, 1.05, 0.8]}><meshStandardMaterial color="white" /></Cylinder> 
            <Cylinder args={[0.3, 0.2, 0.05]} position={[0, 1.05, -0.8]}><meshStandardMaterial color="white" /></Cylinder>
            
            {/* Comida (Pollo asado abstracto) */}
            <RoundedBox args={[0.6, 0.3, 0.4]} position={[0, 1.2, 0]} radius={0.1}><meshStandardMaterial color="#a16207" /></RoundedBox>
        </group>
        
        <TeddyCharacter role="boss" position={[0, 1.3, -4.5]} /> {/* Reutilizamos Boss como Suegra seria */}
    </group>
);

// NIVEL 6: ENTREVISTA (Interrogatorio)
const InterviewWorld = () => (
    <group>
        <RoomShell color="#f8fafc" floorColor="#e2e8f0" />
        <ambientLight intensity={0.8} />
        {/* Luz muy blanca y fría */}
        <SpotLight position={[0, 8, -2]} angle={0.4} intensity={400} color="#f0f9ff" castShadow />
        
        {/* Mesa larga y vacía */}
        <group position={[0, 0, -3]}>
             <Box args={[6, 0.1, 2]} position={[0, 1.1, 0]}><meshStandardMaterial color="#cbd5e1" metalness={0.5} /></Box>
        </group>

        <TeddyCharacter role="boss" position={[0, 1.3, -4.5]} />
    </group>
);

// NIVEL 7: PRIMERA CITA (Romántico)
const DateWorld = () => (
    <group>
        <RoomShell color="#4c0519" floorColor="#000000" />
        <ambientLight intensity={0.1} />
        {/* Luz de velas cálida */}
        <pointLight position={[0, 1.5, -3]} intensity={2} color="#f43f5e" distance={5} />
        
        {/* Mesa pequeña redonda */}
        <group position={[0, 0, -3]}>
            <Cylinder args={[1.5, 1.5, 0.1]} position={[0, 1, 0]}><meshStandardMaterial color="#be123c" /></Cylinder>
            <Cylinder args={[0.1, 0.1, 1]} position={[0, 0.5, 0]}><meshStandardMaterial color="black" /></Cylinder>
            {/* Velas */}
            <Cylinder args={[0.05, 0.05, 0.3]} position={[0, 1.15, 0]}><meshStandardMaterial color="#fff1f2" /></Cylinder>
            <Sphere args={[0.05]} position={[0, 1.35, 0]}><meshBasicMaterial color="#fbbf24" /></Sphere>
        </group>

        <TeddyCharacter role="party" position={[0, 1.3, -4.2]} /> {/* Party bear reuse */}
    </group>
);

// NIVEL 8: HABLAR EN PÚBLICO (Pesadilla)
const PublicSpeakingWorld = () => (
    <group>
        <RoomShell floorColor="black" darkness={true} />
        <ambientLight intensity={0.05} />
        
        {/* Foco cenital sobre el jugador (pero simulado sobre la camara/atril) */}
        <SpotLight position={[0, 10, 5]} target-position={[0,0,5]} angle={0.2} intensity={1000} color="white" />

        {/* Atril */}
        <group position={[0, 0, -2]}>
             <Box args={[1.5, 3, 1]} position={[0, 1.5, 0]}><meshStandardMaterial color="#4a3b32" /></Box>
             {/* Micrófono */}
             <Cylinder args={[0.05, 0.05, 0.5]} position={[0, 3.2, 0.2]} rotation={[0.5, 0, 0]}><meshStandardMaterial color="#94a3b8" /></Cylinder>
             <Sphere args={[0.1]} position={[0, 3.5, 0.3]}><meshStandardMaterial color="#1e293b" /></Sphere>
        </group>

        {/* PÚBLICO (Cientos de ojos brillantes en la oscuridad) */}
        <group position={[0, 1, -8]}>
            {[...Array(20)].map((_, i) => (
                <group key={i} position={[Math.random() * 10 - 5, Math.random() * 3, Math.random() * -5]}>
                    <Sphere args={[0.05]} position={[-0.1, 0, 0]}><meshBasicMaterial color="white" /></Sphere>
                    <Sphere args={[0.05]} position={[0.1, 0, 0]}><meshBasicMaterial color="white" /></Sphere>
                </group>
            ))}
        </group>
    </group>
);

// NIVEL 1: TRÁFICO (Crosswalk Standoff - Active Hazard)
const TrafficWorld = () => {
    const { hitObstacle, isFocusing } = useGameStore();
    const carRef = useRef<any>(null);
    // const playerPos = useRef(new Vector3(0, 0, 6)); // Unused, reading from state directly

    useFrame((state, delta) => {
        // Time Dilation
        const timeScale = isFocusing ? 0.2 : 1.0;
        
        if (carRef.current) {
            // Mover coche de izquierda a derecha
            carRef.current.position.x += 8 * delta * timeScale;
            
            // Reset coche (loop infinito)
            if (carRef.current.position.x > 10) {
                carRef.current.position.x = -10;
            }

            // Actualizar posición jugador (aproximada, ya que la cámara la controla App.tsx)
            // En un juego real pasaríamos la pos del jugador como prop, aquí leemos la camara
            const playerZ = state.camera.position.z;
            const playerX = state.camera.position.x;

            // DETECCION DE COLISION (Hitbox simple)
            const carX = carRef.current.position.x;
            const carZ = carRef.current.position.z; // -2
            
            // Si el jugador cruza (Z < 0) cuando el coche pasa (X cerca de 0)
            if (Math.abs(playerZ - carZ) < 1.5 && Math.abs(playerX - carX) < 2.5) {
                hitObstacle(); // GAME OVER
            }
        }
    });

    return (
    <group>
        <RoomShell color="#0f172a" floorColor="#1e293b" />
        <ambientLight intensity={0.2} />
        <SpotLight position={[-4, 8, 0]} angle={0.5} intensity={200} color="#fef3c7" castShadow />
        <SpotLight position={[4, 8, -5]} angle={0.5} intensity={200} color="#fef3c7" castShadow />

        <group position={[0, 0.01, 0]}>
            {[...Array(6)].map((_, i) => (
                <mesh key={i} position={[0, 0, i * 1.5 - 4]} rotation={[-Math.PI/2, 0, 0]}>
                    <planeGeometry args={[6, 0.8]} />
                    <meshStandardMaterial color="white" />
                </mesh>
            ))}
        </group>

        <group ref={carRef} position={[-10, 0.5, -2]} rotation={[0, -Math.PI/2, 0]}> {/* Empieza fuera */}
             <SpotLight position={[-0.6, 0.5, 2]} target-position={[-0.6, 0.5, 5]} angle={0.4} intensity={500} color="#f0f9ff" />
             <SpotLight position={[0.6, 0.5, 2]} target-position={[0.6, 0.5, 5]} angle={0.4} intensity={500} color="#f0f9ff" />
             <RoundedBox args={[2, 1, 4]} position={[0, 0.5, 0]} radius={0.2} castShadow><meshStandardMaterial color="#1e293b" metalness={0.8} /></RoundedBox>
             <Box args={[1.8, 0.8, 2]} position={[0, 1.2, -0.5]}><meshStandardMaterial color="#0f172a" /></Box>
             <Cylinder args={[0.4, 0.4, 0.2]} position={[-1, 0.4, 1.2]} rotation={[0,0,Math.PI/2]}><meshStandardMaterial color="black" /></Cylinder>
             <Cylinder args={[0.4, 0.4, 0.2]} position={[1, 0.4, 1.2]} rotation={[0,0,Math.PI/2]}><meshStandardMaterial color="black" /></Cylinder>
        </group>
    </group>
)};

export const LevelManager = () => {
  const currentLevel = useGameStore((state) => state.currentLevel);

  return (
    <group>
      <Sparkles count={100} scale={12} size={2} speed={0.4} opacity={0.5} color="#cbd5e1" />
      {currentLevel === 1 && <TrafficWorld />}
      {currentLevel === 2 && <OfficeWorld />}
      {currentLevel === 3 && <BusWorld />}
      {currentLevel === 4 && <PartyWorld />}
      {currentLevel === 5 && <DinnerWorld />}
      {currentLevel === 6 && <InterviewWorld />}
      {currentLevel === 7 && <DateWorld />}
      {currentLevel === 8 && <PublicSpeakingWorld />}
      {currentLevel === 9 && <CafeWorld />}
    </group>
  );
};
