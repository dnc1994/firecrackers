/* ================= 更多能玩的东西 ================= */
const weaveT=ctex(64,64,(g,w,h)=>{g.clearRect(0,0,w,h);g.strokeStyle='#c8a868';g.lineWidth=3;for(let i=-64;i<128;i+=16){g.beginPath();g.moveTo(i,0);g.lineTo(i+64,64);g.stroke();g.beginPath();g.moveTo(i+64,0);g.lineTo(i,64);g.stroke();}g.fillStyle='#b89858';g.fillRect(0,0,w,4);g.fillRect(0,h-5,w,5);});weaveT.wrapS=weaveT.wrapT=THREE.RepeatWrapping;weaveT.repeat.set(6,2);
Object.assign(PD,{
 log:{n:'柴火',r:.9,h:7,m:1.2,snd:'wood',mk(g){mesh(g,CY(.9,.9,7,8),LM(TX('wood',.3,.6)));for(const s of[-1,1])mesh(g,new THREE.CircleGeometry(.9,8),0xd8b888,0,s*3.51,0).rotation.x=-s*Math.PI/2;}},
 pumpkin:{n:'南瓜',sph:1,r:2.1,m:2.5,gourd:1,mk(g){mesh(g,SPH(2.1,12,9),0xd8842a).scale.y=.72;mesh(g,CY(.25,.35,.9,6),0x5a6a30,0,1.6,0);}},
 carton:{n:'纸箱',r:2.3,h:3.2,s:[4.4,3.2,3.6],m:.35,cover:1,snd:'plastic',mk(g){mesh(g,BX(4.4,3.2,3.6),0xb98a52);mesh(g,BX(4.5,.5,.9),0xd8c08c,0,1.4,0);}},
 coal:{n:'蜂窝煤',r:1.1,h:1.3,m:.9,coal:1,mk(g){mesh(g,CY(1.1,1.1,1.3,12),0x16161a);for(let i=0;i<6;i++){const a=i/6*TAU;mesh(g,new THREE.CircleGeometry(.16,6),0x050505,Math.cos(a)*.6,.66,Math.sin(a)*.6).rotation.x=-Math.PI/2;}}},
 tray:{n:'晒辣椒的簸箕',r:3.4,h:.5,m:.5,tray:1,mk(g){mesh(g,CY(3.4,3.1,.5,18),0xb89a58);const pm=M(0xc8201c);for(let i=0;i<44;i++){const a=rnd(0,TAU),r=rnd(0,2.9),p=mesh(g,BX(.9,.16,.22),pm,Math.cos(a)*r,.34,Math.sin(a)*r);p.rotation.y=rnd(0,TAU);p.userData.pep=1;}}},
 bench:{n:'条凳',s:[9,3.4,2.4],m:3,snd:'wood',mk(g){mesh(g,BX(9,.4,2.4),0x7a5a36,0,1.5,0);for(const x of[-3.6,3.6])for(const z of[-.8,.8])mesh(g,BX(.4,3,.4),0x6a4c2e,x,-.2,z);}},
 meat:{n:'腊肉',s:[1.6,4.6,.8],m:.8,mk(g){mesh(g,BX(1.6,4.6,.8),0x7a2a20);mesh(g,BX(1.62,1.2,.82),0xe8d8b0,0,-.8,0);}},
 hat:{n:'草帽',r:2.2,h:.9,m:.15,mk(g){mesh(g,CY(2.2,2.3,.12,14),0xd8b868);mesh(g,CY(.9,1.1,.9,12),0xd0ae5c,0,.45,0);}},
 coop:{n:'鸡笼',r:3.4,rt:2,h:3.6,m:.7,cover:1,snd:'plastic',mk(g){mesh(g,CY(2,3.4,3.6,14,true),new THREE.MeshLambertMaterial({map:weaveT,alphaTest:.4,side:THREE.DoubleSide}));mesh(g,new THREE.TorusGeometry(2,.14,4,14),0xb89858,0,1.8,0).rotation.x=Math.PI/2;}},
});
function burstG(p){const pos=ppos(p);at(pos);S.splat();at(null);lumps(pos,34,24,[0xe8962a,0xf0b040,0xd87820,0xf4d890],1,0xe09030);rmProp(p);found('pumpkin');upset(.8,'南瓜是留着熬粥的！');}
function coalBreak(p){const pos=ppos(p);at(pos);S.thud(.3);at(null);lumps(pos,14,16,[0x101012,0x1c1c20,0x08080a],.7,0x0c0c0e);smoke(pos,3,1.2,[.12,.12,.13]);rmProp(p);found('coal');upset(.4,'煤球不要钱啊？！');}
function spill(q){q.spilled=1;const pos=ppos(q);q.g.traverse(m=>{if(m.userData.pep)m.visible=false;});bits(pos,70,26,[0xc8201c,0xd83024,0xa81814],.9,0);found('tray');upset(1.5,'我晒了三天的辣椒！！');}
/* 柴堆、南瓜、纸箱、煤球、簸箕 */
{const q=new CANNON.Quaternion();q.setFromEuler(Math.PI/2,0,0);for(const zc of[16,25])for(let l=0;l<3;l++)for(let i=0;i<4-l;i++){const p=mkProp('log',-108.4+i*1.86+l*.93,.92+l*1.6,zc,true);p.body.quaternion.copy(q);p.g.quaternion.copy(q);}
 [[44,-92],[49,-89],[45.5,-86]].forEach(a=>mkProp('pumpkin',a[0],1.55,a[1],true));mkProp('carton',-44,1.6,-88,true);mkProp('carton',302,1.6,106,true);mkProp('carton',-150,1.6,70,true);
 for(let k=0;k<3;k++)for(let i=0;i<2;i++)for(let j=0;j<2;j++)mkProp('coal',-66+i*2.3,.65+k*1.3,-93+j*2.3,true);
 mkProp('bench',-36,1.7,-66,true);mkProp('tray',-36,3.66,-66,true);mkProp('bench',300,1.7,196,true);}
