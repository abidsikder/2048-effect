import * as THREE from 'three'
import { Tile } from './model'
import { TextFontShapes } from './fonts';
import { Font } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'

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
  0: 0x00A3FF, //boardBorder
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

// coordinates of the tiles 
// first coordinate is the model grid's x coordinate, then y coordinate
const tileCoord = {
  1: {
    1: new THREE.Vector3(-2.3, -1.8, 0),
    2: new THREE.Vector3(-2.3, -0.6000000000000001, 0),
    3: new THREE.Vector3(-2.3, 0.6, 0),
    4: new THREE.Vector3(-2.3, 1.8, 0),
  },
  2: {
    1: new THREE.Vector3(-1.1, -1.8, 0),
    2: new THREE.Vector3(-1.1, -0.6000000000000001, 0),
    3: new THREE.Vector3(-1.1, 0.6, 0),
    4: new THREE.Vector3(-1.1, 1.8, 0),
  },
  3: {
    1: new THREE.Vector3(0.10000000000000009, -1.8, 0),
    2: new THREE.Vector3(0.10000000000000009, -0.6000000000000001, 0),
    3: new THREE.Vector3(0.10000000000000009, 0.6, 0),
    4: new THREE.Vector3(0.10000000000000009, 1.8, 0),
  },
  4: {
    1: new THREE.Vector3(1.3, -1.8, 0),
    2: new THREE.Vector3(1.3, -0.6000000000000001, 0),
    3: new THREE.Vector3(1.3, 0.6, 0),
    4: new THREE.Vector3(1.3, 1.8, 0),
  }
};

function generateBoxTileBorder(t:Tile, THICKNESS:number = 0.04, DEPTH: number = 0.3, LENGTH: number = 1): THREE.Mesh {
  // @ts-ignore typescript being annoying about object access with array notation
  const color = colors[t.value];
  const mat = new THREE.MeshBasicMaterial({color});
  const sideGeo = new THREE.BoxGeometry(THICKNESS, LENGTH, DEPTH);
  const topBotGeo = new THREE.BoxGeometry(LENGTH - 2*THICKNESS, THICKNESS, DEPTH);

  const leftMesh = new THREE.Mesh(sideGeo, mat);
  const rightMesh = new THREE.Mesh(sideGeo, mat);
  const topMesh = new THREE.Mesh(topBotGeo, mat);
  const botMesh = new THREE.Mesh(topBotGeo, mat);

  rightMesh.position.x += LENGTH - THICKNESS;
  topMesh.position.x += LENGTH/2 - THICKNESS/2;
  topMesh.position.y += LENGTH/2 - THICKNESS/2;
  botMesh.position.x += LENGTH/2 - THICKNESS/2;
  botMesh.position.y -= LENGTH/2 - THICKNESS/2;

  const boxTile = new THREE.Group();
  boxTile.add(leftMesh);
  boxTile.add(rightMesh);
  boxTile.add(topMesh);
  boxTile.add(botMesh);

  // @ts-ignore weird error
  return boxTile;
}

function generateNumberText(t:Tile, THICKNESS: number = 0.04, DEPTH: number = 0.3/100, LENGTH: number = 1) {
  const border = generateBoxTileBorder(t, THICKNESS, DEPTH*50, LENGTH);
  const group = new THREE.Group();
  group.add(border);

  let textMeshes: THREE.Mesh[] = [];
  switch(t.value) {
    case 2:
      textMeshes = generate2(DEPTH, LENGTH);
      break;
    case 4:
      textMeshes = generate4(DEPTH, LENGTH);
      break;
    case 8:
      textMeshes = generate8(DEPTH, LENGTH);
      break;
    case 16:
      textMeshes = generate16(DEPTH, LENGTH);
      break;
    case 32:
      textMeshes = generate32(DEPTH, LENGTH);
      break;
    case 64:
      textMeshes = generate64(DEPTH, LENGTH);
      break;
    case 128:
      textMeshes = generate128(DEPTH, LENGTH);
      break;
    case 256:
      textMeshes = generate256(DEPTH, LENGTH);
      break;
    case 512:
      textMeshes = generate512(DEPTH, LENGTH);
      break;
    case 1024:
      textMeshes = generate1024(DEPTH, LENGTH);
      break;
    case 2048:
      textMeshes = generate2048(DEPTH, LENGTH);
      break;
    default:
      alert("Error in generating the proper text Meshes");
      break;
  }

  // add all the ones in the textmesh array to the group
  for (let i = 0; i < textMeshes.length; i++) {
    group.add(textMeshes[i]);
  }

  return group;
}

