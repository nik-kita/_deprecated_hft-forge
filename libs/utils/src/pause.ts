export function pause(mms = 2_000) {
  return new Promise((resolve) => void setTimeout(resolve, mms));
}
