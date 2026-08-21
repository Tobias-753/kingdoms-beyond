import * as THREE from "three";

// =====================================================
// KINGDOMS BEYOND 0.7
// BURG + TOR + HÄNDLER + SHOP + WAFFEN + RÜSTUNG
// SICHERER BURGHOF + WALD + RUINE + SPEICHERN
// =====================================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.Fog(0x87ceeb, 45, 220);


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

renderer.shadowMap.enabled = true;

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

sun.position.set(50, 100, 40);
sun.castShadow = true;

scene.add(sun);


// =====================================================
// BODEN
// =====================================================

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(300, 300),
    new THREE.MeshStandardMaterial({
        color: 0x3f6b35
    })
);

ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;

scene.add(ground);


// =====================================================
// SPIELER
// =====================================================

const player = {

    position: new THREE.Vector3(0, 1, 15),

    velocityY: 0,

    speed: 7,

    runningSpeed: 13,

    onGround: true,

    health: 100,

    maxHealth: 100,

    level: 1,

    xp: 0,

    xpToNextLevel: 100,

    gold: 100,

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

    "Heiltrank": 3,

    "Eisenschwert": 1,

    "Stahlschwert": 0,

    "Ritterschwert": 0,

    "Lederrüstung": 0,

    "Eisenrüstung": 0

};


// =====================================================
// SPIELER-MODELL
// =====================================================

const playerMesh = new THREE.Group();


// Körper
const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(
        0.5,
        1.15,
        4,
        8
    ),
    new THREE.MeshStandardMaterial({
        color: 0x315a91
    })
);

body.position.y = 1.35;
body.castShadow = true;

playerMesh.add(body);


// Kopf
const head = new THREE.Mesh(
    new THREE.SphereGeometry(
        0.38,
        16,
        16
    ),
    new THREE.MeshStandardMaterial({
        color: 0xf0c7a0
    })
);

head.position.y = 2.25;
head.castShadow = true;

playerMesh.add(head);


// Haare
const hair = new THREE.Mesh(
    new THREE.SphereGeometry(
        0.4,
        16,
        8,
        0,
        Math.PI * 2,
        0,
        Math.PI / 2
    ),
    new THREE.MeshStandardMaterial({
        color: 0x3b2415
    })
);

hair.position.y = 2.42;

playerMesh.add(hair);


// Arme
function createArm(x) {

    const arm = new THREE.Mesh(
        new THREE.CapsuleGeometry(
            0.14,
            0.65,
            4,
            8
        ),
        new THREE.MeshStandardMaterial({
            color: 0x315a91
        })
    );

    arm.position.set(
        x,
        1.45,
        0
    );

    arm.rotation.z =
        x > 0 ? -0.15 : 0.15;

    arm.castShadow = true;

    return arm;
}

playerMesh.add(createArm(0.62));
playerMesh.add(createArm(-0.62));


// Beine
function createLeg(x) {

    const leg = new THREE.Mesh(
        new THREE.CapsuleGeometry(
            0.16,
            0.75,
            4,
            8
        ),
        new THREE.MeshStandardMaterial({
            color: 0x202a38
        })
    );

    leg.position.set(
        x,
        0.55,
        0
    );

    leg.castShadow = true;

    return leg;
}

playerMesh.add(createLeg(0.25));
playerMesh.add(createLeg(-0.25));


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
        0.14,
        2.4,
        0.32
    ),
    new THREE.MeshStandardMaterial({
        color: 0xdce5e8,
        metalness: 0.85,
        roughness: 0.2
    })
);

blade.position.y = 1.25;

sword.add(blade);


const handle = new THREE.Mesh(
    new THREE.BoxGeometry(
        0.18,
        0.75,
        0.18
    ),
    new THREE.MeshStandardMaterial({
        color: 0x5d4037
    })
);

handle.position.y = -0.3;

sword.add(handle);


const guard = new THREE.Mesh(
    new THREE.BoxGeometry(
        0.75,
        0.12,
        0.16
    ),
    new THREE.MeshStandardMaterial({
        color: 0xb08d35,
        metalness: 0.7
    })
);

