<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

// 게임 상태
const gameStarted = ref(false);
const gameOver = ref(false);
const score = ref(0);
const gameTime = ref(0);
const difficultyLevel = ref(1);

// 플레이어 상태
const playerX = ref(300);
const playerY = ref(300);
const playerRadius = ref(10); // 플레이어 크기 2배 감소
const playerSpeed = ref(5);
const isPoweredUp = ref(false);
const powerUpTimeLeft = ref(0);

// 적 상태
const enemies = ref([]);
const enemyRadius = ref(15);
const enemySpeed = ref(1.5);
const minSpawnDistance = ref(150);
const enemySpawnCount = ref(1);

// 아이템 상태
const items = ref([]);
const itemRadius = ref(10);
const itemSpawnCount = ref(1);

// 효과 상태
const effects = ref([]);

// 키 상태
const keysPressed = ref({
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false
});

// 게임 시작
const startGame = () => {
  gameStarted.value = true;
  gameOver.value = false;
  score.value = 0;
  gameTime.value = 0;
  difficultyLevel.value = 1;
  playerX.value = window.innerWidth / 2;
  playerY.value = window.innerHeight / 2;
  enemies.value = [];
  items.value = [];
  effects.value = [];
  isPoweredUp.value = false;
  powerUpTimeLeft.value = 0;
  enemySpawnCount.value = 1;
  itemSpawnCount.value = 1;
  
  // 적과 아이템 생성 시작
  spawnEnemies();
  spawnItems();
  
  // 게임 루프 시작
  gameLoop();
  
  // 난이도 업데이트 시작
  updateDifficulty();
};

// 게임 종료
const endGame = () => {
  gameOver.value = true;
  gameStarted.value = false;
};

// 키 이벤트 핸들러
const handleKeyDown = (e) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    keysPressed.value[e.key] = true;
    e.preventDefault();
  }
};

const handleKeyUp = (e) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    keysPressed.value[e.key] = false;
    e.preventDefault();
  }
};

// 적 여러개 생성
const spawnEnemies = () => {
  if (!gameStarted.value) return;
  
  for (let i = 0; i < enemySpawnCount.value; i++) {
    spawnEnemy();
  }
  
  // 다음 적 생성 예약
  setTimeout(spawnEnemies, 2000);
};

// 적 생성
const spawnEnemy = () => {
  if (!gameStarted.value) return;
  
  let validPosition = false;
  let x, y;
  
  // 플레이어로부터 최소 거리 이상인 위치 찾기
  while (!validPosition) {
    x = Math.random() * (window.innerWidth - 2 * enemyRadius.value) + enemyRadius.value;
    y = Math.random() * (window.innerHeight - 2 * enemyRadius.value) + enemyRadius.value;
    
    const distance = Math.sqrt(
      Math.pow(x - playerX.value, 2) + Math.pow(y - playerY.value, 2)
    );
    
    if (distance > minSpawnDistance.value) {
      validPosition = true;
    }
  }
  
  enemies.value.push({ x, y });
};

// 아이템 여러개 생성
const spawnItems = () => {
  if (!gameStarted.value) return;
  
  for (let i = 0; i < itemSpawnCount.value; i++) {
    spawnItem();
  }
  
  // 다음 아이템 생성 예약
  setTimeout(spawnItems, 5000);
};

// 아이템 생성
const spawnItem = () => {
  if (!gameStarted.value) return;
  
  const x = Math.random() * (window.innerWidth - 2 * itemRadius.value) + itemRadius.value;
  const y = Math.random() * (window.innerHeight - 2 * itemRadius.value) + itemRadius.value;
  
  items.value.push({ x, y });
};

// 파동 효과 생성
const createEffect = (x, y) => {
  effects.value.push({
    x,
    y,
    radius: enemyRadius.value,
    maxRadius: enemyRadius.value * 3,
    opacity: 1
  });
};

// 난이도 업데이트 (30초마다)
const updateDifficulty = () => {
  if (!gameStarted.value) return;
  
  // 30초마다 난이도 증가
  gameTime.value += 30;
  difficultyLevel.value += 1;
  
  // 적 생성 수 증가 (+10)
  enemySpawnCount.value += 10;
  
  // 아이템 생성 수 증가 (+2)
  itemSpawnCount.value += 2;
  
  // 다음 난이도 업데이트 예약
  setTimeout(updateDifficulty, 30000);
};

