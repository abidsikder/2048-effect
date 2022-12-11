import * as THREE from 'three'
import { TextFontShapes } from './main';
import { Font } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { Tile } from './model'

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

// font sizes from the design spec
const textSizes = {
  2: 85,
  4: 85,
  8: 85,
  16: 85,
  32: 85,
  64: 85,
  128: 75,
  256: 75,
  512: 75,
  1024: 60,
  2048: 60,
  titleText: 110,
  scoreLabel: 40,
  scoreNumber: 40,
  newGameText: 40,
  winText: 110,
  gameOverText: 80,
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

  // @ts-ignore fauly error message, type mismatch but it still works
  return boxTile;
}

function generate2(t:Tile, THICKNESS: number = 0.04, DEPTH: number = 0.3, LENGTH: number = 1) {
    const textGeo = new TextGeometry("2", {
      font: TextFontShapes["SemiBold"] as Font,
      size: LENGTH/1.14,
      height: DEPTH,
    });
    const color = colors[2];
    const mat = new THREE.MeshBasicMaterial({color});
    const textMesh = new THREE.Mesh(textGeo, mat);

    textMesh.position.x += LENGTH * 0.15;
    textMesh.position.y -= LENGTH * 0.4;
    textMesh.position.z -= DEPTH/2;

    return textMesh;
}

function generate4(t:Tile, THICKNESS: number = 0.04, DEPTH: number = 0.3, LENGTH: number = 1) {
  const textGeo = new TextGeometry("4", {
    font: TextFontShapes["SemiBold"] as Font,
    size: LENGTH/1.14,
    height: DEPTH,
  });
  const color = colors[4];
  const mat = new THREE.MeshBasicMaterial({color});
  const textMesh = new THREE.Mesh(textGeo, mat);

  textMesh.position.x += LENGTH * 0.12;
  textMesh.position.y -= LENGTH * 0.38;
  textMesh.position.z -= DEPTH/2;

  return textMesh;
}

function generate8(t:Tile, THICKNESS: number = 0.04, DEPTH: number = 0.3, LENGTH: number = 1) {
  const textGeo = new TextGeometry("8", {
    font: TextFontShapes["SemiBold"] as Font,
    size: LENGTH/1.14,
    height: DEPTH,
  });
  const color = colors[8];
  const mat = new THREE.MeshBasicMaterial({color});
  const textMesh = new THREE.Mesh(textGeo, mat);

  textMesh.position.x += LENGTH * 0.16;
  textMesh.position.y -= LENGTH * 0.38;
  textMesh.position.z -= DEPTH/2;

  return textMesh;
}

// function generate16(t:Tile, THICKNESS: number = 0.04, DEPTH: number = 0.3, LENGTH: number = 1) {
//   const textGeo1 = new TextGeometry("1", {
//     font: TextFontShapes["SemiBold"] as Font,
//     size: LENGTH/1.14,
//     height: DEPTH,
//   });

//   const textGeo6 = new TextGeometry("6", {
//     font: TextFontShapes["SemiBold"] as Font,
//     size: LENGTH/1.14,
//     height: DEPTH,
//   });
//   const color = colors[8];
//   const mat = new THREE.MeshBasicMaterial({color});
//   const group = new THREE.Group();
//   const textMesh = new THREE.Mesh(textGeo1, mat);
//   const textMesh = new THREE.Mesh(textGeo6, mat);

//   textMesh.position.x += LENGTH * 0.16;
//   textMesh.position.y -= LENGTH * 0.38;
//   textMesh.position.z -= DEPTH/2;

//   return textMesh;
// }



    // TODO add text inside of the box tile
    // const textStr = String(t.value);
    // const textMeshes = new THREE.Group();
    // for (let i = 0; i < textStr.length; i++) {
    //   const digit = textStr[i];
    //   const textGeo = new TextGeometry(digit, {
    //     font: TextFontShapes["Regular"] as Font,
    //     size: LENGTH/1.14,
    //     height: DEPTH,
    //   });
    //   const textMesh = new THREE.Mesh(textGeo, mat);
      // textMesh.position.add(computeBoxTileTextShift(t,THICKNESS,DEPTH,LENGTH));
      // textMesh.position.x += LENGTH* 0.8 * scale;
      // textMesh.position.y -= LENGTH * 0.4 * scale;
      // textMesh.position.z -= DEPTH/2;

      // const scale = 1/textStr.length * 1.2;
      // textMesh.position.x += i * LENGTH/1.14 * 0.6 * scale;

      // textMeshes.add(textMesh);


// function computeBoxTileTextShift(t:Tile, THICKNESS:number, DEPTH:number, LENGTH:number): THREE.Vector3 {
//   const shift = new THREE.Vector3();
//   shift.z = DEPTH;
//   switch(t.value) {
//     case 2: {
//       shift.x += 3;
//       break;
//     }
//     default:

//   }

//   return shift;
// }


export { generateBoxTileBorder, generate2, generate4, generate8};
