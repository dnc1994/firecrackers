/* ================= 鸡、狗、牛 ================= */
const bx=(g,w,h,d,c,x,y,z)=>mesh(g,BX(w,h,d),c,x,y,z);
const chickens=[];
function mkChicken(x,z){const g=new THREE.Group(),c=pk([0xf2ead8,0xb5651d,0x7a4a26,0xe8d8b0]);scene.add(g);
 mesh(g,SPH(1,9,7),c,0,1.9,0).scale.set(1.1,1.05,1.6);const hd=mesh(g,SPH(.6,8,6),c,0,3.3,1.3);mesh(g,new THREE.ConeGeometry(.2,.6,5),0xe8a020,0,3.25,2).rotation.x=Math.PI/2;bx(g,.15,.45,.6,0xd0202a,0,3.95,1.3);
 mesh(g,new THREE.ConeGeometry(.7,1.5,5),c,0,2.6,-1.7).rotation.x=-2.3;bx(g,.12,.9,.12,0xe8a020,-.4,.45,0);bx(g,.12,.9,.12,0xe8a020,.4,.45,0);
 const w1=mesh(g,SPH(1,6,5),c,-1.1,2,0),w2=mesh(g,SPH(1,6,5),c,1.1,2,0);w1.scale.set(.15,.7,1.1);w2.scale.set(.15,.7,1.1);g.traverse(m=>{if(m.isMesh)m.castShadow=true;});
 chickens.push({g,x,y:0,z,vx:0,vy:0,vz:0,hx:rnd(0,TAU),yaw:0,panic:0,t:rnd(0,3),walk:0,home:[x,z],w:[w1,w2],hd});}
[[-20,40],[-5,52],[-34,30],[20,48],[-48,60],[40,20]].forEach(a=>mkChicken(a[0],a[1]));
function updChickens(dt,px,pz){for(const c of chickens){if(c.caged){c.g.position.set(c.x,0,c.z);c.g.rotation.y+=dt*.3;continue;}const air=c.y>.01||c.vy>0;
  if(air){c.vy-=G*(c.vy<0?.35:1)*dt;c.y+=c.vy*dt;c.x+=c.vx*dt;c.z+=c.vz*dt;if(c.y<=0){c.y=0;c.vy=0;c.vx=c.vz=0;}}
  else{const dp=Math.hypot(c.x-px,c.z-pz);if(dp<13&&c.panic<=0){c.panic=.9;c.hx=Math.atan2(c.x-px,c.z-pz)+rnd(-.5,.5);if(Math.random()<.3){at(V(c.x,2,c.z));S.cluck(.4);at(null);}}
   let sp=0;if(c.panic>0){c.panic-=dt;sp=42;if(Math.random()<dt*2)c.vy=rnd(14,24),c.y=.02;}else{c.t-=dt;if(c.t<=0){c.t=rnd(1.5,4.5);c.walk=rnd(.5,1.6);c.hx=Math.hypot(c.x-c.home[0],c.z-c.home[1])>55?Math.atan2(c.home[0]-c.x,c.home[1]-c.z)+rnd(-.5,.5):rnd(0,TAU);}if(c.walk>0){c.walk-=dt;sp=7;}}
   if(sp){const nx=c.x+Math.sin(c.hx)*sp*dt,nz=c.z+Math.cos(c.hx)*sp*dt;if(blocked(nx,nz,1.5))c.hx+=Math.PI*rnd(.6,1.4);else{c.x=nx;c.z=nz;}}}
  let d=c.hx-c.yaw;d=Math.atan2(Math.sin(d),Math.cos(d));c.yaw+=d*Math.min(1,dt*9);c.g.position.set(c.x,c.y,c.z);c.g.rotation.y=c.yaw;if(air)c.g.rotation.x=Math.sin(now*14)*.5;else c.g.rotation.x=0;
  const fl=air||c.panic>0,a=fl?Math.sin(now*40)*.9:0;c.w[0].rotation.z=a;c.w[1].rotation.z=-a;c.hd.position.y=(!fl&&c.walk<=0&&Math.sin(now*1.3+c.home[0])>.5)?3.3-Math.abs(Math.sin(now*9))*1.6:3.3;}}
const DOG={g:new THREE.Group(),x:84,z:30,home:[90,40],hide:0,st:'idle',t:0,yaw:Math.PI,tail:null};
{const g=DOG.g,c=0xc89a50;scene.add(g);bx(g,2.6,2.6,6,c,0,3.6,0);bx(g,2.4,2.4,2.6,c,0,5.4,3.6);bx(g,1.3,1.1,1.4,0xa87a38,0,4.9,5.3);bx(g,.6,1.2,.4,0x7a5020,-.9,6.9,3.4);bx(g,.6,1.2,.4,0x7a5020,.9,6.9,3.4);
 for(const[x,z]of[[-.9,-2.2],[.9,-2.2],[-.9,2.2],[.9,2.2]])bx(g,.7,2.4,.7,c,x,1.2,z);DOG.tail=bx(g,.5,.5,2.6,c,0,5,-4);g.traverse(m=>{if(m.isMesh)m.castShadow=true;});}
