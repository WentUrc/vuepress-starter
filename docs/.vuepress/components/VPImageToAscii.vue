<template>
  <div class="image-to-ascii">
    <h2>图片转 ASCII 字符画</h2>
    <br>

    <!-- 图片上传表单 -->
    <form class="ascii-form" @submit.prevent="handleSubmit">
      <div class="form-row">
        <!-- 1) 自定义按钮“选择图片” -->
        <label for="file-input" class="choose-file-btn">选择图片</label>
        <!-- 2) 隐藏的原生 <input type="file"> -->
        <input
          type="file"
          id="file-input"
          ref="fileInput"
          accept="image/*"
          @change="handleFileChange"
          class="file-input-hidden"
        />
        <!-- 3) 显示当前已选文件名 -->
        <span class="file-name">
          {{ file ? file.name : '未选择文件' }}
        </span>
      </div>

      <div class="form-row">
        <label for="width">目标宽度 (10~500)</label>
        <input
          type="number"
          id="width"
          v-model="width"
          min="10"
          max="500"
          class="width-input"
        />
      </div>

      <hr class="custom-hr">

      <div class="form-row checkbox-row">
        <!-- 左侧的标签文字 -->
        <span class="checkbox-text">是否生成彩色字符画</span>
        
        <!-- 右侧的复选框 -->
        <label class="checkbox-label">
          <input
            type="checkbox"
            id="color"
            v-model="isColor"
            class="custom-checkbox"
          />
          <span class="checkmark"></span>
        </label>
      </div>

      <!-- 生成字符画按钮 -->
      <button type="submit" class="submit-btn form-row" :disabled="loading">
        生成字符画
      </button>
    </form>

    <!-- 加载状态：转圈圈动画 -->
    <div v-if="loading" class="loading-spinner">
      <div class="spinner"></div>
      <p>正在生成中，请稍候...</p>
    </div>

    <!-- 显示结果 -->
    <transition name="fade">
      <div
        v-if="asciiArt && !loading"
        class="result-card"
      >
        <div v-if="isColor" class="color-ascii">
          <h3>彩色字符画：</h3>
          <img :src="asciiArt" alt="ASCII Art" />
        </div>
        <div v-else class="gray-ascii">
          <h3>灰度字符画：</h3>
          <img :src="asciiArt" alt="ASCII Art" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      file: null,
      width: 100,       // 默认宽度
      isColor: false,   // 默认是否生成彩色字符画
      loading: false,
      asciiArt: null,   // 存储后端返回的 ASCII 图片链接
    };
  },
  methods: {
    // 文件选择
    handleFileChange(event) {
      this.file = event.target.files[0];
      this.asciiArt = null;  // 清空上一次结果
    },

    // 提交处理
    async handleSubmit() {
      console.log("开始提交请求...");
      if (!this.file) {
        alert("请先选择一个图片文件！");
        return;
      }

      this.loading = true;
      const formData = new FormData();
      formData.append("file", this.file);
      formData.append("width", this.width);
      formData.append("color", this.isColor ? "true" : "false");

      try {
        const response = await axios.post("https://ascii.wenturc.com/convert", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.data.image_url) {
          // 后端返回一个 image_url
          this.asciiArt = response.data.image_url;
        } else if (response.data.error) {
          alert(response.data.error);
        } else {
          alert("未知错误，请查看后端日志。");
        }
      } catch (error) {
        console.error("上传失败", error);
        alert("图片上传失败，请重试！");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* 容器整体样式 */
.image-to-ascii {
  max-width: 400px;
  margin: 10px auto;
  padding: 20px;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  border: 2px solid var(--vp-c-brand-3);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

/* 标题样式 */
.image-to-ascii h2 {
  margin-bottom: 10px;
  text-align: center;
}

/* 表单布局 */
.ascii-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

/* 表单行 */
.form-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap; /* 允许换行 */
  gap: 10px;
  justify-content: space-between; /* 左右对齐 */
}

/* 统一标签宽度 */
.form-row label {
  min-width: 90px;
  flex: 1 1 100px; /* 允许标签和输入框在小屏幕上占据适当空间 */
}

/* 隐藏原生 input[type="file"] */
.file-input-hidden {
  display: none;
}

/* 显示文件名 */
.file-name {
  display: inline-block;
  padding: 4px 8px;
  background-color: var(--vp-c-green-soft);
  color: var(--vp-c-brand-3);
  overflow: hidden;        /* 溢出隐藏 */
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 50%; /* 确保不超过父容器的一半 */
  font-size: 1rem;
  border-radius: 6px;
  margin-left: auto; /* 将元素推到右边 */
}

/* 自定义“选择图片”按钮 */
.choose-file-btn {
  background-color: var(--vp-c-brand-3);
  color: #fff;
  padding: 8px 12px; /* 调整 padding 适应小屏幕 */
  border-radius: 6px;
  max-width: 50px;
  cursor: pointer;
  border: none;
  transition: background-color 0.3s;
  
  display: inline-flex; /* 让文字在垂直、水平都居中 */
  align-items: center;
  justify-content: center;
  
  flex: 0 0 auto; /* 防止按钮被拉伸 */
}

/* 按钮悬停效果 */
.choose-file-btn:hover {
  background-color: var(--vp-c-brand-2);
}

/* 输入框样式 */
input[type="number"] {
  width: 100%;
  max-width: 100px;
  padding: 5px;
  font-size: 1rem;
  border: 1px solid var(--vp-c-brand-3);
  border-radius: 6px;
  text-align: center;
}

/* 加载中样式：转圈圈 */
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
}

/* 分隔线 */
.custom-hr {
  border: none; /* 移除默认边框 */
  height: 2px; /* 设置高度 */
  background-color: #ccc; /* 设置颜色 */
  margin: 20px 0; /* 设置上下外边距 */
}

.spinner {
  width: 40px;
  height: 40px;
  border: 6px solid #eee;
  border-top: 6px solid var(--vp-c-brand-3);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

/* 结果卡片 */
.result-card {
  background: var(--vp-sidebar-bg-color);
  border-radius: 6px;
  padding: 20px;
  margin-top: 15px;
  box-shadow: 0 2px 4px var(--vp-c-brand-soft);
}

/* 彩色字符画 */
.color-ascii img {
  max-width: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
}

/* 灰度字符画 */
.gray-ascii img {
  max-width: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
}

/* 动画过渡 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 自定义复选框样式 */
.custom-checkbox {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

/* 复选框行 */
.checkbox-row {
  flex: 1 1 100%; /* 让复选框行占据整行 */
  display: flex;
  align-items: center;
  justify-content: space-between; /* 左右对齐 */
}

/* 左侧的标签文字 */
.checkbox-text {
  font-size: 1rem;
  color: var(--vp-c-brand-3);
  flex: 0 0 auto;
}

/* 伪元素或额外span实现视觉外观 */
.checkbox-label {
  position: relative;
  cursor: pointer;     /* 鼠标变小手 */
  user-select: none;   /* 防止选中文字 */
  display: flex;
  align-items: center;
}

/* 用一个 span 来画“方框” */
.checkmark {
  position: relative;
  left: 0;
  top: 50%;
  transform: translateY(0%);
  height: 18px;
  width: 18px;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-brand-3);
  border-radius: 4px;  /* 如果想要圆角的方框 */
  box-sizing: border-box;
  transition: all 0.2s ease;
  margin-left: 10%;
}

/* 当checkbox被选中时 .checkmark 改变外观 */
.custom-checkbox:checked + .checkmark {
  background-color: var(--vp-c-brand-3); /* 选中后，框内填充色 */
  border-color: var(--vp-c-brand-3);     /* 边框变为同样的色 */
}

/* 画对勾：可以用伪元素，也可用background图标，这里举伪元素示例 */
.checkmark::after {
  content: "";
  position: absolute;
  display: none;   /* 默认隐藏 */
  left: 6px;
  top: 3px;
  width: 4px;
  height: 8px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

/* 当checkbox被选中后，显示对勾 */
.custom-checkbox:checked + .checkmark::after {
  display: block;
}

/* 生成字符画按钮 */
.submit-btn {
  width: 100%; /* 让按钮在小屏幕上占满整行 */
  max-width: 100px; /* 设置最大宽度 */
  margin-right: auto; /* 靠右对齐并添加上边距 */
  padding: 8px 8px;
  font-size: 16px;
  background-color: var(--vp-c-brand-3);
  border: none;
  border-radius: 6px;
  color: #ffffff;
  cursor: pointer;
  transition: background-color 0.3s;
  
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* 按钮悬停效果 */
.submit-btn:hover:not(:disabled) {
  background-color: var(--vp-c-brand-2);
}

/* 按钮禁用状态 */
.submit-btn:disabled {
  background-color: var(--vp-c-brand-1);
  cursor: not-allowed;
}

/* 媒体查询：针对小屏幕优化 */
@media (max-width: 480px) {
  .image-to-ascii {
    padding: 10px;
  }

  .form-row {
    gap: 8px;
    justify-content: space-between; /* 确保在小屏幕下也左右对齐 */
  }

  .submit-btn {
    max-width: 100%;
    max-width: 100px;
    font-size: 16px;
    padding: 8px 8px;

    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .file-name {
    font-size: 0.9rem;
    margin-left: auto; /* 确保在小屏幕下也靠右 */
  }

  .checkbox-label {
    padding-left: 25px;
  }

  .checkmark {
    height: 16px;
    width: 16px;
  }

  .checkmark::after {
    left: 5px;
    top: 2px;
    width: 3px;
    height: 6px;
  }
}
</style>
