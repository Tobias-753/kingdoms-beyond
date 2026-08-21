import * as THREE from "three";

// =====================================================
// KINGDOMS BEYOND 0.5
// Trefferanzeige + Trefferbereich + Lebensleisten
// + korrekt ausgerichtetes Schwert
// =====================================================

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.Fog(0x87ceeb, 40, 180);

// =====================================================
// KAMERA
// =====================================================

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    500
);

let cameraYaw = 0;
let cameraPitch = -0.25;

// =====================================================
// RENDERER
// =====================================================

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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

const sun = new THREE.DirectionalLight(0xffffff, 2);
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
// WELT
// =====================================================

function createTree(x, z) {

    const tree = new THREE.Group();

    const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.7, 4, 8),
        new THREE.MeshStandardMaterial({
            color: 0x6b3f22
        })
    );

    trunk.position.y = 2;
    tree.add(trunk);

    const leaves = new THREE.Mesh(
        new THREE.ConeGeometry(2.5, 6, 8),
        new THREE.MeshStandardMaterial({
            color: 0x1f5c2e
        })
    );

    leaves.position.y = 6;
    tree.add(leaves);

    tree.position.set(x, 0, z);
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
].forEach(p => createTree(p[0], p[1]));

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
].forEach(p => createRock(p[0], p[1]));

// =====================================================
// SPIELER
// =====================================================

const player = {

    position: new THREE.Vector3(0, 1, 10),

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

const playerMesh = new THREE.Group();

playerMesh.position.copy(player.position);
scene.add(playerMesh);

// Körper
const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.48, 1.0, 6, 12),
    new THREE.MeshStandardMaterial({
        color: 0x3f51b5
    })
);

body.position.y = 0.8;
playerMesh.add(body);

// Kopf
const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.38, 16, 16),
    new THREE.MeshStandardMaterial({
        color: 0xf1c7a5
    })
);

head.position.y = 1.65;
playerMesh.add(head);

// Haare
const hair = new THREE.Mesh(
    new THREE.SphereGeometry(0.39, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({
        color: 0x3b2418
    })
);

hair.position.y = 1.75;
playerMesh.add(hair);

// Arme
function createArm(x) {

    const arm = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.14, 0.65, 4, 8),
        new THREE.MeshStandardMaterial({
            color: 0x3f51b5
        })
    );

    arm.position.set(x, 0.9, 0);
    playerMesh.add(arm);

    return arm;
}

const leftArm = createArm(-0.58);
const rightArm = createArm(0.58);

// Beine
function createLeg(x) {

    const leg = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.16, 0.7, 4, 8),
        new THREE.MeshStandardMaterial({
            color: 0x222222
        })
    );

    leg.position.set(x, 0.05, 0);
    playerMesh.add(leg);

    return leg;
}

createLeg(-0.25);
createLeg(0.25);

// =====================================================
// SCHWERT
// =====================================================

const sword = new THREE.Group();

// Das Schwert liegt entlang der Z-Achse.
// Dadurch zeigt es beim Angriff nach vorne.
const blade = new THREE.Mesh(
    new THREE.BoxGeometry(
        0.18,
        0.18,
        2.6
    ),
    new THREE.MeshStandardMaterial({
        color: 0xcfd8dc,
        metalness: 0.85,
        roughness: 0.25
    })
);

blade.position.z = -1.25;
sword.add(blade);

// Spitze
const swordTip = new THREE.Mesh(
    new THREE.ConeGeometry(0.14, 0.5, 4),
    new THREE.MeshStandardMaterial({
        color: 0xeceff1,
        metalness: 0.9
    })
);

swordTip.rotation.x = -Math.PI / 2;
swordTip.position.z = -2.8;
sword.add(swordTip);

// Griff
const handle = new THREE.Mesh(
    new THREE.CylinderGeometry(
        0.12,
        0.12,
        0.75,
        8
    ),
    new THREE.MeshStandardMaterial({
        color: 0x5d4037
    })
);

handle.rotation.x = Math.PI / 2;
handle.position.z = 0.35;
sword.add(handle);

// Parierstange
const guard = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.12, 0.15),
    new THREE.MeshStandardMaterial({
        color: 0xb0bec5,
        metalness: 0.7
    })
);

guard.position.z = 0.05;
sword.add(guard);

sword.position.set(0.65, 1.0, -0.15);
sword.rotation.y = 0;

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
// ENEMY LEBENSLEISTE
// =====================================================

