import * as THREE from "three";

// =====================================================
// KINGDOMS BEYOND 0.7
// BURG + HÄNDLER + SHOP + AUSRÜSTUNG + KOLLISIONEN
// =====================================================

const VERSION = "0.7";

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.Fog(0x87ceeb, 45, 190);

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
        0x445544,
        2
    )
);

const sun = new THREE.DirectionalLight(
    0xffffff,
    2
);

sun.position.set(50, 80, 30);
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
scene.add(ground);

// =====================================================
// HILFSFUNKTIONEN
// =====================================================

const colliders = [];

function addCollider(
    x,
    z,
    width,
    depth,
    padding = 0.6
) {
    colliders.push({
        x,
        z,
        width: width / 2 + padding,
        depth: depth / 2 + padding
    });
}

function isBlocked(x, z, radius = 0.55) {

    for (const c of colliders) {

        if (
            x > c.x - c.width - radius &&
            x < c.x + c.width + radius &&
            z > c.z - c.depth - radius &&
            z < c.z + c.depth + radius
        ) {
            return true;
        }
    }

    return false;
}

function tryMove(entity, dx, dz, radius = 0.55) {

    const nextX =
        entity.position.x + dx;

    const nextZ =
        entity.position.z + dz;

    if (!isBlocked(nextX, entity.position.z, radius)) {
        entity.position.x = nextX;
    }

    if (!isBlocked(entity.position.x, nextZ, radius)) {
        entity.position.z = nextZ;
    }
}

// =====================================================
// BÄUME
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

    tree.position.set(x, 0, z);

    scene.add(tree);

    addCollider(
        x,
        z,
        3,
        3,
        0.4
    );
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

// =====================================================
// FELSEN
// =====================================================

function createRock(x, z) {

    const rock = new THREE.Mesh(
        new THREE.DodecahedronGeometry(1.5, 0),
        new THREE.MeshStandardMaterial({
            color: 0x777777
        })
    );

    rock.position.set(x, 1, z);
    rock.scale.y = 0.7;

    scene.add(rock);

    addCollider(
        x,
        z,
        3,
        3,
        0.3
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
    createRock(p[0], p[1]);
});

// =====================================================
// BURG
// =====================================================
//
// Burg liegt im Norden der Welt.
// Zentrum ungefähr bei z = -45.
// Das Tor zeigt nach Süden.
//

const castle = new THREE.Group();

scene.add(castle);

const castleMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x777b82
    });

const darkStone =
    new THREE.MeshStandardMaterial({
        color: 0x4e5359
    });

function createCastleWall(
    x,
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
        castleMaterial
    );

    wall.position.set(
        x,
        height / 2,
        z
    );

    castle.add(wall);

    addCollider(
        x,
        z,
        width,
        depth,
        0.25
    );

    return wall;
}

// Burgmauern

createCastleWall(
    0,
    -65,
    45,
    9,
    3
);

createCastleWall(
    -22,
    -45,
    3,
    9,
    43
);

createCastleWall(
    22,
    -45,
    3,
    9,
    43
);

// Rückwand

createCastleWall(
    0,
    -25,
    45,
    9,
    3
);

// =====================================================
// BURGTOR
// =====================================================

// Das Tor bleibt absichtlich frei.
// Dadurch kann der Spieler hinein und hinaus.

const gate = new THREE.Mesh(
    new THREE.BoxGeometry(
        10,
        9,
        3
    ),
    darkStone
);

gate.position.set(
    0,
    4.5,
    -65
);

castle.add(gate);

// Torbogen-Deko

const gateTop = new THREE.Mesh(
    new THREE.BoxGeometry(
        13,
        1.5,
        4
    ),
    darkStone
);

gateTop.position.set(
    0,
    9,
    -65
);

castle.add(gateTop);

// Türme

function createTower(x, z) {

    const tower = new THREE.Mesh(
        new THREE.CylinderGeometry(
            4,
            4,
            13,
            10
        ),
        darkStone
    );

    tower.position.set(
        x,
        6.5,
        z
    );

    castle.add(tower);

    addCollider(
        x,
        z,
        8,
        8,
        0.3
    );
}

createTower(-20, -63);
createTower(20, -63);
createTower(-20, -27);
createTower(20, -27);

// =====================================================
// BURG-INNENHOF
// =====================================================

const courtyard = new THREE.Mesh(
    new THREE.PlaneGeometry(
        36,
        30
    ),
    new THREE.MeshStandardMaterial({
        color: 0x77715f
    })
);

