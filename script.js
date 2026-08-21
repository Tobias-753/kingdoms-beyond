import * as THREE from "three";

// ============================================================
// KINGDOMS BEYOND 0.5
// Charakter + korrekt ausgerichtetes Schwert
// Trefferbereich + Trefferpartikel + Schaden
// Gegner-Lebensleisten + Elite-Anzeige
// Respawn + verschiedene Gegner + Inventar + Speichern
// ============================================================


// ============================================================
// SZENE
// ============================================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87ceeb);

scene.fog = new THREE.Fog(
    0x87ceeb,
    45,
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
        0x445544,
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
        300,
        300
    ),
    new THREE.MeshStandardMaterial({
        color: 0x3f6b35
    })
);

ground.rotation.x = -Math.PI / 2;

ground.receiveShadow = true;

scene.add(ground);


// ============================================================
// WELT
// ============================================================

function createTree(x, z) {

    const tree = new THREE.Group();

    const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.45,
            0.65,
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
    createRock(p[0], p[1]);
});


// ============================================================
// SPIELERDATEN
// ============================================================

const player = {

    position: new THREE.Vector3(
        0,
        0,
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


// ============================================================
// INVENTAR
// ============================================================

const inventory = {

    "Heiltrank": 2,

    "Eisenschwert": 1,

    "Leder": 0,

    "Eisen": 0,

    "Goldmünze": 0
};


// ============================================================
// SPIELER-MODELL
// ============================================================

const playerMesh = new THREE.Group();

scene.add(playerMesh);


// Körper
const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(
        0.45,
        1.0,
        6,
        12
    ),
    new THREE.MeshStandardMaterial({
        color: 0x315a91
    })
);

body.position.y = 1.25;

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
        color: 0xf1c7a5
    })
);

head.position.y = 2.15;

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
        Math.PI * 0.55
    ),
    new THREE.MeshStandardMaterial({
        color: 0x3b2415
    })
);

hair.position.y = 2.27;

playerMesh.add(hair);


// Linker Arm
const leftArm = new THREE.Mesh(
    new THREE.CapsuleGeometry(
        0.13,
        0.65,
        4,
        8
    ),
    new THREE.MeshStandardMaterial({
        color: 0x315a91
    })
);

leftArm.position.set(
    -0.58,
    1.35,
    0
);

leftArm.rotation.z = 0.12;

leftArm.castShadow = true;

playerMesh.add(leftArm);


// Rechter Arm
const rightArm = new THREE.Mesh(
    new THREE.CapsuleGeometry(
        0.13,
        0.65,
        4,
        8
    ),
    new THREE.MeshStandardMaterial({
        color: 0x315a91
    })
);

rightArm.position.set(
    0.58,
    1.35,
    0
);

rightArm.rotation.z = -0.12;

rightArm.castShadow = true;

playerMesh.add(rightArm);


// Beine
const leftLeg = new THREE.Mesh(
    new THREE.CapsuleGeometry(
        0.16,
        0.75,
        4,
        8
    ),
    new THREE.MeshStandardMaterial({
        color: 0x222633
    })
);

leftLeg.position.set(
    -0.22,
    0.45,
    0
);

leftLeg.castShadow = true;

playerMesh.add(leftLeg);


const rightLeg = new THREE.Mesh(
    new THREE.CapsuleGeometry(
        0.16,
        0.75,
        4,
        8
    ),
    new THREE.MeshStandardMaterial({
        color: 0x222633
    })
);

rightLeg.position.set(
    0.22,
    0.45,
    0
);

rightLeg.castShadow = true;

playerMesh.add(rightLeg);


// ============================================================
// SCHWERT
// ============================================================

const sword = new THREE.Group();


// Klinge zeigt nach vorne
const blade = new THREE.Mesh(
    new THREE.BoxGeometry(
        0.14,
        2.5,
        0.32
    ),
    new THREE.MeshStandardMaterial({
        color: 0xd7e0e5,
        metalness: 0.9,
        roughness: 0.25
    })
);


// Griff
const handle = new THREE.Mesh(
    new THREE.BoxGeometry(
        0.18,
        0.7,
        0.18
    ),
    new THREE.MeshStandardMaterial({
        color: 0x5d4037
    })
);


