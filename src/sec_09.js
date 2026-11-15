/* ================= 响 ================= */
const reactors=[];
const ripples=[];for(let i=0;i<6;i++){const m=add(new THREE.RingGeometry(.9,1,24),new THREE.MeshBasicMaterial({color:0xd8f0f8,transparent:true,opacity:0,depthWrite:false}),0,-5,0,{rx:-Math.PI/2,cast:false});ripples.push({m,t:0});}
function ripple(p,w){let r=ripples[0];for(const x of ripples)if(x.t<r.t)r=x;r.t=1;r.max=w==='pond'?26:VAT.r-.6;r.m.position.set(p.x,p.y+.06,p.z);}
let chainT=[];
function boom(pos,p,o={}){bangs++;$('#cnt').textContent=bangs+' 响';if(!o.str){chainT=chainT.filter(t=>now-t<1.6);chainT.push(now);if(chainT.length>=5)found('chain');}if(bangs===100)found('b100');if(bangs===500)found('b500');let nLog=0,nFly=0;const small=p<.6,dP=pos.distanceTo(camera.position);
 let cover=null;if(!o.noCover&&!o.str)for(const q of props){if(q.dead||!q.d.cover||q===carry)continue;q.body.pointToLocalFrame(cv3(pos),_c1);if(Math.hypot(_c1.x,_c1.z)<q.d.r&&Math.abs(_c1.y)<q.d.h/2+.9&&upOf(q.body).y>.6){cover=q;break;}}
 at(pos);S.bang(p,cover?cover.d.snd:o.snd);at(null);flash(pos,(cover?.5:1)*(.8+p),.11+.03*p);
 if(cover)smoke(pos,5,1);else{sparks(pos,small?8:(16+p*10)|0,(small?14:20)+p*8);glow(pos,3+p*3,.1+.03*p);smoke(pos,small?2:(4+p*2)|0,small?.8:1.2+p*.35);}
 if(!o.nopaper)paper(pos,small?5:(12+p*9)|0,small?10:16+p*5);
 if(pos.y<2.5)decal(V(pos.x,.06,pos.z),UP,(small?.7:1.1)+p*.55,0x15100c);
 const R0=4+3.6*p;
 for(const q of props.slice()){if(q.dead||q===carry)continue;const b=q.body;
  if(q===cover){const dv=Math.min(150,4.6*p*5/Math.max(q.d.m,.25));b.wakeUp();b.velocity.set(rnd(-.08,.08)*dv,dv,rnd(-.08,.08)*dv);b.angularVelocity.set(rnd(-7,7),rnd(-3,3),rnd(-7,7));found('cover');if(q.k==='coop')freeHen(true);if(q.k==='carton'){q.hp=(q.hp||2)-1;if(q.hp<=0){bits(ppos(q),40,22,[0xb98a52,0xa2763f,0xd8c08c],1.6,1);rmProp(q);found('carton');}}continue;}
  const dx=b.position.x-pos.x,dy=b.position.y-pos.y,dz=b.position.z-pos.z,dist=Math.hypot(dx,dy,dz),dd=Math.max(0,dist-(q.d.r||1)*.6);if(dd>R0)continue;
  const f=1-dd/R0,j=4.6*p*f*(cover?.25:1),dv=Math.min(150,j/Math.max(q.d.m,.25));
  if(q.d.glass&&dv>16){shatter(q);continue;}if(q.d.veg&&j>4){shred(q);continue;}if(q.d.fruit&&j>3.6){burstF(q);continue;}if(q.d.gourd&&j>3.4){burstG(q);continue;}if(q.d.coal&&j>3){coalBreak(q);continue;}if(q.d.tray&&!q.spilled&&dv>5)spill(q);if(q.k==='log'&&dv>2.2)nLog++;if(dv>25)nFly++;
  const il=1/(dist||1);b.wakeUp();b.velocity.x+=dx*il*dv;b.velocity.y+=(dy*il+.5)*dv;b.velocity.z+=dz*il*dv;const w=Math.min(25,dv*.2);b.angularVelocity.x+=rnd(-w,w);b.angularVelocity.y+=rnd(-w,w);b.angularVelocity.z+=rnd(-w,w);}
 if(nLog>=4)found('logs');if(nFly>=3)found('multi');
 for(const c of crs){if(c.dead||c.st!=='placed'||c.water||c===o.cr)continue;const d=c.pos.distanceTo(pos);if(d>R0)continue;
  if(c.d.snap){c.lit=true;c.t=.03;}else if(!c.lit&&!c.dud&&!c.act&&d<1.8+1.2*p&&Math.random()<.8){c.lit=true;c.t0=c.d.fuse;c.t=rnd(.1,.5);}
  if(!c.slot&&!c.par){c.st='fly';c.vel.set(c.pos.x-pos.x,0,c.pos.z-pos.z).normalize().multiplyScalar(rnd(12,36)*(1-d/R0)+4);c.vel.y=rnd(10,26);}}
 if(!o.str||Math.random()<.25)scare(pos,p);for(const r of reactors)r(pos,p,dP,o);
 shake=Math.min(1.7,shake+p*clp(45/Math.max(dP,8),0,3)*.22);
 if(dP<17&&!small){whiteout(clp(1.15-dP/17,0,.85)*Math.min(1,p));if(dP<10){SPt={g:1,pan:0,dl:0};S.ring();}}
 if(p>=3&&!o.quiet)upset(inYard(pos.x,pos.z)?1.3:0,pk(['哎哟！谁放的雷王？！','吓死个人！打牌呢！','雷王不许在院里放！']));else if(bangs===20)yell('省着点放，留点明天放！');else if(bangs===120)yell('一晚上放完了明天放什么！');}
