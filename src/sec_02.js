/* ================= 声音 ================= */
let AC=null,master,noiseBuf,revSend,hissG,SPt={g:1,pan:0,dl:0},muted=false;
function initAudio(){if(AC){if(AC.state==='suspended')AC.resume();return;}try{AC=new(window.AudioContext||window.webkitAudioContext)();}catch(e){AC=null;return;}
 const comp=AC.createDynamicsCompressor();comp.threshold.value=-14;comp.ratio.value=6;comp.connect(AC.destination);master=AC.createGain();master.gain.value=muted?0:.9;master.connect(comp);
 const sr=AC.sampleRate,len=sr*2.2|0,ir=AC.createBuffer(2,len,sr);for(let ch=0;ch<2;ch++){const d=ir.getChannelData(ch);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3)*(i<sr*.015?0:.6);const e=sr*(.2+ch*.03)|0;for(let i=0;i<300;i++)d[e+i]+=(Math.random()*2-1)*.8*(1-i/300);}
 const conv=AC.createConvolver();conv.buffer=ir;revSend=AC.createGain();revSend.connect(conv);const rg=AC.createGain();rg.gain.value=.45;conv.connect(rg);rg.connect(master);
 noiseBuf=AC.createBuffer(1,sr*2,sr);const nd=noiseBuf.getChannelData(0);for(let i=0;i<nd.length;i++)nd[i]=Math.random()*2-1;
 const hs=AC.createBufferSource();hs.buffer=noiseBuf;hs.loop=true;const bp=AC.createBiquadFilter();bp.type='bandpass';bp.frequency.value=5500;bp.Q.value=.8;hissG=AC.createGain();hissG.gain.value=0;hs.connect(bp);bp.connect(hissG);hissG.connect(master);hs.start();}
