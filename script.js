import * as THREE from "three";

// =====================================================
// KINGDOMS BEYOND 0.6
// BURG + HÄNDLER + CHARAKTERE + KAMPF + RESPAWN
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

document.body.appendChild(
    renderer.domElement
);


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

const sun =
    new THREE.DirectionalLight(
        0xffffff,
        2.2
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

const ground =
    new THREE.Mesh(
        new THREE.PlaneGeometry(
            300,
            300
        ),
        new THREE.MeshStandardMaterial({
            color: 0x416d38
        })
    );

ground.rotation.x =
    -Math.PI / 2;

scene.add(ground);


// =====================================================
// WELT-DEKORATION
// =====================================================

function createTree(x, z) {

    const tree =
        new THREE.Group();

    const trunk =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.45,
                0.65,
                4,
                8
            ),
            new THREE.MeshStandardMaterial({
                color: 0x70452b
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
                color: 0x245c2d
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
    [-20, 40],
    [50, 25],
    [-50, -15]
].forEach(p => {
    createTree(
        p[0],
        p[1]
    );
});


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
].forEach(p => {
    createRock(
        p[0],
        p[1]
    );
});


// =====================================================
// BURG
// =====================================================

const castle =
    new THREE.Group();

castle.position.set(
    0,
    0,
    -35
);

scene.add(castle);


// Burgmauer

const wallMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x8b8b82
    });


function castleWall(
    x,
    y,
    z,
    width,
    height,
    depth
) {

    const wall =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                width,
                height,
                depth
            ),
            wallMaterial
        );

    wall.position.set(
        x,
        y,
        z
    );

    castle.add(wall);
}


// Vorderseite

castleWall(
    -13,
    4,
    8,
    26,
    8,
    2
);

castleWall(
    13,
    4,
    8,
    26,
    8,
    2
);

// Rückseite

castleWall(
    0,
    4,
    -18,
    30,
    8,
    2
);

// Seiten

castleWall(
    -14,
    4,
    -5,
    2,
    8,
    28
);

castleWall(
    14,
    4,
    -5,
    2,
    8,
    28
);


// =====================================================
// BURGTÜRME
// =====================================================

function createTower(
    x,
    z
) {

    const tower =
        new THREE.Group();

    const base =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                3,
                3.2,
                9,
                10
            ),
            wallMaterial
        );

    base.position.y = 4.5;

    tower.add(base);


    const roof =
        new THREE.Mesh(
            new THREE.ConeGeometry(
                3.8,
                5,
                10
            ),
            new THREE.MeshStandardMaterial({
                color: 0x4b3030
            })
        );

    roof.position.y = 11.5;

    tower.add(roof);


    tower.position.set(
        x,
        0,
        z
    );

    castle.add(tower);
}


createTower(
    -15,
    8
);

createTower(
    15,
    8
);

createTower(
    -14,
    -19
);

createTower(
    14,
    -19
);


// =====================================================
// BURGTOR
// =====================================================

const gate =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            7,
            7,
            1
        ),
        new THREE.MeshStandardMaterial({
            color: 0x4a2b18
        })
    );

gate.position.set(
    0,
    3.5,
    8
);

castle.add(gate);


// Burgbanner

const banner =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            2.5,
            4,
            0.15
        ),
        new THREE.MeshStandardMaterial({
            color: 0x8b1e1e
        })
    );

banner.position.set(
    0,
    7,
    6.8
);

castle.add(banner);


// =====================================================
// BURGSCHILD
// =====================================================

function createTextSprite(
    text,
    color = "#ffffff"
) {

    const canvas =
        document.createElement(
            "canvas"
        );

    canvas.width = 512;
    canvas.height = 128;

    const ctx =
        canvas.getContext("2d");

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.font =
        "bold 54px Arial";

    ctx.textAlign =
        "center";

    ctx.fillStyle =
        color;

    ctx.strokeStyle =
        "black";

    ctx.lineWidth = 8;

    ctx.strokeText(
        text,
        256,
        75
    );

    ctx.fillText(
        text,
        256,
        75
    );

    const texture =
        new THREE.CanvasTexture(
            canvas
        );

    const material =
        new THREE.SpriteMaterial({
            map: texture,
            transparent: true
        });

    const sprite =
        new THREE.Sprite(
            material
        );

    sprite.scale.set(
        10,
        2.5,
        1
    );

    return sprite;
}