function generate2(DEPTH: number = 0.3/100, LENGTH: number = 1): THREE.Mesh[] {
    const textGeo2 = new TextGeometry("2", {
      font: TextFontShapes["SemiBold"] as Font,
      size: LENGTH/1.5,
      height: DEPTH,
    });
    const color = colors[2];
    const mat = new THREE.MeshBasicMaterial({color});
    const textMesh = new THREE.Mesh(textGeo2, mat);

    textMesh.position.x += LENGTH * 0.25;
    textMesh.position.y -= LENGTH * 0.3;
    textMesh.position.z -= DEPTH/2;

    return [textMesh];
}

function generate4(DEPTH: number = 0.3/100, LENGTH: number = 1): THREE.Mesh[] {
  const textGeo4 = new TextGeometry("4", {
    font: TextFontShapes["SemiBold"] as Font,
    size: LENGTH/1.5,
    height: DEPTH,
  });
  const color = colors[4];
  const mat = new THREE.MeshBasicMaterial({color});
  const textMesh = new THREE.Mesh(textGeo4, mat);

  textMesh.position.x += LENGTH * 0.25;
  textMesh.position.y -= LENGTH * 0.3;
  textMesh.position.z -= DEPTH/2;
  
  return [textMesh];
}

function generate8(DEPTH: number = 0.3/100, LENGTH: number = 1): THREE.Mesh[] {
  const textGeo8 = new TextGeometry("8", {
    font: TextFontShapes["SemiBold"] as Font,
    size: LENGTH/1.5,
    height: DEPTH,
  });
  const color = colors[8];
  const mat = new THREE.MeshBasicMaterial({color});
  const textMesh = new THREE.Mesh(textGeo8, mat);

  textMesh.position.x += LENGTH * 0.25;
  textMesh.position.y -= LENGTH * 0.3;
  textMesh.position.z -= DEPTH/2;
  
  return [textMesh];
}

function generate16(DEPTH: number = 0.3/100, LENGTH: number = 1): THREE.Mesh[] {
  const textGeo1 = new TextGeometry("1", {
    font: TextFontShapes["SemiBold"] as Font,
    size: LENGTH/2,
    height: DEPTH,
  });
  const textGeo6 = new TextGeometry("6", {
    font: TextFontShapes["SemiBold"] as Font,
    size: LENGTH/2,
    height: DEPTH,
  });
  const color = colors[16];
  const mat = new THREE.MeshBasicMaterial({color});
  const textMesh1 = new THREE.Mesh(textGeo1, mat);
  const textMesh6 = new THREE.Mesh(textGeo6, mat);

  textMesh1.position.x += LENGTH * 0.15;
  textMesh1.position.y -= LENGTH * 0.25;
  textMesh1.position.z -= DEPTH/2;

  textMesh6.position.x += LENGTH * 0.45;
  textMesh6.position.y -= LENGTH * 0.25;
  textMesh6.position.z -= DEPTH/2;

  return [textMesh1, textMesh6];
}

function generate32(DEPTH: number = 0.3/100, LENGTH: number = 1): THREE.Mesh[] {
  const textGeo3 = new TextGeometry("3", {
    font: TextFontShapes["SemiBold"] as Font,
    size: LENGTH/2,
    height: DEPTH,
  });

  const textGeo2 = new TextGeometry("2", {
    font: TextFontShapes["SemiBold"] as Font,
    size: LENGTH/2,
    height: DEPTH,
  });
  const color = colors[32];
  const mat = new THREE.MeshBasicMaterial({color});
  const textMesh3 = new THREE.Mesh(textGeo3, mat);
  const textMesh2 = new THREE.Mesh(textGeo2, mat);

  textMesh3.position.x += LENGTH * 0.13;
  textMesh3.position.y -= LENGTH * 0.25;
  textMesh3.position.z -= DEPTH/2;

  textMesh2.position.x += LENGTH * 0.45;
  textMesh2.position.y -= LENGTH * 0.25;
  textMesh2.position.z -= DEPTH/2;

  return [textMesh3, textMesh2];
}

