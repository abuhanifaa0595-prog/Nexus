import React, { useState, useEffect, useRef } from 'react';
import { useOS } from '../../context/OSContext';
import { 
  Crosshair, 
  Users, 
  Trophy, 
  Settings, 
  Map as MapIcon, 
  Shield, 
  Zap, 
  Target, 
  Menu,
  Mic,
  MicOff,
  Speaker,
  Volume2,
  Plus
} from 'lucide-react';

// --- Game Engine Constants ---
const MAP_SIZE = 3000;
const VIEWPORT_WIDTH = window.innerWidth;
const VIEWPORT_HEIGHT = window.innerHeight;
const PLAYER_SPEED = 5;
const ENEMY_SPEED = 2.5;
const BULLET_SPEED = 15;
const FIRE_RATE = 100; // ms

interface Entity {
  id: number;
  x: number;
  y: number;
  radius: number;
  angle: number;
}

interface Player extends Entity {
  hp: number;
  maxHp: number;
  ep: number;
  ammo: number;
  maxAmmo: number;
  isReloading: boolean;
  isMoving: boolean;
}

interface Enemy extends Entity {
  hp: number;
  maxHp: number;
  state: 'idle' | 'chase' | 'attack';
}

interface Bullet extends Entity {
  vx: number;
  vy: number;
  owner: 'player' | 'enemy';
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

const BattleRoyaleApp: React.FC = () => {
  const { user } = useOS();
  
  // App State
  const [gameState, setGameState] = useState<'lobby' | 'loading' | 'playing' | 'booyah' | 'dead'>('lobby');
  const [kills, setKills] = useState(0);
  const [alive, setAlive] = useState(50);
  
  // Refs for Game Loop
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const lastFireTime = useRef<number>(0);
  
  // Game Objects
  const player = useRef<Player>({
    id: 0, x: MAP_SIZE/2, y: MAP_SIZE/2, radius: 20, angle: 0,
    hp: 200, maxHp: 200, ep: 0, ammo: 30, maxAmmo: 30, isReloading: false, isMoving: false
  });
  const enemies = useRef<Enemy[]>([]);
  const bullets = useRef<Bullet[]>([]);
  const particles = useRef<Particle[]>([]);
  const camera = useRef({ x: 0, y: 0 });

  // Input State
  const joystick = useRef({ active: false, originX: 0, originY: 0, dx: 0, dy: 0 });
  const isFiring = useRef(false);
  const keys = useRef<Record<string, boolean>>({});

  // Assets (Colors & Styles)
  const COLORS = {
    grass: '#2d5a27',
    ground: '#3a6b32',
    zone: 'rgba(59, 130, 246, 0.2)',
    ui_bg: 'rgba(0,0,0,0.6)',
    accent: '#fbbf24' // Yellow/Gold
  };

  // --- Engine Helpers ---
  const spawnEnemy = () => {
    // Spawn randomly around player but outside view
    const angle = Math.random() * Math.PI * 2;
    const dist = 600 + Math.random() * 400;
    const ex = player.current.x + Math.cos(angle) * dist;
    const ey = player.current.y + Math.sin(angle) * dist;
    
    // Clamp to map
    const x = Math.max(50, Math.min(MAP_SIZE - 50, ex));
    const y = Math.max(50, Math.min(MAP_SIZE - 50, ey));

    enemies.current.push({
      id: Date.now() + Math.random(),
      x, y, radius: 20, angle: 0, hp: 100, maxHp: 100, state: 'chase'
    });
  };

  const createParticles = (x: number, y: number, color: string, count: number) => {
    for (let i = 0; i < count; i++) {
      particles.current.push({
        id: Math.random(),
        x, y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 1.0,
        color
      });
    }
  };

  // --- Main Loop ---
  const update = (dt: number) => {
    // 1. Player Movement
    let dx = 0;
    let dy = 0;

    // Keyboard
    if (keys.current['w']) dy = -1;
    if (keys.current['s']) dy = 1;
    if (keys.current['a']) dx = -1;
    if (keys.current['d']) dx = 1;

    // Joystick Override
    if (joystick.current.active) {
      dx = joystick.current.dx;
      dy = joystick.current.dy;
    }

    // Normalize
    const len = Math.sqrt(dx*dx + dy*dy);
    if (len > 0) {
      dx /= len;
      dy /= len;
      player.current.isMoving = true;
      player.current.angle = Math.atan2(dy, dx);
    } else {
      player.current.isMoving = false;
    }

    player.current.x += dx * PLAYER_SPEED;
    player.current.y += dy * PLAYER_SPEED;
    
    // Map Boundaries
    player.current.x = Math.max(20, Math.min(MAP_SIZE - 20, player.current.x));
    player.current.y = Math.max(20, Math.min(MAP_SIZE - 20, player.current.y));

    // 2. Camera Follow (Smooth Lerp)
    // Target camera position is centered on player
    const targetCamX = player.current.x - canvasRef.current!.width / 2;
    const targetCamY = player.current.y - canvasRef.current!.height / 2;
    
    // Lerp factor
    camera.current.x += (targetCamX - camera.current.x) * 0.1;
    camera.current.y += (targetCamY - camera.current.y) * 0.1;

    // 3. Firing
    if (isFiring.current && Date.now() - lastFireTime.current > FIRE_RATE) {
      if (player.current.ammo > 0) {
        bullets.current.push({
          id: Date.now(),
          x: player.current.x + Math.cos(player.current.angle) * 30,
          y: player.current.y + Math.sin(player.current.angle) * 30,
          vx: Math.cos(player.current.angle) * BULLET_SPEED,
          vy: Math.sin(player.current.angle) * BULLET_SPEED,
          radius: 3,
          angle: player.current.angle,
          owner: 'player'
        });
        player.current.ammo--;
        lastFireTime.current = Date.now();
        // Recoil effect could be added here
      } else {
        // Reload logic
        if (!player.current.isReloading) {
          player.current.isReloading = true;
          setTimeout(() => {
            player.current.ammo = player.current.maxAmmo;
            player.current.isReloading = false;
          }, 1500);
        }
      }
    }

    // 4. Bullets Update
    bullets.current.forEach(b => {
      b.x += b.vx;
      b.y += b.vy;
    });
    // Remove bullets out of range/bounds (optimization)
    bullets.current = bullets.current.filter(b => 
      b.x > 0 && b.x < MAP_SIZE && b.y > 0 && b.y < MAP_SIZE
    );

    // 5. Enemies AI
    if (enemies.current.length < 5) spawnEnemy();

    enemies.current.forEach(e => {
      const distToPlayer = Math.hypot(player.current.x - e.x, player.current.y - e.y);
      
      if (distToPlayer < 800) {
        // Chase
        const angle = Math.atan2(player.current.y - e.y, player.current.x - e.x);
        e.angle = angle;
        e.x += Math.cos(angle) * ENEMY_SPEED;
        e.y += Math.sin(angle) * ENEMY_SPEED;
      }
      
      // Collision with player
      if (distToPlayer < player.current.radius + e.radius) {
        player.current.hp -= 0.5;
      }
    });

    // 6. Collisions
    bullets.current = bullets.current.filter(b => {
      if (b.owner === 'player') {
        let hit = false;
        enemies.current.forEach(e => {
          if (hit) return;
          const dist = Math.hypot(b.x - e.x, b.y - e.y);
          if (dist < e.radius + b.radius) {
            hit = true;
            e.hp -= 25; // Damage
            createParticles(e.x, e.y, '#ef4444', 5);
          }
        });
        return !hit;
      }
      return true;
    });

    // Remove Dead Enemies
    enemies.current = enemies.current.filter(e => {
      if (e.hp <= 0) {
        setKills(k => k + 1);
        setAlive(a => Math.max(1, a - 1));
        createParticles(e.x, e.y, '#ef4444', 10);
        return false;
      }
      return true;
    });

    // 7. Particles
    particles.current.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.05;
    });
    particles.current = particles.current.filter(p => p.life > 0);

