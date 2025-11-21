import { useGameStore } from '../../store';
import { Battery, HeartPulse, ArrowRight, User, Trophy, Timer } from 'lucide-react';
import { sfx } from '../Logic/SfxManager';
import Confetti from 'react-confetti';
import { useState, useEffect } from 'react';

export const MaskingHUD = () => {
  const { socialBattery, anxietyLevel, phase, startInteraction, chooseOption, reset, nextLevel, tutorialActive, currentLevel, gameOverReason, gameWon, startGame, playerName, setPlayerName, score, tickAnxiety } = useGameStore();
  const [nameInput, setNameInput] = useState('');

  useEffect(() => {
      let interval: any;
      if (phase === 'ordering' && (currentLevel === 1 || currentLevel === 6 || currentLevel === 8)) { // Nivel 1 (Trafico) ahora tiene presion
          interval = setInterval(() => {
              tickAnxiety(0.5); 
          }, 1000);
      }
      return () => clearInterval(interval);
  }, [phase, currentLevel]);

  const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      if (nameInput.trim().length > 0) {
          sfx.playClick();
          setPlayerName(nameInput);
      }
  };

  const getBatteryColor = () => socialBattery > 50 ? '#34d399' : socialBattery > 20 ? '#fbbf24' : '#f43f5e';

  // const levelTitles = [...]; // Unused
  // const levelGoals = [...]; // Unused

  const scenarios: any = {
      1: { 
          title: 'Cruce Peatonal', 
          context: "Un coche espera impaciente. Regla: Indecisión = Peligro. (TIEMPO CORRE)", 
          options: [ 
              {text:"(Hacer señas para que pase el coche)", energy:20, anxiety:10, label:"Amable", thought:"Innecesario, tienes prioridad. Confunde al conductor."}, 
              {text:"(Cruzar rápido)", energy:10, anxiety:-5, label:"Decidido", thought:"Lo lógico. Se acaba el problema."}, 
              {text:"(Dudar y parar)", energy:5, anxiety:50, label:"Duda", thought:"El conductor se enfada. Bocinazo seguro."} 
          ] 
      },
      2: {
          title: 'La Oficina del Jefe',
          context: "El jefe odia perder tiempo. Regla: La eficiencia supera a la educación.",
          options: [
              { text: "¡Buenos días! ¿Tiene un minuto?", energy: 30, anxiety: 10, label: "Sumiso", thought: "Odia que le interrumpan con saludos largos." }, 
              { text: "Aquí está el informe.", energy: 15, anxiety: 5, label: "Formal", thought: "Aceptable, pero lento." }, 
              { text: "(Dejar informe y salir)", energy: 0, anxiety: -10, label: "Eficiente", thought: "Perfecto. Él valora el tiempo." } 
          ]
      },
      3: {
          title: 'Autobús Lleno',
          context: "Alguien bloquea la puerta. Regla: El contacto físico es invasivo, la voz es necesaria.",
          options: [
              { text: "Disculpa, bajo aquí.", energy: 20, anxiety: -5, label: "Verbal Claro", thought: "La mejor forma de que se mueva sin conflicto." }, 
              { text: "Permiso.", energy: 10, anxiety: 10, label: "Susurro", thought: "No me oirá. Tendré que repetir." }, 
              { text: "(Empujar)", energy: 0, anxiety: 40, label: "Físico", thought: "Muy agresivo. Todos me mirarán mal." } 
          ]
      },
      4: {
          title: 'Fiesta de Cumpleaños',
          context: "El anfitrión quiere un abrazo. Regla: Rechazar afecto es una ofensa grave aquí.",
          options: [
              { text: "(Abrazar fuerte)", energy: 45, anxiety: -5, label: "Actuar", thought: "Me agota el contacto, pero le hace feliz." }, 
              { text: "(Dar la mano)", energy: 15, anxiety: 20, label: "Distante", thought: "Se sentirá rechazado. Ambiente tenso." }, 
              { text: "(Quedarse quieto)", energy: 5, anxiety: 50, label: "Bloqueo", thought: "Momento incomodísimo." } 
          ]
      },
      5: { 
          title: 'Cena con la Suegra', 
          context: "La comida sabe mal. Regla: La mentira piadosa es obligatoria.", 
          options: [ 
              {text:"¡Está delicioso!", energy:40, anxiety:-5, label:"Mentir", thought:"Tragar y sonreír. La única salida segura."}, 
              {text:"Es comestible.", energy:10, anxiety:30, label:"Sincero", thought:"Se ofenderá muchísimo."}, 
              {text:"No me gusta.", energy:0, anxiety:60, label:"Directo", thought:"Guerra familiar declarada."} 
          ] 
      },
      6: { 
          title: 'Entrevista de Trabajo', 
          context: "Pregunta trampa sobre debilidades. Regla: Falsa modestia.", 
          options: [ 
              {text:"Soy demasiado perfeccionista.", energy:50, anxiety:-5, label:"Cliché", thought:"Es lo que quieren oír."}, 
              {text:"A veces me cuesta concentrarme.", energy:20, anxiety:20, label:"Honesto", thought:"Arriesgado admitir esto."}, 
              {text:"Odio madrugar.", energy:0, anxiety:100, label:"Suicida", thought:"Despedido antes de empezar."} 
          ] 
      },
      7: { 
          title: 'Primera Cita', 
          context: "Silencio incómodo. Regla: Debes proponer tema aunque cueste.", 
          options: [ 
              {text:"¿Y qué te apasiona hacer?", energy:55, anxiety:-5, label:"Interés Activo", thought:"Muestra interés genuino (o simulado)."}, 
              {text:"Qué buen tiempo hace.", energy:15, anxiety:15, label:"Cliché Aburrido", thought:"La cita se muere."}, 
              {text:"...", energy:5, anxiety:40, label:"Silencio", thought:"La otra persona se siente ignorada."} 
          ] 
      },
      8: { 
          title: 'Hablar en Público', 
          context: "Cientos de ojos. Regla: La brevedad reduce el pánico.", 
          options: [ 
              {text:"Discurso largo y emotivo...", energy:80, anxiety:20, label:"Showman", thought:"Demasiado riesgo de tartamudear."}, 
              {text:"Buenas noches. Seré breve...", energy:30, anxiety:0, label:"Conciso", thought:"Entrar, decir el dato, salir. Seguro."}, 
              {text:"(Huir del escenario)", energy:0, anxiety:100, label:"Fuga", thought:"Humillación pública."} 
          ] 
      },
      9: {
          title: 'Cafetería de Barrio',
          context: "El barista espera. Regla: La cortesía estándar es segura.",
          options: [
              { text: "¡Hola! Un café solo, por favor.", energy: 25, anxiety: -5, label: "Muy Amable", thought: "Seguro, pero costoso." }, 
              { text: "Hola. Un café, gracias.", energy: 10, anxiety: 0, label: "Cortés", thought: "La opción equilibrada." }, 
              { text: "Café solo.", energy: 0, anxiety: 15, label: "Seco", thought: "Ahorras energía, pero se siente rudo." } 
          ]
      }
  };

  const currentScenario = scenarios[currentLevel] || scenarios[1];

  return (
    <div className="hud-container">
      {gameWon && <Confetti numberOfPieces={200} recycle={true} />}

      {phase !== 'login' && phase !== 'intro' && (
        <div className="hud-top-panel">
            <div className="stat-card">
                <div className="stat-row">
                    <span style={{display:'flex', alignItems:'center', gap:'8px'}}><Battery size={18}/> Energía</span>
                </div>
                <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${socialBattery}%`, backgroundColor: getBatteryColor() }}/>
                </div>
            </div>

            <div className="stat-card" style={{background:'rgba(15,23,42,0.6)'}}>
                <div style={{textAlign:'center', fontSize:'0.7rem', color:'#94a3b8', display:'flex', justifyContent:'center', gap:'5px'}}>
                    <Trophy size={12}/> SCORE: {score}
                </div>
                <div style={{textAlign:'center', fontSize:'0.8rem', color:'#94a3b8'}}>ESCENARIO {currentLevel}</div>
                <div style={{textAlign:'center', fontWeight:'bold', color:'white'}}>{currentScenario.title}</div>
            </div>

            <div className="stat-card">
                <div className="stat-row">
                    <span style={{display:'flex', alignItems:'center', gap:'8px'}}><HeartPulse size={18}/> Ansiedad</span>
                </div>
                <div style={{display:'flex', gap:'4px', height:'12px', alignItems:'flex-end'}}>
                    {[...Array(10)].map((_, i) => (
                        <div key={i} style={{flex: 1, backgroundColor: i < anxietyLevel / 10 ? '#f43f5e' : '#334155', height: i < anxietyLevel / 10 ? '100%' : '50%', borderRadius: '2px', transition: 'all 0.3s'}}/>
                    ))}
                </div>
            </div>
        </div>
      )}

      <div className="hud-center-panel">
        {phase === 'login' && (
            <div className="info-card" style={{maxWidth:'500px'}}>
                <h1 style={{fontSize:'3rem', fontWeight:'900', color:'white', textAlign:'center'}}>MASKING</h1>
                <p style={{color:'#94a3b8', textAlign:'center', marginBottom:'2rem'}}>Simulador Social de Supervivencia</p>
                <form onSubmit={handleLogin} style={{display:'flex', flexDirection:'column', gap:'1.5rem'}}>
                    <div style={{position:'relative'}}>
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input type="text" value={nameInput} onChange={(e) => setNameInput(e.target.value)} placeholder="Tu Nombre" className="w-full bg-slate-800 border-2 border-slate-600 rounded-xl py-4 pl-12 pr-4 text-white text-lg focus:border-emerald-400 outline-none" autoFocus />
                    </div>
                    <button type="submit" disabled={!nameInput.trim()} className="start-btn">Entrar</button>
                </form>
            </div>
        )}
        
        {phase === 'intro' && (
          <div className="info-card" style={{maxWidth:'800px'}}>
              <h1 style={{fontSize:'2.5rem', color:'white', marginBottom:'1rem'}}>HOLA, {playerName.toUpperCase()}</h1>
              <p style={{color:'#cbd5e1', marginBottom:'2rem'}}>
                  Vas a enfrentarte a 9 situaciones sociales.<br/>
                  <strong>No siempre ser "educado" es lo mejor.</strong><br/>
                  Lee el contexto. A veces el jefe quiere eficiencia. A veces tu suegra quiere mentiras.<br/>
                  <span style={{color:'#f43f5e'}}>¡Cuidado!</span> Si tardas en decidir en situaciones tensas, tu ansiedad subirá.
              </p>
              <button onClick={() => { sfx.playClick(); startGame(); }} className="start-btn">Comenzar</button>
          </div>
        )}

        {phase === 'start' && (
          <button onClick={() => { sfx.playClick(); startInteraction(); }} className="start-btn">
            <div style={{display:'flex', alignItems:'center', gap:'1rem'}}><ArrowRight size={32} /><span>Entrar al Escenario</span></div>
          </button>
        )}

        {phase === 'approach' && tutorialActive && currentLevel === 1 && (
            <div className="info-card">
                <div className="key-container"><div className="key-cap">W</div><div className="key-cap">A</div><div className="key-cap">S</div><div className="key-cap">D</div></div>
                <p style={{color:'#cbd5e1'}}>Acércate. Si miras fijamente mucho tiempo, te pondrás nervioso.</p>
            </div>
        )}

        {phase === 'ordering' && (
          <div className="info-card" style={{maxWidth:'900px', textAlign:'left', padding:'3rem'}}>
            {(currentLevel === 1 || currentLevel === 6 || currentLevel === 8 || currentLevel === 9) && (
                <div style={{position:'absolute', top:'20px', right:'20px', color:'#f43f5e', display:'flex', gap:'5px', animation:'pulse 1s infinite'}}>
                    <Timer /> PRESIÓN DE TIEMPO
                </div>
            )}
            <div style={{marginBottom:'2rem', borderBottom:'1px solid #334155', paddingBottom:'1rem'}}>
                <div style={{textTransform:'uppercase', color:'#94a3b8', fontSize:'0.8rem', fontWeight:'bold'}}>Contexto</div>
                <p style={{fontSize:'1.3rem', color:'white', lineHeight:'1.5'}}>{currentScenario.context}</p>
            </div>
            <div className="dialogue-options">
              {currentScenario.options.map((opt: any, idx: number) => (
                  <button key={idx} onClick={() => { sfx.playClick(); chooseOption(opt.energy, opt.anxiety); }} className="dialogue-btn group">
                    <div className="dialogue-header"><span>"{opt.text}"</span></div>
                    <div style={{display:'flex', justifyContent:'space-between', marginTop:'0.5rem'}}>
                        <span style={{fontSize:'0.8rem', fontWeight:'bold', color:'#94a3b8', textTransform:'uppercase'}}>{opt.label}</span>
                    </div>
                    <div style={{fontSize:'0.9rem', color:'#cbd5e1', fontStyle:'italic', marginTop:'0.5rem', borderLeft:'2px solid #475569', paddingLeft:'10px'}}>{opt.thought}</div>
                  </button>
              ))}
            </div>
          </div>
        )}

        {phase === 'success' && !gameWon && (
           <div className="info-card">
             <h2 style={{fontSize:'2rem', color:'#34d399', marginBottom:'1rem'}}>Nivel Superado</h2>
             <p style={{color:'#cbd5e1', marginBottom:'2rem'}}>Recuperando Energía...</p>
             <button onClick={() => { sfx.playClick(); nextLevel(); }} className="start-btn">Continuar</button>
           </div>
        )}

        {gameWon && (
            <div className="info-card" style={{background:'#0f172a', border:'2px solid #34d399'}}>
                <h1 style={{fontSize:'3rem', color:'#34d399'}}>¡JUEGO COMPLETADO!</h1>
                <p style={{color:'white', margin:'2rem 0'}}>Score Final: {score}</p>
                <button onClick={() => { sfx.playClick(); reset(); }} className="start-btn">Jugar de Nuevo</button>
            </div>
        )}

        {phase === 'failure' && (
            <div className="info-card" style={{borderColor:'#f43f5e'}}>
                <h2 style={{fontSize:'2.5rem', color:'#f43f5e'}}>GAME OVER</h2>
                <p style={{color:'white', margin:'1rem 0'}}>
                    {gameOverReason === 'burnout' ? 'Agotamiento Total.' : 'Colapso por Ansiedad.'}
                </p>
                <button onClick={() => { sfx.playClick(); reset(); }} className="start-btn" style={{background:'#ef4444'}}>Reintentar</button>
            </div>
        )}
      </div>
    </div>
  );
};