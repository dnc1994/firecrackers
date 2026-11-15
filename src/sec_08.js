/* ================= 炮 ================= */
const CD={
 xb:{n:'小鞭',fuse:2.6,p:1,r:.2,len:1.3,col:0xd22a2e,tip:'最普通的一响'},
 cp:{n:'擦炮',fuse:3,p:1.3,r:.2,len:1.4,col:0xd22a2e,wp:1,tip:'防水，丢水里也响'},
 sp:{n:'摔炮',snap:1,p:.5,tip:'不用点，摔哪儿哪儿响'},
 ddh:{n:'大地红',fuse:1.5,p:.45,string:26,tip:'一整挂，噼里啪啦'},
 cth:{n:'窜天猴',fuse:1.3,p:.9,r:.18,len:1.3,col:0xe0403a,rocket:1,tip:'朝哪儿指往哪儿飞'},
 etj:{n:'二踢脚',fuse:2.2,p:2.1,r:.32,len:2.2,col:0x9b2a1e,two:1,tip:'地上一响，天上一响'},
 dls:{n:'地老鼠',fuse:1.2,p:.6,spin:1,tip:'满地乱窜'},
 xmf:{n:'小蜜蜂',fuse:1.2,p:.5,bee:1,tip:'转着圈往天上飞'},
 ph:{n:'喷花',fuse:1.4,p:.3,fount:1,tip:'不响，喷一树火花'},
 mst:{n:'魔术弹',fuse:.9,p:.35,candle:1,r:.24,len:4.4,col:0x2a6ab8,tip:'拿在手里，一颗一颗打出去'},
 xnb:{n:'仙女棒',fuse:9,p:0,sparkler:1,tip:'不响，能当火用'},
 lw:{n:'雷王',fuse:3.6,p:3.2,r:.5,len:1.2,col:0xc81e28,tip:'最响。离远点'},
};
const FUSEG=CY(.045,.045,1,4);FUSEG.translate(0,.5,0);
function crMesh(k){const d=CD[k],g=new THREE.Group();let top=0;
 if(k==='sp'){mesh(g,SPH(.34,8,6),0xf3e8ea);mesh(g,new THREE.ConeGeometry(.15,.42,6),0xe58aa0,0,.42,0);}
 else if(k==='dls'){mesh(g,CY(.55,.55,.32,12),0xd8b8b0);mesh(g,new THREE.TorusGeometry(.3,.06,4,12),0xa8463e,0,.17,0).rotation.x=Math.PI/2;top=.16;}
 else if(k==='ddh'){for(let i=0;i<12;i++){const m=mesh(g,CY(.12,.12,.75,6),i%2?0xd42a2e:0xb8161f,i%2?.24:-.24,(i-5.5)*.42,0);m.rotation.z=i%2?-.9:.9;}top=2.6;}
 else if(k==='xmf'){mesh(g,CY(.5,.5,.3,10),0xe8c030);for(const s of[-1,1])mesh(g,BX(1.1,.05,.5),0xd83a2a,s*.9,.1,0).rotation.x=s*.4;top=.15;}
 else if(k==='ph'){mesh(g,new THREE.CylinderGeometry(.22,.95,1.7,10),0xe0a020);mesh(g,CY(.96,.96,.25,10),0xc8282e,0,-.72,0);mesh(g,CY(.52,.74,.22,10),0x3a8a4a,0,.1,0);top=.85;}
 else if(k==='xnb'){mesh(g,CY(.035,.035,4.4,4),0x8a8a8a);mesh(g,CY(.09,.09,2.6,5),0x4a4a4e,0,.9,0);top=2.2;}
 else{const r=d.r,h=d.len;mesh(g,CY(r,r,h,10),d.col);if(k==='mst')for(let i=0;i<5;i++)mesh(g,CY(r*1.04,r*1.04,.36,10),[0xe8c030,0xd83a2a,0x3aa860,0xffffff,0xe8c030][i],0,-1.8+i*.9,0);if(k==='etj')for(const y of[-.7,.7])mesh(g,CY(r*1.04,r*1.04,.3,10),0xe8c048,0,y,0);mesh(g,CY(r*1.02,r*1.02,.12,10),0xe0c48c,0,h/2-.06,0);
  if(k==='cp')mesh(g,CY(r*1.03,r*1.03,.3,10),0xf4f0e2);if(k==='lw'){mesh(g,CY(r*1.03,r*1.03,.2,10),0xe8b84a,0,.3,0);mesh(g,CY(r*1.03,r*1.03,.2,10),0xe8b84a,0,-.3,0);}
  if(k==='cth'){mesh(g,new THREE.ConeGeometry(r,.4,8),d.col,0,h/2+.2,0);mesh(g,CY(.04,.04,3,4),0xc9a86a,r+.04,-1.4,0);}top=h/2;}
 if(d.fuse&&!d.sparkler){const f=new THREE.Mesh(FUSEG,M(0xb0aa80));f.position.y=top;f.scale.y=.75;g.add(f);g.userData.fuse=f;}g.userData.top=top;return g;}
