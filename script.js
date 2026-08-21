import * as THREE from "three";

// =====================================================
// KINGDOMS BEYOND 0.6
// BURG + HÄUSER + SEE + HÄNDLER + CHARAKTER
// =====================================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87ceeb);

scene.fog = new THREE.Fog(
    0x87ceeb,
    45,
    220
);

// =====================================================
// KAMERA
// =====================================================

const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    600
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

renderer.shadowMap.enabled = true;

document.body.appendChild(
    renderer.domElement
);

// =====================================================
// LICHT
// =====================================================

scene.add(
    new THREE.HemisphereLight(
        0xffffff,
        0x405030,
        2.2
    )
);

const sun = new THREE.DirectionalLight(
    0xffffff,
    2.4
);

sun.position.set(
    60,
    100,
    40
);

sun.castShadow = true;

sun.shadow.mapSize.width = 2048;
sun.shadow.mapSize.height = 2048;

scene.add(sun);

// =====================================================
// BODEN
// =====================================================

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(
        360,
        360
    ),
    new THREE.MeshStandardMaterial({
        color: 0x477a3c,
        roughness: 1
    })
);

ground.rotation.x =
    -Math.PI / 2;

ground.receiveShadow = true;

scene.add(ground);

// =====================================================
// MATERIALIEN
// =====================================================

const materials = {

    wood: new THREE.MeshStandardMaterial({
        color: 0x70452b
    }),

    roof: new THREE.MeshStandardMaterial({
        color: 0x472b25
    }),

    stone: new THREE.MeshStandardMaterial({
        color: 0x777777
    }),

    stoneDark: new THREE.MeshStandardMaterial({
        color: 0x4d4d55
    }),

    grass: new THREE.MeshStandardMaterial({
        color: 0x477a3c
    }),

    water: new THREE.MeshStandardMaterial({
        color: 0x3d8fbd,
        transparent: true,
        opacity: 0.82,
        roughness: 0.15,
        metalness: 0.05
    }),

    skin: new THREE.MeshStandardMaterial({
        color: 0xc88f6a
    }),

    shirt: new THREE.MeshStandardMaterial({
        color: 0x385a78
    }),

    pants: new THREE.MeshStandardMaterial({
        color: 0x303442
    }),

    boots: new THREE.MeshStandardMaterial({
        color: 0x29211d
    }),

    hair: new THREE.MeshStandardMaterial({
        color: 0x3b2418
    }),

    sword: new THREE.MeshStandardMaterial({
        color: 0xd8dde2,
        metalness: 0.9,
        roughness: 0.2
    }),

    swordHandle: new THREE.MeshStandardMaterial({
        color: 0x5d4037
    }),

    gold: new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 0.8
    })

};

// =====================================================
// WELT – BÄUME
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
        materials.wood
    );

    trunk.position.y = 2;

    trunk.castShadow = true;

    tree.add(trunk);

    const leaves = new THREE.Mesh(
        new THREE.ConeGeometry(
            2.6,
            6,
            8
        ),
        new THREE.MeshStandardMaterial({
            color: 0x205d2e
        })
    );

    leaves.position.y = 6;

    leaves.castShadow = true;

    tree.add(leaves);

    tree.scale.set(
        scale,
        scale,
        scale
    );

    tree.position.set(
        x,
        0,
        z
    );

    scene.add(tree);
}

const treePositions = [
    [-25, -25],
    [18, -28],
    [38, -5],
    [-38, 12],
    [28, 28],
    [-15, 34],
    [45, 18],
    [-45, -18],
    [8, 42],
    [-32, 38],
    [48, -28],
    [-48, 28],
    [20, 48],
    [-20, 50],
    [55, 5],
    [-55, -5]
];

treePositions.forEach((p, i) => {

    createTree(
        p[0],
        p[1],
        0.85 + (i % 3) * 0.15
    );

});

// =====================================================
// FELSEN
// =====================================================