guard.position.y = 0.05;

sword.add(guard);


// Schwert zeigt nach vorne
sword.rotation.z = 0;

sword.position.set(
    0.72,
    1.35,
    -0.05
);

playerMesh.add(sword);


// =====================================================
// WELT-OBJEKTE
// =====================================================

const worldColliders = [];

function addCollider(mesh, width, depth) {

    worldColliders.push({
        mesh,
        width,
        depth
    });

}


// =====================================================
// BÄUME
// =====================================================

function createTree(x, z) {

    const tree = new THREE.Group();

    const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.45,
            0.7,
            4,
            8
        ),
        new THREE.MeshStandardMaterial({
            color: 0x6b3f22
        })
    );

    trunk.position.y = 2;
    trunk.castShadow = true;

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
    leaves.castShadow = true;

    tree.add(leaves);


    tree.position.set(
        x,
        0,
        z
    );

    scene.add(tree);

    addCollider(tree, 1.5, 1.5);
}


[
    [-15, -15],
    [10, -20],
    [25, -5],
    [-25, 10],
    [20, 25],
    [-10, 30],
    [35, 15],
    [-35, -20],
    [5, 35],
    [-30, 30],
    [40, -15],
    [-40, 10],
    [15, 40],
    [-20, 40],
    [50, 5],
    [-50, -5]
].forEach(p => {

    createTree(
        p[0],
        p[1]
    );

});


// =====================================================
// FELSEN
// =====================================================

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

    rock.castShadow = true;

    scene.add(rock);

    addCollider(
        rock,
        2.5,
        2.5
    );
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

const castle = new THREE.Group();


// Mauern
function createWall(
    x,
    y,
    z,
    width,
    height,
    depth
) {

    const wall = new THREE.Mesh(
        new THREE.BoxGeometry(
            width,
            height,
            depth
        ),
        new THREE.MeshStandardMaterial({
            color: 0x777b82
        })
    );

    wall.position.set(
        x,
        y,
        z
    );

    wall.castShadow = true;

    castle.add(wall);

    addCollider(
        wall,
        width,
        depth
    );

    return wall;
}


// Nordwand
createWall(
    0,
    4,
    -25,
    50,
    8,
    2
);


// Südwand mit Toröffnung
createWall(
    -17,
    4,
    25,
    16,
    8,
    2
);

createWall(
    17,
    4,
    25,
    16,
    8,
    2
);


// Seitenwände
createWall(
    -25,
    4,
    0,
    2,
    8,
    50
);

createWall(
    25,
    4,
    0,
    2,
    8,
    50
);


// =====================================================
// BURGTÜRME
// =====================================================

function createTower(x, z) {

    const tower = new THREE.Mesh(
        new THREE.CylinderGeometry(
            4,
            4,
            12,
            12
        ),
        new THREE.MeshStandardMaterial({
            color: 0x656970
        })
    );

    tower.position.set(
        x,
        6,
        z
    );

    tower.castShadow = true;

    castle.add(tower);

    addCollider(
        tower,
        7,
        7
    );


    const roof = new THREE.Mesh(
        new THREE.ConeGeometry(
            4.8,
            4,
            12
        ),
        new THREE.MeshStandardMaterial({
            color: 0x4b2020
        })
    );

    roof.position.set(
        x,
        14,
        z
    );

    roof.castShadow = true;

    castle.add(roof);
}


createTower(-21, -21);
createTower(21, -21);
createTower(-21, 21);
createTower(21, 21);


// =====================================================
// TOR
// =====================================================

const gate = new THREE.Group();

const gateFrameMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x55585c
    });


const gateLeft = new THREE.Mesh(
    new THREE.BoxGeometry(
        2,
        8,
        2
    ),
    gateFrameMaterial
);

gateLeft.position.set(
    -5,
    4,
    25
);

gate.add(gateLeft);


const gateRight = new THREE.Mesh(
    new THREE.BoxGeometry(
        2,
        8,
        2
    ),
    gateFrameMaterial
);

