import * as THREE from "three";

// =====================================================
// KINGDOMS BEYOND 0.5
// CHARACTER + COMBAT + ENEMY HEALTH BARS + WORLD
// =====================================================

// =====================================================
// SZENE
// =====================================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87ceeb);

scene.fog = new THREE.Fog(
    0x87ceeb,
    45,
    190
);

// =====================================================
// KAMERA
// =====================================================

const camera = new THREE.PerspectiveCamera(
    70,
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
        0x405040,
        2.2
    )
);

const sun = new THREE.DirectionalLight(
    0xffffff,
    2.5
);

sun.position.set(
    40,
    80,
    30
);

scene.add(sun);

// =====================================================
// BODEN
// =====================================================

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(
        320,
        320
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

function createTree(x, z, scale = 1) {

    const tree = new THREE.Group();

    const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.45,
            0.65,
            4,
            8
        ),
        new THREE.MeshStandardMaterial({
            color: 0x654321
        })
    );

    trunk.position.y = 2;

    tree.add(trunk);

    const leaves = new THREE.Mesh(
        new THREE.ConeGeometry(
            2.6,
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

    tree.scale.setScalar(scale);

    scene.add(tree);
}

[
    [-15, -15, 1],
    [10, -20, 1.1],
    [25, -5, 0.9],
    [-25, 10, 1.2],
    [20, 20, 1],
    [-10, 25, 1.1],
    [35, 15, 1],
    [-35, -20, 1.2],
    [5, 35, 0.9],
    [-30, 30, 1],
    [40, -15, 1.2],
    [-40, 10, 1],
    [15, 40, 1],
    [-20, 40, 1.2]
].forEach(p => {
    createTree(p[0], p[1], p[2]);
});

function createRock(x, z, scale = 1) {

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

    rock.scale.setScalar(scale);

    rock.scale.y *= 0.7;

    scene.add(rock);
}

[
    [8, 8, 1],
    [-8, -5, 0.8],
    [15, 5, 1.2],
    [-18, 0, 1],
    [30, 10, 1.3],
    [-30, -5, 1],
    [5, -30, 0.8],
    [-25, -30, 1.2]
].forEach(p => {
    createRock(p[0], p[1], p[2]);
});

// =====================================================
// RUINEN
// =====================================================

function createRuin(x, z) {

    const ruin = new THREE.Group();

    for (let i = 0; i < 4; i++) {

        const wall = new THREE.Mesh(
            new THREE.BoxGeometry(
                2,
                5,
                1
            ),
            new THREE.MeshStandardMaterial({
                color: 0x77716a
            })
        );

        wall.position.set(
            (i - 1.5) * 3,
            2.5,
            0
        );

        ruin.add(wall);
    }

    const entrance = new THREE.Mesh(
        new THREE.BoxGeometry(
            3,
            4,
            1.2
        ),
        new THREE.MeshStandardMaterial({
            color: 0x625c55
        })
    );

    entrance.position.set(
        0,
        2,
        -2
    );

    ruin.add(entrance);

    ruin.position.set(
        x,
        0,
        z
    );

    scene.add(ruin);
}

createRuin(
    -55,
    -45
);

// =====================================================
// TRUHEN
// =====================================================

function createChest(x, z) {

    const chest = new THREE.Group();

    const body = new THREE.Mesh(
        new THREE.BoxGeometry(
            1.8,
            1,
            1.2
        ),
        new THREE.MeshStandardMaterial({
            color: 0x6b3f20
        })
    );

    body.position.y = 0.5;

    chest.add(body);

    const lid = new THREE.Mesh(
        new THREE.BoxGeometry(
            1.9,
            0.25,
            1.3
        ),
        new THREE.MeshStandardMaterial({
            color: 0xc28b32
        })
    );

    lid.position.y = 1.05;

    chest.add(lid);

    chest.position.set(
        x,
        0,
        z
    );

    scene.add(chest);
}

createChest(
    18,
    -12
);

// =====================================================
// SPIELERDATEN
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

    weaponDamage: 25,

    attackCooldown: 0,

    attacking: false

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
// CHARAKTER
// =====================================================

const playerMesh = new THREE.Group();

scene.add(playerMesh);

function createCharacter() {

    // Beine
    const legMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x26364a
        });

    const leftLeg = new THREE.Mesh(
        new THREE.BoxGeometry(
            0.32,
            1.2,
            0.32
        ),
        legMaterial
    );

    leftLeg.position.set(
        -0.22,
        0.6,
        0
    );

    playerMesh.add(leftLeg);

    const rightLeg = new THREE.Mesh(
        new THREE.BoxGeometry(
            0.32,
            1.2,
            0.32
        ),
        legMaterial
    );

    rightLeg.position.set(
        0.22,
        0.6,
        0
    );

    playerMesh.add(rightLeg);

    // Körper
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(
            0.85,
            1.25,
            0.5
        ),
        new THREE.MeshStandardMaterial({
            color: 0x385b82
        })
    );

    body.position.y = 1.65;

    playerMesh.add(body);

    // Kopf
    const head = new THREE.Mesh(
        new THREE.SphereGeometry(
            0.42,
            16,
            16
        ),
        new THREE.MeshStandardMaterial({
            color: 0xd5a77a
        })
    );

    head.position.y = 2.55;

    playerMesh.add(head);

    // Haare
    const hair = new THREE.Mesh(
        new THREE.SphereGeometry(
            0.44,
            16,
            8,
            0,
            Math.PI * 2,
            0,
            Math.PI / 2
        ),
        new THREE.MeshStandardMaterial({
            color: 0x2a1b12
        })
    );

    hair.position.y = 2.7;

    playerMesh.add(hair);

    // Arme
    const armMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x385b82
        });

    const leftArm = new THREE.Mesh(
        new THREE.BoxGeometry(
            0.25,
            1,
            0.25
        ),
        armMaterial
    );

    leftArm.position.set(
        -0.6,
        1.7,
        0
    );

    leftArm.rotation.z = 0.12;

    playerMesh.add(leftArm);

    const rightArm = new THREE.Mesh(
        new THREE.BoxGeometry(
            0.25,
            1,
            0.25
        ),
        armMaterial
    );

    rightArm.position.set(
        0.6,
        1.7,
        0
    );

    rightArm.rotation.z = -0.12;

    playerMesh.add(rightArm);

    return {
        leftArm,
        rightArm
    };
}

