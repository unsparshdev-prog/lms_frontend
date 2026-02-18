const STORAGE_KEY = 'lms_request_counter';

export function generateUniqueId(): string {
  const year = new Date().getFullYear();
  const key = `${STORAGE_KEY}_${year}`;
  let counter = parseInt(localStorage.getItem(key) || '0', 10);
  counter += 1;
  localStorage.setItem(key, counter.toString());
  const runningNumber = counter.toString().padStart(4, '0');
  return `LMS-${year}-${runningNumber}`;
}
