// https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener#passive

import { inBrowser } from '.';

export let supportsPassive = false;

if (inBrowser) {
  try {
    const opts = {};
    Object.defineProperty(opts, 'passive', {
      get() {
        supportsPassive = true;
      }
    });
    window.addEventListener('test-passive', null as any, opts);
  } catch (e) {}
}
