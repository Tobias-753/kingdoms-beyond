import * as THREE from "three";

// ============================================================
// KINGDOMS BEYOND 0.7
// ============================================================
// - Detailliertere humanoide Charaktere
// - Unterschiedliche Gegnerkörper
// - Burg mit Innenhof
// - Händler + Shop
// - Waffen kaufen UND alte Waffen behalten
// - Waffen aus Inventar ausrüsten
// - Rüstungen kaufen und wechseln
// - Burgtor / Ausgang
// - Sicherheitsbereich Burg
// - Kollisionen mit Wänden und Objekten
// - Speichern / Laden
// ============================================================


// ============================================================
// SZENE
// ============================================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87ceeb);

scene.fog = new THREE.Fog(
    0x87ceeb,
    55,
    190
);


// ============================================================
// KAMERA
// ============================================================

const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    500
);


// ============================================================
// RENDERER
// ============================================================

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


// ============================================================
// LICHT
// ============================================================

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
    50,
    90,
    30
);

sun.castShadow = true;

scene.add(sun);


// ============================================================
// BODEN
// ============================================================

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(
        320,
        320
    ),
    new THREE.MeshStandardMaterial({
        color: 0x416b37
    })
);

ground.rotation.x = -Math.PI / 2;

ground.receiveShadow = true;

scene.add(ground);


// ============================================================
// MATERIALIEN
// ============================================================

const materials = {

    skin:
        new THREE.MeshStandardMaterial({
            color: 0xc98f72
        }),

    skinDark:
        new THREE.MeshStandardMaterial({
            color: 0x8e5c47
        }),

    hair:
        new THREE.MeshStandardMaterial({
            color: 0x3a2418
        }),

    shirt:
        new THREE.MeshStandardMaterial({
            color: 0x315d8c
        }),

    shirtDark:
        new THREE.MeshStandardMaterial({
            color: 0x233c5c
        }),

    pants:
        new THREE.MeshStandardMaterial({
            color: 0x292d35
        }),

    boots:
        new THREE.MeshStandardMaterial({
            color: 0x241811
        }),

    metal:
        new THREE.MeshStandardMaterial({
            color: 0x9da5ad,
            metalness: 0.75,
            roughness: 0.25
        }),

    darkMetal:
        new THREE.MeshStandardMaterial({
            color: 0x343b45,
            metalness: 0.8,
            roughness: 0.3
        }),

    gold:
        new THREE.MeshStandardMaterial({
            color: 0xd6a72c,
            metalness: 0.75
        }),

    red:
        new THREE.MeshStandardMaterial({
            color: 0x8d2424
        }),

    leather:
        new THREE.MeshStandardMaterial({
            color: 0x65402b
        }),

    white:
        new THREE.MeshStandardMaterial({
            color: 0xe8e8e8
        }),

    black:
        new THREE.MeshStandardMaterial({
            color: 0x151515
        })

};


// ============================================================
// HILFSFUNKTIONEN
// ============================================================

function box(
    x,
    y,
    z,
    material
) {

    const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(
            x,
            y,
            z
        ),
        material
    );

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return mesh;

}


function sphere(
    radius,
    material
) {

    const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(
            radius,
            16,
            12
        ),
        material
    );

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return mesh;

}


function cylinder(
    radiusTop,
    radiusBottom,
    height,
    material
) {

    const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(
            radiusTop,
            radiusBottom,
            height,
            12
        ),
        material
    );

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return mesh;

}


// ============================================================
// WELT-DEKORATION
// ============================================================

function createTree(
    x,
    z
) {

    const tree =
        new THREE.Group();

    const trunk =
        cylinder(
            0.45,
            0.65,
            4,
            materials.leather
        );

    trunk.position.y = 2;

    tree.add(trunk);

    const leaves =
        new THREE.Mesh(
            new THREE.ConeGeometry(
                2.7,
                6,
                10
            ),
            new THREE.MeshStandardMaterial({
                color: 0x205a2d
            })
        );

    leaves.position.y = 6;

    leaves.castShadow = true;

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

    createTree(
        p[0],
        p[1]
    );

});


