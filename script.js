import * as THREE from "three";

// =====================================================
// KINGDOMS BEYOND 0.3
// RPG SYSTEM
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

scene.add(
    new THREE.HemisphereLight(
        0xffffff,
        0x444444,
        2
    )
);

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

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(
        300,
        300
    ),
    new THREE.MeshStandardMaterial({
        color: 0x3f6b35
    })
);

ground.rotation.x = -Math.PI / 2;

scene.add(ground);


// =====================================================
// WELT
// =====================================================

function createTree(x, z) {

    const tree = new THREE.Group();

    const trunk = new THREE.Mesh(
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

    const leaves = new THREE.Mesh(
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


[
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
].forEach(p => {
    createTree(p[0], p[1]);
});


function createRock(x, z) {

    const rock = new THREE.Mesh(
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
].forEach(p => {
    createRock(p[0], p[1]);
});


// =====================================================
// SPIELER / RPG DATEN
// =====================================================

const player = {

    position: new THREE.Vector3(
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

    level: 1,

    xp: 0,

    xpToNextLevel: 100,

    gold: 0,

    attackCooldown: 0,

    weapon: "Eisenschwert",

    weaponDamage: 25,

    armor: "Keine Rüstung",

    armorBonus: 0

};


// =====================================================
// INVENTAR
// =====================================================

const inventory = {

    "Heiltrank": 2,

    "Eisenschwert": 1,

    "Leder": 0,

    "Eisen": 0,

    "Goldmünze": 0

};


// =====================================================
// SPIELER-MODELL
// =====================================================

const playerMesh = new THREE.Mesh(
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

const sword = new THREE.Group();

const blade = new THREE.Mesh(
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

const handle = new THREE.Mesh(
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

        position: new THREE.Vector3(
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


    enemy.mesh = new THREE.Mesh(
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

    enemy.mesh.position.copy(
        enemy.position
    );

    scene.add(enemy.mesh);

    enemies.push(enemy);
}


createEnemy(12, 2);
createEnemy(-15, -10);
createEnemy(20, 15);
createEnemy(-20, 20);


// =====================================================
// LOOT
// =====================================================

function dropLoot(enemy) {

    const gold =
        Math.floor(
            Math.random() * 11
        ) + 5;

    player.gold += gold;

    inventory["Goldmünze"] += gold;


    const roll =
        Math.random();


    if (roll < 0.35) {

        inventory["Heiltrank"]++;

        showMessage(
            `+${gold} Gold | +1 Heiltrank`
        );

    }
    else if (roll < 0.65) {

        inventory["Leder"]++;

        showMessage(
            `+${gold} Gold | +1 Leder`
        );

    }
    else {

        inventory["Eisen"]++;

        showMessage(
            `+${gold} Gold | +1 Eisen`
        );

    }


    updateHUD();

    saveGame();
}


// =====================================================
// XP
// =====================================================

function gainXP(amount) {

    player.xp += amount;

    showMessage(
        `+${amount} XP`
    );


    while (
        player.xp >=
        player.xpToNextLevel
    ) {

        player.xp -=
            player.xpToNextLevel;

        levelUp();

    }


    updateHUD();

    saveGame();
}


function levelUp() {

    player.level++;

    player.xpToNextLevel =
        Math.floor(
            player.xpToNextLevel * 1.35
        );

    player.maxHealth += 20;

    player.health =
        player.maxHealth;

    player.weaponDamage += 3;


    showMessage(
        `LEVEL UP! Level ${player.level}`
    );

}


// =====================================================
// TOD EINES GEGNERS
// =====================================================

function killEnemy(enemy) {

    enemy.alive = false;

    enemy.mesh.rotation.z =
        Math.PI / 2;


    gainXP(50);

    dropLoot(enemy);


    setTimeout(() => {

        scene.remove(
            enemy.mesh
        );

    }, 500);

}


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
                .sub(
                    player.position
                );


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
                player.weaponDamage
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
        `-${damage}`
    );


    if (
        enemy.health <= 0
    ) {

        killEnemy(enemy);

    }

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
                .sub(
                    enemy.position
                );


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

    const reducedDamage =
        Math.max(
            1,
            damage - player.armorBonus
        );


    player.health -=
        reducedDamage;


    player.health =
        Math.max(
            player.health,
            0
        );


    updateHUD();


    showMessage(
        `-${reducedDamage} HP`
    );


    if (
        player.health <= 0
    ) {

        gameOver();

    }

}


// =====================================================
// HEILTRANK
// =====================================================

function usePotion() {

    if (
        inventory["Heiltrank"] <= 0
    ) {

        showMessage(
            "Keine Heiltränke!"
        );

        return;
    }


    if (
        player.health >=
        player.maxHealth
    ) {

        showMessage(
            "Du bist bereits voll geheilt!"
        );

        return;
    }


    inventory["Heiltrank"]--;

    player.health =
        Math.min(
            player.maxHealth,
            player.health + 40
        );


    showMessage(
        "+40 HP"
    );


    updateHUD();

    saveGame();
}


// =====================================================
// INVENTAR-FENSTER
// =====================================================

function toggleInventory() {

    let menu =
        document.getElementById(
            "inventoryMenu"
        );


    if (menu) {

        menu.remove();

        return;

    }


    menu =
        document.createElement(
            "div"
        );


    menu.id =
        "inventoryMenu";


    menu.style.position =
        "fixed";

    menu.style.left =
        "50%";

    menu.style.top =
        "50%";

    menu.style.transform =
        "translate(-50%, -50%)";

    menu.style.background =
        "rgba(10,10,10,0.95)";

    menu.style.padding =
        "30px";

    menu.style.border =
        "2px solid white";

    menu.style.color =
        "white";

    menu.style.zIndex =
        "50";

    menu.style.minWidth =
        "300px";


    let html =
        `<h2>🎒 Inventar</h2>`;

    html +=
        `<p>⭐ Level: ${player.level}</p>`;

    html +=
        `<p>⭐ XP: ${player.xp}/${player.xpToNextLevel}</p>`;

    html +=
        `<p>🪙 Gold: ${player.gold}</p>`;

    html +=
        `<p>⚔️ Waffe: ${player.weapon}</p>`;

    html +=
        `<p>🛡️ Rüstung: ${player.armor}</p>`;

    html +=
        `<hr>`;


    for (
        const item in inventory
    ) {

        html +=
            `<p>${item}: ${inventory[item]}</p>`;

    }


    html +=
        `<button id="closeInventory">Schließen</button>`;


    menu.innerHTML =
        html;


    document.body.appendChild(
        menu
    );


    document
        .getElementById(
            "closeInventory"
        )
        .onclick = () => {

            menu.remove();

        };

}


// =====================================================
// SPEICHERN
// =====================================================

function saveGame() {

    const saveData = {

        player: {

            health:
                player.health,

            maxHealth:
                player.maxHealth,

            level:
                player.level,

            xp:
                player.xp,

            xpToNextLevel:
                player.xpToNextLevel,

            gold:
                player.gold,

            weapon:
                player.weapon,

            weaponDamage:
                player.weaponDamage,

            armor:
                player.armor,

            armorBonus:
                player.armorBonus,

            x:
                player.position.x,

            y:
                player.position.y,

            z:
                player.position.z

        },

        inventory

    };


    localStorage.setItem(
        "kingdomsBeyondSave",
        JSON.stringify(
            saveData
        )
    );


    showMessage(
        "Spiel gespeichert"
    );
}


// =====================================================
// LADEN
// =====================================================

function loadGame() {

    const raw =
        localStorage.getItem(
            "kingdomsBeyondSave"
        );


    if (!raw) {

        return;

    }


    try {

        const data =
            JSON.parse(raw);


        Object.assign(
            player,
            data.player
        );


        Object.assign(
            inventory,
            data.inventory
        );


        player.position.set(
            data.player.x,
            data.player.y,
            data.player.z
        );


        playerMesh.position.copy(
            player.position
        );


        updateHUD();


        showMessage(
            "Spielstand geladen"
        );

    }
    catch (error) {

        console.error(
            "Spielstand konnte nicht geladen werden:",
            error
        );

    }

}


// =====================================================
// HUD
// =====================================================

const hud =
    document.createElement(
        "div"
    );


hud.style.position =
    "fixed";

hud.style.top =
    "20px";

hud.style.right =
    "20px";

hud.style.padding =
    "15px";

hud.style.background =
    "rgba(0,0,0,0.55)";

hud.style.color =
    "white";

hud.style.fontFamily =
    "Arial";

hud.style.zIndex =
    "20";

hud.style.lineHeight =
    "1.6";


document.body.appendChild(
    hud
);


function updateHUD() {

    hud.innerHTML = `

        ❤️ ${player.health}/${player.maxHealth}<br>

        ⭐ Level ${player.level}<br>

        XP: ${player.xp}/${player.xpToNextLevel}<br>

        🪙 ${player.gold} Gold<br>

        ⚔️ ${player.weapon}<br>

        🛡️ ${player.armor}<br>

        🎒 ${inventory["Heiltrank"]} Heiltrank

    `;


    healthBar.style.width =
        (
            player.health /
            player.maxHealth *
            100
        ) + "%";

}


const healthContainer =
    document.createElement(
        "div"
    );


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
    document.createElement(
        "div"
    );


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
// NACHRICHTEN
// =====================================================

function showMessage(text) {

    const message =
        document.createElement(
            "div"
        );


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
        "26px";

    message.style.fontWeight =
        "bold";

    message.style.textShadow =
        "2px 2px 5px black";

    message.style.zIndex =
        "80";


    document.body.appendChild(
        message
    );


    setTimeout(() => {

        message.remove();

    }, 900);

}


// =====================================================
// GAME OVER
// =====================================================

function gameOver() {

    document.exitPointerLock();


    const screen =
        document.createElement(
            "div"
        );


    screen.id =
        "gameOver";


    screen.style.position =
        "fixed";

    screen.style.inset =
        "0";

    screen.style.background =
        "rgba(0,0,0,0.85)";

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

        <button
            id="restart"
            style="
                margin-top:25px;
                padding:12px 25px;
                font-size:20px;
                cursor:pointer;
            "
        >
            Erneut versuchen
        </button>

    `;


    document.body.appendChild(
        screen
    );


    document
        .getElementById(
            "restart"
        )
        .onclick = () => {

            location.reload();

        };

}


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

            player.velocityY =
                10;

            player.onGround =
                false;

        }


        if (
            event.code === "KeyE"
        ) {

            attack();

        }


        if (
            event.code === "KeyI"
        ) {

            toggleInventory();

        }


        if (
            event.code === "KeyH"
        ) {

            usePotion();

        }


        if (
            event.code === "F5"
        ) {

            event.preventDefault();

            saveGame();

        }


        if (
            event.code === "F9"
        ) {

            loadGame();

        }

    }
);


window.addEventListener(
    "keyup",
    event => {

        keys[event.code] =
            false;

    }
);


// =====================================================
// MAUS
// =====================================================

let cameraYaw = 0;

let cameraPitch = -0.25;


document.addEventListener(
    "click",
    event => {

        if (
            event.target.id ===
            "restart"
        ) {

            return;

        }


        if (
            event.target.closest(
                "#inventoryMenu"
            )
        ) {

            return;

        }


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
            event.movementX *
            0.002;


        cameraPitch -=
            event.movementY *
            0.002;


        cameraPitch =
            THREE.MathUtils.clamp(
                cameraPitch,
                -1.2,
                0.6
            );

    }
);


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
            new THREE.Vector3(
                0,
                1,
                0
            ),
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
        player.velocityY *
        delta;


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
        target
            .clone()
            .add(offset)
    );


    camera.lookAt(
        target
    );

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
// SPIELSCHLEIFE
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


loadGame();

updateHUD();

gameLoop();
