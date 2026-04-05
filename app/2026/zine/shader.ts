export const item0 = {
  vertexShader: `
     varying vec2 vUv;
     void main() {
       vUv = uv;
       gl_Position = vec4(position, 1.0);
     }
   `,
  fragmentShader: `
   varying vec2 vUv;
   uniform float uTime;
   uniform sampler2D uTex;

   float rand1(float y) {
     return fract(sin(y * 12.9898) * 43758.5453123);
   }
   float rand2(vec2 p) {
     return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
   }
   vec2 getOffset2(vec2 p) {
     return vec2(rand2(p) - 0.5, rand2(p * 12.34) - 0.5);
   }
   vec2 rotatePos(vec2 p, float a) {
     return p * mat2(cos(a), -sin(a), sin(a), cos(a));
   }

   float lumi(vec3 color) {
     return dot(color, vec3(0.3, 0.59, 0.11));
   }

   void main() {
     vec2 uv = vUv;

     vec3 texCol = texture2D(uTex, uv).rgb;
     float l = lumi(texCol);
     float pL = pow(l, .1);

     // texCol = pow(texCol, vec3(l * 5.));
     // if(rand1(l) > 0.0) {
     //   gl_FragColor = vec4(texCol, 1.);
     // } else {
     //   gl_FragColor = vec4(vec3(l), 1.);
     // }

     float parm = 0.2;
     if(texCol.g < parm && texCol.r < parm && texCol.b < parm) {
       texCol = vec3(1., 0., 0.);
       gl_FragColor = vec4(texCol, 1.);
     } else {
       gl_FragColor = vec4(texCol, 1.);
     }
   }`,
};

export const item1 = {
  vertexShader: `
     varying vec2 vUv;
     void main() {
       vUv = uv;
       gl_Position = vec4(position, 1.0);
     }
   `,
  fragmentShader: `
   varying vec2 vUv;
   uniform float uTime;
   uniform sampler2D uTex;

   float rand1(float y) {
     return fract(sin(y * 12.9898) * 43758.5453123);
   }
   float rand2(vec2 p) {
     return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
   }
   vec2 getOffset2(vec2 p) {
     return vec2(rand2(p) - 0.5, rand2(p * 12.34) - 0.5);
   }
   vec2 rotatePos(vec2 p, float a) {
     return p * mat2(cos(a), -sin(a), sin(a), cos(a));
   }

   float lumi(vec3 color) {
     return dot(color, vec3(0.3, 0.59, 0.11));
   }

   void main() {
     vec2 uv = vUv;

     vec2 blockUv = floor(uv * 250.) / 250.;

     vec3 texCol = texture2D(uTex, blockUv).rgb;
     float l = lumi(texCol);
     float pL = pow(l, .1);

     texCol = pow(texCol, vec3(l * 5.)) * 1.5;
     if(rand1(l) > .5) {
       gl_FragColor = vec4(texCol, 1.);
     } else {
       gl_FragColor = vec4(vec3(l), 1.);
     }
   }`,
};

export const item2 = {
  vertexShader: `
     varying vec2 vUv;
     void main() {
       vUv = uv;
       gl_Position = vec4(position, 1.0);
     }
   `,
  fragmentShader: `
   varying vec2 vUv;
   uniform float uTime;
   uniform sampler2D uTex;

   float rand1(float y) {
     return fract(sin(y * 12.9898) * 43758.5453123);
   }
   float rand2(vec2 p) {
     return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
   }
   vec2 getOffset2(vec2 p) {
     return vec2(rand2(p) - 0.5, rand2(p * 12.34) - 0.5);
   }
   vec2 rotatePos(vec2 p, float a) {
     return p * mat2(cos(a), -sin(a), sin(a), cos(a));
   }

   float lumi(vec3 color) {
     return dot(color, vec3(0.3, 0.59, 0.11));
   }

   void main() {
     vec2 uv = vUv;

     // vec2 blockUv = floor(uv * 250.) / 250.;

     vec3 finalCol = vec3(.0);


     for(float i = .0; i < 7.; i++) {
      vec3 texCol = texture2D(uTex, uv - vec2(0., -.3 +i / 5. * 0.8)).rgb;
      float l = lumi(texCol);
      float pL = pow(l, .5) * 1.1;
      texCol = pow(texCol, vec3((1.-pL) * 1.5)) * 15.;
      float mono = lumi(texCol);
      if(rand1(i) > 0.5) {
        finalCol += vec3(mono);
      } else {
        finalCol += vec3(1.- texCol);
      }
     }

     // texCol = pow(texCol, vec3(1.));
     // gl_FragColor = vec4(vec3(finalCol * vec3(sin(finalCol.g * 1.), cos(finalCol.b * 2.), sin(finalCol.r * 3.))) , 1.);
     // gl_FragColor = mix(vec4(texCol1, 1.), vec4(vec3(1.-mono) , 1.), 0.5);
     gl_FragColor = vec4(finalCol / 7., 1.);
   }`,
};