courtyard.rotation.x =
    -Math.PI / 2;

courtyard.position.set(
    0,
    0.02,
    -45
);

castle.add(courtyard);

// =====================================================
// BURG-GEBÄUDE
// =====================================================

const castleHouse = new THREE.Mesh(
    new THREE.BoxGeometry(
        20,
        10,
        8
    ),
    new THREE.MeshStandardMaterial({
        color: 0x686c72
    })
);

castleHouse.position.set(
    0,
    5,
    -30
);

castle.add(castleHouse);

addCollider(
    0,
    -30,
    20,
    8,
    0.3
);

// Dach

const roof = new THREE.Mesh(
    new THREE.ConeGeometry(
        15,
        7,
        4
    ),
    new THREE.MeshStandardMaterial({
        color: 0x3e2525
    })
);

roof.position.set(
    0,
    13,
    -30
);

roof.rotation.y =
    Math.PI / 4;

castle.add(roof);

// =====================================================
// HÄNDLER
// =====================================================

const merchant = {

    position:
        new THREE.Vector3(
            9,
            1,
            -44
        ),

    name: "Händler"

};

const merchantMesh =
    new THREE.Group();

// Körper

const merchantBody =
    new THREE.Mesh(
        new THREE.CapsuleGeometry(
            0.55,
            1.3,
            4,
            8
        ),
        new THREE.MeshStandardMaterial({
            color: 0x315d9b
        })
    );

merchantBody.position.y = 1.5;
merchantMesh.add(merchantBody);

// Kopf

const merchantHead =
    new THREE.Mesh(
        new THREE.SphereGeometry(
            0.48,
            16,
            16
        ),
        new THREE.MeshStandardMaterial({
            color: 0xe1a77a
        })
    );

merchantHead.position.y = 2.8;
merchantMesh.add(merchantHead);

// Hut

const merchantHat =
    new THREE.Mesh(
        new THREE.ConeGeometry(
            0.75,
            0.9,
            8
        ),
        new THREE.MeshStandardMaterial({
            color: 0x49351f
        })
    );

merchantHat.position.y = 3.5;
merchantMesh.add(merchantHat);

merchantMesh.position.copy(
    merchant.position
);

scene.add(merchantMesh);

// Händler blockiert

addCollider(
    merchant.position.x,
    merchant.position.z,
    1.5,
    1.5,
    0.2
);

// =====================================================
// HÄNDLER-SCHILD
// =====================================================

const sign = document.createElement("div");

sign.style.position = "fixed";
sign.style.left = "50%";
sign.style.top = "65%";
sign.style.transform = "translateX(-50%)";
sign.style.color = "white";
sign.style.background = "rgba(0,0,0,0.7)";
sign.style.padding = "8px 14px";
sign.style.borderRadius = "8px";
sign.style.zIndex = "30";
sign.style.display = "none";
sign.style.pointerEvents = "none";
sign.textContent =
    "🧑 Händler – E drücken";

document.body.appendChild(sign);

// =====================================================
// SPIELER
// =====================================================

const player = {

    position:
        new THREE.Vector3(
            0,
            1,
            5
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

    gold: 100,

    attackCooldown: 0,

    weapon: "Eisenschwert",

    weaponDamage: 25,

    weaponLevel: 1,

    armor: "Keine Rüstung",

    armorBonus: 0,

    armorLevel: 0

};

// =====================================================
// INVENTAR
// =====================================================

const inventory = {

    "Heiltrank": 3,

    "Eisenschwert": 1,

    "Leder": 0,

    "Eisen": 0,

    "Goldmünze": 100

};

// =====================================================
// SPIELER-MODELL
// =====================================================

const playerMesh =
    new THREE.Group();

scene.add(playerMesh);

// Körper

const playerBody =
    new THREE.Mesh(
        new THREE.CapsuleGeometry(
            0.5,
            1.2,
            4,
            8
        ),
        new THREE.MeshStandardMaterial({
            color: 0x315a8c
        })
    );

playerBody.position.y = 1.35;
playerMesh.add(playerBody);

// Kopf

const playerHead =
    new THREE.Mesh(
        new THREE.SphereGeometry(
            0.48,
            16,
            16
        ),
        new THREE.MeshStandardMaterial({
            color: 0xe0a176
        })
    );

playerHead.position.y = 2.8;
playerMesh.add(playerHead);

// Haare

const hair =
    new THREE.Mesh(
        new THREE.SphereGeometry(
            0.5,
            16,
            16,
            0,
            Math.PI * 2,
            0,
            Math.PI * 0.55
        ),
        new THREE.MeshStandardMaterial({
            color: 0x3a2418
        })
    );

hair.position.y = 3;
playerMesh.add(hair);

// Schulterpolster

const shoulder =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            1.4,
            0.35,
            0.7
        ),
        new THREE.MeshStandardMaterial({
            color: 0x59636d,
            metalness: 0.5
        })
    );