const crs=[];
function mkCr(k,pos,o={}){const d=CD[k],m=crMesh(k);scene.add(m);m.traverse(x=>{if(x.isMesh)x.castShadow=true;});const c={k,d,m,pos:pos.clone(),vel:V(),dir:(o.dir||UP).clone(),st:o.st||'placed',lit:!!o.lit,t:o.t||0,t0:d.fuse||1,par:null,slot:null,water:null,dud:false,dead:false,spin:V(rnd(-9,9),0,rnd(-9,9)),act:null};crs.push(c);return c;}
function kill(c){if(c.dead)return;c.dead=true;scene.remove(c.m);}
function tipOf(c){const f=c.lit?clp(c.t/c.t0,0,1):1,top=c.m.userData.top;return _v2.set(0,c.d.sparkler?-.5+(top+.5)*f:top+.75*f,0).applyQuaternion(c.m.quaternion).add(c.pos).clone();}
function lightCr(c){if(c.lit||c.dud||c.dead||!c.d.fuse||c.act)return false;if(c.water&&!c.d.wp){at(c.pos);S.fizzle();at(null);return false;}c.lit=true;c.t=c.t0=c.d.fuse*rnd(.92,1.1);at(c.pos);S.tss();at(null);if(c.slot&&c.slot.kind==='hay')igniteHay();return true;}
function enterWater(c,w){c.water=w;c.st='placed';c.par=null;c.vel.set(0,0,0);const sp=V(c.pos.x,w==='pond'?.4:VAT.wl+.3,c.pos.z);spray(sp,8,22);ripple(sp,w);at(sp);S.splash(.18);at(null);
 if(c.lit&&!c.d.wp){c.lit=false;c.dud=true;at(sp);S.fizzle();at(null);toast('呲——哑了');found('dud');cz('dud');}}
function trigger(c){const d=c.d;
 if(d.two){const up=c.st==='fly'||c.dir.y<.4?V(rnd(-.3,.3),1,rnd(-.3,.3)).normalize():c.dir.clone();boom(c.pos.clone(),.8,{nopaper:1,quiet:1,cr:c});c.par=null;c.slot=null;c.st='act';c.act={type:'etj',t:rnd(.85,1.05)};c.vel.copy(up).multiplyScalar(125);return;}
 if(d.fount){c.st='act';c.act={type:'fount',t:7.5,q:0};if(!c.par)c.dir.copy(UP);c.pos.y=Math.max(c.pos.y,.85);found('fount');return;}
 if(d.bee){c.par=null;c.slot=null;c.st='act';c.act={type:'bee',t:2.8,a:rnd(0,TAU)};c.vel.set(0,10,0);at(c.pos);S.whistle(1.2);at(null);return;}
 if(d.candle){c.st='act';c.act={type:'mst',n:8,cd:.3,t:99};if(c.dir.y<.3)c.dir.set(c.dir.x,.6,c.dir.z).normalize();return;}
 if(d.rocket){const inB=c.slot&&c.slot.kind==='bottle';if(c.st==='fly'&&c.vel.length()>8)c.dir.copy(c.vel).normalize();c.par=null;c.slot=null;c.st='act';c.act={type:'rocket',t:.95};c.vel.copy(c.dir).multiplyScalar(30);at(c.pos);S.whistle(.95);at(null);if(inB)found('rb');return;}
 if(d.spin){c.par=null;c.slot=null;c.st='act';c.act={type:'spin',t:2.5,a:rnd(0,TAU),sc:0};c.pos.y=Math.max(.3,c.pos.y);return;}
 if(d.string){c.par=null;c.st='act';c.act={type:'str',n:d.string,cd:0};return;}
 goBoom(c);}