function createRock(x, z, scale = 1) {

    const rock = new THREE.Mesh(
        new THREE.DodecahedronGeometry(
            1.5,
            0
        ),
        materials.stone
    );

    rock.position.set(
        x,
        1,
        z
    );

    rock.scale.set(
        scale,
        scale * 0.7,
        scale
    );

    rock.rotation.y =
        Math.random() * Math.PI;

    rock.castShadow = true;

    scene.add(rock);
}

[
    [8, 8, 1],
    [-8, -5, 0.8],
    [15, 5, 1.2],
    [-18, 0, 1],
    [32, 10, 1.3],
    [-30, -5, 1],
    [5, -32, 1.2],
    [-25, -30, 0.8],
    [40, -10, 1.1],
    [-40, 0, 1.4]
].forEach(p => {

    createRock(
        p[0],
        p[1],
        p[2]
    );

});

// =====================================================
// SEE
// =====================================================

const lake = new THREE.Mesh(
    new THREE.CircleGeometry(
        18,
        48
    ),
    materials.water
);

lake.rotation.x =
    -Math.PI / 2;

lake.position.set(
    -55,
    0.05,
    55
);

lake.scale.set(
    1.4,
    0.75,
    1
);

scene.add(lake);

// =====================================================
// WEGE
// =====================================================

function createPath(
    x,
    z,
    width,
    length,
    rotation = 0
) {

    const path = new THREE.Mesh(
        new THREE.BoxGeometry(
            width,
            0.08,
            length
        ),
        new THREE.MeshStandardMaterial({
            color: 0x9b7b52
        })
    );

    path.position.set(
        x,
        0.04,
        z
    );

    path.rotation.y =
        rotation;

    scene.add(path);
}

createPath(
    0,
    18,
    8,
    90,
    0
);

createPath(
    0,
    -5,
    7,
    70,
    Math.PI / 2
);

createPath(
    0,
    18,
    7,
    80,
    Math.PI / 4
);

// =====================================================
// HÄUSER
// =====================================================

function createHouse(
    x,
    z,
    rotation = 0
) {

    const house =
        new THREE.Group();

    const body =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                8,
                5,
                7
            ),
            materials.wood
        );

    body.position.y = 2.5;

    body.castShadow = true;

    house.add(body);

    const roof =
        new THREE.Mesh(
            new THREE.ConeGeometry(
                5.7,
                3.8,
                4
            ),
            materials.roof
        );

    roof.rotation.y =
        Math.PI / 4;

    roof.position.y = 6.8;

    roof.castShadow = true;

    house.add(roof);

    const door =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                1.4,
                2.5,
                0.15
            ),
            materials.wood
        );

    door.position.set(
        0,
        1.25,
        3.55
    );

    door.material =
        new THREE.MeshStandardMaterial({
            color: 0x241810
        });

    house.add(door);

    house.position.set(
        x,
        0,
        z
    );

    house.rotation.y =
        rotation;

    scene.add(house);
}

createHouse(
    28,
    -8,
    0
);

createHouse(
    35,
    -20,
    0.2
);

createHouse(
    -28,
    8,
    -0.2
);

// =====================================================
// BURG
// =====================================================

const castle =
    new THREE.Group();

function castleTower(
    x,
    z
) {

    const tower =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                2.7,
                2.7,
                12,
                10
            ),
            materials.stoneDark
        );

    tower.position.set(
        x,
        6,
        z
    );

    tower.castShadow = true;

    castle.add(tower);

    const roof =
        new THREE.Mesh(
            new THREE.ConeGeometry(
                3.4,
                4,
                10
            ),
            materials.roof
        );

    roof.position.set(
        x,
        14,
        z
    );

    roof.castShadow = true;

    castle.add(roof);
}

castleTower(-12, 10);
castleTower(12, 10);
castleTower(-12, 30);
castleTower(12, 30);

const castleWall1 =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            30,
            8,
            2
        ),
        materials.stoneDark
    );

