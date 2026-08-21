import * as THREE from "three";

// ============================================================
// KINGDOMS BEYOND 0.8
// Charakter-Update
//
// - Detaillierter Held
// - Unterschiedliche humanoide Gegner
// - sichtbare Rüstung
// - sichtbare Waffen
// - Laufanimation
// - Angriffsanimation
// - Gegner-Animation
// - Elite-Gegner
// - Burg + Händler + Shop
// - Waffeninventar
// - Alte Waffen bleiben erhalten
// - Waffen ausrüsten
// - Rüstung ausrüsten
// - Kollisionen
// - sicherer Burgbereich
// - Speichern / Laden
// ============================================================


// ============================================================
// SZENE
// ============================================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87ceeb);

scene.fog = new THREE.Fog(
    0x87ceeb,
    60,
    200
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
renderer.shadowMap.type =
    THREE.PCFSoftShadowMap;

document.body.appendChild(
    renderer.domElement
);


// ============================================================
// LICHT
// ============================================================

scene.add(
    new THREE.HemisphereLight(
        0xffffff,
        0x385238,
        2.2
    )
);

const sun =
    new THREE.DirectionalLight(
        0xffffff,
        2.5
    );

sun.position.set(
    40,
    90,
    30
);

sun.castShadow = true;

sun.shadow.mapSize.width = 2048;
sun.shadow.mapSize.height = 2048;

scene.add(sun);


// ============================================================
// MATERIALIEN
// ============================================================

const MAT = {

    skin:
        new THREE.MeshStandardMaterial({
            color: 0xc8896b,
            roughness: 0.8
        }),

    skinDark:
        new THREE.MeshStandardMaterial({
            color: 0x76503f,
            roughness: 0.9
        }),

    skinGreen:
        new THREE.MeshStandardMaterial({
            color: 0x638b43,
            roughness: 0.9
        }),

    hair:
        new THREE.MeshStandardMaterial({
            color: 0x24160f
        }),

    hairBlond:
        new THREE.MeshStandardMaterial({
            color: 0xb89542
        }),

    clothBlue:
        new THREE.MeshStandardMaterial({
            color: 0x315f92
        }),

    clothRed:
        new THREE.MeshStandardMaterial({
            color: 0x7e2929
        }),

    clothGreen:
        new THREE.MeshStandardMaterial({
            color: 0x3e6536
        }),

    clothBrown:
        new THREE.MeshStandardMaterial({
            color: 0x68452e
        }),

    clothPurple:
        new THREE.MeshStandardMaterial({
            color: 0x603b7d
        }),

    leather:
        new THREE.MeshStandardMaterial({
            color: 0x51321f,
            roughness: 0.85
        }),

    boot:
        new THREE.MeshStandardMaterial({
            color: 0x1b130e,
            roughness: 0.8
        }),

    iron:
        new THREE.MeshStandardMaterial({
            color: 0x737d87,
            metalness: 0.8,
            roughness: 0.28
        }),

    steel:
        new THREE.MeshStandardMaterial({
            color: 0xb8c2ca,
            metalness: 0.9,
            roughness: 0.18
        }),

    darkSteel:
        new THREE.MeshStandardMaterial({
            color: 0x343c46,
            metalness: 0.85,
            roughness: 0.25
        }),

    gold:
        new THREE.MeshStandardMaterial({
            color: 0xd5a928,
            metalness: 0.8,
            roughness: 0.2
        }),

    red:
        new THREE.MeshStandardMaterial({
            color: 0x9d2424
        }),

    black:
        new THREE.MeshStandardMaterial({
            color: 0x101010
        }),

    white:
        new THREE.MeshStandardMaterial({
            color: 0xe9e9e9
        }),

    eye:
        new THREE.MeshStandardMaterial({
            color: 0x222222
        }),

    eyeBlue:
        new THREE.MeshStandardMaterial({
            color: 0x5dd7ff,
            emissive: 0x164c61,
            emissiveIntensity: 0.5
        })

};


// ============================================================
// HILFSFUNKTIONEN
// ============================================================

function box(
    width,
    height,
    depth,
    material
) {

    const mesh =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                width,
                height,
                depth
            ),
            material
        );

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return mesh;

}


function sphere(
    radius,
    material,
    widthSegments = 16,
    heightSegments = 12
) {

    const mesh =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                radius,
                widthSegments,
                heightSegments
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
    material,
    segments = 12
) {

    const mesh =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                radiusTop,
                radiusBottom,
                height,
                segments
            ),
            material
        );

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return mesh;

}


function addLimb(
    parent,
    material,
    radius,
    length,
    x,
    y,
    z
) {

    const limb =
        cylinder(
            radius,
            radius * 1.08,
            length,
            material
        );

    limb.position.set(
        x,
        y,
        z
    );

    parent.add(limb);

    return limb;

}


// ============================================================
// BODEN
// ============================================================

const ground =
    new THREE.Mesh(
        new THREE.PlaneGeometry(
            320,
            320
        ),
        new THREE.MeshStandardMaterial({
            color: 0x416d38,
            roughness: 1
        })
    );

ground.rotation.x =
    -Math.PI / 2;

ground.receiveShadow = true;

scene.add(ground);


// ============================================================
// BÄUME
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
            MAT.leather
        );

    trunk.position.y = 2;

    tree.add(trunk);

    const crown =
        new THREE.Mesh(
            new THREE.ConeGeometry(
                2.7,
                6,
                10
            ),
            new THREE.MeshStandardMaterial({
                color: 0x245b2e
            })
        );

    crown.position.y = 6;

    crown.castShadow = true;

    tree.add(crown);

    tree.position.set(
        x,
        0,
        z
    );

    scene.add(tree);

}


