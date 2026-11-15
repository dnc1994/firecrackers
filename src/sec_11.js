/* ================= 主循环 ================= */
function resize(){const r=view.getBoundingClientRect();renderer.setSize(r.width,r.height,false);composer.setPixelRatio(renderer.getPixelRatio());composer.setSize(r.width,r.height);camera.aspect=r.width/r.height;camera.fov=camera.aspect<1?74:64;camera.updateProjectionMatrix();
 const sc=renderer.getPixelRatio()*r.height/(2*Math.tan(camera.fov*Math.PI/360));SPK.mat.uniforms.uScale.value=sc;SMK.mat.uniforms.uScale.value=sc;const port=camera.aspect<1;HX=port?Math.tan(camera.fov*Math.PI/360)*4.8*camera.aspect*.56:2.9;HY=port?-1.45:-2.8;}
addEventListener('resize',resize);
function updPlayer(dt){let mx=joy.x,mz=joy.y;if(P.frozen>0){P.frozen-=dt;mx=mz=0;keys.KeyW=keys.KeyS=keys.KeyA=keys.KeyD=false;}if(keys.KeyW||keys.ArrowUp)mz-=1;if(keys.KeyS||keys.ArrowDown)mz+=1;if(keys.KeyA)mx-=1;if(keys.KeyD)mx+=1;if(keys.ArrowLeft)P.yaw+=1.8*dt;if(keys.ArrowRight)P.yaw-=1.8*dt;
 const l=Math.hypot(mx,mz);if(l>1){mx/=l;mz/=l;}const s=Math.sin(P.yaw),c=Math.cos(P.yaw),sp=36;const tx=(mx*c+mz*s)*sp,tz=(-mx*s+mz*c)*sp;const k=Math.min(1,dt*10);P.vx+=(tx-P.vx)*k;P.vz+=(tz-P.vz)*k;
 let nx=P.x+P.vx*dt,nz=P.z+P.vz*dt;if(!blocked(nx,nz,2.2)){P.x=nx;P.z=nz;}else if(!blocked(nx,P.z,2.2)){P.x=nx;P.vz=0;}else if(!blocked(P.x,nz,2.2)){P.z=nz;P.vx=0;}else P.vx=P.vz=0;
 P.x=clp(P.x,-470,470);P.z=clp(P.z,-200,497);if(blocked(P.x,P.z,2.2)){out:for(let r=1;r<40;r+=1)for(let k=0;k<16;k++){const a=k/16*TAU,x=P.x+Math.cos(a)*r,z=P.z+Math.sin(a)*r;if(!blocked(x,z,2.3)){P.x=x;P.z=z;break out;}}}const v=Math.hypot(P.vx,P.vz);P.bob+=v*dt*.32;P.stepT-=v*dt;if(P.stepT<0&&v>6){P.stepT=11;SPt={g:1,pan:0,dl:0};S.step();}
 if(v>8)for(const q of props){if(q===carry||q.dead||now-q.kickT<.35)continue;const b=q.body;if(b.position.y<5&&Math.hypot(b.position.x-P.x,b.position.z-P.z)<2.4+(q.d.r||1.2)&&q.d.m<6){q.kickT=now;b.wakeUp();b.velocity.x+=P.vx*1.1;b.velocity.z+=P.vz*1.1;b.velocity.y+=9;b.angularVelocity.set(rnd(-6,6),rnd(-6,6),rnd(-6,6));if(q.k==='can')found('kick');}}
 camera.position.set(P.x,12.6+Math.sin(P.bob)*.22,P.z);camera.rotation.set(P.pitch,P.yaw,0);
 if(shake>.001){camera.position.x+=rnd(-1,1)*shake*.5;camera.position.y+=rnd(-1,1)*shake*.5;camera.rotation.z=rnd(-1,1)*shake*.03;shake*=Math.exp(-8*dt);}
 camera.updateMatrixWorld(true);sun.position.set(P.x,0,P.z).addScaledVector(SUND,420);sun.target.position.set(P.x,0,P.z);sky.position.copy(camera.position);}