function settle(c,hit){c.st='placed';c.vel.set(0,0,0);if(!c.d.snap&&c.k!=='dls')c.dir.set(rnd(-1,1),.05,rnd(-1,1)).normalize();else c.dir.copy(UP);c.pos.y=hit.pt.y+.3;const q=hit.body.p;if(q&&!q.dead){const l=new CANNON.Vec3();q.body.pointToLocalFrame(cv3(c.pos),l);c.par={p:q,l,d:q.body.vectorToLocalFrame(cv3(c.dir))};}}
function flyStep(c,dt){c.vel.y-=G*dt;_v.copy(c.pos).addScaledVector(c.vel,dt);const hit=castRay(c.pos,_v);
 if(hit){const n=hit.n,vn=c.vel.dot(n);c.pos.copy(hit.pt).addScaledVector(n,.3);
  if(c.d.snap&&-vn>20){goBoom(c);return;}
  if(hit.body===groundB&&inPond(c.pos)){enterWater(c,'pond');return;}if(hit.body===VAT.body&&n.y>.5&&VAT.wl>0&&inVatR(c.pos)){enterWater(c,'vat');return;}
  c.vel.addScaledVector(n,-1.35*vn).multiplyScalar(.55);const q=hit.body.p;if(q&&-vn>12){hit.body.wakeUp();hit.body.velocity.x-=n.x*1.5;hit.body.velocity.z-=n.z*1.5;}
  if(-vn>14){at(c.pos);S.tick();at(null);}if(c.vel.length()<10&&n.y>.5)settle(c,hit);}
 else c.pos.copy(_v);
 c.m.rotateX(c.spin.x*dt);c.m.rotateZ(c.spin.z*dt);if(c.pos.y<-30)kill(c);}