gateRight.position.set(
    5,
    4,
    25
);

gate.add(gateRight);


// Torbogen
const gateTop = new THREE.Mesh(
    new THREE.BoxGeometry(
        12,
        2,
        2
    ),
    gateFrameMaterial
);

gateTop.position.set(
    0,
    8,
    25
);

gate.add(gateTop);


// Holztor seitlich sichtbar
const door = new THREE.Mesh(
    new THREE.BoxGeometry(
        8,
        7,
        0.5
    ),
    new THREE.MeshStandardMaterial({
        color: 0x5a351e
    })
);

door.position.set(
    0,
    3.5,
    25.8
);


// Das Tor ist offen.
// Deshalb wird es NICHT als Collider hinzugefügt.

gate.add(door);

scene.add(gate);


// Ausgangsschild
const exitText = document.createElement("div");

exitText.textContent =
    "🚪 AUSGANG";

exitText.style.position =
    "fixed";

exitText.style.left =
    "50%";

exitText.style.top =
    "25%";

exitText.style.transform =
    "translateX(-50%)";

exitText.style.color =
    "white";

exitText.style.fontSize =
    "20px";

exitText.style.fontWeight =
    "bold";

exitText.style.textShadow =
    "2px 2px 4px black";

exitText.style.zIndex =
    "15";

exitText.style.display =
    "none";

document.body.appendChild(
    exitText
);


// =====================================================
// BURGHOF
// =====================================================

const courtyard = new THREE.Mesh(
    new THREE.PlaneGeometry(
        42,
        42
    ),
    new THREE.MeshStandardMaterial({
        color: 0x77716a
    })
);

courtyard.rotation.x =
    -Math.PI / 2;

courtyard.position.set(
    0,
    0.015,
    0
);

scene.add(courtyard);


// =====================================================
// BURG-INNENGEBÄUDE
// =====================================================

function createBuilding(
    x,
    z,
    width,
    depth,
    height
) {

    const building =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                width,
                height,
                depth
            ),
            new THREE.MeshStandardMaterial({
                color: 0x8a8d91
            })
        );

    building.position.set(
        x,
        height / 2,
        z
    );

    building.castShadow = true;

    scene.add(building);

    addCollider(
        building,
        width,
        depth
    );


    const roof =
        new THREE.Mesh(
            new THREE.ConeGeometry(
                Math.max(width, depth) * 0.7,
                4,
                4
            ),
            new THREE.MeshStandardMaterial({
                color: 0x4b2020
            })
        );

    roof.position.set(
        x,
        height + 2,
        z
    );

    roof.rotation.y =
        Math.PI / 4;

    scene.add(roof);
}


createBuilding(
    0,
    -12,
    14,
    8,
    7
);


// =====================================================
// HÄNDLER
// =====================================================

const merchant = new THREE.Group();

const merchantBody =
    new THREE.Mesh(
        new THREE.CapsuleGeometry(
            0.45,
            1.1,
            4,
            8
        ),
        new THREE.MeshStandardMaterial({
            color: 0x6b3fa0
        })
    );

merchantBody.position.y = 1.3;

merchant.add(merchantBody);


const merchantHead =
    new THREE.Mesh(
        new THREE.SphereGeometry(
            0.38,
            16,
            16
        ),
        new THREE.MeshStandardMaterial({
            color: 0xe7bd98
        })
    );

merchantHead.position.y = 2.2;

merchant.add(merchantHead);


merchant.position.set(
    0,
    0,
    -7
);

scene.add(merchant);


// Händler-Schild
const merchantLabel =
    document.createElement("div");

merchantLabel.textContent =
    "🧑 Händler";

merchantLabel.style.position =
    "fixed";

merchantLabel.style.left =
    "50%";

merchantLabel.style.top =
    "65%";

merchantLabel.style.transform =
    "translateX(-50%)";

merchantLabel.style.color =
    "white";

merchantLabel.style.fontWeight =
    "bold";

merchantLabel.style.textShadow =
    "2px 2px 4px black";

merchantLabel.style.display =
    "none";

