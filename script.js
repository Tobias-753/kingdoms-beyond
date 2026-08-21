import * as THREE from "three";


// =====================================================
// KINGDOMS BEYOND 0.2
// =====================================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87ceeb);

scene.fog = new THREE.Fog(
    0x87ceeb,
    40,
    180
);


// =====================================================
// KAMERA
// =====================================================

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    500
);


// =====================================================
// RENDERER
// =====================================================

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

document.body.appendChild(renderer.domElement);


// =====================================================
// LICHT
// =====================================================

const skyLight = new THREE.HemisphereLight(
    0xffffff,
    0x444444,
    2
);

scene.add(skyLight);


const sun = new THREE.DirectionalLight(
    0xffffff,
    2
);

sun.position.set(
    50,
    80,
    30
);

scene.add(sun);


// =====================================================
// BODEN
// =====================================================

const groundGeometry =
    new THREE.PlaneGeometry(
        300,
        300
    );

const groundMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x3f6b35
    });

const ground =
    new THREE.Mesh(
        groundGeometry,
        groundMaterial
    );

ground.rotation.x =
    -Math.PI / 2;

scene.add(ground);


// =====================================================
// WELT
// =====================================================

function createTree(x, z) {

    const tree = new THREE.Group();


    const trunk =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.5,
                0.7,
                4,
                8
            ),
            new THREE.MeshStandardMaterial({
                color: 0x6b3f22
            })
        );

    trunk.position.y = 2;

    tree.add(trunk);


    const leaves =
        new THREE.Mesh(
            new THREE.ConeGeometry(
                2.5,
                6,
                8
            ),
            new THREE.MeshStandardMaterial({
                color: 0x1f5c2e
            })
        );

    leaves.position.y = 6;

    tree.add(leaves);


    tree.position.set(
        x,
        0,
        z
    );

    scene.add(tree);
}


const treePositions = [

    [-15, -15],
    [10, -20],
    [25, -5],
    [-25, 10],
    [20, 20],
    [-10, 25],
    [35, 15],
    [-35, -20],
    [5, 35],
    [-30, 30],
    [40, -15],
    [-40, 10],
    [15, 40],
    [-20, 40]

];


for (const position of treePositions) {

    createTree(
        position[0],
        position[1]
    );
}


function createRock(x, z) {

    const rock =
        new THREE.Mesh(
            new THREE.DodecahedronGeometry(
                1.5,
                0
            ),
            new THREE.MeshStandardMaterial({
                color: 0x777777
            })
        );

    rock.position.set(
        x,
        1,
        z
    );

    rock.scale.y = 0.7;

    scene.add(rock);
}


[
    [8, 8],
    [-8, -5],
    [15, 5],
    [-18, 0],
    [30, 10],
    [-30, -5],
    [5, -30],
    [-25, -30]
].forEach(position => {

    createRock(
        position[0],
        position[1]
    );
});


// =====================================================
// SPIELER
// =====================================================

const player = {

    position:
        new THREE.Vector3(
            0,
            1,
            10
        ),

    velocityY: 0,

    speed: 7,

    runningSpeed: 13,

    onGround: true,

    health: 100,

    maxHealth: 100,

    attackCooldown: 0

};


const playerMesh =
    new THREE.Mesh(
        new THREE.CapsuleGeometry(
            0.5,
            1.2,
            4,
            8
        ),
        new THREE.MeshStandardMaterial({
            color: 0xeeeeee
        })
    );

playerMesh.position.copy(
    player.position
);

scene.add(playerMesh);


// =====================================================
// SCHWERT
// =====================================================

const sword =
    new THREE.Group();


const blade =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            0.15,
            2.4,
            0.35
        ),
        new THREE.MeshStandardMaterial({
            color: 0xcfd8dc,
            metalness: 0.8
        })
    );

blade.position.y = 1.3;

sword.add(blade);


const handle =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            0.2,
            0.8,
            0.2
        ),
        new THREE.MeshStandardMaterial({
            color: 0x5d4037
        })
    );

handle.position.y = -0.3;

sword.add(handle);


sword.position.set(
    0.8,
    1,
    0
);

playerMesh.add(sword);


// =====================================================
// GEGNER
// =====================================================

const enemies = [];


function createEnemy(x, z) {

    const enemy = {

        position:
            new THREE.Vector3(
                x,
                1,
                z
            ),

        health: 50,

        maxHealth: 50,

        speed: 2.2,

        alive: true,

        attackCooldown: 0,

        mesh: null

    };


    const body =
        new THREE.Mesh(
            new THREE.CapsuleGeometry(
                0.6,
                1.4,
                4,
                8
            ),
            new THREE.MeshStandardMaterial({
                color: 0x8b2020
            })
        );


    body.position.copy(
        enemy.position
    );


    scene.add(body);

    enemy.mesh = body;


    enemies.push(enemy);
}


