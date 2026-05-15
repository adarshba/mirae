import { browser } from '$app/environment';
import { createContext } from 'svelte';

const STORAGE_PREFIX = 'mirae:devices:';

const detectDeviceKind = (): DeviceKind => {
  if (!browser) return 'laptop';
  const ua = navigator.userAgent.toLowerCase();
  if (/(smart-?tv|appletv|googletv|hbbtv|netcast|webos|tizen)/.test(ua)) return 'tv';
  if (/(iphone|ipod|android(?!.*tablet)|mobile|phone)/.test(ua)) return 'phone';
  return 'laptop';
};

const detectDeviceLabel = (kind: DeviceKind): string => {
  if (!browser) return 'Unknown device';
  const ua = navigator.userAgent;
  const platform = navigator.platform || 'Unknown';
  if (kind === 'phone') {
    if (/iphone/i.test(ua)) return 'iPhone';
    if (/android/i.test(ua)) return 'Android phone';
    return 'Mobile device';
  }
  if (kind === 'tv') return 'Smart TV';
  if (/mac/i.test(platform)) return 'Mac';
  if (/win/i.test(platform)) return 'Windows PC';
  if (/linux/i.test(platform)) return 'Linux PC';
  return 'Computer';
};

const fetchPublicIp = async (): Promise<string> => {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    if (!res.ok) return 'unknown';
    const data = (await res.json()) as { ip?: string };
    return data.ip ?? 'unknown';
  } catch {
    return 'unknown';
  }
};

const relativeTime = (ts: number): string => {
  if (!Number.isFinite(ts)) return 'recently';
  const diffMs = Date.now() - ts;
  const m = Math.floor(diffMs / 60000);
  if (m < 1) return 'Active now';
  if (m < 60) return `Last active ${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `Last active ${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `Last active ${d}d ago`;
  const formatted = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(ts);
  return `Last active ${formatted}`;
};

const readDevices = (uid: string): TrackedDevice[] => {
  if (!browser) return [];
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + uid);
    return raw ? (JSON.parse(raw) as TrackedDevice[]) : [];
  } catch {
    return [];
  }
};

const writeDevices = (uid: string, list: TrackedDevice[]) => {
  if (!browser) return;
  localStorage.setItem(STORAGE_PREFIX + uid, JSON.stringify(list));
};

export class DeviceStore {
  devices: TrackedDevice[] = $state([]);
  currentDeviceId: string | null = $state(null);

  loadForUser(uid: string | null | undefined) {
    if (!browser || !uid) {
      this.devices = [];
      this.currentDeviceId = null;
      return;
    }
    this.devices = readDevices(uid);
    void this.registerCurrent(uid);
  }

  private async registerCurrent(uid: string) {
    const kind = detectDeviceKind();
    const label = detectDeviceLabel(kind);
    const ip = await fetchPublicIp();
    const id = `${kind}-${ip}`;
    const now = Date.now();

    const existing = this.devices.find((d) => d.id === id);
    if (existing) {
      existing.lastSeen = now;
      existing.ip = ip;
      existing.label = label;
      existing.kind = kind;
    } else {
      this.devices.push({ id, kind, label, ip, lastSeen: now });
    }
    this.currentDeviceId = id;
    writeDevices(uid, $state.snapshot(this.devices) as TrackedDevice[]);
  }

  signOutDevice(uid: string, id: string) {
    if (!uid) return;
    this.devices = this.devices.filter((d) => d.id !== id);
    writeDevices(uid, $state.snapshot(this.devices) as TrackedDevice[]);
  }

  signOutAll(uid: string) {
    if (!uid) return;
    this.devices = this.devices.filter((d) => d.id === this.currentDeviceId);
    writeDevices(uid, $state.snapshot(this.devices) as TrackedDevice[]);
  }

  statusFor(device: TrackedDevice): string {
    const time = device.id === this.currentDeviceId ? 'Active now' : relativeTime(device.lastSeen);
    return `${time} · IP ${device.ip}`;
  }
}

export const [getDeviceContext, setDeviceContext] = createContext<DeviceStore>();