merchantLabel.style.zIndex =
    "30";

document.body.appendChild(
    merchantLabel
);


// =====================================================
// RUINE
// =====================================================

const ruin = new THREE.Group();

function ruinWall(
    x,
    z,
    rotation
) {

    const wall =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                10,
                5,
                1.5
            ),
            new THREE.MeshStandardMaterial({
                color: 0x656565
            })
        );

    wall.position.set(
        x,
        2.5,
        z
    );

    wall.rotation.y =
        rotation;

    wall.castShadow = true;

    ruin.add(wall);

    addCollider(
        wall,
        10,
        2
    );
}

ruinWall(
    0,
    0,
    0
);

ruinWall(
    5,
    5,
    Math.PI / 2
);

ruinWall(
    -5,
    5,
    Math.PI / 2
);

ruin.position.set(
    60,
    0,
    25
);

scene.add(ruin);


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
        color: 0x8b2020,
        scale: 1
    },

    runner: {
        name: "Schneller",
        health: 35,
        speed: 4.2,
        damage: 7,
        xp: 65,
        color: 0xc45b20,
        scale: 0.85
    },

    tank: {
        name: "Tank",
        health: 120,
        speed: 1.2,
        damage: 18,
        xp: 110,
        color: 0x444466,
        scale: 1.3
    },

    elite: {
        name: "Elite",
        health: 220,
        speed: 2,
        damage: 25,
        xp: 250,
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
    [-35, -30],
    [55, 15],
    [70, 35]

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

function createEnemyMesh(data) {

    const group =
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

    body.position.y =
        1.2;

    body.castShadow = true;

    group.add(body);


    const head =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.42,
                12,
                12
            ),
            new THREE.MeshStandardMaterial({
                color: 0xd49b7b
            })
        );

    head.position.y =
        2.35;

    group.add(head);


    return group;
}


function spawnEnemy(typeName = null) {

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

        speed: data.speed,

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

        alive: true,

        attackCooldown: 0,

        respawnTimer:
            RESPAWN_TIME,

        mesh: null

    };


    enemy.mesh =
        createEnemyMesh(
            data
        );


    enemy.mesh.scale.set(
        data.scale,
        data.scale,
        data.scale
    );


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


// Startgegner
spawnEnemy("grunt");
spawnEnemy("grunt");
spawnEnemy("runner");
spawnEnemy("tank");


// =====================================================
// SICHERHEITSZONE BURG
// =====================================================

function isInsideCastle() {

    return (
        player.position.x > -23 &&
        player.position.x < 23 &&
        player.position.z > -23 &&
        player.position.z < 23
    );

}


// =====================================================
// SHOP
// =====================================================

let shopOpen = false;