function createHealthBar(enemy) {

    const container = document.createElement("div");

    container.style.position = "fixed";
    container.style.width = "70px";
    container.style.height = "8px";
    container.style.background = "rgba(0,0,0,0.8)";
    container.style.border = "1px solid white";
    container.style.zIndex = "15";
    container.style.pointerEvents = "none";

    const bar = document.createElement("div");

    bar.style.height = "100%";
    bar.style.width = "100%";
    bar.style.background = "#e53935";

    container.appendChild(bar);
    document.body.appendChild(container);

    enemy.healthContainer = container;
    enemy.healthBar = bar;
}

function updateEnemyHealthBar(enemy) {

    if (!enemy.healthContainer || !enemy.mesh) {
        return;
    }

    if (!enemy.alive) {
        enemy.healthContainer.style.display = "none";
        return;
    }

    const pos = enemy.mesh.position.clone();
    pos.y += 2.2 * enemy.scale;

    pos.project(camera);

    const x = (pos.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-pos.y * 0.5 + 0.5) * window.innerHeight;

    enemy.healthContainer.style.left =
        `${x - 35}px`;

    enemy.healthContainer.style.top =
        `${y}px`;

    enemy.healthContainer.style.display =
        "block";

    enemy.healthBar.style.width =
        `${Math.max(
            0,
            enemy.health / enemy.maxHealth * 100
        )}%`;

    if (enemy.type === "elite") {

        enemy.healthBar.style.background =
            "#9c27b0";

        enemy.healthContainer.style.border =
            "2px solid #ffd700";

    } else {

        enemy.healthBar.style.background =
            "#e53935";

        enemy.healthContainer.style.border =
            "1px solid white";
    }
}

// =====================================================
// GEGNERTYP
// =====================================================

