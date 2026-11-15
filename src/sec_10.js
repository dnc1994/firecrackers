/* ================= 人 ================= */
const P={x:-4,z:86,yaw:-.05,pitch:-.08,vx:0,vz:0,bob:0,stepT:0,frozen:0};
const keys={},joy={id:null,x:0,y:0,ox:0,oy:0},look={id:null,x:0,y:0};
const hand={k:'xb',d:CD.xb,lit:false,t:0,t0:1,busy:0,charging:false,ch:0,lightA:0,throwA:0,fire:null,spin:0,py:0};
const aim={hit:null,n:V(),cr:null,near:null};
const vm=new THREE.Group();camera.add(vm);const handR=new THREE.Group(),handL=new THREE.Group(),holder=new THREE.Group();vm.add(handR,handL);
{const skin=M(0xeab99a),sl=M(0xc23038),cuff=M(0x8a1c24);for(const h of[handR,handL])h.scale.setScalar(.43);holder.scale.setScalar(1.5);
 for(const[h,sg]of[[handR,1],[handL,-1]]){const f=mesh(h,SPH(.85,10,8),skin);f.scale.set(1,.9,1.15);for(let i=0;i<4;i++)mesh(h,SPH(.3,6,5),skin,-.5*sg+i*.33*sg,.45,-.62).scale.set(1,1.2,1.3);mesh(h,SPH(.34,6,5),skin,sg*-.75,.2,-.2).scale.set(1,1,1.6);
  const arm=new THREE.Group();arm.position.set(sg*.25,-.6,.7);arm.rotation.x=-.3;h.add(arm);mesh(arm,CY(1.05,1.25,7,10),sl,0,-.2,3.6).rotation.x=Math.PI/2;mesh(arm,CY(1.12,1.12,.9,10),cuff,0,-.2,.4).rotation.x=Math.PI/2;}
 holder.position.set(0,.8,-.2);handR.add(holder);
 const inc=new THREE.Group();inc.position.set(.2,.5,-.3);inc.rotation.set(-.35,0,-.3);handL.add(inc);mesh(inc,CY(.05,.05,3.8,5),0x8a5a3a,0,1.9,0);
 const tm=new THREE.MeshBasicMaterial();tm.color.setRGB(3,.9,.25);handL.userData.tip=mesh(inc,SPH(.14,6,5),tm,0,3.8,0);}
let hm=null,HX=2.6,HY=-2.8;
function setHand(k){hand.k=k;hand.d=CD[k];hand.lit=false;hand.charging=false;if(hm)holder.remove(hm);hm=crMesh(k);hm.position.y=k==='ddh'?-2:k==='xnb'?1.4:k==='mst'?1.2:0;hm.scale.setScalar(k==='ph'?.62:1);holder.add(hm);document.querySelectorAll('.chip').forEach(c=>c.classList.toggle('on',c.dataset.k===k));}
function handTip(){const f=hand.lit?clp(hand.t/hand.t0,0,1):1,top=hm.userData.top;return hm.localToWorld(V(0,hand.d.sparkler?-.5+(top+.5)*f:top+(hand.d.fuse?.75*f:0),0));}
function lightHand(){if(hand.busy>0||hand.lit)return;hand.lightA=.28;hand.lit=true;hand.t=hand.t0=hand.d.fuse*rnd(.95,1.08)+.25;SPt={g:.8,pan:.2,dl:.2};S.tss();at(null);}
function fwd(){return camera.getWorldDirection(V());}
function throwHand(pw){const f=fwd(),r=V().crossVectors(f,UP).normalize();const pos=camera.position.clone().addScaledVector(f,3.2).addScaledVector(r,HX*.6).add(V(0,-1.6,0));
 const c=mkCr(hand.k,pos,{st:'fly',lit:hand.lit,t:hand.t});c.t0=hand.t0;c.vel.copy(f).multiplyScalar(98*pw).add(V(P.vx,20*pw,P.vz));c.m.quaternion.copy(camera.quaternion);hand.lit=false;hand.busy=.42;hand.throwA=.22;SPt={g:.5,pan:.2,dl:0};nz(0,.12,'bandpass',900,2400,.8,.12,.03,0);at(null);}