[
    [-28, -25],
    [28, -25],
    [-35, 5],
    [35, 5],
    [-30, 30],
    [30, 30],
    [-5, 38],
    [10, -38],
    [45, 20],
    [-45, -10],
    [45, -20],
    [-45, 25]
].forEach(p =>
    createTree(p[0], p[1])
);


// ============================================================
// FELSEN
// ============================================================

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
                color: 0x707070,
                roughness: 1
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
    [20, 20],
    [-20, 20],
    [25, -5],
    [-25, -5],
    [40, 0],
    [-40, 0]
].forEach(p =>
    createRock(p[0], p[1])
);


// ============================================================
// BURG
// ============================================================

const castleWalls = [];

const castle = {
    minX: -16,
    maxX: 16,
    minZ: -18,
    maxZ: 12
};


function createWall(
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
            MAT.darkSteel
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


// Rückwand
createWall(
    0,
    5,
    -18,
    34,
    10,
    2
);


// Seiten
createWall(
    -16,
    5,
    -3,
    2,
    10,
    30
);

createWall(
    16,
    5,
    -3,
    2,
    10,
    30
);


// Vorderseite mit Toröffnung
createWall(
    -11,
    5,
    12,
    10,
    10,
    2
);

createWall(
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

const gate =
    new THREE.Group();

const gateLeft =
    box(
        4.5,
        8,
        0.8,
        MAT.leather
    );

gateLeft.position.set(
    -2.5,
    4,
    12
);

gate.add(gateLeft);


const gateRight =
    box(
        4.5,
        8,
        0.8,
        MAT.leather
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
        MAT.darkSteel
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
            MAT.darkSteel
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
            MAT.red
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
// BURGHOF
// ============================================================

const courtyard =
    box(
        30,
        0.2,
        27,
        new THREE.MeshStandardMaterial({
            color: 0x77746c
        })
    );

courtyard.position.set(
    0,
    0.1,
    -3
);

scene.add(courtyard);


// ============================================================
// SPIELER
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

    runningSpeed: 11,

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
// WAFFEN
// ============================================================

const weapons = {

    "Eisenschwert": {
        damage: 25,
        price: 0,
        color: 0xbcc6cc,
        length: 2.5
    },

    "Stahlschwert": {
        damage: 40,
        price: 100,
        color: 0xdce5ea,
        length: 2.7
    },

    "Langschwert": {
        damage: 60,
        price: 220,
        color: 0xf1f1f1,
        length: 3
    },

    "Königsschwert": {
        damage: 90,
        price: 450,
        color: 0xd5a928,
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
// HELDENMODELL
// ============================================================

function createHero() {

    const root =
        new THREE.Group();

    root.name =
        "Hero";


    // --------------------------------------------------------
    // Beine
    // --------------------------------------------------------

    const leftLeg =
        box(
            0.38,
            1.55,
            0.45,
            MAT.pants
        );

    leftLeg.position.set(
        -0.28,
        0.78,
        0
    );

    root.add(leftLeg);


    const rightLeg =
        box(
            0.38,
            1.55,
            0.45,
            MAT.pants
        );

    rightLeg.position.set(
        0.28,
        0.78,
        0
    );

    root.add(rightLeg);


    // Schuhe
    const leftBoot =
        box(
            0.48,
            0.38,
            0.72,
            MAT.boot
        );

    leftBoot.position.set(
        -0.28,
        0,
        -0.12
    );

    root.add(leftBoot);


    const rightBoot =
        box(
            0.48,
            0.38,
            0.72,
            MAT.boot
        );

    rightBoot.position.set(
        0.28,
        0,
        -0.12
    );

    root.add(rightBoot);


    // --------------------------------------------------------
    // Hüfte
    // --------------------------------------------------------

    const hips =
        box(
            1.05,
            0.45,
            0.68,
            MAT.leather
        );

    hips.position.y = 1.5;

    root.add(hips);


    // --------------------------------------------------------
    // Körper
    // --------------------------------------------------------

    const body =
        box(
            1.18,
            1.65,
            0.72,
            MAT.clothBlue
        );

    body.position.y = 2.35;

    root.add(body);


    // Brustplatte
    const chestArmor =
        box(
            1.05,
            1.05,
            0.12,
            MAT.iron
        );

    chestArmor.position.set(
        0,
        2.45,
        -0.42
    );

    root.add(chestArmor);


    // Schulterplatten
    const shoulderL =
        sphere(
            0.32,
            MAT.iron
        );

    shoulderL.position.set(
        -0.72,
        2.9,
        0
    );

    root.add(shoulderL);


    const shoulderR =
        sphere(
            0.32,
            MAT.iron
        );

    shoulderR.position.set(
        0.72,
        2.9,
        0
    );

    root.add(shoulderR);


    // --------------------------------------------------------
    // Hals
    // --------------------------------------------------------

    const neck =
        cylinder(
            0.22,
            0.25,
            0.3,
            MAT.skin
        );

    neck.position.y = 3.35;

    root.add(neck);


    // --------------------------------------------------------
    // Kopf
    // --------------------------------------------------------

    const head =
        sphere(
            0.56,
            MAT.skin,
            20,
            16
        );

    head.position.y = 3.85;

    root.add(head);


    // Haare
    const hair =
        sphere(
            0.58,
            MAT.hair,
            20,
            12
        );

    hair.scale.set(
        1,
        0.65,
        1
    );

    hair.position.set(
        0,
        4.1,
        0.02
    );

    root.add(hair);


    // Gesicht
    const eyeL =
        sphere(
            0.065,
            MAT.eye
        );

    eyeL.position.set(
        -0.19,
        3.9,
        -0.51
    );

    root.add(eyeL);


    const eyeR =
        sphere(
            0.065,
            MAT.eye
        );

    eyeR.position.set(
        0.19,
        3.9,
        -0.51
    );

    root.add(eyeR);


    // Nase
    const nose =
        sphere(
            0.08,
            MAT.skinDark
        );

    nose.scale.z = 1.4;

    nose.position.set(
        0,
        3.76,
        -0.56
    );

    root.add(nose);


    // --------------------------------------------------------
    // Arme
    // --------------------------------------------------------

    const leftArm =
        addLimb(
            root,
            MAT.clothBlue,
            0.19,
            1.4,
            -0.8,
            2.35,
            0
        );

    leftArm.rotation.z =
        -0.08;


    const rightArm =
        addLimb(
            root,
            MAT.clothBlue,
            0.19,
            1.4,
            0.8,
            2.35,
            0
        );

    rightArm.rotation.z =
        0.08;


    // Hände
    const leftHand =
        sphere(
            0.21,
            MAT.skin
        );

    leftHand.position.set(
        -0.82,
        1.55,
        0
    );

    root.add(leftHand);


    const rightHand =
        sphere(
            0.21,
            MAT.skin
        );

    rightHand.position.set(
        0.82,
        1.55,
        0
    );

    root.add(rightHand);


    // --------------------------------------------------------
    // Schwert
    // --------------------------------------------------------

    const weaponGroup =
        createSword(
            player.weapon
        );

    weaponGroup.position.set(
        0.9,
        1.55,
        -0.18
    );

    weaponGroup.rotation.z =
        -0.25;

    weaponGroup.rotation.x =
        Math.PI / 2;

    root.add(
        weaponGroup
    );


    root.userData.leftLeg =
        leftLeg;

    root.userData.rightLeg =
        rightLeg;

    root.userData.leftArm =
        leftArm;

    root.userData.rightArm =
        rightArm;

    root.userData.weapon =
        weaponGroup;

    root.userData.chestArmor =
        chestArmor;

    root.userData.shoulderL =
        shoulderL;

    root.userData.shoulderR =
        shoulderR;

    return root;

}


const playerMesh =
    createHero();

playerMesh.position.copy(
    player.position
);

playerMesh.scale.setScalar(
    0.95
);

scene.add(
    playerMesh
);


// ============================================================
// SCHWERT
// ============================================================

function createSword(
    weaponName
) {

    const data =
        weapons[weaponName];


    const sword =
        new THREE.Group();


    const bladeMaterial =
        new THREE.MeshStandardMaterial({
            color: data.color,
            metalness: 0.9,
            roughness: 0.18
        });


    const blade =
        box(
            0.16,
            data.length,
            0.3,
            bladeMaterial
        );

    blade.position.y =
        data.length / 2;

    sword.add(blade);


    // Spitze
    const tip =
        new THREE.Mesh(
            new THREE.ConeGeometry(
                0.14,
                0.42,
                4
            ),
            bladeMaterial
        );

    tip.rotation.z =
        Math.PI;

    tip.position.y =
        data.length + 0.18;

    sword.add(tip);


    const guard =
        box(
            0.85,
            0.14,
            0.16,
            MAT.gold
        );

    guard.position.y =
        0;

    sword.add(guard);


    const handle =
        cylinder(
            0.1,
            0.1,
            0.7,
            MAT.leather
        );

    handle.position.y =
        -0.35;

    sword.add(handle);


    const pommel =
        sphere(
            0.14,
            MAT.gold
        );

    pommel.position.y =
        -0.72;

    sword.add(pommel);


    return sword;

}


function updateWeaponVisual() {

    const oldWeapon =
        playerMesh.userData.weapon;

    if (oldWeapon) {

        playerMesh.remove(
            oldWeapon
        );

    }


    const newWeapon =
        createSword(
            player.weapon
        );

    newWeapon.position.set(
        0.9,
        1.55,
        -0.18
    );

    newWeapon.rotation.z =
        -0.25;

    newWeapon.rotation.x =
        Math.PI / 2;

    playerMesh.add(
        newWeapon
    );

    playerMesh.userData.weapon =
        newWeapon;


    player.weaponDamage =
        weapons[
            player.weapon
        ].damage;

}


// ============================================================
// RÜSTUNG SICHTBAR MACHEN
// ============================================================

function updateArmorVisual() {

    const armor =
        player.armor;


    const chest =
        playerMesh.userData
            .chestArmor;

    const shoulderL =
        playerMesh.userData
            .shoulderL;

    const shoulderR =
        playerMesh.userData
            .shoulderR;


    if (
        armor ===
        "Keine Rüstung"
    ) {

        chest.material =
            MAT.iron;

        chest.visible =
            false;

        shoulderL.visible =
            false;

        shoulderR.visible =
            false;

        return;

    }


    chest.visible =
        true;

    shoulderL.visible =
        true;

    shoulderR.visible =
        true;


    if (
        armor ===
        "Lederrüstung"
    ) {

        chest.material =
            MAT.leather;

        shoulderL.material =
            MAT.leather;

        shoulderR.material =
            MAT.leather;

    }


    if (
        armor ===
        "Eisenrüstung"
    ) {

        chest.material =
            MAT.iron;

        shoulderL.material =
            MAT.iron;

        shoulderR.material =
            MAT.iron;

    }


    if (
        armor ===
        "Ritterrüstung"
    ) {

        chest.material =
            MAT.steel;

        shoulderL.material =
            MAT.steel;

        shoulderR.material =
            MAT.steel;

    }

}


// ============================================================
// GEGNERTYPEN
// ============================================================

const enemyTypes = {

    goblin: {

        name: "Goblin",

        health: 45,

        speed: 3.2,

        damage: 8,

        xp: 40,

        goldMin: 5,

        goldMax: 14,

        scale: 0.78,

        skin: MAT.skinGreen,

        cloth: MAT.clothGreen

    },

    bandit: {

        name: "Bandit",

        health: 65,

        speed: 2.7,

        damage: 12,

        xp: 55,

        goldMin: 8,

        goldMax: 20,

        scale: 1,

        skin: MAT.skin,

        cloth: MAT.clothRed

    },

    orc: {

        name: "Ork",

        health: 110,

        speed: 1.8,

        damage: 18,

        xp: 100,

        goldMin: 12,

        goldMax: 28,

        scale: 1.25,

        skin: MAT.skinGreen,

        cloth: MAT.clothBrown

    },

    knight: {

        name: "Dunkler Ritter",

        health: 150,

        speed: 1.7,

        damage: 22,

        xp: 140,

        goldMin: 15,

        goldMax: 35,

        scale: 1.15,

        skin: MAT.skin,

        cloth: MAT.darkSteel

    },

    elite: {

        name: "Elite-Krieger",

        health: 260,

        speed: 2.0,

        damage: 28,

        xp: 250,

        goldMin: 30,

        goldMax: 70,

        scale: 1.35,

        skin: MAT.skinDark,

        cloth: MAT.clothPurple

    }

};


// ============================================================
// GEGNERMODELL
// ============================================================

function createEnemyModel(
    type
) {

    const data =
        enemyTypes[type];


    const root =
        new THREE.Group();

    root.name =
        type;


    // --------------------------------------------------------
    // Beine
    // --------------------------------------------------------

    const legL =
        box(
            0.38,
            1.45,
            0.42,
            MAT.boot
        );

    legL.position.set(
        -0.28,
        0.72,
        0
    );

    root.add(legL);


    const legR =
        box(
            0.38,
            1.45,
            0.42,
            MAT.boot
        );

    legR.position.set(
        0.28,
        0.72,
        0
    );

    root.add(legR);


    // --------------------------------------------------------
    // Körper
    // --------------------------------------------------------

    const bodyWidth =
        type === "orc" ||
        type === "elite"
            ? 1.4
            : 1.05;


    const bodyHeight =
        type === "goblin"
            ? 1.35
            : 1.65;


    const body =
        box(
            bodyWidth,
            bodyHeight,
            0.75,
            data.cloth
        );

    body.position.y =
        2.15;

    root.add(body);


    // --------------------------------------------------------
    // Gürtel
    // --------------------------------------------------------

    const belt =
        box(
            bodyWidth + 0.08,
            0.22,
            0.8,
            MAT.leather
        );

    belt.position.y =
        1.5;

    root.add(belt);


    // --------------------------------------------------------
    // Kopf
    // --------------------------------------------------------

    const head =
        sphere(
            type === "orc" ||
            type === "elite"
                ? 0.65
                : 0.5,
            data.skin,
            18,
            14
        );

    head.position.y =
        type === "goblin"
            ? 3.45
            : 3.65;

    root.add(head);


    // --------------------------------------------------------
    // Haare
    // --------------------------------------------------------

    if (
        type === "bandit"
    ) {

        const hair =
            sphere(
                0.54,
                MAT.hair,
                16,
                10
            );

        hair.scale.y =
            0.65;

        hair.position.y =
            3.88;

        root.add(hair);

    }


    if (
        type === "orc"
    ) {

        // Orc-Haarkamm
        const mohawk =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.35,
                    0.9,
                    0.55
                ),
                MAT.hair
            );

        mohawk.position.set(
            0,
            4.15,
            0
        );

        root.add(mohawk);

    }


    // --------------------------------------------------------
    // Augen
    // --------------------------------------------------------

    const eyeL =
        sphere(
            0.065,
            type === "elite"
                ? MAT.eyeBlue
                : MAT.eye
        );

    eyeL.position.set(
        -0.17,
        head.position.y,
        -0.47
    );

    root.add(eyeL);


    const eyeR =
        sphere(
            0.065,
            type === "elite"
                ? MAT.eyeBlue
                : MAT.eye
        );

    eyeR.position.set(
        0.17,
        head.position.y,
        -0.47
    );

    root.add(eyeR);


    // --------------------------------------------------------
    // Ohren für Goblin
    // --------------------------------------------------------

    if (
        type === "goblin"
    ) {

        const earL =
            new THREE.Mesh(
                new THREE.ConeGeometry(
                    0.18,
                    0.75,
                    5
                ),
                data.skin
            );

        earL.rotation.z =
            Math.PI / 2;

        earL.position.set(
            -0.52,
            3.55,
            0
        );

        root.add(earL);


        const earR =
            new THREE.Mesh(
                new THREE.ConeGeometry(
                    0.18,
                    0.75,
                    5
                ),
                data.skin
            );

        earR.rotation.z =
            -Math.PI / 2;

        earR.position.set(
            0.52,
            3.55,
            0
        );

        root.add(earR);

    }


    // --------------------------------------------------------
    // Arme
    // --------------------------------------------------------

    const armL =
        addLimb(
            root,
            data.cloth,
            type === "orc"
                ? 0.27
                : 0.18,
            type === "orc"
                ? 1.6
                : 1.4,
            -0.75,
            2.2,
            0
        );


    const armR =
        addLimb(
            root,
            data.cloth,
            type === "orc"
                ? 0.27
                : 0.18,
            type === "orc"
                ? 1.6
                : 1.4,
            0.75,
            2.2,
            0
        );


    // --------------------------------------------------------
    // Schulterpanzer
    // --------------------------------------------------------

    if (
        type === "knight" ||
        type === "orc" ||
        type === "elite"
    ) {

        const shoulderL =
            sphere(
                0.35,
                MAT.iron
            );

        shoulderL.position.set(
            -0.82,
            2.85,
            0
        );

        root.add(
            shoulderL
        );


        const shoulderR =
            sphere(
                0.35,
                MAT.iron
            );

        shoulderR.position.set(
            0.82,
            2.85,
            0
        );

        root.add(
            shoulderR
        );

    }


    // --------------------------------------------------------
    // Helm
    // --------------------------------------------------------

    if (
        type === "knight" ||
        type === "elite"
    ) {

        const helmet =
            sphere(
                0.62,
                type === "elite"
                    ? MAT.gold
                    : MAT.darkSteel,
                16,
                12
            );

        helmet.scale.y =
            0.75;

        helmet.position.y =
            3.9;

        root.add(
            helmet
        );


        const visor =
            box(
                0.75,
                0.18,
                0.12,
                MAT.black
            );

        visor.position.set(
            0,
            3.8,
            -0.54
        );

        root.add(
            visor
        );

    }


    // --------------------------------------------------------
    // Waffe
    // --------------------------------------------------------

    let weapon;


    if (
        type === "goblin"
    ) {

        weapon =
            createAxe();

    }
    else if (
        type === "orc"
    ) {

        weapon =
            createLargeAxe();

    }
    else {

        weapon =
            createEnemySword();

    }


    weapon.position.set(
        0.82,
        1.55,
        -0.1
    );

    weapon.rotation.x =
        Math.PI / 2;

    root.add(
        weapon
    );


    // Animation-Daten
    root.userData.leftLeg =
        legL;

    root.userData.rightLeg =
        legR;

    root.userData.leftArm =
        armL;

    root.userData.rightArm =
        armR;

    root.userData.weapon =
        weapon;

    root.userData.animOffset =
        Math.random() * 10;

    root.scale.setScalar(
        data.scale
    );


    return root;

}


// ============================================================
// GEGNERWAFFEN
// ============================================================

function createEnemySword() {

    const group =
        new THREE.Group();


    const blade =
        box(
            0.14,
            2.3,
            0.22,
            MAT.iron
        );

    blade.position.y =
        1.15;

    group.add(blade);


    const guard =
        box(
            0.65,
            0.12,
            0.15,
            MAT.gold
        );

    group.add(guard);


    const handle =
        cylinder(
            0.09,
            0.09,
            0.55,
            MAT.leather
        );

    handle.position.y =
        -0.28;

    group.add(handle);


    return group;

}


function createAxe() {

    const group =
        new THREE.Group();


    const handle =
        cylinder(
            0.07,
            0.07,
            1.8,
            MAT.leather
        );

    handle.position.y =
        0.9;

    group.add(handle);


    const blade =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.75,
                0.65,
                0.18
            ),
            MAT.iron
        );

    blade.position.set(
        0.35,
        1.45,
        0
    );

    blade.rotation.z =
        -0.35;

    blade.castShadow = true;

    group.add(blade);


    return group;

}


function createLargeAxe() {

    const group =
        createAxe();

    group.scale.set(
        1.5,
        1.5,
        1.5
    );

    return group;

}


// ============================================================
// GEGNER
// ============================================================

const enemies = [];

const spawnPoints = [
    [40, -15],
    [-40, 15],
    [35, 30],
    [-35, -30],
    [42, 10],
    [-42, -5],
    [30, -35],
    [-30, 35]
];


function chooseEnemyType() {

    const r =
        Math.random();


    if (
        player.level >= 4 &&
        r < 0.08
    ) {

        return "elite";

    }


    if (
        r < 0.30
    ) {

        return "goblin";

    }


    if (
        r < 0.60
    ) {

        return "bandit";

    }


    if (
        r < 0.82
    ) {

        return "orc";

    }


    return "knight";

}


function spawnEnemy(
    type = null
) {

    const chosen =
        type ||
        chooseEnemyType();


    const data =
        enemyTypes[chosen];


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

        type: chosen,

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
                multiplier
            ),

        maxHealth:
            Math.floor(
                data.health *
                multiplier
            ),

        speed:
            data.speed,

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

        alive: true,

        attackCooldown: 0,

        respawnTimer: 15,

        mesh:
            createEnemyModel(
                chosen
            )

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

}


