/* ================= 能搬能炸的东西 ================= */
const mesh=(g,geo,m,x=0,y=0,z=0)=>{const me=new THREE.Mesh(geo,typeof m==='number'?M(m):m);me.position.set(x,y,z);g.add(me);return me;};
const PD={
 bowl:{n:'塑料盆',r:1.6,rt:1.1,h:1,m:.3,cover:1,snd:'plastic',mk(g){const c=pk([0xd9444c,0x3d9a6a,0xe0a33a,0x4a78c9,0xe86fa0]);mesh(g,CY(1.1,1.6,1,16,true),M(c,{side:THREE.DoubleSide}));mesh(g,new THREE.CircleGeometry(1.1,16),M(c,{side:THREE.DoubleSide}),0,.5,0).rotation.x=-Math.PI/2;}},
 can:{n:'铁罐',r:.65,h:1.2,m:.4,cover:1,snd:'metal',mk(g){mesh(g,CY(.65,.65,1.2,12),0xa8adb4);mesh(g,CY(.67,.67,.7,12),0xc82e2a);}},
 bucket:{n:'铁桶',r:1.6,rt:1.3,h:2.7,m:1.1,cover:1,snd:'metal',mk(g){mesh(g,CY(1.3,1.6,2.7,14,true),M(0x8d939a,{side:THREE.DoubleSide}));mesh(g,new THREE.CircleGeometry(1.3,14),M(0x7a8088,{side:THREE.DoubleSide}),0,1.35,0).rotation.x=-Math.PI/2;}},
 brick:{n:'砖头',s:[2.4,.6,1.15],m:3,snd:'stone',mk(g){mesh(g,BX(2.4,.6,1.15),pk([0x9c4a2f,0xa5553a,0x8f4329]));}},
 bottle:{n:'啤酒瓶',r:.38,h:2.5,m:.6,glass:1,slot:1,mk(g){const m=M(0x2e8a40,{transparent:true,opacity:.72});mesh(g,CY(.38,.38,1.6,10),m,0,-.45,0);mesh(g,CY(.14,.36,.9,10),m,0,.8,0);mesh(g,CY(.39,.39,.6,10),0xe8e0c8,0,-.5,0);}},
 cabbage:{n:'大白菜',sph:1,r:1.4,m:1.4,veg:1,slot:1,mk(g){mesh(g,SPH(1.4,9,7),0xdfe8c0).scale.set(.85,1.05,.85);for(let i=0;i<5;i++){const a=i/5*TAU,l=mesh(g,SPH(1.1,7,5),pk([0x6aa84a,0x7ab856,0x5c9a40]),Math.cos(a)*.75,-.25,Math.sin(a)*.75);l.scale.set(.75,1,.35);l.rotation.y=-a+Math.PI/2;}}},
 pomelo:{n:'柚子',sph:1,r:1.3,m:1,fruit:1,mk(g){mesh(g,SPH(1.3,10,8),0xe8cf4a);}},
 stool:{n:'小板凳',s:[3.4,2.2,2.2],m:1.4,snd:'wood',mk(g){mesh(g,BX(3.4,.35,2.2),0x8a6a42,0,.92,0);for(const[x,z]of[[-1.4,-.8],[1.4,-.8],[-1.4,.8],[1.4,.8]])mesh(g,BX(.35,1.9,.35),0x7a5c38,x,-.15,z);}},
 ball:{n:'皮球',sph:1,r:1.15,m:.3,mk(g){mesh(g,SPH(1.15,12,9),0xd84a3a);mesh(g,new THREE.TorusGeometry(1.16,.07,4,20),0xf4f0e0);}},
 lid:{n:'井盖',r:3.5,h:.5,m:11,snd:'metal',slot:1,mk(g){mesh(g,CY(3.5,3.5,.5,18),0x3c3c40);mesh(g,BX(4.4,.12,.5),0x2a2a2e,0,.27,0);mesh(g,BX(.5,.12,4.4),0x2a2a2e,0,.27,0);}},
};
const props=[];let carry=null;
function mkProp(k,x,y,z,sleep){const d=PD[k],g=new THREE.Group();d.mk(g);scene.add(g);
 const shape=d.s?new CANNON.Box(new CANNON.Vec3(d.s[0]/2,d.s[1]/2,d.s[2]/2)):d.sph?new CANNON.Sphere(d.r):new CANNON.Cylinder(d.rt||d.r,d.r,d.h,10);
 const body=new CANNON.Body({mass:d.m,shape,linearDamping:.06,angularDamping:d.sph?.5:.25,sleepSpeedLimit:1.2,sleepTimeLimit:.6});body.position.set(x,y,z);
 const p={k,d,body,g,dead:false,snd:0,kickT:0};const t={name:d.n,prop:p};g.traverse(m=>{if(m.isMesh){m.castShadow=true;m.userData.t=t;picks.push(m);}});
 body.p=p;body.updateAABB();world.addBody(body);if(sleep)body.sleep();props.push(p);
 body.addEventListener('collide',e=>{const v=Math.abs(e.contact.getImpactVelocityAlongNormal());if(v>9&&now-p.snd>.15){p.snd=now;const pos=V(body.position.x,body.position.y,body.position.z);pend.push(()=>{at(pos);if(d.snd==='metal')S.clang(v/160);else S.thud(v/110);at(null);if(d.glass&&v>52&&!p.dead)shatter(p);});}});
 g.position.set(x,y,z);return p;}
