/* ================= 世界 ================= */
const PX=-125,PZ=235,PR=55,HAY={x:-85,z:52,burn:0,burnt:false},LIDP=V(62,.25,122);
const sm=t=>{t=clp(t,0,1);return t*t*(3-2*t);};
const lin=c=>[Math.pow(c[0]/255,2.2),Math.pow(c[1]/255,2.2),Math.pow(c[2]/255,2.2)];
/* 地形：后山、两侧的坡、南面一级级往下的冬田和远山 */
function hgt(x,z){const dn=Math.max(0,-218-z),ds=Math.max(0,z-512),dx=Math.max(0,Math.abs(x)-492),n=fbm(x*.0015+7,z*.0015+3,0,4),n2=fbm(x*.007,z*.007,0,3);
 let h=sm(dn/460)*(190+360*n)+sm(dn/80)*34*n2;
 h+=sm(dx/800)*(110+460*n)*(.3+.7*sm(dx/1600))+sm(dx/140)*14*n2;
 if(ds>0){h-=Math.min(40,Math.floor(ds/150+.6*n2)*7)*(1-sm(dx/500));h+=sm((ds-1500)/1200)*(300+560*n);}
 return h;}
{const N=150,SZ=9600,geo=new THREE.PlaneGeometry(SZ,SZ,N,N);geo.rotateX(-Math.PI/2);const p=geo.attributes.position,col=new Float32Array(p.count*3);
 for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i)+150,h=hgt(x,z);p.setY(i,h-.8);p.setZ(i,z);const n=fbm(x*.01,z*.01,0,3),n2=fbm(x*.03+5,z*.03,0,2);
  let c=h>6?mix3(mix3([34,58,38],[66,88,46],n),[98,106,56],Math.max(0,n2-.55)*1.6):h<-1.5?mix3(mix3([122,108,72],[98,102,70],n),[96,108,128],n2>.62?.7:0):mix3([120,110,68],[98,102,58],n);
  c=lin(c);col[i*3]=c[0];col[i*3+1]=c[1];col[i*3+2]=c[2];}
 geo.setAttribute('color',new THREE.BufferAttribute(col,3));geo.computeVertexNormals();scene.add(new THREE.Mesh(geo,new THREE.MeshLambertMaterial({vertexColors:true})));}
/* 地面：底层冬草 + 一块块叠上去的水泥地、土路、菜地、稻田 */
add(new THREE.PlaneGeometry(1010,750),LM(TX('grass',40,30)),0,0,135,{rx:-Math.PI/2,cast:false,name:'地上'});
const softMask=ctex(128,128,(g,w,h)=>{const im=g.createImageData(w,h);for(let y=0;y<h;y++)for(let x=0;x<w;x++){const e=Math.min(x,y,w-1-x,h-1-y)/w,a=clp((e-.02)*9+(fbm(x*.09,y*.09,0,3)-.5)*1.3,0,1)*255;const i=(y*w+x)*4;im.data[i]=im.data[i+1]=im.data[i+2]=a;im.data[i+3]=255;}g.putImageData(im,0,0);});softMask.colorSpace=THREE.NoColorSpace;
let zo=0;
function zone(x0,z0,x1,z1,k,rep,soft,tint){const w=x1-x0,d=z1-z0,mat=new THREE.MeshLambertMaterial({map:TX(k,w/rep,d/rep),transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1});if(soft)mat.alphaMap=softMask;if(tint)mat.color.set(tint);
 const m=add(new THREE.PlaneGeometry(w,d),mat,(x0+x1)/2,.012,(z0+z1)/2,{rx:-Math.PI/2,cast:false});m.renderOrder=-5+(zo+=.01);return m;}
zone(-320,60,-130,104,'dirt',34,1);zone(-36,150,36,172,'dirt',30,1);zone(-200,150,-60,186,'dirt',30,1);zone(120,255,340,420,'grass',30,1,0x9aa070);
zone(-505,96,505,154,'concrete',52,0,0xd8d2c6);zone(-112,-102,112,96,'concrete',44);zone(128,-62,274,98,'concrete',44,0,0xe6e2da);zone(282,84,392,98,'concrete',44);zone(-22,90,22,100,'concrete',44);
zone(-48,163,121,311,'soil',26,1);zone(-70,322,144,505,'paddy',46,1);zone(152,424,470,505,'paddy',46,1);zone(-470,300,-196,505,'paddy',46,1,0x8f9aa8);zone(292,166,470,412,'paddy',46,1);zone(-470,160,-310,292,'paddy',46,1);
/* 田埂 */
{const rm=LM(TX('grass',6,1),{color:0xa8a070});const R=(x0,z0,x1,z1)=>{const w=Math.abs(x1-x0)||3,d=Math.abs(z1-z0)||3;add(BX(w,1.3,d),rm,(x0+x1)/2,.5,(z0+z1)/2);};
 [[-70,322,144,322],[-70,505,144,505],[-70,322,-70,505],[144,322,144,505],[38,322,38,505],[152,424,470,424],[292,166,292,412],[292,166,470,166],[292,290,470,290],[-196,300,-196,505],[-470,300,-196,300],[-330,300,-330,505],[-310,160,-310,292],[-470,160,-310,160]].forEach(a=>R(...a));}
