# Custom Browser 项目说明

## 项目信息

- 模板来源：[electron-vue-template](https://github.com/deluze/electron-vue-template)
- Node版本：v18.9.0
- 包管理工具：cnpm  `npm install -g cnpm`
- 安装：`cnpm install`

## 构建说明

### Windows构建

1. 设置Electron镜像源

```bash
export ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"
```

2. 执行构建命令

```bash
cnpm run build:win
```

### Mac系统常见问题解决方案

#### 应用提示"文件已损坏"解决方法

1. 允许任何来源应用运行

```bash
sudo spctl --master-disable
```

2. 清除应用扩展属性

方法一：针对特定应用

```bash
sudo xattr -dr com.apple.quarantine /Applications/name.app
```
 
提示：可以直接将应用拖拽到终端命令 `sudo xattr -rd com.apple.quarantine ` 后面

方法二：清除所有应用扩展属性

```bash
sudo xattr -cr /Applications/*
```
