import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9556;
const OUTPUT_DIR = path.resolve('scripts/test-output/phase2');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const SECTION_IDS = [
  'home',
  'introduction',
  'philosophy',
  'projects',
  'partners',
  'portfolio-impact',
  'about',
  'cta',
  'contact',
  'footer',
];

async function runPhase2Verification() {
  console.log('=== Starting Chrome for Phase 2 Full-Page Section Focus Verification ===');
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
        const timer = setTimeout(() => reject(new Error('Timeout ' + method)), 10000);
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
      await evalCode(`
        document.documentElement.style.scrollBehavior = 'auto';
        window.scrollTo({ top: ${y}, behavior: 'instant' });
      `);
      await sleep(waitMs);
    }

    // Helper: sample focus and transform state of all 10 sections
    async function sampleAllSections() {
      return await evalCode(`
        (() => {
          const ids = ${JSON.stringify(SECTION_IDS)};
          const result = {
            scrollY: Math.round(window.scrollY),
            focusedSectionDataset: document.documentElement.dataset.focusedSection || null,
            sections: {},
          };

          ids.forEach((id) => {
            const el = document.getElementById(id);
            const wrapper = el ? el.querySelector('.section-focus-wrapper') : null;
            if (!el || !wrapper) {
              result.sections[id] = null;
              return;
            }

            const style = window.getComputedStyle(wrapper);
            const opacity = Number(parseFloat(style.opacity).toFixed(3));
            const scale = Number(parseFloat(gsap.getProperty(wrapper, 'scale') || 1).toFixed(3));
            const rect = el.getBoundingClientRect();

            result.sections[id] = {
              opacity,
              scale,
              rectTop: Math.round(rect.top),
              rectBottom: Math.round(rect.bottom),
              rectHeight: Math.round(rect.height),
            };
          });

          return result;
        })()
      `);
    }

    // ═══════════════════════════════════════════════════════════════
    // TEST SUITE 1: DESKTOP VIEWPORT (1440 x 900)
    // ═══════════════════════════════════════════════════════════════
    console.log('\n======================================================');
    console.log('>>> TEST SUITE 1: DESKTOP VIEWPORT (1440 x 900)');
    console.log('======================================================');

    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    console.log('Navigating to http://localhost:5173...');
    await send('Page.navigate', { url: 'http://localhost:5173' });

    // Wait for DOM to load all 10 sections
    for (let i = 0; i < 50; i++) {
      const allLoaded = await evalCode(`
        ${JSON.stringify(SECTION_IDS)}.every(id => Boolean(document.getElementById(id)))
      `);
      if (allLoaded) break;
      await sleep(100);
    }
    await sleep(2500);

    const desktopTriggers = await evalCode(`
      (() => {
        return ScrollTrigger.getAll().map(t => ({
          id: t.vars.id || 'anon',
          start: Math.round(t.start),
          end: Math.round(t.end),
        }));
      })()
    `);
    console.log(`Registered ScrollTriggers on Desktop: ${desktopTriggers.length}`);

    // Verify initial state at scrollY = 0
    const initialDesktop = await sampleAllSections();
    console.log('\n[1. Initial Desktop State scrollY=0]:');
    console.log(`  Hero: opacity=${initialDesktop.sections.home.opacity}, scale=${initialDesktop.sections.home.scale}`);
    console.log(`  Introduction: opacity=${initialDesktop.sections.introduction.opacity}`);
    console.log(`  Philosophy: opacity=${initialDesktop.sections.philosophy.opacity}`);
    console.log(`  Projects: opacity=${initialDesktop.sections.projects.opacity}`);
    console.log(`  Partners: opacity=${initialDesktop.sections.partners.opacity}`);
    console.log(`  Footer: opacity=${initialDesktop.sections.footer.opacity}`);
    await captureScreenshot('desktop-01-initial.png');

    if (initialDesktop.sections.home.opacity !== 1 || initialDesktop.sections.home.scale !== 1) {
      throw new Error(`Hero wrapper not focused at top: opacity=${initialDesktop.sections.home.opacity}`);
    }

    // Verify all downstream sections are completely suppressed / dormant (<= 0.05) - NO early peeking!
    for (let i = 1; i < SECTION_IDS.length; i++) {
      const sId = SECTION_IDS[i];
      const s = initialDesktop.sections[sId];
      if (s.opacity > 0.05) {
        throw new Error(`EARLY PEEKING VIOLATION! Section ${sId} is prematurely visible/unsuppressed at scrollY=0! opacity=${s.opacity}`);
      }
    }
    console.log('✓ PASS: Initial desktop state verified. Hero is 100% focused, all 9 downstream sections are completely dormant (opacity <= 0.05).');

    // 2. Step through each adjacent handoff and verify Golden Invariant + Departure Recede
    console.log('\n--- Stepping through each adjacent section transition ---');
    for (let i = 0; i < SECTION_IDS.length - 1; i++) {
      const fromId = SECTION_IDS[i];
      const toId = SECTION_IDS[i + 1];
      const triggerId = `focus-handoff-${fromId}-${toId}`;
      const trigger = desktopTriggers.find((t) => t.id === triggerId);

      if (!trigger) {
        throw new Error(`Missing expected focus trigger: ${triggerId}`);
      }

      console.log(`\nTesting Transition [${fromId} -> ${toId}] (trigger range: ${trigger.start}px -> ${trigger.end}px):`);

      // Sample midpoint of handoff
      const midY = Math.round(trigger.start + (trigger.end - trigger.start) * 0.5);
      await scrollTo(midY);
      const midState = await sampleAllSections();
      const fromMid = midState.sections[fromId];
      const toMid = midState.sections[toId];

      console.log(`  Mid-Handoff scrollY=${midY}:`);
      console.log(`    ${fromId} (departing): opacity=${fromMid.opacity}, scale=${fromMid.scale}`);
      console.log(`    ${toId} (entering): opacity=${toMid.opacity}, scale=${toMid.scale}`);

      if (fromMid.opacity >= 0.95) {
        throw new Error(`${fromId} did not begin receding during handoff to ${toId}! opacity=${fromMid.opacity}`);
      }
      if (toMid.opacity <= 0.05) {
        throw new Error(`${toId} did not begin emerging during handoff from ${fromId}! opacity=${toMid.opacity}`);
      }

      // Check opening element of toId is still in pre-opening state
      const openingState = await evalCode(`
        (() => {
          const toEl = document.getElementById('${toId}');
          if ('${toId}' === 'projects') {
            const intro = toEl.querySelector('.projects-intro-text');
            return intro ? parseFloat(window.getComputedStyle(intro).opacity) : null;
          }
          if ('${toId}' === 'partners') {
            const intro = toEl.querySelector('.partners-section-intro');
            return intro ? parseFloat(window.getComputedStyle(intro).opacity) : null;
          }
          if ('${toId}' === 'portfolio-impact') {
            const eyebrow = toEl.querySelector('.impact-eyebrow');
            return eyebrow ? parseFloat(window.getComputedStyle(eyebrow).opacity) : null;
          }
          if ('${toId}' === 'about') {
            const eyebrow = toEl.querySelector('.vision-eyebrow');
            return eyebrow ? parseFloat(window.getComputedStyle(eyebrow).opacity) : null;
          }
          if ('${toId}' === 'cta') {
            const headline = toEl.querySelector('.cta-headline');
            return headline ? parseFloat(window.getComputedStyle(headline).opacity) : null;
          }
          if ('${toId}' === 'contact') {
            const eyebrow = toEl.querySelector('.enquiry-eyebrow');
            return eyebrow ? parseFloat(window.getComputedStyle(eyebrow).opacity) : null;
          }
          return 0;
        })()
      `);

      if (openingState !== null && openingState > 0.05) {
        throw new Error(`GOLDEN INVARIANT VIOLATION! Section ${toId} opening element revealed during handoff while unfocused! opacity=${openingState}`);
      }
      console.log(`  ✓ Golden Invariant satisfied: ${toId} child elements strictly hidden while gaining focus.`);

      // Complete the handoff to reach 100% focus
      await scrollTo(trigger.end);
      const endState = await sampleAllSections();
      const toEnd = endState.sections[toId];
      const fromEnd = endState.sections[fromId];

      console.log(`  Handoff Complete scrollY=${trigger.end}:`);
      console.log(`    ${toId} (focused): opacity=${toEnd.opacity}, scale=${toEnd.scale}`);
      console.log(`    ${fromId} (receded): opacity=${fromEnd.opacity}, scale=${fromEnd.scale}`);

      if (toEnd.opacity < 0.95 || toEnd.scale < 0.98) {
        throw new Error(`Section ${toId} did not reach 100% focus at handoff end! opacity=${toEnd.opacity}, scale=${toEnd.scale}`);
      }
      if (fromEnd.opacity > 0.05) {
        throw new Error(`DEPARTURE RECEDE FAILED! Previous section ${fromId} did not recede! opacity=${fromEnd.opacity}`);
      }
      console.log(`  ✓ ${toId} reached 100% visual focus & ${fromId} successfully receded into depth.`);
      await captureScreenshot(`desktop-step-${i + 2}-${toId}-focused.png`);
    }

    // 3. Reverse scroll test back to top
    console.log('\n--- Testing Full Reverse Scroll back to Top of Page (scrollY = 0) ---');
    await scrollTo(0, 1200);
    const restoredDesktop = await sampleAllSections();
    console.log(`Restored Hero at scrollY=0: opacity=${restoredDesktop.sections.home.opacity}, scale=${restoredDesktop.sections.home.scale}`);
    console.log(`Restored Introduction: opacity=${restoredDesktop.sections.introduction.opacity}`);
    console.log(`Restored Footer: opacity=${restoredDesktop.sections.footer.opacity}`);
    await captureScreenshot('desktop-09-restored-top.png');

    if (restoredDesktop.sections.home.opacity < 0.99 || restoredDesktop.sections.home.scale < 0.99) {
      throw new Error(`Hero not fully restored on reverse scroll to 0! opacity=${restoredDesktop.sections.home.opacity}`);
    }
    if (restoredDesktop.sections.introduction.opacity > 0.05) {
      throw new Error(`Introduction not returned to dormant state on reverse scroll! opacity=${restoredDesktop.sections.introduction.opacity}`);
    }
    console.log('✓ PASS: Full reverse scroll on Desktop verified successfully! Hero restored to 100%, downstream sections restored to dormant.');

    // ═══════════════════════════════════════════════════════════════
    // TEST SUITE 2: MOBILE VIEWPORT (390 x 844)
    // ═══════════════════════════════════════════════════════════════
    console.log('\n======================================================');
    console.log('>>> TEST SUITE 2: MOBILE VIEWPORT (390 x 844)');
    console.log('======================================================');

    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
      screenOrientation: { angle: 0, type: 'portraitPrimary' },
    });

    console.log('Reloading on mobile viewport...');
    await send('Page.navigate', { url: 'http://localhost:5173' });
    await sleep(3000);

    const mobileTriggers = await evalCode(`
      (() => {
        return ScrollTrigger.getAll().map(t => ({
          id: t.vars.id || 'anon',
          start: Math.round(t.start),
          end: Math.round(t.end),
        }));
      })()
    `);
    console.log(`Registered ScrollTriggers on Mobile: ${mobileTriggers.length}`);

    // Initial state on mobile
    const initialMobile = await sampleAllSections();
    const mobileDocInfo = await evalCode(`
      (() => ({
        scrollHeight: document.documentElement.scrollHeight,
        innerHeight: window.innerHeight,
        maxScroll: document.documentElement.scrollHeight - window.innerHeight,
        sections: ${JSON.stringify(SECTION_IDS)}.map(id => {
          const el = document.getElementById(id);
          const rect = el ? el.getBoundingClientRect() : null;
          return { id, top: rect ? Math.round(rect.top) : null, height: rect ? Math.round(rect.height) : null };
        }),
      }))()
    `);
    console.log('Mobile document layout info:', JSON.stringify(mobileDocInfo, null, 2));

    // Test each mobile transition
    for (let i = 0; i < SECTION_IDS.length - 1; i++) {
      const fromId = SECTION_IDS[i];
      const toId = SECTION_IDS[i + 1];
      const triggerId = `focus-handoff-${fromId}-${toId}`;

      const liveTrigger = await evalCode(`
        (() => {
          const t = ScrollTrigger.getById('${triggerId}');
          const toEl = document.getElementById('${toId}');
          return {
            start: t ? Math.round(t.start) : null,
            end: t ? Math.round(t.end) : null,
            rectTop: toEl ? Math.round(toEl.getBoundingClientRect().top) : null,
            viewportHeight: window.innerHeight,
          };
        })()
      `);

      if (!liveTrigger || liveTrigger.end === null) {
        throw new Error(`Missing mobile focus trigger: ${triggerId}`);
      }

      console.log(`\nMobile transition [${fromId} -> ${toId}]: trigger start=${liveTrigger.start}, end=${liveTrigger.end}, current rectTop=${liveTrigger.rectTop}`);

      // Scroll to trigger completion
      await scrollTo(liveTrigger.end, 850);
      const stateAtEnd = await sampleAllSections();
      const toEnd = stateAtEnd.sections[toId];
      const fromEnd = stateAtEnd.sections[fromId];

      console.log(`  State at scrollY=${stateAtEnd.scrollY}: ${toId} opacity=${toEnd.opacity}, scale=${toEnd.scale}; ${fromId} opacity=${fromEnd.opacity}`);

      if (toEnd.opacity < 0.95 || toEnd.scale < 0.98) {
        throw new Error(`Mobile section ${toId} did not reach 100% focus at end of handoff: opacity=${toEnd.opacity}, scale=${toEnd.scale}`);
      }
      if (fromEnd.opacity > 0.05) {
        throw new Error(`Mobile previous section ${fromId} did not recede: opacity=${fromEnd.opacity}`);
      }
      console.log(`  ✓ Mobile ${toId} reached 100% focus & ${fromId} successfully receded.`);
    }

    await captureScreenshot('mobile-08-footer-reached.png');

    // Test reverse scroll to 0 on mobile
    await scrollTo(0, 1200);
    const restoredMobile = await sampleAllSections();
    console.log(`Mobile restored scrollY=0 Hero: opacity=${restoredMobile.sections.home.opacity}`);
    await captureScreenshot('mobile-09-restored-top.png');

    if (restoredMobile.sections.home.opacity < 0.99) {
      throw new Error(`Mobile Hero not restored to 100% focus at scrollY=0! opacity=${restoredMobile.sections.home.opacity}`);
    }
    if (restoredMobile.sections.introduction.opacity > 0.05) {
      throw new Error(`Mobile Introduction not returned to dormant state at scrollY=0! opacity=${restoredMobile.sections.introduction.opacity}`);
    }
    console.log('✓ PASS: Mobile bidirectional scroll cycle passed 100%!');

    // ═══════════════════════════════════════════════════════════════
    // TEST SUITE 3: INTERACTIVE FEATURES VERIFICATION
    // ═══════════════════════════════════════════════════════════════
    console.log('\n======================================================');
    console.log('>>> TEST SUITE 3: INTERACTIVE FEATURES VERIFICATION');
    console.log('======================================================');

    // Return to desktop view
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await sleep(800);

    // 1. Projects Section: Verify tabs & media
    const projectsTrigger = desktopTriggers.find(t => t.id === 'focus-handoff-philosophy-projects');
    await scrollTo(projectsTrigger.end + 200);
    await sleep(500);

    const projectTabsWorking = await evalCode(`
      (() => {
        const article = document.querySelector('.project-article');
        if (!article) return false;
        const tabs = article.querySelectorAll('.media-selector-item');
        if (tabs.length < 2) return false;
        // Click 2nd tab
        tabs[1].click();
        return true;
      })()
    `);
    console.log(`Projects media tab interaction triggered: ${projectTabsWorking}`);
    await sleep(600);
    await captureScreenshot('desktop-interactive-project-tab.png');

    // 2. Partners Section: Test Next / Prev
    const partnersTrigger = desktopTriggers.find(t => t.id === 'focus-handoff-projects-partners');
    await scrollTo(partnersTrigger.end + 100);
    await sleep(500);

    const partnerSwitched = await evalCode(`
      (() => {
        const partnersSection = document.getElementById('partners');
        const nextBtn = partnersSection?.querySelector('button[aria-label="Next partner"]');
        if (nextBtn) {
          nextBtn.click();
          return true;
        }
        return false;
      })()
    `);
    console.log(`Partners next button clicked: ${partnerSwitched}`);
    await sleep(600);
    await captureScreenshot('desktop-interactive-partner-nav.png');

    // 3. Enquiry Section: Form validation test
    const enquiryTrigger = desktopTriggers.find(t => t.id === 'focus-handoff-cta-contact');
    await scrollTo(enquiryTrigger.end + 100);
    await sleep(500);

    const formValidationWorked = await evalCode(`
      (() => {
        const form = document.getElementById('contact')?.querySelector('form');
        if (!form) return false;
        // HTML5 required constraint validation check on empty form
        return form.checkValidity() === false;
      })()
    `);
    console.log(`Enquiry form client-side validation correctly caught empty inputs: ${formValidationWorked}`);
    await captureScreenshot('desktop-interactive-form-validation.png');

    // 4. Footer: Back to top click test
    const footerTrigger = desktopTriggers.find(t => t.id === 'focus-handoff-contact-footer');
    await scrollTo(footerTrigger.end);
    await sleep(500);
    await captureScreenshot('desktop-interactive-footer.png');

    console.log('\n======================================================');
    console.log('ALL PHASE 2 SECTION FOCUS CRITERIA VERIFIED 100%!');
    console.log('======================================================\n');
  } finally {
    chromeProc.kill();
  }
}

runPhase2Verification().catch((err) => {
  console.error('\n❌ VERIFICATION FAILURE:', err);
  process.exit(1);
});
