/* ================= 家里人 ================= */
const people=[],laters=[];
function later(t,f){laters.push({t:now+t,f});}
const inYard=(x,z)=>Math.abs(x)<110&&z>-100&&z<94;
function mkPerson(o){const g=new THREE.Group(),s=o.h/16.5;scene.add(g);g.scale.setScalar(s);
 const leg=x=>{const p=new THREE.Group();p.position.set(x,7.6,0);g.add(p);mesh(p,CY(.95,.8,7.2,8),o.pants,0,-3.6,0);mesh(p,BX(1.5,1,2.7),0x2a2420,0,-7.1,.5);return p;};
 const arm=x=>{const p=new THREE.Group();p.position.set(x,13.2,0);g.add(p);mesh(p,CY(.85,.72,5.6,8),o.coat,0,-2.8,0);mesh(p,SPH(.8,8,6),o.skin,0,-5.9,0);return p;};
 const legL=leg(-1.05),legR=leg(1.05);mesh(g,CY(2.1,2.35,6.6,10),o.coat,0,10.6,0).scale.z=.74;mesh(g,SPH(2.15,10,6),o.coat,0,13.5,0).scale.set(1,.5,.76);
 const armL=arm(-2.8),armR=arm(2.8),head=new THREE.Group();head.position.set(0,15.5,0);g.add(head);
 mesh(head,SPH(1.75,12,10),o.skin);mesh(head,new THREE.SphereGeometry(1.86,12,8,0,TAU,0,Math.PI*.56),o.hair,0,.12,-.14);
 for(const x of[-.6,.6])mesh(head,SPH(.17,6,5),0x1a1410,x,.05,1.62);mesh(head,BX(.6,.12,.1),0x8a3a30,0,-.75,1.6);
 if(o.kid)for(const x of[-1,1])mesh(head,SPH(.3,6,5),0xf0a0a0,x,-.4,1.38).scale.z=.3;
 if(o.pig)for(const x of[-1.75,1.75]){mesh(head,SPH(.6,7,6),o.hair,x,-.5,-.3);mesh(head,SPH(.28,6,5),0xe83a4a,x,.1,-.2);}
 if(o.bun)mesh(head,SPH(.8,8,6),o.hair,0,.5,-1.7);
 if(o.cap){mesh(head,new THREE.SphereGeometry(1.92,12,8,0,TAU,0,Math.PI*.46),o.cap,0,.2,0);mesh(head,SPH(1.2,8,6),0xe8e4dc,0,-1.1,1.1).scale.set(1,.5,.5);}
 if(o.scarf)mesh(g,new THREE.TorusGeometry(1.5,.5,6,12),o.scarf,0,14.2,0).rotation.x=Math.PI/2;
 g.traverse(m=>{if(m.isMesh)m.castShadow=true;});const b=document.createElement('div');b.className='bub';view.appendChild(b);
 const p={g,legL,legR,armL,armR,head,x:o.x,z:o.z,y:0,yaw:o.yaw||0,yawT:o.yaw||0,walk:0,run:0,pose:null,poseT:0,sayT:0,b,h:o.h,pitch:o.pitch,name:o.name,sit:o.sit,jump:0,st:'idle',t:0};people.push(p);return p;}
function sayP(p,t,d=2.8,quiet){p.b.textContent=t;p.sayT=d;if(AC&&!quiet){at(V(p.x,p.h,p.z));const n=Math.min(6,2+(t.length/4|0));for(let i=0;i<n;i++)osc(i*.1,'square',p.pitch*rnd(.9,1.15),p.pitch*rnd(.7,.9),.08,.035,.3);at(null);}}
function walkTo(p,tx,tz,sp,dt){const dx=tx-p.x,dz=tz-p.z,l=Math.hypot(dx,dz);if(l<1.5){p.walk=0;return true;}let nx=p.x+dx/l*sp*dt,nz=p.z+dz/l*sp*dt;
 if(blocked(nx,nz,2)){if(!blocked(nx,p.z,2))nz=p.z;else if(!blocked(p.x,nz,2))nx=p.x;else{const a=Math.atan2(dz,dx)+(p.side||(p.side=pk([-1,1])))*1.5;nx=p.x+Math.cos(a)*sp*dt;nz=p.z+Math.sin(a)*sp*dt;if(blocked(nx,nz,2)){p.side=-p.side;nx=p.x;nz=p.z;}}}
 p.x=nx;p.z=nz;p.yawT=Math.atan2(dx,dz);p.walk=1;return false;}