spawnEnemy("goblin");
spawnEnemy("bandit");
spawnEnemy("orc");
spawnEnemy("knight");


// ============================================================
// HÄNDLER
// ============================================================

function createMerchant() {

    const root =
        new THREE.Group();


    const body =
        box(
            1.15,
            1.65,
            0.72,
            MAT.clothBrown
        );

    body.position.y =
        2.2;

    root.add(body);


    const head =
        sphere(
            0.55,
            MAT.skin
        );

    head.position.y =
        3.65;

    root.add(head);


    const beard =
        sphere(
            0.4,
            MAT.hair
        );

    beard.scale.y =
        0.8;

    beard.position.set(
        0,
        3.45,
        -0.38
    );

    root.add(beard);


    const hat =
        cylinder(
            0.65,
            0.85,
            0.35,
            MAT.gold
        );

    hat.position.y =
        4.15;

    root.add(hat);


    const armL =
        addLimb(
            root,
            MAT.clothBrown,
            0.18,
            1.4,
            -0.78,
            2.2,
            0
        );


    const armR =
        addLimb(
            root,
            MAT.clothBrown,
            0.18,
            1.4,
            0.78,
            2.2,
            0
        );


    const legL =
        box(
            0.4,
            1.4,
            0.4,
            MAT.boot
        );

    legL.position.set(
        -0.3,
        0.65,
        0
    );

    root.add(legL);


    const legR =
        box(
            0.4,
            1.4,
            0.4,
            MAT.boot
        );

    legR.position.set(
        0.3,
        0.65,
        0
    );

    root.add(legR);


    return root;

}