/* 屋檐下的年货：腊肉、腊肠、玉米辣椒串 */
const MEATS=[];
{add(CY(.35,.35,52,5),0x8a9a58,-58,27,-94.5,{rz:Math.PI/2,cast:false});
 for(let i=0;i<5;i++){const x=-78+i*7.5,g=new THREE.Group();g.position.set(x,24.3,-94.5);scene.add(g);mesh(g,BX(1.6,4.6,.8),0x7a2a20);mesh(g,BX(1.62,1.2,.82),0xe8d8b0,0,-.8,0);mesh(g,CY(.05,.05,1,3),0x221a14,0,2.7,0);MEATS.push({g,p:V(x,24.3,-94.5),ph:rnd(0,TAU)});}
 for(let i=0;i<6;i++){const x=-40+i*1.4;add(CY(.28,.28,5,6),0x8a2018,x,24,-94.5,{cast:false,rz:rnd(-.05,.05)});}
 for(const[x,c1,c2]of[[14,0xe8b830,0xd8a020],[19,0xc8201c,0xa81814]])for(let k=0;k<7;k++)add(SPH(.7,6,5),k%2?c1:c2,x+rnd(-.5,.5),26-k*1.3,-98.6,{cast:false}).scale.y=1.4;}
let DOGT=null;
reactors.push((pos,p)=>{for(const m of MEATS.slice()){if(m.p.distanceTo(pos)>11+p*2)continue;MEATS.splice(MEATS.indexOf(m),1);scene.remove(m.g);const q=mkProp('meat',m.p.x,m.p.y,m.p.z+1);q.body.velocity.set(rnd(-8,8),6,rnd(8,20));q.body.angularVelocity.set(rnd(-5,5),rnd(-5,5),rnd(-5,5));
  if(!DOGT&&(DOG.st==='idle'||DOG.st==='flee'||DOG.st==='hide')){DOGT=q;DOG.st='fetch';DOG.g.visible=true;DOG.wait=1.1;}upset(2,'我的腊肉！！那是腌了一个月的！！');}
 for(const m of MEATS)if(m.p.distanceTo(pos)<60)m.sw=Math.min(1,(m.sw||0)+p*.5);});