/* 房子 */
const LIAN=[['爆竹一声除旧岁','桃符万户更新春','辞旧迎新'],['天增岁月人增寿','春满乾坤福满门','四季平安'],['一帆风顺年年好','万事如意步步高','吉星高照'],['迎新春事事如意','接鸿福步步高升','好事临门']];
function facade(w,h,style,o={}){const S=6,W=Math.round(w*S),H=Math.round(h*S),c=document.createElement('canvas'),e=document.createElement('canvas');c.width=e.width=W;c.height=e.height=H;const g=c.getContext('2d'),ge=e.getContext('2d');
 ge.fillStyle='#000';ge.fillRect(0,0,W,H);
 if(style==='new'||style==='shop'){g.fillStyle=g.createPattern(C.wtile,'repeat');g.fillRect(0,0,W,H);g.fillStyle='rgba(120,110,90,.10)';for(let i=0;i<40;i++)g.fillRect(rnd(0,W),0,rnd(2,7),rnd(H*.2,H));}
 else{const src=style==='mud'?C.mud:C.plaster;for(let x=0;x<W;x+=H*1.7)g.drawImage(src,x,0,H*1.7,H);}
 const X=u=>(u+w/2)*S,Y=u=>H-u*S,R=(ctx,x,y,ww,hh,col)=>{ctx.fillStyle=col;ctx.fillRect(X(x-ww/2),Y(y+hh),ww*S,hh*S);};
 const warm=(ctx,x,y,ww,hh)=>{const gr=ctx.createLinearGradient(0,Y(y+hh),0,Y(y));gr.addColorStop(0,'#ffe0a0');gr.addColorStop(1,'#ffb060');ctx.fillStyle=gr;ctx.fillRect(X(x-ww/2),Y(y+hh),ww*S,hh*S);};
 const win=(x,y,ww,hh,lit,bars)=>{R(g,x,y-.7,ww+2.6,hh+1.8,style==='new'?'#cfd4d4':'#4a2f1c');
  if(lit){warm(g,x,y,ww,hh);warm(ge,x,y,ww,hh);g.fillStyle=ge.fillStyle='rgba(150,60,40,.55)';const cw=ww*rnd(.15,.3)*S;for(const cx of[g,ge]){cx.fillStyle='rgba(150,60,40,.5)';cx.fillRect(X(x-ww/2),Y(y+hh),cw,hh*S);cx.fillRect(X(x+ww/2)-cw,Y(y+hh),cw,hh*S);}}
  else{const gr=g.createLinearGradient(0,Y(y+hh),0,Y(y));gr.addColorStop(0,'#55657c');gr.addColorStop(1,'#232c36');g.fillStyle=gr;g.fillRect(X(x-ww/2),Y(y+hh),ww*S,hh*S);}
  for(const cx of[g,ge]){cx.fillStyle=cx===g?(style==='new'?'#e8ecec':'#3a2416'):'#000';cx.fillRect(X(x)-1.5,Y(y+hh),3,hh*S);cx.fillRect(X(x-ww/2),Y(y+hh*.62),ww*S,3);if(bars)for(let b=1;b<8;b++)cx.fillRect(X(x-ww/2+ww*b/8),Y(y+hh),1,hh*S);}
  g.fillStyle='rgba(70,62,50,.22)';g.fillRect(X(x-ww/2)+rnd(0,ww*S*.6),Y(y-.7),rnd(4,10),rnd(20,60));};
 const lian=(x,dw,dh,L)=>{const sw=4.4;for(const[sx,txt]of[[x+dw/2+sw/2+1.2,L[0]],[x-dw/2-sw/2-1.2,L[1]]]){R(g,sx,1.5,sw,dh-2,'#b3141d');g.fillStyle='#ecc050';g.font='bold '+(sw*S*.8|0)+'px "Noto Serif SC","Songti SC","STSong",serif';g.textAlign='center';g.textBaseline='middle';const n=txt.length,st=(dh-3)*S/n;for(let i=0;i<n;i++)g.fillText(txt[i],X(sx),Y(dh-1)+st*(i+.5));}
  R(g,x,dh+1.2,dw*.8,4.2,'#b3141d');g.fillStyle='#ecc050';g.font='bold '+(3.4*S|0)+'px "Noto Serif SC","Songti SC",serif';g.fillText(L[2].split('').join(' '),X(x),Y(dh+3.3));};
 const fu=(x,y,s)=>{g.save();g.translate(X(x),Y(y));g.rotate(Math.PI/4);g.fillStyle='#c4141e';g.fillRect(-s*S/2,-s*S/2,s*S,s*S);g.rotate(Math.PI*3/4);g.fillStyle='#f0c450';g.font='bold '+(s*S*.72|0)+'px serif';g.textAlign='center';g.textBaseline='middle';g.fillText('福',0,2);g.restore();};
 const door=(x,kind,dw,dh)=>{const L=pk(LIAN);
  if(kind==='shop'){R(g,x,0,dw,dh,'#2a1c14');warm(g,x,0,dw-2,dh-1);warm(ge,x,0,dw-2,dh-1);for(let r=0;r<4;r++)for(let k=0;k<12;k++)for(const cx of[g,ge]){cx.fillStyle=cx===g?pk(['#d83a2a','#3a7ad8','#e8c030','#3aa860','#e87a30','#ffffff']):'rgba(0,0,0,.45)';cx.fillRect(X(x-dw/2+2+k*(dw-4)/12),Y(dh-4-r*5),(dw-4)/12*S-2,3.2*S);}
   R(g,x,dh+1,dw+10,6,'#b3141d');g.fillStyle='#ffe9a0';g.font='bold '+(4.4*S|0)+'px "Noto Sans SC","PingFang SC",sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('便 民 小 卖 部',X(x),Y(dh+4));return;}
  R(g,x,0,dw+2.4,dh+1.4,kind==='steel'?'#8a8f94':'#3a2416');
  if(kind==='steel'){const gr=g.createLinearGradient(X(x-dw/2),0,X(x+dw/2),0);gr.addColorStop(0,'#9aa0a6');gr.addColorStop(.5,'#d6dadd');gr.addColorStop(1,'#8c9298');g.fillStyle=gr;g.fillRect(X(x-dw/2),Y(dh),dw*S,dh*S);g.strokeStyle='#b89840';g.lineWidth=2;for(const s of[-1,1])g.strokeRect(X(x+s*dw/4-dw/4+1.2),Y(dh-1.5),(dw/2-2.4)*S,(dh-3)*S);}
  else{g.fillStyle=g.createPattern(C.wood,'repeat');g.fillRect(X(x-dw/2),Y(dh),dw*S,dh*S);g.fillStyle='rgba(30,16,8,.35)';g.fillRect(X(x-dw/2),Y(dh),dw*S,dh*S);g.fillStyle='#d4aa50';g.beginPath();g.arc(X(x-1.2),Y(dh*.5),4,0,TAU);g.arc(X(x+1.2),Y(dh*.5),4,0,TAU);g.fill();}
  g.fillStyle='#1c120c';g.fillRect(X(x)-1,Y(dh),2,dh*S);fu(x-dw/4,dh*.62,dw*.28);fu(x+dw/4,dh*.62,dw*.28);lian(x,dw,dh,o.lian||L);R(g,x,0,dw+6,1.2,'#8a8680');};
 const fh=o.fh||32;
 if(style==='shop'){door(o.doorX||0,'shop',w*.62,22);win(-w*.4,10,10,12,true,true);}
 else{door(o.doorX||0,style==='new'?'steel':'wood',style==='new'?22:16,style==='new'?26:24);
  if(!o.noWin)for(const sx of[-1,1]){const wx=(o.doorX||0)+sx*Math.min(w*.3,44);if(Math.abs(wx)<w/2-12)win(wx,11,style==='mud'?10:18,style==='mud'?9:13,Math.random()<.8,style==='new');}
  for(let f=1;f<(o.fl||1);f++){const y0=f*fh;R(g,0,y0-1.2,w,1.6,'#b8bcbc');R(g,0,y0+1.5,w-14,fh-9,'#343a42');const n=Math.max(2,Math.round(w/50));for(let k=0;k<n;k++)win(-w/2+16+(k+.5)*(w-32)/n,y0+4,k%2?16:10,k%2?12:19,Math.random()<.7,false);
   g.fillStyle='#c8cccc';g.fillRect(X(-w/2+7),Y(y0+10.5),(w-14)*S,3);for(let k=0;k<=(w-14)/2.5;k++)g.fillRect(X(-w/2+7+k*2.5),Y(y0+10.5),1.5,9*S);
   for(let k=0;k<5;k++)if(Math.random()<.6){g.fillStyle=pk(['#c8323c','#3a5aa8','#e8e0d0','#4a8a5a','#e0a030','#d880a0']);g.fillRect(X(-w/2+14+k*(w-28)/5),Y(y0+fh-9),rnd(5,9)*S,rnd(7,11)*S);}}}
 if(style!=='new'&&style!=='shop'){g.fillStyle='rgba(40,34,26,.5)';g.fillRect(X(w*.42),Y(20),4*S,5.5*S);g.fillStyle='#16110c';g.fillRect(X(w*.42)+2,0,1.5,Y(25.5));}
 const gr=g.createLinearGradient(0,0,0,H*.12);gr.addColorStop(0,'rgba(20,16,12,.55)');gr.addColorStop(1,'rgba(20,16,12,0)');g.fillStyle=gr;g.fillRect(0,0,W,H*.12);
 return{map:tex(c),emis:tex(e)};}
function gableGeo(w,d,rh){const g=new THREE.BufferGeometry(),x=w/2,z=d/2;g.setAttribute('position',new THREE.BufferAttribute(new Float32Array([-x,0,z,-x,0,-z,-x,rh,0,x,0,-z,x,0,z,x,rh,0]),3));g.setAttribute('uv',new THREE.BufferAttribute(new Float32Array([0,0,1,0,.5,.5,0,0,1,0,.5,.5]),2));g.setIndex([0,2,1,3,5,4]);g.computeVertexNormals();return g;}
const smokers=[],lanterns=[];
function lantern(x,y,z,s=1){const g=new THREE.Group();g.position.set(x,y,z);scene.add(g);const lm=new THREE.MeshBasicMaterial();lm.color.setRGB(2.4,.42,.16);
 const b=new THREE.Mesh(SPH(2.4*s,12,9),lm);b.scale.y=.86;b.position.y=-3.4*s;g.add(b);const gd=M(0xd8a840);for(const yy of[-1.4,-5.4]){const c=new THREE.Mesh(CY(.9*s,.9*s,.5*s,10),gd);c.position.y=yy*s;g.add(c);}
 const t=new THREE.Mesh(CY(.35*s,.1*s,2.4*s,6),M(0xe0a030));t.position.y=-6.8*s;g.add(t);const st=new THREE.Mesh(CY(.06,.06,1.4*s,4),M(0x221a14));st.position.y=-.6*s;g.add(st);halo(0,-3.4*s,0,13*s,0xff5a2a,.5,g);lanterns.push({g,ph:rnd(0,TAU),sw:0});return g;}
function house(o){const{x,z,w,d,fl=1,style='old',ry=0}=o,fh=o.fh||32,h=fl*fh+2,g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;scene.add(g);o.fl=fl;
 const F=facade(w,h,style,o),isN=style==='new'||style==='shop',sideK=isN||o.brick?'brick':style==='mud'?'mud':'plaster';
 const bc={color:0xd2c8c0},ms=LM(isN||o.brick?TX('brick',d/22,h/11):TX(sideK,d/55,1),isN||o.brick?bc:undefined),mb=LM(isN||o.brick?TX('brick',w/22,h/11):TX(sideK,w/55,1),isN||o.brick?bc:undefined),mt=M(0x8c8880),mf=new THREE.MeshLambertMaterial({map:F.map,emissiveMap:F.emis,emissive:0xffffff,emissiveIntensity:1.7});
 const body=new THREE.Mesh(BX(w,h,d),[ms,ms,mt,mt,mf,mb]);body.position.y=h/2;body.castShadow=body.receiveShadow=true;g.add(body);body.userData.t={name:o.name||'墙'};picks.push(body);
 if(isN){const sl=new THREE.Mesh(BX(w+4,2,d+4),M(0xa8a49c));sl.position.y=h+1;sl.castShadow=true;g.add(sl);for(const[px,pz,pw,pd]of[[0,d/2+1,w+4,1.4],[0,-d/2-1,w+4,1.4],[w/2+1,0,1.4,d+4],[-w/2-1,0,1.4,d+4]]){const p=new THREE.Mesh(BX(pw,6,pd),M(0xd8d4cc));p.position.set(px,h+4,pz);g.add(p);}
  if(style==='new'){const tk=new THREE.Mesh(CY(5,5,9,12),new THREE.MeshStandardMaterial({color:0xc8ccd0,metalness:.85,roughness:.3}));tk.position.set(w*.28,h+10,-d*.2);tk.castShadow=true;g.add(tk);const pn=new THREE.Mesh(BX(16,.6,10),M(0x1c2a44));pn.position.set(-w*.2,h+6.5,-d*.15);pn.rotation.x=.6;g.add(pn);const tb=new THREE.Mesh(CY(1.6,1.6,17,8),new THREE.MeshStandardMaterial({color:0xd0d4d8,metalness:.8,roughness:.3}));tb.rotation.z=Math.PI/2;tb.position.set(-w*.2,h+10,-d*.15-4.5);g.add(tb);
   const hut=new THREE.Mesh(BX(22,20,26),LM(TX('brick',1,2)));hut.position.set(w*.3,h+11,d*.15);hut.castShadow=true;g.add(hut);}}
 else{const rh=d*.3,ov=6,run=d/2+ov,L=Math.hypot(run,rh*run/(d/2)),a=Math.atan2(rh,d/2),rm=LM(TX('roof',(w+12)/16,L/20));
  for(const s of[1,-1]){const sl=new THREE.Mesh(BX(w+12,1.8,L),rm);sl.position.set(0,h+rh-(rh*run/(d/2))/2+.6,s*run/2);sl.rotation.x=s*a;sl.castShadow=true;sl.receiveShadow=true;g.add(sl);}
  const gb=new THREE.Mesh(gableGeo(w,d,rh),LM(TX(sideK==='brick'?'brick':sideK,1.2,.6),{side:THREE.DoubleSide}));gb.position.y=h;g.add(gb);const rd=new THREE.Mesh(BX(w+13,2.4,3.2),M(0x26262a));rd.position.y=h+rh+1.4;g.add(rd);
  if(o.smoke){const ch=new THREE.Mesh(BX(5,12,5),LM(TX('brick',.3,.6)));ch.position.set(w*.3,h+rh*.6+4,-d*.2);ch.castShadow=true;g.add(ch);smokers.push(ch.getWorldPosition(V()).add(V(0,7,0)));}}
 const sw=Math.abs(Math.sin(ry))>.5,cw=sw?d:w,cd=sw?w:d,b=new CANNON.Body({type:CANNON.Body.STATIC,shape:new CANNON.Box(new CANNON.Vec3(cw/2,h/2,cd/2))});b.position.set(x,h/2,z);b.updateAABB();world.addBody(b);rects.push([x-cw/2,x+cw/2,z-cd/2,z+cd/2]);
 g.updateMatrixWorld(true);return{g,h,at:(lx,ly,lz=0)=>g.localToWorld(V(lx,ly,d/2+lz))};}
/* 窗户（会碎） */
const windows=[];
function mkWindow(x,y,z,nz,own){add(BX(23,17,1.6),LM(TX('wood',.4,.3)),x,y,z,{cast:false});const pm=new THREE.MeshBasicMaterial();pm.color.setRGB(1.25,.84,.42);const pane=add(new THREE.PlaneGeometry(19.5,13.5),pm,x,y,z+nz*.9,{cast:false,name:'窗户',ry:nz<0?Math.PI:0});
 add(BX(.7,13.5,.4),0x4a2f1c,x,y,z+nz*1,{cast:false});add(BX(19.5,.7,.4),0x4a2f1c,x,y+2,z+nz*1,{cast:false});windows.push({pane,p:V(x,y,z),nz,ok:true,own,halo:halo(x,y,z+nz*3,34,0xffa040,.3)});}
/* 自家老屋 */
const HOME=house({x:-10,z:-140,w:160,d:80,style:'old',noWin:1,lian:LIAN[0],smoke:1});
mkWindow(-52,18,-100,1,true);mkWindow(32,18,-100,1,true);
sBox(-10,.6,-94,36,1.2,12,'台阶',LM(TX('stone',1.4,.5)));lantern(-30,33,-95);lantern(10,33,-95);
{const dl=new THREE.PointLight(0xff8a48,620,170,1.6);dl.position.set(-10,24,-84);scene.add(dl);}
/* 邻居：东边新盖的三层小洋楼、西边没人住的土坯老屋、对面一家、小卖部 */
house({x:200,z:-106,w:120,d:88,fl:3,style:'new'});lantern(176,30,-60);lantern(224,30,-60);
house({x:-222,z:-108,w:130,d:76,style:'mud',noWin:0});
house({x:200,z:208,w:140,d:90,style:'old',ry:Math.PI,noWin:1,doorX:-22,brick:1,smoke:1,name:'邻居家的墙'});mkWindow(176,18,163,-1,false);lantern(210,33,157,.9);lantern(234,33,157,.9);
house({x:336,z:48,w:92,d:72,style:'shop',fh:30});
house({x:-372,z:30,w:96,d:84,fl:2,style:'new'});
const crackS={kind:'crack',verb:'塞进墙缝',pos:V(148,6,162.6),n:2};
crackS.mesh=add(BX(1.1,7,.5),0x1a1512,148,6,162.85,{cast:false,name:'墙缝',t:{slot:crackS}});add(BX(.6,4,.5),0x1a1512,148.9,10.4,162.85,{cast:false,rz:.5});add(BX(6,11,.4),new THREE.MeshBasicMaterial({colorWrite:false,depthWrite:false}),148,7,162.6,{cast:false,name:'墙缝',t:{slot:crackS}});
/* 远处的人家 */
{const fm=[0,1,2].map(()=>{const F=facade(110,66,'new',{fl:2});return new THREE.MeshLambertMaterial({map:F.map,emissiveMap:F.emis,emissive:0xffffff,emissiveIntensity:1.7});}),om=[0,1].map(()=>{const F=facade(120,34,'old',{});return new THREE.MeshLambertMaterial({map:F.map,emissiveMap:F.emis,emissive:0xffffff,emissiveIntensity:1.7});}),bk=LM(TX('brick',4,4)),pl=LM(TX('plaster',2,1)),rf=LM(TX('roof',7,3));
 const spots=[[-640,-120],[-560,260],[-700,470],[560,-150],[640,190],[720,-40],[600,520],[-120,-330],[330,-300],[820,360],[-860,120],[420,640],[-380,680],[980,-200],[-1050,-240],[120,760],[-930,560],[1100,520]];
 for(const[x,z]of spots){const y=hgt(x,z)-.8,nw=Math.random()<.55,ry=Math.atan2(-x,150-z)+rnd(-.5,.5),g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=ry;scene.add(g);
  if(nw){const b=new THREE.Mesh(BX(110,66,80),[bk,bk,pl,pl,pk(fm),bk]);b.position.y=33;g.add(b);}else{const b=new THREE.Mesh(BX(120,34,70),[pl,pl,pl,pl,pk(om),pl]);b.position.y=17;g.add(b);for(const s of[1,-1]){const sl=new THREE.Mesh(BX(132,2,46),rf);sl.position.set(0,44,s*20);sl.rotation.x=s*.5;g.add(sl);}if(Math.random()<.6)smokers.push(V(x,y+56,z));}}}
/* 院墙、院门 */
{const wm=LM(TX('brick',9,.8)),cap=M(0xb8b2a6);const W=(x,z,w,d)=>{sBox(x,4.2,z,w,8.4,d,'墙头',LM(TX('plaster',Math.max(w,d)/40,1)));add(BX(w+1.2,.9,d+1.2),cap,x,8.85,z,{name:'墙头'});};
 W(-112,-4,4,196);W(112,-4,4,196);W(-68,94,92,4);W(68,94,92,4);
 for(const s of[-1,1]){sBox(s*23,10,94,6,20,6,'门柱',LM(TX('brick',.4,1.6)));add(BX(8,1.4,8),cap,s*23,20.7,94);lantern(s*23,30,97.5,.7);}
 const lm=ctex(48,256,(g,w,h)=>{g.fillStyle='#b3141d';g.fillRect(0,0,w,h);g.fillStyle='#ecc050';g.font='bold 34px "Noto Serif SC","Songti SC",serif';g.textAlign='center';g.textBaseline='middle';'出入平安'.split('').forEach((c,i)=>g.fillText(c,24,40+i*58));});for(const s of[-1,1])add(new THREE.PlaneGeometry(3.4,15),LM(lm),s*23,10.5,97.1,{cast:false});}
/* 屋后的石坎 */
sBox(0,7,-214,1000,14,6,'石坎',LM(TX('stone',34,.6)));
/* 水缸 */
const VAT={x:80,z:-72,r:6.6,h:8,wl:7.2,hp:2};
{const m=sCyl(VAT.x,VAT.h/2,VAT.z,VAT.r,VAT.h,'水缸',new THREE.MeshBasicMaterial({colorWrite:false,depthWrite:false}),{t:{water:'vat'},cast:false});VAT.mesh=m;VAT.body=m.userData.body;
 const prof=[[5.2,0],[6.2,1],[6.9,3.4],[6.8,5.6],[6.2,7.4],[6.7,8],[6.7,8.4],[5.7,8.4],[5.6,7.4],[6.1,5.6],[6.2,3.4],[5.5,1.2],[0,1]].map(a=>new THREE.Vector2(a[0],a[1]));
 const vm=new THREE.Mesh(new THREE.LatheGeometry(prof,28),new THREE.MeshStandardMaterial({color:0x5c3418,roughness:.28,metalness:.05,side:THREE.DoubleSide}));vm.position.set(VAT.x,0,VAT.z);vm.castShadow=vm.receiveShadow=true;scene.add(vm);
 VAT.water=add(new THREE.CircleGeometry(VAT.r-.6,24),new THREE.MeshStandardMaterial({color:0x24404a,roughness:.08,metalness:.3,transparent:true,opacity:.93}),VAT.x,VAT.wl,VAT.z,{rx:-Math.PI/2,cast:false,name:'水缸',t:{water:'vat'}});}
const inVatR=p=>(p.x-VAT.x)**2+(p.z-VAT.z)**2<(VAT.r-.4)**2,inPond=p=>(p.x-PX)**2+(p.z-PZ)**2<PR*PR;
/* 压水井 */
{sCyl(60,3,-90,1.6,6,'压水井',0x3a5a48);add(BX(.8,.8,9),0x3a5a48,60,7.4,-93,{rx:.5});add(CY(.7,.7,4,8),0x3a5a48,62.6,4.6,-90,{rz:Math.PI/2});add(CY(4,4.6,.8,14),LM(TX('concrete',.3,.3)),61,.4,-89,{cast:false});}
/* 池塘 */
add(new THREE.CircleGeometry(PR+3,40),0x2a3230,PX,.03,PZ,{rx:-Math.PI/2,cast:false});
const pondW=add(new THREE.CircleGeometry(PR,40),new THREE.MeshStandardMaterial({color:0x3c5258,roughness:.06,metalness:.55,transparent:true,opacity:.9}),PX,.35,PZ,{rx:-Math.PI/2,cast:false,name:'池塘',t:{water:'pond'}});
circs.push([PX,PZ,PR-4]);
{const sm0=LM(TX('stone',.4,.4));for(let i=0;i<40;i++){const a=i/40*TAU+rnd(-.04,.04),s=add(SPH(rnd(2,4.2),7,5),sm0,PX+Math.cos(a)*(PR+1.5),.5,PZ+Math.sin(a)*(PR+1.5));s.scale.y=.45;s.rotation.y=rnd(0,3);}add(BX(14,1.2,8),sm0,PX+PR-6,.7,PZ-18,{ry:.5,name:'洗衣石板'});}
const fishes=[];for(let i=0;i<6;i++){const f=add(SPH(1,8,5),0x151f20,PX,.42,PZ,{cast:false});f.scale.set(2.2,.1,.7);fishes.push({m:f,a:rnd(0,TAU),r:rnd(12,42),s:rnd(.25,.5)*pk([-1,1])});}
/* 草垛 */
const strawT=ctex(256,256,(g,w,h)=>{g.fillStyle='#b08c3c';g.fillRect(0,0,w,h);for(let i=0;i<2600;i++){g.strokeStyle=pk(['#d4b464','#8a6a2a','#e0c478','#6e5420','#c09a48']);g.lineWidth=rnd(.6,1.6);g.beginPath();const x=rnd(0,w),y=rnd(0,h);g.moveTo(x,y);g.lineTo(x+rnd(-5,5),y+rnd(10,26));g.stroke();}});strawT.wrapS=strawT.wrapT=THREE.RepeatWrapping;strawT.repeat.set(3,1);
const hayM=[sCyl(HAY.x,11,HAY.z,16,22,'草垛',LM(strawT),{t:{slot:{kind:'hay',verb:'塞进草垛'}}}),add(new THREE.ConeGeometry(18.5,17,18),LM(strawT),HAY.x,30,HAY.z)];add(CY(.5,.5,10,5),0x5a4630,HAY.x,40,HAY.z);
const hayL=new THREE.PointLight(0xff7a2a,0,260,1.5);hayL.position.set(HAY.x+10,24,HAY.z+14);scene.add(hayL);
/* 晾的被子 */
add(CY(.5,.6,19,6),0x6e5c44,34,9.5,8);add(CY(.5,.6,19,6),0x6e5c44,92,9.5,8);add(CY(.3,.3,60,5),0x8a9a58,63,18.6,8,{rz:Math.PI/2,cast:false});
const quilt=add(new THREE.PlaneGeometry(32,14,1,1),new THREE.MeshLambertMaterial({side:THREE.DoubleSide,map:ctex(256,128,(g,w,h)=>{g.fillStyle='#c22e38';g.fillRect(0,0,w,h);for(let i=0;i<26;i++){const x=rnd(0,w),y=rnd(0,h);g.fillStyle=pk(['#f4c8d0','#f0e070','#e87aa0']);for(let k=0;k<5;k++){g.beginPath();g.arc(x+Math.cos(k*1.256)*7,y+Math.sin(k*1.256)*7,5,0,TAU);g.fill();}g.fillStyle='#fff3c0';g.beginPath();g.arc(x,y,3,0,TAU);g.fill();}g.fillStyle='#3a8a5a';g.fillRect(0,0,w,10);g.fillRect(0,h-10,w,10);})}),63,11.4,8,{name:'被子'});let quiltSw=0,quiltHit=0;
/* 树 */
const blobG=[0,1,2].map(k=>{const g=new THREE.IcosahedronGeometry(1,1),p=g.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),s=.78+.44*hsh(Math.round(x*50)+k*91,Math.round(y*50+z*31));p.setXYZ(i,x*s,y*s*.82,z*s);}g.computeVertexNormals();return g;});
const GREENS=[0x2f4f2a,0x3a5e2e,0x466a32,0x34562c,0x52763a];
function tree(x,z,h,r,o={}){const cols=o.cols||GREENS,tr=add(CY(r*.07,r*.12,h,7),0x4e3c2a,x,h/2,z);for(let i=0;i<(o.n||6);i++){const a=rnd(0,TAU),d=i?rnd(.3,.8)*r:0,s=rnd(.5,.8)*r*(i?1:1.15);const b=add(pk(blobG),pk(cols),x+Math.cos(a)*d,h+rnd(-.25,.3)*r+(i?0:r*.25),z+Math.sin(a)*d,{cast:i<4});b.scale.setScalar(s);b.rotation.y=rnd(0,TAU);}return tr;}
const TREE={x:-72,z:-48,fruits:[]};sCyl(TREE.x,13,TREE.z,2.6,26,'树干',0x54422e);
{for(let i=0;i<8;i++){const a=rnd(0,TAU),d=i?rnd(6,15):0,b=add(pk(blobG),pk(GREENS),TREE.x+Math.cos(a)*d,40+rnd(-5,8),TREE.z+Math.sin(a)*d,i?{}:{name:'柚子树'});b.scale.setScalar(i?rnd(11,15):19);b.rotation.y=rnd(0,TAU);}
 const b=new CANNON.Body({type:CANNON.Body.STATIC,shape:new CANNON.Sphere(22)});b.position.set(TREE.x,42,TREE.z);b.updateAABB();world.addBody(b);
 for(let i=0;i<10;i++){const a=rnd(0,TAU),e=rnd(-.9,-.3),r=22.5;const p=V(TREE.x+Math.cos(a)*Math.cos(e)*r,42+Math.sin(e)*r,TREE.z+Math.sin(a)*Math.cos(e)*r);TREE.fruits.push({m:add(SPH(1.3,8,6),0xe8cf4a,p.x,p.y,p.z),p});}}
{tree(318,182,46,34,{n:9});circs.push([318,182,4]);add(BX(22,1.6,6),LM(TX('stone',.6,.2)),300,3,200,{ry:.4,name:'石凳'});add(BX(3,2.4,5),LM(TX('stone',.2,.2)),293,1.2,197,{ry:.4});add(BX(3,2.4,5),LM(TX('stone',.2,.2)),307,1.2,203,{ry:.4});
 tree(-300,-30,30,20);circs.push([-300,-30,2.5]);tree(-148,-178,34,22);tree(120,-190,30,20);tree(286,-170,38,24);tree(-430,120,34,22);tree(440,-60,36,24);tree(-60,-196,28,18,{cols:[0x5a7a36,0x6a8a3e,0x4a6a30]});
 for(let i=0;i<5;i++){const x=-196+rnd(-6,6),z=188+i*4;const l=add(new THREE.PlaneGeometry(5,20),M(pk([0x5a8a3c,0x4a7a34,0x6a9a44]),{side:THREE.DoubleSide}),x,12,z,{cast:true});l.rotation.set(rnd(-.9,.9),rnd(0,TAU),rnd(-.6,.6));}add(CY(1.4,1.8,12,7),0x7a8a4a,-196,6,196);}