// Handschutz
const guard = new THREE.Mesh(
    new THREE.BoxGeometry(
        0.75,
        0.12,
        0.16
    ),
    new THREE.MeshStandardMaterial({
        color: 0xc49a38,
        metalness: 0.8
    })
);


// Wir bauen das Schwert entlang der Y-Achse.
// Danach drehen wir die gesamte Waffe,
// sodass sie in Blickrichtung des Helden zeigt.

blade.position.y = 1.35;

handle.position.y = -0.25;

guard.position.y = 0.15;

sword.add(blade);
sword.add(handle);
sword.add(guard);


// Schwert an rechte Hand
sword.position.set(
    0.65,
    1.15,
    -0.05
);


// Das Schwert zeigt zunächst nach oben.
// Die Rotation bringt es nach vorne.
sword.rotation.z = -0.25;

rightArm.add(sword);


// ============================================================
// GEGNERTYPEN
// ============================================================

const enemyTypes = {

    grunt: {

        name: "Grunt",

        health: 50,

        speed: 2.2,

        damage: 10,

        xp: 50,

        goldMin: 5,

        goldMax: 15,

        color: 0x9b2929,

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

        color: 0xd06a25,

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

        color: 0x4b4b75,

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


// ============================================================
// GEGNER
// ============================================================

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


// ============================================================
// GEGNER-LEBENSLEISTE
// ============================================================

function createEnemyHealthBar(enemy) {

    const container = document.createElement(
        "div"
    );

    container.style.position = "fixed";
    container.style.width = "90px";
    container.style.height = "10px";
    container.style.background = "rgba(0,0,0,0.7)";
    container.style.border = "1px solid white";
    container.style.pointerEvents = "none";
    container.style.zIndex = "15";
    container.style.transform = "translate(-50%, -50%)";


    const bar = document.createElement(
        "div"
    );

    bar.style.width = "100%";
    bar.style.height = "100%";
    bar.style.background = "#e53935";

    container.appendChild(bar);

    document.body.appendChild(container);

    enemy.healthBarContainer = container;
    enemy.healthBar = bar;
}


function updateEnemyHealthBar(enemy) {

    if (
        !enemy.healthBarContainer ||
        !enemy.alive
    ) {

        return;
    }


    const worldPosition =
        enemy.position.clone();

    worldPosition.y +=
        2.5 * enemy.scale;


    worldPosition.project(camera);


    const x =
        (worldPosition.x * 0.5 + 0.5) *
        window.innerWidth;


    const y =
        (-worldPosition.y * 0.5 + 0.5) *
        window.innerHeight;


    enemy.healthBarContainer.style.left =
        `${x}px`;

    enemy.healthBarContainer.style.top =
        `${y}px`;


    const percentage =
        Math.max(
            0,
            enemy.health /
            enemy.maxHealth *
            100
        );


    enemy.healthBar.style.width =
        `${percentage}%`;
}


function removeEnemyHealthBar(enemy) {

    if (
        enemy.healthBarContainer
    ) {

        enemy.healthBarContainer.remove();

        enemy.healthBarContainer = null;
    }
}


// ============================================================
// GEGNER ERSTELLEN
// ============================================================

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

        position: new THREE.Vector3(
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

        scale: data.scale,

        healthBarContainer: null,

        healthBar: null,

        hitFlash: 0
    };


    enemy.mesh =
        createEnemyModel(
            data,
            enemy
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


    createEnemyHealthBar(
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


// ============================================================
// GEGNER-MODELL
// ============================================================

function createEnemyModel(
    data,
    enemy
) {

    const group =
        new THREE.Group();


    const material =
        new THREE.MeshStandardMaterial({
            color: data.color
        });


    const body =
        new THREE.Mesh(
            new THREE.CapsuleGeometry(
                0.48,
                1.0,
                6,
                10
            ),
            material
        );

    body.position.y = 1.15;

    body.castShadow = true;

    group.add(body);


    const head =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.36,
                12,
                12
            ),
            material
        );

    head.position.y = 2.05;

    head.castShadow = true;

    group.add(head);


    const leftArm =
        new THREE.Mesh(
            new THREE.CapsuleGeometry(
                0.12,
                0.65,
                4,
                8
            ),
            material
        );

    leftArm.position.set(
        -0.58,
        1.25,
        0
    );

    group.add(leftArm);


    const rightArm =
        new THREE.Mesh(
            new THREE.CapsuleGeometry(
                0.12,
                0.65,
                4,
                8
            ),
            material
        );

    rightArm.position.set(
        0.58,
        1.25,
        0
    );

    group.add(rightArm);


    group.scale.set(
        data.scale,
        data.scale,
        data.scale
    );


    return group;
}


// ============================================================
// STARTGEGNER
// ============================================================

spawnEnemy("grunt");
spawnEnemy("grunt");
spawnEnemy("runner");
spawnEnemy("tank");


// ============================================================
// TREFFERBEREICH
// ============================================================

const attackRangeMesh =
    new THREE.Mesh(
        new THREE.ConeGeometry(
            2.2,
            3.5,
            32,
            1,
            true
        ),
        new THREE.MeshBasicMaterial({
            color: 0x66ccff,
            transparent: true,
            opacity: 0.18,
            side: THREE.DoubleSide,
            depthWrite: false
        })
    );


attackRangeMesh.rotation.x =
    -Math.PI / 2;


attackRangeMesh.visible =
    false;


scene.add(
    attackRangeMesh
);


let attackRangeTimer = 0;


// ============================================================
// TREFFER-PARTIKEL
// ============================================================

function createHitParticles(
    position,
    isElite = false
) {

    const particleCount =
        isElite ? 22 : 12;


    const geometry =
        new THREE.BufferGeometry();


    const positions = [];


    for (
        let i = 0;
        i < particleCount;
        i++
    ) {

        positions.push(
            position.x,
            position.y,
            position.z
        );
    }


    geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(
            positions,
            3
        )
    );


    const material =
        new THREE.PointsMaterial({
            color: isElite
                ? 0xffd700
                : 0xffffff,

            size: isElite
                ? 0.22
                : 0.15,

            transparent: true,

            opacity: 1
        });


    const particles =
        new THREE.Points(
            geometry,
            material
        );


    scene.add(
        particles
    );


    const velocities = [];


    for (
        let i = 0;
        i < particleCount;
        i++
    ) {

        velocities.push(
            new THREE.Vector3(
                (Math.random() - 0.5) * 4,
                Math.random() * 4,
                (Math.random() - 0.5) * 4
            )
        );
    }


    let life = 0.35;


    function animateParticles(delta) {

        life -= delta;


        const array =
            particles.geometry.attributes
                .position.array;


        for (
            let i = 0;
            i < particleCount;
            i++
        ) {

            array[i * 3] +=
                velocities[i].x *
                delta;

            array[i * 3 + 1] +=
                velocities[i].y *
                delta;

            array[i * 3 + 2] +=
                velocities[i].z *
                delta;

            velocities[i].y -=
                8 *
                delta;
        }


        particles.geometry.attributes
            .position.needsUpdate = true;


        particles.material.opacity =
            Math.max(
                0,
                life / 0.35
            );


        if (
            life > 0
        ) {

            requestAnimationFrame(
                () => animateParticles(
                    0.016
                )
            );

        }
        else {

            scene.remove(
                particles
            );

            geometry.dispose();

            material.dispose();
        }
    }


    animateParticles(0.016);
}


// ============================================================
// SCHADENSANZEIGE
// ============================================================

function showDamageNumber(
    position,
    amount,
    isElite = false
) {

    const element =
        document.createElement(
            "div"
        );


    element.textContent =
        `-${amount}`;


    element.style.position =
        "fixed";


    element.style.color =
        isElite
            ? "#ffd700"
            : "#ff4444";


    element.style.fontSize =
        isElite
            ? "30px"
            : "25px";


    element.style.fontWeight =
        "bold";


    element.style.textShadow =
        "2px 2px 4px black";


    element.style.pointerEvents =
        "none";


    element.style.zIndex =
        "90";


    document.body.appendChild(
        element
    );


    const projected =
        position.clone();


    projected.y +=
        1.5;


    projected.project(
        camera
    );


    let x =
        (projected.x * 0.5 + 0.5) *
        window.innerWidth;


    let y =
        (-projected.y * 0.5 + 0.5) *
        window.innerHeight;


    element.style.left =
        `${x}px`;


    element.style.top =
        `${y}px`;


    let life = 0.8;


    function animate() {

        life -= 0.016;

        y -= 0.7;

        element.style.top =
            `${y}px`;


        element.style.opacity =
            Math.max(
                0,
                life / 0.8
            );


        if (
            life > 0
        ) {

            requestAnimationFrame(
                animate
            );

        }
        else {

            element.remove();

        }
    }


    animate();
}


// ============================================================
// GEGNER BLINKEN
// ============================================================

function flashEnemy(enemy) {

    if (
        !enemy.mesh
    ) {

        return;
    }


    enemy.hitFlash =
        0.12;


    enemy.mesh.traverse(
        object => {

            if (
                object.isMesh &&
                object.material
            ) {

                object.material.emissive =
                    new THREE.Color(
                        0xffffff
                    );

                object.material.emissiveIntensity =
                    1;
            }
        }
    );
}


function updateEnemyFlash(
    enemy,
    delta
) {

    if (
        enemy.hitFlash <= 0
    ) {

        return;
    }


    enemy.hitFlash -=
        delta;


    if (
        enemy.hitFlash <= 0
    ) {

        enemy.mesh.traverse(
            object => {

                if (
                    object.isMesh &&
                    object.material
                ) {

                    object.material.emissive =
                        new THREE.Color(
                            0x000000
                        );

                    object.material.emissiveIntensity =
                        0;
                }
            }
        );
    }
}


// ============================================================
// XP
// ============================================================

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


// ============================================================
// LOOT
// ============================================================

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

        inventory["Eisen"] +=
            2;

        inventory["Leder"] +=
            2;


        showMessage(
            `👑 Elite-Loot: +${gold} Gold +2 Eisen +2 Leder`
        );

    }
    else {

        const roll =
            Math.random();


        if (
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
    }


    updateHUD();

    saveGame(false);
}


