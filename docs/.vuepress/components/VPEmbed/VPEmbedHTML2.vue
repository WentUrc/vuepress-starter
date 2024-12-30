<template>
  <!-- 根容器，切换浅色/深色时，会加上 light-mode 类（结合 style 看） -->
  <div :class="{'light-mode': isLightMode}" class="snake-game-wrapper">
    <!-- 主题切换按钮 -->
    <button
      class="theme-toggle"
      aria-label="Toggle Theme"
      @click="toggleTheme"
    >
      {{ isLightMode ? '☀️' : '🌙' }}
    </button>

    <!-- 游戏主容器，@keydown 监听按键事件，tabindex 让它可聚焦 -->
    <div
      class="game-container"
      ref="gameContainer"
      tabindex="0"
      @keydown.prevent="handleKeyDown"
    >
      <!-- 画布 -->
      <canvas
        ref="gameCanvas"
        :width="canvasWidth"
        :height="canvasHeight"
      ></canvas>

      <!-- 使用 v-if/v-else 显示遮罩层，而不是直接操作 innerHTML -->
      <div v-if="showOverlay" class="overlay">
        <h1>{{ overlayTitle }}</h1>

        <!-- 不同状态下的说明文字示例 -->
        <p v-if="gameState === 'START'">Press <strong>Space</strong> to Start</p>
        <p v-else-if="gameState === 'GAME_OVER'">Press <strong>Space</strong> to Restart</p>
        <p v-else-if="gameState === 'PAUSED'">Press <strong>Space</strong> to Resume</p>

        <!-- 提示 WASD 控制 -->
        <p v-if="gameState === 'START' || gameState === 'GAME_OVER'">
          Use <strong>W</strong>, <strong>A</strong>, <strong>S</strong>, <strong>D</strong> to move
        </p>
        <!-- 暂停时显示分数 -->
        <p v-else-if="gameState === 'PAUSED'">Score: {{ score }}</p>

        <div>High Score: {{ highScore }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SnakeGame',
  data() {
    return {
      // 主题切换
      isLightMode: false,

      // 游戏状态: START, PLAYING, PAUSED, GAME_OVER
      gameState: 'START',
      isPaused: false,

      // 画布参数
      canvasWidth: 800,
      canvasHeight: 600,
      gridSize: 20,

      // 游戏对象
      snake: [],
      direction: { x: 0, y: 0 },
      nextDirection: { x: 0, y: 0 },
      food: { x: 0, y: 0 },

      // 速度和计时器
      gameSpeed: 150,
      gameInterval: null,

      // 分数
      score: 0,
      highScore: 0
    };
  },
  computed: {
    // 是否显示遮罩层
    showOverlay() {
      // 当处于 PLAYING 时才隐藏 overlay，否则显示
      return this.gameState !== 'PLAYING';
    },
    // 不同状态对应不同的标题
    overlayTitle() {
      switch (this.gameState) {
        case 'START':
          return 'Snake Game';
        case 'PAUSED':
          return 'Paused';
        case 'GAME_OVER':
          return 'Game Over';
        default:
          return '';
      }
    }
  },
  mounted() {
    // 组件挂载后获取 canvas 上下文
    this.ctx = this.$refs.gameCanvas.getContext('2d');

    // 如果本地存储有最高分，则加载
    const storedHighScore = localStorage.getItem('snakeHighScore');
    if (storedHighScore) {
      this.highScore = parseInt(storedHighScore, 10);
    }

    // 先画一次初始画面（空场景）
    this.draw();

    // 默认聚焦，能够捕获键盘事件
    this.$refs.gameContainer.focus();
  },
  beforeUnmount() {
    // 组件卸载时清除游戏循环
    clearInterval(this.gameInterval);
  },
  methods: {
    // 切换主题
    toggleTheme() {
      this.isLightMode = !this.isLightMode;
      // 重新绘制，以便更新背景颜色
      this.draw();
    },

    // 监听按键
    handleKeyDown(e) {
      const key = e.key.toLowerCase();
      if (key === ' ') {
        // 根据当前状态，按空格时做不同处理
        if (this.gameState === 'START' || this.gameState === 'GAME_OVER') {
          this.initGame();
        } else if (this.gameState === 'PLAYING') {
          this.pauseGame();
        } else if (this.gameState === 'PAUSED') {
          this.resumeGame();
        }
      } else {
        // 方向控制
        if (key === 'w' && this.direction.y !== 1) {
          this.nextDirection = { x: 0, y: -1 };
        } else if (key === 'a' && this.direction.x !== 1) {
          this.nextDirection = { x: -1, y: 0 };
        } else if (key === 's' && this.direction.y !== -1) {
          this.nextDirection = { x: 0, y: 1 };
        } else if (key === 'd' && this.direction.x !== -1) {
          this.nextDirection = { x: 1, y: 0 };
        }
      }
    },

    // 初始化 (或重置) 游戏
    initGame() {
      // 清除已有 interval
      clearInterval(this.gameInterval);

      // 重置基本变量
      this.gameSpeed = 150;
      this.score = 0;
      this.snake = [
        {
          x: Math.floor(this.canvasWidth / (2 * this.gridSize)),
          y: Math.floor(this.canvasHeight / (2 * this.gridSize))
        }
      ];

      // 给一个随机方向
      this.direction = this.getRandomDirection();
      this.nextDirection = { ...this.direction };

      // 放置食物
      this.placeFood();

      // 进入 PLAYING 状态
      this.gameState = 'PLAYING';
      this.isPaused = false;

      // 启动循环
      this.gameInterval = setInterval(this.gameLoop, this.gameSpeed);

      // 聚焦
      this.$refs.gameContainer.focus();
    },

    pauseGame() {
      this.gameState = 'PAUSED';
      this.isPaused = true;
    },

    resumeGame() {
      this.gameState = 'PLAYING';
      this.isPaused = false;
      // 继续计时器里更新，无需重置 gameInterval
      this.$refs.gameContainer.focus();
    },

    // 游戏结束
    endGame() {
      clearInterval(this.gameInterval);
      this.gameState = 'GAME_OVER';
    },

    // 游戏循环
    gameLoop() {
      if (this.isPaused) return; // 暂停时不动

      // 更新方向
      this.direction = this.nextDirection;

      // 计算新蛇头
      const newHead = {
        x: this.snake[0].x + this.direction.x,
        y: this.snake[0].y + this.direction.y
      };

      // 碰撞检测：边界 or 撞到自己
      if (
        newHead.x < 0 ||
        newHead.x >= this.canvasWidth / this.gridSize ||
        newHead.y < 0 ||
        newHead.y >= this.canvasHeight / this.gridSize ||
        this.snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)
      ) {
        this.endGame();
        return;
      }

      // 移动蛇: 在头部插入新节点
      this.snake.unshift(newHead);

      // 检查是否吃到食物
      if (newHead.x === this.food.x && newHead.y === this.food.y) {
        this.score++;
        // 更新最高分
        if (this.score > this.highScore) {
          this.highScore = this.score;
          localStorage.setItem('snakeHighScore', this.highScore);
        }
        this.placeFood();

        // 每 5 分加速
        if (this.score % 5 === 0 && this.gameSpeed > 50) {
          this.gameSpeed -= 10;
          clearInterval(this.gameInterval);
          this.gameInterval = setInterval(this.gameLoop, this.gameSpeed);
        }
      } else {
        // 没吃到就移除蛇尾
        this.snake.pop();
      }

      // 绘制
      this.draw();
    },

    // 画布绘制
    draw() {
      if (!this.ctx) return;

      // 背景
      this.ctx.fillStyle = this.isLightMode ? '#bdc3c7' : '#34495e';
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

      // 食物
      this.ctx.fillStyle = '#e74c3c';
      this.ctx.fillRect(
        this.food.x * this.gridSize,
        this.food.y * this.gridSize,
        this.gridSize,
        this.gridSize
      );

      // 蛇
      this.ctx.fillStyle = '#2ecc71';
      this.snake.forEach(seg => {
        this.ctx.fillRect(
          seg.x * this.gridSize,
          seg.y * this.gridSize,
          this.gridSize - 2,
          this.gridSize - 2
        );
      });

      // 分数
      this.ctx.fillStyle = this.isLightMode ? '#2c3e50' : '#ecf0f1';
      this.ctx.font = '20px Arial';
      this.ctx.fillText(`Score: ${this.score}`, 10, 25);
      this.ctx.fillText(`High Score: ${this.highScore}`, 10, 50);
    },

    // 随机生成食物坐标
    placeFood() {
      const availablePositions = [];
      for (let x = 0; x < this.canvasWidth / this.gridSize; x++) {
        for (let y = 0; y < this.canvasHeight / this.gridSize; y++) {
          if (!this.snake.some(seg => seg.x === x && seg.y === y)) {
            availablePositions.push({ x, y });
          }
        }
      }
      if (availablePositions.length === 0) {
        // 整个网格被蛇占满
        this.endGame();
        return;
      }
      const idx = Math.floor(Math.random() * availablePositions.length);
      this.food = availablePositions[idx];
    },

    // 随机方向
    getRandomDirection() {
      const directions = [
        { x: 0, y: -1 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: -1, y: 0 }
      ];
      return directions[Math.floor(Math.random() * directions.length)];
    }
  }
};
</script>