function generate64(DEPTH: number = 0.3/100, LENGTH: number = 1): THREE.Mesh[] {
  const textGeo6 = new TextGeometry("6", {
    font: TextFontShapes["SemiBold"] as Font,
    size: LENGTH/2,
    height: DEPTH,
  });

  const textGeo4 = new TextGeometry("4", {
    font: TextFontShapes["SemiBold"] as Font,
    size: LENGTH/2,
    height: DEPTH,
  });
  const color = colors[64];
  const mat = new THREE.MeshBasicMaterial({color});
  const textMesh6 = new THREE.Mesh(textGeo6, mat);
  const textMesh4 = new THREE.Mesh(textGeo4, mat);


  textMesh6.position.x += LENGTH * 0.13;
  textMesh6.position.y -= LENGTH * 0.25;
  textMesh6.position.z -= DEPTH/2;

  textMesh4.position.x += LENGTH * 0.47;
  textMesh4.position.y -= LENGTH * 0.25;
  textMesh4.position.z -= DEPTH/2;

  return [textMesh6, textMesh4];
}

function generate128(DEPTH: number = 0.3/100, LENGTH: number = 1): THREE.Mesh[] {
  const textGeo1 = new TextGeometry("1", {
    font: TextFontShapes["SemiBold"] as Font,
    size: LENGTH/2.5,
    height: DEPTH,
  });

  const textGeo2 = new TextGeometry("2", {
    font: TextFontShapes["SemiBold"] as Font,
    size: LENGTH/2.5,
    height: DEPTH,
  });

  const textGeo8 = new TextGeometry("8", {
    font: TextFontShapes["SemiBold"] as Font,
    size: LENGTH/2.5,
    height: DEPTH,
  });

  const color = colors[128];
  const mat = new THREE.MeshBasicMaterial({color});
  const textMesh1 = new THREE.Mesh(textGeo1, mat);
  const textMesh2 = new THREE.Mesh(textGeo2, mat);
  const textMesh8 = new THREE.Mesh(textGeo8, mat);

  textMesh1.position.x += LENGTH * 0.08;
  textMesh1.position.y -= LENGTH * 0.2;
  textMesh1.position.z -= DEPTH/2;

  textMesh2.position.x += LENGTH * 0.3;
  textMesh2.position.y -= LENGTH * 0.2;
  textMesh2.position.z -= DEPTH/2;

  textMesh8.position.x += LENGTH * 0.58;
  textMesh8.position.y -= LENGTH * 0.2;
  textMesh8.position.z -= DEPTH/2;

  return [textMesh1, textMesh2, textMesh8];
}

function generate256(DEPTH: number = 0.3/100, LENGTH: number = 1): THREE.Mesh[] {
  const textGeo2 = new TextGeometry("2", {
    font: TextFontShapes["SemiBold"] as Font,
    size: LENGTH/2.5,
    height: DEPTH,
  });

  const textGeo5 = new TextGeometry("5", {
    font: TextFontShapes["SemiBold"] as Font,
    size: LENGTH/2.5,
    height: DEPTH,
  });

  const textGeo6 = new TextGeometry("6", {
    font: TextFontShapes["SemiBold"] as Font,
    size: LENGTH/2.5,
    height: DEPTH,
  });

  const color = colors[256];
  const mat = new THREE.MeshBasicMaterial({color});
  const textMesh2 = new THREE.Mesh(textGeo2, mat);
  const textMesh5 = new THREE.Mesh(textGeo5, mat);
  const textMesh6 = new THREE.Mesh(textGeo6, mat);


  textMesh2.position.x += LENGTH * 0.08;
  textMesh2.position.y -= LENGTH * 0.2;
  textMesh2.position.z -= DEPTH/2;

  textMesh5.position.x += LENGTH * 0.34;
  textMesh5.position.y -= LENGTH * 0.2;
  textMesh5.position.z -= DEPTH/2;

  textMesh6.position.x += LENGTH * 0.6;
  textMesh6.position.y -= LENGTH * 0.2;
  textMesh6.position.z -= DEPTH/2;

  return [textMesh2, textMesh5, textMesh6];
}