const COW={g:new THREE.Group(),x:196,z:322,yaw:-1.2,run:0,hx:0,cd:0};
{const g=COW.g,c=0x6a4a30;scene.add(g);bx(g,7,7,14,c,0,10,0);bx(g,4.4,4.6,5,c,0,12.5,9);bx(g,3,2.6,2.4,0x8a6a50,0,11.4,12.2);bx(g,7.4,.6,.6,0xd8d0c0,0,15,8.6);for(const[x,z]of[[-2.4,-5],[2.4,-5],[-2.4,5],[2.4,5]])bx(g,1.5,7,1.5,c,x,3.5,z);bx(g,.5,6,.5,c,0,10,-7.4).rotation.x=.3;g.traverse(m=>{if(m.isMesh){m.castShadow=true;m.userData.t={name:'牛'};picks.push(m);}});}
function updDogCow(dt){const d=DOG;
 if(d.st==='flee'){const dx=d.home[0]-d.x,dz=d.home[1]-d.z,l=Math.hypot(dx,dz);if(l<2){d.st='hide';d.hide=rnd(6,9);d.g.visible=false;}else{d.x+=dx/l*70*dt;d.z+=dz/l*70*dt;d.yaw=Math.atan2(dx,dz);}}
 else if(d.st==='hide'){d.hide-=dt;if(d.hide<=0){d.st='idle';d.g.visible=true;d.x=84;d.z=30;d.yaw=Math.PI;}}
 d.g.position.set(d.x,d.st==='flee'?Math.abs(Math.sin(now*18))*1.5:0,d.z);d.g.rotation.y=d.yaw;d.tail.rotation.y=Math.sin(now*(d.st==='idle'?9:25))*.6;
 const c=COW;if(c.cd>0)c.cd-=dt;if(c.run>0){c.run-=dt;let nx=c.x+Math.sin(c.hx)*26*dt,nz=c.z+Math.cos(c.hx)*26*dt;if(nx<150||nx>330||nz<270||nz>410){c.hx+=Math.PI*.7;}else{c.x=nx;c.z=nz;}let dd=c.hx-c.yaw;dd=Math.atan2(Math.sin(dd),Math.cos(dd));c.yaw+=dd*Math.min(1,dt*5);}
 c.g.position.set(c.x,c.run>0?Math.abs(Math.sin(now*12))*1.2:0,c.z);c.g.rotation.y=c.yaw;}
function scare(pos,p){
 for(const c of chickens){if(c.caged)continue;const d=Math.hypot(c.x-pos.x,c.z-pos.z);if(d>110+40*p)continue;c.panic=rnd(2,4);c.hx=Math.atan2(c.x-pos.x,c.z-pos.z)+rnd(-.5,.5);
  if(d<9+6*p&&c.y<1){const f=1-d/(9+6*p);c.y=.05;c.vy=rnd(45,75)*(.5+f*.5)*Math.min(1.5,.6+p*.4);c.vx=Math.sin(c.hx)*30;c.vz=Math.cos(c.hx)*30;const cp=V(c.x,2,c.z);bits(cp,10,9,[0xffffff,0xf0e8d8,0xe8d8b0],.8,1);at(cp);S.cluck(1);at(null);found('chicken');upset(1,pk(['别炸我的鸡！！','鸡招你惹你了？！','鸡飞了你去抓！']));}
  else if(Math.random()<.4){at(V(c.x,2,c.z));S.cluck(.5);at(null);}}
 const dd=Math.hypot(DOG.x-pos.x,DOG.z-pos.z);if(DOG.st==='idle'&&dd<230){at(V(DOG.x,4,DOG.z));if(dd<85+25*p){S.yelp();DOG.st='flee';found('dog');}else S.bark(rnd(2,4)|0);at(null);}
 const dc=Math.hypot(COW.x-pos.x,COW.z-pos.z);if(dc<260&&COW.cd<=0){COW.cd=2.5;at(V(COW.x,10,COW.z));S.moo();at(null);if(dc<95+25*p){COW.run=rnd(2,3);COW.hx=Math.atan2(COW.x-pos.x,COW.z-pos.z)+rnd(-.4,.4);const bx0=COW.x-Math.sin(COW.yaw)*9,bz0=COW.z-Math.cos(COW.yaw)*9;mkDung(bx0,bz0);lumps(V(bx0,7,bz0),8,6,[0x4a3119,0x5b3e22],.6);found('cow');}}}
