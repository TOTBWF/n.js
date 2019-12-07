let renderer, camera, controls, scene;

function init() {
    let canvas = document.getElementById("canvas");
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: canvas });
    scene = new THREE.Scene();

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    let ambient = new THREE.AmbientLight(0xffffff, 0.5);
    let point = new THREE.PointLight(0xffffff);
    scene.add(ambient);
    scene.add(point);
    let sphere = twoSphere(1, 5, 20)
    sphere.forEach(base => scene.add(renderFiber(fiber(base), base)))
    camera.position.z = 5;
    animate()
}

function animate() {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
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

function renderFiber(points, base) {
    let geometry = new THREE.Geometry()
    geometry.vertices = points
    let color = new THREE.Color().setHSL(base.x, 1, -0.2*base.z + 0.3)
    let material = new THREE.LineBasicMaterial({
        color: color,
        opacity: (1/(1 + base.z))
    })
    return new THREE.LineLoop(geometry, material)
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

init()