function handBoom(){const d=hand.d,pos=handTip();hand.lit=false;hand.busy=.8;
 if(d.sparkler){hand.busy=.6;return;}
 if(d.candle){hand.busy=0;hand.fire={n:8,cd:.12};return;}
 if(d.two){const c=mkCr('etj',pos,{dir:V(rnd(-.15,.15),1,rnd(-.15,.15)).normalize()});c.st='act';c.act={type:'etj',t:rnd(.85,1.05)};c.vel.copy(c.dir).multiplyScalar(125);boom(pos,.8,{nopaper:1,quiet:1,cr:c});found('etjh');shake+=.5;whiteout(.6);toast('手震麻了——它自己上天了');hand.busy=1.4;later(.8,()=>cz('hand'));return;}
 if(d.rocket){const c=mkCr('cth',pos,{dir:fwd()});c.st='act';c.act={type:'rocket',t:.95};c.vel.copy(c.dir).multiplyScalar(40);at(pos);S.whistle(.95);at(null);found('rh');shake+=.25;return;}
 if(d.spin||d.string||d.fount||d.bee){const c=mkCr(hand.k,pos,{st:'fly',lit:true,t:.02});c.vel.copy(fwd()).multiplyScalar(14).setY(4);toast('烫手！扔了');return;}
 boom(pos,d.p,{quiet:1});found('hand');shake+=.8;whiteout(.9);toast(d.p>2?'两只手都麻了……':'手麻了！');hand.busy=1.6;later(.8,()=>cz('hand'));}
function aDown(){initAudio();if(hand.fire||P.frozen>0)return;const ac=aim.cr;if(hand.lit&&hand.d.sparkler&&ac&&!ac.lit&&!ac.dud&&ac.d.fuse&&!ac.act){if(lightCr(ac)){hand.lightA=.3;found('spark');}return;}
 if(!hand.lit&&aim.cr&&!aim.cr.lit&&!aim.cr.dud&&aim.cr.d.fuse&&!aim.cr.act){if(lightCr(aim.cr))hand.lightA=.3;return;}
 if(hand.busy>0)return;if(hand.lit||hand.d.snap){hand.charging=true;hand.ch=0;return;}lightHand();}
function aUp(){if(hand.charging){hand.charging=false;if(hand.busy<=0)throwHand(clp(.45+hand.ch*1.25,.45,1.25));}}
function placeTarget(){const h=aim.hit;if(!h){const f=fwd();return{label:'放脚边',pos:V(P.x+f.x*7,0,P.z+f.z*7)};}
 const t=h.object.userData.t,n=aim.n;if(t.water)return{label:'丢进'+t.name,pos:t.water==='vat'?V(VAT.x+rnd(-2,2),VAT.wl+.3,VAT.z+rnd(-2,2)):h.point.clone(),water:t.water};
 if(t.slot)return{label:t.slot.verb,pos:(t.slot.pos||h.point).clone(),slot:t.slot,dir:t.slot.dir};
 if(t.prop){const q=t.prop,up=upOf(q.body).y>.6;if(q.k==='lid'&&lidHome(q))return{label:'塞进井盖缝',pos:LIDP.clone(),slot:{kind:'lid',prop:q}};
  if(q.d.slot&&q.k!=='lid'&&up)return slotOf(q);
  if(n.y>.5)return{label:'放'+q.d.n+'上',pos:h.point.clone(),prop:q};return null;}
 const nq=aim.near;if(nq&&nq.d.slot&&nq.k!=='lid'&&upOf(nq.body).y>.6)return slotOf(nq);if(nq&&nq.k==='lid'&&lidHome(nq))return{label:'塞进井盖缝',pos:LIDP.clone(),slot:{kind:'lid',prop:nq}};
 if(n.y>.5)return{label:t.name==='地上'?'放地上':'放'+t.name+'上',pos:h.point.clone()};return null;}
function slotOf(q){return{label:q.k==='bottle'?'插进瓶口':'插进白菜心',prop:q,loc:new CANNON.Vec3(0,(q.d.h?q.d.h/2:q.d.r*.75)+.25,0),slot:{kind:q.k,prop:q}};}
function place(){initAudio();if(hand.busy>0||hand.fire||P.frozen>0)return;const T=placeTarget();if(!T){toast('这儿放不住');return;}const k=hand.k,d=hand.d,f=fwd();
 let dir=T.dir||UP,off=k==='sp'?.34:k==='dls'||k==='xmf'?.18:k==='ddh'?.2:k==='ph'?.85:k==='xnb'?2.1:d.len/2;if(T.slot&&!T.loc)off=0;
 if(k==='ddh'&&!T.slot)dir=V(f.x,.02,f.z).normalize();if(k==='cth'&&!T.slot)dir=V(f.x*.35,1,f.z*.35).normalize();
 const pos=T.pos?T.pos.clone():V();pos.y+=off;const c=mkCr(k,pos,{dir,lit:hand.lit,t:hand.t});c.t0=hand.t0;c.slot=T.slot||null;
 if(T.prop){const q=T.prop,l=T.loc||new CANNON.Vec3();if(!T.loc)q.body.pointToLocalFrame(cv3(pos),l);c.par={p:q,l,d:T.loc?new CANNON.Vec3(0,1,0):q.body.vectorToLocalFrame(cv3(dir))};}
 if(T.water)enterWater(c,T.water);else if(!T.prop&&!T.slot&&pos.y<2&&inPond(pos))enterWater(c,'pond');hand.lit=false;hand.busy=.25;hand.throwA=.12;SPt={g:.6,pan:.2,dl:0};S.tick();at(null);}
