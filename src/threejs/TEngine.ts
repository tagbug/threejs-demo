import * as three from 'three';
import { MOUSE } from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class TEngine {
    private dom: HTMLElement;
    private renderer: three.WebGLRenderer;

    private scene: three.Scene;
    private camera: three.PerspectiveCamera;

    constructor(dom: HTMLElement) {
        this.dom = dom;
        this.renderer = new three.WebGLRenderer({
            // 启用抗锯齿处理
            antialias: true,
        });
        this.scene = new three.Scene();
        // 将渲染器绑定到指定dom
        this.renderer.setSize(dom.offsetWidth, dom.offsetHeight, true);
        dom.appendChild(this.renderer.domElement);
        // 添加一个性能监视器
        const stats = Stats();
        stats.domElement.style.position = 'fix';
        stats.domElement.style.top = '0';
        stats.domElement.style.right = '50px';
        stats.domElement.style.left = 'unset';
        dom.appendChild(stats.domElement);

        // 如果不设置相机位置，则默认在场景原点(0,0,0)
        this.camera = new three.PerspectiveCamera(45, dom.offsetWidth / dom.offsetHeight, 1, 1000);

        // 设置相机位置、视口
        this.camera.position.set(20, 20, 20);
        this.camera.lookAt(new three.Vector3(0, 0, 0));
        this.camera.up = new three.Vector3(0, 1, 0);

        // 初始轨道控制器
        const orbitControls: OrbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        // 设置自动跟随物体旋转
        // orbitControls.autoRotate = true;
        // 设置操作惯性（阻尼）
        orbitControls.enableDamping = true;
        // 设置鼠标控制效果
        orbitControls.mouseButtons = {
            LEFT: null as unknown as MOUSE,
            MIDDLE: MOUSE.DOLLY,
            RIGHT: MOUSE.ROTATE,
        };

        // 环境光
        const ambientLight: three.AmbientLight = new three.AmbientLight('gba(255,255,255)', 1);

        // 增加一些辅助工具
        // 坐标轴
        const axesHelper: three.AxesHelper = new three.AxesHelper(500);
        // 地面网格
        const gridHelper: three.GridHelper = new three.GridHelper(500, 20, 'rgb(200,200,200', 'rgb(100,100,100)');

        this.scene.add(ambientLight);
        this.scene.add(axesHelper);
        this.scene.add(gridHelper);

        // 设置清空画布的颜色
        // this.renderer.setClearColor('rgb(255,255,255)');
        // this.renderer.clearColor();

        // 动态渲染
        const renderFun = () => {
            // 性能监视
            stats.update();
            // 轨道控制器
            orbitControls.update();
            // 让渲染器渲染camera相机视角看到的scene的样子
            this.renderer.render(this.scene, this.camera);
            requestAnimationFrame(renderFun);
        }
        renderFun();
    }

    addObject(...objects: three.Object3D[]) {
        objects.forEach(item => {
            // 不设置位置，则默认在原点(0,0,0)
            this.scene.add(item);
        })
    }
}