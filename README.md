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
        └───threejs             threeJS模块目录
            ├───TEngine.ts      threeJS核心引擎，通过这个类初始化并绑定DOM对象
            ├───TBasicObject.ts threeJS基础物体
            ├───TLights.ts      threeJS光源对象
            ├───THelper.ts      threeJS辅助器对象
            ├───TTextures.ts    threeJS纹理、贴图对象
            ├───TLoadModel.ts   threeJS外部资源加载模块
            ....


## Run in development mode

```shell
> npm start
```

## Build

```shell
> npm run build
```