function animP(p,dt){let d=p.yawT-p.yaw;d=Math.atan2(Math.sin(d),Math.cos(d));p.yaw+=d*Math.min(1,dt*9);const k=Math.min(1,dt*14),t=now;
 if(p.poseT>0&&(p.poseT-=dt)<=0)p.pose=null;if(p.sayT>0)p.sayT-=dt;if(p.jump>0)p.jump-=dt;
 const sw=p.sit?0:Math.sin(t*(p.run?14:8.5))*.75*p.walk;let ll=sw,lr=-sw,al=-sw*.8,ar=sw*.8,az=.1,hx=0,y=0;const ps=p.jump>0?'jump':p.pose;
 if(p.sit){ll=lr=-1.5;al=ar=-.6;y=-3.5;}
 if(ps==='ears'){al=ar=-2.75;az=-.5;}else if(ps==='laugh'){al=ar=-1;az=-.55;y+=Math.abs(Math.sin(t*12))*.6;hx=-.3;}else if(ps==='point'){ar=-1.5+Math.sin(t*10)*.1;}
 else if(ps==='angry'){ar=-2.6+Math.sin(t*15)*.4;al=-sw*.8;}else if(ps==='clap'){al=ar=-1.25;az=-.45+Math.sin(t*18)*.22;}else if(ps==='cry'){al=ar=-2.35;az=-.62;hx=.3;}
 else if(ps==='jump'){al=ar=-2.9;az=.5;y+=Math.sin(Math.max(0,p.jump)*Math.PI/.6)*2.2*(p.sit?.5:1);}else if(ps==='doze'){hx=.38+Math.sin(t*.8)*.1;}else if(ps==='wave'){ar=-2.5+Math.sin(t*9)*.5;az=.1;}
 p.legL.rotation.x+=(ll-p.legL.rotation.x)*k;p.legR.rotation.x+=(lr-p.legR.rotation.x)*k;p.armL.rotation.x+=(al-p.armL.rotation.x)*k;p.armR.rotation.x+=(ar-p.armR.rotation.x)*k;p.armL.rotation.z+=(-az-p.armL.rotation.z)*k;p.armR.rotation.z+=(az-p.armR.rotation.z)*k;p.head.rotation.x+=(hx-p.head.rotation.x)*k;
 const s=p.h/16.5;p.g.position.set(p.x,(p.y+y)*s,p.z);p.g.rotation.y=p.yaw;
 if(p.sayT>0&&p.g.visible){_v.set(p.x,(p.sit?13.5:19)*s,p.z);const dc=_v.distanceTo(camera.position);_v.project(camera);if(_v.z<1&&dc<330&&Math.abs(_v.x)<1.1){p.b.style.display='block';p.b.style.left=((_v.x+1)*50)+'%';p.b.style.top=((1-_v.y)*50)+'%';}else p.b.style.display='none';}else p.b.style.display='none';}
/* 妈妈：平时在屋里骂，闹大了会拿着鸡毛掸子冲出来 */
const MOM=mkPerson({h:16.3,x:-10,z:-92,coat:0xa8325a,pants:0x2c2c36,skin:0xe8c0a0,hair:0x1c1612,bun:1,pitch:340,name:'妈妈'});
{MOM.st='in';MOM.g.visible=false;MOM.anger=0;MOM.stun=0;const d=new THREE.Group();d.position.set(0,-5.9,0);d.rotation.x=1.5;MOM.armR.add(d);mesh(d,CY(.12,.12,7,5),0x8a5a2a,0,3.5,0);for(let i=0;i<5;i++)mesh(d,SPH(.9,6,5),pk([0x8a4a2a,0xb8742a,0x5a3a22]),0,5+i*.8,0).scale.set(1,.6,1);}
function upset(n,line){const m=MOM;m.anger+=n;
 if(m.st==='in'){if(m.anger>=3){m.st='out';m.x=-10;m.z=-92;m.g.visible=true;m.t=10;m.burst=2.2;m.gave=false;sayP(m,pk(['小兔崽子！你给我站住！！','反了你了！看我不收拾你！','大过年的非逼我动手是吧！']),3);found('mom');later(1,()=>cz('mom'));GP.calm=3;}else if(line)yell(line,1);}
 else if(m.st==='out'){m.t=Math.max(m.t,6);if(line&&m.sayT<=0)sayP(m,pk(['还来？！','你还敢！！','看我追上你！']));}}
