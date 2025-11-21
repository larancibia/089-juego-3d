import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Cylinder, Box, Sphere, Text } from '@react-three/drei';
import { MathUtils } from 'three';

// --- MATERIALES AVANZADOS ---
const WoodMaterial = <meshStandardMaterial color="#4a3b32" roughness={0.7} />; // Madera oscura
const CounterTopMaterial = <meshStandardMaterial color="#1e293b" roughness={0.2} metalness={0.2} />; // Granito negro
const MetalMaterial = <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.9} />; // Cromo
// const WallMaterial = <meshStandardMaterial color="#f1f5f9" roughness={0.9} />; // Unused
const BearFurMaterial = <meshStandardMaterial color="#60a5fa" roughness={1} />; // Azul peluche mate
const BellyMaterial = <meshStandardMaterial color="#ffffff" roughness={1} />;
const EyeMaterial = <meshStandardMaterial color="black" roughness={0} metalness={0.5} />; // Ojos brillantes

// --- COMPONENTES DETALLADOS ---

const HangingLamp = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    {/* Cable */}
    <mesh position={[0, 1, 0]}>
      <cylinderGeometry args={[0.02, 0.02, 2]} />
      <meshStandardMaterial color="#1e293b" />
    </mesh>
    {/* Pantalla Lámpara */}
    <mesh position={[0, 0, 0]}>
      <cylinderGeometry args={[0.2, 0.5, 0.4, 32]} />
      <meshStandardMaterial color="#1e293b" side={2} />
    </mesh>
    {/* Bombilla (Emisiva) */}
    <mesh position={[0, -0.1, 0]}>
      <sphereGeometry args={[0.15]} />
      <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={2} toneMapped={false} />
    </mesh>
    {/* Luz Real */}
    <pointLight intensity={0.5} distance={5} color="#fbbf24" position={[0, -0.5, 0]} castShadow />
  </group>
);

const Stool = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    {/* Asiento */}
    <RoundedBox args={[0.6, 0.1, 0.6]} position={[0, 0.7, 0]} radius={0.05}>
        <meshStandardMaterial color="#78350f" roughness={0.5} />
    </RoundedBox>
    {/* Patas */}
    <Cylinder args={[0.04, 0.04, 0.7]} position={[-0.2, 0.35, -0.2]}><meshStandardMaterial color="#334155" /></Cylinder>
    <Cylinder args={[0.04, 0.04, 0.7]} position={[0.2, 0.35, -0.2]}><meshStandardMaterial color="#334155" /></Cylinder>
    <Cylinder args={[0.04, 0.04, 0.7]} position={[-0.2, 0.35, 0.2]}><meshStandardMaterial color="#334155" /></Cylinder>
    <Cylinder args={[0.04, 0.04, 0.7]} position={[0.2, 0.35, 0.2]}><meshStandardMaterial color="#334155" /></Cylinder>
    {/* Reposapiés */}
    <mesh position={[0, 0.2, 0]} rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[0.2, 0.03, 16, 32]} />
        <meshStandardMaterial color="#334155" />
    </mesh>
  </group>
);

const CashRegister = ({ position, rotation }: any) => (
    <group position={position} rotation={rotation}>
        {/* Base */}
        <Box args={[0.8, 0.3, 0.6]} position={[0, 0.15, 0]} castShadow>
            <meshStandardMaterial color="#475569" />
        </Box>
        {/* Pantalla */}
        <group position={[0, 0.4, 0.1]} rotation={[-0.2, 0, 0]}>
             <Box args={[0.7, 0.5, 0.1]}>
                <meshStandardMaterial color="#334155" />
             </Box>
             <Box args={[0.6, 0.4, 0.01]} position={[0,0,0.05]}>
                 <meshBasicMaterial color="#0ea5e9" /> {/* Pantalla encendida */}
             </Box>
        </group>
    </group>
);

const TeddyBarista = () => {
  const group = useRef<any>(null);
  const eyesRef = useRef<any>(null);
  
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    
    // Respiración
    group.current.position.y = Math.sin(t * 2) * 0.02;
    
    // Eye tracking corregido y limitado
    if (eyesRef.current) {
        const mouseX = state.mouse.x;
        const mouseY = state.mouse.y;
        
        // Mover pupilas suavemente
        eyesRef.current.children[0].position.x = MathUtils.lerp(eyesRef.current.children[0].position.x, -0.2 + (mouseX * 0.1), 0.1);
        eyesRef.current.children[1].position.x = MathUtils.lerp(eyesRef.current.children[1].position.x, 0.2 + (mouseX * 0.1), 0.1);
        
        eyesRef.current.children[0].position.y = MathUtils.lerp(eyesRef.current.children[0].position.y, (mouseY * 0.1), 0.1);
        eyesRef.current.children[1].position.y = MathUtils.lerp(eyesRef.current.children[1].position.y, (mouseY * 0.1), 0.1);
    }
  });

  return (
    <group position={[0, 1.3, -3.5]}> 
      <group ref={group}>
        {/* CABEZA */}
        <group position={[0, 1.2, 0]}>
            <Sphere args={[0.55, 32, 32]} castShadow>{BearFurMaterial}</Sphere>
            
            {/* Orejas */}
            <Sphere args={[0.2]} position={[-0.45, 0.45, 0]}>{BearFurMaterial}</Sphere>
            <Sphere args={[0.2]} position={[0.45, 0.45, 0]}>{BearFurMaterial}</Sphere>

            {/* Hocico (Snout) */}
            <Sphere args={[0.25]} position={[0, -0.15, 0.4]} scale={[1, 0.8, 0.8]}>{BellyMaterial}</Sphere>
            <Sphere args={[0.1]} position={[0, -0.1, 0.62]} scale={[1, 0.8, 0.6]}>{EyeMaterial}</Sphere> {/* Nariz */}

            {/* OJOS (Corregidos: Fuera de la malla de la cabeza) */}
            <group position={[0, 0.1, 0.52]} ref={eyesRef}>
                {/* Ojo Izq */}
                <Sphere args={[0.07]} position={[-0.2, 0, 0]}>{EyeMaterial}</Sphere>
                {/* Ojo Der */}
                <Sphere args={[0.07]} position={[0.2, 0, 0]}>{EyeMaterial}</Sphere>
            </group>
        </group>

        {/* CUERPO */}
        <group position={[0, 0.3, 0]}>
            <Sphere args={[0.65, 32, 32]} scale={[1, 1.1, 0.85]} castShadow>{BearFurMaterial}</Sphere>
            <Sphere args={[0.4]} position={[0, 0, 0.5]} scale={[1, 1, 0.3]}>{BellyMaterial}</Sphere>
            
            {/* Insignia Corazón */}
            <mesh position={[0, 0, 0.62]} scale={[0.2, 0.2, 0.1]}>
                <sphereGeometry args={[1, 16, 16]} />
                <meshStandardMaterial color="#f43f5e" emissive="#f43f5e" emissiveIntensity={0.5} />
            </mesh>
        </group>

        {/* Delantal */}
        <mesh position={[0, 0.2, 0.55]} rotation={[0.1, 0, 0]}>
            <boxGeometry args={[0.6, 0.6, 0.1]} />
            <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
};