castleWall1.position.set(
    0,
    4,
    10
);

castle.add(castleWall1);

const castleWall2 =
    castleWall1.clone();

castleWall2.position.z =
    30;

castle.add(castleWall2);

const castleWall3 =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            2,
            8,
            20
        ),
        materials.stoneDark
    );

castleWall3.position.set(
    -14,
    4,
    20
);

castle.add(castleWall3);

const castleWall4 =
    castleWall3.clone();

castleWall4.position.x =
    14;

castle.add(castleWall4);

// Burgtor

const gate =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            7,
            7,
            2.4
        ),
        new THREE.MeshStandardMaterial({
            color: 0x3b2518
        })
    );

gate.position.set(
    0,
    3.5,
    10
);

castle.add(gate);

scene.add(castle);

// =====================================================
// SPIELER
// =====================================================

const player = {

    position:
        new THREE.Vector3(
            0,
            0,
            65
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

    gold: 50,

    attackCooldown: 0,

    weapon: "Eisenschwert",

    weaponDamage: 25,

    armor: "Keine Rüstung",

    armorBonus: 0,

    attacking: false

};

// =====================================================
// INVENTAR
// =====================================================

const inventory = {

    "Heiltrank": 3,

    "Eisenschwert": 1,

    "Leder": 0,

    "Eisen": 0,

    "Goldmünze": 50

};

// =====================================================
// CHARAKTER
// =====================================================

const playerMesh =
    new THREE.Group();

// Körper

const torso =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            0.9,
            1.35,
            0.55
        ),
        materials.shirt
    );

torso.position.y =
    1.65;

torso.castShadow = true;

playerMesh.add(torso);

// Kopf

const head =
    new THREE.Mesh(
        new THREE.SphereGeometry(
            0.42,
            16,
            16
        ),
        materials.skin
    );

head.position.y =
    2.65;

head.castShadow = true;

playerMesh.add(head);

// Haare

const hair =
    new THREE.Mesh(
        new THREE.SphereGeometry(
            0.44,
            16,
            12
        ),
        materials.hair
    );

hair.scale.set(
    1,
    0.55,
    1
);

hair.position.y =
    2.88;

playerMesh.add(hair);

// Arme

function createArm(side) {

    const arm =
        new THREE.Mesh(
            new THREE.CapsuleGeometry(
                0.16,
                0.75,
                4,
                8
            ),
            materials.skin
        );

    arm.position.set(
        side * 0.62,
        1.7,
        0
    );

    arm.rotation.z =
        side * -0.12;

    arm.castShadow = true;

    playerMesh.add(arm);

    return arm;
}

const leftArm =
    createArm(-1);

const rightArm =
    createArm(1);

// Beine

function createLeg(side) {

    const leg =
        new THREE.Mesh(
            new THREE.CapsuleGeometry(
                0.18,
                0.85,
                4,
                8
            ),
            materials.pants
        );

    leg.position.set(
        side * 0.25,
        0.65,
        0
    );

    leg.castShadow = true;

    playerMesh.add(leg);

    return leg;
}

const leftLeg =
    createLeg(-1);

const rightLeg =
    createLeg(1);

// Schuhe

function createBoot(side) {

    const boot =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.35,
                0.25,
                0.65
            ),
            materials.boots
        );

    boot.position.set(
        side * 0.25,
        0.15,
        -0.12
    );

    boot.castShadow = true;

    playerMesh.add(boot);
}

createBoot(-1);
createBoot(1);

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
            0.16,
            2.5,
            0.28
        ),
        materials.sword
    );

// Das Schwert zeigt nach vorne
blade.position.y =
    1.35;

sword.add(blade);

const guard =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            1.0,
            0.16,
            0.18
        ),
        materials.gold
    );

guard.position.y =
    0.15;

sword.add(guard);

const handle =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            0.18,
            0.75,
            0.18
        ),
        materials.swordHandle
    );

handle.position.y =
    -0.25;

sword.add(handle);