const castleSign =
    createTextSprite(
        "BURG KÖNIGSREICH"
    );

castleSign.position.set(
    0,
    13,
    5
);

scene.add(
    castleSign
);


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
// CHARAKTER-MODELL
// =====================================================

function createCharacter(
    bodyColor,
    skinColor = 0xf0c8a0,
    hairColor = 0x3b2416
) {

    const character =
        new THREE.Group();


    // Körper

    const body =
        new THREE.Mesh(
            new THREE.CapsuleGeometry(
                0.48,
                0.9,
                6,
                10
            ),
            new THREE.MeshStandardMaterial({
                color: bodyColor
            })
        );

    body.position.y = 1.35;

    character.add(body);


    // Kopf

    const head =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.42,
                16,
                16
            ),
            new THREE.MeshStandardMaterial({
                color: skinColor
            })
        );

    head.position.y = 2.25;

    character.add(head);


    // Haare

    const hair =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.44,
                16,
                8,
                0,
                Math.PI * 2,
                0,
                Math.PI * 0.55
            ),
            new THREE.MeshStandardMaterial({
                color: hairColor
            })
        );

    hair.position.y = 2.42;

    character.add(hair);


    // Augen

    const eyeMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x111111
        });


    const eye1 =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.055,
                8,
                8
            ),
            eyeMaterial
        );

    eye1.position.set(
        -0.15,
        2.28,
        -0.36
    );

    character.add(eye1);


    const eye2 =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.055,
                8,
                8
            ),
            eyeMaterial
        );

    eye2.position.set(
        0.15,
        2.28,
        -0.36
    );

    character.add(eye2);


    // Beine

    const legMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x29364a
        });


    const leg1 =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.14,
                0.17,
                0.8,
                8
            ),
            legMaterial
        );

    leg1.position.set(
        -0.2,
        0.55,
        0
    );

    character.add(leg1);


    const leg2 =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.14,
                0.17,
                0.8,
                8
            ),
            legMaterial
        );

    leg2.position.set(
        0.2,
        0.55,
        0
    );

    character.add(leg2);


    // Arme

    const armMaterial =
        new THREE.MeshStandardMaterial({
            color: bodyColor
        });


    const arm1 =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.12,
                0.14,
                0.9,
                8
            ),
            armMaterial
        );

    arm1.rotation.z =
        -0.15;

    arm1.position.set(
        -0.6,
        1.4,
        0
    );

    character.add(arm1);


    const arm2 =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.12,
                0.14,
                0.9,
                8
            ),
            armMaterial
        );

    arm2.rotation.z =
        0.15;

    arm2.position.set(
        0.6,
        1.4,
        0
    );

    character.add(arm2);


    return character;
}


const playerMesh =
    createCharacter(
        0x315c9b,
        0xf0c8a0,
        0x392417
    );

playerMesh.position.copy(
    player.position
);

scene.add(
    playerMesh
);


// =====================================================
// SCHWERT
// =====================================================

const sword =
    new THREE.Group();


// Das Schwert zeigt nach vorne (-Z)

const blade =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            0.16,
            2.5,
            0.22
        ),
        new THREE.MeshStandardMaterial({
            color: 0xd7dde2,
            metalness: 0.85,
            roughness: 0.2
        })
    );

blade.rotation.x =
    Math.PI / 2;

blade.position.set(
    0,
    0,
    -1.35
);

sword.add(blade);


const handle =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            0.18,
            0.65,
            0.18
        ),
        new THREE.MeshStandardMaterial({
            color: 0x5d4037
        })
    );

handle.position.y =
    -0.35;

sword.add(handle);


const guard =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            0.75,
            0.12,
            0.16
        ),
        new THREE.MeshStandardMaterial({
            color: 0xb58b35,
            metalness: 0.7
        })
    );

guard.position.y =
    0;

sword.add(guard);


// Handposition

sword.position.set(
    0.58,
    1.45,
    -0.15
);

sword.rotation.x =
    -0.15;

playerMesh.add(
    sword
);


// =====================================================
// HÄNDLER
// =====================================================

const merchant =
    createCharacter(
        0x7b3f98,
        0xd8a47f,
        0x5b321c
    );

