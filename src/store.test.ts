import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from './store';

describe('Game Logic Store', () => {
  // Resetear el store antes de cada test para tener estado limpio
  beforeEach(() => {
    useGameStore.setState({
      socialBattery: 100,
      anxietyLevel: 10,
      phase: 'start'
    });
  });

  it('should initialize with correct default values', () => {
    const state = useGameStore.getState();
    expect(state.socialBattery).toBe(100);
    expect(state.phase).toBe('start');
  });

  it('should change phase to "approach" when interaction starts', () => {
    useGameStore.getState().startInteraction();
    expect(useGameStore.getState().phase).toBe('approach');
  });

  it('should deduct energy and increase anxiety when choosing an option', () => {
    // Simulamos elegir la opción "High Masking" (-25 energia, -10 ansiedad)
    // Nota: Ansiedad min es 0. Si empezamos en 10 y restamos 10, queda en 0.
    useGameStore.getState().chooseOption(25, -10);
    
    const state = useGameStore.getState();
    expect(state.socialBattery).toBe(75); // 100 - 25
    expect(state.anxietyLevel).toBe(0);   // 10 - 10
    expect(state.phase).toBe('success');
  });

  it('should handle "Unmasked" option correctly (increase anxiety)', () => {
    // Simulamos opción sin mascara (0 energia, +15 ansiedad)
    useGameStore.getState().chooseOption(0, 15);
    
    const state = useGameStore.getState();
    expect(state.socialBattery).toBe(100); // No gasta
    expect(state.anxietyLevel).toBe(25);   // 10 + 15
  });
});