function openShop() {

    if (shopOpen) {
        return;
    }

    shopOpen = true;

    const shop =
        document.createElement("div");

    shop.id =
        "shop";

    shop.style.position =
        "fixed";

    shop.style.left =
        "50%";

    shop.style.top =
        "50%";

    shop.style.transform =
        "translate(-50%, -50%)";

    shop.style.background =
        "rgba(15,15,20,0.97)";

    shop.style.padding =
        "28px";

    shop.style.border =
        "3px solid #d6b45b";

    shop.style.color =
        "white";

    shop.style.zIndex =
        "100";

    shop.style.minWidth =
        "360px";

    shop.innerHTML = `

        <h2>🧑 Händler</h2>

        <p>🪙 Gold: ${player.gold}</p>

        <hr>

        <button id="buyPotion">
            Heiltrank – 20 Gold
        </button>

        <br><br>

        <button id="buySteel">
            Stahlschwert – 120 Gold
        </button>

        <br><br>

        <button id="buyKnight">
            Ritterschwert – 300 Gold
        </button>

        <br><br>

        <button id="buyLeather">
            Lederrüstung – 100 Gold
        </button>

        <br><br>

        <button id="buyIronArmor">
            Eisenrüstung – 250 Gold
        </button>

        <br><br>

        <button id="closeShop">
            Schließen
        </button>

    `;

    document.body.appendChild(
        shop
    );


    document.getElementById(
        "buyPotion"
    ).onclick = () => {

        if (
            player.gold >= 20
        ) {

            player.gold -= 20;

            inventory["Heiltrank"]++;

            showMessage(
                "🧪 Heiltrank gekauft!"
            );

            updateHUD();
            saveGame(false);

        }
        else {

            showMessage(
                "Nicht genug Gold!"
            );

        }

    };


    document.getElementById(
        "buySteel"
    ).onclick = () => {

        if (
            player.gold >= 120
        ) {

            player.gold -= 120;

            inventory["Stahlschwert"] = 1;

            player.weapon =
                "Stahlschwert";

            player.weaponDamage =
                40;

            showMessage(
                "⚔️ Stahlschwert gekauft!"
            );

            updateHUD();
            saveGame(false);

        }
        else {

            showMessage(
                "Nicht genug Gold!"
            );

        }

    };


    document.getElementById(
        "buyKnight"
    ).onclick = () => {

        if (
            player.gold >= 300
        ) {

            player.gold -= 300;

            inventory["Ritterschwert"] = 1;

            player.weapon =
                "Ritterschwert";

            player.weaponDamage =
                65;

            showMessage(
                "⚔️ Ritterschwert gekauft!"
            );

            updateHUD();
            saveGame(false);

        }
        else {

            showMessage(
                "Nicht genug Gold!"
            );

        }

    };


    document.getElementById(
        "buyLeather"
    ).onclick = () => {

        if (
            player.gold >= 100
        ) {

            player.gold -= 100;

            inventory["Lederrüstung"] = 1;

            player.armor =
                "Lederrüstung";

            player.armorBonus =
                4;

            showMessage(
                "🛡️ Lederrüstung gekauft!"
            );

            updateHUD();
            saveGame(false);

        }
        else {

            showMessage(
                "Nicht genug Gold!"
            );

        }

    };


    document.getElementById(
        "buyIronArmor"
    ).onclick = () => {

        if (
            player.gold >= 250
        ) {

            player.gold -= 250;

            inventory["Eisenrüstung"] = 1;

            player.armor =
                "Eisenrüstung";

            player.armorBonus =
                9;

            showMessage(
                "🛡️ Eisenrüstung gekauft!"
            );

            updateHUD();
            saveGame(false);

        }
        else {

            showMessage(
                "Nicht genug Gold!"
            );

        }

    };


    document.getElementById(
        "closeShop"
    ).onclick = () => {

        shop.remove();

        shopOpen = false;

    };

}


// =====================================================
// INTERAKTION
// =====================================================

function checkMerchant() {

    const distance =
        player.position.distanceTo(
            merchant.position
        );

    merchantLabel.style.display =
        distance < 5 &&
        isInsideCastle()
            ? "block"
            : "none";

}


window.addEventListener(
    "keydown",
    event => {

        if (
            event.code === "KeyE" &&
            !shopOpen
        ) {

            const distance =
                player.position.distanceTo(
                    merchant.position
                );

            if (
                distance < 5 &&
                isInsideCastle()
            ) {

                openShop();

                return;

            }

            attack();

        }

    }
);


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

    }

}


// =====================================================
// LOOT
// =====================================================

