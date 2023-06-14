export function log(label: string, message: string) {
  return console.log(`%c ${label} %c ${message}`, 'background:#000;color:#fff;border-top-left-radius:4px;border-bottom-left-radius:4px;padding:4px', 'background:#ddd;border-top-right-radius:4px;border-bottom-right-radius:4px;padding:4px;color:#000');
}

export function error(label: string, ...message: any) {
  console.groupCollapsed(`%c ERROR %c${label}`, 'background:#eb1168;color:#fff;border-top-left-radius:4px;border-bottom-left-radius:4px;padding:4px','background:#ddd;border-top-right-radius:4px;border-bottom-right-radius:4px;padding:4px;color:#000');
  console.log(...message);
  console.groupEnd();
}

export function warn(label: string, ...message: any) {
  console.groupCollapsed(`%c WARN %c${label}`, 'background:#ffcc00;color:#fff;border-top-left-radius:4px;border-bottom-left-radius:4px;padding:4px','background:#ddd;border-top-right-radius:4px;border-bottom-right-radius:4px;padding:4px;color:#000');
  console.log(...message);
  console.groupEnd();
}

export function info(label: string, ...message: any) {
  console.groupCollapsed(`%c INFO %c${label}`, 'background:#028f55;color:#fff;border-top-left-radius:4px;border-bottom-left-radius:4px;padding:4px','background:#ddd;border-top-right-radius:4px;border-bottom-right-radius:4px;padding:4px;color:#000');
  console.log(...message);
  console.groupEnd();
}