function updMom(dt){const m=MOM;if(m.st==='in'){m.anger=Math.max(0,m.anger-dt*.03);return;}const dP=Math.hypot(P.x-m.x,P.z-m.z);
 if(m.stun>0){m.stun-=dt;m.walk=0;}
 else if(m.st==='out'){m.t-=dt;m.burst-=dt;m.pose='angry';m.run=1;
  if(inYard(P.x,P.z)){walkTo(m,P.x,P.z,m.burst>0?42:32.5,dt);if(dP<5.5){m.st='caught';m.t=2.2;m.walk=0;sayP(m,'耳朵给我伸过来！！',2.2);found('ear');hand.lit=false;hand.fire=null;hand.charging=false;hand.busy=3.2;toast('被揪住耳朵了……手里的炮也被没收');later(.8,()=>cz('ear'));shake=.7;}}
  else{if(walkTo(m,0,84,32,dt)){m.yawT=Math.atan2(P.x-m.x,P.z-m.z);if(!m.gave){m.gave=true;sayP(m,pk(['有本事你今晚别回来吃饭！','跑！你再跑一个试试！']),3);}m.t-=dt*1.5;}}
  if(m.st==='out'&&m.t<=0){m.st='back';m.pose=null;sayP(m,pk(['再闹年夜饭别吃了！','等会儿再跟你算账。']));if(!inYard(P.x,P.z)||dP>50)found('escape');}}
 else if(m.st==='caught'){m.t-=dt;P.frozen=.15;const a=Math.atan2(-(m.x-P.x),-(m.z-P.z));let d=a-P.yaw;d=Math.atan2(Math.sin(d),Math.cos(d));P.yaw+=d*Math.min(1,dt*6);shake=Math.max(shake,.18);if(m.t<=0){m.st='back';m.pose=null;m.anger=0;sayP(m,'还放不放了？！回屋！');}}
 else if(m.st==='back'){m.run=0;if(walkTo(m,-10,-92,27,dt)){m.st='in';m.g.visible=false;m.anger=Math.min(m.anger,1);}}
 animP(m,dt);}
/* 爷爷：门口竹椅上打瞌睡，守着火盆 */
const GP=mkPerson({h:16,x:20,z:-88,yaw:.35,coat:0x3a4658,pants:0x3a3a3e,skin:0xd8b090,hair:0xd8d8d4,cap:0x4a4a50,pitch:150,name:'爷爷',sit:1});
{GP.cd=0;GP.calm=0;GP.zz=8;const c=LM(TX('wood',.3,.3),{color:0xe0c890}),g=new THREE.Group();g.position.set(20,0,-88);g.rotation.y=.35;scene.add(g);mesh(g,BX(6,.5,5.4),c,0,4,-.4);for(const x of[-2.6,2.6]){mesh(g,BX(.5,4,.5),c,x,2,2);mesh(g,BX(.5,10,.5),c,x,5,-2.8);}mesh(g,BX(6,3.2,.4),c,0,8,-2.8);g.traverse(m=>{if(m.isMesh)m.castShadow=true;});circs.push([20,-88,3.4]);
 add(CY(.7,.6,1.2,10),0xe8e4dc,26,3.9,-90);add(CY(1.4,1.4,3.4,8),0x7a5a36,26,1.7,-90,{name:'小凳'});}