/* 狗窝 */
sBox(90,5,46,15,10,17,'狗窝',LM(TX('wood',.5,.4)));add(BX(17,1.4,20),LM(TX('roof',.6,.6)),90,11.5,46,{rz:.18});add(BX(7,7,.6),0x120c08,90,3.5,37.3,{cast:false});
/* 竹林、竹筒 */
const tubeDir=V(.42,.9,.1).normalize(),tubeS={kind:'bamboo',verb:'塞进竹筒',pos:V(-218,0,196).addScaledVector(tubeDir,9.5),dir:tubeDir};
{const m=add(CY(1.7,1.9,10,10),0x7aa04e,-218+tubeDir.x*5,tubeDir.y*5,196+tubeDir.z*5,{name:'竹筒',t:{slot:tubeS}});m.quaternion.setFromUnitVectors(UP,tubeDir);add(new THREE.CircleGeometry(1.4,10),0x1c1a14,0,5.02,0,{parent:m,rx:-Math.PI/2,cast:false});circs.push([-218,196,2]);}
/* 成片的竹子和林子（实例化） */
{const stalk=new THREE.InstancedMesh(CY(.55,.8,1,6),M(0x5f8a40),260),plume=new THREE.InstancedMesh(blobG[0],new THREE.MeshLambertMaterial(),2100);let si=0,pi=0;stalk.castShadow=true;
 const put=(x,y,z,h,lean)=>{if(si<260){dum.position.set(x,y+h/2,z);dum.rotation.set(lean*rnd(-1,1),0,lean*rnd(-1,1));dum.scale.set(1,h,1);dum.updateMatrix();stalk.setMatrixAt(si++,dum.matrix);}};
 const blob=(x,y,z,sx,sy,col)=>{if(pi>=2100)return;dum.position.set(x,y,z);dum.rotation.set(0,rnd(0,TAU),0);dum.scale.set(sx,sy,sx);dum.updateMatrix();plume.setMatrixAt(pi,dum.matrix);_col.set(col);plume.setColorAt(pi++,_col);};
 const BAM=[0x5a8438,0x6a9442,0x4c7632,0x7aa24a],FOR=[0x26442a,0x30502e,0x3c5e32,0x2a4a30,0x466a36];
 for(let i=0;i<34;i++){const a=rnd(0,TAU),r=rnd(4,38),x=-262+Math.cos(a)*r,z=206+Math.sin(a)*r*.8,h=rnd(70,115);put(x,0,z,h,.07);for(let k=0;k<3;k++)blob(x+rnd(-9,9),h*rnd(.55,1),z+rnd(-9,9),rnd(8,13),rnd(4,7),pk(BAM));}
 for(let i=0;i<150;i++){const x=rnd(-640,640),z=rnd(-360,-222),y=hgt(x,z),h=rnd(70,120);put(x,y,z,h,.09);for(let k=0;k<3;k++)blob(x+rnd(-12,12),y+h*rnd(.5,1),z+rnd(-12,12),rnd(10,17),rnd(5,9),pk(BAM));}
 for(let i=0;i<70;i++){const s=pk([-1,1]),x=s*rnd(505,640),z=rnd(-200,480),y=hgt(x,z),h=rnd(60,110);put(x,y,z,h,.09);for(let k=0;k<2;k++)blob(x+rnd(-10,10),y+h*rnd(.5,1),z+rnd(-10,10),rnd(10,16),rnd(5,9),pk(BAM));}
 let tries=0;while(pi<2050&&tries++<20000){const a=rnd(0,TAU),r=rnd(560,3400),x=Math.cos(a)*r,z=150+Math.sin(a)*r,y=hgt(x,z);if(y<10)continue;const s=rnd(26,52)*(1+r/5000);blob(x,y+s*.5,z,s,s*rnd(.9,1.5),pk(z<-200&&r<1300?BAM.concat(FOR):FOR));}
 stalk.count=si;plume.count=pi;stalk.instanceMatrix.needsUpdate=true;plume.instanceMatrix.needsUpdate=true;plume.instanceColor.needsUpdate=true;stalk.frustumCulled=plume.frustumCulled=false;scene.add(stalk,plume);}