function pickC(){initAudio();const f=fwd();if(carry){const q=carry,b=q.body;carry=null;b.angularDamping=q.d.sph?.5:.25;
  if(aim.cr&&q.d.cover){const c=aim.cr;b.position.set(c.pos.x,Math.max(c.pos.y-.4,0)+q.d.h/2+1,c.pos.z);b.quaternion.set(0,0,0,1);b.velocity.set(0,-6,0);b.angularVelocity.set(0,0,0);}
  else if(!aim.hit){b.velocity.set(f.x*62+P.vx,f.y*62+18,f.z*62+P.vz);b.angularVelocity.set(rnd(-5,5),rnd(-5,5),rnd(-5,5));}
  else b.velocity.set(f.x*8,2,f.z*8);b.wakeUp();return;}
 const q=(aim.hit&&aim.hit.object.userData.t.prop)||aim.near;if(!q){toast('这个搬不动');return;}carry=q;q.body.wakeUp();q.body.angularDamping=.92;}
function updAim(){const rc=updAim.rc||(updAim.rc=new THREE.Raycaster());rc.setFromCamera(updAim.c||(updAim.c=new THREE.Vector2(0,0)),camera);rc.far=24;
 const hits=rc.intersectObjects(picks,false);aim.hit=null;for(const h of hits){const t=h.object.userData.t;if(carry&&t.prop===carry)continue;if(!h.object.visible||(h.object.parent&&!h.object.parent.visible))continue;aim.hit=h;if(h.face)aim.n.copy(h.face.normal).transformDirection(h.object.matrixWorld);else aim.n.copy(UP);break;}
 let best=null,bs=2.2;const o=rc.ray.origin,d=rc.ray.direction;for(const c of crs){if(c.dead||c.st!=='placed'||c.act)continue;_v.copy(c.pos).sub(o);const al=_v.dot(d);if(al<1||al>30)continue;const pd=_v.addScaledVector(d,-al).length();const s=pd+al*.02+(c.dud?1.3:0);if(s<bs){bs=s;best=c;}}aim.cr=best;
 let nb=null,ns=1.5;for(const q of props){if(q.dead||q===carry)continue;const b=q.body.position;_v.set(b.x-o.x,b.y-o.y,b.z-o.z);const al=_v.dot(d);if(al<1||al>26)continue;const pd=_v.addScaledVector(d,-al).length()-(q.d.r||1.2)*.7;if(pd<ns){ns=pd;nb=q;}}aim.near=nb;}