function updHand(dt){if(hand.busy>0){hand.busy-=dt;}hand.lightA=Math.max(0,hand.lightA-dt);hand.throwA=Math.max(0,hand.throwA-dt);if(hand.charging)hand.ch=Math.min(.65,hand.ch+dt);
 const bobx=Math.sin(P.bob*.5)*.15,boby=Math.abs(Math.sin(P.bob))*.18,ch=hand.charging?hand.ch/.65:0,th=hand.throwA>0?Math.sin(hand.throwA/.22*Math.PI):0,low=hand.busy>.2?Math.min(1,(hand.busy-.2)*4):0;
 handR.position.set(HX+bobx,HY-boby+ch*1.1-low*3+th*.6,-4.8+ch*1.5-th*2.6);handR.rotation.set(-ch*.7+th*.6,0,-.12);
 const la=hand.lightA>0?Math.sin(clp(hand.lightA/.28,0,1)*Math.PI):0;handL.position.set(-HX*1.05-bobx+la*(HX*1.25),HY-.5-boby+la*.4,-4.8-la*(aim.cr&&!hand.lit?2.2:.2));handL.rotation.set(0,0,.1-la*.5);
 hm.visible=hand.busy<=.2;const f=hm.userData.fuse;if(f){const fr=hand.lit?clp(hand.t/hand.t0,0,1):1;f.scale.y=Math.max(.01,.75*fr);}
 if(hand.lit){hand.t-=dt;const tp=handTip();
  if(hand.d.sparkler){sparkle(tp);for(const o of crs)if(o.st==='placed'&&!o.lit&&!o.water&&o.pos.distanceToSquared(tp)<9&&lightCr(o))found('spark');let dy=P.yaw-hand.py;dy=Math.abs(Math.atan2(Math.sin(dy),Math.cos(dy)));hand.spin=hand.spin*Math.exp(-dt*.25)+dy;if(hand.spin>4.8)found('ring');}
  else{sparks(tp,1,4);if(Math.random()<.5)glow(tp,.7,.05,[1,.7,.3]);}if(hand.t<=0)handBoom();}else hand.spin=0;hand.py=P.yaw;
 if(hand.fire){const f=hand.fire;f.cd-=dt;if(f.cd<=0){f.cd=.55;f.n--;shootBall(handTip(),fwd().add(V(rnd(-.03,.03),.05,rnd(-.03,.03))).normalize());hand.throwA=.1;shake+=.06;if(f.n<=0){hand.fire=null;hand.busy=.7;found('mst');}}}
 if(Math.random()<.08){const tp=handL.userData.tip.getWorldPosition(V());addP(SMK,{x:tp.x,y:tp.y,z:tp.z,vx:rnd(-.3,.3),vy:2,vz:rnd(-.3,.3),life:1.2,g:-1,drag:1,s:.25,sg:.4,c:[.8,.8,.82],a:.3});}}
function updCarry(){if(!carry)return;if(carry.dead){carry=null;return;}const f=fwd(),b=carry.body,t=camera.position.clone().addScaledVector(f,8+(carry.d.r||1.5)).add(V(0,-2.6,0));if(t.y<(carry.d.h||2)/2+.2)t.y=(carry.d.h||2)/2+.2;
 _c1.set((t.x-b.position.x)*15,(t.y-b.position.y)*15,(t.z-b.position.z)*15);const s=_c1.length();if(s>130)_c1.scale(130/s,_c1);b.velocity.copy(_c1);b.angularVelocity.scale(.8,b.angularVelocity);b.wakeUp();}
const DESK=matchMedia('(hover:hover) and (pointer:fine)').matches,KEYS=DESK?{a:'空格',b:'Q',c:'E'}:{a:'🔥',b:'👇',c:'✋'};
function updUI(){const T=placeTarget(),h=aim.hit,t=h&&h.object.userData.t,cr=aim.cr,canL=cr&&!cr.lit&&!cr.dud&&cr.d.fuse&&!cr.act,q=(t&&t.prop)||aim.near,lines=[];
 const name=cr?cr.d.n+(cr.lit?'（着了！）':cr.dud?'（哑了）':''):t&&t.name!=='地上'?t.name:q?q.d.n:'';
 const touch=hand.lit&&hand.d.sparkler&&canL,sa=hand.fire?'打着呢':touch?'用它点':hand.lit?(hand.charging?'松手扔':'扔'):hand.d.snap?'摔':canL?'点它':hand.d.sparkler?'点着':'点手里的';
 const sb=T?T.label:'',sc=carry?(cr&&carry.d.cover?'扣上去':h?'放下':'扔出去'):q?'拿'+q.d.n:'';
 if(!hand.fire)lines.push(`<b>${KEYS.a}</b>${hand.lit&&!hand.charging&&!touch?'扔（按住蓄力）':sa}`);if(sb&&!hand.fire)lines.push(`<b>${KEYS.b}</b>${sb}`);if(sc)lines.push(`<b>${KEYS.c}</b>${sc}`);
 $('#cross').classList.toggle('on',!!(h||cr));$('#ctxn').textContent=name;$('#ctxa').innerHTML=lines.join('　');
 const A=$('#btnA');A.children[0].textContent=hand.lit&&!touch?'🤾':'🔥';A.children[1].textContent=sa;A.style.setProperty('--f',hand.lit?clp(hand.t/hand.t0,0,1):0);
 const B=$('#btnB');B.children[1].textContent=sb||'放不住';B.classList.toggle('off',!T);B.classList.toggle('hot',!!(T&&(T.slot||T.water)));
 const C=$('#btnC');C.children[1].textContent=sc||'拿';C.classList.toggle('off',!sc);}
