import { create } from 'zustand';

export type Phase = 'login' | 'intro' | 'start' | 'approach' | 'ordering' | 'waiting' | 'success' | 'failure';
export type GameOverReason = 'none' | 'burnout' | 'meltdown' | 'fired' | 'rejected';

interface GameState {
  playerName: string;
  score: number;
  socialBattery: number;
  anxietyLevel: number;
  phase: Phase;
  tutorialActive: boolean;
  currentLevel: number;
  gameOverReason: GameOverReason;
  gameWon: boolean;
  isFocusing: boolean;
  
  // Actions
  setFocus: (active: boolean) => void;
  setPlayerName: (name: string) => void;
  startGame: () => void;
  startInteraction: () => void;
  dismissTutorial: () => void;
  chooseOption: (energyCost: number, anxietyImpact: number) => void;
  nextLevel: () => void;
  tickAnxiety: (amount: number) => void;
  tickSimulation: (delta: number) => void;
  hitObstacle: () => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  playerName: '',
  score: 0,
  socialBattery: 100,
  anxietyLevel: 10,
  phase: 'login', // Nuevo punto de entrada
  tutorialActive: true,
  currentLevel: 1,
  gameOverReason: 'none',
  gameWon: false,
  isFocusing: false,

  setFocus: (active) => set({ isFocusing: active }),

  setPlayerName: (name) => set({ playerName: name, phase: 'intro' }),

  startGame: () => set({ phase: 'start', score: 0 }),

  startInteraction: () => set({ phase: 'approach', tutorialActive: true }),
  
  dismissTutorial: () => set({ tutorialActive: false }),

  tickAnxiety: (amount) => set((state) => {
      if (state.phase !== 'approach') return {}; // Solo afecta en movimiento
      const newAnxiety = Math.min(100, state.anxietyLevel + amount);
      if (newAnxiety >= 100) {
          return { anxietyLevel: 100, phase: 'failure', gameOverReason: 'meltdown' };
      }
      return { anxietyLevel: newAnxiety };
  }),

  chooseOption: (energyCost, anxietyImpact) => {
    const currentBattery = get().socialBattery;
    const currentAnxiety = get().anxietyLevel;

    const newBattery = Math.max(0, currentBattery - energyCost);
    const newAnxiety = Math.max(0, Math.min(100, currentAnxiety + anxietyImpact));

    // Calcular Score del movimiento (Eficiencia: menos ansiedad = mas puntos)
    const moveScore = Math.max(0, 100 - anxietyImpact - (energyCost / 2));
    const currentScore = get().score;

    // Condiciones de Derrota más específicas
    let failReason: GameOverReason = 'none';
    let nextPhase: Phase = 'success';

    if (newBattery <= 0) {
        failReason = 'burnout';
        nextPhase = 'failure';
    } else if (newAnxiety >= 100) {
        failReason = 'meltdown';
        nextPhase = 'failure';
    }

    set({ 
        socialBattery: newBattery, 
        anxietyLevel: newAnxiety, 
        phase: nextPhase, 
        gameOverReason: failReason,
        score: nextPhase === 'success' ? currentScore + moveScore : currentScore
    });
  },

  nextLevel: () => {
      const nextLvl = get().currentLevel + 1;
      const levelBonus = 500;
      
      if (nextLvl > 9) {
          set((state) => ({ gameWon: true, phase: 'success', score: state.score + levelBonus * 2 })); 
      } else {
          set((state) => ({
            currentLevel: nextLvl,
            phase: 'start',
            socialBattery: Math.min(100, state.socialBattery + 40),
            anxietyLevel: Math.max(10, state.anxietyLevel - 20),
            tutorialActive: true,
            score: state.score + levelBonus
          }));
      }
  },

  // tickAnxiety handled above
  
  // MECÁNICA EN TIEMPO REAL (Se llama en cada frame)
  tickSimulation: (delta: number) => set((state) => {
      if (state.phase !== 'approach') return {};

      let batteryDrain = 0;
      let anxietyChange = 0;

      // Si está en FOCUS (Espacio apretado)
      if (state.isFocusing) {
          batteryDrain = 15 * delta; // Gasta mucha batería (15/seg)
          anxietyChange = -10 * delta; // Baja ansiedad rápido
      } else {
          // Ansiedad pasiva por el entorno (si no estás enfocado)
          anxietyChange = 1 * delta; 
      }

      const newBattery = Math.max(0, state.socialBattery - batteryDrain);
      const newAnxiety = Math.max(0, Math.min(100, state.anxietyLevel + anxietyChange));

      if (newBattery <= 0) return { socialBattery: 0, phase: 'failure', gameOverReason: 'burnout' };
      
      return { socialBattery: newBattery, anxietyLevel: newAnxiety };
  }),

  hitObstacle: () => set({ phase: 'failure', gameOverReason: 'meltdown', anxietyLevel: 100 }), // Muerte instantánea por coche/obstáculo

  reset: () => set({ 
      socialBattery: 100, 
      anxietyLevel: 10, 
      phase: 'intro', 
      tutorialActive: true, 
      currentLevel: 1, 
      gameOverReason: 'none',
      gameWon: false,
      score: 0
  })
}));