function dogExtra(dt){const d=DOG;for(const m of MEATS){m.sw=(m.sw||0)*Math.exp(-1.4*dt);m.g.rotation.z=Math.sin(now*7+m.ph)*m.sw*.5;}
 const run=(tx,tz,sp)=>{const dx=tx-d.x,dz=tz-d.z,l=Math.hypot(dx,dz);if(l<2.5)return true;d.x+=dx/l*sp*dt;d.z+=dz/l*sp*dt;d.yaw=Math.atan2(dx,dz);return false;};
 if(d.st==='fetch'){if((d.wait-=dt)>0)return;if(!DOGT||DOGT.dead){d.st='idle';DOGT=null;return;}const b=DOGT.body.position;if(run(b.x,b.z,62)){rmProp(DOGT);d.mouth=bx(d.g,1.2,.9,4,0x7a2a20,0,5,6.6);at(V(d.x,4,d.z));S.bark(1);at(null);d.st='steal';d.leg=0;found('meat');cz('meat');}}
 else if(d.st==='steal'){const wp=[[0,80],[0,112],[-34,158],[-60,172]];if(run(wp[d.leg][0],wp[d.leg][1],58)&&++d.leg>=wp.length){d.st='eat';d.yaw=1;}}}
/* 火盆 */
const BRZ={x:30,z:-82};
{sCyl(BRZ.x,1.3,BRZ.z,2.6,2.6,'火盆',0x2a2422,{t:{slot:{kind:'brazier',verb:'丢进火盆',pos:V(BRZ.x,2.8,BRZ.z)}}});const em=new THREE.MeshBasicMaterial();em.color.setRGB(2.4,.7,.15);add(CY(2.2,2.2,.3,14),em,BRZ.x,2.7,BRZ.z,{cast:false});halo(BRZ.x,4,BRZ.z,22,0xff5a1a,.5);}
SLOT.brazier=(s,pos,p)=>{boom(pos,p,{quiet:1});for(let i=0;i<70;i++){_v.set(rnd(-1,1),rnd(.2,1.4),rnd(-1,1)).normalize().multiplyScalar(rnd(15,60));addP(SPK,{x:pos.x,y:pos.y,z:pos.z,vx:_v.x,vy:_v.y,vz:_v.z,life:rnd(.5,1.5),g:60,drag:.8,s:rnd(.3,.7),sg:0,c:pk([[1,.5,.12],[1,.75,.25],[.9,.3,.08]]),a:1});}smoke(pos,8,1.6,[.3,.28,.28]);found('brazier');gpReact(1);upset(1.5,'火盆也敢炸？！烧着房子怎么办！');};
/* 二叔的摩托（带报警器） */
const MOTO={x:60,z:66,alarm:0,blink:[]};
{const g=new THREE.Group();g.position.set(MOTO.x,0,MOTO.z);g.rotation.set(0,.5,.12);scene.add(g);const red=new THREE.MeshStandardMaterial({color:0xb81c22,metalness:.5,roughness:.35}),blk=M(0x16161a),chr=new THREE.MeshStandardMaterial({color:0xc8ccd0,metalness:.9,roughness:.25});
 for(const z of[-6,6]){const w=mesh(g,new THREE.TorusGeometry(2.5,.75,8,16),blk,0,3.2,z);w.rotation.y=Math.PI/2;mesh(g,CY(1.6,1.6,.5,10),chr,0,3.2,z).rotation.z=Math.PI/2;}
 mesh(g,BX(2.2,2.6,7),red,0,6.4,-.5);mesh(g,BX(2,1,6),blk,0,8.3,-2);mesh(g,SPH(1.5,10,8),red,0,7.6,2.6).scale.set(.9,.8,1.5);mesh(g,BX(1.6,3,3.6),chr,0,4.4,0);mesh(g,CY(.3,.3,7,6),chr,0,7.6,5.2).rotation.x=-.45;mesh(g,CY(.22,.22,6.4,6),chr,0,10.4,4.2).rotation.z=Math.PI/2;
 mesh(g,SPH(.9,8,6),0xe8e8d8,0,9,5.4);mesh(g,CY(.4,.5,6,6),chr,1.3,3.6,-3).rotation.x=Math.PI/2;
 for(const x of[-1.3,1.3]){const m=new THREE.MeshBasicMaterial({color:0x3a2a10});MOTO.blink.push(mesh(g,SPH(.4,6,5),m,x,8,-5.6));MOTO.blink.push(mesh(g,SPH(.4,6,5),m,x,9.4,4.8));}
 g.traverse(m=>{if(m.isMesh){m.castShadow=true;m.userData.t={name:'二叔的摩托'};picks.push(m);}});circs.push([MOTO.x,MOTO.z,4]);const b=new CANNON.Body({type:CANNON.Body.STATIC,shape:new CANNON.Box(new CANNON.Vec3(2,5,7))});b.position.set(MOTO.x,5,MOTO.z);b.quaternion.setFromEuler(0,.5,0);b.updateAABB();world.addBody(b);}