function createRock(
    x,
    z
) {

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

    rock.castShadow = true;

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


// ============================================================
// BURG
// ============================================================

const castle = {

    minX: -16,
    maxX: 16,

    minZ: -18,
    maxZ: 12,

    safeRadius: 28

};


const castleWalls = [];


function createCastleWall(
    x,
    y,
    z,
    width,
    height,
    depth
) {

    const wall =
        box(
            width,
            height,
            depth,
            materials.darkMetal
        );

    wall.position.set(
        x,
        y,
        z
    );

    scene.add(wall);

    castleWalls.push({
        x,
        z,
        width,
        depth
    });

    return wall;

}


// Hintere Wand
createCastleWall(
    0,
    5,
    -18,
    34,
    10,
    2
);


// Linke Wand
createCastleWall(
    -16,
    5,
    -3,
    2,
    10,
    30
);


// Rechte Wand
createCastleWall(
    16,
    5,
    -3,
    2,
    10,
    30
);


// Vorderwand mit Torbereichen
createCastleWall(
    -11,
    5,
    12,
    10,
    10,
    2
);

createCastleWall(
    11,
    5,
    12,
    10,
    10,
    2
);


// ============================================================
// BURGTOR
// ============================================================

const gate = new THREE.Group();

const gateLeft =
    box(
        5,
        8,
        1,
        materials.leather
    );

gateLeft.position.set(
    -2.5,
    4,
    12
);

gate.add(gateLeft);


const gateRight =
    box(
        5,
        8,
        1,
        materials.leather
    );

gateRight.position.set(
    2.5,
    4,
    12
);

gate.add(gateRight);


const gateTop =
    box(
        10,
        2,
        1,
        materials.darkMetal
    );

gateTop.position.set(
    0,
    9,
    12
);

gate.add(gateTop);

scene.add(gate);


// ============================================================
// BURGTÜRME
// ============================================================

function createTower(
    x,
    z
) {

    const tower =
        cylinder(
            3,
            3.2,
            13,
            materials.darkMetal
        );

    tower.position.set(
        x,
        6.5,
        z
    );

    scene.add(tower);

    const roof =
        new THREE.Mesh(
            new THREE.ConeGeometry(
                3.8,
                5,
                8
            ),
            materials.red
        );

    roof.position.set(
        x,
        15,
        z
    );

    roof.castShadow = true;

    scene.add(roof);

}


createTower(-16, -18);
createTower(16, -18);
createTower(-16, 12);
createTower(16, 12);


// ============================================================
// HOF
// ============================================================

const courtyard =
    box(
        20,
        0.2,
        17,
        new THREE.MeshStandardMaterial({
            color: 0x77736a
        })
    );

courtyard.position.set(
    0,
    0.1,
    -3
);

scene.add(courtyard);


// ============================================================
// SPIELER-DATEN
// ============================================================

const player = {

    position:
        new THREE.Vector3(
            0,
            0,
            25
        ),

    velocityY: 0,

    speed: 7,

    runningSpeed: 12,

    onGround: true,

    health: 100,

    maxHealth: 100,

    level: 1,

    xp: 0,

    xpToNextLevel: 100,

    gold: 150,

    attackCooldown: 0,

    weapon: "Eisenschwert",

    weaponDamage: 25,

    armor: "Keine Rüstung",

    armorBonus: 0

};


// ============================================================
// WAFFEN
// ============================================================

const weapons = {

    "Eisenschwert": {

        damage: 25,

        price: 0,

        color: 0xcfd8dc,

        length: 2.5

    },

    "Stahlschwert": {

        damage: 40,

        price: 100,

        color: 0xb0bec5,

        length: 2.7

    },

    "Langschwert": {

        damage: 60,

        price: 220,

        color: 0xe0e0e0,

        length: 3

    },

    "Königsschwert": {

        damage: 90,

        price: 450,

        color: 0xd4af37,

        length: 3.2

    }

};


// ============================================================
// RÜSTUNGEN
// ============================================================

const armors = {

    "Keine Rüstung": {

        bonus: 0,

        price: 0

    },

    "Lederrüstung": {

        bonus: 5,

        price: 100

    },

    "Eisenrüstung": {

        bonus: 12,

        price: 250

    },

    "Ritterrüstung": {

        bonus: 22,

        price: 500

    }

};


// ============================================================
// INVENTAR
// ============================================================

const inventory = {

    potions: 3,

    weapons: {

        "Eisenschwert": 1

    },

    armors: {

        "Keine Rüstung": 1

    }

};


// ============================================================
// HELDEN-MODELL
// ============================================================

const playerMesh =
    new THREE.Group();


// Körper
const playerBody =
    box(
        1.15,
        1.7,
        0.7,
        materials.shirt
    );

playerBody.position.y = 2.2;

playerMesh.add(playerBody);


// Gürtel
const belt =
    box(
        1.2,
        0.2,
        0.75,
        materials.leather
    );

belt.position.y = 1.55;

playerMesh.add(belt);


// Kopf
const playerHead =
    sphere(
        0.55,
        materials.skin
    );

playerHead.position.y = 3.65;

playerMesh.add(playerHead);


// Haare
const hair =
    new THREE.Mesh(
        new THREE.SphereGeometry(
            0.58,
            16,
            8,
            0,
            Math.PI * 2,
            0,
            Math.PI * 0.5
        ),
        materials.hair
    );

hair.position.y = 3.9;

playerMesh.add(hair);


// Augen
const eye1 =
    sphere(
        0.055,
        materials.white
    );

eye1.position.set(
    -0.18,
    3.7,
    -0.49
);

playerMesh.add(eye1);


const eye2 =
    sphere(
        0.055,
        materials.white
    );

eye2.position.set(
    0.18,
    3.7,
    -0.49
);

playerMesh.add(eye2);


// Arme
const leftArm =
    cylinder(
        0.18,
        0.2,
        1.45,
        materials.shirt
    );

leftArm.position.set(
    -0.78,
    2.25,
    0
);

leftArm.rotation.z =
    -0.12;

playerMesh.add(leftArm);


const rightArm =
    cylinder(
        0.18,
        0.2,
        1.45,
        materials.shirt
    );

rightArm.position.set(
    0.78,
    2.25,
    0
);

rightArm.rotation.z =
    0.12;

playerMesh.add(rightArm);


// Hände
const leftHand =
    sphere(
        0.2,
        materials.skin
    );

leftHand.position.set(
    -0.82,
    1.5,
    0
);

playerMesh.add(leftHand);


const rightHand =
    sphere(
        0.2,
        materials.skin
    );

rightHand.position.set(
    0.82,
    1.5,
    0
);

playerMesh.add(rightHand);


// Beine
const leftLeg =
    box(
        0.38,
        1.4,
        0.42,
        materials.pants
    );

leftLeg.position.set(
    -0.3,
    0.65,
    0
);

playerMesh.add(leftLeg);


const rightLeg =
    box(
        0.38,
        1.4,
        0.42,
        materials.pants
    );

rightLeg.position.set(
    0.3,
    0.65,
    0
);

playerMesh.add(rightLeg);


// Stiefel
const leftBoot =
    box(
        0.48,
        0.35,
        0.7,
        materials.boots
    );

leftBoot.position.set(
    -0.3,
    -0.05,
    -0.12
);

playerMesh.add(leftBoot);


const rightBoot =
    box(
        0.48,
        0.35,
        0.7,
        materials.boots
    );

rightBoot.position.set(
    0.3,
    -0.05,
    -0.12
);

playerMesh.add(rightBoot);


playerMesh.position.copy(
    player.position
);

playerMesh.scale.setScalar(
    0.9
);

scene.add(playerMesh);


// ============================================================
// SCHWERT
// ============================================================

const sword =
    new THREE.Group();

const blade =
    box(
        0.16,
        2.7,
        0.3,
        new THREE.MeshStandardMaterial({
            color:
                weapons[player.weapon].color,
            metalness: 0.85,
            roughness: 0.2
        })
    );

blade.position.y = 1.35;

sword.add(blade);


const handle =
    box(
        0.2,
        0.75,
        0.2,
        materials.leather
    );

handle.position.y = -0.35;

sword.add(handle);


const guard =
    box(
        0.9,
        0.15,
        0.18,
        materials.gold
    );

guard.position.y = 0;

sword.add(guard);


// Waffe in rechte Hand
sword.position.set(
    0.95,
    1.5,
    -0.05
);


// Das Schwert zeigt zunächst nach vorne
sword.rotation.x =
    Math.PI / 2;

playerMesh.add(sword);


// ============================================================
// WAFFE AKTUALISIEREN
// ============================================================

function updateSwordVisual() {

    const data =
        weapons[player.weapon];

    blade.scale.y =
        data.length / 2.7;

    blade.material.color.setHex(
        data.color
    );

    player.weaponDamage =
        data.damage;

}


// ============================================================
// GEGNERTYPEN
// ============================================================

const enemyTypes = {

    grunt: {

        name: "Grunt",

        health: 55,

        speed: 2.1,

        damage: 10,

        xp: 50,

        goldMin: 5,

        goldMax: 15,

        scale: 1

    },

    runner: {

        name: "Runner",

        health: 38,

        speed: 4.2,

        damage: 7,

        xp: 65,

        goldMin: 7,

        goldMax: 18,

        scale: 0.9

    },

    tank: {

        name: "Tank",

        health: 130,

        speed: 1.2,

        damage: 18,

        xp: 110,

        goldMin: 12,

        goldMax: 25,

        scale: 1.25

    },

    elite: {

        name: "Elite",

        health: 230,

        speed: 2,

        damage: 25,

        xp: 250,

        goldMin: 30,

        goldMax: 60,

        scale: 1.3

    }

};


// ============================================================
// GEGNER-MODELL
// ============================================================

function createEnemyModel(
    type
) {

    const group =
        new THREE.Group();

    const data =
        enemyTypes[type];


    let bodyMaterial =
        materials.red;

    if (type === "runner") {

        bodyMaterial =
            new THREE.MeshStandardMaterial({
                color: 0xc45b20
            });

    }

    if (type === "tank") {

        bodyMaterial =
            materials.darkMetal;

    }

    if (type === "elite") {

        bodyMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x6d2d8f
            });

    }


    // Körper
    const body =
        box(
            type === "tank" ? 1.5 : 1.05,
            type === "tank" ? 1.9 : 1.6,
            0.75,
            bodyMaterial
        );

    body.position.y = 2.1;

    group.add(body);


    // Kopf
    const head =
        sphere(
            type === "tank"
                ? 0.62
                : 0.52,
            materials.skinDark
        );

    head.position.y = 3.55;

    group.add(head);


    // Augen
    const e1 =
        sphere(
            0.06,
            materials.red
        );

    e1.position.set(
        -0.17,
        3.62,
        -0.48
    );

    group.add(e1);


    const e2 =
        sphere(
            0.06,
            materials.red
        );

    e2.position.set(
        0.17,
        3.62,
        -0.48
    );

    group.add(e2);


    // Arme
    const armWidth =
        type === "tank"
            ? 0.27
            : 0.19;

    const armLength =
        type === "tank"
            ? 1.5
            : 1.4;


    const arm1 =
        cylinder(
            armWidth,
            armWidth,
            armLength,
            bodyMaterial
        );

    arm1.position.set(
        -0.75,
        2.2,
        0
    );

    arm1.rotation.z =
        -0.1;

    group.add(arm1);


    const arm2 =
        cylinder(
            armWidth,
            armWidth,
            armLength,
            bodyMaterial
        );

    arm2.position.set(
        0.75,
        2.2,
        0
    );

    arm2.rotation.z =
        0.1;

    group.add(arm2);


    // Beine
    const leg1 =
        box(
            0.4,
            1.45,
            0.42,
            materials.pants
        );

    leg1.position.set(
        -0.28,
        0.65,
        0
    );

    group.add(leg1);


    const leg2 =
        box(
            0.4,
            1.45,
            0.42,
            materials.pants
        );

    leg2.position.set(
        0.28,
        0.65,
        0
    );

    group.add(leg2);


    // Tank-Rüstung
    if (
        type === "tank" ||
        type === "elite"
    ) {

        const shoulder1 =
            sphere(
                0.38,
                materials.metal
            );

        shoulder1.position.set(
            -0.82,
            2.8,
            0
        );

        group.add(
            shoulder1
        );


        const shoulder2 =
            sphere(
                0.38,
                materials.metal
            );

        shoulder2.position.set(
            0.82,
            2.8,
            0
        );

        group.add(
            shoulder2
        );

    }


    // Elite-Krone
    if (
        type === "elite"
    ) {

        const crown =
            new THREE.Group();

        for (
            let i = -1;
            i <= 1;
            i++
        ) {

            const spike =
                new THREE.Mesh(
                    new THREE.ConeGeometry(
                        0.13,
                        0.55,
                        5
                    ),
                    materials.gold
                );

            spike.position.set(
                i * 0.22,
                4.15,
                0
            );

            crown.add(spike);

        }

        group.add(crown);

    }


    group.scale.setScalar(
        data.scale
    );

    return group;

}


