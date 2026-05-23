import { lazyWithMinLoadTime } from './lazyWithMinLoadTime';

test('resolves as soon as the import completes by default', async () => {
  jest.useFakeTimers();

  const promise = lazyWithMinLoadTime(() => Promise.resolve({ default: 'Component' }));
  await Promise.resolve();

  let resolved = false;
  promise.then(() => {
    resolved = true;
  });

  jest.advanceTimersByTime(0);
  await Promise.resolve();

  expect(resolved).toBe(true);

  jest.useRealTimers();
});

test('honors an explicit minimum load time when requested', async () => {
  jest.useFakeTimers();

  const promise = lazyWithMinLoadTime(
    () => Promise.resolve({ default: 'Component' }),
    500
  );
  await Promise.resolve();

  let resolved = false;
  promise.then(() => {
    resolved = true;
  });

  jest.advanceTimersByTime(499);
  await Promise.resolve();
  expect(resolved).toBe(false);

  jest.advanceTimersByTime(1);
  await Promise.resolve();
  expect(resolved).toBe(true);

  jest.useRealTimers();
});