/* 操作绑定 */
const KLAB=['1','2','3','4','5','6','7','8','9','0','-','='],KCODE=['Digit1','Digit2','Digit3','Digit4','Digit5','Digit6','Digit7','Digit8','Digit9','Digit0','Minus','Equal'];
function selIdx(i){const ks=Object.keys(CD);i=(i+ks.length)%ks.length;if(ks[i]&&!hand.lit&&!hand.fire){setHand(ks[i]);toast(CD[ks[i]].n+'：'+CD[ks[i]].tip);}}
{const pk0=$('#pocket');Object.keys(CD).forEach((k,i)=>{const c=document.createElement('div');c.className='chip';c.dataset.k=k;c.innerHTML='<i>'+KLAB[i]+'</i>'+CD[k].n;c.addEventListener('pointerdown',e=>{e.stopPropagation();initAudio();selIdx(i);});pk0.appendChild(c);});
 const A=$('#btnA');A.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();try{A.setPointerCapture(e.pointerId);}catch(_){}aDown();});for(const ev of['pointerup','pointercancel'])A.addEventListener(ev,e=>{e.stopPropagation();aUp();});
 $('#btnB').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();place();});$('#btnC').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();pickC();});
 $('#mute').addEventListener('pointerdown',e=>{e.stopPropagation();muted=!muted;$('#mute').textContent=muted?'🔇':'🔊';if(master)master.gain.value=muted?0:.9;});
 const showPanel=()=>{const hid=FOUND.filter(f=>!got.has(f[0])&&!f[2]).length;$('#psub').textContent=`${got.size} / ${FOUND.length}。没玩出来的只给一句话，有 ${hid} 个连话都不给。`;$('#list').innerHTML=FOUND.filter(f=>got.has(f[0])).map(f=>`<div>✦ ${f[1]}</div>`).join('')+FOUND.filter(f=>!got.has(f[0])&&f[2]).map(f=>`<div class="no">？ ${f[2]}</div>`).join('')+FOUND.filter(f=>!got.has(f[0])&&!f[2]).map(()=>`<div class="no">？？？</div>`).join('');$('#panel').style.display='flex';if(document.pointerLockElement)document.exitPointerLock();};
 $('#found').addEventListener('pointerdown',e=>{e.stopPropagation();showPanel();});$('#help').addEventListener('pointerdown',e=>{e.stopPropagation();$('#intro').style.display='flex';if(document.pointerLockElement)document.exitPointerLock();});
 $('#close').addEventListener('click',()=>{$('#panel').style.display='none';});$('#reset').addEventListener('click',()=>{got.clear();saveGot();showGot();$('#panel').style.display='none';toast('记录清空了');});$('#go').addEventListener('click',()=>{initAudio();$('#intro').style.display='none';toast('表哥在院门口，爷爷在屋檐下');});
 for(const id of['#intro','#panel'])$(id).addEventListener('pointerdown',e=>e.stopPropagation());}
const locked=()=>document.pointerLockElement===cvs;
view.addEventListener('pointerdown',e=>{if(e.target.closest('.ui'))return;initAudio();
 if(e.pointerType==='mouse'){if(locked()){if(e.button===0)aDown();else if(e.button===2)place();return;}try{const pr=cvs.requestPointerLock();if(pr&&pr.catch)pr.catch(()=>{});}catch(_){}look.id=e.pointerId;look.x=e.clientX;look.y=e.clientY;return;}
 const r=view.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
 if(joy.id===null&&x<r.width*.45&&y>r.height*.42){joy.id=e.pointerId;joy.ox=x;joy.oy=y;joy.x=joy.y=0;const j=$('#joy');j.style.left=(x-56)+'px';j.style.top=(y-56)+'px';j.style.bottom='auto';}
 else if(look.id===null){look.id=e.pointerId;look.x=e.clientX;look.y=e.clientY;}
 try{view.setPointerCapture(e.pointerId);}catch(_){}});
view.addEventListener('pointermove',e=>{if(locked()&&e.pointerType==='mouse'){P.yaw-=e.movementX*.0024;P.pitch=clp(P.pitch-e.movementY*.0024,-1.45,1.3);return;}
 if(e.pointerId===joy.id){const r=view.getBoundingClientRect();let dx=e.clientX-r.left-joy.ox,dy=e.clientY-r.top-joy.oy;const l=Math.hypot(dx,dy),m=46;if(l>m){dx*=m/l;dy*=m/l;}joy.x=dx/m;joy.y=dy/m;$('#knob').style.transform=`translate(${dx}px,${dy}px)`;}
 else if(e.pointerId===look.id){const k=e.pointerType==='mouse'?.004:.0058;P.yaw-=(e.clientX-look.x)*k;P.pitch=clp(P.pitch-(e.clientY-look.y)*k,-1.45,1.3);look.x=e.clientX;look.y=e.clientY;}});
function pEnd(e){if(locked()&&e.pointerType==='mouse'){if(e.button===0)aUp();return;}if(e.pointerId===joy.id){joy.id=null;joy.x=joy.y=0;$('#knob').style.transform='';}if(e.pointerId===look.id)look.id=null;}
view.addEventListener('pointerup',pEnd);view.addEventListener('pointercancel',pEnd);view.addEventListener('contextmenu',e=>e.preventDefault());
addEventListener('keydown',e=>{keys[e.code]=true;if(e.repeat)return;if(e.code==='Space'||e.code==='KeyF'){e.preventDefault();aDown();}else if(e.code==='KeyQ')place();else if(e.code==='KeyE')pickC();else if(KCODE.includes(e.code))selIdx(KCODE.indexOf(e.code));});
view.addEventListener('wheel',e=>{e.preventDefault();if(Math.abs(e.deltaY)<2)return;selIdx(Object.keys(CD).indexOf(hand.k)+(e.deltaY>0?1:-1));},{passive:false});;
addEventListener('keyup',e=>{keys[e.code]=false;if(e.code==='Space'||e.code==='KeyF')aUp();});