// ============================================================
// GEGNER
// ============================================================

const enemies = [];

const MAX_ENEMIES = 6;

const RESPAWN_TIME = 15;


const spawnPoints = [

    [40, -15],
    [-40, 15],
    [35, 30],
    [-35, -30],
    [30, 25],
    [-30, -20],
    [45, 5],
    [-45, -5]

];


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

        name: data.name,

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
            createEnemyModel(type)

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
            "👑 ELITE-GEGNER!"
        );

    }

}


spawnEnemy("grunt");
spawnEnemy("grunt");
spawnEnemy("runner");
spawnEnemy("tank");


// ============================================================
// HÄNDLER
// ============================================================

const merchant =
    new THREE.Group();

const merchantBody =
    box(
        1.1,
        1.6,
        0.7,
        new THREE.MeshStandardMaterial({
            color: 0x6d4930
        })
    );

merchantBody.position.y = 2.2;

merchant.add(merchantBody);


const merchantHead =
    sphere(
        0.55,
        materials.skin
    );

merchantHead.position.y = 3.65;

merchant.add(merchantHead);


const merchantHat =
    cylinder(
        0.65,
        0.75,
        0.35,
        materials.gold
    );

merchantHat.position.y = 4.15;

merchant.add(merchantHat);


const merchantArm1 =
    cylinder(
        0.18,
        0.2,
        1.4,
        materials.leather
    );

