import { useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { useGameStore } from '../../store';

export const AudioManager = () => {
  const { anxietyLevel, phase, currentLevel } = useGameStore();
  const isStarted = useRef(false);
  const synthRef = useRef<Tone.PolySynth | null>(null);
  const effectRef = useRef<Tone.Distortion | null>(null);
  const vibratoRef = useRef<Tone.Vibrato | null>(null);
  const crowdVolRef = useRef<Tone.Volume | null>(null);
  const crowdFilterRef = useRef<Tone.AutoFilter | null>(null);
  
  // Estado para controlar la melodía
  const scaleRef = useRef<string[]>([]);

  // Inicializar Audio
  useEffect(() => {
    if (phase === 'intro' && !isStarted.current) {
        // Esperamos a que el usuario de "Comenzar" en el intro
    }
    if ((phase === 'approach' || phase === 'start') && !isStarted.current) {
      startAudio();
      isStarted.current = true;
    }
  }, [phase]);

  // Modificar audio según ansiedad y estado de victoria
  useEffect(() => {
    if (!isStarted.current || !vibratoRef.current || !effectRef.current || !synthRef.current) return;

    // SI EL JUEGO TERMINÓ (Nivel 8 completado) -> MÚSICA FELIZ
    if (currentLevel > 8 || (currentLevel === 8 && phase === 'success')) {
        // Escala Mayor Brillante (C Major)
        scaleRef.current = ["C4", "E4", "G4", "B4", "C5", "E5", "G5"];
        effectRef.current.distortion = 0;
        vibratoRef.current.depth.rampTo(0, 2); // Quitar efecto mareo
        if (crowdVolRef.current) crowdVolRef.current.volume.rampTo(-100, 4); // Callar voces
        synthRef.current.set({ envelope: { attack: 0.01, release: 1 } }); // Sonido más campanita
        return;
    }

    // MODO NORMAL (Tenebroso/Tenso)
    // Escala Menor Armónica (Spooky)
    scaleRef.current = ["A3", "C4", "E4", "F4", "G#4", "A4", "C5"];

    // Mapear ansiedad (0-100) a efectos
    const distortionAmount = anxietyLevel / 200; 
    const vibratoDepth = anxietyLevel / 100;
    
    effectRef.current.distortion = distortionAmount;
    vibratoRef.current.depth.rampTo(vibratoDepth, 1);

    // Murmullo
    if (crowdVolRef.current && crowdFilterRef.current) {
        const targetCrowdVol = -25 + (anxietyLevel / 100) * 20; 
        crowdVolRef.current.volume.rampTo(targetCrowdVol, 2);
        const filterSpeed = 1 + (anxietyLevel / 100) * 5;
        crowdFilterRef.current.frequency.rampTo(filterSpeed, 2);
    }

  }, [anxietyLevel, currentLevel, phase]);

  const startAudio = async () => {
    await Tone.start();

    const reverb = new Tone.Reverb({ decay: 8, wet: 0.4 }).toDestination();
    const delay = new Tone.FeedbackDelay("8n", 0.3).connect(reverb);
    const vibrato = new Tone.Vibrato(4, 0).connect(delay); 
    const distortion = new Tone.Distortion(0).connect(vibrato);
    
    vibratoRef.current = vibrato;
    effectRef.current = distortion;

    // Drone (Bajo)
    const drone = new Tone.Oscillator(55, "sawtooth6").connect(distortion);
    drone.volume.value = -24;
    drone.start();

    // Sinte
    const synth = new Tone.PolySynth(Tone.AMSynth).connect(delay);
    synth.volume.value = -10;
    synthRef.current = synth;

    // Murmullo
    const crowdVol = new Tone.Volume(-30).toDestination();
    crowdVolRef.current = crowdVol;
    const crowdFilter = new Tone.AutoFilter({ frequency: 1, baseFrequency: 200, octaves: 4, type: "sine" }).connect(crowdVol);
    crowdFilter.start();
    crowdFilterRef.current = crowdFilter;
    const crowdNoise = new Tone.Noise("pink").connect(crowdFilter); // Pink noise es más suave para voces
    crowdNoise.start();

    // Loop Melódico
    scaleRef.current = ["A3", "C4", "E4", "F4", "G#4", "A4", "C5"]; // Init scale
    
    new Tone.Loop((time) => {
      if (Math.random() > 0.3) { 
        const scale = scaleRef.current;
        const note = scale[Math.floor(Math.random() * scale.length)];
        const duration = ["8n", "4n"][Math.floor(Math.random() * 2)];
        synth.triggerAttackRelease(note, duration, time);
      }
    }, "4n").start(0);

    Tone.Transport.bpm.value = 70;
    Tone.Transport.start();
  };

  return null;
};