function generate512(DEPTH: number = 0.3/100, LENGTH: number = 1): THREE.Mesh[] {
  const textGeo5 = new TextGeometry("5", {
    font: TextFontShapes["SemiBold"] as Font,
    size: LENGTH/2.5,
    height: DEPTH,
  });

  const textGeo1 = new TextGeometry("1", {
    font: TextFontShapes["SemiBold"] as Font,
    size: LENGTH/2.5,
    height: DEPTH,
  });

  const textGeo2 = new TextGeometry("2", {
    font: TextFontShapes["SemiBold"] as Font,
    size: LENGTH/2.5,
    height: DEPTH,
  });

  const color = colors[256];
  const mat = new THREE.MeshBasicMaterial({color});
  const textMesh5 = new THREE.Mesh(textGeo5, mat);
  const textMesh1 = new THREE.Mesh(textGeo1, mat);
  const textMesh2 = new THREE.Mesh(textGeo2, mat);

  textMesh5.position.x += LENGTH * 0.09;
  textMesh5.position.y -= LENGTH * 0.2;
  textMesh5.position.z -= DEPTH/2;

  textMesh1.position.x += LENGTH * 0.36;
  textMesh1.position.y -= LENGTH * 0.2;
  textMesh1.position.z -= DEPTH/2;

  textMesh2.position.x += LENGTH * 0.58;
  textMesh2.position.y -= LENGTH * 0.2;
  textMesh2.position.z -= DEPTH/2;

  return [textMesh5, textMesh1, textMesh2];
}

function generate1024(DEPTH: number = 0.3/100, LENGTH: number = 1): THREE.Mesh[] {
  const textGeo1 = new TextGeometry("1", {
    font: TextFontShapes["SemiBold"] as Font,
    size: LENGTH/3.7,
    height: DEPTH,
  });

  const textGeo0 = new TextGeometry("0", {
    font: TextFontShapes["SemiBold"] as Font,
    size: LENGTH/3.7,
    height: DEPTH,
  });

  const textGeo2 = new TextGeometry("2", {
    font: TextFontShapes["SemiBold"] as Font,
    size: LENGTH/3.7,
    height: DEPTH,
  });

  const textGeo4 = new TextGeometry("4", {
    font: TextFontShapes["SemiBold"] as Font,
    size: LENGTH/3.7,
    height: DEPTH,
  });


  const color = colors[1024];
  const mat = new THREE.MeshBasicMaterial({color});
  const textMesh1 = new THREE.Mesh(textGeo1, mat);
  const textMesh0 = new THREE.Mesh(textGeo0, mat);
  const textMesh2 = new THREE.Mesh(textGeo2, mat);
  const textMesh4 = new THREE.Mesh(textGeo4, mat);

  textMesh1.position.x += LENGTH * 0.09;
  textMesh1.position.y -= LENGTH * 0.12;
  textMesh1.position.z -= DEPTH/2;

  textMesh0.position.x += LENGTH * 0.27;
  textMesh0.position.y -= LENGTH * 0.12;
  textMesh0.position.z -= DEPTH/2;

  textMesh2.position.x += LENGTH * 0.46;
  textMesh2.position.y -= LENGTH * 0.12;
  textMesh2.position.z -= DEPTH/2;

  textMesh4.position.x += LENGTH * 0.66;
  textMesh4.position.y -= LENGTH * 0.12;
  textMesh4.position.z -= DEPTH/2;

  return [textMesh1, textMesh0, textMesh2, textMesh4];
}

function generate2048(DEPTH: number = 0.3/100, LENGTH: number = 1): THREE.Mesh[] {
  const textGeo2 = new TextGeometry("2", {
    font: TextFontShapes["SemiBold"] as Font,
    size: LENGTH/3.7,
    height: DEPTH/100,
  });

  const textGeo0 = new TextGeometry("0", {
    font: TextFontShapes["SemiBold"] as Font,
    size: LENGTH/3.7,
    height: DEPTH/100,
  });

  const textGeo4 = new TextGeometry("4", {
    font: TextFontShapes["SemiBold"] as Font,
    size: LENGTH/3.7,
    height: DEPTH/100,
  });

  const textGeo8 = new TextGeometry("8", {
    font: TextFontShapes["SemiBold"] as Font,
    size: LENGTH/3.7,
    height: DEPTH/100,
  });

  const color = colors[2048];
  const mat = new THREE.MeshBasicMaterial({color});
  const textMesh2 = new THREE.Mesh(textGeo2, mat);
  const textMesh0 = new THREE.Mesh(textGeo0, mat);
  const textMesh4 = new THREE.Mesh(textGeo4, mat);
  const textMesh8 = new THREE.Mesh(textGeo8, mat);

  textMesh2.position.x += LENGTH * 0.09;
  textMesh2.position.y -= LENGTH * 0.12;
  textMesh2.position.z -= DEPTH/200;

  textMesh0.position.x += LENGTH * 0.3;
  textMesh0.position.y -= LENGTH *0.12;
  textMesh0.position.z -= DEPTH/200;

  textMesh4.position.x += LENGTH * 0.48;
  textMesh4.position.y -= LENGTH * 0.12;
  textMesh4.position.z -= DEPTH/200;

  textMesh8.position.x += LENGTH * 0.68;
  textMesh8.position.y -= LENGTH * 0.12;
  textMesh8.position.z -= DEPTH/200;

  return [textMesh2, textMesh0, textMesh4, textMesh8];
}