function outp(n,wet){let x=n;if(SPt.pan&&AC.createStereoPanner){const p=AC.createStereoPanner();p.pan.value=SPt.pan;n.connect(p);x=p;}x.connect(master);if(wet){const g=AC.createGain();g.gain.value=wet;x.connect(g);g.connect(revSend);}}
function nz(dl,dur,type,f0,f1,q,vol,att,wet){if(!AC)return;vol*=SPt.g;const t=AC.currentTime+SPt.dl+dl;const s=AC.createBufferSource();s.buffer=noiseBuf;const f=AC.createBiquadFilter();f.type=type;f.Q.value=q;f.frequency.setValueAtTime(f0,t);if(f1)f.frequency.exponentialRampToValueAtTime(f1,t+dur);const g=AC.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.0002,vol),t+att);g.gain.exponentialRampToValueAtTime(.0001,t+dur);s.connect(f);f.connect(g);outp(g,wet);s.start(t,Math.random()*1.4,dur+.05);}
function osc(dl,type,f0,f1,dur,vol,wet){if(!AC)return;vol*=SPt.g;const t=AC.currentTime+SPt.dl+dl;const o=AC.createOscillator();o.type=type;o.frequency.setValueAtTime(f0,t);if(f1)o.frequency.exponentialRampToValueAtTime(f1,t+dur);const g=AC.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.0002,vol),t+.005);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);outp(g,wet);o.start(t);o.stop(t+dur+.05);}
function at(p){if(!p){SPt={g:1,pan:0,dl:0};return;}const d=camera.position.distanceTo(p);_v.copy(p).applyMatrix4(camera.matrixWorldInverse);SPt={g:clp(34/Math.max(d,10),.1,1.3),pan:clp(_v.x/(Math.abs(_v.z)+Math.abs(_v.x)+1),-.8,.8),dl:d/3400};}
const S={
 bang(p,kind){if(!AC)return;const v=Math.min(1,.25+.3*p);
  if(kind==='water'){nz(0,.55+p*.15,'lowpass',520,110,.7,Math.min(1,.45+.25*p),.004,.4);osc(0,'sine',95,32,.5,v*.9,.2);nz(.06,.8,'lowpass',2600,500,.5,.35,.02,.3);return;}
  if(kind==='tube'){nz(0,.35+.1*p,'lowpass',1800,160,.8,Math.min(1,v*1.2),.002,.7);osc(0,'sine',120,30,.6,v,.4);osc(0,'triangle',240,90,.3,.2,.4);return;}
  if(kind==='soft'){nz(0,.22,'lowpass',1400,200,.7,v*.8,.002,.4);osc(0,'sine',130,40,.25,v*.6,.2);return;}
  if(kind==='metal'||kind==='plastic'){nz(0,.18+.08*p,'lowpass',2600,300,.6,v,.001,.6);osc(0,'sine',140,40,.3,v*.9,.3);osc(.01,kind==='metal'?'square':'triangle',kind==='metal'?880:560,kind==='metal'?700:460,.16,.1,.4);return;}
  nz(0,.1+.08*p,'lowpass',7500,420,.5,v,.001,.7);nz(0,.045,'highpass',2200,0,.7,v*.55,.0005,.3);if(p>=.9)osc(0,'sine',160,38,.22+.07*p,v*.8,.35);},
 tss(){nz(0,.2,'highpass',4200,0,.7,.08,.01,0);},
 fizzle(){nz(0,.6,'bandpass',3200,1100,1.2,.18,.01,.1);},
 whistle(d){if(!AC)return;const t=AC.currentTime+SPt.dl,o=AC.createOscillator();o.frequency.setValueAtTime(1900,t);o.frequency.linearRampToValueAtTime(3500,t+d);const lf=AC.createOscillator();lf.frequency.value=28;const lg=AC.createGain();lg.gain.value=140;lf.connect(lg);lg.connect(o.frequency);const g=AC.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.08*SPt.g,t+.05);g.gain.setValueAtTime(.08*SPt.g,t+d-.05);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);outp(g,.3);o.start(t);lf.start(t);o.stop(t+d+.05);lf.stop(t+d+.05);},
 glass(){nz(0,.4,'highpass',3200,0,.6,.45,.001,.3);for(let i=0;i<6;i++)osc(Math.random()*.15,'sine',rnd(2600,6500),0,rnd(.12,.4),.05,.3);},
 splat(){nz(0,.3,'lowpass',900,180,.8,.6,.003,.25);},
 splash(v){nz(0,.6,'lowpass',2200,400,.5,Math.min(.45,v),.01,.25);},
 clang(v){osc(0,'square',rnd(520,640),rnd(380,440),.22,Math.min(.1,v),.4);osc(0,'sine',rnd(1300,1700),0,.3,Math.min(.07,v),.4);nz(0,.06,'highpass',2000,0,.7,Math.min(.2,v*2),.001,.2);},
 thud(v){nz(0,.09,'lowpass',340,0,.7,Math.min(.35,v),.002,.05);},
 tick(){nz(0,.03,'highpass',1800,0,.7,.07,.001,0);},
 step(){nz(0,.05,'lowpass',rnd(500,800),0,.6,.045,.004,0);},
 cluck(k){const n=k>.7?5:2;for(let i=0;i<n;i++)osc(i*.09+rnd(0,.02),'sawtooth',rnd(620,820),rnd(380,460),.07,.06);if(k>.7)osc(n*.09,'sawtooth',900,500,.22,.07);},
 bark(n){for(let i=0;i<n;i++){osc(i*.22,'sawtooth',rnd(380,460),rnd(200,240),.11,.16,.2);nz(i*.22,.09,'bandpass',900,0,1.5,.14,.004,.2);}},
 yelp(){osc(0,'sawtooth',900,1500,.12,.12,.2);osc(.14,'sawtooth',1300,700,.25,.1,.2);},
 moo(){osc(0,'sawtooth',105,150,.35,.2,.3);osc(.33,'sawtooth',150,95,.8,.2,.3);},
 ring(){osc(0,'sine',4300,4250,1.6,.05,0);},
 chime(){osc(0,'sine',880,0,.18,.07,.3);osc(.09,'sine',1320,0,.3,.07,.3);},
};