const characterParts =
    createCharacter();

playerMesh.position.copy(
    player.position
);

// =====================================================
// SCHWERT
// =====================================================

const sword = new THREE.Group();

const blade = new THREE.Mesh(
    new THREE.BoxGeometry(
        0.12,
        2.4,
        0.28
    ),
    new THREE.MeshStandardMaterial({
        color: 0xd5d9dc,
        metalness: 0.85,
        roughness: 0.2
    })
);

// Das Schwert zeigt nach vorne
blade.position.y = 1.25;

sword.add(blade);

const guard = new THREE.Mesh(
    new THREE.BoxGeometry(
        0.8,
        0.12,
        0.15
    ),
    new THREE.MeshStandardMaterial({
        color: 0xc28b32,
        metalness: 0.6
    })
);

guard.position.y = 0;

sword.add(guard);

const handle = new THREE.Mesh(
    new THREE.BoxGeometry(
        0.16,
        0.7,
        0.16
    ),
    new THREE.MeshStandardMaterial({
        color: 0x4b2e1d
    })
);

handle.position.y = -0.35;

sword.add(handle);

// Schwert in rechter Hand
sword.position.set(
    0.72,
    1.35,
    -0.15
);

// Drehung so, dass die Klinge nach vorne zeigt
sword.rotation.x = Math.PI / 2;

characterParts.rightArm.add(
    sword
);

// =====================================================
// GEGNERTYPEN
// =====================================================

const enemyTypes = {

    grunt: {
        name: "Grunt",
        health: 50,
        speed: 2.2,
        damage: 10,
        xp: 50,
        goldMin: 5,
        goldMax: 15,
        color: 0x8b2020,
        scale: 1
    },

    runner: {
        name: "Runner",
        health: 35,
        speed: 4.2,
        damage: 7,
        xp: 65,
        goldMin: 7,
        goldMax: 18,
        color: 0xc45b20,
        scale: 0.85
    },

    tank: {
        name: "Tank",
        health: 120,
        speed: 1.2,
        damage: 18,
        xp: 110,
        goldMin: 12,
        goldMax: 25,
        color: 0x444466,
        scale: 1.3
    },

    elite: {
        name: "Elite",
        health: 220,
        speed: 2,
        damage: 25,
        xp: 250,
        goldMin: 30,
        goldMax: 60,
        color: 0x8e44ad,
        scale: 1.5
    },

    boss: {
        name: "Schattenwächter",
        health: 600,
        speed: 1.4,
        damage: 35,
        xp: 700,
        goldMin: 100,
        goldMax: 200,
        color: 0x17122b,
        scale: 2.2
    }
};