const pend=[];
function rmProp(p){if(p.dead)return;p.dead=true;world.removeBody(p.body);scene.remove(p.g);picks=picks.filter(m=>!(m.userData.t&&m.userData.t.prop===p));if(carry===p)carry=null;}
const ppos=p=>V(p.body.position.x,p.body.position.y,p.body.position.z);
function shatter(p){const pos=ppos(p);at(pos);S.glass();at(null);bits(pos,26,20,[0x7ac88a,0xb4e6b4,0x4e9a5a],.7,0);rmProp(p);found('bottle');if(Math.random()<.5)upset(.3,'玻璃碴子给我扫干净！');}
function shred(p){const pos=ppos(p);at(pos);S.splat();at(null);bits(pos,46,26,[0x6aa84a,0x7ab856,0xdfe8c0,0xeef4d8,0x5c9a40],1.5,1);lumps(pos,10,18,[0xdfe8c0,0xeef4d8],.8);rmProp(p);found('cabbage');if(Math.random()<.4)upset(.5,'那是过年包饺子的白菜！');}
function burstF(p){const pos=ppos(p);at(pos);S.splat();at(null);lumps(pos,22,22,[0xf2c0b0,0xf4d8c8,0xe8cf4a],.7,0xe8b8a8);rmProp(p);}
{const S0=true;
 [[70,-55],[65,-48],[75,-46]].forEach(a=>mkProp('bowl',a[0],.5,a[1],S0));[[92,-62],[60,-82]].forEach(a=>mkProp('bucket',a[0],1.35,a[1],S0));
 [[-36,74],[-33,71],[-38,70],[-34,77],[14,84],[30,60]].forEach(a=>mkProp('can',a[0],.6,a[1],S0));
 for(let l=0;l<3;l++)for(let i=0;i<2;i++)for(let j=0;j<2;j++)mkProp('brick',100+i*2.6,.3+l*.62,-30+j*1.3,S0);for(let i=0;i<4;i++)mkProp('brick',96+rnd(-3,3),.3,-22+i*2.5,S0);
 for(let i=0;i<2;i++)for(let j=0;j<3;j++)mkProp('bottle',-38+i*1.3,1.25,-93+j*1.3,S0);mkProp('bottle',40,1.25,-70,S0);mkProp('bottle',-20,1.25,64,S0);mkProp('bottle',-100,1.25,-20,S0);
 mkProp('stool',2,1.1,-84,S0);mkProp('stool',-26,1.1,-82,S0);mkProp('ball',12,1.15,26,S0);
 for(let i=0;i<5;i++)for(let j=0;j<4;j++)mkProp('cabbage',-30+i*26+rnd(-2,2),1.4,182+j*30+rnd(-2,2),S0);
 mkProp('lid',LIDP.x,.25,LIDP.z,S0);mkProp('bowl',196,.5,168,S0);mkProp('bucket',-80,1.35,170,S0);mkProp('can',-200,.6,128,S0);}
const lidHome=q=>!q.dead&&Math.hypot(q.body.position.x-LIDP.x,q.body.position.z-LIDP.z)<2.5&&q.body.position.y<1;
