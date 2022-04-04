import * as three from 'three';
import { Color, CubeTexture, Mesh, MeshStandardMaterial, MOUSE, Object3D, Raycaster, Vector2 } from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import * as dat from 'dat.gui';
import { destroyPhysicsWorld } from './TPhysics';

export class TEngine {
    private dom: HTMLElement;
    private renderer: three.WebGLRenderer;
    private scene: three.Scene;
    private camera: three.PerspectiveCamera;

    // 物体变换控制器
    private transformControls: TransformControls | null = null;
    // 物体变换控制器销毁方法
    private transformControlsDestroy: Function | null = null;
    // 射线发射器
    private rayCaster: Raycaster | null = null;
    // threeJS坐标的鼠标位置
    private mouse: Vector2 | null = null;

    // 控制requestAnimateFrame
    private frameUpdateRunning: boolean = true;
    // 挂载到dom下的子dom
    private subDomElem: HTMLElement[] = [];
    // DatGui
    private datGui: dat.GUI | null = null;
    // 每次要在reqAniFrame中执行的额外
    private aniFunctions: Function[] = [];

    /**
     * 构建一个新的渲染器+场景，并将其挂载到给定的DOM节点下
     * @param dom 要挂载到的DOM节点
     */
    constructor(dom: HTMLElement) {
        this.dom = dom;
        const renderer = new three.WebGLRenderer({
            // 启用抗锯齿处理（默认为MSAA）
            antialias: true,
        });
        // 开启渲染器的阴影渲染支持
        renderer.shadowMap.enabled = true;
        // 更换质量更好的/更耗性能的阴影算法，但不支持阴影过渡半径
        renderer.shadowMap.type = three.PCFSoftShadowMap;
        // 更换渲染输出解码器，得到更真实的画面品质（默认位LinearEncoding）
        // 工作原理：由于人眼对于亮度较高的部分的敏感度比亮度较低的部分小，sRGBEncoding会让亮度值以非线性但更容易被人眼感知的方式调整，而LinearEncoding（默认值）则是将亮度等级平分，所以在高亮度区域人眼更难察觉到不同
        // 当使用sRBG的图片时，使用这个解码器才能还原真实色彩
        renderer.outputEncoding = three.sRGBEncoding;
        // 调节参数让渲染更真实
        renderer.physicallyCorrectLights = true;
        renderer.toneMapping = three.ReinhardToneMapping;
        renderer.toneMappingExposure = 3;

        const scene = new three.Scene();
        // 将渲染器绑定到指定dom
        renderer.setSize(dom.offsetWidth, dom.offsetHeight, true);
        this.subDomElem.push(renderer.domElement);
        // 添加一个性能监视器
        const stats = Stats();
        stats.domElement.style.position = 'fix';
        stats.domElement.style.top = '0';
        stats.domElement.style.left = '0';
        this.subDomElem.push(stats.domElement);

        // 如果不设置相机位置，则默认在场景原点(0,0,0)
        const camera = new three.PerspectiveCamera(45, dom.offsetWidth / dom.offsetHeight, 1, 1000);
        // 增加resize监听
        function resizeListener() {
            renderer.setSize(dom.offsetWidth, dom.offsetHeight, true);
            camera.aspect = dom.offsetWidth / dom.offsetHeight;
            camera.updateProjectionMatrix();
        }
        window.addEventListener('resize', resizeListener);

        // 设置相机位置、视口
        camera.position.set(30, 10, 30);
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

        // 设置清空画布的颜色
        // renderer.setClearColor('rgb(255,255,255)');
        // renderer.clearColor();

        // 动态渲染
        const renderFun = () => {
            if (this.frameUpdateRunning) {
                // 执行自定义方法
                this.aniFunctions.forEach(fun => fun());
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
        this.subDomElem.forEach(elem => dom.appendChild(elem));
        console.log('TEngine load success');
        console.log('右键旋转，Ctrl+右键平移，鼠标滚轮缩放，enableTransformControl启用时，左键拾取物体');
    }

    /**
     * 初始化变换控制器
     */
    initTransformControl() {
        const camera = this.camera;
        const renderer = this.renderer;
        const scene = this.scene;
        if (this.transformControls !== null) {
            return;
        }

        // 初始化变换控制器
        const transformControls = new TransformControls(camera, renderer.domElement);
        let transing = false;
        transformControls.addEventListener('mouseDown', (e) => {
            transing = true;
        })
        function switcher(e: KeyboardEvent) {
            switch (e.key) {
                case "1": transformControls.mode = 'translate'; break;
                case "2": transformControls.mode = 'scale'; break;
                case "3": transformControls.mode = 'rotate'; break;
            }
        }
        document.addEventListener('keyup', switcher)

        // 初始化射线发射器
        const rayCaster = new Raycaster();

        // 给renderer的canvas对象添加鼠标事件
        const mouse = new Vector2();
        let cachedObject: Object3D | null = null;
        function moveListener(e: MouseEvent) {
            const x = e.offsetX;
            const y = e.offsetY;
            // 将鼠标位置坐标转换为threeJS坐标
            const width = renderer.domElement.offsetWidth;
            const height = renderer.domElement.offsetHeight;
            mouse.x = x / width * 2 - 1;
            mouse.y = -y * 2 / height + 1;
            // 选取物体
            rayCaster.setFromCamera(mouse, camera);
            const intersection = rayCaster.intersectObjects(scene.children);
            if (intersection.length > 0) {
                let idx = 0;
                while (idx < intersection.length && (!(intersection[idx].object instanceof Mesh) && intersection[idx].object.type === "TransformControlsPlane")) idx++;
                if (idx < intersection.length) {
                    const object = intersection[idx].object;
                    if (object !== cachedObject) {
                        // 派发自定义事件：鼠标离开
                        cachedObject?.dispatchEvent({
                            type: 'mouseLeave'
                        })
                        // 派发自定义事件：鼠标进入
                        object.dispatchEvent({
                            type: 'mouseEnter'
                        })
                    } else {
                        object.dispatchEvent({
                            type: 'mouseMove'
                        })
                    }
                    cachedObject = object;
                }
            } else {
                cachedObject?.dispatchEvent({
                    type: 'mouseLeave'
                })
                cachedObject = null;
            }
        }
        function clickListener(e: MouseEvent) {
            if (transing) {
                transing = false;
                return;
            }
            rayCaster.setFromCamera(mouse, camera);
            transformControls.visible = false;
            const intersection = rayCaster.intersectObjects(scene.children);
            if (intersection.length > 0) {
                let idx = 0;
                while (idx < intersection.length && (!(intersection[idx].object instanceof Mesh) || intersection[idx].object.type === "TransformControlsPlane")) idx++;
                if (idx < intersection.length) {
                    console.log('拾取器', intersection.slice(idx));
                    const object = intersection[idx].object;
                    transformControls.attach(object);
                    transformControls.visible = true;
                }
            }
        }
        renderer.domElement.addEventListener('mousemove', moveListener);
        renderer.domElement.addEventListener('click', clickListener);
        scene.add(transformControls);
        // 为场景中pbr物件添加鼠标事件监听
        const mouseEnterListener = (mesh: Mesh) => {
            if (mesh.material instanceof MeshStandardMaterial) {
                mesh.material.emissive = new Color('rgb(10,10,0)');
            }
        }
        const mouseLeaveListener = (mesh: Mesh) => {
            if (mesh.material instanceof MeshStandardMaterial) {
                mesh.material.emissive = new Color('black');
            }
        }
        this.scene.traverse(object => {
            if (object instanceof Mesh && object.material instanceof MeshStandardMaterial) {
                object.addEventListener('mouseEnter', mouseEnterListener.bind(this, object));
                object.addEventListener('mouseLeave', mouseLeaveListener.bind(this, object));
            }
        })
        this.mouse = mouse;
        this.transformControls = transformControls;
        this.rayCaster = rayCaster;
        this.transformControlsDestroy = () => {
            document.removeEventListener('keyup', switcher);
            renderer.domElement.removeEventListener('mousemove', moveListener);
            renderer.domElement.removeEventListener('click', clickListener);
            this.scene.traverse(object => {
                if (object instanceof Mesh && object.material instanceof MeshStandardMaterial) {
                    object.removeEventListener('mouseEnter', mouseEnterListener.bind(this, object));
                    object.removeEventListener('mouseLeave', mouseLeaveListener.bind(this, object));
                }
            })
            transformControls.dispose();
        }
    }

    /**
     * 销毁变换控制器
     */
    destroyTransformControl() {
        if (this.transformControls !== null) {
            this.scene.remove(this.transformControls);
            this.transformControlsDestroy?.call(this);
            this.transformControls = null;
        }
    }

    /**
     * 向场景中添加物体
     * @param objects 物体列表
     */
    addObjects(...objects: three.Object3D[]) {
        objects.forEach(item => {
            // 不设置位置，则默认在原点(0,0,0)
            this.scene.add(item);
        })
    }

    /**
     * 移除场景中的物体
     * @param objects 物体列表
     */
    removeObjects(...objects: Object3D[]) {
        objects.forEach(item => {
            this.scene.remove(item);
        })
    }

    /**
     * 停止渲染更新，销毁对象，并移除DOM节点的挂载
     */
    destroy() {
        this.frameUpdateRunning = false;
        this.subDomElem.forEach(elem => this.dom.removeChild(elem));
        destroyPhysicsWorld(this.scene);
        this.scene.children.forEach(item => this.scene.remove(item));
        this.renderer.dispose();
        this.destroyTransformControl();
        this.datGui?.destroy();
        console.log('TEngine destroyed...');
    }

    /**
     * 添加方法到requestAnimateFrame的执行流程中
     * @param funs 要添加的方法
     */
    addFunctionToAni(...funs: Function[]) {
        this.aniFunctions.push(...funs);
    }

    /**
     * 将方法从requestAnimateFrame中移除
     * @param funs 要移除的方法
     */
    removeFunctionFromAni(...funs: Function[]) {
        this.aniFunctions = this.aniFunctions.filter(item => !funs.includes(item));
    }

    /**
     * 向场景以及场景中的所有元素应用指定的环境贴图
     * @param environmentMap 指定环境贴图
     * @param intensity 环境贴图强度
     */
    updateEnvironmentMap(environmentMap: CubeTexture, intensity?: number) {
        if (this.scene.environment !== environmentMap) {
            this.scene.background = environmentMap;
            this.scene.environment = environmentMap;
        }
        this.scene.traverse(item => {
            if (item instanceof Mesh && item.material instanceof MeshStandardMaterial) {
                // 只对Mesh物体并且位MeshStandardMaterial材质应用
                // item.material.envMapIntensity = environmentMap;
                if (intensity !== undefined) {
                    item.material.envMapIntensity = intensity;
                }
            }
        })
    }

    getDatGui() {
        if (this.datGui === null) {
            this.datGui = new dat.GUI();
        }
        return this.datGui;
    }

    getScene() {
        return this.scene;
    }

    getRenderer() {
        return this.renderer;
    }
}