import { waitForPanelPaint } from './readiness';
import type { CapturePanel } from './types';

jest.mock('./dom', () => ({ panelUnavailableReason: jest.fn(() => undefined) }));
describe('render settling before capture', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());
  const panel = () => ({ element: document.createElement('section') }) as CapturePanel;
  test('waits for a quiet interval and paint frames', async () => {
    let finished = false;
    const waiting = waitForPanelPaint(panel(), new AbortController().signal).then(() => {
      finished = true;
    });
    await jest.advanceTimersByTimeAsync(399);
    expect(finished).toBe(false);
    await jest.advanceTimersByTimeAsync(100);
    await waiting;
    expect(finished).toBe(true);
    expect(jest.getTimerCount()).toBe(0);
  });
  test('mutations restart the quiet interval', async () => {
    const target = panel();
    let finished = false;
    const waiting = waitForPanelPaint(target, new AbortController().signal).then(() => {
      finished = true;
    });
    await jest.advanceTimersByTimeAsync(300);
    target.element.textContent = 'newly rendered chart';
    await Promise.resolve();
    await jest.advanceTimersByTimeAsync(399);
    expect(finished).toBe(false);
    await jest.advanceTimersByTimeAsync(100);
    await waiting;
  });
  test('abort cancels timers and rejects instead of capturing late', async () => {
    const controller = new AbortController();
    const waiting = waitForPanelPaint(panel(), controller.signal);
    const rejection = expect(waiting).rejects.toMatchObject({ name: 'AbortError' });
    controller.abort();
    await rejection;
    expect(jest.getTimerCount()).toBe(0);
  });
});