let fwT=3,uiT=0,hiss=0;
function step(dt){now+=dt;updPlayer(dt);world.step(1/120,dt,4);while(pend.length)pend.shift()();
 for(const p of props){if(p.dead)continue;const b=p.body;p.g.position.copy(b.position);p.g.quaternion.copy(b.quaternion);if(b.position.y<-40)rmProp(p);}
 updCarry();updAim();updHand(dt);let nl=hand.lit?1:0,nd=hand.lit?4:999;
 for(let i=crs.length-1;i>=0;i--){const c=crs[i];updCr(c,dt);if(c.dead){crs.splice(i,1);continue;}if(c.lit||c.act){nl++;nd=Math.min(nd,c.pos.distanceTo(camera.position));}}
 if(AC&&hissG)hissG.gain.setTargetAtTime(nl?clp(1.2/Math.max(nd,4),.01,.09):0,AC.currentTime,.05);
 updChickens(dt,P.x,P.z);updDogCow(dt);updHay(dt);updThings(dt);updPeople(dt);updBalls(dt);
 for(const f of fishes){f.a+=f.s*dt;f.m.position.set(PX+Math.cos(f.a)*f.r,.42,PZ+Math.sin(f.a)*f.r);f.m.rotation.y=-f.a+(f.s>0?0:Math.PI)+Math.PI/2;}
 for(const f of floaters)f.position.y=.5+Math.sin(now*2+f.position.x)*.08;
 for(const r of ripples){if(r.t>0){r.t-=dt*.8;const k=1-r.t;r.m.scale.setScalar(1+k*r.max);r.m.material.opacity=Math.max(0,r.t)*.7;}}
 quiltSw*=Math.exp(-1.5*dt);quilt.rotation.x=Math.sin(now*9)*quiltSw*.35+Math.sin(now*1.1)*.02;
 for(const f of FL){if(f.t>0){f.t-=dt;f.l.intensity=f.I*Math.pow(Math.max(0,f.t/f.t0),2);}else f.l.intensity=0;}
 fwT-=dt;if(fwT<=0){fwT=rnd(2,6);const a=rnd(0,TAU),p=V(P.x+Math.cos(a)*rnd(900,1300),rnd(300,520),P.z+Math.sin(a)*rnd(900,1300)),col=new THREE.Color().setHSL(Math.random(),1,.6);for(let i=0;i<60;i++){_v.set(rnd(-1,1),rnd(-1,1),rnd(-1,1)).normalize().multiplyScalar(rnd(60,90));addP(SPK,{x:p.x,y:p.y,z:p.z,vx:_v.x,vy:_v.y,vz:_v.z,life:rnd(1.2,2),g:20,drag:1,s:rnd(9,14),sg:0,c:[col.r,col.g,col.b],a:1});}at(p);nz(0,.6,'lowpass',380,120,.7,.5,.01,1);at(null);}
 for(const s of smokers)if(Math.random()<dt*5)addP(SMK,{x:s.x+rnd(-1,1),y:s.y,z:s.z+rnd(-1,1),vx:rnd(2,5),vy:rnd(6,11),vz:rnd(-1,1),life:rnd(5,9),g:-.6,drag:.25,s:rnd(4,7),sg:rnd(3,5),c:[.8,.78,.8],a:.2});
 for(const l of lanterns){l.sw*=Math.exp(-1.2*dt);l.g.rotation.z=Math.sin(now*1.4+l.ph)*.05+Math.sin(now*8+l.ph)*l.sw*.4;}
 updP(SPK,dt);updP(SMK,dt);updI(BITS,dt,true);updI(LUMP,dt,false);
 if(yellT>0&&(yellT-=dt)<=0)$('#yell').style.opacity=0;if(toastT>0&&(toastT-=dt)<=0)$('#toast').style.opacity=0;
 uiT-=dt;if(uiT<=0){uiT=.08;updUI();}}
const clock=new THREE.Clock();
let pfN=0,pfT=0,pfStage=0;
function frame(){const raw=clock.getDelta(),dt=Math.min(.04,raw);step(dt);grade.uniforms.uT.value=now;sky.material.uniforms.uT.value=now;if(usePost)composer.render();else renderer.render(scene,camera);
 if(pfStage<2&&now>2){pfN++;pfT+=raw;if(pfN>=80){const slow=pfT/pfN>1/31;pfN=pfT=0;if(!slow)pfStage=2;else if(pfStage===0){pfStage=1;usePost=false;renderer.setPixelRatio(Math.min(1.25,devicePixelRatio||1));resize();}else{pfStage=2;renderer.setPixelRatio(1);renderer.shadowMap.enabled=false;sun.castShadow=false;scene.traverse(o=>{if(o.material)o.material.needsUpdate=true;});resize();}}}
 requestAnimationFrame(frame);}
{const pk0=0;setHand('xb');resize();const gb=$('#go');gb.disabled=false;gb.style.opacity=1;gb.textContent='出 门 放 炮';window.__load=performance.now();camera.position.set(P.x,12.6,P.z);for(let i=0;i<20;i++)world.step(1/120);requestAnimationFrame(frame);}
window.__t={MOM,CZ,MM,GP,MOTO,SCR,COOP,ducks,balls,upset,found,FOUND,people,MEATS,BRZ,selIdx,get post(){return usePost},V,placeTarget,igniteHay,mkProp,updAim,lidHome,crackS,tubeS,LIDP,pickAim:()=>aim,P,hand,aim,crs,props,chickens,got,CD,step,place,pickC,aDown,aUp,setHand,mkCr,lightCr,boom,goBoom,castRay,camera,VAT,HAY,COW,DOG,TREE,get carry(){return carry},get bangs(){return bangs}};