// ============================================================
// GEGNER BESIEGT
// ============================================================

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


    createHitParticles(
        enemy.position.clone().add(
            new THREE.Vector3(
                0,
                1,
                0
            )
        ),
        enemy.type === "elite"
    );


    showMessage(
        `${enemy.name} besiegt! Respawn in ${RESPAWN_TIME}s`
    );


    removeEnemyHealthBar(
        enemy
    );


    enemy.mesh.rotation.z =
        Math.PI / 2;


    setTimeout(() => {

        if (
            enemy.mesh
        ) {

            scene.remove(
                enemy.mesh
            );
        }

    }, 500);
}


// ============================================================
// GEGNER SCHADEN
// ============================================================

function damageEnemy(
    enemy,
    damage
) {

    if (
        !enemy.alive
    ) {

        return;
    }


    enemy.health -=
        damage;


    flashEnemy(
        enemy
    );


    createHitParticles(
        enemy.position.clone().add(
            new THREE.Vector3(
                0,
                1,
                0
            )
        ),
        enemy.type === "elite"
    );


    showDamageNumber(
        enemy.position,
        damage,
        enemy.type === "elite"
    );


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


// ============================================================
// ANGRIFF
// ============================================================

function attack() {

    if (
        player.attackCooldown > 0
    ) {

        return;
    }


    player.attackCooldown =
        0.55;


    attackRangeTimer =
        0.22;


    attackRangeMesh.visible =
        true;


    sword.rotation.z =
        -Math.PI * 0.8;


    setTimeout(() => {

        sword.rotation.z =
            -0.25;

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


        difference.y = 0;


        const distance =
            difference.length();


        if (
            distance > 4.2
        ) {

            continue;
        }


        difference.normalize();


        const dot =
            attackDirection.dot(
                difference
            );


        if (
            dot > 0.2
        ) {

            hitSomething =
                true;


            damageEnemy(
                enemy,
                player.weaponDamage
            );
        }
    }


    // Absichtlich KEINE "VERFEHLT"-Anzeige.
}


// ============================================================
// TREFFERBEREICH AKTUALISIEREN
// ============================================================

function updateAttackRange(
    delta
) {

    if (
        attackRangeTimer <= 0
    ) {

        attackRangeMesh.visible =
            false;

        return;
    }


    attackRangeTimer -=
        delta;


    attackRangeMesh.position.copy(
        player.position
    );


    attackRangeMesh.position.y =
        0.05;


    attackRangeMesh.rotation.y =
        cameraYaw;
}


// ============================================================
// GEGNER-KI
// ============================================================

function updateEnemies(delta) {

    for (
        const enemy of enemies
    ) {

        if (
            !enemy.alive
        ) {

            continue;
        }


        updateEnemyFlash(
            enemy,
            delta
        );


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


        updateEnemyHealthBar(
            enemy
        );
    }
}


// ============================================================
// RESPAWN
// ============================================================

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
                data.scale,
                spawn[1]
            );


            enemy.mesh =
                createEnemyModel(
                    data,
                    enemy
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


            createEnemyHealthBar(
                enemy
            );


            if (
                newType === "elite"
            ) {

                showMessage(
                    "👑 Ein Elite-Gegner ist zurück!"
                );

            }
            else {

                showMessage(
                    `${data.name} ist wieder da!`
                );
            }
        }
    }
}


