/* ================= 渲染 ================= */
const view=$('#view');
const MOBILE=matchMedia('(pointer:coarse)').matches;
const renderer=new THREE.WebGLRenderer({antialias:false,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(MOBILE?1.5:1.75,devicePixelRatio||1));renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.0;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
const cvs=renderer.domElement;view.prepend(cvs);
const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0xa98676,.00105);
const camera=new THREE.PerspectiveCamera(68,1,.3,9000);camera.rotation.order='YXZ';scene.add(camera);
scene.add(new THREE.HemisphereLight(0x93a2dc,0x6e5a46,1.15));
const SUND=V(-.8,.2,.3).normalize();
const sun=new THREE.DirectionalLight(0xffb078,2.6);sun.castShadow=true;sun.shadow.mapSize.set(MOBILE?1024:2048,MOBILE?1024:2048);Object.assign(sun.shadow.camera,{left:-120,right:120,top:120,bottom:-120,near:10,far:900});sun.shadow.bias=-.0015;sun.shadow.normalBias=.4;scene.add(sun,sun.target);
/* 后期：泛光 + 暗角/色调 */
const composer=new EffectComposer(renderer,new THREE.WebGLRenderTarget(4,4,{type:THREE.HalfFloatType,samples:MOBILE?0:4}));
composer.addPass(new RenderPass(scene,camera));
const bloom=new UnrealBloomPass(new THREE.Vector2(256,256),.36,.5,.95);composer.addPass(bloom);
const grade=new ShaderPass({uniforms:{tDiffuse:{value:null},uT:{value:0}},vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
 fragmentShader:`uniform sampler2D tDiffuse;uniform float uT;varying vec2 vUv;float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
 void main(){vec4 c=texture2D(tDiffuse,vUv);vec2 q=vUv-.5;float v=smoothstep(.95,.25,length(q*vec2(1.,1.15)));c.rgb*=mix(.55,1.,v);float l=dot(c.rgb,vec3(.299,.587,.114));c.rgb=mix(vec3(l),c.rgb,1.12);c.rgb=mix(c.rgb,c.rgb*vec3(1.05,1.,.93),.5);c.rgb+=(h(vUv*800.+uT)-.5)*.012;gl_FragColor=c;}`});