export const CoffeeShop = () => {
  return (
    <group>
      {/* --- ESTRUCTURA DEL LOCAL --- */}
      
      {/* Suelo (Baldosas grandes) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.4} />
      </mesh>

      {/* Pared de Fondo con Textura (simulada con color) */}
      <mesh position={[0, 4, -6]} receiveShadow>
          <boxGeometry args={[20, 8, 1]} />
          <meshStandardMaterial color="#334155" />
      </mesh>

      {/* --- BARRA / MOSTRADOR --- */}
      <group position={[0, 0, -2]}>
          {/* Cuerpo Barra */}
          <RoundedBox args={[9, 1.1, 1.5]} position={[0, 0.55, 0]} radius={0.05} castShadow receiveShadow>
            <meshStandardMaterial color="#e2e8f0" />
            {/* Panel Frontal Madera */}
            <mesh position={[0, 0, 0.76]}>
                <planeGeometry args={[8.5, 0.9]} />
                {WoodMaterial}
            </mesh>
          </RoundedBox>
          
          {/* Encimera (Countertop) - Sobresale */}
          <RoundedBox args={[9.2, 0.15, 1.8]} position={[0, 1.15, 0.1]} radius={0.05} castShadow>
             {CounterTopMaterial}
          </RoundedBox>
      </group>

      {/* --- DECORACIÓN Y DETALLES --- */}

      {/* Lámparas Colgantes */}
      <HangingLamp position={[-2.5, 3, -2]} />
      <HangingLamp position={[0, 3, -2]} />
      <HangingLamp position={[2.5, 3, -2]} />

      {/* Taburetes */}
      <Stool position={[-2, 0, 0]} />
      <Stool position={[2, 0, 0]} />

      {/* Equipamiento */}
      <CashRegister position={[-1.5, 1.25, -2]} rotation={[0, 0.3, 0]} />
      
      {/* Máquina de Café (High Detail Proxy) */}
      <group position={[2, 1.35, -2]}>
         {/* Cuerpo */}
         <Box args={[1.4, 1.2, 1]} castShadow>{MetalMaterial}</Box>
         {/* Bandeja superior */}
         <Box args={[1.3, 0.1, 0.9]} position={[0, 0.65, 0]}><meshStandardMaterial color="#1e293b" /></Box>
         {/* Grupo Erogación */}
         <Cylinder args={[0.15, 0.15, 0.3]} position={[-0.3, 0, 0.55]} rotation={[Math.PI/2, 0, 0]}><meshStandardMaterial color="#1e293b" /></Cylinder>
         <Cylinder args={[0.15, 0.15, 0.3]} position={[0.3, 0, 0.55]} rotation={[Math.PI/2, 0, 0]}><meshStandardMaterial color="#1e293b" /></Cylinder>
         {/* Tazas encima */}
         <Cylinder args={[0.1, 0.08, 0.15]} position={[-0.4, 0.75, 0.2]}><meshStandardMaterial color="white" /></Cylinder>
         <Cylinder args={[0.1, 0.08, 0.15]} position={[-0.1, 0.75, 0.3]}><meshStandardMaterial color="white" /></Cylinder>
      </group>

      {/* Pizarra Menú */}
      <group position={[3.5, 3, -5.4]} rotation={[0, -0.2, 0]}>
        <Box args={[2, 2.5, 0.1]}>
            <meshStandardMaterial color="#1e293b" />{/* Marco */}
        </Box>
        <Box args={[1.8, 2.3, 0.12]}>
            <meshStandardMaterial color="#0f172a" />{/* Pizarra negra */}
        </Box>
        <Text position={[0, 0.8, 0.07]} fontSize={0.25} color="white">MENU</Text>
        <Text position={[0, 0.4, 0.07]} fontSize={0.15} color="#cbd5e1">Cappuccino $4</Text>
        <Text position={[0, 0.1, 0.07]} fontSize={0.15} color="#cbd5e1">Latte ...... $5</Text>
        <Text position={[0, -0.2, 0.07]} fontSize={0.15} color="#cbd5e1">Tea ....... $3</Text>
        <Text position={[0, -0.5, 0.07]} fontSize={0.15} color="#cbd5e1">Cookie .... $2</Text>
      </group>

      <TeddyBarista />
    </group>
  );
};