const pommel =
    new THREE.Mesh(
        new THREE.SphereGeometry(
            0.15,
            8,
            8
        ),
        materials.gold
    );

pommel.position.y =
    -0.65;

sword.add(pommel);

// rechte Hand

sword.position.set(
    0.65,
    1.55,
    -0.15
);

sword.rotation.z =
    -0.35;

rightArm.add(sword);

// =====================================================
// GEGNER
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
        name: "Schneller",
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
    }

};

const enemies = [];

const MAX_ENEMIES = 7;

const RESPAWN_TIME = 15;

const spawnPoints = [
    [35, 40],
    [-30, -20],
    [50, 35],
    [-45, 0],
    [55, -30],
    [-50, -35],
    [70, 10],
    [-70, 20]
];

// =====================================================
// LEBENSLEISTEN
// =====================================================

function createHealthBar(enemy) {

    const container =
        document.createElement("div");

    container.style.position =
        "fixed";

    container.style.width =
        "70px";

    container.style.height =
        "8px";

    container.style.background =
        "rgba(0,0,0,0.7)";

    container.style.border =
        "1px solid white";

    container.style.zIndex =
        "30";

    container.style.pointerEvents =
        "none";

    const bar =
        document.createElement("div");

    bar.style.height =
        "100%";

    bar.style.width =
        "100%";

    bar.style.background =
        enemy.type === "elite"
            ? "#d8a8ff"
            : "#e33";

    container.appendChild(bar);

    document.body.appendChild(
        container
    );

    enemy.healthBar =
        container;

    enemy.healthFill =
        bar;
}

function updateHealthBar(enemy) {

    if (
        !enemy.healthBar ||
        !enemy.mesh ||
        !enemy.alive
    ) {

        if (enemy.healthBar) {
            enemy.healthBar.style.display =
                "none";
        }

        return;
    }

    const worldPosition =
        enemy.position.clone();

    worldPosition.y +=
        enemy.scale * 2.2;

    const projected =
        worldPosition.project(
            camera
        );

    const x =
        (projected.x * 0.5 + 0.5) *
        window.innerWidth;

    const y =
        (-projected.y * 0.5 + 0.5) *
        window.innerHeight;

    enemy.healthBar.style.display =
        "block";

    enemy.healthBar.style.left =
        `${x - 35}px`;

    enemy.healthBar.style.top =
        `${y}px`;

    enemy.healthFill.style.width =
        `${Math.max(
            0,
            enemy.health /
            enemy.maxHealth *
            100
        )}%`;
}

// =====================================================
// GEGNERTYP
// =====================================================

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

// =====================================================
// GEGNER ERSTELLEN
// =====================================================

