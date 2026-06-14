# 寰宇溯源 · 全球人类起源史

中国风 3D 交互展示 —— 基于 WebGPU 渲染的水墨地球，点击七大洲查看人类起源史。

## ✨ 特性

- 🌏 **WebGPU 优先渲染** + WebGL 自动回退
- 🎨 **中国风视觉**：朱红、鸦青、缃色、月白色板；宣纸纹理、印章、卷轴、毛笔字
- 🖱️ **交互**：鼠标拖拽旋转、滚轮缩放、悬停高亮、点击大陆查看
- 📜 **七大洲内容**：非洲、亚洲、欧洲、北美洲、南美洲、大洋洲、南极洲，各 6 个关键史前节点
- ⏱️ **时间轴**：从早期人属到南极探险的百万年迁徙史

## 🛠️ 技术栈

| 类别 | 选型 |
|------|------|
| 构建 | Vite 5 + TypeScript |
| 3D | Three.js (WebGPURenderer) |
| 动画 | GSAP 3 |
| 后期 | EffectComposer + UnrealBloomPass |

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 类型检查 + 生产构建
npm run build

# 预览构建产物
npm run preview
```

启动后访问 `http://localhost:5173`，点击「启卷」印章按钮进入主舞台。

## 📁 目录结构

```
world game/
├── index.html              # HTML 入口
├── package.json
├── tsconfig.json
├── vite.config.ts
├── public/
│   └── favicon.svg
└── src/
    ├── main.ts             # 主入口
    ├── core/
    │   ├── Renderer.ts     # WebGPU/WebGL 自适应
    │   ├── Globe.ts        # 地球模型 + 大气层 + ID 纹理
    │   ├── Camera.ts       # 轨道控制 + 点击聚焦
    │   ├── Picker.ts       # 大陆拾取
    │   └── PostFX.ts       # 后期处理
    ├── data/
    │   ├── continents.ts   # 七大洲元数据
    │   └── content.ts      # 各大陆起源史内容
    ├── ui/
    │   ├── ScrollPanel.ts  # 卷轴面板 + 时间轴
    │   ├── Tooltip.ts      # 悬停提示 + HUD
    │   └── TitleScreen.ts  # 启动封面
    ├── utils/
    │   ├── colors.ts       # 国风色板
    │   ├── geo.ts          # 经纬度转换
    │   └── easing.ts       # 缓动函数
    └── styles/
        └── main.css        # 全局样式
```

## 🎮 操作指南

| 操作 | 效果 |
|------|------|
| 鼠标左键拖拽 | 旋转地球 |
| 滚轮 | 缩放 |
| 悬停大陆 | 显示大陆名 + HUD 高亮 |
| 点击大陆 | 相机聚焦 + 右侧卷轴展开 |
| 点击「合卷」 | 卷轴收起 + 视角复位 |

## 🌐 浏览器兼容

- **Chrome / Edge 113+**：WebGPU
- **Safari 26+**：WebGPU（部分功能）
- **Firefox**：WebGL 回退

## 📜 内容来源

人类起源史内容综合参考：
- Out of Africa theory（智人非洲起源）
- 古人类学经典遗址：Jebel Irhoud, Zhoukoudian, Dmanisi, Sangiran, Mungo Lake, Monte Verde 等
- 新石器农业革命：新月沃土、长江中下游、美索美洲
- 印加、毛利等文明起源
- 南极探险史

## ⚠️ 范围说明

- 仅中文界面
- 不支持 SSR
- 不引入 React/Vue（保持轻量）
- 大陆轮廓为简化多边形（聚焦于人类活动区域，不追求地理精度）