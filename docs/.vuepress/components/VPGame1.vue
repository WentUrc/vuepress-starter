<template>
    <div class="clicker-game">
      <h1>点击赚积分</h1>
      <p>当前积分：{{ points }}</p>
      <p>每次点击获得：{{ clickPower }} 积分</p>
      <button @click="addPoints" class="click-button">点击我 !</button>
  
      <hr class="custom-hr">

      <div class="upgrade-section">
        <h2>升级</h2>
        <div v-for="upgrade in upgrades" :key="upgrade.id" class="upgrade-item">
          <span>{{ upgrade.name }} (+{{ upgrade.value }} / 点击)</span>
          <span>成本: {{ upgrade.cost }} 积分</span>
          <button @click="buyUpgrade(upgrade)" :disabled="points < upgrade.cost">
            购买
          </button>
        </div>
      </div>
  
      <div class="auto-section" v-if="autoUpgrades.length">
        <h2>自动获取</h2>
        <div v-for="auto in autoUpgrades" :key="auto.id" class="auto-item">
          <span>{{ auto.name }} (当前每秒 +{{ auto.value * auto.count }} 积分)</span>
          <span>成本: {{ auto.cost }} 积分</span>
          <button @click="buyAutoUpgrade(auto)" :disabled="points < auto.cost">
            购买
          </button>
        </div>
      </div>
  
      <button @click="resetGame" class="reset-button">重置游戏</button>
  
      <!-- 音效 -->
      <audio ref="clickSound" src="/sounds/click.wav"></audio>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ClickerGame',
    data() {
      return {
        points: 0,
        clickPower: 1,
        upgrades: [
          { id: 1, name: '强化手指', value: 1, cost: 10 },
          { id: 2, name: '敏捷手指', value: 5, cost: 50 },
          { id: 3, name: '超级手指', value: 10, cost: 100 },
        ],
        autoUpgrades: [
          { id: 1, name: '自动点击器', value: 1, cost: 50, count: 0 },
          { id: 2, name: '高级自动点击器', value: 5, cost: 250, count: 0 },
        ],
        autoInterval: null,
      };
    },
    mounted() {
      this.loadGame();
      this.startAutoInterval();
    },
    // 根据 Vue 版本选择正确的生命周期钩子
    beforeUnmount() { // Vue 3
      this.stopAutoInterval();
      this.saveGame();
    },
    // beforeDestroy() { // Vue 2
    //   this.stopAutoInterval();
    //   this.saveGame();
    // },
    methods: {
      addPoints() {
        this.points += this.clickPower;
        this.playSound();
        this.saveGame();
      },
      buyUpgrade(upgrade) {
        if (this.points >= upgrade.cost) {
          this.points -= upgrade.cost;
          this.clickPower += upgrade.value;
          upgrade.cost = Math.floor(upgrade.cost * 1.5);
          this.saveGame();
        }
      },
      buyAutoUpgrade(auto) {
        if (this.points >= auto.cost) {
          this.points -= auto.cost;
          auto.count += 1; // 增加拥有数量
          // 如果需要增加 auto.value，可以在这里调整
          // 例如：auto.value += 1;
          auto.cost = Math.floor(auto.cost * 1.5);
          this.saveGame();
        }
      },
      autoAddPoints() {
        this.autoUpgrades.forEach(auto => {
          if (auto.count > 0) {
            this.points += auto.value * auto.count;
          }
        });
        this.saveGame();
      },
      resetGame() {
        if (confirm('确定要重置游戏吗？所有进度将会丢失。')) {
          this.points = 0;
          this.clickPower = 1;
          this.upgrades = [
            { id: 1, name: '强化手指', value: 1, cost: 10 },
            { id: 2, name: '敏捷手指', value: 5, cost: 50 },
            { id: 3, name: '超级手指', value: 10, cost: 100 },
          ];
          this.autoUpgrades = [
            { id: 1, name: '自动点击器', value: 1, cost: 50, count: 0 },
            { id: 2, name: '高级自动点击器', value: 5, cost: 250, count: 0 },
          ];
          this.saveGame();
        }
      },
      saveGame() {
        const gameState = {
          points: this.points,
          clickPower: this.clickPower,
          upgrades: this.upgrades,
          autoUpgrades: this.autoUpgrades,
        };
        localStorage.setItem('clickerGameState', JSON.stringify(gameState));
      },
      loadGame() {
        const savedState = localStorage.getItem('clickerGameState');
        if (savedState) {
          const gameState = JSON.parse(savedState);
          this.points = gameState.points;
          this.clickPower = gameState.clickPower;
          this.upgrades = gameState.upgrades;
          this.autoUpgrades = gameState.autoUpgrades;
        }
      },
      playSound() {
        const sound = this.$refs.clickSound;
        if (sound) {
          sound.currentTime = 0;
          sound.play();
        }
      },
      startAutoInterval() {
        this.autoInterval = setInterval(this.autoAddPoints, 1000);
      },
      stopAutoInterval() {
        clearInterval(this.autoInterval);
      },
    },
  };
  </script>
  
  <style scoped>
  .clicker-game {
    text-align: center;
    padding: 20px;
    border: 2px solid var(--vp-c-brand-3);
    border-radius: 20px;
    max-width: 500px;
    margin: auto;
  }
  
  .click-button {
    padding: 15px 30px;
    font-size: 18px;
    margin: 20px 0;
    cursor: pointer;
    background-color: var(--vp-c-brand-1);
    color: white;
    border: none;
    border-radius: 9px;
    transition: transform 0.1s;
  }
  
  .click-button:active {
    transform: scale(0.95);
  }

  /* 分隔线 */
  .custom-hr {
    border: none; /* 移除默认边框 */
    height: 2px; /* 设置高度 */
    background-color: #ccc; /* 设置颜色 */
    margin: 20px 0; /* 设置上下外边距 */
  }
  
  .upgrade-section,
  .auto-section {
    margin-top: 0px;
  }
  
  .upgrade-item,
  .auto-item {
    display: flex;
    flex-wrap: wrap; /* 允许按钮和文字自动换行 */
    gap: 10px; /* 按钮与文字之间的间距 */
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
}
  
  .upgrade-item span,
  .auto-item span {
    flex: 1 1 auto; /* 文字宽度自适应 */
    min-width: 150px; /* 文字最小宽度，防止挤压 */
  }

  .upgrade-item button,
  .auto-item button {
    flex: 0 0 auto; /* 按钮宽度保持固定 */
    padding: 5px 10px;
    margin-left: auto;
    cursor: pointer;
    background-color: #35495e;
    color: white;
    border: none;
    border-radius: 3px;
    transition: background-color 0.3s;
}
  
  .upgrade-item button:disabled,
  .auto-item button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  .upgrade-item button:not(:disabled):hover,
  .auto-item button:not(:disabled):hover {
    background-color: #42b983;
  }
  
  .reset-button {
    margin-top: 40px;
    padding: 10px 20px;
    cursor: pointer;
    background-color: #ff4d4f;
    color: white;
    border: none;
    border-radius: 9px;
    transition: background-color 0.3s;
  }
  
  .reset-button:hover {
    background-color: #ff7875;
  }
  </style>
  