function actStep(c,dt){const a=c.act;a.t-=dt;
 if(a.type==='rocket'){c.dir.x+=rnd(-1,1)*1.4*dt;c.dir.y+=rnd(-1,1)*1.4*dt;c.dir.z+=rnd(-1,1)*1.4*dt;c.dir.normalize();c.vel.addScaledVector(c.dir,560*dt).multiplyScalar(1-1.3*dt);c.vel.y-=28*dt;
  _v.copy(c.pos).addScaledVector(c.vel,dt);const hit=castRay(c.pos,_v);if(hit){c.pos.copy(hit.pt).addScaledVector(hit.n,.4);if(Math.hypot(c.pos.x-HAY.x,c.pos.z-HAY.z)<20)igniteHay();goBoom(c);return;}c.pos.copy(_v);
  for(let i=0;i<3;i++)addP(SPK,{x:c.pos.x,y:c.pos.y,z:c.pos.z,vx:-c.dir.x*rnd(10,30)+rnd(-4,4),vy:-c.dir.y*rnd(10,30)+rnd(-4,4),vz:-c.dir.z*rnd(10,30)+rnd(-4,4),life:rnd(.15,.4),g:20,drag:2,s:rnd(.3,.55),sg:0,c:pk(SPC),a:1});if(Math.random()<.5)smoke(c.pos,1,.5);
  if(a.t<=0)goBoom(c);}
 else if(a.type==='spin'){a.a+=rnd(-7,7)*dt;_v.set(c.pos.x+Math.cos(a.a)*42*dt,c.pos.y,c.pos.z+Math.sin(a.a)*42*dt);const hit=castRay(c.pos,_v);if(hit||blocked(_v.x,_v.z,.4))a.a+=Math.PI*rnd(.7,1.3);else c.pos.copy(_v);c.pos.y=Math.max(.3,c.pos.y-30*dt);
  c.m.rotateY(40*dt);for(let i=0;i<3;i++){const an=now*30+i*2.1;addP(SPK,{x:c.pos.x+Math.cos(an)*.5,y:c.pos.y+.1,z:c.pos.z+Math.sin(an)*.5,vx:-Math.sin(an)*18,vy:rnd(0,6),vz:Math.cos(an)*18,life:rnd(.12,.3),g:30,drag:2,s:.35,sg:0,c:pk([[1,.85,.4],[.5,.8,1],[1,.65,.2]]),a:1});}
  a.sc-=dt;if(a.sc<=0){a.sc=.35;for(const k of chickens)if(Math.hypot(k.x-c.pos.x,k.z-c.pos.z)<28&&k.panic<=.3){k.panic=1.5;k.hx=Math.atan2(k.x-c.pos.x,k.z-c.pos.z);}}
  if(a.t<=0)goBoom(c);}
 else if(a.type==='etj'){c.vel.y-=G*.6*dt;_v.copy(c.pos).addScaledVector(c.vel,dt);const hit=castRay(c.pos,_v);if(hit){c.pos.copy(hit.pt).addScaledVector(hit.n,.3);c.vel.addScaledVector(hit.n,-1.4*c.vel.dot(hit.n)).multiplyScalar(.5);}else c.pos.copy(_v);c.dir.set(Math.sin(now*20),Math.cos(now*20),.3).normalize();sparks(c.pos,1,6);if(Math.random()<.5)smoke(c.pos,1,.5);
  if(a.t<=0){const hi=c.pos.y>30,pos=c.pos.clone(),p=c.d.p;kill(c);boom(pos,p);if(hi)found('etj');}}
 else if(a.type==='fount'){const k=Math.min(1,(7.5-a.t)*2)*Math.min(1,a.t*1.5);_col.setHSL((now*.25)%1,.9,.6);const tp=_v2.copy(c.pos).addScaledVector(c.dir,.9);
  for(let i=0;i<9;i++)if(Math.random()<k)addP(SPK,{x:tp.x,y:tp.y,z:tp.z,vx:c.dir.x*40+rnd(-10,10),vy:c.dir.y*rnd(45,100)*k+rnd(-4,4),vz:c.dir.z*40+rnd(-10,10),life:rnd(.5,1.2),g:G*.8,drag:.9,s:rnd(.22,.42),sg:0,c:Math.random()<.5?[1,.85,.5]:[_col.r,_col.g,_col.b],a:1});
  if(Math.random()<.3)glow(tp,5*k,.08,[1,.75,.4]);if(Math.random()<.1)smoke(tp,1,.8);
  a.q-=dt;if(a.q<=0){a.q=.3;at(c.pos);nz(0,.3,'highpass',3500,0,.6,.12*k,.01,.1);at(null);for(const o of crs)if(o!==c&&o.st==='placed'&&!o.water&&o.pos.distanceTo(c.pos)<5.5)lightCr(o);for(const h of chickens)if(!h.caged&&Math.hypot(h.x-c.pos.x,h.z-c.pos.z)<26&&h.panic<=.3){h.panic=1.5;h.hx=Math.atan2(h.x-c.pos.x,h.z-c.pos.z);}}
  if(a.t<=0){smoke(c.pos,3,1);c.act=null;c.st='placed';c.dud=true;}}
 else if(a.type==='bee'){a.a+=dt*3.2;c.vel.y+=(a.t>.5?120:-40)*dt;c.vel.y=Math.min(c.vel.y,70);c.vel.x=Math.cos(a.a)*26;c.vel.z=Math.sin(a.a)*26;_v.copy(c.pos).addScaledVector(c.vel,dt);const hit=castRay(c.pos,_v);if(hit){c.pos.copy(hit.pt).addScaledVector(hit.n,.3);c.vel.y=Math.abs(c.vel.y)*.3;a.a+=Math.PI;}else c.pos.copy(_v);c.dir.copy(UP);
  for(let i=0;i<3;i++){const an=now*40+i*2.1;addP(SPK,{x:c.pos.x+Math.cos(an)*.6,y:c.pos.y,z:c.pos.z+Math.sin(an)*.6,vx:-Math.sin(an)*14,vy:rnd(-14,-4),vz:Math.cos(an)*14,life:rnd(.15,.4),g:30,drag:2,s:.4,sg:0,c:pk([[1,.9,.4],[1,.6,.2]]),a:1});}
  if(a.t<=0){const pos=c.pos.clone();kill(c);boom(pos,.5,{quiet:1});found('bee');}}
 else if(a.type==='mst'){a.cd-=dt;if(a.cd<=0&&a.n>0){a.cd=.6;a.n--;shootBall(c.pos.clone().addScaledVector(c.dir,2.4),c.dir.clone().add(V(rnd(-.06,.06),0,rnd(-.06,.06))).normalize());}if(a.n<=0&&a.cd<=-.4){found('mst');c.act=null;c.st='placed';c.dud=true;}}
 else{c.vel.y-=G*dt;c.pos.addScaledVector(c.vel,dt);if(c.pos.y<.3){c.pos.y=.3;c.vel.set(c.vel.x*.5,0,c.vel.z*.5);}a.cd-=dt;
  while(a.cd<=0&&a.n>0){a.cd+=rnd(.05,.11);a.n--;boom(V(c.pos.x+rnd(-.6,.6),c.pos.y+rnd(0,.5),c.pos.z+rnd(-.6,.6)),c.d.p,{cr:c,str:1});if(a.n%2===0&&!c.water)c.vel.set(rnd(-15,15),rnd(8,22),rnd(-15,15));c.m.scale.setScalar(.35+.65*a.n/c.d.string);c.dir.set(rnd(-1,1),rnd(0,.6),rnd(-1,1)).normalize();}
  if(a.n<=0){found('ddh');kill(c);}}}