merchantArm1.position.set(
    -0.75,
    2.2,
    0
);

merchant.add(merchantArm1);


const merchantArm2 =
    cylinder(
        0.18,
        0.2,
        1.4,
        materials.leather
    );

merchantArm2.position.set(
    0.75,
    2.2,
    0
);

merchant.add(merchantArm2);


const merchantLeg1 =
    box(
        0.4,
        1.4,
        0.4,
        materials.pants
    );

merchantLeg1.position.set(
    -0.3,
    0.65,
    0
);

merchant.add(merchantLeg1);


const merchantLeg2 =
    box(
        0.4,
        1.4,
        0.4,
        materials.pants
    );

merchantLeg2.position.set(
    0.3,
    0.65,
    0
);

merchant.add(merchantLeg2);


merchant.position.set(
    0,
    0,
    -5
);

scene.add(
    merchant
);


// ============================================================
// SHOP
// ============================================================

function openShop() {

    if (
        document.getElementById(
            "shopMenu"
        )
    ) {

        return;

    }


    const menu =
        document.createElement(
            "div"
        );

    menu.id =
        "shopMenu";


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

    menu.style.color =
        "white";

    menu.style.padding =
        "25px";

    menu.style.border =
        "2px solid #d6a72c";

    menu.style.borderRadius =
        "12px";

    menu.style.minWidth =
        "420px";

    menu.style.maxHeight =
        "80vh";

    menu.style.overflow =
        "auto";

    menu.style.zIndex =
        "100";


    renderShop(
        menu
    );

    document.body.appendChild(
        menu
    );

}