function waterBoom(pos,p,w){bangs++;$('#cnt').textContent=bangs+' 响';const sp=V(pos.x,w==='pond'?.4:VAT.wl+.3,pos.z),dP=sp.distanceTo(camera.position);
 at(sp);S.bang(p,'water');at(null);flash(sp,.6+p*.4,.14,0x9ad0ff);spray(sp,(40+p*30)|0,(w==='pond'?75:60)+p*18);ripple(sp,w);found('water');scare(sp,p*.6);for(const r of reactors)r(sp,p*.6,dP,{water:1});shake=Math.min(1.7,shake+p*clp(45/Math.max(dP,8),0,3)*.18);
 if(w==='pond'){const n=2+(p*1.5|0);for(let i=0;i<n;i++){const a=rnd(0,TAU),r=rnd(2,14),f=add(SPH(1,8,5),0xe8ecec,sp.x+Math.cos(a)*r,.5,sp.z+Math.sin(a)*r,{cast:false});f.scale.set(rnd(1.8,2.6),.35,.75);f.rotation.y=rnd(0,TAU);floaters.push(f);}lumps(sp,5,34,[0xb8c4c8,0x8a9aa0],1.2);found('fish');if(Math.random()<.5)yell('塘里的鱼是留着过年吃的！');}
 else{VAT.hp-=p>=1?1:.5;if(VAT.hp<=0&&VAT.wl>0){VAT.wl=0;VAT.water.position.y=.7;VAT.water.userData.t={name:'破水缸'};VAT.mesh.userData.t={name:'破水缸'};add(BX(.5,6.5,.4),0x140c08,VAT.x-2,3.6,VAT.z+VAT.r+.05,{rz:.25,cast:false});add(BX(.4,4,.4),0x140c08,VAT.x-.6,5.4,VAT.z+VAT.r+.05,{rz:-.5,cast:false});
   for(let i=0;i<10;i++)decal(V(VAT.x+rnd(-12,12),.07,VAT.z+VAT.r+rnd(0,22)),UP,rnd(3,7),0x2a2622);spray(V(VAT.x,4,VAT.z+VAT.r),60,34);at(sp);S.splash(.45);at(null);found('vat');upset(3,'水缸！！！我的水缸！！');tattle('水缸炸裂了');}}}