// =====================================================
// ENEMIES
// =====================================================

const enemies = [];

const MAX_ENEMIES = 6;

const spawnPoints = [
    [12, 2],
    [-15, -10],
    [20, 15],
    [-20, 20],
    [30, -15],
    [-30, 15],
    [35, 30],
    [-35, -30]
];

function createEnemyHealthBar(enemy) {

    const container =
        document.createElement("div");

    container.style.position = "fixed";
    container.style.width = "70px";
    container.style.height = "8px";
    container.style.background =
        "rgba(0,0,0,0.75)";
    container.style.border =
        "1px solid white";
    container.style.zIndex = "15";
    container.style.pointerEvents =
        "none";

    const bar =
        document.createElement("div");

    bar.style.width = "100%";
    bar.style.height = "100%";
    bar.style.background = "#d62828";

    container.appendChild(bar);

    document.body.appendChild(
        container
    );

    enemy.healthBarContainer =
        container;

    enemy.healthBar =
        bar;
}

function updateEnemyHealthBar(enemy) {

    if (
        !enemy.alive ||
        !enemy.healthBarContainer
    ) {

        return;
    }

    const position =
        enemy.position.clone();

    position.y +=
        enemy.scale * 2.4;

    position.project(camera);

    const x =
        (position.x * 0.5 + 0.5) *
        window.innerWidth;

    const y =
        (-position.y * 0.5 + 0.5) *
        window.innerHeight;

    enemy.healthBarContainer.style.left =
        `${x - 35}px`;

    enemy.healthBarContainer.style.top =
        `${y}px`;

    enemy.healthBar.style.width =
        `${Math.max(
            0,
            enemy.health /
            enemy.maxHealth *
            100
        )}%`;
}

function chooseEnemyType() {

    const roll =
        Math.random();

    if (
        player.level >= 3 &&
        roll < 0.08
    ) {

        return "elite";
    }

    if (roll < 0.25) {
        return "runner";
    }

    if (roll < 0.42) {
        return "tank";
    }

    return "grunt";
}

function spawnEnemy(typeName = null) {

    if (
        enemies.filter(e => e.alive)
            .length >= MAX_ENEMIES
    ) {

        return;
    }

    const type =
        typeName || chooseEnemyType();

    const data =
        enemyTypes[type];

    const spawn =
        spawnPoints[
            Math.floor(
                Math.random() *
                spawnPoints.length
            )
        ];

    const multiplier =
        1 +
        (player.level - 1) *
        0.08;

    const enemy = {

        type,

        name: data.name,

        position:
            new THREE.Vector3(
                spawn[0],
                data.scale,
                spawn[1]
            ),

        health:
            Math.floor(
                data.health *
                multiplier
            ),

        maxHealth:
            Math.floor(
                data.health *
                multiplier
            ),

        speed: data.speed,

        damage:
            Math.floor(
                data.damage *
                multiplier
            ),

        xp:
            Math.floor(
                data.xp *
                multiplier
            ),

        goldMin:
            data.goldMin,

        goldMax:
            data.goldMax,

        scale: data.scale,

        alive: true,

        attackCooldown: 0,

        respawnTimer: 15,

        mesh: null,

        healthBarContainer: null,

        healthBar: null
    };

    enemy.mesh =
        new THREE.Mesh(
            new THREE.CapsuleGeometry(
                0.6,
                1.4,
                6,
                10
            ),
            new THREE.MeshStandardMaterial({
                color: data.color
            })
        );

    enemy.mesh.scale.setScalar(
        data.scale
    );

    enemy.mesh.position.copy(
        enemy.position
    );

    scene.add(
        enemy.mesh
    );

    createEnemyHealthBar(
        enemy
    );

    enemies.push(
        enemy
    );

    if (type === "elite") {

        showMessage(
            "👑 EIN ELITE-GEGNER IST ERSCHIENEN!"
        );
    }
}

// Startgegner
spawnEnemy("grunt");
spawnEnemy("grunt");
spawnEnemy("runner");
spawnEnemy("tank");

// =====================================================
// BOSS
// =====================================================

let bossSpawned = false;

function spawnBoss() {

    if (bossSpawned) {
        return;
    }

    bossSpawned = true;

    const boss =
        spawnEnemy("boss");

    showMessage(
        "👑 DER SCHATTENWÄCHTER IST ERWACHT!"
    );
}

// Boss später über Level 5
function checkBoss() {

    if (
        player.level >= 5 &&
        !bossSpawned
    ) {

        spawnBoss();
    }
}

