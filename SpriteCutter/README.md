# Sprite Cutter - 图片裁剪工具

一个基于 Next.js 的现代化图片裁剪工具，支持智能居中、精确裁剪和高质量输出。

## 技术栈

- **Next.js 14** - React 框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **Headless UI** - 无样式组件库
- **Heroicons** - 图标库
- **Zustand** - 状态管理
- **pnpm** - 包管理器

## 功能特性

- 📸 **图片上传** - 支持拖拽上传和点击选择
- ✂️ **精确裁剪** - 拖拽移动和调整裁剪区域大小
- 🎯 **智能居中** - 一键自动居中裁剪区域
- 🔄 **重置功能** - 快速重置到默认裁剪状态
- 💾 **高质量下载** - 保持原图质量的 PNG 格式输出
- 📱 **响应式设计** - 适配各种屏幕尺寸
- 🎨 **现代化 UI** - 美观的用户界面设计

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
pnpm build
pnpm start
```

## 使用说明

1. **上传图片**：点击上传区域或拖拽图片文件到页面
2. **调整裁剪区域**：
   - 拖拽裁剪框移动位置
   - 拖拽四个角落的控制点调整大小
3. **使用控制功能**：
   - 点击「自动居中」快速居中裁剪区域
   - 点击「重置裁剪」恢复默认设置
   - 点击「下载图片」保存裁剪结果

## 项目结构

```
SpriteCutter/
├── app/                    # Next.js App Router
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页面
├── components/            # React 组件
│   ├── ImageUpload.tsx    # 图片上传组件
│   ├── ImageCropper.tsx   # 图片裁剪组件
│   └── ControlPanel.tsx   # 控制面板组件
├── store/                 # Zustand 状态管理
│   └── cropStore.ts       # 裁剪状态管理
├── package.json           # 项目配置
├── tailwind.config.js     # Tailwind 配置
├── tsconfig.json          # TypeScript 配置
└── next.config.js         # Next.js 配置
```

## 核心功能实现

### 状态管理 (Zustand)

使用 Zustand 管理应用状态，包括：
- 图片数据（原始尺寸和显示尺寸）
- 裁剪区域坐标和尺寸
- 拖拽和调整状态
- 自动居中逻辑

### 图片处理

- 自动计算显示尺寸，保持宽高比
- 支持高分辨率图片的缩放显示
- 裁剪时使用原始图片尺寸，确保输出质量

### 交互体验

- 平滑的拖拽和调整操作
- 实时预览裁剪效果
- 边界约束，防止裁剪区域超出图片范围
- 响应式设计，适配移动端

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 许可证

MIT License