function spawnEnemy(
    typeName = null
) {

    if (
        enemies.filter(
            e => e.alive
        ).length >= MAX_ENEMIES
    ) {

        return;

    }

    const type =
        typeName ||
        chooseEnemyType();

    const data =
        enemyTypes[type];

    const spawn =
        spawnPoints[
            Math.floor(
                Math.random() *
                spawnPoints.length
            )
        ];

    const levelMultiplier =
        1 +
        (player.level - 1) *
        0.08;

    const enemy = {

        type,

        name:
            data.name,

        position:
            new THREE.Vector3(
                spawn[0],
                data.scale,
                spawn[1]
            ),

        health:
            Math.floor(
                data.health *
                levelMultiplier
            ),

        maxHealth:
            Math.floor(
                data.health *
                levelMultiplier
            ),

        speed:
            data.speed,

        damage:
            Math.floor(
                data.damage *
                levelMultiplier
            ),

        xp:
            Math.floor(
                data.xp *
                levelMultiplier
            ),

        goldMin:
            data.goldMin,

        goldMax:
            data.goldMax,

        scale:
            data.scale,

        alive: true,

        attackCooldown: 0,

        respawnTimer: 0,

        mesh: null,

        healthBar: null,

        healthFill: null

    };

    const enemyMesh =
        new THREE.Group();

    const body =
        new THREE.Mesh(
            new THREE.CapsuleGeometry(
                0.6,
                1.4,
                4,
                8
            ),
            new THREE.MeshStandardMaterial({
                color: data.color
            })
        );

    body.castShadow = true;

    enemyMesh.add(body);

    // Kopf

    const enemyHead =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.45,
                12,
                12
            ),
            new THREE.MeshStandardMaterial({
                color: 0xb56f55
            })
        );

    enemyHead.position.y =
        1.2;

    enemyMesh.add(enemyHead);

    enemyMesh.scale.set(
        data.scale,
        data.scale,
        data.scale
    );

    enemyMesh.position.copy(
        enemy.position
    );

    scene.add(
        enemyMesh
    );

    enemy.mesh =
        enemyMesh;

    enemies.push(
        enemy
    );

    createHealthBar(
        enemy
    );

    if (
        type === "elite"
    ) {

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

    player.gold +=
        gold;

    inventory["Goldmünze"] +=
        gold;

    if (
        enemy.type === "elite"
    ) {

        inventory["Eisen"] += 2;
        inventory["Leder"] += 2;

        showMessage(
            `👑 Elite-Loot: +${gold} Gold`
        );

    }
    else if (
        Math.random() < 0.5
    ) {

        inventory["Heiltrank"]++;

        showMessage(
            `+${gold} Gold | +1 Heiltrank`
        );

    }
    else {

        inventory["Leder"]++;

        showMessage(
            `+${gold} Gold | +1 Leder`
        );

    }

    updateHUD();

    saveGame(false);
}

// =====================================================
// XP
// =====================================================

function gainXP(amount) {

    player.xp +=
        amount;

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

    saveGame(false);
}

function levelUp() {

    player.level++;

    player.xpToNextLevel =
        Math.floor(
            player.xpToNextLevel *
            1.35
        );

    player.maxHealth +=
        20;

    player.health =
        player.maxHealth;

    player.weaponDamage +=
        3;

    showMessage(
        `⭐ LEVEL UP! Level ${player.level}`
    );
}

// =====================================================
// GEGNER BESIEGT
// =====================================================

function killEnemy(enemy) {

    if (
        !enemy.alive
    ) {

        return;
    }

    enemy.alive =
        false;

    enemy.respawnTimer =
        RESPAWN_TIME;

    gainXP(
        enemy.xp
    );

    dropLoot(
        enemy
    );

    showMessage(
        `${enemy.name} besiegt!`
    );

    if (
        enemy.healthBar
    ) {

        enemy.healthBar.style.display =
            "none";
    }

    enemy.mesh.rotation.z =
        Math.PI / 2;
}

// =====================================================
// RESPAWN
// =====================================================