const merchant =
    createMerchant();

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


    Object.assign(
        menu.style,
        {
            position: "fixed",
            left: "50%",
            top: "50%",
            transform:
                "translate(-50%,-50%)",
            background:
                "rgba(12,12,18,.97)",
            color: "white",
            padding: "25px",
            border:
                "2px solid #d5a928",
            borderRadius: "12px",
            minWidth: "430px",
            maxHeight: "80vh",
            overflow: "auto",
            zIndex: "1000",
            fontFamily: "Arial"
        }
    );


    renderShop(menu);

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

        <h3>⚔️ Waffen</h3>

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
                border:1px solid #555;
                padding:10px;
                margin:7px 0;
                border-radius:8px;
            ">

                <b>${name}</b><br>

                Schaden:
                ${weapon.damage}<br>

                Preis:
                ${
                    weapon.price === 0
                        ? "Startwaffe"
                        : weapon.price +
                          " Gold"
                }<br><br>

                ${
                    equipped
                        ? "<b>✓ AUSGERÜSTET</b>"
                        : owned
                            ? `
                                <button
                                    onclick="
                                    equipWeapon('${name}')
                                    "
                                >
                                    AUSRÜSTEN
                                </button>
                              `
                            : `
                                <button
                                    onclick="
                                    buyWeapon('${name}')
                                    "
                                >
                                    KAUFEN
                                </button>
                              `
                }

            </div>

        `;

    }


    html += `
        <h3>🛡️ Rüstung</h3>
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
                border:1px solid #555;
                padding:10px;
                margin:7px 0;
                border-radius:8px;
            ">

                <b>${name}</b><br>

                Schutz:
                ${armor.bonus}<br>

                Preis:
                ${
                    armor.price === 0
                        ? "Start"
                        : armor.price +
                          " Gold"
                }<br><br>

                ${
                    equipped
                        ? "<b>✓ AUSGERÜSTET</b>"
                        : owned
                            ? `
                                <button
                                    onclick="
                                    equipArmor('${name}')
                                    "
                                >
                                    AUSRÜSTEN
                                </button>
                              `
                            : `
                                <button
                                    onclick="
                                    buyArmor('${name}')
                                    "
                                >
                                    KAUFEN
                                </button>
                              `
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
        >
            Schließen
        </button>

    `;


    menu.innerHTML =
        html;

}


// ============================================================
// WAFFEN KAUFEN
// ============================================================

window.buyWeapon =
function(name) {

    if (
        inventory.weapons[name]
    ) {

        showMessage(
            "Diese Waffe besitzt du bereits."
        );

        return;

    }


    const data =
        weapons[name];


    if (
        player.gold <
        data.price
    ) {

        showMessage(
            "Nicht genug Gold!"
        );

        return;

    }


    player.gold -=
        data.price;


    inventory.weapons[name] =
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


    updateWeaponVisual();

    updateHUD();

    saveGame(false);


    showMessage(
        `${name} ausgerüstet`
    );


    const shop =
        document.getElementById(
            "shopMenu"
        );

    if (shop) {

        renderShop(shop);

    }

};


// ============================================================
// RÜSTUNG KAUFEN
// ============================================================

window.buyArmor =
function(name) {

    if (
        inventory.armors[name]
    ) {

        return;

    }


    const data =
        armors[name];


    if (
        player.gold <
        data.price
    ) {

        showMessage(
            "Nicht genug Gold!"
        );

        return;

    }


    player.gold -=
        data.price;


    inventory.armors[name] =
        1;


    saveGame(false);

    updateHUD();


    const shop =
        document.getElementById(
            "shopMenu"
        );

    if (shop) {

        renderShop(shop);

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


    updateArmorVisual();

    updateHUD();

    saveGame(false);


    showMessage(
        `${name} ausgerüstet`
    );


    const shop =
        document.getElementById(
            "shopMenu"
        );

    if (shop) {

        renderShop(shop);

    }

};


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
        0.65;


    playerMesh.userData
        .attacking = true;

    playerMesh.userData
        .attackTime = 0;


    const forward =
        new THREE.Vector3(
            0,
            0,
            -1
        );

    forward.applyAxisAngle(
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


        difference.y = 0;

        const distance =
            difference.length();


        if (
            distance > 4
        ) {

            continue;

        }


        difference.normalize();


        if (
            forward.dot(
                difference
            ) > 0.2
        ) {

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


    enemy.mesh.userData.hitTime =
        0.12;


    if (
        enemy.health <= 0
    ) {

        killEnemy(enemy);

    }

}


// ============================================================
// GEGNER TOD
// ============================================================

function killEnemy(
    enemy
) {

    enemy.alive =
        false;

    enemy.respawnTimer =
        15;


    player.gold +=
        Math.floor(
            THREE.MathUtils.randFloat(
                enemy.goldMin,
                enemy.goldMax
            )
        );


    gainXP(
        enemy.xp
    );


    scene.remove(
        enemy.mesh
    );


    showMessage(
        `${enemy.name} besiegt!`
    );


    saveGame(false);

}


// ============================================================
// GEGNER KI
// ============================================================

function updateEnemies(
    delta
) {

    if (
        isInsideCastle(
            player.position
        )
    ) {

        return;

    }


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


        direction.y = 0;


        const distance =
            direction.length();


        if (
            distance > 2.5
        ) {

            direction.normalize();


            enemy.position.add(
                direction.multiplyScalar(
                    enemy.speed *
                    delta
                )
            );


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
                    1.4;

            }

        }


        enemy.mesh.position.copy(
            enemy.position
        );

    }

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

            spawnEnemy();

            enemy.respawnTimer =
                999999;

        }

    }

}


// ============================================================
// SPIELER SCHADEN
// ============================================================

function damagePlayer(
    amount
) {

    if (
        isInsideCastle(
            player.position
        )
    ) {

        return;

    }


    const damage =
        Math.max(
            1,
            amount -
            player.armorBonus
        );


    player.health -=
        damage;


    if (
        player.health <= 0
    ) {

        player.health = 0;

        gameOver();

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

        player.level++;

        player.maxHealth +=
            20;

        player.health =
            player.maxHealth;

        player.xpToNextLevel =
            Math.floor(
                player.xpToNextLevel *
                1.35
            );


        showMessage(
            `⭐ LEVEL ${player.level}!`
        );

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


    saveGame(false);

}


// ============================================================
// BURG SICHERHEITSBEREICH
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
// KOLLISIONEN
// ============================================================

function collidesWithCastle(
    position
) {

    if (
        position.z < -17 &&
        Math.abs(position.x) < 15
    ) {

        return true;

    }


    if (
        position.x < -15 &&
        position.z > -17 &&
        position.z < 11
    ) {

        return true;

    }


    if (
        position.x > 15 &&
        position.z > -17 &&
        position.z < 11
    ) {

        return true;

    }


    // Linker Teil des Eingangstores
    if (
        position.z > 11 &&
        position.z < 13 &&
        position.x > -15 &&
        position.x < -5
    ) {

        return true;

    }


    // Rechter Teil des Eingangstores
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
    ) direction.z -= 1;

    if (
        keys["KeyS"]
    ) direction.z += 1;

    if (
        keys["KeyA"]
    ) direction.x -= 1;

    if (
        keys["KeyD"]
    ) direction.x += 1;


    const moving =
        direction.length() > 0;


    if (moving) {

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


        const next =
            player.position
                .clone()
                .add(
                    direction.multiplyScalar(
                        speed * delta
                    )
                );


        if (
            !collidesWithCastle(
                next
            )
        ) {

            player.position.copy(
                next
            );

        }


        playerMesh.rotation.y =
            cameraYaw;


        // Laufanimation
        const t =
            performance.now() *
            0.012;


        const amount =
            keys["ShiftLeft"] ||
            keys["ShiftRight"]
                ? 0.65
                : 0.4;


        playerMesh.userData
            .leftLeg.rotation.x =
            Math.sin(t) * amount;


        playerMesh.userData
            .rightLeg.rotation.x =
            -Math.sin(t) * amount;


        playerMesh.userData
            .leftArm.rotation.x =
            -Math.sin(t) * amount;


        playerMesh.userData
            .rightArm.rotation.x =
            Math.sin(t) * amount;

    }
    else {

        playerMesh.userData
            .leftLeg.rotation.x *=
            0.8;

        playerMesh.userData
            .rightLeg.rotation.x *=
            0.8;

        playerMesh.userData
            .leftArm.rotation.x *=
            0.8;

        playerMesh.userData
            .rightArm.rotation.x *=
            0.8;

    }


    // Springen
    player.velocityY -=
        25 * delta;


    player.position.y +=
        player.velocityY * delta;


    if (
        player.position.y <= 0
    ) {

        player.position.y = 0;

        player.velocityY = 0;

    }


    playerMesh.position.copy(
        player.position
    );

}


// ============================================================
// ANGRIFFSANIMATION
// ============================================================

function updateAttackAnimation(
    delta
) {

    if (
        !playerMesh.userData.attacking
    ) {

        return;

    }


    playerMesh.userData.attackTime +=
        delta;


    const t =
        playerMesh.userData.attackTime;


    const weapon =
        playerMesh.userData.weapon;


    const rightArm =
        playerMesh.userData.rightArm;


    if (
        t < 0.25
    ) {

        const progress =
            t / 0.25;


        rightArm.rotation.z =
            0.2 -
            progress * 1.4;


        weapon.rotation.z =
            -0.25 -
            progress * 1.8;

    }
    else if (
        t < 0.5
    ) {

        const progress =
            (t - 0.25) / 0.25;


        rightArm.rotation.z =
            -1.2 +
            progress * 1.8;


        weapon.rotation.z =
            -2.05 +
            progress * 2.8;

    }
    else {

        playerMesh.userData.attacking =
            false;

        rightArm.rotation.z =
            0.08;

        weapon.rotation.z =
            -0.25;

    }

}


// ============================================================
// KAMERA
// ============================================================

let cameraYaw = 0;

let cameraPitch = -0.2;


function updateCamera() {

    const target =
        player.position.clone();

    target.y += 2.1;


    const offset =
        new THREE.Vector3(
            0,
            2.8,
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
        target.clone().add(
            offset
        )
    );


    camera.lookAt(
        target
    );

}


// ============================================================
// HÄNDLER-INTERAKTION
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


        Object.assign(
            element.style,
            {
                position: "fixed",
                bottom: "110px",
                left: "50%",
                transform:
                    "translateX(-50%)",
                color: "white",
                fontSize: "20px",
                fontWeight: "bold",
                textShadow:
                    "2px 2px 4px black",
                zIndex: "50"
            }
        );


        document.body.appendChild(
            element
        );

    }


    element.textContent =
        text;

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


    Object.assign(
        menu.style,
        {
            position: "fixed",
            left: "50%",
            top: "50%",
            transform:
                "translate(-50%,-50%)",
            background:
                "rgba(10,10,15,.97)",
            color: "white",
            padding: "25px",
            border:
                "2px solid white",
            borderRadius: "12px",
            minWidth: "400px",
            maxHeight: "80vh",
            overflow: "auto",
            zIndex: "1000",
            fontFamily: "Arial"
        }
    );


    let html = `

        <h2>🎒 Inventar</h2>

        <p>
            ⭐ Level ${player.level}
        </p>

        <p>
            🪙 ${player.gold} Gold
        </p>

        <p>
            ❤️ ${player.health}/${player.maxHealth}
        </p>

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
                ${weapons[name].damage}
                Schaden

                ${
                    player.weapon === name
                        ? " ✓"
                        : `
                            <button
                                onclick="
                                equipWeapon('${name}')
                                "
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
                +${armors[name].bonus}

                ${
                    player.armor === name
                        ? " ✓"
                        : `
                            <button
                                onclick="
                                equipArmor('${name}')
                                "
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
                .getElementById(
                    'inventoryMenu'
                )
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
// TASTATUR
// ============================================================

window.addEventListener(
    "keydown",
    event => {

        keys[event.code] = true;


        if (
            event.code === "Space"
        ) {

            if (
                player.position.y <= 0.01
            ) {

                player.velocityY =
                    10;

            }

        }


        // E = Angriff
        if (
            event.code === "KeyE"
        ) {

            // Händler übernimmt E in Nähe
            if (
                player.position.distanceTo(
                    merchant.position
                ) >= 4
            ) {

                attack();

            }

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
// MAUSKAMERA
// ============================================================

document.addEventListener(
    "click",
    event => {

        if (
            event.target.closest(
                "#shopMenu"
            ) ||
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
                -1.15,
                0.55
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


Object.assign(
    hud.style,
    {
        position: "fixed",
        top: "20px",
        right: "20px",
        padding: "14px",
        background:
            "rgba(0,0,0,.55)",
        color: "white",
        fontFamily: "Arial",
        lineHeight: "1.6",
        zIndex: "20"
    }
);


document.body.appendChild(
    hud
);


const healthContainer =
    document.createElement(
        "div"
    );


Object.assign(
    healthContainer.style,
    {
        position: "fixed",
        left: "25px",
        bottom: "25px",
        width: "250px",
        height: "25px",
        border: "2px solid white",
        background:
            "rgba(0,0,0,.5)",
        zIndex: "20"
    }
);


const healthBar =
    document.createElement(
        "div"
    );


Object.assign(
    healthBar.style,
    {
        width: "100%",
        height: "100%",
        background: "#c62828"
    }
);


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

        XP ${player.xp}/${player.xpToNextLevel}<br>

        🪙 ${player.gold} Gold<br>

        ⚔️ ${player.weapon}
        (${player.weaponDamage})<br>

        🛡️ ${player.armor}
        (+${player.armorBonus})<br>

        🧪 ${inventory.potions}

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


    Object.assign(
        message.style,
        {
            position: "fixed",
            left: "50%",
            top: "32%",
            transform:
                "translate(-50%,-50%)",
            color: "white",
            fontSize: "25px",
            fontWeight: "bold",
            textShadow:
                "2px 2px 5px black",
            zIndex: "2000"
        }
    );


    document.body.appendChild(
        message
    );


    setTimeout(
        () => message.remove(),
        1000
    );

}


// ============================================================
// SPEICHERN
// ============================================================

function saveGame(
    show = true
) {

    const data = {

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
        JSON.stringify(data)
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

        updateWeaponVisual();

        updateArmorVisual();

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


        updateWeaponVisual();

        updateArmorVisual();

        updateHUD();

    }
    catch (error) {

        console.error(
            "Save-Fehler:",
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


    Object.assign(
        screen.style,
        {
            position: "fixed",
            inset: "0",
            background:
                "rgba(0,0,0,.88)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "40px",
            zIndex: "3000"
        }
    );


    screen.innerHTML = `

        <div>DU BIST GEFALLEN</div>

        <button
            style="
                margin-top:25px;
                padding:12px 25px;
                font-size:20px;
                cursor:pointer;
            "
            onclick="location.reload()"
        >
            Erneut versuchen
        </button>

    `;


    document.body.appendChild(
        screen
    );

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


    updatePlayer(delta);

    updateAttackAnimation(delta);

    updateEnemies(delta);

    updateRespawns(delta);

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