const floaters=[];
const SLOT={
 dung(s,pos,p){s.mesh.visible=false;s.mesh.traverse(m=>{const i=picks.indexOf(m);if(i>=0)picks.splice(i,1);});lumps(pos,60,26+p*6,[0x4a3119,0x5b3e22,0x3a2612,0x6a4a2a],.9,0x3e2914);at(pos);S.splat();at(null);boom(pos,p,{nopaper:1,snd:'soft',quiet:1});found('dung');const d=pos.distanceTo(camera.position);if(d<42){splat(clp(9-d/5|0,2,8),'#4a3119');yell('一身牛粪！今晚别上桌吃饭！',1);later(.6,()=>cz('splat'));}czDung(pos);},
 mud(s,pos,p){lumps(pos,46,22+p*5,[0x3b2c1c,0x4a3a28,0x2c2014],.8,0x2c2014);at(pos);S.splat();at(null);boom(pos,p,{nopaper:1,snd:'soft',quiet:1});found('mud');const d=pos.distanceTo(camera.position);if(d<38){splat(clp(8-d/5|0,2,7),'#3b2c1c');upset(1,'新衣服！！刚买的新衣服！！');later(.6,()=>cz('splat'));}},
 hay(s,pos,p){boom(pos,p);igniteHay();},
 bottle(s,pos,p){if(!s.prop.dead)shatter(s.prop);boom(pos,p);},
 cabbage(s,pos,p){if(!s.prop.dead)shred(s.prop);boom(pos,p,{snd:'soft'});},
 bamboo(s,pos,p){const d=s.dir;for(let i=0;i<50;i++){const k=rnd(30,110);addP(SPK,{x:pos.x,y:pos.y,z:pos.z,vx:d.x*k+rnd(-8,8),vy:d.y*k+rnd(-8,8),vz:d.z*k+rnd(-8,8),life:rnd(.2,.6),g:30,drag:1.5,s:rnd(.4,.8),sg:0,c:pk(SPC),a:1});}
  for(let i=0;i<10;i++)addP(SMK,{x:pos.x,y:pos.y,z:pos.z,vx:d.x*rnd(20,50)+rnd(-5,5),vy:d.y*rnd(20,50),vz:d.z*rnd(20,50)+rnd(-5,5),life:rnd(1.5,3),g:-1,drag:1.6,s:2,sg:4,c:[.75,.75,.78],a:.45});
  boom(pos.clone().addScaledVector(d,2),p*1.5,{snd:'tube',quiet:1});bits(V(-262,90,206),50,40,[0x4c7a34,0x5a8a3c,0x8aa850],1.6,1);found('bamboo');},
 crack(s,pos,p){boom(pos,p);if(s.n>0){s.n--;for(let i=0;i<3;i++){const b=mkProp('brick',pos.x+rnd(-2,2),pos.y+rnd(-1,2),pos.z-1.6);b.body.velocity.set(rnd(-15,15),rnd(5,25),-rnd(25,55)-p*8);b.body.angularVelocity.set(rnd(-8,8),rnd(-8,8),rnd(-8,8));}s.mesh.scale.x*=2.2;smoke(pos,6,1.6,[.7,.62,.55]);found('crack');yell('我家的墙！！你是谁家的小孩？！',1);}},
 lid(s,pos,p){const q=s.prop,home=lidHome(q);boom(pos,p,{snd:'tube',nopaper:1,noCover:1,quiet:1});for(let i=0;i<14;i++)addP(SMK,{x:pos.x+rnd(-2,2),y:.5,z:pos.z+rnd(-2,2),vx:rnd(-3,3),vy:rnd(12,40),vz:rnd(-3,3),life:rnd(1.5,3.2),g:-2,drag:1.2,s:2.5,sg:4,c:[.55,.62,.36],a:.5});
  if(home){q.body.wakeUp();q.body.velocity.set(rnd(-7,7),95+p*30,rnd(-7,7));q.body.angularVelocity.set(rnd(-9,9),rnd(-3,3),rnd(-9,9));found('lid');yell('化粪池你也敢炸？！！',1);}},
};
function goBoom(c){const p=c.d.p,pos=c.pos.clone(),s=c.slot,w=c.water;if(c.st==='fly'&&pos.y>22&&!w)found('air');kill(c);if(w){waterBoom(pos,p,w);return;}if(s&&SLOT[s.kind]){SLOT[s.kind](s,pos,p);return;}boom(pos,p);}
/* 环境反应 */
function igniteHay(){if(HAY.burn>0||HAY.burnt)return;HAY.burn=26;found('hay');upset(3,'草垛着了！！！谁干的？！');tattle('草垛点着了');}
function updHay(dt){if(HAY.burn<=0)return;HAY.burn-=dt;const k=Math.min(1,(26-HAY.burn)/3)*Math.min(1,Math.max(0,HAY.burn)/3);
 for(let i=0;i<5;i++){if(Math.random()>k)continue;const a=rnd(0,TAU),r=rnd(0,17);addP(SPK,{x:HAY.x+Math.cos(a)*r,y:rnd(2,30),z:HAY.z+Math.sin(a)*r,vx:rnd(-2,2),vy:rnd(14,34),vz:rnd(-2,2),life:rnd(.4,.9),g:-8,drag:1,s:rnd(4,8),sg:-3,c:pk([[1,.45,.1],[1,.7,.2],[.9,.28,.06]]),a:.75});}
 if(Math.random()<.6*k)smoke(V(HAY.x+rnd(-8,8),rnd(30,40),HAY.z+rnd(-8,8)),1,5,[.25,.24,.24]);hayL.intensity=5000*k*(.8+Math.random()*.4);const col=.22+.78*clp(HAY.burn/26,0,1);hayM.forEach(m=>m.material.color.setRGB(.72*col,.59*col,.24*col));
 if(Math.random()<dt*3)for(const c of crs)if(c.st==='placed'&&!c.water&&Math.hypot(c.pos.x-HAY.x,c.pos.z-HAY.z)<22)lightCr(c);
 if(HAY.burn<=0){HAY.burnt=true;hayL.intensity=0;}}