// ============================================================
// SPIELER SCHADEN
// ============================================================

function damagePlayer(damage) {

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


    showMessage(
        `-${reducedDamage} HP`
    );


    updateHUD();


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


// ============================================================
// INVENTAR
// ============================================================

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


    Object.assign(
        menu.style,
        {

            position: "fixed",

            left: "50%",

            top: "50%",

            transform:
                "translate(-50%, -50%)",

            background:
                "rgba(10,10,10,0.95)",

            padding: "30px",

            border:
                "2px solid white",

            color: "white",

            zIndex: "100",

            minWidth: "320px",

            fontFamily: "Arial"
        }
    );


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


// ============================================================
// SPEICHERN
// ============================================================

function saveGame(show = true) {

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


// ============================================================
// LADEN
// ============================================================

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
    catch (
        error
    ) {

        console.error(
            "Save konnte nicht geladen werden:",
            error
        );
    }
}


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

        padding: "15px",

        background:
            "rgba(0,0,0,0.55)",

        color: "white",

        fontFamily: "Arial",

        zIndex: "20",

        lineHeight: "1.6",

        borderRadius: "8px"
    }
);


document.body.appendChild(
    hud
);


// ============================================================
// LEBENSBALKEN SPIELER
// ============================================================

const healthContainer =
    document.createElement(
        "div"
    );