createEnemy(12, 2);
createEnemy(-15, -10);
createEnemy(20, 15);
createEnemy(-20, 20);


// =====================================================
// TASTATUR
// =====================================================

const keys = {};


window.addEventListener(
    "keydown",
    event => {

        keys[event.code] = true;


        if (
            event.code === "Space" &&
            player.onGround
        ) {

            player.velocityY = 10;

            player.onGround = false;
        }


        if (
            event.code === "KeyE"
        ) {

            attack();
        }

    }
);


window.addEventListener(
    "keyup",
    event => {

        keys[event.code] = false;

    }
);


// =====================================================
// MAUS
// =====================================================

let cameraYaw = 0;

let cameraPitch = -0.25;


document.addEventListener(
    "click",
    () => {

        document.body.requestPointerLock();

    }
);


document.addEventListener(
    "mousemove",
    event => {

        if (
            document.pointerLockElement !==
            document.body
        ) {

            return;
        }


        cameraYaw -=
            event.movementX * 0.002;


        cameraPitch -=
            event.movementY * 0.002;


        cameraPitch =
            THREE.MathUtils.clamp(
                cameraPitch,
                -1.2,
                0.6
            );

    }
);


// =====================================================
// KAMPF
// =====================================================

function attack() {

    if (
        player.attackCooldown > 0
    ) {

        return;
    }


    player.attackCooldown =
        0.55;


    sword.rotation.z =
        -Math.PI / 2;


    setTimeout(() => {

        sword.rotation.z = 0;

    }, 180);


    const attackDirection =
        new THREE.Vector3(
            0,
            0,
            -1
        );


    attackDirection.applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        cameraYaw
    );


    for (
        const enemy of enemies
    ) {

        if (!enemy.alive) {

            continue;
        }


        const difference =
            enemy.position
                .clone()
                .sub(player.position);


        const distance =
            difference.length();


        if (distance > 4) {

            continue;
        }


        difference.normalize();


        const dot =
            attackDirection.dot(
                difference
            );


        if (dot > 0.25) {

            damageEnemy(
                enemy,
                25
            );

        }

    }

}


function damageEnemy(
    enemy,
    damage
) {

    enemy.health -= damage;


    showMessage(
        "-" + damage
    );


    if (
        enemy.health <= 0
    ) {

        killEnemy(enemy);

    }

}


// =====================================================
// GEGNER BESIEGT
// =====================================================

function killEnemy(enemy) {

    enemy.alive = false;


    enemy.mesh.rotation.z =
        Math.PI / 2;


    setTimeout(() => {

        scene.remove(
            enemy.mesh
        );

    }, 500);


    showMessage(
        "Gegner besiegt!"
    );

}


// =====================================================
// GEGNER-KI
// =====================================================

function updateEnemies(delta) {

    for (
        const enemy of enemies
    ) {

        if (!enemy.alive) {

            continue;
        }


        const direction =
            player.position
                .clone()
                .sub(enemy.position);


        const distance =
            direction.length();


        if (distance > 2.2) {

            direction.normalize();


            enemy.position.x +=
                direction.x *
                enemy.speed *
                delta;


            enemy.position.z +=
                direction.z *
                enemy.speed *
                delta;


            enemy.mesh.lookAt(
                player.position.x,
                enemy.mesh.position.y,
                player.position.z
            );

        }
        else {

            enemy.attackCooldown -=
                delta;


            if (
                enemy.attackCooldown <= 0
            ) {

                damagePlayer(10);

                enemy.attackCooldown =
                    1.5;

            }

        }


        enemy.mesh.position.copy(
            enemy.position
        );

    }

}


// =====================================================
// SPIELER SCHADEN
// =====================================================

function damagePlayer(
    damage
) {

    player.health -= damage;


    player.health =
        Math.max(
            player.health,
            0
        );


    updateHealthBar();


    showMessage(
        "-" + damage
    );


    if (
        player.health <= 0
    ) {

        gameOver();

    }

}


// =====================================================
// SPIELER BEWEGUNG
// =====================================================