function updateRespawns(delta) {

    for (
        const enemy of enemies
    ) {

        if (
            enemy.alive
        ) {

            continue;
        }

        enemy.respawnTimer -=
            delta;

        if (
            enemy.respawnTimer <= 0
        ) {

            const type =
                chooseEnemyType();

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

            enemy.type =
                type;

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

            enemy.goldMin =
                data.goldMin;

            enemy.goldMax =
                data.goldMax;

            enemy.scale =
                data.scale;

            enemy.position.set(
                spawn[0],
                data.scale,
                spawn[1]
            );

            enemy.mesh.scale.set(
                data.scale,
                data.scale,
                data.scale
            );

            enemy.mesh.position.copy(
                enemy.position
            );

            enemy.mesh.rotation.set(
                0,
                0,
                0
            );

            enemy.alive =
                true;

            enemy.attackCooldown =
                0;

            if (
                enemy.healthFill
            ) {

                enemy.healthFill.style.background =
                    type === "elite"
                        ? "#d8a8ff"
                        : "#e33";
            }

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
        player.attackCooldown > 0
    ) {

        return;
    }

    player.attackCooldown =
        0.65;

    player.attacking =
        true;

    const startRotation =
        sword.rotation.z;

    sword.rotation.z =
        -1.5;

    setTimeout(() => {

        sword.rotation.z =
            0.4;

    }, 120);

    setTimeout(() => {

        sword.rotation.z =
            startRotation;

        player.attacking =
            false;

    }, 280);

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
        playerMesh.rotation.y
    );

    let hitSomething =
        false;

    for (
        const enemy of enemies
    ) {

        if (
            !enemy.alive
        ) {

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

        if (
            distance > 4.5
        ) {

            continue;
        }

        difference.normalize();

        const dot =
            attackDirection.dot(
                difference
            );

        if (
            dot > 0.15
        ) {

            hitSomething =
                true;

            damageEnemy(
                enemy,
                player.weaponDamage
            );
        }
    }
}

// =====================================================
// GEGNER SCHADEN
// =====================================================

function damageEnemy(
    enemy,
    damage
) {

    enemy.health -=
        damage;

    // kurzer Treffer-Flash

    enemy.mesh.traverse(
        object => {

            if (
                object.material &&
                object.material.color
            ) {

                const original =
                    object.material.color.clone();

                object.material.color.set(
                    0xffffff
                );

                setTimeout(() => {

                    if (
                        object.material &&
                        object.material.color
                    ) {

                        object.material.color.copy(
                            original
                        );

                    }

                }, 100);
            }
        }
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
// GEGNER-KI
// =====================================================

function updateEnemies(delta) {

    for (
        const enemy of enemies
    ) {

        if (
            !enemy.alive
        ) {

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

        if (
            distance > 2.4
        ) {

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
            damage -
            player.armorBonus
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

    saveGame(false);
}

// =====================================================
// HÄNDLER
// =====================================================

const merchant =
    document.createElement(
        "div"
    );

merchant.style.position =
    "fixed";

merchant.style.left =
    "50%";

merchant.style.top =
    "50%";

merchant.style.transform =
    "translate(-50%, -50%)";

merchant.style.background =
    "rgba(15,15,15,0.96)";

merchant.style.padding =
    "25px";

merchant.style.border =
    "2px solid #d4af37";

merchant.style.color =
    "white";

merchant.style.zIndex =
    "90";

merchant.style.minWidth =
    "320px";

merchant.style.display =
    "none";

document.body.appendChild(
    merchant
);

function openMerchant() {

    merchant.style.display =
        "block";

    merchant.innerHTML = `

        <h2>🧑 Händler</h2>

        <p>Gold: 🪙 ${player.gold}</p>

        <hr>

        <button id="buyPotion">
            Heiltrank – 20 Gold
        </button>

        <br><br>

        <button id="buyArmor">
            Leder-Rüstung – 100 Gold
        </button>

        <br><br>

        <button id="buySword">
            Stahlschwert – 150 Gold
        </button>

        <br><br>

        <button id="closeMerchant">
            Schließen
        </button>
    `;

    document.getElementById(
        "buyPotion"
    ).onclick = () => {

        if (
            player.gold < 20
        ) {

            showMessage(
                "Nicht genug Gold!"
            );

            return;
        }

        player.gold -= 20;

        inventory["Goldmünze"] -=
            20;

        inventory["Heiltrank"]++;

        showMessage(
            "Heiltrank gekauft!"
        );

        openMerchant();
        updateHUD();
        saveGame(false);
    };

    document.getElementById(
        "buyArmor"
    ).onclick = () => {

        if (
            player.armor ===
            "Leder-Rüstung"
        ) {

            showMessage(
                "Du besitzt diese Rüstung bereits!"
            );

            return;
        }

        if (
            player.gold < 100
        ) {

            showMessage(
                "Nicht genug Gold!"
            );

            return;
        }

        player.gold -=
            100;

        inventory["Goldmünze"] -=
            100;

        player.armor =
            "Leder-Rüstung";

        player.armorBonus =
            5;

        showMessage(
            "🛡️ Leder-Rüstung gekauft!"
        );

        openMerchant();
        updateHUD();
        saveGame(false);
    };

    document.getElementById(
        "buySword"
    ).onclick = () => {

        if (
            player.weapon ===
            "Stahlschwert"
        ) {

            showMessage(
                "Du besitzt dieses Schwert bereits!"
            );

            return;
        }

        if (
            player.gold < 150
        ) {

            showMessage(
                "Nicht genug Gold!"
            );

            return;
        }

        player.gold -=
            150;

        inventory["Goldmünze"] -=
            150;

        player.weapon =
            "Stahlschwert";

        player.weaponDamage =
            40;

        inventory["Stahlschwert"] =
            1;

        showMessage(
            "⚔️ Stahlschwert gekauft!"
        );

        openMerchant();
        updateHUD();
        saveGame(false);
    };

    document.getElementById(
        "closeMerchant"
    ).onclick = () => {

        merchant.style.display =
            "none";
    };
}

// =====================================================
// HÄNDLER-POSITION
// =====================================================

const merchantPosition =
    new THREE.Vector3(
        0,
        0,
        20
    );

// Händler sichtbar

const merchantMesh =
    new THREE.Group();

const merchantBody =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            0.9,
            1.5,
            0.6
        ),
        new THREE.MeshStandardMaterial({
            color: 0x8b5a2b
        })
    );

merchantBody.position.y =
    1.5;

merchantMesh.add(
    merchantBody
);

const merchantHead =
    new THREE.Mesh(
        new THREE.SphereGeometry(
            0.4,
            16,
            16
        ),
        materials.skin
    );

merchantHead.position.y =
    2.6;

merchantMesh.add(
    merchantHead
);

merchantMesh.position.copy(
    merchantPosition
);

scene.add(
    merchantMesh
);

// Händler-Schild

const sign =
    document.createElement(
        "div"
    );

sign.textContent =
    "🧑 HÄNDLER";

sign.style.position =
    "fixed";

sign.style.zIndex =
    "25";

sign.style.color =
    "#ffd54f";

sign.style.fontWeight =
    "bold";

sign.style.pointerEvents =
    "none";

document.body.appendChild(
    sign
);

function updateMerchantSign() {

    const pos =
        merchantPosition
            .clone();

    pos.y += 3.5;

    pos.project(
        camera
    );

    const x =
        (pos.x * 0.5 + 0.5) *
        window.innerWidth;

    const y =
        (-pos.y * 0.5 + 0.5) *
        window.innerHeight;

    sign.style.left =
        `${x - 40}px`;

    sign.style.top =
        `${y}px`;
}

// =====================================================
// INVENTAR
// =====================================================

function toggleInventory() {

    let menu =
        document.getElementById(
            "inventoryMenu"
        );

    if (
        menu
    ) {

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
        `<p>XP: ${player.xp}/${player.xpToNextLevel}</p>`;

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

    document.getElementById(
        "closeInventory"
    ).onclick = () => {

        menu.remove();
    };
}

// =====================================================
// SPEICHERN
// =====================================================

function saveGame(
    show = true
) {

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

        inventory: {
            ...inventory
        }
    };

    localStorage.setItem(
        "kingdomsBeyondSave",
        JSON.stringify(
            saveData
        )
    );

    if (
        show
    ) {

        showMessage(
            "💾 Spiel gespeichert"
        );
    }
}

// =====================================================
// LADEN
// =====================================================

function loadGame() {

    const raw =
        localStorage.getItem(
            "kingdomsBeyondSave"
        );

    if (
        !raw
    ) {

        return;
    }

    try {

        const data =
            JSON.parse(raw);

        if (
            data.player
        ) {

            Object.assign(
                player,
                data.player
            );

            player.position.set(
                data.player.x,
                data.player.y,
                data.player.z
            );
        }

        if (
            data.inventory
        ) {

            Object.assign(
                inventory,
                data.inventory
            );
        }

        playerMesh.position.copy(
            player.position
        );

    }
    catch (
        error
    ) {

        console.error(
            "Save konnte nicht geladen werden:",
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
    "rgba(0,0,0,0.6)";

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

        ⚔️ ${player.weapon}<br>

        🛡️ ${player.armor}<br>

        🎒 ${inventory["Heiltrank"]} Heiltrank<br>

        👾 Gegner:
        ${
            enemies.filter(
                e => e.alive
            ).length
        }/${MAX_ENEMIES}

    `;

    healthBar.style.width =
        (
            player.health /
            player.maxHealth *
            100
        ) + "%";
}

// =====================================================
// NACHRICHTEN
// =====================================================

function showMessage(
    text
) {

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

    document.getElementById(
        "restart"
    ).onclick = () => {

        localStorage.removeItem(
            "kingdomsBeyondSave"
        );

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

        keys[event.code] =
            true;

        if (
            event.code === "Space" &&
            player.onGround
        ) {

            event.preventDefault();

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

        if (
            event.code === "KeyB"
        ) {

            const distance =
                player.position.distanceTo(
                    merchantPosition
                );

            if (
                distance < 8
            ) {

                openMerchant();

            }
            else {

                showMessage(
                    "Du bist zu weit vom Händler entfernt."
                );
            }
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
            ) ||
            event.target.closest(
                "#gameOver"
            ) ||
            event.target.closest(
                "#merchant"
            )
        ) {

            return;
        }

        if (
            merchant.style.display ===
            "block"
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

function updatePlayer(
    delta
) {

    const direction =
        new THREE.Vector3();

    if (
        keys["KeyW"]
    ) {

        direction.z -= 1;
    }

    if (
        keys["KeyS"]
    ) {

        direction.z += 1;
    }

    if (
        keys["KeyA"]
    ) {

        direction.x -= 1;
    }

    if (
        keys["KeyD"]
    ) {

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

        // Charakter schaut in Bewegungsrichtung

        playerMesh.rotation.y =
            Math.atan2(
                -direction.x,
                -direction.z
            );

        // einfache Laufanimation

        if (
            player.onGround
        ) {

            const walk =
                Math.sin(
                    performance.now() *
                    0.012
                ) * 0.35;

            leftLeg.rotation.x =
                walk;

            rightLeg.rotation.x =
                -walk;

            leftArm.rotation.x =
                -walk;

            rightArm.rotation.x =
                walk;
        }
    }
    else {

        leftLeg.rotation.x *=
            0.85;

        rightLeg.rotation.x *=
            0.85;

        leftArm.rotation.x *=
            0.85;

        rightArm.rotation.x *=
            0.85;
    }

    player.velocityY -=
        25 *
        delta;

    player.position.y +=
        player.velocityY *
        delta;

    if (
        player.position.y <= 0
    ) {

        player.position.y =
            0;

        player.velocityY =
            0;

        player.onGround =
            true;
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

    target.y +=
        1.5;

    const offset =
        new THREE.Vector3(
            0,
            2.5,
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
            .add(
                offset
            )
    );

    camera.lookAt(
        target
    );
}

// =====================================================
// HUD + WELT UI
// =====================================================

function updateWorldUI() {

    for (
        const enemy of enemies
    ) {

        updateHealthBar(
            enemy
        );
    }

    updateMerchantSign();
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

    updatePlayer(
        delta
    );

    updateEnemies(
        delta
    );

    updateRespawns(
        delta
    );

    updateCamera();

    updateWorldUI();

    updateHUD();

    renderer.render(
        scene,
        camera
    );
}

// =====================================================
// START
// =====================================================

loadGame();

updateHUD();

gameLoop();

console.log(
    "Kingdoms Beyond 0.6 gestartet!"
);

console.log(
    "B = Händler öffnen (in der Nähe)"
);

console.log(
    "E = Angreifen | I = Inventar | H = Heiltrank"
);
