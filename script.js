import * as THREE from "three";


// ==========================================
// GRUNDLAGEN
// ==========================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.Fog(0x87ceeb, 40, 180);


const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    500
);


const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

document.body.appendChild(renderer.domElement);


// ==========================================
// LICHT
// ==========================================

const ambientLight = new THREE.HemisphereLight(
    0xffffff,
    0x444444,
    2
);

scene.add(ambientLight);


const sun = new THREE.DirectionalLight(
    0xffffff,
    2
);

sun.position.set(50, 80, 30);

scene.add(sun);


// ==========================================
// BODEN
// ==========================================

const groundGeometry = new THREE.PlaneGeometry(
    300,
    300
);

const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x3f6b35
});

const ground = new THREE.Mesh(
    groundGeometry,
    groundMaterial
);

ground.rotation.x = -Math.PI / 2;

scene.add(ground);


// ==========================================
// BÄUME
// ==========================================

function createTree(x, z) {

    const tree = new THREE.Group();


    // Stamm

    const trunkGeometry = new THREE.CylinderGeometry(
        0.5,
        0.7,
        4,
        8
    );

    const trunkMaterial = new THREE.MeshStandardMaterial({
        color: 0x6b3f22
    });

    const trunk = new THREE.Mesh(
        trunkGeometry,
        trunkMaterial
    );

    trunk.position.y = 2;

    tree.add(trunk);


    // Baumkrone

    const leavesGeometry = new THREE.ConeGeometry(
        2.5,
        6,
        8
    );

    const leavesMaterial = new THREE.MeshStandardMaterial({
        color: 0x1f5c2e
    });

    const leaves = new THREE.Mesh(
        leavesGeometry,
        leavesMaterial
    );

    leaves.position.y = 6;

    tree.add(leaves);


    tree.position.set(x, 0, z);

    scene.add(tree);
}


// Bäume verteilen

const trees = [
    [-15, -15],
    [10, -20],
    [25, -5],
    [-25, 10],
    [20, 20],
    [-10, 25],
    [35, 15],
    [-35, -20],
    [5, 35],
    [-30, 30]
];

for (const [x, z] of trees) {
    createTree(x, z);
}


// ==========================================
// FELSEN
// ==========================================

function createRock(x, z) {

    const geometry = new THREE.DodecahedronGeometry(
        1.5,
        0
    );

    const material = new THREE.MeshStandardMaterial({
        color: 0x777777
    });

    const rock = new THREE.Mesh(
        geometry,
        material
    );

    rock.position.set(x, 1, z);

    rock.scale.y = 0.7;

    scene.add(rock);
}


createRock(8, 8);
createRock(-8, -5);
createRock(15, 5);
createRock(-18, 0);


// ==========================================
// SPIELER
// ==========================================

const player = {
    position: new THREE.Vector3(0, 1, 10),

    velocityY: 0,

    speed: 7,

    runningSpeed: 13,

    onGround: true
};


// einfache sichtbare Spielfigur

const playerGeometry = new THREE.CapsuleGeometry(
    0.5,
    1.2,
    4,
    8
);

const playerMaterial = new THREE.MeshStandardMaterial({
    color: 0xeeeeee
});

const playerMesh = new THREE.Mesh(
    playerGeometry,
    playerMaterial
);

playerMesh.position.copy(player.position);

scene.add(playerMesh);


// ==========================================
// TASTATUR
// ==========================================

const keys = {};

window.addEventListener("keydown", (event) => {

    keys[event.code] = true;


    if (
        event.code === "Space" &&
        player.onGround
    ) {

        player.velocityY = 10;

        player.onGround = false;
    }
});


window.addEventListener("keyup", (event) => {

    keys[event.code] = false;
});


// ==========================================
// MAUS-KAMERA
// ==========================================

let cameraYaw = 0;
let cameraPitch = -0.25;

document.addEventListener("click", () => {

    document.body.requestPointerLock();
});


document.addEventListener("mousemove", (event) => {

    if (document.pointerLockElement !== document.body) {
        return;
    }


    cameraYaw -= event.movementX * 0.002;

    cameraPitch -= event.movementY * 0.002;


    cameraPitch = THREE.MathUtils.clamp(
        cameraPitch,
        -1.2,
        0.6
    );
});


// ==========================================
// SPIELER-BEWEGUNG
// ==========================================

function updatePlayer(delta) {

    const direction = new THREE.Vector3();


    if (keys["KeyW"]) {
        direction.z -= 1;
    }

    if (keys["KeyS"]) {
        direction.z += 1;
    }

    if (keys["KeyA"]) {
        direction.x -= 1;
    }

    if (keys["KeyD"]) {
        direction.x += 1;
    }


    if (direction.length() > 0) {

        direction.normalize();

        direction.applyAxisAngle(
            new THREE.Vector3(0, 1, 0),
            cameraYaw
        );


        const speed =
            keys["ShiftLeft"] || keys["ShiftRight"]
                ? player.runningSpeed
                : player.speed;


        player.position.x +=
            direction.x * speed * delta;

        player.position.z +=
            direction.z * speed * delta;
    }


    // Schwerkraft

    player.velocityY -= 25 * delta;

    player.position.y +=
        player.velocityY * delta;


    // Boden

    if (player.position.y <= 1) {

        player.position.y = 1;

        player.velocityY = 0;

        player.onGround = true;
    }


    playerMesh.position.copy(
        player.position
    );
}


// ==========================================
// KAMERA
// ==========================================

function updateCamera() {

    const distance = 8;


    const target = player.position.clone();

    target.y += 1;


    const offset = new THREE.Vector3(
        0,
        2,
        distance
    );


    const rotation = new THREE.Euler(
        cameraPitch,
        cameraYaw,
        0,
        "YXZ"
    );


    offset.applyEuler(rotation);


    camera.position.copy(
        target.clone().add(offset)
    );


    camera.lookAt(target);
}


// ==========================================
// FENSTERGRÖSSE
// ==========================================

window.addEventListener("resize", () => {

    camera.aspect =
        window.innerWidth /
        window.innerHeight;

    camera.updateProjectionMatrix();


    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
});


// ==========================================
// SPIELSCHLEIFE
// ==========================================

const clock = new THREE.Clock();


function gameLoop() {

    requestAnimationFrame(gameLoop);


    const delta = Math.min(
        clock.getDelta(),
        0.05
    );


    updatePlayer(delta);

    updateCamera();


    renderer.render(
        scene,
        camera
    );
}


gameLoop();
