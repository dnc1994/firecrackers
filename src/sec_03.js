/* ================= 粒子 / 碎屑 / 痕迹 ================= */
function pointSys(max,additive){const geo=new THREE.BufferGeometry(),P=new Float32Array(max*3),C=new Float32Array(max*3),Z=new Float32Array(max),A=new Float32Array(max);
 geo.setAttribute('position',new THREE.BufferAttribute(P,3));geo.setAttribute('pcol',new THREE.BufferAttribute(C,3));geo.setAttribute('size',new THREE.BufferAttribute(Z,1));geo.setAttribute('alpha',new THREE.BufferAttribute(A,1));
 const mat=new THREE.ShaderMaterial({uniforms:{uScale:{value:500}},transparent:true,depthWrite:false,blending:additive?THREE.AdditiveBlending:THREE.NormalBlending,
  vertexShader:`attribute float size;attribute float alpha;attribute vec3 pcol;varying vec3 vC;varying float vA;uniform float uScale;void main(){vC=pcol;vA=alpha;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=clamp(size*uScale/-mv.z,1.,320.);gl_Position=projectionMatrix*mv;}`,
  fragmentShader:`varying vec3 vC;varying float vA;void main(){float d=length(gl_PointCoord-.5)*2.;if(d>1.)discard;gl_FragColor=vec4(vC,pow(1.-d,1.4)*vA);}`});
 const pts=new THREE.Points(geo,mat);pts.frustumCulled=false;pts.renderOrder=additive?6:5;scene.add(pts);return{geo,P,C,Z,A,mat,max,L:[]};}
const SPK=pointSys(3500,true),SMK=pointSys(1800,false);
function addP(sys,o){if(sys.L.length>=sys.max)sys.L.shift();o.l0=o.life;sys.L.push(o);}
function updP(sys,dt){const L=sys.L;let n=0;for(const p of L){p.life-=dt;if(p.life<=0)continue;p.vy-=p.g*dt;const dr=Math.exp(-p.drag*dt);p.vx*=dr;p.vy*=dr;p.vz*=dr;p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;p.s+=p.sg*dt;if(p.y<0&&p.g>0){p.y=0;p.vy*=-.3;}L[n++]=p;}
 L.length=n;for(let i=0;i<n;i++){const p=L[i],f=clp(p.life/p.l0,0,1);sys.P[i*3]=p.x;sys.P[i*3+1]=p.y;sys.P[i*3+2]=p.z;sys.C[i*3]=p.c[0];sys.C[i*3+1]=p.c[1];sys.C[i*3+2]=p.c[2];sys.Z[i]=Math.max(.01,p.s);sys.A[i]=p.a*f;}
 sys.geo.setDrawRange(0,n);for(const a of['position','pcol','size','alpha'])sys.geo.attributes[a].needsUpdate=true;}