export const item3 = {
  vertexShader: `
     varying vec2 vUv;
     void main() {
       vUv = uv;
       gl_Position = vec4(position, 1.0);
     }
   `,
  fragmentShader: `
   varying vec2 vUv;
   uniform float uTime;
   uniform sampler2D uTex;

   float rand1(float y) {
     return fract(sin(y * 12.9898) * 43758.5453123);
   }
   float rand2(vec2 p) {
     return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
   }
   vec2 getOffset2(vec2 p) {
     return vec2(rand2(p) - 0.5, rand2(p * 12.34) - 0.5);
   }
   vec2 rotatePos(vec2 p, float a) {
     return p * mat2(cos(a), -sin(a), sin(a), cos(a));
   }

   float lumi(vec3 color) {
     return dot(color, vec3(0.3, 0.59, 0.11));
   }

   void main() {
     vec2 uv = vUv;
     vec3 texCol = texture2D(uTex, uv).rgb;
     vec3 texCol1 = texture2D(uTex, uv - vec2(.01, 0.)).rgb;

     texCol = pow(texCol, vec3(5.));

     float l = lumi(texCol);

     vec3 finalColor = vec3(0.);
     finalColor.r = texture2D(uTex, uv - vec2(l * 0.5, 0.)).r;
     finalColor.g = texture2D(uTex, uv).g;
     finalColor.b = texture2D(uTex, uv + vec2(l * 0.5, 0.)).b;


     // finalColor = vec3(lumi(finalColor));
     gl_FragColor = mix(vec4(finalColor,1.), vec4(texCol, 1.), .0);
   }`,
};