function gpReact(big){const g=GP;if(g.cd>0&&!big)return;g.cd=7;g.jump=.6;g.pose=null;sayP(g,big?'我的火盆！！你这孩子——':pk(['哎哟！吓掉我半条命…','小兔崽子，去远点放！','我这茶都洒了一身…']),3);spray(V(26,5,-90),10,10);found('gp');}
/* 表哥：看热闹不嫌事大，会怂恿你，也会告状 */
const CZ=mkPerson({h:14.8,x:30,z:58,yaw:Math.PI,coat:0x2a62c8,pants:0x38466a,skin:0xe8c4a4,hair:0x16120e,pitch:230,name:'表哥'});
CZ.dareT=14;CZ.dare=null;CZ.dirty=false;
const DARES={lid:'路边那块圆铁板，你猜底下是什么？',vat:'水缸……算了，舅妈会杀了你的',dung:'田埂上那坨还冒着热气呢，嘿嘿',bamboo:'知道为什么叫"爆竹"吗？竹林边上有截竹筒',fish:'塘里有鱼。你懂我意思吧？',crack:'对面那家墙上有道缝……',hand:'你敢捏着数到三吗？',rb:'啤酒瓶除了装酒还能干嘛',cow:'村东头那头牛，胆子可小了',brazier:'爷爷那个火盆……算了当我没说',moto:'二叔的摩托有报警器，嘿嘿',meat:'屋檐下的腊肉，你够得着算你厉害',coop:'鸡笼里那只憋坏了吧',cover:'脸盆能飞多高，你知道吗',etjh:'二踢脚你敢拿手上放吗？我敢',logs:'那堆柴火码得真整齐啊……',scare:'菜地里那个假人的帽子不错'};
const SPECT=new Set(['cover','lid','vat','fish','bamboo','rb','rh','etj','mst','fount','bee','multi','chain','air','logs','coop','tree','water']);
function cz(ev){const c=CZ;if(Math.hypot(P.x-c.x,P.z-c.z)>260||c.st==='rev')return;const L={splat:['哈哈哈哈哈活该！！','笑死我了，一身都是！'],hand:['哈哈哈手麻了吧？','让你捏那么久～'],mom:['完了完了，舅妈出来了…','我可什么都没看见啊'],ear:['哈哈哈哈被揪耳朵了！！','疼不疼？哈哈哈哈'],dud:['哑炮～菜不菜啊'],big:['牛逼！！','卧槽，这也行？','再来一个再来一个！'],meat:['狗把腊肉叼走了哈哈哈哈'],cry:['你把妹妹弄哭了～你完了']}[ev];if(!L)return;sayP(c,pk(L));c.pose=ev==='big'?'clap':'laugh';c.poseT=2.4;}
function tattle(what){const c=CZ;if(MOM.st!=='in'||Math.hypot(P.x-c.x,P.z-c.z)>260||Math.random()>.6||c.st==='rev')return;later(1.6,()=>{if(MOM.st!=='in')return;sayP(c,'舅妈——！他把'+what+'！',3.2);c.pose='point';c.poseT=2.6;found('tattle');upset(1.6);});}
function onFound(k){const c=CZ;if(c.dare&&c.dare.k===k){c.dare=null;later(1.3,()=>{sayP(c,pk(['……你还真敢啊！','卧槽你来真的？！']));c.pose='clap';c.poseT=2;found('dare');});}else if(SPECT.has(k))later(.9,()=>cz('big'));}
function czDung(pos){const c=CZ;if(c.st==='rev'||Math.hypot(pos.x-c.x,pos.z-c.z)>40)return;c.st='rev';c.t=8;c.dare=null;sayP(c,'你完了！！你给我站住！！',3);found('czdung');for(let i=0;i<9;i++)mesh(c.g,SPH(rnd(.4,.9),6,5),0x4a3119,rnd(-2,2),rnd(6,15),rnd(.8,1.9)).scale.z=.3;}
function updCz(dt){const c=CZ,d=Math.hypot(P.x-c.x,P.z-c.z);c.run=0;
 if(c.st==='rev'){c.t-=dt;c.run=1;c.pose='angry';walkTo(c,P.x,P.z,38.5,dt);if(d<6.5){boom(V(P.x+rnd(-2,2),.4,P.z+rnd(-2,2)),.5,{quiet:1});sayP(c,'还你一个！哈哈哈哈');c.st='idle';c.pose='laugh';c.poseT=2;}else if(c.t<=0){c.st='idle';c.pose=null;sayP(c,'……算你跑得快');}}
 else{let danger=null;for(const k of crs)if((k.lit||k.act)&&Math.hypot(k.pos.x-c.x,k.pos.z-c.z)<22){danger=k;break;}
  if(danger){const a=Math.atan2(c.z-danger.pos.z,c.x-danger.pos.x);walkTo(c,c.x+Math.cos(a)*20,c.z+Math.sin(a)*20,36,dt);c.run=1;}
  else if(d>95||(c.follow&&d>55)){c.follow=true;walkTo(c,P.x,P.z,30,dt);}else{c.follow=false;c.walk=0;c.yawT=Math.atan2(P.x-c.x,P.z-c.z);}
  c.dareT-=dt;if(c.dareT<=0&&c.sayT<=0&&d<150&&MOM.st==='in'){c.dareT=rnd(34,50);const ks=Object.keys(DARES).filter(k=>!got.has(k));if(ks.length){const k=pk(ks);c.dare={k,t:160};sayP(c,DARES[k],4.6);c.pose='point';c.poseT=2;}}
  if(c.dare&&(c.dare.t-=dt)<=0)c.dare=null;}
 animP(c,dt);}