    // 8. Game Over Check
    if (player.current.hp <= 0) {
      setGameState('dead');
    }
    if (alive === 1 && enemies.current.length === 0) {
       setGameState('booyah');
    }
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    // Clear Screen
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.save();
    // Apply Camera Transform
    ctx.translate(-camera.current.x, -camera.current.y);

    // Draw Map Background (Grid + Grass)
    // Optimization: Only draw visible area? For now draw big rect
    ctx.fillStyle = COLORS.grass;
    ctx.fillRect(0, 0, MAP_SIZE, MAP_SIZE);

    // Draw Grid Lines
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 2;
    for (let x = 0; x <= MAP_SIZE; x += 100) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, MAP_SIZE); ctx.stroke();
    }
    for (let y = 0; y <= MAP_SIZE; y += 100) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(MAP_SIZE, y); ctx.stroke();
    }

    // Draw Zone Circle (Safe Zone)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(MAP_SIZE/2, MAP_SIZE/2, 1000, 0, Math.PI * 2);
    ctx.stroke();
    // Danger Zone
    ctx.fillStyle = COLORS.zone;
    ctx.fill();

    // Draw Dead Bodies / Loot (Simple X)
    
    // Draw Particles
    particles.current.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    // Draw Enemies
    enemies.current.forEach(e => {
      // Body
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
      ctx.fill();
      // HP Bar
      ctx.fillStyle = 'red';
      ctx.fillRect(e.x - 15, e.y - 30, 30, 4);
      ctx.fillStyle = 'green';
      ctx.fillRect(e.x - 15, e.y - 30, 30 * (e.hp / e.maxHp), 4);
    });

    // Draw Bullets
    bullets.current.forEach(b => {
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fill();
      // Trail
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(b.x, b.y);
      ctx.lineTo(b.x - b.vx * 2, b.y - b.vy * 2);
      ctx.stroke();
    });

    // Draw Player
    const p = player.current;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    
    // Character (Simplified Top Down)
    // Shoulders
    ctx.fillStyle = '#1e293b'; // Dark blue vest
    ctx.beginPath();
    ctx.ellipse(0, 0, 15, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    // Head
    ctx.fillStyle = '#fca5a5'; // Skin
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fill();
    // Helmet
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(0, 0, 11, Math.PI, 0); // Half circle helmet
    ctx.fill();
    // Gun
    ctx.fillStyle = '#000';
    ctx.fillRect(5, 5, 20, 4);

    ctx.restore();

    ctx.restore();
  };

  const gameLoop = (time: number) => {
    const dt = time - lastTimeRef.current;
    lastTimeRef.current = time;

    if (gameState === 'playing') {
      update(dt);
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) draw(ctx);
      }
      requestRef.current = requestAnimationFrame(gameLoop);
    }
  };

  useEffect(() => {
    if (gameState === 'playing') {
      lastTimeRef.current = performance.now();
      requestRef.current = requestAnimationFrame(gameLoop);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameState]);

  // --- UI Components ---
  
  const LobbyScreen = () => (
    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2000&auto=format&fit=crop)' }}>
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40"></div>
      
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-10">
         <div className="flex gap-4">
            <div className="flex flex-col gap-2">
                <div className="bg-[#1f1f1f]/90 backdrop-blur border border-[#ffd700]/30 rounded-r-full pl-4 pr-6 py-2 flex items-center gap-3 shadow-lg">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 border-2 border-white flex items-center justify-center shadow-inner">
                         <img src={user.avatar} className="w-full h-full object-cover rounded-md" />
                    </div>
                    <div>
                        <div className="text-white font-bold text-lg drop-shadow-md">{user.username}</div>
                        <div className="text-[#ffd700] text-xs font-bold flex items-center gap-1">
                            LV. 65 <span className="bg-[#ffd700] text-black px-1 rounded text-[10px]">MAX</span>
                        </div>
                    </div>
                </div>
                
                {/* Guild / Clan */}
                <div className="bg-black/40 backdrop-blur rounded-r-full pl-4 pr-6 py-1 flex items-center gap-2 w-fit">
                    <Shield size={14} className="text-blue-400" />
                    <span className="text-xs text-white font-bold">NEXUS_CLAN</span>
                </div>
            </div>
         </div>

         <div className="flex gap-4">
             <div className="bg-black/60 backdrop-blur rounded-lg p-2 flex items-center gap-4 border-t border-[#ffd700]">
                 <div className="flex items-center gap-1">
                    <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center border border-white text-[10px] text-black font-bold">$</div>
                    <span className="text-white font-bold">24,500</span>
                 </div>
                 <div className="flex items-center gap-1">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center border border-white text-[10px] text-black font-bold">💎</div>
                    <span className="text-white font-bold">1,200</span>
                 </div>
             </div>
             <button className="bg-gray-800/80 p-2 rounded-lg text-white hover:bg-gray-700"><Settings /></button>
         </div>
      </div>

      {/* Right Side Menu */}
      <div className="absolute right-4 top-1/4 flex flex-col gap-4 z-10">
          {[
              { label: 'STORE', icon: '🛒', color: 'bg-orange-500' },
              { label: 'LUCK ROYALE', icon: '🎰', color: 'bg-purple-600' },
              { label: 'VAULT', icon: '🎒', color: 'bg-blue-600' },
              { label: 'WEAPONS', icon: '🔫', color: 'bg-red-600' },
              { label: 'PET', icon: '🐾', color: 'bg-green-600' },
          ].map(item => (
              <button key={item.label} className="group flex items-center justify-end gap-2">
                  <span className="text-white font-bold text-sm bg-black/50 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">{item.label}</span>
                  <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center text-2xl border-2 border-white/20 shadow-lg group-hover:scale-110 transition-transform`}>
                      {item.icon}
                  </div>
              </button>
          ))}
      </div>

      {/* Character Model (Static Image for Simulation) */}
      <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
           <img 
             src="https://pngimg.com/d/pubg_PNG47.png" 
             alt="Character"
             className="h-[85%] object-contain drop-shadow-2xl" 
           />
      </div>

      {/* Bottom Bar / Start */}
      <div className="absolute bottom-8 right-8 flex items-end gap-4 z-10">
          <div className="bg-black/60 backdrop-blur p-2 rounded-lg flex flex-col items-center cursor-pointer border border-white/10 hover:border-[#ffd700]">
              <span className="text-[#ffd700] font-bold text-xs tracking-widest">RANKED</span>
              <span className="text-white font-black text-xl italic">BATTLE ROYALE</span>
              <div className="flex items-center gap-1 text-xs text-gray-300">
                   <Users size={12} /> SQUAD - BERMUDA
              </div>
          </div>
          
          <button 
             onClick={() => setGameState('playing')}
             className="bg-gradient-to-r from-yellow-400 to-yellow-600 px-12 py-4 rounded-full border-4 border-yellow-200 shadow-[0_0_20px_rgba(234,179,8,0.6)] animate-pulse hover:scale-105 transition-transform"
          >
              <span className="text-black font-black text-3xl italic tracking-tighter">START</span>
          </button>
      </div>

      {/* Left Bottom Invite */}
      <div className="absolute bottom-8 left-8 w-64 bg-black/40 backdrop-blur rounded-lg border border-white/10 overflow-hidden">
           <div className="bg-black/60 p-2 text-xs text-gray-400 font-bold flex justify-between">
               <span>TEAM</span>
               <span className="text-green-400">OPEN</span>
           </div>
           <div className="p-2 space-y-2">
               <div className="flex items-center gap-2">
                   <div className="w-8 h-8 bg-gray-700 rounded border border-white/20"></div>
                   <div className="w-24 h-2 bg-gray-700 rounded"></div>
                   <Plus size={16} className="text-gray-500 ml-auto" />
               </div>
               <div className="flex items-center gap-2">
                   <div className="w-8 h-8 bg-gray-700 rounded border border-white/20"></div>
                   <div className="w-24 h-2 bg-gray-700 rounded"></div>
                   <Plus size={16} className="text-gray-500 ml-auto" />
               </div>
           </div>
      </div>
    </div>
  );

  const GameplayHUD = () => (
    <div className="absolute inset-0 pointer-events-none select-none">
       {/* Minimap (Top Left) */}
       <div className="absolute top-4 left-4 w-32 h-32 rounded-full border-2 border-white/50 bg-black/50 overflow-hidden shadow-lg backdrop-blur-sm">
           <div className="absolute inset-0 bg-green-900/50 flex items-center justify-center opacity-50">
               <MapIcon className="text-white/20" size={48} />
           </div>
           {/* Fake Player Dot */}
           <div className="absolute top-1/2 left-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-yellow-400 -translate-x-1/2 -translate-y-1/2"></div>
           <div className="absolute top-2 right-8 text-[8px] text-white font-mono">BERMUDA</div>
       </div>

       {/* Top Bar (Alive/Kill) */}
       <div className="absolute top-4 right-4 flex gap-2">
           <div className="bg-black/60 backdrop-blur px-4 py-1 rounded border-l-4 border-yellow-500 flex flex-col items-center">
               <span className="text-[10px] text-gray-300 font-bold">ALIVE</span>
               <span className="text-xl font-bold text-white leading-none">{alive}</span>
           </div>
           <div className="bg-black/60 backdrop-blur px-4 py-1 rounded border-l-4 border-red-500 flex flex-col items-center">
               <span className="text-[10px] text-gray-300 font-bold">KILLS</span>
               <span className="text-xl font-bold text-white leading-none">{kills}</span>
           </div>
           <div className="bg-black/60 backdrop-blur p-2 rounded">
               <Settings size={20} className="text-white" />
           </div>
       </div>

       {/* Squad List (Left) */}
       <div className="absolute top-40 left-4 flex flex-col gap-2">
           <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-full bg-green-500 border border-white flex items-center justify-center text-xs font-bold text-white">1</div>
               <div className="text-xs text-white shadow-black drop-shadow-md font-bold">{user.username}</div>
           </div>
           {/* Teammates would go here */}
       </div>

       {/* Loot Area (Center Rightish) */}
       <div className="absolute top-1/2 right-32 -translate-y-1/2 flex flex-col gap-2 bg-black/20 p-2 rounded backdrop-blur-[2px]">
           <div className="text-xs text-white font-bold bg-black/40 px-1 rounded">AK47 Ammo x30</div>
           <div className="text-xs text-white font-bold bg-black/40 px-1 rounded">Medkit x1</div>
       </div>

       {/* Controls Layer (Pointer Events Auto) */}
       <div className="absolute inset-0 pointer-events-auto">
           {/* Joystick Zone (Left Half) */}
           <div 
             className="absolute bottom-0 left-0 w-1/2 h-1/2"
             onTouchStart={(e) => {
               const touch = e.touches[0];
               joystick.current = { 
                   active: true, 
                   originX: touch.clientX, 
                   originY: touch.clientY, 
                   dx: 0, dy: 0 
               };
             }}
             onTouchMove={(e) => {
               if (joystick.current.active) {
                   const touch = e.touches[0];
                   const dx = touch.clientX - joystick.current.originX;
                   const dy = touch.clientY - joystick.current.originY;
                   joystick.current.dx = dx;
                   joystick.current.dy = dy;
               }
             }}
             onTouchEnd={() => {
                 joystick.current.active = false;
                 joystick.current.dx = 0;
                 joystick.current.dy = 0;
             }}
           >
               {/* Visual Joystick */}
               {joystick.current.active && (
                   <div 
                     className="absolute w-24 h-24 rounded-full border-2 border-white/30 bg-white/10 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                     style={{ left: joystick.current.originX, top: joystick.current.originY }}
                   >
                       <div 
                         className="absolute w-10 h-10 rounded-full bg-[#ffd700]/80 shadow-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                         style={{ 
                             transform: `translate(${Math.max(-40, Math.min(40, joystick.current.dx))}px, ${Math.max(-40, Math.min(40, joystick.current.dy))}px)` 
                         }}
                       ></div>
                   </div>
               )}
           </div>

           {/* Fire Button (Right) */}
           <div 
             className="absolute bottom-24 right-16 w-20 h-20 rounded-full bg-transparent border-4 border-white/50 flex items-center justify-center active:scale-95 transition-transform"
             onTouchStart={(e) => { e.preventDefault(); isFiring.current = true; }}
             onTouchEnd={(e) => { e.preventDefault(); isFiring.current = false; }}
             onMouseDown={() => isFiring.current = true}
             onMouseUp={() => isFiring.current = false}
             onClick={(e) => e.stopPropagation()}
           >
               <div className="w-16 h-16 rounded-full bg-[url('https://cdn-icons-png.flaticon.com/512/566/566069.png')] bg-cover bg-center opacity-80 animate-pulse"></div>
           </div>

           {/* Actions Grid (Jump, Crouch, Scope) */}
           <div className="absolute bottom-12 right-44 flex gap-4">
               <button className="w-12 h-12 bg-black/40 rounded-full border border-white/30 flex items-center justify-center active:bg-white/20">
                   <Target size={20} className="text-white" />
               </button>
               <button className="w-12 h-12 bg-black/40 rounded-full border border-white/30 flex items-center justify-center active:bg-white/20">
                   <span className="text-white font-bold text-xs">JUMP</span>
               </button>
           </div>
           
           <div className="absolute bottom-4 right-16 flex gap-4">
               <button className="w-12 h-12 bg-black/40 rounded-full border border-white/30 flex items-center justify-center active:bg-white/20">
                    <span className="text-white font-bold text-xs">SIT</span>
               </button>
           </div>
           
           {/* Reload / Weapon Box (Top Right) */}
           <div className="absolute top-16 right-4 w-48 h-20 bg-black/50 border border-[#ffd700]/50 rounded flex items-center px-2 gap-2">
               <div className="flex-1">
                   <div className="text-xs text-[#ffd700] font-bold">SCAR</div>
                   <div className="flex items-end gap-1">
                       <span className="text-2xl font-bold text-white">{player.current.ammo}</span>
                       <span className="text-sm text-gray-400 font-bold">/ {player.current.maxAmmo}</span>
                   </div>
               </div>
               <div className="w-20 h-12 bg-gray-800 rounded border border-white/10 flex items-center justify-center">
                    {/* Gun Image Placeholder */}
                    <div className="w-16 h-6 bg-gray-600 rounded-sm"></div>
               </div>
               <button 
                className="absolute -bottom-8 right-0 bg-black/40 p-2 rounded-full border border-white/20"
                onClick={() => { player.current.ammo = 30; }}
               >
                   <span className="text-[10px] text-white font-bold">RELOAD</span>
               </button>
           </div>

           {/* Health Bar (Bottom Center) */}
           <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-80 flex flex-col gap-1">
               <div className="flex justify-between items-end px-1">
                   <div className="flex items-center gap-1">
                       <Shield size={12} className="text-white" />
                       <span className="text-xs font-bold text-white">HP</span>
                   </div>
                   <span className="text-xs font-bold text-white">{player.current.hp} / 200</span>
               </div>
               <div className="w-full h-4 bg-black/60 rounded-sm border border-white/20 overflow-hidden relative">
                   <div className="h-full bg-white w-full opacity-10 absolute"></div>
                   <div 
                     className="h-full bg-gradient-to-r from-white to-white transition-all duration-200"
                     style={{ width: `${(player.current.hp / 200) * 100}%` }}
                   ></div>
               </div>
               <div className="w-full h-1.5 bg-black/60 rounded-sm overflow-hidden flex items-center">
                    <div className="w-full bg-yellow-500 h-full" style={{ width: `${player.current.ep}%` }}></div>
               </div>
               <div className="absolute -left-12 bottom-0 w-10 h-10 bg-black/60 rounded-full border border-white/20 flex items-center justify-center">
                   <span className="text-xs font-bold text-white">MED</span>
               </div>
               <div className="absolute -right-12 bottom-0 w-10 h-10 bg-black/60 rounded-full border border-white/20 flex items-center justify-center">
                   <Zap size={16} className="text-[#ffd700]" />
               </div>
           </div>
           
           {/* Gloo Wall Button (Left of Health) */}
           <button className="absolute bottom-20 left-1/2 -translate-x-32 w-14 h-14 rounded-full bg-cyan-500/80 border-2 border-white flex items-center justify-center shadow-lg active:scale-95">
                <Shield size={24} className="text-white" />
           </button>
       </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-black text-white overflow-hidden select-none">
      {gameState === 'lobby' && <LobbyScreen />}
      
      {gameState === 'playing' && (
        <div className="relative w-full h-full">
            <canvas 
                ref={canvasRef}
                width={VIEWPORT_WIDTH}
                height={VIEWPORT_HEIGHT}
                className="block touch-none"
            />
            <GameplayHUD />
        </div>
      )}

      {gameState === 'booyah' && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur">
              <h1 className="text-8xl font-black text-yellow-500 italic drop-shadow-[0_10px_20px_rgba(234,179,8,0.5)] animate-bounce">BOOYAH!</h1>
              <div className="mt-8 bg-gray-900 p-8 rounded-xl border border-yellow-500/30 text-center">
                  <h2 className="text-2xl font-bold text-white mb-4">VICTORY</h2>
                  <div className="grid grid-cols-2 gap-8 text-left">
                      <div>
                          <p className="text-gray-400 text-sm">KILLS</p>
                          <p className="text-2xl font-bold text-white">{kills}</p>
                      </div>
                      <div>
                          <p className="text-gray-400 text-sm">DAMAGE</p>
                          <p className="text-2xl font-bold text-white">{kills * 245}</p>
                      </div>
                  </div>
                  <button 
                    onClick={() => setGameState('lobby')}
                    className="mt-8 w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400"
                  >
                      RETURN TO LOBBY
                  </button>
              </div>
          </div>
      )}

      {gameState === 'dead' && (
           <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-red-900/40 backdrop-blur">
                <h1 className="text-6xl font-black text-red-500 italic">ELIMINATED</h1>
                <div className="mt-8 flex gap-4">
                    <button onClick={() => setGameState('lobby')} className="bg-white text-black px-6 py-2 rounded font-bold">LOBBY</button>
                    <button className="bg-transparent border border-white text-white px-6 py-2 rounded font-bold">SPECTATE</button>
                </div>
           </div>
      )}
    </div>
  );
};

export default BattleRoyaleApp;