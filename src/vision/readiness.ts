import { panelUnavailableReason } from './dom';
import { throwIfAborted } from './limits';
import type { CapturePanel } from './types';

/** Let remounted content settle and paint after scrolling, without refreshing data. */
export async function waitForPanelPaint(panel: CapturePanel, signal: AbortSignal): Promise<void> {
  throwIfAborted(signal);
  await new Promise<void>((resolve, reject) => {
    let quiet: ReturnType<typeof setTimeout>;
    let frame = 0;
    const cleanup = () => {
      observer.disconnect();
      clearTimeout(quiet);
      clearTimeout(deadline);
      cancelAnimationFrame(frame);
      signal.removeEventListener('abort', abort);
    };
    const fail = (error: unknown) => {
      cleanup();
      reject(error);
    };
    const abort = () => fail(signal.reason ?? new DOMException('Aborted', 'AbortError'));
    const verify = () => {
      const unavailable = panelUnavailableReason(panel);
      if (unavailable) {
        fail(new Error(unavailable));
        return;
      }
      cleanup();
      resolve();
    };
    const schedule = () => {
      clearTimeout(quiet);
      cancelAnimationFrame(frame);
      quiet = setTimeout(() => {
        frame = requestAnimationFrame(() => {
          frame = requestAnimationFrame(verify);
        });
      }, 400);
    };
    const observer = new MutationObserver(schedule);
    const deadline = setTimeout(
      () => fail(new Error('The panel did not settle before capture; try again after rendering finishes.')),
      5000
    );
    observer.observe(panel.element, { attributes: true, childList: true, characterData: true, subtree: true });
    signal.addEventListener('abort', abort, { once: true });
    schedule();
  });
}