function renderShop(
    menu
) {

    let html = `

        <h2>🧑 Händler</h2>

        <p>🪙 Gold: ${player.gold}</p>

        <hr>

        <h3>⚔️ Waffen kaufen</h3>

    `;


    for (
        const name in weapons
    ) {

        const weapon =
            weapons[name];

        const owned =
            !!inventory.weapons[name];

        const equipped =
            player.weapon === name;


        html += `

            <div style="
                padding:10px;
                margin:6px 0;
                border:1px solid #555;
                border-radius:8px;
            ">

                <b>${name}</b><br>

                Schaden: ${weapon.damage}<br>

                Preis: ${
                    weapon.price === 0
                        ? "Startwaffe"
                        : weapon.price + " Gold"
                }<br>

                ${
                    equipped
                        ? "✓ AUSGERÜSTET"
                        : owned
                            ? `<button
                                onclick="equipWeapon('${name}')"
                              >
                                AUSGERÜSTEN
                              </button>`
                            : `<button
                                onclick="buyWeapon('${name}')"
                              >
                                KAUFEN
                              </button>`
                }

            </div>

        `;

    }


    html += `

        <h3>🛡️ Rüstung kaufen</h3>

    `;


    for (
        const name in armors
    ) {

        const armor =
            armors[name];

        const owned =
            !!inventory.armors[name];

        const equipped =
            player.armor === name;


        html += `

            <div style="
                padding:10px;
                margin:6px 0;
                border:1px solid #555;
                border-radius:8px;
            ">

                <b>${name}</b><br>

                Schutz: ${armor.bonus}<br>

                Preis: ${
                    armor.price === 0
                        ? "Startausrüstung"
                        : armor.price + " Gold"
                }<br>

                ${
                    equipped
                        ? "✓ AUSGERÜSTET"
                        : owned
                            ? `<button
                                onclick="equipArmor('${name}')"
                              >
                                AUSGERÜSTEN
                              </button>`
                            : `<button
                                onclick="buyArmor('${name}')"
                              >
                                KAUFEN
                              </button>`
                }

            </div>

        `;

    }


    html += `

        <hr>

        <button
            onclick="
                document
                .getElementById('shopMenu')
                .remove()
            "
            style="
                padding:10px 20px;
                cursor:pointer;
            "
        >
            Schließen
        </button>

    `;


    menu.innerHTML =
        html;

}