// 게임 로직 업데이트
const updateGame = () => {
  if (!gameStarted.value || gameOver.value) return;
  
  // 플레이어 이동
  if (keysPressed.value.ArrowUp) {
    playerY.value = Math.max(playerRadius.value, playerY.value - playerSpeed.value);
  }
  if (keysPressed.value.ArrowDown) {
    playerY.value = Math.min(window.innerHeight - playerRadius.value, playerY.value + playerSpeed.value);
  }
  if (keysPressed.value.ArrowLeft) {
    playerX.value = Math.max(playerRadius.value, playerX.value - playerSpeed.value);
  }
  if (keysPressed.value.ArrowRight) {
    playerX.value = Math.min(window.innerWidth - playerRadius.value, playerX.value + playerSpeed.value);
  }
  
  // 파워업 시간 감소
  if (isPoweredUp.value) {
    powerUpTimeLeft.value -= 1/60;
    if (powerUpTimeLeft.value <= 0) {
      isPoweredUp.value = false;
    }
  }
  
  // 적 이동 및 충돌 체크
  for (let i = enemies.value.length - 1; i >= 0; i--) {
    const enemy = enemies.value[i];
    
    // 적이 플레이어를 향해 이동
    const dx = playerX.value - enemy.x;
    const dy = playerY.value - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 0) {
      // 적 이동 속도 계산
      const vx = (dx / distance) * enemySpeed.value;
      const vy = (dy / distance) * enemySpeed.value;
      
      // 적 위치 업데이트
      enemy.x += vx;
      enemy.y += vy;
    }
    
    // 충돌 체크
    if (distance < playerRadius.value + enemyRadius.value) {
      if (isPoweredUp.value) {
        // 적 파괴
        createEffect(enemy.x, enemy.y);
        enemies.value.splice(i, 1);
        score.value += 100;
      } else {
        // 게임 오버
        endGame();
      }
    }
  }
  
  // 아이템 충돌 체크
  for (let i = items.value.length - 1; i >= 0; i--) {
    const item = items.value[i];
    const distance = Math.sqrt(
      Math.pow(item.x - playerX.value, 2) + Math.pow(item.y - playerY.value, 2)
    );
    
    if (distance < playerRadius.value + itemRadius.value) {
      // 아이템 획득
      items.value.splice(i, 1);
      isPoweredUp.value = true;
      powerUpTimeLeft.value = 5;
    }
  }
  
  // 효과 업데이트
  for (let i = effects.value.length - 1; i >= 0; i--) {
    const effect = effects.value[i];
    effect.radius += 2;
    effect.opacity -= 0.03;
    
    if (effect.opacity <= 0 || effect.radius >= effect.maxRadius) {
      effects.value.splice(i, 1);
    }
  }
};

// 게임 루프
let animationFrameId = null;
const gameLoop = () => {
  if (!gameStarted.value) return;
  
  updateGame();
  animationFrameId = requestAnimationFrame(gameLoop);
};

// 플레이어 색상
const playerColor = computed(() => {
  return isPoweredUp.value ? '#FFD700' : '#3498db';
});

// 컴포넌트 마운트/언마운트 시 이벤트 리스너 처리
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>

<template>
  <div class="game-container">
    <!-- 시작 화면 -->
    <div v-if="!gameStarted && !gameOver" class="start-screen">
      <h1>간단한 게임</h1>
      <button @click="startGame" class="start-button">시작하기</button>
      <div class="instructions">
        <p>방향키로 이동하세요</p>
        <p>노란색 아이템을 모으고 빨간색 적을 피하세요</p>
        <p>아이템 획득 시 5초간 적을 파괴할 수 있습니다</p>
        <p>30초마다 적 +10, 아이템 +2씩 증가합니다</p>
      </div>
    </div>
    
    <!-- 게임 오버 화면 -->
    <div v-if="gameOver" class="game-over-screen">
      <h1>게임 오버</h1>
      <p>점수: {{ score }}</p>
      <p>난이도: {{ difficultyLevel }}</p>
      <button @click="startGame" class="restart-button">다시 시작</button>
    </div>
    
    <!-- 게임 화면 -->
    <div v-if="gameStarted" class="game-area">
      <!-- 점수 -->
      <div class="score">점수: {{ score }}</div>
      
      <!-- 난이도 -->
      <div class="difficulty">난이도: {{ difficultyLevel }}</div>
      
      <!-- 파워업 타이머 -->
      <div v-if="isPoweredUp" class="power-up-timer">
        파워업: {{ powerUpTimeLeft.toFixed(1) }}초
      </div>
      
      <!-- 플레이어 -->
      <div class="player" :style="{
        left: `${playerX}px`,
        top: `${playerY}px`,
        width: `${playerRadius * 2}px`,
        height: `${playerRadius * 2}px`,
        backgroundColor: playerColor
      }"></div>
      
      <!-- 적 -->
      <div
        v-for="(enemy, index) in enemies"
        :key="`enemy-${index}`"
        class="enemy"
        :style="{
          left: `${enemy.x}px`,
          top: `${enemy.y}px`,
          width: `${enemyRadius * 2}px`,
          height: `${enemyRadius * 2}px`
        }"
      ></div>
      
      <!-- 아이템 -->
      <div
        v-for="(item, index) in items"
        :key="`item-${index}`"
        class="item"
        :style="{
          left: `${item.x}px`,
          top: `${item.y}px`,
          width: `${itemRadius * 2}px`,
          height: `${itemRadius * 2}px`
        }"
      ></div>
      
      <!-- 효과 -->
      <div
        v-for="(effect, index) in effects"
        :key="`effect-${index}`"
        class="effect"
        :style="{
          left: `${effect.x}px`,
          top: `${effect.y}px`,
          width: `${effect.radius * 2}px`,
          height: `${effect.radius * 2}px`,
          opacity: effect.opacity
        }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.game-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #f0f0f0;
}

.start-screen, .game-over-screen {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.start-button, .restart-button {
  padding: 10px 20px;
  font-size: 18px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
}

.start-button:hover, .restart-button:hover {
  background-color: #2980b9;
}

.instructions {
  margin-top: 20px;
  color: #333;
}

.game-area {
  width: 100%;
  height: 100%;
}

.score {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 24px;
  font-weight: bold;
}

.difficulty {
  position: absolute;
  top: 50px;
  right: 20px;
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.power-up-timer {
  position: absolute;
  top: 80px;
  right: 20px;
  font-size: 18px;
  color: #FFD700;
}

.player {
  position: absolute;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: background-color 0.3s;
}

.enemy {
  position: absolute;
  border-radius: 50%;
  background-color: #e74c3c;
  transform: translate(-50%, -50%);
}

.item {
  position: absolute;
  border-radius: 50%;
  background-color: #f1c40f;
  transform: translate(-50%, -50%);
}

.effect {
  position: absolute;
  border-radius: 50%;
  border: 2px solid #e74c3c;
  background-color: transparent;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
</style>
