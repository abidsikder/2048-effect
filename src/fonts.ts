import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'

const fontLoader = new FontLoader();
const FontPromises = {
  "Regular" : new Promise(resolve => {
    fontLoader.load("./fonts/Inconsolata_Regular.json", f => {
      resolve(f);
    });
  }),
  "SemiBold" : new Promise(resolve => {
    fontLoader.load("./fonts/Inconsolata_SemiBold.json", f => {
      resolve(f);
    });
  }),
  "SemiExpanded" : new Promise(resolve => {
    fontLoader.load("./fonts/Inconsolata_SemiExpanded_ExtraBold.json", f => {
      resolve(f);
    });
  })
}
const TextFontShapes = {
  "Regular": await FontPromises["Regular"],
  "SemiBold": await FontPromises["SemiBold"],
  "SemiExpanded": await FontPromises["SemiExpanded"],
}

export { TextFontShapes };