const SPC=[[1,.96,.78],[1,.82,.35],[1,.69,.19]];
function sparks(p,n,sp,cols){for(let i=0;i<n;i++){_v.set(rnd(-1,1),rnd(-1,1),rnd(-1,1)).normalize().multiplyScalar(rnd(.3,1)*sp);addP(SPK,{x:p.x,y:p.y,z:p.z,vx:_v.x,vy:_v.y,vz:_v.z,life:rnd(.12,.45),g:G*.35,drag:2.5,s:rnd(.25,.5),sg:0,c:cols?pk(cols):pk(SPC),a:1});}}
function glow(p,s,life,c){addP(SPK,{x:p.x,y:p.y,z:p.z,vx:0,vy:0,vz:0,life,g:0,drag:0,s,sg:s*2,c:c||[1,.8,.5],a:.9});}
function smoke(p,n,sc,c){for(let i=0;i<n;i++){const v=rnd(.5,.72);addP(SMK,{x:p.x+rnd(-.4,.4)*sc,y:p.y+rnd(-.2,.4)*sc,z:p.z+rnd(-.4,.4)*sc,vx:rnd(-3,3)*sc,vy:rnd(1,6)*sc,vz:rnd(-3,3)*sc,life:rnd(1.4,3),g:-1.5,drag:1.4,s:rnd(1.2,2.2)*sc,sg:rnd(1.6,3)*sc,c:c||[v,v,v*1.04],a:.42});}}
function spray(p,n,sp){for(let i=0;i<n;i++){const a=rnd(0,TAU),h=rnd(0,.3)*sp;addP(SMK,{x:p.x+rnd(-1,1),y:p.y,z:p.z+rnd(-1,1),vx:Math.cos(a)*h,vy:rnd(.4,1)*sp,vz:Math.sin(a)*h,life:rnd(.9,1.8),g:G,drag:.3,s:rnd(.5,1.1),sg:0,c:[.82,.92,.98],a:.85});}}
const ZERO=new THREE.Matrix4().makeScale(0,0,0);
function instSys(geo,mat,N){const m=new THREE.InstancedMesh(geo,mat,N);m.frustumCulled=false;_col.set(0xffffff);for(let i=0;i<N;i++){m.setMatrixAt(i,ZERO);m.setColorAt(i,_col);}scene.add(m);return{m,N,i:0,fly:[],slots:new Array(N)};}
const BITS=instSys(new THREE.PlaneGeometry(.55,.36),new THREE.MeshLambertMaterial({side:THREE.DoubleSide}),2400);
const LUMP=instSys(new THREE.IcosahedronGeometry(.5,0),new THREE.MeshLambertMaterial({flatShading:true}),600);
const DEC=instSys(new THREE.CircleGeometry(1,10),new THREE.MeshBasicMaterial({transparent:true,opacity:.5,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),320);DEC.m.renderOrder=1;
function decal(p,n,s,col){const i=DEC.i;DEC.i=(i+1)%DEC.N;dum.position.copy(p);dum.quaternion.setFromUnitVectors(ZAX,n);dum.rotateZ(rnd(0,TAU));dum.scale.set(s*rnd(.8,1.2),s*rnd(.8,1.2),1);dum.updateMatrix();DEC.m.setMatrixAt(i,dum.matrix);_col.set(col);DEC.m.setColorAt(i,_col);DEC.m.instanceMatrix.needsUpdate=true;DEC.m.instanceColor.needsUpdate=true;}
function spawnI(sys,o){const i=sys.i;sys.i=(i+1)%sys.N;const old=sys.slots[i];if(old)old.gone=true;o.i=i;sys.slots[i]=o;sys.fly.push(o);_col.set(o.col);sys.m.setColorAt(i,_col);sys.m.instanceColor.needsUpdate=true;}
function updI(sys,dt,flat){const F=sys.fly;let n=0;for(const o of F){if(o.gone)continue;o.vy-=G*(o.fl?.3:1)*dt;if(o.fl){const dr=Math.exp(-2.5*dt);o.vx*=dr;o.vz*=dr;if(o.vy<-9)o.vy=-9;o.vx+=Math.sin(now*6+o.ph)*12*dt;o.vz+=Math.cos(now*5+o.ph)*9*dt;}
  o.x+=o.vx*dt;o.y+=o.vy*dt;o.z+=o.vz*dt;o.rx+=o.wx*dt;o.ry+=o.wy*dt;let rest=false;
  if(o.y<=o.fy&&o.vy<0){if(o.dc){decal(V(o.x,.05,o.z),UP,o.s*1.3,o.dc);sys.m.setMatrixAt(o.i,ZERO);sys.slots[o.i]=null;continue;}o.y=o.fy;rest=true;}
  dum.position.set(o.x,o.y,o.z);if(rest&&flat)dum.rotation.set(-Math.PI/2,0,o.ry);else dum.rotation.set(o.rx,o.ry,0);dum.scale.setScalar(o.s);dum.updateMatrix();sys.m.setMatrixAt(o.i,dum.matrix);if(!rest)F[n++]=o;}
 F.length=n;sys.m.instanceMatrix.needsUpdate=true;}
const PCOL=[0xd61f2c,0xc41a24,0xe3343a,0xb5151f,0xe8c4a0,0xd61f2c];
function bits(p,n,sp,cols,s=1,fl=1){for(let i=0;i<n;i++){_v.set(rnd(-1,1),rnd(-.2,1),rnd(-1,1)).normalize().multiplyScalar(rnd(.2,1)*sp);spawnI(BITS,{x:p.x,y:p.y,z:p.z,vx:_v.x,vy:_v.y+sp*.3,vz:_v.z,rx:rnd(0,TAU),ry:rnd(0,TAU),wx:rnd(-12,12),wy:rnd(-12,12),ph:rnd(0,TAU),col:pk(cols),s:rnd(.7,1.4)*s,fl,fy:rnd(.03,.12)});}}
const paper=(p,n,sp)=>bits(p,n,sp,PCOL);
function lumps(p,n,sp,cols,s,dc){for(let i=0;i<n;i++){_v.set(rnd(-1,1),rnd(-.1,1),rnd(-1,1)).normalize().multiplyScalar(rnd(.25,1)*sp);spawnI(LUMP,{x:p.x+rnd(-.5,.5),y:p.y+rnd(0,.5),z:p.z+rnd(-.5,.5),vx:_v.x,vy:_v.y+sp*.4,vz:_v.z,rx:rnd(0,TAU),ry:rnd(0,TAU),wx:rnd(-15,15),wy:rnd(-15,15),col:pk(cols),s:rnd(.5,1.1)*s,fy:s*.25,dc:dc&&Math.random()<.7?dc:0});}}
const FL=[];for(let i=0;i<3;i++){const l=new THREE.PointLight(0xffc880,0,300,1.5);scene.add(l);FL.push({l,t:0,t0:1,I:0});}
function flash(p,k,dur,col){let f=FL[0];for(const x of FL)if(x.t<f.t)f=x;f.l.position.copy(p);f.l.position.y+=2;f.l.color.set(col||0xffc880);f.I=k*2600;f.t=f.t0=dur;}