shoulder.position.y = 1.9;
playerMesh.add(shoulder);

playerMesh.position.copy(
    player.position
);

// =====================================================
// SCHWERT
// =====================================================

const sword =
    new THREE.Group();

// Das Schwert zeigt jetzt nach vorne.

const blade =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            0.18,
            2.5,
            0.38
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
            0.22,
            0.75,
            0.22
        ),
        new THREE.MeshStandardMaterial({
            color: 0x5d4037
        })
    );

handle.position.y = -0.3;
sword.add(handle);

sword.position.set(
    0.75,
    1.15,
    -0.35
);

sword.rotation.x =
    Math.PI / 2;

playerMesh.add(sword);

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
// SICHERHEITSZONE
// =====================================================

function isInCastle() {

    const x = player.position.x;
    const z = player.position.z;

    return (
        x > -20 &&
        x < 20 &&
        z > -62 &&
        z < -29
    );
}

// =====================================================
// GEGNER-TYP
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
// ENEMY LEBENSBALKEN
// =====================================================

function createEnemyHealthBar(enemy) {

    const bar =
        document.createElement("div");

    bar.style.position = "fixed";
    bar.style.width = "70px";
    bar.style.height = "7px";
    bar.style.background = "#333";
    bar.style.border = "1px solid white";
    bar.style.zIndex = "25";
    bar.style.pointerEvents = "none";

    const fill =
        document.createElement("div");

    fill.style.height = "100%";
    fill.style.background = "#d62828";

    bar.appendChild(fill);

    document.body.appendChild(bar);

    enemy.healthBar = bar;
    enemy.healthFill = fill;
}

// =====================================================
// GEGNER ERSTELLEN
// =====================================================

function spawnEnemy(typeName = null) {

    if (
        enemies.filter(e => e.alive).length >=
        MAX_ENEMIES
    ) {
        return;
    }

    const type =
        typeName ||
        chooseEnemyType();

    const data =
        enemyTypes[type];

    let spawn;

    do {

        spawn =
            spawnPoints[
                Math.floor(
                    Math.random() *
                    spawnPoints.length
                )
            ];

    } while (
        Math.hypot(
            spawn[0] - player.position.x,
            spawn[1] - player.position.z
        ) < 15
    );

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

        goldMin: data.goldMin,

        goldMax: data.goldMax,

        alive: true,

        attackCooldown: 0,

        respawnTimer: 0,

        mesh: null,

        healthBar: null,

        healthFill: null,

        scale: data.scale

    };

    enemy.mesh =
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

    enemy.mesh.scale.set(
        data.scale,
        data.scale,
        data.scale
    );

    enemy.mesh.position.copy(
        enemy.position
    );

    scene.add(enemy.mesh);

    enemies.push(enemy);

    createEnemyHealthBar(enemy);
}

// =====================================================
// STARTGEGNER
// =====================================================

spawnEnemy("grunt");
spawnEnemy("grunt");
spawnEnemy("runner");
spawnEnemy("tank");

// =====================================================
// SHOP
// =====================================================

let shopOpen = false;