reactors.push((pos,p)=>{if(p<.5||MOTO.alarm>0||Math.hypot(pos.x-MOTO.x,pos.z-MOTO.z)>44)return;MOTO.alarm=6.4;at(V(MOTO.x,8,MOTO.z));for(let i=0;i<16;i++){osc(i*.4,'square',1400,1400,.18,.07,.2);osc(i*.4+.2,'square',1050,1050,.18,.07,.2);}at(null);found('moto');yell('二叔：谁动我摩托？！');});
/* 稻草人 */
const SCR={x:40,z:238,hat:null};
{add(CY(.4,.4,17,5),0x6e5a3c,SCR.x,8.5,SCR.z);add(CY(.3,.3,13,5),0x6e5a3c,SCR.x,12,SCR.z,{rz:Math.PI/2});add(CY(2.2,1.6,6,8),LM(strawT),SCR.x,10.5,SCR.z);add(SPH(1.7,10,8),0xe0c890,SCR.x,15.2,SCR.z,{name:'稻草人'});
 add(BX(4,5,.6),0x3a5a8a,SCR.x,11,SCR.z+1.5,{cast:false});circs.push([SCR.x,SCR.z,1.5]);SCR.hat=mkProp('hat',SCR.x,17.1,SCR.z,true);}
reactors.push((pos,p)=>{const h=SCR.hat;if(!h||h.dead||h.off)return;if(Math.hypot(pos.x-SCR.x,pos.z-SCR.z)<16+p*2){h.off=1;h.body.wakeUp();h.body.velocity.set(rnd(-10,10),rnd(30,50),rnd(-10,10));h.body.angularVelocity.set(rnd(-6,6),rnd(-8,8),rnd(-6,6));found('scare');}});
/* 鸡笼里关着的那只 */
const COOP={p:null,hen:null};
{COOP.p=mkProp('coop',-58,1.8,66,true);mkChicken(-58,66);COOP.hen=chickens[chickens.length-1];COOP.hen.caged=true;}
function freeHen(blast){const c=COOP.hen;if(!c||!c.caged)return;c.caged=false;c.panic=3;c.home=[-20,40];if(blast){c.y=.05;c.vy=rnd(30,50);c.vx=rnd(-20,20);c.vz=rnd(-20,20);bits(V(c.x,2,c.z),10,9,[0xffffff,0xf0e8d8],.8,1);at(V(c.x,2,c.z));S.cluck(1);at(null);found('coop');}}
/* 鸭子 */
const ducks=[];
for(let i=0;i<4;i++){const g=new THREE.Group(),c=i%2?0xf2f0e8:0x8a6a48;scene.add(g);mesh(g,SPH(1,9,7),c,0,.7,0).scale.set(1.2,.8,1.9);mesh(g,SPH(.62,8,6),i%2?c:0x2a5a3a,0,1.9,1.5);mesh(g,BX(.5,.22,.9),0xe8a020,0,1.8,2.3);mesh(g,new THREE.ConeGeometry(.5,1,5),c,0,1.2,-1.9).rotation.x=-2;ducks.push({g,a:rnd(0,TAU),r:rnd(14,34),s:rnd(.12,.22)*pk([-1,1]),x:PX,z:PZ,flee:0,tx:0,tz:0});}
function quack(n){for(let i=0;i<n;i++){osc(i*.16,'sawtooth',rnd(520,600),rnd(330,380),.1,.08,.2);osc(i*.16,'square',rnd(1040,1200),700,.08,.03,.2);}}
function scareDucks(pos){let any=false;for(const d of ducks){if(d.flee>0)continue;const a=Math.atan2(d.z-pos.z,d.x-pos.x)+rnd(-.5,.5);d.flee=rnd(1.6,2.4);let tx=d.x+Math.cos(a)*60,tz=d.z+Math.sin(a)*60;const l=Math.hypot(tx-PX,tz-PZ);if(l>PR-8){tx=PX+(tx-PX)/l*(PR-8);tz=PZ+(tz-PZ)/l*(PR-8);}d.tx=tx;d.tz=tz;any=true;}if(any){at(V(PX,1,PZ));quack(5);at(null);found('duck');}}
reactors.push((pos,p)=>{if(Math.hypot(pos.x-PX,pos.z-PZ)<PR+70)scareDucks(pos);});
function updDucks(dt){for(const d of ducks){if(d.flee>0){d.flee-=dt;const dx=d.tx-d.x,dz=d.tz-d.z,l=Math.hypot(dx,dz);if(l>1){d.x+=dx/l*44*dt;d.z+=dz/l*44*dt;d.g.rotation.y=Math.atan2(dx,dz);if(Math.random()<.6)spray(V(d.x,.5,d.z),1,9);}d.g.position.set(d.x,.35+Math.abs(Math.sin(now*22))*.9,d.z);d.g.rotation.z=Math.sin(now*30)*.3;if(d.flee<=0){d.a=Math.atan2(d.z-PZ,d.x-PX);d.r=Math.hypot(d.x-PX,d.z-PZ);}}
  else{d.a+=d.s*dt;d.x=PX+Math.cos(d.a)*d.r;d.z=PZ+Math.sin(d.a)*d.r;d.g.position.set(d.x,.35+Math.sin(now*2+d.r)*.06,d.z);d.g.rotation.set(0,-d.a+(d.s>0?0:Math.PI),0);}}}