// ============================================================
// WAFFE KAUFEN
// ============================================================

window.buyWeapon =
function(name) {

    const weapon =
        weapons[name];


    if (
        inventory.weapons[name]
    ) {

        showMessage(
            "Diese Waffe besitzt du bereits."
        );

        return;

    }


    if (
        player.gold <
        weapon.price
    ) {

        showMessage(
            "Nicht genug Gold!"
        );

        return;

    }


    player.gold -=
        weapon.price;


    inventory.weapons[name] =
        1;


    showMessage(
        `${name} gekauft!`
    );


    updateHUD();

    saveGame(false);


    const menu =
        document.getElementById(
            "shopMenu"
        );

    if (menu) {

        renderShop(menu);

    }

};


// ============================================================
// WAFFE AUSRÜSTEN
// ============================================================

window.equipWeapon =
function(name) {

    if (
        !inventory.weapons[name]
    ) {

        return;

    }


    player.weapon =
        name;


    player.weaponDamage =
        weapons[name].damage;


    updateSwordVisual();

    updateHUD();

    saveGame(false);


    showMessage(
        `${name} ausgerüstet`
    );


    const menu =
        document.getElementById(
            "shopMenu"
        );

    if (menu) {

        renderShop(menu);

    }

};


// ============================================================
// RÜSTUNG KAUFEN
// ============================================================

window.buyArmor =
function(name) {

    const armor =
        armors[name];


    if (
        inventory.armors[name]
    ) {

        return;

    }


    if (
        player.gold <
        armor.price
    ) {

        showMessage(
            "Nicht genug Gold!"
        );

        return;

    }


    player.gold -=
        armor.price;


    inventory.armors[name] =
        1;


    showMessage(
        `${name} gekauft!`
    );


    saveGame(false);

    updateHUD();


    const menu =
        document.getElementById(
            "shopMenu"
        );

    if (menu) {

        renderShop(menu);

    }

};


// ============================================================
// RÜSTUNG AUSRÜSTEN
// ============================================================

window.equipArmor =
function(name) {

    if (
        !inventory.armors[name]
    ) {

        return;

    }


    player.armor =
        name;


    player.armorBonus =
        armors[name].bonus;


    updateHUD();

    saveGame(false);


    showMessage(
        `${name} ausgerüstet`
    );


    const menu =
        document.getElementById(
            "shopMenu"
        );

    if (menu) {

        renderShop(menu);

    }

};


// ============================================================
// SHOP-NÄHE
// ============================================================

function checkMerchant() {

    const distance =
        player.position.distanceTo(
            merchant.position
        );


    if (
        distance < 4
    ) {

        showInteraction(
            "E – Händler öffnen"
        );

        if (
            keys["KeyE"]
        ) {

            keys["KeyE"] =
                false;

            openShop();

        }

    }

}


// ============================================================
// INVENTAR
// ============================================================

