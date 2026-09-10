import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9444;
const OUTPUT_DIR = path.resolve('scripts/test-output');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runVerification() {
  console.log('--- Starting Chrome for Hero Scroll Verification ---');
  const chromeProc = spawn(CHROME, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--no-sandbox',
    '--window-size=390,844',
    'about:blank',
  ]);

  await sleep(1500);

  try {
    const listRes = await fetch(`http://127.0.0.1:${PORT}/json/list`);
    const pages = await listRes.json();
    const targetPage = pages.find((p) => p.type === 'page');

    if (!targetPage) {
      throw new Error('No target page found');
    }

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
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
      screenOrientation: { angle: 0, type: 'portraitPrimary' },
    });

    console.log('Navigating to http://localhost:5173...');
    await send('Page.navigate', { url: 'http://localhost:5173' });

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
      console.log(`[Screenshot saved]: ${filename}`);
      return filePath;
    }

    // Wait for React to render #home and elements
    console.log('Waiting for React and Hero to mount...');
    for (let i = 0; i < 60; i++) {
      const ready = await evalCode(`
        Boolean(document.getElementById('home') && document.querySelector('.hero-image') && document.querySelector('.hero-stone-image'))
      `);
      if (ready) break;
      await sleep(100);
    }

    // Wait for entrance animation to finish
    await sleep(3500);

    const metrics = await evalCode(`
      (() => {
        const hero = document.getElementById('home');
        const triggers = (typeof ScrollTrigger !== 'undefined') ? ScrollTrigger.getAll() : [];
        const st = triggers.find(t => t.vars && t.vars.pin) || triggers[1] || triggers[0];
        return {
          allTriggers: triggers.map(t => ({ start: t.start, end: t.end, isPin: Boolean(t.vars && t.vars.pin) })),
          stTotal: st ? (st.end - st.start) : (window.innerHeight * 2),
          stStart: st ? st.start : 0,
          stEnd: st ? st.end : (window.innerHeight * 2),
        };
      })()
    `);
    console.log('ScrollTrigger Metrics:', metrics);
    const totalScroll = metrics.stTotal;

    // ── Helper to sample state ──
    async function getHeroState() {
      return await evalCode(`
        (() => {
          const building = document.querySelector('.hero-image');
          const stone = document.querySelector('.hero-stone-image');
          const headline = document.querySelector('.hero-headline-line');
          const label = document.querySelector('.hero-label');
          const newText1 = document.querySelector('.hero-stone-line-upper');
          const newText2 = document.querySelector('.hero-stone-line-lower');
          const divider = document.querySelector('.hero-stone-divider');
          const textContainer = document.querySelector('.hero-stone-text-container');
          const wrapper = document.querySelector('.hero-image-wrapper');

          const foliageTL = document.querySelector('.hero-foliage-tl');
          const foliageTR = document.querySelector('.hero-foliage-tr');
          const foliageBL = document.querySelector('.hero-foliage-bl');
          const foliageBR = document.querySelector('.hero-foliage-br');

          function unpackRect(el) {
            if (!el) return null;
            const r = el.getBoundingClientRect();
            return { top: Math.round(r.top), bottom: Math.round(r.bottom), left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width), height: Math.round(r.height) };
          }

          return {
            scrollY: window.scrollY,
            viewportHeight: window.innerHeight,
            containerHeight: document.querySelector('#home')?.clientHeight,
            buildingOpacity: building ? parseFloat(getComputedStyle(building).opacity) : null,
            stoneOpacity: stone ? parseFloat(getComputedStyle(stone).opacity) : null,
            headlineOpacity: headline ? parseFloat(getComputedStyle(headline).opacity) : null,
            newText1Opacity: newText1 ? parseFloat(getComputedStyle(newText1).opacity) : null,
            newText2Opacity: newText2 ? parseFloat(getComputedStyle(newText2).opacity) : null,
            dividerOpacity: divider ? parseFloat(getComputedStyle(divider).opacity) : null,
            foliageTLOpacity: foliageTL ? parseFloat(getComputedStyle(foliageTL).opacity) : null,
            foliageTROpacity: foliageTR ? parseFloat(getComputedStyle(foliageTR).opacity) : null,
            foliageBLOpacity: foliageBL ? parseFloat(getComputedStyle(foliageBL).opacity) : null,
            foliageBROpacity: foliageBR ? parseFloat(getComputedStyle(foliageBR).opacity) : null,
            textRect: unpackRect(textContainer),
            foliageTLRect: unpackRect(foliageTL),
            foliageTRRect: unpackRect(foliageTR),
            foliageBLRect: unpackRect(foliageBL),
            foliageBRRect: unpackRect(foliageBR),
          };
        })()
      `);
    }

    // ══════════════════════════════════════════════════════════
    // STATE 1: scroll = 0
    // ══════════════════════════════════════════════════════════
    console.log('\n========================================');
    console.log('1. STATE 1: Scroll = 0 (Initial Hero)');
    const s1 = await getHeroState();
    console.log('State 1 readings:', s1);
    await captureScreenshot('01-state1-initial.png');

    // ══════════════════════════════════════════════════════════
    // STATE 2: OLD TEXT DISAPPEARS (approx 20% scroll)
    // ══════════════════════════════════════════════════════════
    console.log('\n========================================');
    console.log('2. STATE 2: Scroll = 20% (Headline fading)');
    await evalCode(`window.scrollTo(0, ${totalScroll * 0.20}); if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();`);
    await sleep(400);
    const s2 = await getHeroState();
    console.log('State 2 readings:', s2);
    await captureScreenshot('02-state2-text-fading.png');

    // ══════════════════════════════════════════════════════════
    // STATE 3: BUILDING FADING OUT (approx 35% scroll)
    // ══════════════════════════════════════════════════════════
    console.log('\n========================================');
    console.log('3. STATE 3: Scroll = 35% (Headline gone, building fading)');
    await evalCode(`window.scrollTo(0, ${totalScroll * 0.35}); if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();`);
    await sleep(400);
    const s3 = await getHeroState();
    console.log('State 3 readings:', s3);
    await captureScreenshot('03-state3-building-fading.png');

    // ══════════════════════════════════════════════════════════
    // STATE 4: BUILDING DISAPPEARS COMPLETELY (approx 44% scroll)
    // ══════════════════════════════════════════════════════════
    console.log('\n========================================');
    console.log('4. STATE 4: Scroll = 44% (Building completely gone, zero stone)');
    await evalCode(`window.scrollTo(0, ${totalScroll * 0.44}); if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();`);
    await sleep(400);
    const s4 = await getHeroState();
    console.log('State 4 readings:', s4);
    await captureScreenshot('04-state4-building-gone-gap.png');

    // ══════════════════════════════════════════════════════════
    // STATE 5: STONE APPEARS (approx 55% scroll)
    // ══════════════════════════════════════════════════════════
    console.log('\n========================================');
    console.log('5. STATE 5: Scroll = 55% (Stone fading in)');
    await evalCode(`window.scrollTo(0, ${totalScroll * 0.55}); if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();`);
    await sleep(400);
    const s5 = await getHeroState();
    console.log('State 5 readings:', s5);
    await captureScreenshot('05-state5-stone-appearing.png');

    // ══════════════════════════════════════════════════════════
    // STATE 6: STONE FULLY VISIBLE & NEW TEXT EMERGING (approx 72% scroll)
    // ══════════════════════════════════════════════════════════
    console.log('\n========================================');
    console.log('6. STATE 6: Scroll = 72% (Stone fully visible, text emerging)');
    await evalCode(`window.scrollTo(0, ${totalScroll * 0.72}); if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();`);
    await sleep(400);
    const s6 = await getHeroState();
    console.log('State 6 readings:', s6);
    await captureScreenshot('06-state6-stone-text-emerging.png');

    // ══════════════════════════════════════════════════════════
    // STATE 7: FINAL STONE HERO (approx 95% scroll)
    // ══════════════════════════════════════════════════════════
    console.log('\n========================================');
    console.log('7. STATE 7: Scroll = 95% (Final Stone Hero settled)');
    await evalCode(`window.scrollTo(0, ${totalScroll * 0.95}); if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();`);
    await sleep(400);
    const s7 = await getHeroState();
    console.log('State 7 readings:', s7);
    await captureScreenshot('07-state7-final-stone-hero.png');

    // ══════════════════════════════════════════════════════════
    // STATE 8: REVERSE SCROLL BACK TO 0
    // ══════════════════════════════════════════════════════════
    console.log('\n========================================');
    console.log('8. STATE 8: Reverse Scroll back to 0');
    await evalCode(`window.scrollTo(0, 0); if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();`);
    await sleep(500);
    const s8 = await getHeroState();
    console.log('State 8 (Reversed) readings:', s8);
    await captureScreenshot('08-state8-reverse-scroll-0.png');

    // ══════════════════════════════════════════════════════════
    // TEST AT DIFFERENT MOBILE VIEWPORT WIDTHS (375, 414, 430)
    // ══════════════════════════════════════════════════════════
    for (const w of [375, 414, 430]) {
      console.log(`\nTesting Final State at width ${w}px...`);
      await send('Emulation.setDeviceMetricsOverride', {
        width: w,
        height: 844,
        deviceScaleFactor: 2,
        mobile: true,
        screenOrientation: { angle: 0, type: 'portraitPrimary' },
      });
      await evalCode(`window.scrollTo(0, 0); if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();`);
      await sleep(300);
      const newTotal = await evalCode(`
        (() => {
          const triggers = (typeof ScrollTrigger !== 'undefined') ? ScrollTrigger.getAll() : [];
          const st = triggers.find(t => t.vars && t.vars.pin) || triggers[1] || triggers[0];
          return st ? (st.end - st.start) : (window.innerHeight * 2);
        })()
      `);
      await evalCode(`window.scrollTo(0, ${newTotal * 0.95}); if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();`);
      await sleep(400);
      await captureScreenshot(`09-final-${w}px.png`);
    }

    console.log('\n--- ALL VERIFICATION TESTS COMPLETED SUCCESSFULLY ---');
    ws.close();
  } finally {
    chromeProc.kill();
  }
}

runVerification().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