// =====================================================
// LOOT
// =====================================================

function dropLoot(enemy) {

    const gold =
        Math.floor(
            Math.random() *
            (
                enemy.goldMax -
                enemy.goldMin +
                1
            )
        ) +
        enemy.goldMin;

    player.gold += gold;

    inventory["Goldmünze"] +=
        gold;

    if (enemy.type === "boss") {

        inventory["Eisen"] += 10;
        inventory["Leder"] += 10;

        showMessage(
            "👑 SCHATTENWÄCHTER BESIEGT! +10 Eisen +10 Leder"
        );

    }
    else if (
        Math.random() < 0.35
    ) {

        inventory["Heiltrank"]++;

        showMessage(
            `+${gold} Gold | +1 Heiltrank`
        );

    }
    else if (
        Math.random() < 0.5
    ) {

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
}

// =====================================================
// XP
// =====================================================

function gainXP(amount) {

    player.xp += amount;

    while (
        player.xp >=
        player.xpToNextLevel
    ) {

        player.xp -=
            player.xpToNextLevel;

        levelUp();
    }

    updateHUD();
}

function levelUp() {

    player.level++;

    player.xpToNextLevel =
        Math.floor(
            player.xpToNextLevel *
            1.35
        );

    player.maxHealth += 20;

    player.health =
        player.maxHealth;

    player.weaponDamage += 3;

    showMessage(
        `⭐ LEVEL UP! Level ${player.level}`
    );

    checkBoss();
}

// =====================================================
// GEGNER BESIEGT
// =====================================================

function killEnemy(enemy) {

    if (!enemy.alive) {
        return;
    }

    enemy.alive = false;

    enemy.respawnTimer = 15;

    if (
        enemy.healthBarContainer
    ) {

        enemy.healthBarContainer
            .style.display =
            "none";
    }

    scene.remove(
        enemy.mesh
    );

    gainXP(
        enemy.xp
    );

    dropLoot(
        enemy
    );

    showMessage(
        `${enemy.name} besiegt!`
    );
}

// =====================================================
// RESPAWN
// =====================================================

function updateRespawns(delta) {

    for (
        const enemy of enemies
    ) {

        if (enemy.alive) {
            continue;
        }

        // Boss respawnt nicht
        if (
            enemy.type === "boss"
        ) {
            continue;
        }

        enemy.respawnTimer -= delta;

        if (
            enemy.respawnTimer <= 0
        ) {

            const newType =
                chooseEnemyType();

            const data =
                enemyTypes[newType];

            const spawn =
                spawnPoints[
                    Math.floor(
                        Math.random() *
                        spawnPoints.length
                    )
                ];

            const multiplier =
                1 +
                (player.level - 1) *
                0.08;

            enemy.type =
                newType;

            enemy.name =
                data.name;

            enemy.health =
                Math.floor(
                    data.health *
                    multiplier
                );

            enemy.maxHealth =
                enemy.health;

            enemy.speed =
                data.speed;

            enemy.damage =
                Math.floor(
                    data.damage *
                    multiplier
                );

            enemy.xp =
                Math.floor(
                    data.xp *
                    multiplier
                );

            enemy.scale =
                data.scale;

            enemy.position.set(
                spawn[0],
                data.scale,
                spawn[1]
            );

            enemy.mesh =
                new THREE.Mesh(
                    new THREE.CapsuleGeometry(
                        0.6,
                        1.4,
                        6,
                        10
                    ),
                    new THREE.MeshStandardMaterial({
                        color: data.color
                    })
                );

            enemy.mesh.scale.setScalar(
                data.scale
            );

            enemy.mesh.position.copy(
                enemy.position
            );

            scene.add(
                enemy.mesh
            );

            enemy.alive = true;

            enemy.attackCooldown = 0;

            createEnemyHealthBar(
                enemy
            );

            showMessage(
                `${data.name} ist wieder da!`
            );
        }
    }
}

// =====================================================
// KAMPF
// =====================================================

function attack() {

    if (
        player.attackCooldown > 0 ||
        player.attacking
    ) {

        return;
    }

    player.attackCooldown =
        0.55;

    player.attacking = true;

    // Schwert sauber nach vorne schwingen
    sword.rotation.z =
        -Math.PI * 0.9;

    characterParts.rightArm.rotation.x =
        -0.8;

    setTimeout(() => {

        sword.rotation.z = 0;

        characterParts.rightArm.rotation.x =
            0;

        player.attacking = false;

    }, 220);

    const attackDirection =
        new THREE.Vector3(
            0,
            0,
            -1
        );

    attackDirection.applyAxisAngle(
        new THREE.Vector3(
            0,
            1,
            0
        ),
        cameraYaw
    );

    let hit = false;

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

        if (dot > 0.2) {

            damageEnemy(
                enemy,
                player.weaponDamage
            );

            hit = true;
        }
    }

    // Keine VERFEHLT-Meldung.
}

