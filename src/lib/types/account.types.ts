// Account / billing / device-management shapes. Ambient.

declare global {
  type DeviceKind = 'tv' | 'phone' | 'laptop';

  type Device = {
    id: string;
    kind: DeviceKind;
    label: string;
    status: string;
  };

  type TrackedDevice = {
    id: string;
    kind: DeviceKind;
    label: string;
    ip: string;
    lastSeen: number;
  };

  type AccountPlan = 'basic' | 'standard' | 'premium';

  type Account = {
    phoneMasked: string;
    paymentMethod: string;
    nextBilling: string;
    plan: AccountPlan;
    planPrice: string;
    memberSince: string;
    devices: Device[];
  };
}

export {};
