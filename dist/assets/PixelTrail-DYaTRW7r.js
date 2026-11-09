import{r as R,R as oe}from"./index-SsCB3gfi.js";const _=512,M=256,Ae={square:0,circle:1,diamond:2},Se={fade:0,shrink:1,dither:2},ne=c=>c,Me=`#version 300 es
in vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`,Ie=`#version 300 es
precision highp float;
uniform sampler2D u_trail;
uniform sampler2D u_image;
uniform sampler2D u_age;
uniform vec2 u_resolution;
uniform float u_gridSize;
uniform float u_sigma;
uniform vec3 u_color;
uniform vec3 u_trailColor;
uniform float u_ramp;
uniform float u_shine;
uniform float u_glow;
uniform int u_shape;
uniform int u_decay;
uniform float u_gap;
uniform float u_sparkle;
uniform float u_time;
uniform float u_hasImage;
out vec4 outColor;

const float BAYER[16] = float[16](0.0, 8.0, 2.0, 10.0, 12.0, 4.0, 14.0, 6.0, 3.0, 11.0, 1.0, 9.0, 15.0, 7.0, 13.0, 5.0);
const vec3 LIGHT = vec3(-0.42, 0.58, 0.7);

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float erfApprox(float x) {
  float s = sign(x);
  x = abs(x);
  float t = 1.0 / (1.0 + 0.3275911 * x);
  float y = 1.0 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * exp(-x * x);
  return s * y;
}

float cellValue(ivec2 c) {
  vec2 center = (vec2(c) + 0.5) / u_gridSize;
  if (center.x < 0.0 || center.y < 0.0 || center.x > 1.0 || center.y > 1.0) return 0.0;
  float t = texelFetch(u_trail, clamp(ivec2(center * 512.0), ivec2(0), ivec2(511)), 0).r;
  if (t <= 0.0) return 0.0;
  if (u_sparkle > 0.0) {
    float n = hash(vec2(c) + floor(u_time * 14.0) * 7.31);
    float dim = 1.0 - t;
    if (n < u_sparkle * dim * 0.35) t = max(t, 0.85);
    else if (n > 1.0 - u_sparkle * dim * 0.5) t = 0.0;
  }
  if (u_decay == 2 && t * 2.2 <= (BAYER[(c.y & 3) * 4 + (c.x & 3)] + 0.5) / 16.0) return 0.0;
  return t;
}

vec3 baseColor(ivec2 owner, vec2 uv) {
  if (u_hasImage > 0.5) return texelFetch(u_image, clamp(owner, ivec2(0), ivec2(textureSize(u_image, 0)) - 1), 0).rgb;
  if (u_ramp > 0.5) return mix(u_trailColor, u_color, smoothstep(0.05, 0.95, texture(u_age, uv).r));
  return u_color;
}

vec3 tone(vec3 base, float strength) {
  vec3 body = mix(base * 0.55, base, smoothstep(0.3, 0.75, strength));
  return mix(body, mix(base, vec3(1.0), 0.22), smoothstep(0.85, 1.0, strength) * u_shine);
}

float seams(vec2 q, float cs) {
  if (u_gap <= 0.0) return 0.0;
  vec2 f = fract(q / cs);
  float border = min(min(f.x, 1.0 - f.x), min(f.y, 1.0 - f.y)) * cs;
  float width = max(1.0, u_gap * cs * 0.5);
  return 1.0 - smoothstep(width - 0.75, width + 0.75, border);
}

vec3 shade(vec3 base, vec3 n) {
  vec3 l = normalize(LIGHT);
  vec3 h = normalize(l + vec3(0.0, 0.0, 1.0));
  float lit = dot(n, l) - l.z;
  vec3 color = base * (1.0 + lit * 0.9 * u_shine);
  float spec = pow(max(dot(n, h), 0.0), 64.0) * 0.85 + pow(max(dot(n, h), 0.0), 10.0) * 0.08;
  color += spec * u_shine * mix(vec3(1.0), base, 0.15) * step(0.001, 1.0 - n.z);
  return clamp(color, 0.0, 1.0);
}

void main() {
  float maxRes = max(u_resolution.x, u_resolution.y);
  vec2 q = gl_FragCoord.xy - 0.5 * u_resolution + 0.5 * maxRes;
  vec2 uv = q / maxRes;
  float cs = maxRes / u_gridSize;
  ivec2 base = ivec2(floor(q / cs));

  float alpha = 0.0;
  vec3 color = vec3(0.0);

  if (u_sigma > 0.0) {
    float inv = 0.70710678 / u_sigma;
    float norm = 0.39894228 / u_sigma;
    float spread = 0.5 / (u_sigma * u_sigma);
    int reach = int(clamp(ceil(3.0 * u_sigma / cs), 1.0, 3.0));
    float field = 0.0;
    vec2 grad = vec2(0.0);
    float best = -1.0;
    ivec2 owner = base;
    float wx[7];
    float gx[7];
    float wy[7];
    float gy[7];
    for (int i = 0; i < 7; i++) {
      int offset = i - 3;
      if (abs(offset) > reach) continue;
      vec2 lo = vec2(base + ivec2(offset)) * cs - q;
      vec2 hi = lo + cs;
      wx[i] = 0.5 * (erfApprox(hi.x * inv) - erfApprox(lo.x * inv));
      wy[i] = 0.5 * (erfApprox(hi.y * inv) - erfApprox(lo.y * inv));
      gx[i] = norm * (exp(-lo.x * lo.x * spread) - exp(-hi.x * hi.x * spread));
      gy[i] = norm * (exp(-lo.y * lo.y * spread) - exp(-hi.y * hi.y * spread));
    }
    for (int j = 0; j < 7; j++) {
      if (abs(j - 3) > reach) continue;
      for (int i = 0; i < 7; i++) {
        if (abs(i - 3) > reach) continue;
        ivec2 c = base + ivec2(i - 3, j - 3);
        float t = cellValue(c);
        if (t <= 0.0) continue;
        float weight = t * wx[i] * wy[j];
        field += weight;
        grad += t * vec2(gx[i] * wy[j], wx[i] * gy[j]);
        if (weight > best) {
          best = weight;
          owner = c;
        }
      }
    }
    float edge = max(0.0263, length(grad) * 0.6);
    alpha = smoothstep(0.5 - edge, 0.5 + edge, field);
    if (alpha > 0.0) {
      vec3 n = normalize(vec3(-grad * cs * 0.55, 1.0));
      float strength = max(cellValue(base), field);
      vec3 body = tone(baseColor(owner, uv), strength);
      body *= 1.0 - seams(q, cs) * 0.32;
      color = shade(body, n);
    }
  } else {
    float t = cellValue(base);
    if (t > 0.0) {
      float halfSize = 0.5 * (1.0 - u_gap);
      float fade = t;
      if (u_decay == 1) {
        halfSize *= sqrt(clamp(t * 2.5, 0.0, 1.0));
        fade = 1.0;
      } else if (u_decay == 2) {
        fade = 1.0;
      }
      vec2 local = fract(q / cs) - 0.5;
      float d;
      vec2 dir;
      if (u_shape == 1) {
        d = length(local) - halfSize;
        dir = normalize(local + 1e-5);
      } else if (u_shape == 2) {
        d = (abs(local.x) + abs(local.y) - halfSize * 1.2) * 0.7071;
        dir = sign(local) * 0.7071;
      } else {
        vec2 a = abs(local) - halfSize;
        d = max(a.x, a.y);
        dir = a.x > a.y ? vec2(sign(local.x), 0.0) : vec2(0.0, sign(local.y));
      }
      float px = 1.0 / cs;
      float coverage = clamp(0.5 - d / px, 0.0, 1.0);
      alpha = coverage * fade;
      if (alpha > 0.0) {
        float bevel = smoothstep(-0.16 * (1.0 - u_gap), 0.0, d);
        vec3 n = normalize(vec3(dir * bevel * 0.9, 1.0));
        color = shade(tone(baseColor(base, uv), t), n);
      }
    }
  }

  vec4 pixel = vec4(color * alpha, alpha);
  if (u_glow > 0.0) {
    float glow = texture(u_trail, uv).r;
    float amount = smoothstep(0.0, 0.7, glow) * u_glow * 0.55 * (1.0 - alpha);
    vec3 tint = u_hasImage > 0.5 ? texture(u_image, uv).rgb : (u_ramp > 0.5 ? mix(u_trailColor, u_color, 0.5) : u_color);
    pixel += vec4(tint * amount, amount);
  }
  if (pixel.a <= 0.002) discard;
  outColor = pixel;
}
`,le=(()=>{let c=null;return(b,y)=>{if(typeof document>"u")return y;if(!c){const A=document.createElement("canvas");A.width=1,A.height=1,c=A.getContext("2d",{willReadFrequently:!0})}if(!c)return y;c.clearRect(0,0,1,1),c.fillStyle="#000",c.fillStyle=b,c.fillRect(0,0,1,1);const[h,G,I]=c.getImageData(0,0,1,1).data;return[h/255,G/255,I/255]}})(),se=(c,b,y)=>{const h=c.createShader(b);return h?(c.shaderSource(h,y),c.compileShader(h),c.getShaderParameter(h,c.COMPILE_STATUS)?h:(c.deleteShader(h),null)):null};function Ue({gridSize:c=40,trailSize:b=.1,maxAge:y=250,interpolate:h=5,easingFunction:G=ne,gooeyFilter:I={strength:2},color:A="#ffffff",trailColor:q,shape:ce="square",gap:fe=.08,decay:ue="fade",flow:me=0,gravity:de=0,sparkle:he=0,clickBurst:ge=!1,shine:xe=.6,glow:ve=.4,imageSrc:z,dpr:pe,className:_e="",style:Ee}){const W=R.useRef(null),Y=R.useRef(null),w=R.useRef(null),E=R.useRef(null);return E.current={gridSize:Math.max(1,c),trailSize:Math.max(0,b),maxAge:Math.max(1,y),interpolate:h,ease:G||ne,goo:I?Math.max(0,I.strength??2):0,color:le(A,[1,1,1]),trailColor:q?le(q,[1,1,1]):null,shape:Ae[ce]??0,gap:Math.min(Math.max(fe,0),.9),decay:Se[ue]??0,flow:Math.min(Math.max(me,0),1),gravity:Math.min(Math.max(de,-1),1),sparkle:Math.min(Math.max(he,0),1),clickBurst:ge,shine:Math.min(Math.max(xe,0),1),glow:Math.min(Math.max(ve,0),1),dpr:pe},R.useEffect(()=>{const g=W.current,u=Y.current;if(!g||!u)return;const e=u.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:!1,powerPreference:"high-performance"});if(!e)return;const F=se(e,e.VERTEX_SHADER,Me),B=se(e,e.FRAGMENT_SHADER,Ie),x=e.createProgram();if(!F||!B||!x||(e.attachShader(x,F),e.attachShader(x,B),e.linkProgram(x),e.deleteShader(F),e.deleteShader(B),!e.getProgramParameter(x,e.LINK_STATUS)))return;e.useProgram(x);const f={},Te=e.getProgramParameter(x,e.ACTIVE_UNIFORMS);for(let t=0;t<Te;t++){const r=e.getActiveUniform(x,t);r&&(f[r.name]=e.getUniformLocation(x,r.name))}const N=e.createVertexArray(),H=e.createBuffer();e.bindVertexArray(N),e.bindBuffer(e.ARRAY_BUFFER,H),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0);const k=t=>{const r=e.createTexture();return e.activeTexture(e.TEXTURE0+t),e.bindTexture(e.TEXTURE_2D,r),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,new Uint8Array([0,0,0,255])),r},V=k(0);e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR);const j=k(1),$=k(2);e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.uniform1i(f.u_trail,0),e.uniform1i(f.u_image,1),e.uniform1i(f.u_age,2);const C=document.createElement("canvas");C.width=_,C.height=_;const d=C.getContext("2d");if(!d)return;d.fillStyle="black",d.fillRect(0,0,_,_);const U=document.createElement("canvas");U.width=M,U.height=M;const v=U.getContext("2d");if(!v)return;const a={alive:!0,raf:0,last:0,time:0,visible:!0,width:1,height:1,ratio:1,points:[],force:0,image:null,imageReady:!1,imageCells:0,imageWidth:0,imageHeight:0,pointer:{x:0,y:0,at:0,vx:0,vy:0,inside:!1}},Re=(t,r,n,i)=>{const o=E.current,{points:l}=a,m=l[l.length-1];if(m){const s=m.x-t,p=m.y-r,T=s*s+p*p,ie=Math.max(.3,Math.min(T*1e4,1));if(a.force=ie,o.interpolate){const D=Math.ceil(T/Math.pow(o.trailSize*.5/o.interpolate,2));if(D>1)for(let X=1;X<D;X++)l.push({x:m.x-s/D*X,y:m.y-p/D*X,age:0,force:ie,vx:n,vy:i})}}l.push({x:t,y:r,age:0,force:a.force,vx:n,vy:i})},ye=t=>{const r=E.current,n=t.x*_,i=(1-t.y)*_;let o=1;t.age<r.maxAge*.3?o=r.ease(t.age/(r.maxAge*.3)):o=r.ease(1-(t.age-r.maxAge*.3)/(r.maxAge*.7)),o*=t.force,d.globalCompositeOperation="screen";const l=_*r.trailSize*o,m=d.createRadialGradient(n,i,Math.max(0,l*.25),n,i,Math.max(0,l));if(m.addColorStop(0,"rgba(255, 255, 255, 0.2)"),m.addColorStop(1,"rgba(0, 0, 0, 0.0)"),d.beginPath(),d.fillStyle=m,d.arc(n,i,Math.max(0,l),0,Math.PI*2),d.fill(),!r.trailColor||l<=0)return;const s=M/_,p=Math.round(255*Math.min(Math.max(1-t.age/r.maxAge,0),1)),T=v.createRadialGradient(n*s,i*s,0,n*s,i*s,l*s);T.addColorStop(0,`rgb(${p}, ${p}, ${p})`),T.addColorStop(.75,`rgb(${p}, ${p}, ${p})`),T.addColorStop(1,"rgba(0, 0, 0, 0)"),v.globalCompositeOperation="lighten",v.beginPath(),v.fillStyle=T,v.arc(n*s,i*s,l*s,0,Math.PI*2),v.fill()},we=t=>{const r=E.current;if(d.globalCompositeOperation="source-over",d.fillStyle="black",d.fillRect(0,0,_,_),r.trailColor&&(v.globalCompositeOperation="source-over",v.fillStyle="black",v.fillRect(0,0,M,M)),a.points.forEach((n,i)=>{n.age+=t*1e3,n.age>r.maxAge&&a.points.splice(i,1)}),a.points.length||(a.force=0),r.flow>0||r.gravity!==0){const n=Math.exp(-3*t);for(const i of a.points)i.vx*=n,i.vy=i.vy*n-r.gravity*1.6*t,i.x+=i.vx*t,i.y+=i.vy*t}a.points.forEach(ye)},be=(t,r)=>{for(let i=0;i<14;i++){const o=i/14*Math.PI*2+Math.random()*.3,l=.35+Math.random()*.25;a.points.push({x:t,y:r,age:0,force:1,vx:Math.cos(o)*l,vy:Math.sin(o)*l})}},K=()=>{e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,j);const t=a.image;if(!t){a.imageReady=!1;return}const r=E.current,n=Math.max(1,Math.round(r.gridSize)),i=document.createElement("canvas");i.width=n,i.height=n;const o=i.getContext("2d");if(!o)return;const l=Math.max(a.width,a.height),m=Math.max(a.width/t.naturalWidth,a.height/t.naturalHeight),s=l/m;o.imageSmoothingQuality="high",o.drawImage(t,(t.naturalWidth-s)/2,(t.naturalHeight-s)/2,s,s,0,0,n,n),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,i),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),a.imageReady=!0,a.imageCells=n,a.imageWidth=a.width,a.imageHeight=a.height},P=()=>{const t=E.current,r=t.dpr??Math.min(window.devicePixelRatio||1,2),n=Math.max(1,g.clientWidth),i=Math.max(1,g.clientHeight);a.width=n,a.height=i,a.ratio=r;const o=Math.max(1,Math.floor(n*r)),l=Math.max(1,Math.floor(i*r));(u.width!==o||u.height!==l)&&(u.width=o,u.height=l),a.image&&(a.imageCells!==Math.max(1,Math.round(t.gridSize))||a.imageWidth!==n||a.imageHeight!==i)&&K()},S=()=>{const t=E.current;e.viewport(0,0,u.width,u.height),e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,V),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,C),t.trailColor&&(e.activeTexture(e.TEXTURE2),e.bindTexture(e.TEXTURE_2D,$),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,U)),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.uniform2f(f.u_resolution,a.width*a.ratio,a.height*a.ratio),e.uniform1f(f.u_gridSize,t.gridSize),e.uniform3fv(f.u_color,t.color),e.uniform3fv(f.u_trailColor,t.trailColor??t.color),e.uniform1f(f.u_ramp,t.trailColor?1:0),e.uniform1f(f.u_sigma,t.goo*a.ratio),e.uniform1f(f.u_shine,t.shine),e.uniform1f(f.u_glow,t.glow),e.uniform1i(f.u_shape,t.shape),e.uniform1i(f.u_decay,t.decay),e.uniform1f(f.u_gap,t.gap),e.uniform1f(f.u_sparkle,t.sparkle),e.uniform1f(f.u_time,a.time),e.uniform1f(f.u_hasImage,a.imageReady?1:0),e.bindVertexArray(N),e.drawArrays(e.TRIANGLE_STRIP,0,4)},Z=t=>{if(a.raf=0,!a.alive)return;const r=a.last?(t-a.last)/1e3:1/60;a.last=t,a.time+=r,P(),we(r),S(),a.points.length&&a.visible?a.raf=requestAnimationFrame(Z):a.last=0},O=()=>{!a.raf&&a.alive&&a.visible&&(a.raf=requestAnimationFrame(Z))},Q=t=>{const r=g.getBoundingClientRect(),n=t.clientX-r.left,i=t.clientY-r.top,o=Math.max(r.width,r.height);return{x:(n-r.width/2)/o+.5,y:(r.height/2-i)/o+.5,inside:n>=0&&i>=0&&n<=r.width&&i<=r.height}},J=t=>{const{x:r,y:n,inside:i}=Q(t),o=a.pointer,l=performance.now();if(i){const m=E.current,s=Math.max(.008,(l-o.at)/1e3);o.inside?(o.vx+=((r-o.x)/s-o.vx)*.5,o.vy+=((n-o.y)/s-o.vy)*.5):(o.vx=0,o.vy=0),Re(r,n,o.vx*m.flow*.3,o.vy*m.flow*.3),O()}o.x=r,o.y=n,o.at=l,o.inside=i},ee=t=>{const{x:r,y:n,inside:i}=Q(t);!i||!E.current.clickBurst||(be(r,n),O())},L=()=>{a.pointer.inside=!1},te=new ResizeObserver(()=>{P(),S()});te.observe(g);const ae=new IntersectionObserver(t=>{a.visible=t.some(r=>r.isIntersecting),a.visible&&O()});ae.observe(g);const re=t=>{t.preventDefault(),a.alive=!1,cancelAnimationFrame(a.raf)};return u.addEventListener("webglcontextlost",re),window.addEventListener("pointermove",J,{passive:!0}),window.addEventListener("pointerdown",ee,{passive:!0}),document.documentElement.addEventListener("pointerleave",L),window.addEventListener("blur",L),w.current={setImage:t=>{a.image=t,K(),S()},redraw:()=>{P(),S()}},P(),S(),()=>{a.alive=!1,cancelAnimationFrame(a.raf),te.disconnect(),ae.disconnect(),u.removeEventListener("webglcontextlost",re),window.removeEventListener("pointermove",J),window.removeEventListener("pointerdown",ee),document.documentElement.removeEventListener("pointerleave",L),window.removeEventListener("blur",L),w.current=null,e.deleteTexture(V),e.deleteTexture(j),e.deleteTexture($),e.deleteBuffer(H),e.deleteVertexArray(N),e.deleteProgram(x)}},[]),R.useEffect(()=>{if(!z){w.current?.setImage(null);return}let g=!0;const u=new Image;return u.crossOrigin="anonymous",u.decoding="async",u.onload=()=>{g&&w.current?.setImage(u)},u.onerror=()=>{g&&w.current?.setImage(null)},u.src=z,()=>{g=!1}},[z]),R.useEffect(()=>{w.current?.redraw()}),oe.createElement("div",{ref:W,className:`pixel-canvas ${_e}`.trim(),style:{position:"relative",width:"100%",height:"100%",overflow:"hidden",pointerEvents:"none",...Ee}},oe.createElement("canvas",{ref:Y,style:{display:"block",width:"100%",height:"100%"}}))}export{Ue as default};