// =====================================================
// GEGNER SCHADEN
// =====================================================

function damageEnemy(
    enemy,
    damage
) {

    enemy.health -= damage;

    updateEnemyHealthBar(
        enemy
    );

    if (
        enemy.health <= 0
    ) {

        killEnemy(
            enemy
        );
    }
}

// =====================================================
// GEGNER KI
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

        if (distance > 2.5) {

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

                damagePlayer(
                    enemy.damage
                );

                enemy.attackCooldown =
                    1.5;
            }
        }

        enemy.mesh.position.copy(
            enemy.position
        );

        updateEnemyHealthBar(
            enemy
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
            0,
            player.health
        );

    updateHUD();

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

        return;
    }

    inventory["Heiltrank"]--;

    player.health =
        Math.min(
            player.maxHealth,
            player.health + 40
        );

    updateHUD();
}

// =====================================================
// INVENTAR
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
        "320px";

    let html =
        `<h2>🎒 Inventar</h2>`;

    html +=
        `<p>⭐ Level: ${player.level}</p>`;

    html +=
        `<p>⭐ XP: ${player.xp}/${player.xpToNextLevel}</p>`;

    html +=
        `<p>🪙 Gold: ${player.gold}</p>`;

    html +=
        `<p>⚔️ Eisenschwert – Schaden ${player.weaponDamage}</p>`;

    html += `<hr>`;

    for (
        const item in inventory
    ) {

        html +=
            `<p>${item}: ${inventory[item]}</p>`;
    }

    html +=
        `<button id="closeInventory">Schließen</button>`;

    menu.innerHTML = html;

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

function updateHUD() {

    hud.innerHTML = `

        ❤️ ${player.health}/${player.maxHealth}<br>

        ⭐ Level ${player.level}<br>

        XP: ${player.xp}/${player.xpToNextLevel}<br>

        🪙 ${player.gold} Gold<br>

        ⚔️ Eisenschwert<br>

        🗡️ Schaden: ${player.weaponDamage}<br>

        🎒 ${inventory["Heiltrank"]} Heiltrank<br>

        👾 Gegner: ${
            enemies.filter(
                e => e.alive
            ).length
        }

    `;

    healthBar.style.width =
        (
            player.health /
            player.maxHealth *
            100
        ) +
        "%";
}

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
        "35%";

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

    }, 1000);
}

// =====================================================
// GAME OVER
// =====================================================

function gameOver() {

    if (
        document.getElementById(
            "gameOver"
        )
    ) {

        return;
    }

    if (
        document.exitPointerLock
    ) {

        document.exitPointerLock();
    }

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
        "rgba(0,0,0,0.88)";

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
            event.code ===
            "Space" &&
            player.onGround
        ) {

            event.preventDefault();

            player.velocityY =
                10;

            player.onGround =
                false;
        }

        if (
            event.code ===
            "KeyE"
        ) {

            attack();
        }

        if (
            event.code ===
            "KeyI"
        ) {

            toggleInventory();
        }

        if (
            event.code ===
            "KeyH"
        ) {

            usePotion();
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
            event.target.closest(
                "#inventoryMenu"
            )
        ) {

            return;
        }

        if (
            event.target.id ===
            "restart"
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
// SPIELERBEWEGUNG
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

        // Körper dreht sich in Bewegungsrichtung
        playerMesh.rotation.y =
            Math.atan2(
                direction.x,
                direction.z
            );

        // einfache Laufbewegung
        if (!player.attacking) {

            const walk =
                Math.sin(
                    performance.now() *
                    0.012
                ) * 0.35;

            characterParts.leftArm.rotation.x =
                walk;

            characterParts.rightArm.rotation.x =
                -walk;
        }
    }

    player.velocityY -=
        25 *
        delta;

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

    target.y += 1.3;

    const offset =
        new THREE.Vector3(
            0,
            2.2,
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
// RESIZE
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

    updateRespawns(delta);

    updateCamera();

    updateHUD();

    renderer.render(
        scene,
        camera
    );
}

// =====================================================
// START
// =====================================================

updateHUD();

gameLoop();