export const item4 = {
  vertexShader: `
     varying vec2 vUv;
     void main() {
       vUv = uv;
       gl_Position = vec4(position, 1.0);
     }
   `,
  fragmentShader: `
   varying vec2 vUv;
   uniform float uTime;
   uniform sampler2D uTex;

   float rand1(float y) {
     return fract(sin(y * 12.9898) * 43758.5453123);
   }
   float rand2(vec2 p) {
     return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
   }
   vec2 getOffset2(vec2 p) {
     return vec2(rand2(p) - 0.5, rand2(p * 12.34) - 0.5);
   }
   vec2 rotatePos(vec2 p, float a) {
     return p * mat2(cos(a), -sin(a), sin(a), cos(a));
   }

   float lumi(vec3 color) {
     return dot(color, vec3(0.3, 0.59, 0.11));
   }

   void main() {
     vec2 uv = vUv;
     vec3 texCol = texture2D(uTex, uv).rgb;

     vec3 finalColor = vec3(0.);
     vec2 texUv = uv;
     for(float i = 0.; i < 5.; i++) {
      vec3 texCol = texture2D(uTex, texUv).rgb;
      float l = lumi(texCol);
      // texCol = pow(texCol, vec3(8.));
      // l = lumi(texCol);

      // if(texUv.x  > 0.5 && texUv.y > 0.5 || texUv.x < 0.5 && texUv.y < 0.5) {
      if(texUv.x  < 0.5 && texUv.y > 0.5) {
      // if(texUv.x  > 1. && texUv.y > 1.) {
      // if(texUv.x  > 0. && texUv.y > 0.0) {
        float xL = texUv.y > 0.5 ? lumi(texCol) : lumi(texture2D(uTex, rotatePos(texUv, 3.14)).rgb);
        float l = lumi(texCol);
        texCol = pow(texCol, vec3(20.)) * 2.5;
        finalColor += texCol;
        finalColor += vec3(lumi(texCol));
        // texUv = (texUv - 0.5) * (l + .5) + .5;
        l = lumi(texCol);
        xL = texUv.y > 0.5 ? lumi(texCol) : lumi(texture2D(uTex, rotatePos(texUv, 3.14)).rgb);
        texUv = (texUv - 0.5) * (.5 + pow(l, 3.5)) + .5;
      } else if ( texUv.x > 0.5 && texUv.y < 0.5 ) {
        // texCol = pow(texCol, vec3(1.));
        // // texCol = vec3(lumi(texCol));
        // finalColor += texCol;
        //
        float l = lumi(texCol);
        texCol = pow(texCol, vec3(6.5));
        finalColor += texCol;
        finalColor += vec3(lumi(texCol));
        // texUv = (texUv - 0.5) * (l + .5) + .5;
        // l = lumi(texCol);
        // texUv = (texUv - 0.5) * (.5 + pow(l, 3.5)) + .5;
      }
      else {
        texCol = pow(texCol, vec3(5.)) * 2.;
        texCol = vec3(lumi(texCol));
        finalColor += texCol;
        // float l = lumi(texCol);
        // texCol = pow(texCol, vec3(6.5));
        // finalColor += texCol;
        // finalColor += vec3(lumi(texCol));
      }
     }

     vec3 tex0 = texture2D(uTex, uv).rgb;
     tex0 = pow(tex0, vec3(1.));
     // tex0 = vec3(lumi(tex0));

     vec3 mixColor = mix(tex0, finalColor / 10., 1.);
     // vec3 mixColor = tex0 + finalColor / 10.;

     gl_FragColor = vec4(finalColor / 10., 1.);
     gl_FragColor = vec4(mixColor, 1.);
   }`,
};

export const item5 = {
  vertexShader: `
     varying vec2 vUv;
     void main() {
       vUv = uv;
       gl_Position = vec4(position, 1.0);
     }
   `,
  fragmentShader: `
   varying vec2 vUv;
   uniform float uTime;
   uniform sampler2D uTex;

   float rand1(float y) {
     return fract(sin(y * 12.9898) * 43758.5453123);
   }
   float rand2(vec2 p) {
     return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
   }
   vec2 getOffset2(vec2 p) {
     return vec2(rand2(p) - 0.5, rand2(p * 12.34) - 0.5);
   }
   vec2 rotatePos(vec2 p, float a) {
     return p * mat2(cos(a), -sin(a), sin(a), cos(a));
   }

   float lumi(vec3 color) {
     return dot(color, vec3(0.3, 0.59, 0.11));
   }

   void main() {
     vec2 uv = vUv;
     uv *= .9;
     uv.x -= .1;
     vec4 t = vec4(0.);
     t = texture2D(uTex, uv);
     float l = lumi(t.rgb);

     vec3 c = vec3(0.);

     vec2 bUv = uv;
     if(l < .65) {
      float s = floor(bUv.y * 20.);
      float b = rand1(s) * 20.;
      bUv.y = floor(bUv.y * b) / b;
      bUv.x -= rand1(bUv.y) * .35;
      vec4 t = vec4(0.);
      t = texture2D(uTex, bUv);
      float l = lumi(t.rgb);
      l = pow(l, 3.);
      l *= 1.5;
      if(uv.x > 0.5) {
        c = vec3(step(l, .01));
      } else {
        c = vec3(l);
      }
     } else {
      vec3 t = vec3(0.);
      t = texture2D(uTex, uv).rgb;
      t = pow(t, vec3(.5));
      c = t;
     }

     gl_FragColor = vec4(c, 1.);
   }`,
};