function generateTitle(THICKNESS: number = 0.04, DEPTH: number = 0.3/100, LENGTH: number = 1) {
  const textGeo1 = new TextGeometry("2048", {
    font: TextFontShapes["SemiBold"] as Font,
    size: LENGTH/1.8,
    height: DEPTH/100,
  });

  const textGeo2 = new TextGeometry("Effect", {
    font: TextFontShapes["SemiBold"] as Font,
    size: LENGTH/1.8,
    height: DEPTH/100,
  });

  const color = new THREE.Color(1, 1, 1);
  const mat = new THREE.MeshLambertMaterial({
    color//,
    // opacity: 1,
    // transparent: true
  });
  const textMesh1 = new THREE.Mesh(textGeo1, mat);
  const textMesh2 = new THREE.Mesh(textGeo2, mat);

  textMesh1.position.x += LENGTH * 0.05;
  textMesh1.position.y += LENGTH * 0.7 ;
  textMesh1.position.z -= DEPTH/200;

  textMesh2.position.x += LENGTH * 0.05;
  textMesh2.position.y -= LENGTH *0.12;
  textMesh2.position.z -= DEPTH/200;

  const group = new THREE.Group();
  group.add(textMesh1);
  group.add(textMesh2);

  return group;
}

function generateScore(score: number, THICKNESS: number = 0.04, DEPTH: number = 0.3/100, LENGTH: number = 1) {
  const textGeo1 = new TextGeometry("Score", {
    font: TextFontShapes["SemiBold"] as Font,
    size: LENGTH/3,
    height: DEPTH/100,
  });

  const scoreString = String(score);
  const textGeo2 = new TextGeometry(scoreString, {
    font: TextFontShapes["SemiBold"] as Font,
    size: LENGTH/3,
    height: DEPTH/100,
  });

  const color = new THREE.Color(colors.scoreNumber)
  const mat = new THREE.MeshBasicMaterial({color});
  const textMesh1 = new THREE.Mesh(textGeo1, mat);
  const textMesh2 = new THREE.Mesh(textGeo2, mat);

  textMesh1.position.x += LENGTH * 0.007;
  textMesh1.position.y += LENGTH * 0.75;
  textMesh1.position.z -= DEPTH/200;

  textMesh2.position.x += LENGTH * 0.007;
  textMesh2.position.y += LENGTH *0.35;
  textMesh2.position.z -= DEPTH/200;

  const group = new THREE.Group();
  group.add(textMesh1);
  group.add(textMesh2);

  return group;
}

function generateMessage(THICKNESS: number = 0.04, DEPTH: number = 0.3/100, LENGTH: number = 1) {
  const textGeo1 = new TextGeometry("Press 's' key for sparkle ", {
    font: TextFontShapes["SemiBold"] as Font,
    size: LENGTH/7,
    height: DEPTH/100,
  });

  const color = new THREE.Color(colors.scoreNumber)
  const mat = new THREE.MeshBasicMaterial({color});
  const textMesh1 = new THREE.Mesh(textGeo1, mat);

  textMesh1.position.x -= LENGTH * 0.1;
  textMesh1.position.y += LENGTH * 0.7 ;
  textMesh1.position.z -= DEPTH/200;

  return textMesh1;
}

export { 
  colors, generateBoxTileBorder, generateNumberText, generateTitle, generateScore, generateMessage,
  tileCoord
};