function updatePlayer(delta) {

    const direction =
        new THREE.Vector3();


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


    if (
        direction.length() > 0
    ) {

        direction.normalize();


        direction.applyAxisAngle(
            new THREE.Vector3(0, 1, 0),
            cameraYaw
        );


        const speed =
            keys["ShiftLeft"] ||
            keys["ShiftRight"]
                ? player.runningSpeed
                : player.speed;


        player.position.x +=
            direction.x *
            speed *
            delta;


        player.position.z +=
            direction.z *
            speed *
            delta;

    }


    player.velocityY -=
        25 * delta;


    player.position.y +=
        player.velocityY * delta;


    if (
        player.position.y <= 1
    ) {

        player.position.y = 1;

        player.velocityY = 0;

        player.onGround = true;

    }


    playerMesh.position.copy(
        player.position
    );

}


// =====================================================
// KAMERA
// =====================================================

function updateCamera() {

    const target =
        player.position.clone();


    target.y += 1;


    const offset =
        new THREE.Vector3(
            0,
            2,
            8
        );


    offset.applyEuler(
        new THREE.Euler(
            cameraPitch,
            cameraYaw,
            0,
            "YXZ"
        )
    );


    camera.position.copy(
        target.clone().add(offset)
    );


    camera.lookAt(target);

}


// =====================================================
// HUD
// =====================================================

const healthContainer =
    document.createElement("div");


healthContainer.style.position =
    "fixed";

healthContainer.style.bottom =
    "25px";

healthContainer.style.left =
    "25px";

healthContainer.style.width =
    "250px";

healthContainer.style.height =
    "25px";

healthContainer.style.border =
    "2px solid white";

healthContainer.style.background =
    "rgba(0,0,0,0.5)";

healthContainer.style.zIndex =
    "20";


const healthBar =
    document.createElement("div");


healthBar.style.width =
    "100%";

healthBar.style.height =
    "100%";

healthBar.style.background =
    "#d62828";


healthContainer.appendChild(
    healthBar
);

document.body.appendChild(
    healthContainer
);


// =====================================================
// AUSDAUER
// =====================================================

const healthText =
    document.createElement("div");


healthText.style.position =
    "fixed";

healthText.style.bottom =
    "55px";

healthText.style.left =
    "25px";

healthText.style.color =
    "white";

healthText.style.zIndex =
    "20";

healthText.style.fontWeight =
    "bold";

document.body.appendChild(
    healthText
);


function updateHealthBar() {

    const percentage =
        player.health /
        player.maxHealth *
        100;


    healthBar.style.width =
        percentage + "%";


    healthText.textContent =
        "❤️ " +
        player.health +
        " / " +
        player.maxHealth;

}


updateHealthBar();


// =====================================================
// NACHRICHTEN
// =====================================================

function showMessage(text) {

    const message =
        document.createElement("div");


    message.textContent =
        text;


    message.style.position =
        "fixed";

    message.style.left =
        "50%";

    message.style.top =
        "40%";

    message.style.transform =
        "translate(-50%, -50%)";

    message.style.color =
        "white";

    message.style.fontSize =
        "28px";

    message.style.fontWeight =
        "bold";

    message.style.textShadow =
        "2px 2px 5px black";

    message.style.zIndex =
        "30";


    document.body.appendChild(
        message
    );


    setTimeout(() => {

        message.remove();

    }, 500);

}


// =====================================================
// GAME OVER
// =====================================================

function gameOver() {

    const screen =
        document.createElement("div");


    screen.style.position =
        "fixed";

    screen.style.inset =
        "0";

    screen.style.background =
        "rgba(0,0,0,0.8)";

    screen.style.display =
        "flex";

    screen.style.flexDirection =
        "column";

    screen.style.alignItems =
        "center";

    screen.style.justifyContent =
        "center";

    screen.style.color =
        "white";

    screen.style.fontSize =
        "40px";

    screen.style.zIndex =
        "100";


    screen.innerHTML = `
        <div>DU BIST GEFALLEN</div>
        <button id="restart">
            Erneut versuchen
        </button>
    `;


    document.body.appendChild(
        screen
    );


    document
        .getElementById("restart")
        .onclick = () => {

            location.reload();

        };

}


// =====================================================
// FENSTERGRÖSSE
// =====================================================

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;


        camera.updateProjectionMatrix();


        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

    }
);


// =====================================================
// GAME LOOP
// =====================================================

const clock =
    new THREE.Clock();


function gameLoop() {

    requestAnimationFrame(
        gameLoop
    );


    const delta =
        Math.min(
            clock.getDelta(),
            0.05
        );


    if (
        player.attackCooldown > 0
    ) {

        player.attackCooldown -=
            delta;

    }


    updatePlayer(delta);

    updateEnemies(delta);

    updateCamera();


    renderer.render(
        scene,
        camera
    );

}


gameLoop();
