import * as THREE from 'three'

// n is the number
function generateBoxTile(n:number): THREE.Mesh {
    // @ts-ignore typescript being annoying about object access with array notation
    const color = colors[n];

    const THICKNESS = 0.04;
    const DEPTH = 0.3;

    const mat = new THREE.MeshBasicMaterial({
        color
    });
    const sideGeo = new THREE.BoxGeometry(THICKNESS, 1, DEPTH);
    const topBotGeo = new THREE.BoxGeometry(1 - 2*THICKNESS, THICKNESS, DEPTH);

    const leftMesh = new THREE.Mesh(sideGeo, mat);
    leftMesh.position.multiplyScalar(0);
    const rightMesh = new THREE.Mesh(sideGeo, mat);
    rightMesh.position.x += 1 - 2*THICKNESS;
    const topMesh = new THREE.Mesh(topBotGeo, mat);
    topMesh.position.multiplyScalar(0);
    topMesh.position.x += 0.5 - THICKNESS;
    topMesh.position.y += (1 - THICKNESS)/2;
    const botMesh = new THREE.Mesh(topBotGeo, mat);
    botMesh.position.x += 0.5 - THICKNESS;
    botMesh.position.y -= (1 - THICKNESS)/2;

    const boxTile = new THREE.Group();
    boxTile.add(leftMesh);
    boxTile.add(rightMesh);
    boxTile.add(topMesh);
    boxTile.add(botMesh);

    // TODO add text

    return boxTile;
}

// hex colors in strings for all elements in the game
const colors = {
    2: 0xA5E871,
    4: 0x7FDA88,
    8: 0x2ABA7E,
    16: 0x1BCA95,
    32: 0x39B9CB,
    64: 0x46B9FA,
    128: 0x468EFA,
    256: 0x7471F0,
    512: 0x8F65E9,
    1024: 0xD868E1,
    2048: 0xDC629D,
    boardBorder: 0x00A3FF,
    titleText: 0x0B0000,
    titleGlow: 0x28D0E6,
    scoreLabel: 0x4CC3DD,
    scoreNumber: 0x4CC3DD,
    newGameText: 0x4DC9E4,
    newGameButton: 0x328597,
    winText: 0xD7F3EC,
    winGlow: 0x28D0E6,
    gameOverText: 0xA02626,
    gameOverGlow: 0x050505
};

export { generateBoxTile };