Object.assign(
    healthContainer.style,
    {

        position: "fixed",

        bottom: "25px",

        left: "25px",

        width: "250px",

        height: "25px",

        border: "2px solid white",

        background:
            "rgba(0,0,0,0.5)",

        zIndex: "20"
    }
);


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


// ============================================================
// HUD AKTUALISIEREN
// ============================================================

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
        ) +
        "%";
}


// ============================================================
// NACHRICHTEN
// ============================================================

function showMessage(text) {

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

            top: "35%",

            transform:
                "translate(-50%, -50%)",

            color: "white",

            fontSize: "26px",

            fontWeight: "bold",

            textShadow:
                "2px 2px 5px black",

            zIndex: "80",

            pointerEvents: "none"
        }
    );


    document.body.appendChild(
        message
    );


    setTimeout(() => {

        message.remove();

    }, 900);
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


    if (
        document.pointerLockElement
    ) {

        document.exitPointerLock();
    }


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
                "rgba(0,0,0,0.85)",

            display: "flex",

            flexDirection: "column",

            alignItems: "center",

            justifyContent: "center",

            color: "white",

            fontSize: "40px",

            zIndex: "200",

            fontFamily: "Arial"
        }
    );


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
// TASTATUR
// ============================================================

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
// MAUS / KAMERA
// ============================================================

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
                -1.0,
                0.5
            );
    }
);


// ============================================================
// SPIELERBEWEGUNG
// ============================================================

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


        player.position.x +=
            direction.x *
            speed *
            delta;


        player.position.z +=
            direction.z *
            speed *
            delta;


        // Held dreht sich in Bewegungsrichtung.
        const targetRotation =
            Math.atan2(
                direction.x,
                direction.z
            );


        playerMesh.rotation.y =
            THREE.MathUtils.lerp(
                playerMesh.rotation.y,
                targetRotation,
                0.18
            );
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


// ============================================================
// KAMERA
// ============================================================

function updateCamera() {

    const target =
        player.position.clone();


    target.y +=
        1.25;


    const offset =
        new THREE.Vector3(
            0,
            2.2,
            7.5
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
// FENSTERGRÖSSE
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


    updateAttackRange(
        delta
    );


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

playerMesh.position.copy(
    player.position
);

updateHUD();

gameLoop();
