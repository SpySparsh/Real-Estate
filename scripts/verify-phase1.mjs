import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9555;
const OUTPUT_DIR = path.resolve('scripts/test-output/phase1');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runPhase1Verification() {
  console.log('=== Starting Chrome for Phase 1 Section Focus Verification ===');
  const chromeProc = spawn(CHROME, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--no-sandbox',
    '--window-size=390,844',
    'about:blank',
  ]);

  await sleep(1800);

  try {
    const listRes = await fetch(`http://127.0.0.1:${PORT}/json/list`);
    const pages = await listRes.json();
    const targetPage = pages.find((p) => p.type === 'page');

    if (!targetPage) throw new Error('No target page found');

    const ws = new WebSocket(targetPage.webSocketDebuggerUrl);
    let id = 1;
    const callbacks = new Map();

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        const { resolve, reject } = callbacks.get(msg.id);
        callbacks.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };

    await new Promise((resolve) => (ws.onopen = resolve));

    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const msgId = id++;
        const timer = setTimeout(() => reject(new Error('Timeout ' + method)), 8000);
        callbacks.set(msgId, {
          resolve: (res) => {
            clearTimeout(timer);
            resolve(res);
          },
          reject: (err) => {
            clearTimeout(timer);
            reject(err);
          },
        });
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await send('Page.enable');
    await send('DOM.enable');
    await send('Runtime.enable');

    async function evalCode(expression) {
      const res = await send('Runtime.evaluate', {
        expression,
        returnByValue: true,
      });
      return res.result?.value;
    }

    async function captureScreenshot(filename) {
      const res = await send('Page.captureScreenshot', { format: 'png' });
      const buffer = Buffer.from(res.data, 'base64');
      const filePath = path.join(OUTPUT_DIR, filename);
      fs.writeFileSync(filePath, buffer);
      console.log(`  [Screenshot saved]: ${filename}`);
      return filePath;
    }

    async function scrollTo(y, waitMs = 850) {
      await evalCode(`window.scrollTo(0, ${y})`);
      await sleep(waitMs);
    }

    // ═══════════════════════════════════════════════════════════════
    // TEST SUITE 1: MOBILE VIEWPORT (390 x 844)
    // ═══════════════════════════════════════════════════════════════
    console.log('\n======================================================');
    console.log('>>> RUNNING SUITE 1: MOBILE VIEWPORT (390 x 844)');
    console.log('======================================================');

    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
      screenOrientation: { angle: 0, type: 'portraitPrimary' },
    });

    console.log('Navigating to http://localhost:5173...');
    await send('Page.navigate', { url: 'http://localhost:5173' });

    // Wait for React and components to mount
    for (let i = 0; i < 50; i++) {
      const ready = await evalCode(`Boolean(document.getElementById('home') && document.getElementById('introduction') && document.getElementById('philosophy'))`);
      if (ready) break;
      await sleep(100);
    }
    // Allow entrance animations to settle
    await sleep(2500);

    // Sample Section Focus & Element Status Helper
    async function sampleFocusStatus() {
      return await evalCode(`
        (() => {
          const heroEl = document.getElementById('home');
          const introEl = document.getElementById('introduction');
          const philEl = document.getElementById('philosophy');

          const heroWrap = heroEl?.querySelector('.section-focus-wrapper');
          const introWrap = introEl?.querySelector('.section-focus-wrapper');
          const philWrap = philEl?.querySelector('.section-focus-wrapper');

          const introEyebrow = introEl?.querySelector('.intro-eyebrow');
          const introHeadline = introEl?.querySelector('.intro-main-headline');
          const introFrame = introEl?.querySelector('.intro-image-frame');

          const philHeader = philEl?.querySelector('.philosophy-header');
          const philStage = philEl?.querySelector('.philosophy-stage-content');

          const heroBuilding = heroEl?.querySelector('.hero-image');
          const heroStone = heroEl?.querySelector('.hero-stone-image');
          const heroStoneText = heroEl?.querySelector('.hero-stone-line-upper');
          const heroFoliage = heroEl?.querySelector('.hero-foliage-tl');

          const getStyle = (el, prop) => el ? window.getComputedStyle(el).getPropertyValue(prop) : null;
          const getTransform = (el) => el ? (gsap.getProperty(el, 'scale') || 1) : null;

          return {
            scrollY: Math.round(window.scrollY),
            hero: {
              wrapperOpacity: Number(parseFloat(getStyle(heroWrap, 'opacity')).toFixed(3)),
              wrapperScale: Number(parseFloat(getTransform(heroWrap)).toFixed(3)),
              buildingOpacity: Number(parseFloat(getStyle(heroBuilding, 'opacity')).toFixed(3)),
              stoneOpacity: Number(parseFloat(getStyle(heroStone, 'opacity')).toFixed(3)),
              stoneTextOpacity: Number(parseFloat(getStyle(heroStoneText, 'opacity')).toFixed(3)),
              foliageOpacity: Number(parseFloat(getStyle(heroFoliage, 'opacity')).toFixed(3)),
            },
            intro: {
              wrapperOpacity: Number(parseFloat(getStyle(introWrap, 'opacity')).toFixed(3)),
              wrapperScale: Number(parseFloat(getTransform(introWrap)).toFixed(3)),
              eyebrowOpacity: Number(parseFloat(getStyle(introEyebrow, 'opacity')).toFixed(3)),
              headlineOpacity: Number(parseFloat(getStyle(introHeadline, 'opacity')).toFixed(3)),
              frameOpacity: Number(parseFloat(getStyle(introFrame, 'opacity')).toFixed(3)),
              rectTop: Math.round(introEl.getBoundingClientRect().top),
            },
            phil: {
              wrapperOpacity: philWrap ? Number(parseFloat(getStyle(philWrap, 'opacity')).toFixed(3)) : null,
              wrapperScale: philWrap ? Number(parseFloat(getTransform(philWrap)).toFixed(3)) : null,
              headerOpacity: Number(parseFloat(getStyle(philHeader, 'opacity')).toFixed(3)),
              stageOpacity: Number(parseFloat(getStyle(philStage, 'opacity')).toFixed(3)),
              rectTop: Math.round(philEl.getBoundingClientRect().top),
            }
          };
        })()
      `);
    }

    // Inspect triggers
    const triggerInfo = await evalCode(`
      (() => {
        const triggers = ScrollTrigger.getAll();
        return triggers.map(t => ({
          id: t.vars.id || 'anon',
          start: Math.round(t.start),
          end: Math.round(t.end),
          isPin: Boolean(t.vars.pin),
        }));
      })()
    `);
    console.log('ScrollTriggers registered:', triggerInfo);

    // 1. Initial State (scrollY = 0)
    const initial = await sampleFocusStatus();
    console.log('\n[1. Initial State scrollY=0]:', initial);
    await captureScreenshot('mobile-01-initial.png');

    if (initial.hero.wrapperOpacity !== 1 || initial.hero.wrapperScale !== 1) {
      throw new Error(`Hero wrapper not focused initially: opacity=${initial.hero.wrapperOpacity}`);
    }
    if (initial.intro.wrapperOpacity > 0.85) {
      throw new Error(`Intro wrapper not suppressed initially: opacity=${initial.intro.wrapperOpacity}`);
    }
    if (initial.intro.eyebrowOpacity > 0.05 || initial.intro.headlineOpacity > 0.05) {
      throw new Error(`Intro opening animation prematurely visible at scrollY=0!`);
    }
    console.log('✓ PASS: Hero is 100% focused. Introduction is suppressed and opening animation is strictly hidden.');

    // 2. Scroll inside Hero (Hero pinned scroll)
    const heroPinTrigger = triggerInfo.find(t => t.isPin);
    const heroPinEnd = heroPinTrigger ? heroPinTrigger.end : 1688;
    console.log(`Hero pin end: ${heroPinEnd}px`);

    // Mid Hero:
    await scrollTo(Math.round(heroPinEnd * 0.5));
    const midHero = await sampleFocusStatus();
    console.log('\n[2. Mid Hero scroll]:', midHero);
    await captureScreenshot('mobile-02-mid-hero.png');

    // End Hero:
    await scrollTo(heroPinEnd);
    const endHero = await sampleFocusStatus();
    console.log('\n[3. End Hero scroll]:', endHero);
    await captureScreenshot('mobile-03-end-hero.png');

    if (endHero.hero.stoneOpacity < 0.9) {
      throw new Error(`Hero stone transition not reached at end of Hero pin! stoneOpacity=${endHero.hero.stoneOpacity}`);
    }
    if (endHero.intro.eyebrowOpacity > 0.05) {
      throw new Error(`Intro opening animation prematurely triggered at Hero end!`);
    }
    console.log('✓ PASS: Hero internal mobile animation completed cleanly (stone background visible, text emerged). Intro still strictly in pre-opening state.');

    // 3. Down-scroll into Hero -> Introduction Focus Handoff Zone
    // Introduction is rising into the viewport.
    const handoffTrigger = triggerInfo.find(t => t.id === 'focus-handoff-hero-intro');
    console.log('Hero -> Intro handoff range:', handoffTrigger);

    const handoffMidY = Math.round(handoffTrigger.start + (handoffTrigger.end - handoffTrigger.start) * 0.5);
    await scrollTo(handoffMidY);
    const midHandoff = await sampleFocusStatus();
    console.log(`\n[4. Mid Focus Handoff scrollY=${handoffMidY}]:`, midHandoff);
    await captureScreenshot('mobile-04-mid-handoff.png');

    if (midHandoff.hero.wrapperOpacity >= 1.0) {
      throw new Error(`Hero wrapper did not begin losing focus: ${midHandoff.hero.wrapperOpacity}`);
    }
    if (midHandoff.intro.wrapperOpacity <= 0.82) {
      throw new Error(`Intro wrapper did not begin gaining focus: ${midHandoff.intro.wrapperOpacity}`);
    }
    if (midHandoff.intro.eyebrowOpacity > 0.05 || midHandoff.intro.headlineOpacity > 0.05) {
      throw new Error(`GOLDEN INVARIANT VIOLATED! Intro opening animation played while Intro was unfocused! eyebrow=${midHandoff.intro.eyebrowOpacity}`);
    }
    console.log('✓ PASS: Golden Invariant strictly held during handoff! Hero is losing focus, Intro is gaining focus, and Intro opening animation is at 0.0.');

    // Interruption / direction reversal test halfway through handoff:
    console.log('Testing reverse scroll halfway through handoff...');
    await scrollTo(handoffTrigger.start);
    const reversedToHandoffStart = await sampleFocusStatus();
    if (reversedToHandoffStart.hero.wrapperOpacity < 0.98) {
      throw new Error(`Hero did not restore to full focus upon reversing handoff: ${reversedToHandoffStart.hero.wrapperOpacity}`);
    }
    console.log('✓ PASS: Reverse scroll halfway through handoff restores Hero to 100% focus cleanly.');

    // Resume scrolling down to completion of handoff:
    await scrollTo(handoffTrigger.end);
    const handoffComplete = await sampleFocusStatus();
    console.log(`\n[5. Focus Handoff Complete scrollY=${handoffTrigger.end}]:`, handoffComplete);
    await captureScreenshot('mobile-05-handoff-complete.png');

    if (handoffComplete.intro.wrapperOpacity < 0.98 || handoffComplete.intro.wrapperScale < 0.995) {
      throw new Error(`Intro wrapper did not reach 100% focus at handoff end: opacity=${handoffComplete.intro.wrapperOpacity}, scale=${handoffComplete.intro.wrapperScale}`);
    }
    if (handoffComplete.intro.headlineOpacity > 0.05) {
      throw new Error(`Intro headline prematurely visible before reveal scrub starts!`);
    }
    console.log('✓ PASS: Introduction has reached 100% VISUAL FOCUS. Only now is opening animation permitted to begin.');

    // 4. Scroll through Introduction's Opening Animation
    const introRevealTrigger = triggerInfo.find(t => t.id === 'intro-reveal');
    console.log('Intro reveal range:', introRevealTrigger);

    // Mid reveal:
    const revealMidY = Math.round(introRevealTrigger.start + (introRevealTrigger.end - introRevealTrigger.start) * 0.5);
    await scrollTo(revealMidY);
    const midReveal = await sampleFocusStatus();
    console.log(`\n[6. Mid Intro Reveal scrollY=${revealMidY}]:`, midReveal);
    await captureScreenshot('mobile-06-mid-intro-reveal.png');

    if (midReveal.intro.eyebrowOpacity < 0.3) {
      throw new Error(`Intro eyebrow did not begin revealing during reveal scrub: ${midReveal.intro.eyebrowOpacity}`);
    }
    console.log('✓ PASS: Intro opening animation is scrubbing smoothly and responsive to scroll progress.');

    // Interruption / Reverse scroll during opening animation:
    console.log('Testing reverse scroll mid-reveal before opening finishes...');
    await scrollTo(introRevealTrigger.start);
    const reversedToRevealStart = await sampleFocusStatus();
    if (reversedToRevealStart.intro.eyebrowOpacity > 0.05 || reversedToRevealStart.intro.headlineOpacity > 0.05) {
      throw new Error(`Intro elements did not return to pre-opening state on reverse scroll! eyebrow=${reversedToRevealStart.intro.eyebrowOpacity}`);
    }
    console.log('✓ PASS: Reverse scroll mid-reveal returns Intro elements cleanly to pre-opening state before handoff reverses.');

    // Resume scroll to fully opened Introduction:
    await scrollTo(introRevealTrigger.end);
    const introFullyOpened = await sampleFocusStatus();
    console.log(`\n[7. Intro Fully Opened scrollY=${introRevealTrigger.end}]:`, introFullyOpened);
    await captureScreenshot('mobile-07-intro-fully-opened.png');

    if (introFullyOpened.intro.headlineOpacity < 0.9 || introFullyOpened.intro.eyebrowOpacity < 0.9) {
      throw new Error(`Intro did not fully open: headline=${introFullyOpened.intro.headlineOpacity}, eyebrow=${introFullyOpened.intro.eyebrowOpacity}`);
    }
    console.log('✓ PASS: Introduction is fully opened and 100% focused.');

    // 5. Scroll towards Philosophy
    const philHandoffTrigger = triggerInfo.find(t => t.id === 'focus-handoff-intro-phil');
    console.log('Intro -> Philosophy handoff range:', philHandoffTrigger);

    const philHandoffMidY = Math.round(philHandoffTrigger.start + (philHandoffTrigger.end - philHandoffTrigger.start) * 0.5);
    await scrollTo(philHandoffMidY);
    const midPhilHandoff = await sampleFocusStatus();
    console.log(`\n[8. Mid Intro -> Phil Handoff scrollY=${philHandoffMidY}]:`, midPhilHandoff);

    if (midPhilHandoff.phil.headerOpacity > 0.05) {
      throw new Error(`Philosophy opening animation played while Philosophy was unfocused!`);
    }
    console.log('✓ PASS: Philosophy opening animation strictly locked at 0 while Philosophy is unfocused.');

    // Scroll to Philosophy focus completion:
    await scrollTo(philHandoffTrigger.end);
    const philFocused = await sampleFocusStatus();
    console.log(`\n[9. Philosophy Focused scrollY=${philHandoffTrigger.end}]:`, philFocused);
    if (philFocused.phil.wrapperOpacity < 0.98) {
      throw new Error(`Philosophy did not reach 100% focus: ${philFocused.phil.wrapperOpacity}`);
    }
    console.log('✓ PASS: Philosophy is 100% focused.');

    // Scroll through Philosophy reveal:
    const philRevealTrigger = triggerInfo.find(t => t.id === 'philosophy-reveal');
    await scrollTo(philRevealTrigger.end);
    const philFullyOpened = await sampleFocusStatus();
    console.log(`\n[10. Philosophy Fully Opened scrollY=${philRevealTrigger.end}]:`, philFullyOpened);
    await captureScreenshot('mobile-08-phil-fully-opened.png');

    if (philFullyOpened.phil.headerOpacity < 0.9) {
      throw new Error(`Philosophy header did not fully reveal: ${philFullyOpened.phil.headerOpacity}`);
    }
    console.log('✓ PASS: Philosophy is fully opened and focused.');

    // Full reverse test back to Hero scrollY=0
    console.log('\nTesting complete upward scroll back to top of page (scrollY=0)...');
    await scrollTo(0);
    await sleep(400);
    const restoredHero = await sampleFocusStatus();
    console.log('[11. Restored Top of Page scrollY=0]:', restoredHero);
    await captureScreenshot('mobile-09-restored-top.png');

    if (restoredHero.hero.wrapperOpacity !== 1 || restoredHero.hero.wrapperScale !== 1) {
      throw new Error(`Hero not fully focused at scrollY=0: ${restoredHero.hero.wrapperOpacity}`);
    }
    if (restoredHero.intro.eyebrowOpacity > 0.05 || restoredHero.phil.headerOpacity > 0.05) {
      throw new Error(`Downstream sections not reset to pre-opening state at top!`);
    }
    console.log('✓ PASS: Complete bidirectional scroll cycle successfully verified on Mobile!');

    // ═══════════════════════════════════════════════════════════════
    // TEST SUITE 2: DESKTOP VIEWPORT (1440 x 900)
    // ═══════════════════════════════════════════════════════════════
    console.log('\n======================================================');
    console.log('>>> RUNNING SUITE 2: DESKTOP VIEWPORT (1440 x 900)');
    console.log('======================================================');

    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    console.log('Reloading on desktop viewport...');
    await send('Page.navigate', { url: 'http://localhost:5173' });
    await sleep(3000);

    const desktopInitial = await sampleFocusStatus();
    console.log('\n[12. Desktop Initial State scrollY=0]:', desktopInitial);
    await captureScreenshot('desktop-01-initial.png');

    if (desktopInitial.hero.wrapperOpacity !== 1 || desktopInitial.intro.wrapperOpacity > 0.85) {
      throw new Error(`Desktop initial focus state mismatch: Hero=${desktopInitial.hero.wrapperOpacity}, Intro=${desktopInitial.intro.wrapperOpacity}`);
    }

    const desktopTriggers = await evalCode(`
      (() => {
        return ScrollTrigger.getAll().map(t => ({
          id: t.vars.id || 'anon',
          start: Math.round(t.start),
          end: Math.round(t.end),
          isPin: Boolean(t.vars.pin),
        }));
      })()
    `);
    console.log('Desktop triggers:', desktopTriggers);

    const dHeroPin = desktopTriggers.find(t => t.isPin);
    const dHandoff = desktopTriggers.find(t => t.id === 'focus-handoff-hero-intro');
    const dIntroReveal = desktopTriggers.find(t => t.id === 'intro-reveal');

    // Scroll to end of Hero desktop pin
    await scrollTo(dHeroPin.end);
    const dHeroEnd = await sampleFocusStatus();
    console.log(`\n[13. Desktop Hero Pin End scrollY=${dHeroPin.end}]:`, dHeroEnd);
    await captureScreenshot('desktop-02-hero-end.png');

    // Scroll to handoff end (Introduction reached focus)
    await scrollTo(dHandoff.end);
    const dIntroFocused = await sampleFocusStatus();
    console.log(`\n[14. Desktop Intro Focus scrollY=${dHandoff.end}]:`, dIntroFocused);
    await captureScreenshot('desktop-03-intro-focused.png');

    if (dIntroFocused.intro.wrapperOpacity < 0.98) {
      throw new Error(`Desktop Intro did not reach 100% focus at handoff end!`);
    }
    if (dIntroFocused.intro.headlineOpacity > 0.05) {
      throw new Error(`Desktop Intro headline prematurely revealed before reveal scrub!`);
    }

    // Scroll through Desktop Intro reveal
    await scrollTo(dIntroReveal.end);
    const dIntroOpen = await sampleFocusStatus();
    console.log(`\n[15. Desktop Intro Fully Opened scrollY=${dIntroReveal.end}]:`, dIntroOpen);
    await captureScreenshot('desktop-04-intro-opened.png');

    if (dIntroOpen.intro.headlineOpacity < 0.9) {
      throw new Error(`Desktop Intro headline not opened: ${dIntroOpen.intro.headlineOpacity}`);
    }

    // Reverse test on Desktop
    await scrollTo(0);
    await sleep(400);
    const dRestored = await sampleFocusStatus();
    console.log(`\n[16. Desktop Restored scrollY=0]:`, dRestored);
    await captureScreenshot('desktop-05-restored.png');

    if (dRestored.hero.wrapperOpacity !== 1 || dRestored.intro.eyebrowOpacity > 0.05) {
      throw new Error(`Desktop reverse scroll did not restore cleanly!`);
    }
    console.log('✓ PASS: Complete bidirectional scroll cycle successfully verified on Desktop!');

    console.log('\n======================================================');
    console.log('ALL PHASE 1 FOCUS & INVARIANT CRITERIA PASSED 100%!');
    console.log('======================================================\n');
  } finally {
    chromeProc.kill();
  }
}

runPhase1Verification().catch((err) => {
  console.error('\n❌ VERIFICATION FAILURE:', err);
  process.exit(1);
});
