
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
const $=s=>document.querySelector(s);
const TAU=Math.PI*2,G=98,rnd=(a,b)=>a+Math.random()*(b-a),clp=(v,a,b)=>v<a?a:v>b?b:v,pk=a=>a[Math.random()*a.length|0];
const V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z),UP=V(0,1,0),ZAX=V(0,0,1);
const _v=V(),_v2=V(),_col=new THREE.Color(),dum=new THREE.Object3D(),_c1=new CANNON.Vec3(),_c2=new CANNON.Vec3();
const cv3=v=>new CANNON.Vec3(v.x,v.y,v.z);
let now=0;
/* 1 单位 = 10 厘米 */