<style>
/* ——全局或通用的样式—— */

.snake-game-wrapper {
  /* 让组件本身能在父级容器中充满，按需设置 */
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #2c3e50;
  color: #ecf0f1;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  transition: background-color 0.3s ease;
}

/* 浅色模式 */
.light-mode.snake-game-wrapper {
  background-color: #ecf0f1;
  color: #2c3e50;
}

/* 切换主题的按钮 */
.theme-toggle {
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: inherit; /* 让它随父元素变色 */
  transition: color 0.3s ease;
}

/* 游戏主容器 */
.game-container {
  position: relative;
  outline: none; /* 去除焦点框 */
  border: 2px solid var(--vp-c-brand-3);
  border-radius: 15px;
}

/* 画布 */
canvas {
  background-color: #34495e;
  border: 2px solid #ecf0f1;
  border-radius: 10px;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}
.light-mode .game-container canvas {
  background-color: #bdc3c7;
  border-color: #2c3e50;
}

/* 遮罩层 */
.overlay {
  position: absolute;
  top: 0; 
  left: 0;
  width: 800px;   /* 与 canvasWidth 相同即可 */
  height: 600px;  /* 与 canvasHeight 相同即可 */
  background: rgba(44, 62, 80, 0.85);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  transition: background 0.3s ease;
}

/* 浅色模式下的遮罩层 */
.light-mode .overlay {
  background: rgba(236, 240, 241, 0.85);
}

/* 遮罩层文案 */
.overlay h1 {
  margin-bottom: 20px;
  font-size: 48px;
  color: #e74c3c;
}

.overlay p {
  font-size: 20px;
  margin-bottom: 10px;
}
</style>
