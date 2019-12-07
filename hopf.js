let spherePoints = twoSphere(1, 5, 30)

function initScene(canvas) {
    let camera = new THREE.PerspectiveCamera(75, canvas.width/canvas.height, 0.1, 1000);
    let renderer = new THREE.WebGLRenderer({ canvas: canvas });

    let scene = new THREE.Scene();
    let controls = new THREE.OrbitControls(camera, renderer.domElement);
    return {camera, renderer, scene, controls, }
}

function majorScene() {
    let canvas = document.getElementById("major");
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    let { camera, renderer, scene, controls } = initScene(canvas)

    let ambient = new THREE.AmbientLight(0xffffff, 0.5);
    let point = new THREE.PointLight(0xffffff);
    scene.add(ambient);
    scene.add(point);

    spherePoints.forEach(base => scene.add(renderFiber(fiber(base), base)))
    camera.position.z = 5;
    camera.rotation.x = Math.PI/2
    let animate = () => {
        requestAnimationFrame(animate)
        controls.update()
        renderer.render(scene, camera)
    }
    animate()
}

function minorScene() {
    let canvas = document.getElementById("minor");
    canvas.width = 150;
    canvas.height = 150;
    let { camera, renderer, scene, controls } = initScene(canvas)

    let geometry = new THREE.SphereBufferGeometry(1, 64, 32);
    let material = new THREE.MeshLambertMaterial({color: 0x444444, transparent: true, opacity: 0.5});
    let sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    spherePoints.forEach(base => scene.add(renderPoint(base)))

    let ambient = new THREE.AmbientLight(0xffffff);
    scene.add(ambient);

    camera.position.z = 2;
    let animate = () => {
        requestAnimationFrame(animate)
        controls.update()
        renderer.render(scene, camera)
    }
    animate()
}



// Discreet fibers of the hopf fibration
function fiber(base) {
    let alpha = Math.sqrt((1 + base.z)/2)
    let beta = Math.sqrt((1 - base.z)/2)
    let points = []
    let point = new THREE.Vector3()
    for (let phi = 0; phi <= Math.PI * 2; phi += (2 * Math.PI/256)) {
        let theta = Math.atan2(base.y, -base.x) - phi
        let w = alpha * Math.cos(theta)
        point.x = alpha * Math.sin(theta)
        point.y = beta * Math.cos(phi)
        point.z = beta * Math.sin(phi)

        point.multiplyScalar(1/(1 - w))

        points.push(point.clone())
    }
    return points
}

function colorize(base) {
    let color = new THREE.Color().setHSL(base.x, 1, -0.2*base.z + 0.3)
    let opacity = (1/(1 + base.z))
    return { color, opacity }
}

function renderFiber(points, base) {
    let geometry = new THREE.Geometry()
    geometry.vertices = points
    let { color, opacity } = colorize(base)
    let material = new THREE.LineBasicMaterial({
        color,
        opacity
    })
    return new THREE.LineLoop(geometry, material)
}

function renderPoint(base) {
    let geometry = new THREE.SphereBufferGeometry(0.02, 32, 16)
    let { color, opacity } = colorize(base)
    let material = new THREE.MeshBasicMaterial({ color, opacity })
    let mesh = new THREE.Mesh(geometry, material)
    mesh.position.copy(base)
    return mesh
}

function twoSphere(radius, xSegments, ySegments) {
    let vertices = []
    let vertex = new THREE.Vector3()
    for (let ix = 0; ix <= xSegments; ix++) {
        for (let iy = 0; iy <= ySegments; iy++) {
                let theta = (ix/xSegments) * Math.PI
                let phi = (iy/ySegments) * 2 * Math.PI
                vertex.x = radius * Math.sin(theta) * Math.cos(phi)
                vertex.y = radius * Math.sin(theta) * Math.sin(phi)
                vertex.z = radius * Math.cos(theta)
                vertices.push(vertex.clone());
        }
    }
    return vertices
}

majorScene()
minorScene()