merchant.position.set(
    5,
    0,
    -25
);

merchant.scale.set(
    1.05,
    1.05,
    1.05
);

scene.add(
    merchant
);


// Händler-Schild

const merchantSign =
    createTextSprite(
        "HÄNDLER",
        "#ffd54a"
    );

merchantSign.position.set(
    5,
    4,
    -25
);

merchantSign.scale.set(
    5,
    1.25,
    1
);

scene.add(
    merchantSign
);


// Händler-Tisch

const table =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            4,
            1,
            2
        ),
        new THREE.MeshStandardMaterial({
            color: 0x70452b
        })
    );

table.position.set(
    5,
    0.5,
    -27
);

scene.add(table);


// Händler-Zone

const merchantPosition =
    new THREE.Vector3(
        5,
        0,
        -25
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
        speed: 2.0,
        damage: 25,
        xp: 250,
        goldMin: 30,
        goldMax: 60,
        color: 0x8e44ad,
        scale: 1.5
    }

};


const enemies = [];

const MAX_ENEMIES = 6;

const RESPAWN_TIME = 15;


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


// =====================================================
// GEGNER LEBENSLEISTE
// =====================================================

function createEnemyHealthBar() {

    const container =
        document.createElement(
            "div"
        );

    container.style.position =
        "fixed";

    container.style.width =
        "80px";

    container.style.height =
        "8px";

    container.style.background =
        "rgba(0,0,0,0.75)";

    container.style.border =
        "1px solid white";

    container.style.pointerEvents =
        "none";

    container.style.zIndex =
        "15";


    const bar =
        document.createElement(
            "div"
        );

    bar.style.width =
        "100%";

    bar.style.height =
        "100%";

    bar.style.background =
        "#e53935";

    container.appendChild(
        bar
    );

    document.body.appendChild(
        container
    );

    return {
        container,
        bar
    };
}


// =====================================================
// ENEMY TYPE
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

    if (
        roll < 0.25
    ) {
        return "runner";
    }

    if (
        roll < 0.42
    ) {
        return "tank";
    }

    return "grunt";
}


// =====================================================
// ENEMY ERSTELLEN
// =====================================================

function createEnemyMesh(
    data
) {

    const enemy =
        new THREE.Group();


    const body =
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

    body.position.y =
        1.3;

    enemy.add(body);


    const head =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.45,
                12,
                12
            ),
            new THREE.MeshStandardMaterial({
                color: 0xd28b6a
            })
        );

    head.position.y =
        2.35;

    enemy.add(head);


    enemy.scale.set(
        data.scale,
        data.scale,
        data.scale
    );

    return enemy;
}


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
                0,
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

        alive: true,

        attackCooldown: 0,

        respawnTimer: 0,

        mesh:
            createEnemyMesh(
                data
            ),

        healthUI:
            createEnemyHealthBar(),

        scale:
            data.scale

    };


    enemy.mesh.position.copy(
        enemy.position
    );

    scene.add(
        enemy.mesh
    );

    enemies.push(
        enemy
    );


    if (
        type === "elite"
    ) {
        showMessage(
            "👑 ELITE-GEGNER ERSCHIENEN!"
        );
    }

}


// Startgegner

spawnEnemy("grunt");
spawnEnemy("grunt");
spawnEnemy("runner");
spawnEnemy("tank");


// =====================================================
// HEALTHBARS AKTUALISIEREN
// =====================================================

function updateEnemyHealthBars() {

    for (
        const enemy of enemies
    ) {

        if (
            !enemy.alive
        ) {

            enemy.healthUI.container.style.display =
                "none";

            continue;
        }


        const projected =
            enemy.position.clone();

        projected.y +=
            3.2 *
            enemy.scale;


        projected.project(
            camera
        );


        const x =
            (projected.x * 0.5 + 0.5) *
            window.innerWidth;


        const y =
            (-projected.y * 0.5 + 0.5) *
            window.innerHeight;


        enemy.healthUI.container.style.display =
            "block";

        enemy.healthUI.container.style.left =
            `${x - 40}px`;

        enemy.healthUI.container.style.top =
            `${y - 4}px`;


        enemy.healthUI.bar.style.width =
            `${Math.max(
                0,
                enemy.health /
                enemy.maxHealth *
                100
            )}%`;


        if (
            enemy.type === "elite"
        ) {

            enemy.healthUI.bar.style.background =
                "#f1c40f";

        }
        else {

            enemy.healthUI.bar.style.background =
                "#e53935";

        }

    }

}