function toggleInventory() {

    const old =
        document.getElementById(
            "inventoryMenu"
        );

    if (old) {

        old.remove();

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
        "rgba(10,10,10,0.96)";

    menu.style.color =
        "white";

    menu.style.padding =
        "25px";

    menu.style.border =
        "2px solid white";

    menu.style.borderRadius =
        "12px";

    menu.style.zIndex =
        "100";

    menu.style.minWidth =
        "380px";


    let html = `

        <h2>🎒 Inventar</h2>

        <p>⭐ Level ${player.level}</p>

        <p>🪙 Gold ${player.gold}</p>

        <p>❤️ ${player.health}/${player.maxHealth}</p>

        <p>🧪 Heiltränke: ${inventory.potions}</p>

        <hr>

        <h3>⚔️ Waffen</h3>

    `;


    for (
        const name in inventory.weapons
    ) {

        html += `

            <p>
                ${name}
                –
                Schaden ${weapons[name].damage}

                ${
                    player.weapon === name
                        ? " ✓ AUSGERÜSTET"
                        : `
                            <button
                                onclick="equipWeapon('${name}')"
                            >
                                Ausrüsten
                            </button>
                        `
                }

            </p>

        `;

    }


    html += `
        <h3>🛡️ Rüstungen</h3>
    `;


    for (
        const name in inventory.armors
    ) {

        html += `

            <p>
                ${name}
                –
                Schutz ${armors[name].bonus}

                ${
                    player.armor === name
                        ? " ✓ AUSGERÜSTET"
                        : `
                            <button
                                onclick="equipArmor('${name}')"
                            >
                                Ausrüsten
                            </button>
                        `
                }

            </p>

        `;

    }


    html += `

        <hr>

        <button
            onclick="
                document
                .getElementById('inventoryMenu')
                .remove()
            "
        >
            Schließen
        </button>

    `;


    menu.innerHTML =
        html;


    document.body.appendChild(
        menu
    );

}


// ============================================================
// KAMPF
// ============================================================

function attack() {

    if (
        player.attackCooldown > 0
    ) {

        return;

    }


    player.attackCooldown =
        0.55;


    // Schwert schlägt nach vorne
    sword.rotation.z =
        -Math.PI * 0.8;


    setTimeout(() => {

        sword.rotation.z =
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


    let hit =
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


        difference.y =
            0;


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

            hit = true;

            damageEnemy(
                enemy,
                player.weaponDamage
            );

        }

    }

}


// ============================================================
// GEGNER SCHADEN
// ============================================================

function damageEnemy(
    enemy,
    damage
) {

    enemy.health -=
        damage;


    if (
        enemy.health <= 0
    ) {

        killEnemy(
            enemy
        );

    }

}


// ============================================================
// GEGNER KI
// ============================================================

function updateEnemies(
    delta
) {

    const inCastle =
        isInsideCastle(
            player.position
        );


    for (
        const enemy of enemies
    ) {

        if (
            !enemy.alive
        ) {

            continue;

        }


        // Gegner greifen im sicheren Burgbereich nicht an
        if (
            inCastle
        ) {

            continue;

        }


        const direction =
            player.position
                .clone()
                .sub(
                    enemy.position
                );


        direction.y =
            0;


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


// ============================================================
// GEGNER BESIEGT
// ============================================================

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


    gainXP(
        enemy.xp
    );


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


    if (
        Math.random() < 0.3
    ) {

        inventory.potions++;

    }


    scene.remove(
        enemy.mesh
    );


    showMessage(
        `${enemy.name} besiegt! +${gold} Gold`
    );


    saveGame(false);

}


// ============================================================
// RESPAWN
// ============================================================

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


            const levelMultiplier =
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


            enemy.position.set(
                spawn[0],
                0,
                spawn[1]
            );


            enemy.mesh =
                createEnemyModel(
                    type
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

        }

    }

}


// ============================================================
// XP
// ============================================================

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

}


// ============================================================
// LEVEL UP
// ============================================================

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


    showMessage(
        `⭐ LEVEL ${player.level}!`
    );

}


// ============================================================
// SPIELER SCHADEN
// ============================================================

function damagePlayer(
    damage
) {

    if (
        isInsideCastle(
            player.position
        )
    ) {

        return;

    }


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


    if (
        player.health <= 0
    ) {

        gameOver();

    }

}


// ============================================================
// HEILTRANK
// ============================================================

function usePotion() {

    if (
        inventory.potions <= 0
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


    inventory.potions--;


    player.health =
        Math.min(
            player.maxHealth,
            player.health + 40
        );


    showMessage(
        "+40 HP"
    );


    saveGame(false);

}


// ============================================================
// BURG-BEREICH
// ============================================================

function isInsideCastle(
    position
) {

    return (
        position.x > -15 &&
        position.x < 15 &&
        position.z > -17 &&
        position.z < 11
    );

}


// ============================================================
// KOLLISION
// ============================================================

function collidesWithCastle(
    position
) {

    const radius =
        0.7;


    // Hintere Wand
    if (
        position.z < -17 &&
        Math.abs(position.x) < 15
    ) {

        return true;

    }


    // Linke Wand
    if (
        position.x < -15 &&
        position.z > -17 &&
        position.z < 11
    ) {

        return true;

    }


    // Rechte Wand
    if (
        position.x > 15 &&
        position.z > -17 &&
        position.z < 11
    ) {

        return true;

    }


    // Vorderwand links
    if (
        position.z > 11 &&
        position.z < 13 &&
        position.x > -15 &&
        position.x < -5
    ) {

        return true;

    }


    // Vorderwand rechts
    if (
        position.z > 11 &&
        position.z < 13 &&
        position.x > 5 &&
        position.x < 15
    ) {

        return true;

    }


    return false;

}


// ============================================================
// SPIELERBEWEGUNG
// ============================================================

const keys = {};

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


        const nextPosition =
            player.position
                .clone()
                .add(
                    direction
                        .clone()
                        .multiplyScalar(
                            speed * delta
                        )
                );


        if (
            !collidesWithCastle(
                nextPosition
            )
        ) {

            player.position.copy(
                nextPosition
            );

        }


        playerMesh.rotation.y =
            cameraYaw;


        // einfache Laufbewegung
        const walk =
            Math.sin(
                performance.now() *
                0.012
            ) * 0.3;


        leftLeg.rotation.x =
            walk;

        rightLeg.rotation.x =
            -walk;

        leftArm.rotation.x =
            -walk;

        rightArm.rotation.x =
            walk;

    }


    player.velocityY -=
        25 * delta;


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


