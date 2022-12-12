import $ from 'jquery'

let fragSrc = "";
let vertSrc = "";
await $.ajax({
  url: "./glsl/fragment.glsl",
  dataType: "text",
  success: (result: any) => fragSrc = result,
  error: (err: any) => console.log(err),
});
await $.ajax({
  url: "./glsl/vertex.glsl",
  dataType: "text",
  success: (result: any) => vertSrc = result,
  error: (err: any) => console.log(err),
});

export { vertSrc, fragSrc }