/* 草丛 */
{const gt=ctex(64,64,(g,w,h)=>{g.clearRect(0,0,w,h);for(let i=0;i<46;i++){g.strokeStyle=pk(['#8a8a48','#a89a58','#6e7a3c','#b8a868','#5c6a34']);g.lineWidth=rnd(1,2.4);const x=rnd(6,58);g.beginPath();g.moveTo(x,64);g.quadraticCurveTo(x+rnd(-6,6),rnd(24,44),x+rnd(-14,14),rnd(2,30));g.stroke();}});
 const geo=new THREE.BufferGeometry(),P=[],U=[],I=[];for(let k=0;k<2;k++){const c=Math.cos(k*Math.PI/2+.4),s=Math.sin(k*Math.PI/2+.4),b=P.length/3;P.push(-c,0,-s,c,0,s,c,2,s,-c,2,-s);U.push(0,0,1,0,1,1,0,1);I.push(b,b+1,b+2,b,b+2,b+3);}
 geo.setAttribute('position',new THREE.Float32BufferAttribute(P,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(U,2));geo.setIndex(I);geo.computeVertexNormals();
 const N=MOBILE?900:1600,im=new THREE.InstancedMesh(geo,new THREE.MeshLambertMaterial({map:gt,alphaTest:.35,side:THREE.DoubleSide}),N);im.frustumCulled=false;let n=0,tr=0;
 const hard=(x,z)=>(z>92&&z<158)||(Math.abs(x)<116&&z>-106&&z<98)||(x>124&&x<278&&z>-152&&z<100)||(x>280&&x<394&&z>8&&z<100)||inPond({x,z})||blocked(x,z,2)||(x>-50&&x<122&&z>160&&z<312);
 while(n<N&&tr++<30000){let x,z;const m=Math.random();if(m<.3){x=rnd(-500,500);z=pk([rnd(89,95),rnd(155,163)]);}else if(m<.42){const a=rnd(0,TAU);x=PX+Math.cos(a)*(PR+rnd(3,9));z=PZ+Math.sin(a)*(PR+rnd(3,9));}else{x=rnd(-500,500);z=rnd(-205,505);}
  if(m>=.3&&hard(x,z))continue;const s=rnd(1.6,3.6);dum.position.set(x,0,z);dum.rotation.set(0,rnd(0,TAU),0);dum.scale.set(s,s*rnd(.8,1.4),s);dum.updateMatrix();im.setMatrixAt(n,dum.matrix);_col.setHSL(rnd(.11,.2),rnd(.2,.4),rnd(.5,.75));im.setColorAt(n++,_col);}
 im.count=n;scene.add(im);}
/* 村道：电线杆、电线、路灯 */
{const pm=LM(TX('concrete',.1,2)),pts=[];for(const x of[-430,-230,-30,170,370]){add(CY(1.1,1.5,78,8),pm,x,39,158);add(BX(16,1,1),0x3a3a3a,x,72,158);add(BX(12,1,1),0x3a3a3a,x,66,158);circs.push([x,158,1.6]);pts.push(x);
  if(x===-30||x===370){add(CY(.3,.3,8,5),0x3a3a3a,x,60,154,{rx:Math.PI/2,cast:false});const b=new THREE.MeshBasicMaterial();b.color.setRGB(2.6,2,1.1);add(SPH(1,8,6),b,x,59.4,150,{cast:false});halo(x,59,150,40,0xffc070,.45);const l=new THREE.PointLight(0xffb060,1500,200,1.7);l.position.set(x,56,150);scene.add(l);}}
 const lmw=new THREE.LineBasicMaterial({color:0x14110e});for(let i=0;i<pts.length-1;i++)for(const[dy,dz]of[[72.5,-7],[72.5,7],[66.5,-5],[66.5,5]]){const a=[];for(let k=0;k<=12;k++){const t=k/12;a.push(V(pts[i]+(pts[i+1]-pts[i])*t,dy-Math.sin(t*Math.PI)*7,158+dz));}scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(a),lmw));}
}
/* 邻居院里：小车、石磨；小卖部门口的箱子 */
{const cm=new THREE.MeshStandardMaterial({color:0xb8bcc2,metalness:.7,roughness:.35}),gl=new THREE.MeshStandardMaterial({color:0x1c242c,metalness:.6,roughness:.15});
 sBox(236,4.6,52,19,6.4,44,'小车',cm);add(BX(17,5,24),gl,236,10,50);add(BX(18.4,1,25),cm,236,12.8,50);for(const[x,z]of[[227,38],[245,38],[227,66],[245,66]])add(CY(3.2,3.2,2.4,12),0x16161a,x,3.2,z,{rz:Math.PI/2});
 add(new THREE.PlaneGeometry(9,2.6),LM(ctex(128,36,(g,w,h)=>{g.fillStyle='#2a4ab8';g.fillRect(0,0,w,h);g.fillStyle='#fff';g.font='bold 24px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('粤B·6R8K2',64,19);})),236,4.4,74.1,{cast:false});
 sCyl(-196,3,40,7,6,'石磨',LM(TX('stone',1,.3)));add(CY(6,6,3,16),LM(TX('stone',1,.2)),-196,7.6,40);add(BX(1,1,12),0x5a4630,-196,8.4,47);
 for(let i=0;i<5;i++)add(BX(7,5,5),pk([0xd83a2a,0x3a6ab8,0x3a9a5a]),296+i%3*8,2.5+(i>2?5:0),92+(i%2),{name:'箱子'});add(BX(14,10,7),0xe8ecf0,376,5,92,{name:'冰柜'});}
/* 烂泥坑、化粪池口 */
add(new THREE.CircleGeometry(11,16),new THREE.MeshStandardMaterial({color:0x33261a,roughness:.25,metalness:.1}),-52,.12,124,{rx:-Math.PI/2,cast:false,name:'烂泥',t:{slot:{kind:'mud',verb:'插进烂泥'}}}).scale.y=.7;
add(new THREE.RingGeometry(3.3,4.8,18),LM(TX('concrete',.3,.3)),LIDP.x,.08,LIDP.z,{rx:-Math.PI/2,cast:false});add(new THREE.CircleGeometry(3.3,16),0x0a0806,LIDP.x,.06,LIDP.z,{rx:-Math.PI/2,cast:false});
/* 菜园的竹篱笆 */
{const fm=M(0xa89858),sticks=new THREE.InstancedMesh(CY(.22,.22,1,4),fm,420);let n=0;const S=(x,z)=>{if(n>=420)return;const h=rnd(6.5,8.5);dum.position.set(x+rnd(-.2,.2),h/2,z+rnd(-.2,.2));dum.rotation.set(rnd(-.08,.08),0,rnd(-.08,.08));dum.scale.set(1,h,1);dum.updateMatrix();sticks.setMatrixAt(n++,dum.matrix);};
 for(let x=-48;x<=121;x+=1.7){if(Math.abs(x-30)>9)S(x,163);S(x,311);}for(let z=163;z<=311;z+=1.7){S(-48,z);S(121,z);}sticks.count=n;sticks.castShadow=true;scene.add(sticks);
 for(const[x0,z0,x1,z1]of[[-48,163,21,163],[39,163,121,163],[-48,311,121,311],[-48,163,-48,311],[121,163,121,311]])for(const y of[2.4,5.6])add(BX(Math.abs(x1-x0)||.4,.4,Math.abs(z1-z0)||.4),fm,(x0+x1)/2,y,(z0+z1)/2,{cast:false});}
/* 牛粪 */
function mkDung(x,z){const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);const s={kind:'dung',verb:'插进牛粪',pos:V(x,.7,z),mesh:g};
 [[2.2,.5,2,0,.3,0,0x46301a],[1.5,.45,1.4,-.2,.7,.1,0x574020],[.8,.35,.8,.15,1.05,-.1,0x46301a]].forEach(a=>{const m=add(SPH(1,10,7),a[6],a[3],a[4],a[5],{parent:g,name:'牛粪',t:{slot:s}});m.scale.set(a[0],a[1],a[2]);});return s;}
[[22,128],[-92,136],[124,116],[60,202],[8,262],[96,238],[156,300],[210,336],[-8,112],[-250,130],[300,140]].forEach(a=>mkDung(a[0],a[1]));
/* 门口放过开门炮：一地红纸 */
for(let i=0;i<260;i++){const nearDoor=i<170,x=nearDoor?-10+rnd(-1,1)*rnd(0,34):rnd(-1,1)*rnd(0,30),z=nearDoor?-86+rnd(0,1)*rnd(0,40):104+rnd(-1,1)*rnd(0,22);spawnI(BITS,{x,y:.1,z,vx:0,vy:-1,vz:0,rx:0,ry:rnd(0,TAU),wx:0,wy:0,ph:0,col:pk(PCOL),s:rnd(.7,1.3),fl:0,fy:rnd(.03,.1)});}