/* 堂妹：捂着耳朵看，胆子小，喜欢仙女棒 */
const MM=mkPerson({h:10.8,x:2,z:-76,yaw:.2,coat:0xe8507a,pants:0x6a5a8a,skin:0xf0cdb0,hair:0x1c1612,kid:1,pig:1,scarf:0xf4f0e8,pitch:520,name:'堂妹'});
MM.cry=0;MM.spark=0;MM.cd=0;MM.gcd=0;
function updMm(dt){const m=MM,d=Math.hypot(P.x-m.x,P.z-m.z);m.cd-=dt;m.gcd-=dt;m.run=0;
 if(m.cry>0){m.cry-=dt;m.pose='cry';m.run=1;walkTo(m,14,-84,24,dt);}
 else{let nl=hand.lit&&!hand.d.sparkler?d:999;for(const k of crs)if((k.lit&&!k.d.sparkler)||(k.act&&k.act.type!=='fount'))nl=Math.min(nl,Math.hypot(k.pos.x-m.x,k.pos.z-m.z));
  if(m.spark>0){m.spark-=dt;m.pose='wave';const hp=m.armR.localToWorld(V(0,-7.5,0));for(let i=0;i<2;i++){_v.set(rnd(-1,1),rnd(-1,1),rnd(-1,1)).normalize().multiplyScalar(rnd(3,12));addP(SPK,{x:hp.x,y:hp.y,z:hp.z,vx:_v.x,vy:_v.y,vz:_v.z,life:rnd(.15,.5),g:20,drag:2,s:rnd(.25,.5),sg:0,c:pk([[1,.95,.7],[1,.8,.4]]),a:1});}if(m.spark<=0){m.pose=null;sayP(m,'没了……还要！');}}
  else if(nl<85){m.pose='ears';if(m.cd<=0&&nl<60){m.cd=7;sayP(m,pk(['快扔呀快扔呀！','我不敢看……','要响了要响了！']),2);}}else if(m.pose==='ears')m.pose=null;
  if(hand.lit&&hand.d.sparkler&&d<30&&m.spark<=0&&m.gcd<=0){m.spark=9;m.gcd=24;sayP(m,pk(['哇！！给我玩给我玩！','好漂亮！我也要！']));found('gift');}
  if(inYard(P.x,P.z)&&d>75&&nl>60)walkTo(m,P.x,P.z,21,dt);else{m.walk=0;m.yawT=Math.atan2(P.x-m.x,P.z-m.z);}}
 animP(m,dt);}
reactors.push((pos,p,dP,o)=>{const far=(q,r)=>Math.hypot(pos.x-q.x,pos.z-q.z)>r;if(o&&o.str&&Math.random()<.8)return;
 if(!far(GP,70))gpReact(0);
 if(!far(MM,13+p*3)&&MM.cry<=0&&pos.y<30){MM.cry=4.5;MM.spark=0;sayP(MM,'哇——！！！',3);found('cry');upset(2,'把妹妹弄哭了是吧？！');later(1.6,()=>cz('cry'));}
 if(CZ.st!=='rev'&&!far(CZ,16+p*2)&&pos.y<30){CZ.jump=.5;if(CZ.sayT<=0)sayP(CZ,pk(['你有病啊！','往哪儿扔呢！！','差点炸到我！']),2);}
 if(MOM.st==='out'&&MOM.stun<=0&&!far(MOM,14)){MOM.stun=.9;MOM.jump=.6;MOM.t+=2;sayP(MOM,'哎哟！！你还敢往我脚边扔？！',2.4);found('tiger');}});
function updPeople(dt){for(let i=laters.length-1;i>=0;i--)if(laters[i].t<=now){const f=laters[i].f;laters.splice(i,1);f();}
 updMom(dt);updCz(dt);updMm(dt);const g=GP;g.cd-=dt;if(g.jump<=0&&g.pose!=='doze'&&g.sayT<=0)g.pose='doze';if(g.calm>0&&(g.calm-=dt)<=0&&MOM.st==='out'){sayP(g,'大过年的，别打孩子嘛……',3);MOM.t-=2.5;}
 if((g.zz-=dt)<=0){g.zz=rnd(16,30);if(g.pose==='doze'&&g.sayT<=0)sayP(g,'Zzz…',2.2,1);}animP(g,dt);}