function updCr(c,dt){
 if(c.par){if(c.par.p.dead){c.par=null;c.slot=null;c.st='fly';c.vel.set(rnd(-10,10),rnd(5,20),rnd(-10,10));}else{const b=c.par.p.body;b.pointToWorldFrame(c.par.l,_c1);c.pos.set(_c1.x,_c1.y,_c1.z);b.vectorToWorldFrame(c.par.d,_c1);c.dir.set(_c1.x,_c1.y,_c1.z);}}
 if(c.st==='fly')flyStep(c,dt);else if(c.st==='act')actStep(c,dt);if(c.dead)return;
 if(c.water&&c.st==='placed'){const fl=c.water==='pond'?-3:VAT.wl-5;if(c.pos.y>fl)c.pos.y=Math.max(fl,c.pos.y-(c.d.wp?14:5)*dt);}
 if(c.st!=='fly')c.m.quaternion.setFromUnitVectors(UP,c.dir);c.m.position.copy(c.pos);
 if(c.lit){c.t-=dt;const tp=tipOf(c);if(c.water){if(Math.random()<.4)spray(V(c.pos.x,c.water==='pond'?.4:VAT.wl+.3,c.pos.z),1,6);}else{if(c.d.sparkler){sparkle(tp);for(const o of crs)if(o!==c&&o.st==='placed'&&!o.lit&&!o.water&&o.pos.distanceToSquared(tp)<7)lightCr(o);}else{sparks(tp,1,5);if(Math.random()<.6)glow(tp,.9,.05,[1,.7,.3]);}}if(c.t<=0){c.lit=false;if(c.d.sparkler)c.dud=true;else trigger(c);}}
 const f=c.m.userData.fuse;if(f&&!c.dead){const fr=c.lit?clp(c.t/c.t0,0,1):(c.dud||c.act?0:1);f.visible=fr>.03;f.scale.y=Math.max(.01,.75*fr);}}

function sparkle(tp){for(let i=0;i<3;i++){_v.set(rnd(-1,1),rnd(-1,1),rnd(-1,1)).normalize().multiplyScalar(rnd(4,16));addP(SPK,{x:tp.x,y:tp.y,z:tp.z,vx:_v.x,vy:_v.y,vz:_v.z,life:rnd(.12,.5),g:22,drag:2,s:rnd(.25,.55),sg:0,c:pk([[1,.97,.8],[1,.85,.45],[1,1,1]]),a:1});}if(Math.random()<.5)glow(tp,1.6,.05,[1,.9,.6]);}
const balls=[];
function shootBall(pos,dir){const c=new THREE.Color().setHSL(Math.random(),1,.6);balls.push({p:pos,v:dir.multiplyScalar(170),c:[c.r,c.g,c.b],t:1.5});at(pos);osc(0,'sine',420,900,.12,.12,.2);nz(0,.1,'lowpass',1200,300,.7,.25,.003,.2);at(null);flash(pos,.25,.08);}
function updBalls(dt){for(let i=balls.length-1;i>=0;i--){const b=balls[i];b.t-=dt;b.v.y-=34*dt;_v.copy(b.p).addScaledVector(b.v,dt);const hit=castRay(b.p,_v);if(hit)b.p.copy(hit.pt).addScaledVector(hit.n,.4);else b.p.copy(_v);
  glow(b.p,2.6,.06,b.c);addP(SPK,{x:b.p.x,y:b.p.y,z:b.p.z,vx:rnd(-3,3),vy:rnd(-3,3),vz:rnd(-3,3),life:.35,g:10,drag:1,s:.6,sg:-1,c:b.c,a:.9});
  if(hit||b.t<=0){balls.splice(i,1);sparks(b.p,22,26,[b.c,[1,1,.8]]);boom(b.p.clone(),.35,{nopaper:1,quiet:1,str:1});if(Math.hypot(b.p.x-HAY.x,b.p.z-HAY.z)<19&&b.p.y<34)igniteHay();}}}
