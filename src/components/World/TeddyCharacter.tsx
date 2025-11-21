import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import { MathUtils } from 'three';

// Materiales compartidos
// const BearFurMaterial = <meshStandardMaterial color="#60a5fa" roughness={1} />; // Unused (defined inside component dynamically)
const BellyMaterial = <meshStandardMaterial color="#ffffff" roughness={1} />;
const EyeMaterial = <meshStandardMaterial color="black" roughness={0} metalness={0.5} />;

export const TeddyCharacter = ({ role = 'barista', position = [0, 0, 0] }: { role?: 'barista' | 'boss' | 'passenger' | 'party', position?: [number, number, number] }) => {
  const group = useRef<any>(null);
  const eyesRef = useRef<any>(null);
  
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    
    // Animación base
    group.current.position.y = position[1] + Math.sin(t * 2) * 0.02;
    
    // Eye tracking
    if (eyesRef.current) {
        const mouseX = state.mouse.x;
        const mouseY = state.mouse.y;
        eyesRef.current.children[0].position.x = MathUtils.lerp(eyesRef.current.children[0].position.x, -0.2 + (mouseX * 0.1), 0.1);
        eyesRef.current.children[1].position.x = MathUtils.lerp(eyesRef.current.children[1].position.x, 0.2 + (mouseX * 0.1), 0.1);
        eyesRef.current.children[0].position.y = MathUtils.lerp(eyesRef.current.children[0].position.y, (mouseY * 0.1), 0.1);
        eyesRef.current.children[1].position.y = MathUtils.lerp(eyesRef.current.children[1].position.y, (mouseY * 0.1), 0.1);
    }
  });

  // Personalización por rol
  const furColor = role === 'boss' ? '#ef4444' : role === 'passenger' ? '#fbbf24' : role === 'party' ? '#a78bfa' : '#60a5fa';

  return (
    <group position={position}> 
      <group ref={group}>
        {/* CABEZA */}
        <group position={[0, 1.2, 0]}>
            <Sphere args={[0.55, 32, 32]} castShadow>
                <meshStandardMaterial color={furColor} roughness={1} />
            </Sphere>
            
            <Sphere args={[0.2]} position={[-0.45, 0.45, 0]}><meshStandardMaterial color={furColor} roughness={1} /></Sphere>
            <Sphere args={[0.2]} position={[0.45, 0.45, 0]}><meshStandardMaterial color={furColor} roughness={1} /></Sphere>

            <Sphere args={[0.25]} position={[0, -0.15, 0.4]} scale={[1, 0.8, 0.8]}>{BellyMaterial}</Sphere>
            <Sphere args={[0.1]} position={[0, -0.1, 0.62]} scale={[1, 0.8, 0.6]}>{EyeMaterial}</Sphere>

            <group position={[0, 0.1, 0.52]} ref={eyesRef}>
                <Sphere args={[0.07]} position={[-0.2, 0, 0]}>{EyeMaterial}</Sphere>
                <Sphere args={[0.07]} position={[0.2, 0, 0]}>{EyeMaterial}</Sphere>
            </group>

            {/* ACCESORIOS POR ROL */}
            {role === 'barista' && (
                 <mesh position={[0, 0.65, 0]}>
                   <cylinderGeometry args={[0.36, 0.36, 0.2, 32]} />
                   <meshStandardMaterial color="#334155" />
                </mesh>
            )}
            {role === 'party' && (
                <mesh position={[0, 0.8, 0]} rotation={[0.2,0,0]}>
                    <coneGeometry args={[0.3, 0.6, 32]} />
                    <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={0.5} />
                </mesh>
            )}
        </group>

        {/* CUERPO */}
        <group position={[0, 0.3, 0]}>
            <Sphere args={[0.65, 32, 32]} scale={[1, 1.1, 0.85]} castShadow>
                <meshStandardMaterial color={furColor} roughness={1} />
            </Sphere>
            <Sphere args={[0.4]} position={[0, 0, 0.5]} scale={[1, 1, 0.3]}>{BellyMaterial}</Sphere>

            {/* Corbata para el Jefe */}
            {role === 'boss' && (
                <mesh position={[0, 0.1, 0.6]} rotation={[Math.PI, 0, 0]} scale={[0.2, 0.6, 0.1]}>
                    <cylinderGeometry args={[0.5, 0, 1, 4]} />
                    <meshStandardMaterial color="#1e293b" />
                </mesh>
            )}
        </group>
      </group>
    </group>
  );
};
