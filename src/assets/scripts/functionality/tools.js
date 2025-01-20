export const browser_cr = chrome ? chrome : browser;

export function getIs12HourFormat() {
  let is12HourFormat = false; // Default fallback
  try {
      is12HourFormat = new Date().toLocaleString('en', { hour: '2-digit', hour12: true }).indexOf(':') !== -1;
  } catch (error) {
      console.warn('Error determining time format:', error);
  }
  return is12HourFormat;
}