// ============================================================
// KAMERA
// ============================================================

let cameraYaw = 0;

let cameraPitch = -0.25;


function updateCamera() {

    const target =
        player.position.clone();


    target.y +=
        2;


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


// ============================================================
// INTERAKTION
// ============================================================

function showInteraction(
    text
) {

    let element =
        document.getElementById(
            "interaction"
        );


    if (!element) {

        element =
            document.createElement(
                "div"
            );

        element.id =
            "interaction";

        element.style.position =
            "fixed";

        element.style.bottom =
            "110px";

        element.style.left =
            "50%";

        element.style.transform =
            "translateX(-50%)";

        element.style.color =
            "white";

        element.style.fontSize =
            "20px";

        element.style.fontWeight =
            "bold";

        element.style.textShadow =
            "2px 2px 4px black";

        element.style.zIndex =
            "30";

        document.body.appendChild(
            element
        );

    }


    element.textContent =
        text;

}


// ============================================================
// TASTATUR
// ============================================================

window.addEventListener(
    "keydown",
    event => {

        keys[event.code] =
            true;


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


// ============================================================
// MAUS
// ============================================================

document.addEventListener(
    "click",
    event => {

        if (
            event.target.closest(
                "#shopMenu"
            )
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


// ============================================================
// HUD
// ============================================================

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

        ⚔️ ${player.weapon}
        (${player.weaponDamage} Schaden)<br>

        🛡️ ${player.armor}
        (+${player.armorBonus})<br>

        🧪 ${inventory.potions} Heiltränke<br>

        🎒 ${Object.keys(inventory.weapons).length} Waffen

    `;


    healthBar.style.width =
        (
            player.health /
            player.maxHealth *
            100
        ) + "%";

}


// ============================================================
// NACHRICHTEN
// ============================================================

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
        "200";


    document.body.appendChild(
        message
    );


    setTimeout(
        () => message.remove(),
        900
    );

}


// ============================================================
// SPEICHERN
// ============================================================

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

            potions:
                inventory.potions,

            weapons:
                inventory.weapons,

            armors:
                inventory.armors

        }

    };


    localStorage.setItem(
        "kingdomsBeyondSave",
        JSON.stringify(
            saveData
        )
    );


    if (show) {

        showMessage(
            "💾 Spiel gespeichert"
        );

    }

}


// ============================================================
// LADEN
// ============================================================

function loadGame() {

    const raw =
        localStorage.getItem(
            "kingdomsBeyondSave"
        );


    if (!raw) {

        updateSwordVisual();

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

        }


        if (
            data.inventory
        ) {

            if (
                data.inventory.potions !==
                undefined
            ) {

                inventory.potions =
                    data.inventory.potions;

            }


            if (
                data.inventory.weapons
            ) {

                inventory.weapons =
                    data.inventory.weapons;

            }


            if (
                data.inventory.armors
            ) {

                inventory.armors =
                    data.inventory.armors;

            }

        }


        player.position.set(
            player.position.x,
            player.position.y,
            player.position.z
        );


        updateSwordVisual();

        updateHUD();


    }
    catch (error) {

        console.error(
            "Save konnte nicht geladen werden:",
            error
        );

    }

}


// ============================================================
// GAME OVER
// ============================================================

function gameOver() {

    if (
        document.getElementById(
            "gameOver"
        )
    ) {

        return;

    }


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
        "300";


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


// ============================================================
// RESIZE
// ============================================================

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


// ============================================================
// GAME LOOP
// ============================================================

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


    checkMerchant();


    updateCamera();


    updateHUD();


    renderer.render(
        scene,
        camera
    );

}


// ============================================================
// START
// ============================================================

loadGame();

updateHUD();

gameLoop();
