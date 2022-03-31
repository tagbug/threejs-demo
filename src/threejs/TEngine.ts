import * as three from 'three';
import { MOUSE, Object3D, Raycaster, Vector2 } from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';

export class TEngine {
    private dom: HTMLElement;
    private renderer: three.WebGLRenderer;
    private scene: three.Scene;
    private camera: three.PerspectiveCamera;

    // 物体变换控制器
    private transformControls: TransformControls;
    // 射线发射器
    private rayCaster: Raycaster;
    // threeJS坐标的鼠标位置
    private mouse: Vector2;

    // 控制requestAnimateFrame
    private frameUpdateRunning: boolean = true;
    // 挂载到dom下的子dom
    private subDomElem: HTMLElement[] = [];

    /**
     * 构建一个新的渲染器+场景，并将其挂载到给定的DOM节点下
     * @param dom 要挂载到的DOM节点
     */
    constructor(dom: HTMLElement) {
        this.dom = dom;
        const renderer = new three.WebGLRenderer({
            // 启用抗锯齿处理
            antialias: true,
        });
        // 开启渲染器的阴影渲染支持
        renderer.shadowMap.enabled = true;

        const scene = new three.Scene();
        // 将渲染器绑定到指定dom
        renderer.setSize(dom.offsetWidth, dom.offsetHeight, true);
        this.subDomElem.push(renderer.domElement);
        // 添加一个性能监视器
        const stats = Stats();
        stats.domElement.style.position = 'fix';
        stats.domElement.style.top = '0';
        stats.domElement.style.right = '50px';
        stats.domElement.style.left = 'unset';
        this.subDomElem.push(stats.domElement);

        // 如果不设置相机位置，则默认在场景原点(0,0,0)
        const camera = new three.PerspectiveCamera(45, dom.offsetWidth / dom.offsetHeight, 1, 1000);

        // 设置相机位置、视口
        camera.position.set(200, 200, 200);
        camera.lookAt(new three.Vector3(0, 0, 0));
        camera.up = new three.Vector3(0, 1, 0);

        // 初始轨道控制器
        const orbitControls: OrbitControls = new OrbitControls(camera, renderer.domElement);
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

        // 初始化变换控制器
        const transformControls = new TransformControls(camera, renderer.domElement);

        // 初始化射线发射器
        const rayCaster = new Raycaster();

        // 给renderer的canvas对象添加鼠标事件
        const mouse = new Vector2();
        renderer.domElement.addEventListener('mousemove', (e) => {
            const x = e.offsetX;
            const y = e.offsetY;
            // 将鼠标位置坐标转换为threeJS坐标
            const width = renderer.domElement.offsetWidth;
            const height = renderer.domElement.offsetHeight;
            mouse.x = x / width * 2 - 1;
            mouse.y = -y * 2 / height + 1;
        })
        renderer.domElement.addEventListener('click', (e) => {
            rayCaster.setFromCamera(mouse, camera);
            const intersection = rayCaster.intersectObjects(scene.children);
            if (intersection.length > 0) {
                const object = intersection[0].object;
                transformControls.attach(object);
            }
        })

        scene.add(transformControls);

        // 设置清空画布的颜色
        // renderer.setClearColor('rgb(255,255,255)');
        // renderer.clearColor();

        // 动态渲染
        const renderFun = () => {
            if (this.frameUpdateRunning) {
                // 性能监视
                stats.update();
                // 轨道控制器
                orbitControls.update();
                // 让渲染器渲染camera相机视角看到的scene的样子
                renderer.render(scene, camera);
                requestAnimationFrame(renderFun);
            }
        }
        renderFun();
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.mouse = mouse;
        this.transformControls = transformControls;
        this.rayCaster = rayCaster;
        this.subDomElem.forEach(elem => dom.appendChild(elem));
    }

    /**
     * 向场景中添加物体
     * @param objects 物体列表
     */
    addObject(...objects: three.Object3D[]) {
        objects.forEach(item => {
            // 不设置位置，则默认在原点(0,0,0)
            this.scene.add(item);
        })
    }

    /**
     * 停止渲染更新，并移除DOM节点的挂载
     */
    destroy() {
        this.frameUpdateRunning = false;
        this.subDomElem.forEach(elem => this.dom.removeChild(elem));
        console.log('destroyed...');
    }
}