function openShop() {

    if (shopOpen) return;

    shopOpen = true;

    document.exitPointerLock();

    const menu =
        document.createElement("div");

    menu.id = "shopMenu";

    menu.style.position = "fixed";
    menu.style.left = "50%";
    menu.style.top = "50%";
    menu.style.transform =
        "translate(-50%, -50%)";

    menu.style.background =
        "rgba(12,15,20,0.97)";

    menu.style.color = "white";
    menu.style.padding = "30px";
    menu.style.border = "3px solid #c7a44a";
    menu.style.borderRadius = "12px";
    menu.style.zIndex = "100";
    menu.style.minWidth = "360px";
    menu.style.fontFamily = "Arial";

    menu.innerHTML = `
        <h2>🧑 Händler</h2>

        <p>🪙 Gold: <b id="shopGold">
            ${player.gold}
        </b></p>

        <hr>

        <button id="buyPotion">
            🧪 Heiltrank – 20 Gold
        </button>

        <br><br>

        <button id="upgradeWeapon">
            ⚔️ Waffe verbessern –
            ${weaponUpgradeCost()} Gold
        </button>

        <br><br>

        <button id="buyArmor">
            🛡️ Rüstung –
            ${armorCost()} Gold
        </button>

        <br><br>

        <button id="closeShop">
            Schließen
        </button>

        <p id="shopInfo"></p>
    `;

    document.body.appendChild(menu);

    document
        .getElementById("buyPotion")
        .onclick = () => {

            if (player.gold < 20) {

                shopMessage(
                    "Nicht genug Gold!"
                );

                return;
            }

            player.gold -= 20;

            inventory["Goldmünze"] =
                Math.max(
                    0,
                    inventory["Goldmünze"] - 20
                );

            inventory["Heiltrank"]++;

            shopMessage(
                "🧪 Heiltrank gekauft!"
            );

            refreshShop();
        };

    document
        .getElementById("upgradeWeapon")
        .onclick = upgradeWeapon;

    document
        .getElementById("buyArmor")
        .onclick = buyArmor;

    document
        .getElementById("closeShop")
        .onclick = closeShop;
}

function weaponUpgradeCost() {

    return 75 *
        player.weaponLevel;
}

function armorCost() {

    if (player.armorLevel === 0) {
        return 100;
    }

    return 150 *
        player.armorLevel;
}

function upgradeWeapon() {

    const cost =
        weaponUpgradeCost();

    if (player.gold < cost) {

        shopMessage(
            "Nicht genug Gold!"
        );

        return;
    }

    player.gold -= cost;

    inventory["Goldmünze"] =
        Math.max(
            0,
            inventory["Goldmünze"] - cost
        );

    player.weaponLevel++;

    player.weaponDamage += 8;

    player.weapon =
        `Eisenschwert +${player.weaponLevel - 1}`;

    shopMessage(
        `⚔️ Waffe verbessert! Schaden: ${player.weaponDamage}`
    );

    refreshShop();

    saveGame(false);
}

function buyArmor() {

    const cost =
        armorCost();

    if (player.gold < cost) {

        shopMessage(
            "Nicht genug Gold!"
        );

        return;
    }

    player.gold -= cost;

    inventory["Goldmünze"] =
        Math.max(
            0,
            inventory["Goldmünze"] - cost
        );

    player.armorLevel++;

    player.armorBonus =
        5 +
        player.armorLevel * 3;

    player.armor =
        `Lederrüstung +${player.armorLevel}`;

    shopMessage(
        `🛡️ Rüstung verbessert! Schutz: ${player.armorBonus}`
    );

    refreshShop();

    saveGame(false);
}

function shopMessage(text) {

    const info =
        document.getElementById(
            "shopInfo"
        );

    if (info) {
        info.textContent = text;
    }
}

function refreshShop() {

    const gold =
        document.getElementById(
            "shopGold"
        );

    if (gold) {
        gold.textContent =
            player.gold;
    }

    const weaponButton =
        document.getElementById(
            "upgradeWeapon"
        );

    if (weaponButton) {

        weaponButton.textContent =
            `⚔️ Waffe verbessern – ${weaponUpgradeCost()} Gold`;
    }

    const armorButton =
        document.getElementById(
            "buyArmor"
        );

    if (armorButton) {

        armorButton.textContent =
            `🛡️ Rüstung – ${armorCost()} Gold`;
    }
}

function closeShop() {

    const menu =
        document.getElementById(
            "shopMenu"
        );

    if (menu) {
        menu.remove();
    }

    shopOpen = false;
}

// =====================================================
// HÄNDLER INTERAKTION
// =====================================================