// =====================================================
// LOOT
// =====================================================

function dropLoot(
    enemy
) {

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


    const roll =
        Math.random();


    if (
        enemy.type === "elite"
    ) {

        inventory["Eisen"] += 2;

        inventory["Leder"] += 2;

        showMessage(
            `👑 Elite-Loot: +${gold} Gold +2 Eisen +2 Leder`
        );

    }
    else if (
        roll < 0.35
    ) {

        inventory["Heiltrank"]++;

        showMessage(
            `+${gold} Gold | +1 Heiltrank`
        );

    }
    else if (
        roll < 0.65
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

    saveGame(false);

}


// =====================================================
// XP
// =====================================================

function gainXP(
    amount
) {

    player.xp +=
        amount;


    while (
        player.xp >=
        player.xpToNextLevel
    ) {

        player.xp -=
            player.xpToNextLevel;

        levelUp();

    }


    showMessage(
        `+${amount} XP`
    );

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
// TREFFER-EFFEKT
// =====================================================

function hitEffect(
    enemy
) {

    const original =
        enemy.mesh.visible;


    enemy.mesh.visible =
        false;


    setTimeout(() => {

        if (
            enemy.alive
        ) {

            enemy.mesh.visible =
                original;

        }

    }, 100);

}


// =====================================================
// GEGNER BESIEGT
// =====================================================

function killEnemy(
    enemy
) {

    if (
        !enemy.alive
    ) {
        return;
    }


    enemy.alive =
        false;

    enemy.respawnTimer =
        RESPAWN_TIME;


    enemy.healthUI.container.style.display =
        "none";


    enemy.mesh.rotation.z =
        Math.PI / 2;


    gainXP(
        enemy.xp
    );

    dropLoot(
        enemy
    );


    showMessage(
        `${enemy.name} besiegt! Respawn in ${RESPAWN_TIME}s`
    );


    setTimeout(() => {

        if (
            enemy.mesh.parent
        ) {

            scene.remove(
                enemy.mesh
            );

        }

    }, 500);

}


// =====================================================
// RESPAWN
// =====================================================

function updateRespawns(
    delta
) {

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
            enemy.respawnTimer > 0
        ) {
            continue;
        }


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


        const levelMultiplier =
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
                levelMultiplier
            );

        enemy.maxHealth =
            enemy.health;

        enemy.speed =
            data.speed;

        enemy.damage =
            Math.floor(
                data.damage *
                levelMultiplier
            );

        enemy.xp =
            Math.floor(
                data.xp *
                levelMultiplier
            );

        enemy.goldMin =
            data.goldMin;

        enemy.goldMax =
            data.goldMax;

        enemy.scale =
            data.scale;


        enemy.position.set(
            spawn[0],
            0,
            spawn[1]
        );


        enemy.mesh =
            createEnemyMesh(
                data
            );


        enemy.mesh.position.copy(
            enemy.position
        );


        scene.add(
            enemy.mesh
        );


        enemy.alive =
            true;

        enemy.attackCooldown =
            0;


        if (
            newType === "elite"
        ) {

            showMessage(
                "👑 Ein Elite-Gegner ist zurück!"
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
        0.55;


    sword.rotation.y =
        -0.9;


    setTimeout(() => {

        sword.rotation.y =
            0;

    }, 180);


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
            distance > 4
        ) {
            continue;
        }


        difference.normalize();


        const dot =
            attackDirection.dot(
                difference
            );


        if (
            dot > 0.25
        ) {

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

    enemy.health -=
        damage;


    hitEffect(
        enemy
    );


    if (
        enemy.type === "elite"
    ) {

        showMessage(
            `👑 ELITE -${damage}`
        );

    }
    else {

        showMessage(
            `-${damage}`
        );

    }


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

function updateEnemies(
    delta
) {

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
            distance > 2.2
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
// HÄNDLER-MENÜ
// =====================================================

function distanceToMerchant() {

    return player.position.distanceTo(
        merchantPosition
    );

}


function openMerchant() {

    if (
        distanceToMerchant() > 6
    ) {

        showMessage(
            "🧑 Komm näher zum Händler!"
        );

        return;
    }


    if (
        document.getElementById(
            "merchantMenu"
        )
    ) {
        return;
    }


    const menu =
        document.createElement(
            "div"
        );


    menu.id =
        "merchantMenu";


    menu.style.position =
        "fixed";

    menu.style.left =
        "50%";

    menu.style.top =
        "50%";

    menu.style.transform =
        "translate(-50%, -50%)";

    menu.style.background =
        "rgba(15,15,20,0.96)";

    menu.style.padding =
        "30px";

    menu.style.border =
        "3px solid #d4af37";

    menu.style.borderRadius =
        "12px";

    menu.style.color =
        "white";

    menu.style.zIndex =
        "100";

    menu.style.minWidth =
        "350px";


    menu.innerHTML = `

        <h2>🧑 Händler</h2>

        <p>
            Gold: <b id="merchantGold">
            ${player.gold}
            </b>
        </p>

        <hr>

        <button id="buyPotion">
            Heiltrank kaufen – 15 Gold
        </button>

        <br><br>

        <button id="buyIron">
            Eisen kaufen – 10 Gold
        </button>

        <br><br>

        <button id="sellLeather">
            Leder verkaufen – +8 Gold
        </button>

        <br><br>

        <button id="closeMerchant">
            Schließen
        </button>

    `;


    document.body.appendChild(
        menu
    );


    document
        .getElementById(
            "buyPotion"
        )
        .onclick = () => {

            if (
                player.gold < 15
            ) {

                showMessage(
                    "Nicht genug Gold!"
                );

                return;
            }


            player.gold -= 15;

            inventory["Goldmünze"] -=
                15;

            inventory["Heiltrank"]++;


            updateHUD();

            saveGame(false);

        };


    document
        .getElementById(
            "buyIron"
        )
        .onclick = () => {

            if (
                player.gold < 10
            ) {

                showMessage(
                    "Nicht genug Gold!"
                );

                return;
            }


            player.gold -= 10;

            inventory["Goldmünze"] -=
                10;

            inventory["Eisen"]++;


            updateHUD();

            saveGame(false);

        };


    document
        .getElementById(
            "sellLeather"
        )
        .onclick = () => {

            if (
                inventory["Leder"] <= 0
            ) {

                showMessage(
                    "Du hast kein Leder!"
                );

                return;
            }


            inventory["Leder"]--;

            player.gold += 8;

            inventory["Goldmünze"] += 8;


            updateHUD();

            saveGame(false);

        };


    document
        .getElementById(
            "closeMerchant"
        )
        .onclick = () => {

            menu.remove();

        };

}


// =====================================================
// INVENTAR
// =====================================================

function toggleInventory() {

    const existing =
        document.getElementById(
            "inventoryMenu"
        );


    if (
        existing
    ) {

        existing.remove();

        return;

    }


    const menu =
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
        `<p>⚔️ Waffe: ${player.weapon}</p>`;

    html +=
        `<p>🛡️ Rüstung: ${player.armor}</p>`;

    html += `<hr>`;


    for (
        const item in inventory
    ) {

        html +=
            `<p>${item}: ${inventory[item]}</p>`;

    }


    html +=
        `<button id="closeInventory">
            Schließen
        </button>`;


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
            JSON.parse(
                raw
            );


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

    }
    catch (error) {

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

        ⚔️ ${player.weapon}<br>

        🛡️ ${player.armor}<br>

        🎒 ${inventory["Heiltrank"]} Heiltrank<br>

        👾 Gegner:
        ${
            enemies.filter(
                e => e.alive
            ).length
        }/${MAX_ENEMIES}

        <br><br>

        ${
            distanceToMerchant() < 6
                ? "🧑 Händler: E drücken"
                : ""
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

            if (
                distanceToMerchant() < 6
            ) {

                openMerchant();

            }
            else {

                attack();

            }

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


        if (
            event.code ===
            "F5"
        ) {

            event.preventDefault();

            saveGame();

        }


        if (
            event.code ===
            "F9"
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


        if (
            event.target.closest(
                "#merchantMenu"
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

        const targetAngle =
            Math.atan2(
                direction.x,
                direction.z
            );


        playerMesh.rotation.y =
            targetAngle;

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
        1.4;


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

    updateEnemyHealthBars();

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
