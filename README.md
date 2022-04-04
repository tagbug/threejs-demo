# ThreeJS-demo

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

![example workflow](https://github.com/tagbug/threejs-demo/actions/workflows/node.js.yml/badge.svg)

基于threeJS的3D装机项目

## 目录结构

    ├───public          静态资源目录
    ├───src             源码目录
        ├───App.tsx     
        ├───global.css  全局CSS样式
        ├───index.tsx   
        │
        ├───utils           实用工具目录
        │   ├───HOF.ts      封装常用高阶函数
        │   ....
        │       
        └───threejs             threeJS模块目录
            ├───TEngine.ts      threeJS核心引擎，通过这个类初始化并绑定DOM对象
            ├───TBasicObject.ts threeJS基础物体
            ├───TLights.ts      threeJS光源对象
            ├───THelper.ts      threeJS辅助器对象
            ├───TTextures.ts    threeJS纹理、贴图对象
            ├───TSprite.ts      threeJS精灵、粒子对象
            ├───TFont.ts        threeJS字体、文字对象
            ├───TAnimation.ts   threeJS动画处理模块
            ├───TLoadModel.ts   threeJS外部资源加载模块
            ├───TPhysics.ts     threeJS+CANNON 物理效果模块
            ├───TSound.ts       声音资源模块
            ├───DatGui.ts       为engine提供DatGui面板支持
            ....


## Run in development mode

```shell
> npm start
```

## Build

```shell
> npm run build
```