function updThings(dt){dogExtra(dt);updDucks(dt);
 if(MOTO.alarm>0){MOTO.alarm-=dt;const on=MOTO.alarm>0&&Math.floor(MOTO.alarm*5)%2===0;for(const m of MOTO.blink)m.material.color.setRGB(on?3:.22,on?1.6:.16,on?.2:.06);}
 const c=COOP.hen;if(c&&c.caged){const b=COOP.p.body.position;if(COOP.p.dead||Math.hypot(b.x-c.x,b.z-c.z)>2.4||b.y>3.4)freeHen(false);}
 if(Math.random()<dt*14)addP(SPK,{x:BRZ.x+rnd(-1.6,1.6),y:3,z:BRZ.z+rnd(-1.6,1.6),vx:rnd(-1,1),vy:rnd(4,10),vz:rnd(-1,1),life:rnd(.3,.8),g:-6,drag:1,s:rnd(.5,1.1),sg:-.6,c:pk([[1,.42,.08],[1,.62,.16]]),a:.7});
 for(const k of crs)if(k.st!=='act'&&!k.lit&&!k.dud&&k.d.fuse&&!k.water&&(k.pos.x-BRZ.x)**2+(k.pos.z-BRZ.z)**2<9&&k.pos.y<6){k.lit=true;k.t0=k.d.fuse;k.t=rnd(.3,.6);k.slot=k.slot||{kind:'brazier'};}}
