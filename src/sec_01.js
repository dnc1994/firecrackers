/* ================= 物理 ================= */
const world=new CANNON.World({gravity:new CANNON.Vec3(0,-G,0)});world.allowSleep=true;world.broadphase=new CANNON.SAPBroadphase(world);world.solver.iterations=8;
world.defaultContactMaterial.friction=.5;world.defaultContactMaterial.restitution=.22;
const groundB=new CANNON.Body({type:CANNON.Body.STATIC,shape:new CANNON.Plane()});groundB.quaternion.setFromEuler(-Math.PI/2,0,0);groundB.updateAABB();world.addBody(groundB);
const rects=[],circs=[];
function sBox(x,y,z,w,h,d,name,col,o){const me=add(BX(w,h,d),col,x,y,z,Object.assign({name},o));const b=new CANNON.Body({type:CANNON.Body.STATIC,shape:new CANNON.Box(new CANNON.Vec3(w/2,h/2,d/2))});b.position.set(x,y,z);b.updateAABB();world.addBody(b);if(y+h/2>4)rects.push([x-w/2,x+w/2,z-d/2,z+d/2]);me.userData.body=b;return me;}
function sCyl(x,y,z,r,h,name,col,o){const me=add(CY(r,r,h,16),col,x,y,z,Object.assign({name},o));const b=new CANNON.Body({type:CANNON.Body.STATIC,shape:new CANNON.Cylinder(r,r,h,12)});b.position.set(x,y,z);b.updateAABB();world.addBody(b);circs.push([x,z,r]);me.userData.body=b;return me;}
function blocked(x,z,r){for(const a of rects)if(x>a[0]-r&&x<a[1]+r&&z>a[2]-r&&z<a[3]+r)return true;for(const c of circs)if((x-c[0])**2+(z-c[1])**2<(c[2]+r)**2)return true;return false;}
const rres=new CANNON.RaycastResult(),rf=new CANNON.Vec3(),rt=new CANNON.Vec3();
function castRay(a,b){rf.set(a.x,a.y,a.z);rt.set(b.x,b.y,b.z);rres.reset();world.raycastClosest(rf,rt,{skipBackfaces:true},rres);if(!rres.hasHit)return null;const p=rres.hitPointWorld,n=rres.hitNormalWorld;return{pt:V(p.x,p.y,p.z),n:V(n.x,n.y,n.z),body:rres.body};}
const upOf=b=>b.quaternion.vmult(new CANNON.Vec3(0,1,0));