function dropLoot(enemy) {

    const gold =
        Math.floor(
            Math.random() * 16
        ) + 5;

    player.gold += gold;

    showMessage(
        `🪙 +${gold} Gold`
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

    enemy.alive = false;

    enemy.respawnTimer =
        RESPAWN_TIME;

    gainXP(
        enemy.xp
    );

    dropLoot(
        enemy
    );

    scene.remove(
        enemy.mesh
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
                RESPAWN_TIME;

            return;

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


    sword.rotation.x =
        -Math.PI / 2;


    setTimeout(() => {

        sword.rotation.x = 0;

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


    let hit = false;


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


        if (
            attackDirection.dot(
                difference
            ) > 0.25
        ) {

            damageEnemy(
                enemy,
                player.weaponDamage
            );

            hit = true;

        }

    }

}


// =====================================================
// ENEMY SCHADEN
// =====================================================

function damageEnemy(
    enemy,
    damage
) {

    enemy.health -= damage;


    // kurzer sichtbarer Treffer
    enemy.mesh.scale.multiplyScalar(
        1.08
    );


    setTimeout(() => {

        if (
            enemy.mesh
        ) {

            const scale =
                enemyTypes[
                    enemy.type
                ].scale;

            enemy.mesh.scale.set(
                scale,
                scale,
                scale
            );

        }

    }, 100);


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

        if (
            !enemy.alive
        ) {
            continue;
        }


        // Burg ist sicher
        if (
            isInsideCastle()
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
            distance > 2.3
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

    if (
        isInsideCastle()
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

    updateHUD();

    saveGame(false);

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
        "100";


    menu.innerHTML = `

        <h2>🎒 Inventar</h2>

        <p>⭐ Level: ${player.level}</p>

        <p>XP: ${player.xp}/${player.xpToNextLevel}</p>

        <p>🪙 Gold: ${player.gold}</p>

        <p>⚔️ Waffe: ${player.weapon}</p>

        <p>⚔️ Schaden: ${player.weaponDamage}</p>

        <p>🛡️ Rüstung: ${player.armor}</p>

        <hr>

        <p>🧪 Heiltränke:
            ${inventory["Heiltrank"]}
        </p>

        <button id="closeInventory">
            Schließen
        </button>

    `;


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
            JSON.parse(
                raw
            );


        if (
            data.player
        ) {

            Object.assign(
                player,
                data.player
            );

            player.position.set(
                data.player.x ?? 0,
                data.player.y ?? 1,
                data.player.z ?? 15
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


// Health
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

        XP:
        ${player.xp}/${player.xpToNextLevel}<br>

        🪙 ${player.gold} Gold<br>

        ⚔️ ${player.weapon}
        (${player.weaponDamage})<br>

        🛡️ ${player.armor}<br>

        🧪 ${inventory["Heiltrank"]}
        Heiltrank<br>

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
        "150";


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
        "200";


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

            player.velocityY =
                10;

            player.onGround =
                false;

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
            event.target.closest(
                "#inventoryMenu"
            ) ||
            event.target.closest(
                "#shop"
            ) ||
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
// KOLLISION
// =====================================================

function canMoveTo(
    x,
    z
) {

    const radius = 0.65;


    for (
        const collider of worldColliders
    ) {

        const pos =
            collider.mesh.position;


        const halfW =
            collider.width / 2 +
            radius;

        const halfD =
            collider.depth / 2 +
            radius;


        if (
            x >
                pos.x - halfW &&
            x <
                pos.x + halfW &&
            z >
                pos.z - halfD &&
            z <
                pos.z + halfD
        ) {

            return false;

        }

    }


    return true;

}


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


        const newX =
            player.position.x +
            direction.x *
            speed *
            delta;


        const newZ =
            player.position.z +
            direction.z *
            speed *
            delta;


        if (
            canMoveTo(
                newX,
                player.position.z
            )
        ) {

            player.position.x =
                newX;

        }


        if (
            canMoveTo(
                player.position.x,
                newZ
            )
        ) {

            player.position.z =
                newZ;

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

        player.position.y =
            1;

        player.velocityY =
            0;

        player.onGround =
            true;

    }


    playerMesh.position.copy(
        player.position
    );


    // Spieler dreht sich in Laufrichtung
    if (
        direction.length() > 0
    ) {

        playerMesh.rotation.y =
            Math.atan2(
                direction.x,
                direction.z
            );

    }

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
            .add(
                offset
            )
    );


    camera.lookAt(
        target
    );

}


// =====================================================
// AUSGANGS-HINWEIS
// =====================================================

function updateExitHint() {

    const nearGate =
        Math.abs(
            player.position.z - 25
        ) < 7 &&
        Math.abs(
            player.position.x
        ) < 7;


    exitText.style.display =
        isInsideCastle() &&
        nearGate
            ? "block"
            : "none";

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

    checkMerchant();

    updateExitHint();

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