composer.addPass(grade);composer.addPass(new OutputPass());let usePost=true;
/* 天空：晚霞、云、早出的星星 */
const sky=new THREE.Mesh(new THREE.SphereGeometry(7000,32,16),new THREE.ShaderMaterial({side:THREE.BackSide,fog:false,depthWrite:false,uniforms:{uS:{value:SUND},uT:{value:0}},
  vertexShader:`varying vec3 vD;void main(){vD=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
  fragmentShader:`varying vec3 vD;uniform vec3 uS;uniform float uT;
  float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
  float fb(vec2 p){float a=.5,s=0.;for(int i=0;i<5;i++){s+=a*n(p);p*=2.03;a*=.5;}return s;}
  void main(){vec3 d=normalize(vD);float y=max(d.y,0.);float sd=max(dot(d,uS),0.);
   vec3 hor=mix(vec3(.80,.56,.46),vec3(1.,.60,.30),pow(sd,2.));vec3 mid=mix(vec3(.42,.44,.62),vec3(.86,.55,.50),pow(sd,3.)*.8);vec3 top=vec3(.13,.19,.42);
   vec3 c=mix(hor,mid,smoothstep(0.,.2,y));c=mix(c,top,smoothstep(.15,.8,y));
   c+=vec3(1.,.6,.3)*pow(sd,40.)*.5+vec3(1.,.9,.7)*pow(sd,900.)*1.4;
   vec2 uv=d.xz/(y+.12)*1.4+vec2(uT*.004,0.);float cl=smoothstep(.48,.82,fb(uv)+.12*fb(uv*3.));cl*=smoothstep(0.,.1,y);
   vec3 cc=mix(vec3(.36,.30,.40),vec3(1.,.62,.42),pow(sd,1.5)*.9+.1);c=mix(c,cc,cl*.8);
   float st=step(.9985,h(floor(d.xz/(y+.3)*260.)))*smoothstep(.35,.8,y)*(1.-sd);c+=st*.8;
   if(d.y<0.)c=mix(hor*.6,vec3(.3,.26,.25),smoothstep(0.,-.15,d.y));
   gl_FragColor=vec4(c,1.);}`}));
sky.renderOrder=-10;sky.frustumCulled=false;scene.add(sky);
const mats={};const M=(c,o)=>o?new THREE.MeshLambertMaterial(Object.assign({color:c},o)):(mats[c]||(mats[c]=new THREE.MeshLambertMaterial({color:c})));
const BX=(w,h,d)=>new THREE.BoxGeometry(w,h,d),CY=(a,b,h,s=12,open=false)=>new THREE.CylinderGeometry(a,b,h,s,1,open),SPH=(r,a=10,b=8)=>new THREE.SphereGeometry(r,a,b);
let picks=[];
function add(geo,m,x,y,z,o={}){const me=new THREE.Mesh(geo,typeof m==='number'?M(m):m);me.position.set(x,y,z);if(o.rx)me.rotation.x=o.rx;if(o.ry)me.rotation.y=o.ry;if(o.rz)me.rotation.z=o.rz;me.castShadow=o.cast!==false;me.receiveShadow=true;(o.parent||scene).add(me);if(o.name){me.userData.t=Object.assign({name:o.name},o.t);picks.push(me);}return me;}
function ctex(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return t;}
/* 程序贴图 */
const hsh=(x,y)=>{let h=Math.imul(x|0,374761393)+Math.imul(y|0,668265263)|0;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296;};
function vn(x,y,per){const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf),w=(a,b)=>per?hsh(((a%per)+per)%per,((b%per)+per)%per):hsh(a,b);return(w(xi,yi)*(1-u)+w(xi+1,yi)*u)*(1-v)+(w(xi,yi+1)*(1-u)+w(xi+1,yi+1)*u)*v;}
function fbm(x,y,per=0,o=4){let a=.5,s=0,f=1,t=0;for(let i=0;i<o;i++){s+=a*vn(x*f,y*f,per?per*f:0);t+=a;a*=.5;f*=2;}return s/t;}
function pix(size,fn){const c=document.createElement('canvas');c.width=c.height=size;const g=c.getContext('2d'),im=g.createImageData(size,size),d=im.data;let i=0;for(let y=0;y<size;y++)for(let x=0;x<size;x++){const r=fn(x/size,y/size,x,y);d[i++]=r[0];d[i++]=r[1];d[i++]=r[2];d[i++]=255;}g.putImageData(im,0,0);return c;}
function tex(c,rx=1,ry=1){const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rx,ry);t.anisotropy=8;return t;}
const mix3=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
const C={
 plaster:pix(512,(u,v)=>{const n=fbm(u*8,v*8,8),s=vn(u*64,v*3,64),b=fbm(u*24,v*24,24,2);let c=mix3([232,226,208],[198,188,166],n*.9);c=mix3(c,[140,136,122],Math.max(0,s-.5)*1.3*(1-v*.4));c=mix3(c,[246,242,230],Math.max(0,b-.7));const m=clp((v-.76)/.22+(n-.5)*.6,0,1);return mix3(c,[86,94,74],m*.78);}),
 mud:pix(512,(u,v,x,y)=>{const n=fbm(u*8,v*8,8),f=fbm(u*60,v*60,60,2);let c=mix3([188,150,96],[158,120,72],n);c=mix3(c,[214,186,130],Math.max(0,f-.66)*2.4);if(y%52<2||(x+(Math.floor(y/52)%2)*52)%104<2)c=mix3(c,[112,84,52],.7);const m=clp((v-.8)/.2+(n-.5)*.5,0,1);return mix3(c,[96,82,58],m*.7);}),
 brick:pix(256,(u,v,x,y)=>{const row=Math.floor(y/16),off=row%2?16:0,bx=Math.floor((x+off)/32),mx=(x+off)%32,my=y%16;if(mx<2||my<2)return[172,164,152];const h=hsh(bx,row),n=vn(x*.3,y*.3,0);return mix3([146,68,46],[188,98,66],h*.7+n*.3);}),
 roof:pix(256,(u,v,x,y)=>{const cx=(x%32)/32,ry=(y%42)/42,sh=.5+.5*Math.sin(cx*Math.PI),ov=ry<.14?.55:1,n=fbm(u*10,v*10,10,3),m=Math.max(0,fbm(u*5+3,v*5,5,3)-.58)*2;const c=mix3([44,46,52],[104,106,112],sh*ov*(.6+n*.5));return mix3(c,[66,82,54],clp(m,0,.6));}),
 concrete:pix(512,(u,v,x,y)=>{const n=fbm(u*10,v*10,10),f=fbm(u*60,v*60,60,2);let c=mix3([146,142,134],[176,172,162],n);c=mix3(c,[118,114,106],Math.max(0,f-.62)*2);const cr=Math.abs(fbm(u*6+5,v*6+2,6,3)-.5);if(cr<.004)c=mix3(c,[84,82,76],.6);if(x%256<2||y%256<2)c=mix3(c,[92,90,84],.8);const st=Math.max(0,fbm(u*4+9,v*4+7,4,3)-.6)*2.2;return mix3(c,[100,106,88],clp(st,0,.5));}),
 grass:pix(512,(u,v)=>{const n=fbm(u*8,v*8,8),f=fbm(u*50,v*50,50,3),g=fbm(u*16+3,v*16+9,16,3);let c=mix3([124,112,70],[94,102,56],n);c=mix3(c,[152,138,90],f*.5);return mix3(c,[82,72,50],Math.max(0,g-.6)*1.8);}),
 dirt:pix(512,(u,v)=>{const n=fbm(u*8,v*8,8),f=fbm(u*70,v*70,70,2);let c=mix3([130,106,78],[156,130,98],n);c=mix3(c,[102,82,60],Math.max(0,f-.6)*2);const p=Math.max(0,fbm(u*5+2,v*5+8,5,3)-.66)*4;return mix3(c,[84,78,72],clp(p,0,.8));}),
 soil:pix(256,(u,v)=>{const f=.5+.5*Math.sin(u*Math.PI*2*8),n=fbm(u*20,v*20,20,3);return mix3([58,44,30],[106,82,56],f*.7+n*.4);}),
 paddy:pix(512,(u,v,x,y)=>{const n=fbm(u*8,v*8,8),gx=(x%32)-16,gy=(y%32)-16,st=Math.hypot(gx,gy)<3.5+hsh(x>>5,y>>5)*2.5;let c=mix3([108,94,66],[136,122,86],n);const w=Math.max(0,fbm(u*4+1,v*4+4,4,3)-.52)*3;c=mix3(c,[122,128,140],clp(w,0,.75));return st?mix3(c,[182,164,104],.85):c;}),
 wood:pix(256,(u,v,x,y)=>{const pl=Math.floor(x/43),n=vn(x*.08+pl*7,y*.9,0),g=vn(x*.5,y*.02+pl,0);let c=mix3([96,64,38],[134,94,58],n*.5+g*.5);if(x%43<2)c=[50,32,20];return c;}),
 stone:pix(256,(u,v)=>{const n=fbm(u*6,v*6,6,3),cell=fbm(u*12+4,v*12,12,2),c=mix3([112,108,98],[158,152,138],n);return Math.abs(cell-.5)<.035?[66,66,60]:mix3(c,[92,100,78],Math.max(0,fbm(u*4,v*4+6,4,2)-.6)*2);}),
 wtile:pix(256,(u,v,x,y)=>{const n=fbm(u*6,v*6,6,3);let c=mix3([230,230,224],[204,206,202],n);if(x%32<1||y%64<1)c=[166,166,160];return c;}),
};
const TX=(k,rx=1,ry=1)=>tex(C[k],rx,ry),LM=(map,o)=>new THREE.MeshLambertMaterial(Object.assign({map},o));
/* 发光小精灵（灯笼、窗、灯泡的光晕） */
const glowTex=ctex(64,64,g=>{const r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(.25,'rgba(255,255,255,.45)');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,64,64);});
function halo(x,y,z,s,col,op=.55,parent){const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:col,transparent:true,opacity:op,blending:THREE.AdditiveBlending,depthWrite:false}));sp.position.set(x,y,z);sp.scale.set(s,s,1);(parent||scene).add(sp);return sp;}