function chooseEnemyType() {

    const roll = Math.random();

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

function spawnEnemy(typeName = null) {

    if (
        enemies.filter(e => e.alive).length >=
        MAX_ENEMIES
    ) {
        return;
    }

    const type = typeName || chooseEnemyType();
    const data = enemyTypes[type];

    const spawn =
        spawnPoints[
            Math.floor(
                Math.random() * spawnPoints.length
            )
        ];

    const levelMultiplier =
        1 + (player.level - 1) * 0.08;

    const enemy = {

        type,

        name: data.name,

        position: new THREE.Vector3(
            spawn[0],
            data.scale,
            spawn[1]
        ),

        health: Math.floor(
            data.health * levelMultiplier
        ),

        maxHealth: Math.floor(
            data.health * levelMultiplier
        ),

        speed: data.speed,

        damage: Math.floor(
            data.damage * levelMultiplier
        ),

        xp: Math.floor(
            data.xp * levelMultiplier
        ),

        goldMin: data.goldMin,
        goldMax: data.goldMax,

        alive: true,

        attackCooldown: 0,

        respawnTimer: 0,

        mesh: null,

        healthContainer: null,

        healthBar: null,

        scale: data.scale,

        hitTimer: 0
    };

    enemy.mesh = new THREE.Mesh(
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

    enemy.mesh.scale.setScalar(data.scale);
    enemy.mesh.position.copy(enemy.position);

    scene.add(enemy.mesh);

    createHealthBar(enemy);

    enemies.push(enemy);

    if (type === "elite") {
        showMessage(
            "👑 EIN ELITE-GEGNER IST ERSCHIENEN!"
        );
    }
}

// =====================================================
// STARTGEGNER
// =====================================================

spawnEnemy("grunt");
spawnEnemy("grunt");
spawnEnemy("runner");
spawnEnemy("tank");

// =====================================================
// TREFFERBEREICH
// =====================================================

let attackArea = null;

function showAttackArea() {

    if (attackArea) {
        scene.remove(attackArea);
        attackArea.geometry.dispose();
        attackArea.material.dispose();
    }

    attackArea = new THREE.Mesh(
        new THREE.CylinderGeometry(
            2.2,
            2.2,
            0.08,
            32,
            1,
            false,
            -Math.PI / 2,
            Math.PI
        ),
        new THREE.MeshBasicMaterial({
            color: 0xffff00,
            transparent: true,
            opacity: 0.25,
            side: THREE.DoubleSide
        })
    );

    attackArea.position.copy(player.position);
    attackArea.position.y = 0.08;

    attackArea.rotation.x = Math.PI / 2;
    attackArea.rotation.y = cameraYaw;

    scene.add(attackArea);

    setTimeout(() => {

        if (attackArea) {
            scene.remove(attackArea);
            attackArea.geometry.dispose();
            attackArea.material.dispose();
            attackArea = null;
        }

    }, 180);
}

// =====================================================
// TREFFERPARTIKEL
// =====================================================

function createHitParticles(position, elite = false) {

    const group = new THREE.Group();

    const material = new THREE.MeshBasicMaterial({
        color: elite ? 0xffd700 : 0xffffff
    });

    for (let i = 0; i < 12; i++) {

        const particle = new THREE.Mesh(
            new THREE.SphereGeometry(0.06, 6, 6),
            material.clone()
        );

        particle.position.copy(position);

        particle.userData.velocity =
            new THREE.Vector3(
                (Math.random() - 0.5) * 5,
                Math.random() * 5,
                (Math.random() - 0.5) * 5
            );

        group.add(particle);
    }

    scene.add(group);

    const start = performance.now();

    function animateParticles(now) {

        const elapsed =
            (now - start) / 1000;

        group.children.forEach(p => {

            p.position.x +=
                p.userData.velocity.x * 0.016;

            p.position.y +=
                p.userData.velocity.y * 0.016;

            p.position.z +=
                p.userData.velocity.z * 0.016;

            p.userData.velocity.y -= 0.15;
        });

        if (elapsed < 0.5) {
            requestAnimationFrame(animateParticles);
        } else {
            scene.remove(group);
        }
    }

    requestAnimationFrame(animateParticles);
}

// =====================================================
// SCHADENSZAHL
// =====================================================

function showDamageNumber(position, damage, elite = false) {

    const text = document.createElement("div");

    text.textContent =
        `-${damage}`;

    text.style.position = "fixed";
    text.style.color = elite ? "#ffd700" : "#ff5252";
    text.style.fontSize = elite ? "30px" : "24px";
    text.style.fontWeight = "bold";
    text.style.textShadow = "2px 2px 4px black";
    text.style.zIndex = "90";
    text.style.pointerEvents = "none";

    document.body.appendChild(text);

    const world = position.clone();
    world.y += 1.5;

    const start = performance.now();

    function animate(now) {

        const elapsed =
            (now - start) / 1000;

        world.y += 0.02;

        const projected =
            world.clone().project(camera);

        text.style.left =
            `${(projected.x * 0.5 + 0.5) *
            window.innerWidth}px`;

        text.style.top =
            `${(-projected.y * 0.5 + 0.5) *
            window.innerHeight}px`;

        text.style.opacity =
            `${Math.max(0, 1 - elapsed)}`;

        if (elapsed < 1) {
            requestAnimationFrame(animate);
        } else {
            text.remove();
        }
    }

    requestAnimationFrame(animate);
}

// =====================================================
// LOOT
// =====================================================

function dropLoot(enemy) {

    const gold =
        Math.floor(
            Math.random() *
            (enemy.goldMax - enemy.goldMin + 1)
        ) + enemy.goldMin;

    player.gold += gold;
    inventory["Goldmünze"] += gold;

    const roll = Math.random();

    if (enemy.type === "elite") {

        inventory["Eisen"] += 2;
        inventory["Leder"] += 2;

        showMessage(
            `👑 Elite-Loot: +${gold} Gold +2 Eisen +2 Leder`
        );

    } else if (roll < 0.35) {

        inventory["Heiltrank"]++;

        showMessage(
            `+${gold} Gold | +1 Heiltrank`
        );

    } else if (roll < 0.65) {

        inventory["Leder"]++;

        showMessage(
            `+${gold} Gold | +1 Leder`
        );

    } else {

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

    showMessage(`+${amount} XP`);

    while (
        player.xp >= player.xpToNextLevel
    ) {

        player.xp -= player.xpToNextLevel;

        levelUp();
    }

    updateHUD();
    saveGame(false);
}

function levelUp() {

    player.level++;

    player.xpToNextLevel =
        Math.floor(
            player.xpToNextLevel * 1.35
        );

    player.maxHealth += 20;
    player.health = player.maxHealth;
    player.weaponDamage += 3;

    showMessage(
        `⭐ LEVEL UP! Level ${player.level}`
    );
}

// =====================================================
// GEGNER BESIEGT
// =====================================================

function killEnemy(enemy) {

    if (!enemy.alive) {
        return;
    }

    enemy.alive = false;
    enemy.respawnTimer = RESPAWN_TIME;

    if (enemy.healthContainer) {
        enemy.healthContainer.style.display = "none";
    }

    enemy.mesh.rotation.z =
        Math.PI / 2;

    gainXP(enemy.xp);
    dropLoot(enemy);

    showMessage(
        `${enemy.name} besiegt! Respawn in ${RESPAWN_TIME}s`
    );

    setTimeout(() => {

        if (enemy.mesh) {
            scene.remove(enemy.mesh);
        }

    }, 500);
}

// =====================================================
// RESPAWN
// =====================================================

function updateRespawns(delta) {

    for (const enemy of enemies) {

        if (enemy.alive) {
            continue;
        }

        enemy.respawnTimer -= delta;

        if (enemy.respawnTimer <= 0) {

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
                1 + (player.level - 1) * 0.08;

            enemy.type = newType;
            enemy.name = data.name;

            enemy.health =
                Math.floor(
                    data.health *
                    levelMultiplier
                );

            enemy.maxHealth =
                enemy.health;

            enemy.speed = data.speed;

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

            enemy.goldMin = data.goldMin;
            enemy.goldMax = data.goldMax;
            enemy.scale = data.scale;

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

            enemy.mesh.scale.setScalar(
                data.scale
            );

            enemy.mesh.position.copy(
                enemy.position
            );

            scene.add(enemy.mesh);

            enemy.alive = true;
            enemy.attackCooldown = 0;

            if (enemy.healthContainer) {
                enemy.healthContainer.style.display =
                    "block";
            }

            if (newType === "elite") {

                showMessage(
                    "👑 Ein Elite-Gegner ist zurück!"
                );

            } else {

                showMessage(
                    `${data.name} ist wieder da!`
                );
            }
        }
    }
}

// =====================================================
// KAMPF
// =====================================================

function attack() {

    if (player.attackCooldown > 0) {
        return;
    }

    player.attackCooldown = 0.55;

    showAttackArea();

    // Schwert bewegt sich sichtbar nach vorne
    sword.rotation.x = -Math.PI / 2;

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
        new THREE.Vector3(0, 1, 0),
        cameraYaw
    );

    let hitSomething = false;

    for (const enemy of enemies) {

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
            attackDirection.dot(difference);

        if (dot > 0.25) {

            hitSomething = true;

            damageEnemy(
                enemy,
                player.weaponDamage
            );
        }
    }

    // Kein "VERFEHLT"!
    if (!hitSomething) {
        // absichtlich keine Meldung
    }
}

function damageEnemy(enemy, damage) {

    enemy.health -= damage;

    showDamageNumber(
        enemy.position,
        damage,
        enemy.type === "elite"
    );

    createHitParticles(
        enemy.position,
        enemy.type === "elite"
    );

    // Gegner blinkt
    enemy.hitTimer = 0.12;

    const material =
        enemy.mesh.material;

    const oldColor =
        material.color.clone();

    material.color.set(
        enemy.type === "elite"
            ? 0xffff00
            : 0xffffff
    );

    setTimeout(() => {

        if (enemy.mesh && enemy.alive) {
            material.color.copy(oldColor);
        }

    }, 120);

    if (enemy.health <= 0) {

        killEnemy(enemy);
    }
}

// =====================================================
// GEGNER-KI
// =====================================================

function updateEnemies(delta) {

    for (const enemy of enemies) {

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

        } else {

            enemy.attackCooldown -= delta;

            if (enemy.attackCooldown <= 0) {

                damagePlayer(enemy.damage);

                enemy.attackCooldown = 1.5;
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

function damagePlayer(damage) {

    const reducedDamage =
        Math.max(
            1,
            damage - player.armorBonus
        );

    player.health -= reducedDamage;

    player.health =
        Math.max(
            player.health,
            0
        );

    updateHUD();

    showMessage(
        `-${reducedDamage} HP`
    );

    if (player.health <= 0) {
        gameOver();
    }
}

// =====================================================
// HEILTRANK
// =====================================================

function usePotion() {

    if (inventory["Heiltrank"] <= 0) {

        showMessage(
            "Keine Heiltränke!"
        );

        return;
    }

    if (player.health >= player.maxHealth) {

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

    showMessage("+40 HP");

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
        document.createElement("div");

    menu.id = "inventoryMenu";

    menu.style.position = "fixed";
    menu.style.left = "50%";
    menu.style.top = "50%";
    menu.style.transform =
        "translate(-50%, -50%)";

    menu.style.background =
        "rgba(10,10,10,0.95)";

    menu.style.padding = "30px";
    menu.style.border = "2px solid white";
    menu.style.color = "white";
    menu.style.zIndex = "50";
    menu.style.minWidth = "320px";

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

    for (const item in inventory) {

        html +=
            `<p>${item}: ${inventory[item]}</p>`;
    }

    html +=
        `<button id="closeInventory">
            Schließen
        </button>`;

    menu.innerHTML = html;

    document.body.appendChild(menu);

    document
        .getElementById("closeInventory")
        .onclick = () => menu.remove();
}

// =====================================================
// SPEICHERN
// =====================================================

function saveGame(show = true) {

    const saveData = {

        player: {

            health: player.health,
            maxHealth: player.maxHealth,
            level: player.level,
            xp: player.xp,
            xpToNextLevel: player.xpToNextLevel,
            gold: player.gold,

            weapon: player.weapon,
            weaponDamage: player.weaponDamage,

            armor: player.armor,
            armorBonus: player.armorBonus,

            x: player.position.x,
            y: player.position.y,
            z: player.position.z
        },

        inventory
    };

    localStorage.setItem(
        "kingdomsBeyondSave",
        JSON.stringify(saveData)
    );

    if (show) {
        showMessage("💾 Spiel gespeichert");
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

    } catch (error) {

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
    document.createElement("div");

hud.style.position = "fixed";
hud.style.top = "20px";
hud.style.right = "20px";
hud.style.padding = "15px";
hud.style.background =
    "rgba(0,0,0,0.55)";
hud.style.color = "white";
hud.style.fontFamily = "Arial";
hud.style.zIndex = "20";
hud.style.lineHeight = "1.6";

document.body.appendChild(hud);

const healthContainer =
    document.createElement("div");

healthContainer.style.position = "fixed";
healthContainer.style.bottom = "25px";
healthContainer.style.left = "25px";
healthContainer.style.width = "250px";
healthContainer.style.height = "25px";
healthContainer.style.border =
    "2px solid white";
healthContainer.style.background =
    "rgba(0,0,0,0.5)";
healthContainer.style.zIndex = "20";

const healthBar =
    document.createElement("div");

healthBar.style.width = "100%";
healthBar.style.height = "100%";
healthBar.style.background = "#d62828";

healthContainer.appendChild(healthBar);
document.body.appendChild(healthContainer);

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
        ${enemies.filter(e => e.alive).length}/${MAX_ENEMIES}

    `;

    healthBar.style.width =
        (
            player.health /
            player.maxHealth *
            100
        ) + "%";

    for (const enemy of enemies) {
        updateEnemyHealthBar(enemy);
    }
}

// =====================================================
// NACHRICHTEN
// =====================================================

function showMessage(text) {

    const message =
        document.createElement("div");

    message.textContent = text;

    message.style.position = "fixed";
    message.style.left = "50%";
    message.style.top = "40%";

    message.style.transform =
        "translate(-50%, -50%)";

    message.style.color = "white";
    message.style.fontSize = "26px";
    message.style.fontWeight = "bold";

    message.style.textShadow =
        "2px 2px 5px black";

    message.style.zIndex = "80";

    document.body.appendChild(message);

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
        document.createElement("div");

    screen.id = "gameOver";

    screen.style.position = "fixed";
    screen.style.inset = "0";
    screen.style.background =
        "rgba(0,0,0,0.85)";

    screen.style.display = "flex";
    screen.style.flexDirection = "column";
    screen.style.alignItems = "center";
    screen.style.justifyContent = "center";

    screen.style.color = "white";
    screen.style.fontSize = "40px";
    screen.style.zIndex = "100";

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

    document.body.appendChild(screen);

    document
        .getElementById("restart")
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

        keys[event.code] = true;

        if (
            event.code === "Space" &&
            player.onGround
        ) {

            event.preventDefault();

            player.velocityY = 10;
            player.onGround = false;
        }

        if (event.code === "KeyE") {
            attack();
        }

        if (event.code === "KeyI") {
            toggleInventory();
        }

        if (event.code === "KeyH") {
            usePotion();
        }

        if (event.code === "F5") {

            event.preventDefault();

            saveGame();
        }

        if (event.code === "F9") {
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

document.addEventListener(
    "click",
    event => {

        if (event.target.id === "restart") {
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

    if (direction.length() > 0) {

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

        // Held dreht sich in Bewegungsrichtung
        const targetRotation =
            Math.atan2(
                direction.x,
                direction.z
            );

        playerMesh.rotation.y =
            THREE.MathUtils.lerp(
                playerMesh.rotation.y,
                targetRotation,
                0.15
            );
    }

    player.velocityY -=
        25 * delta;

    player.position.y +=
        player.velocityY * delta;

    if (player.position.y <= 1) {

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
// FENSTER
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

    requestAnimationFrame(gameLoop);

    const delta =
        Math.min(
            clock.getDelta(),
            0.05
        );

    if (player.attackCooldown > 0) {

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