function nearMerchant() {

    return (
        player.position.distanceTo(
            merchant.position
        ) < 4
    );
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

    inventory["Goldmünze"] += gold;

    const roll =
        Math.random();

    if (enemy.type === "elite") {

        inventory["Eisen"] += 2;
        inventory["Leder"] += 2;

        showMessage(
            `👑 Elite-Loot: +${gold} Gold`
        );

    }
    else if (roll < 0.35) {

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

    saveGame(false);
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

    saveGame(false);
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
}

// =====================================================
// GEGNER BESIEGT
// =====================================================

function killEnemy(enemy) {

    if (!enemy.alive) return;

    enemy.alive = false;

    enemy.respawnTimer =
        RESPAWN_TIME;

    enemy.mesh.rotation.z =
        Math.PI / 2;

    gainXP(enemy.xp);

    dropLoot(enemy);

    showMessage(
        `${enemy.name} besiegt! Respawn in ${RESPAWN_TIME}s`
    );

    setTimeout(() => {

        if (enemy.healthBar) {
            enemy.healthBar.remove();
        }

        if (enemy.mesh) {
            scene.remove(
                enemy.mesh
            );
        }

    }, 500);
}

// =====================================================
// RESPAWN
// =====================================================

function updateRespawns(delta) {

    for (const enemy of enemies) {

        if (enemy.alive) continue;

        enemy.respawnTimer -= delta;

        if (enemy.respawnTimer <= 0) {

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

            enemy.type = type;
            enemy.name = data.name;

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

            enemy.mesh =
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

            enemy.alive = true;
            enemy.attackCooldown = 0;

            createEnemyHealthBar(enemy);

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
        new THREE.Vector3(
            0,
            1,
            0
        ),
        cameraYaw
    );

    for (const enemy of enemies) {

        if (!enemy.alive) continue;

        const difference =
            enemy.position
                .clone()
                .sub(
                    player.position
                );

        const distance =
            difference.length();

        if (distance > 4) continue;

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

    for (const enemy of enemies) {

        if (!enemy.alive) continue;

        // Gegner greifen in der Burg nicht an.
        if (isInCastle()) {
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

            const dx =
                direction.x *
                enemy.speed *
                delta;

            const dz =
                direction.z *
                enemy.speed *
                delta;

            const oldX =
                enemy.position.x;

            const oldZ =
                enemy.position.z;

            tryMove(
                enemy,
                dx,
                dz,
                enemy.scale * 0.55
            );

            if (
                enemy.position.x === oldX &&
                enemy.position.z === oldZ
            ) {
                // Hindernis erkannt.
            }

            enemy.mesh.lookAt(
                player.position.x,
                enemy.mesh.position.y,
                player.position.z
            );

        }
        else {

            enemy.attackCooldown -= delta;

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

        updateEnemyHealthBar(enemy);
    }
}

// =====================================================
// ENEMY HEALTH BAR
// =====================================================

function updateEnemyHealthBar(enemy) {

    if (
        !enemy.healthBar ||
        !enemy.alive
    ) {
        return;
    }

    const world =
        enemy.position.clone();

    world.y +=
        2.4 * enemy.scale;

    world.project(camera);

    const x =
        (world.x * 0.5 + 0.5) *
        window.innerWidth;

    const y =
        (-world.y * 0.5 + 0.5) *
        window.innerHeight;

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
// SPIELER SCHADEN
// =====================================================

function damagePlayer(damage) {

    // Sicherheit innerhalb der Burg.

    if (isInCastle()) {
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
        `<p>⚔️ Waffe: ${player.weapon}</p>`;

    html +=
        `<p>⚔️ Schaden: ${player.weaponDamage}</p>`;

    html +=
        `<p>🛡️ Rüstung: ${player.armor}</p>`;

    html +=
        `<p>🛡️ Schutz: ${player.armorBonus}</p>`;

    html += `<hr>`;

    for (const item in inventory) {

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

function saveGame(show = true) {

    const saveData = {

        version: VERSION,

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

            weaponLevel:
                player.weaponLevel,

            armor:
                player.armor,

            armorBonus:
                player.armorBonus,

            armorLevel:
                player.armorLevel,

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
        JSON.stringify(saveData)
    );

    if (show) {

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

    if (!raw) {
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
                data.player.x ?? 0,
                data.player.y ?? 1,
                data.player.z ?? 5
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

        <b>KINGDOMS BEYOND ${VERSION}</b><br>

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
        }/${MAX_ENEMIES}<br>

        ${
            isInCastle()
                ? "🏰 SICHERE BURG"
                : "🌲 WILDBNIS"
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

            player.velocityY = 10;

            player.onGround = false;
        }

        if (
            event.code === "KeyE"
        ) {

            if (
                nearMerchant()
            ) {

                if (shopOpen) {
                    closeShop();
                }
                else {
                    openShop();
                }

            }
            else {

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
                "#shopMenu"
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

        tryMove(
            player,
            direction.x *
                speed *
                delta,
            direction.z *
                speed *
                delta,
            0.6
        );
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

    // Händler-Hinweis

    if (
        nearMerchant()
    ) {

        sign.style.display =
            "block";

    }
    else {

        sign.style.display =
            "none";
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

loadGame();

updateHUD();

gameLoop();