hayM.forEach(m=>m.material=m.material.clone());
reactors.push((pos,p)=>{if(p>=.5&&pos.y<34&&Math.hypot(pos.x-HAY.x,pos.z-HAY.z)<19+p)igniteHay();});
reactors.push((pos,p)=>{const d=Math.hypot(pos.x-TREE.x,pos.z-TREE.z);if(d>60+12*p||!TREE.fruits.length)return;let n=0;for(const f of TREE.fruits.slice()){const df=f.p.distanceTo(pos);if(Math.random()<clp((.9*p)*(1.2-df/75),0,.95)){TREE.fruits.splice(TREE.fruits.indexOf(f),1);scene.remove(f.m);const q=mkProp('pomelo',f.p.x,f.p.y,f.p.z);q.body.velocity.set(rnd(-4,4),-5,rnd(-4,4));n++;}}
 if(n){bits(V(TREE.x,44,TREE.z),30,30,[0x3a5a2c,0x44682f,0x6a8a3a],1.4,1);found('tree');}});
reactors.push((pos,p)=>{for(const w of windows){if(!w.ok)continue;const d=w.p.distanceTo(pos);if(d<(p>=1?16+4*p:5)){w.ok=false;w.pane.material=new THREE.MeshBasicMaterial({color:0x14100e});w.halo.visible=false;at(w.p);S.glass();at(null);bits(V(w.p.x,w.p.y,w.p.z+w.nz*1.5),34,16,[0xcfe8f0,0xa8d0e0,0xffffff],.8,0);found('window');if(w.own){upset(3,'玻璃！！大过年的也得收拾你！！');tattle('玻璃砸了');}else yell('邻居：谁砸我家玻璃？！叫你家大人来赔！',1);}}});
reactors.push((pos,p)=>{const d=pos.distanceTo(quilt.position);if(d<70)quiltSw=Math.min(1.2,quiltSw+p*clp(1-d/70,0,1));if(d<13&&Math.abs(pos.z-8)<10&&quiltHit<5){quiltHit++;decal(V(clp(pos.x,49,77),clp(pos.y,6,17),8+(pos.z>8?.2:-.2)),V(0,0,pos.z>8?1:-1),rnd(1.6,2.6),0x120c08);found('quilt');upset(2,'新弹的棉被！！！');tattle('被子烧了个洞');}});

reactors.push((pos,p)=>{for(const l of lanterns)if(l.g.position.distanceTo(pos)<90)l.sw=Math.min(1,l.sw+p*.5);});
