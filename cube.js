function initScene() {
    let canvas = document.getElementById("c")
    canvas.width = document.body.clientWidth
    canvas.height = document.body.clientHeight

    let camera = new THREE.PerspectiveCamera(75, canvas.width/canvas.height, 0.1, 1000)
    let renderer = new THREE.WebGLRenderer({ canvas: canvas })
    let labelRenderer = new THREE.CSS2DRenderer()
    labelRenderer.domElement.style.position = 'absolute'
    labelRenderer.domElement.style.top = 0
    labelRenderer.domElement.style.left = 0
    document.body.appendChild(labelRenderer.domElement)
    let scene = new THREE.Scene()

    let geometry = new THREE.BoxGeometry(2, 2, 2)
    let edges = new THREE.EdgesGeometry(geometry)
    let material = new THREE.MeshBasicMaterial({ color: 0xffffff })

    let cube = new THREE.LineSegments(edges, material)
    scene.add(cube)

    camera.position.set(0, 0, 3)

    let edgeLabels = [
        //////////////////////////////////
        { label: "p",        k: 0, j: 0 },
        { label: "refl",     k: 0, j: 1 },
        { label: "p⁻¹",      k: 0, i: 1 },
        { label: "refl",     k: 0, i: 0 },
        //////////////////////////////////
        { label: "refl",     i: 0, j: 0 },
        { label: "refl",     i: 0, j: 1 },
        //////////////////////////////////
        { label: "refl",     i: 1, j: 0 },
        { label: "p",        i: 1, j: 1 },
        //////////////////////////////////
        { label: "refl",     k: 1, i: 0 },
        { label: "refl",     k: 1, i: 1 },
        { label: "p",        k: 1, j: 0 },
        { label: "refl ∙ p", k: 1, j: 1 },
    ]

    for (var l = 0; l < edgeLabels.length; l++) {
        let label = makeLabel(edgeLabels[l].label)
        cube.add(label)
        console.log(label)

        let axis = (key) => {
            let v = edgeLabels[l][key]
            if (v === 1) {
                return 1
            } else if (v === 0) {
                return -1
            } else {
                return 0
            }
        }
        label.position.set(axis('i'), axis('k'), axis('j'))
    }

    let axesHelper = new THREE.AxesHelper(0.5)
    cube.add(axesHelper)


    let animate = () => {
        requestAnimationFrame(animate)

        labelRenderer.setSize(canvas.width, canvas.height)

        renderer.render(scene, camera)
        labelRenderer.render(scene, camera);

        cube.rotation.y += 0.01
        cube.rotation.z += 0.01
    }
    animate()
}

function makeLabel(label) {
    let labelDiv = document.createElement('div')
    labelDiv.className = 'label'
    labelDiv.textContent = label
    labelDiv.style.color = 0xffffff
    labelDiv.style.marginTop = '-1em'
    return new THREE.CSS2DObject(labelDiv)
}

initScene()
