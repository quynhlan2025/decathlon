/**
 * AddressFactory — Generate shipping addresses per region
 */

import type { Region } from '@constants/urls';

export interface VNAddress {
  region: 'VN';
  street: string;
  ward: string;
  district: string;
  province: string;
}

export interface SGAddress {
  region: 'SG';
  street: string;
  postalCode: string;
  unitNumber?: string;
  city: 'Singapore';
}

export type Address = VNAddress | SGAddress;

const VN_ADDRESSES: Omit<VNAddress, 'region'>[] = [
  { street: '123 Nguyen Hue', ward: 'Phường Bến Nghé', district: 'Quận 1', province: 'Hồ Chí Minh' },
  { street: '456 Le Loi', ward: 'Phường Bến Thành', district: 'Quận 1', province: 'Hồ Chí Minh' },
  { street: '789 Tran Hung Dao', ward: 'Phường Cầu Kho', district: 'Quận 1', province: 'Hồ Chí Minh' },
  { street: '10 Ly Thuong Kiet', ward: 'Phường 9', district: 'Quận Tân Bình', province: 'Hồ Chí Minh' },
  { street: '55 Hoang Van Thu', ward: 'Phường 9', district: 'Quận Phú Nhuận', province: 'Hồ Chí Minh' },
];

const SG_ADDRESSES: Omit<SGAddress, 'region' | 'city'>[] = [
  { street: '1 Harbourfront Walk', postalCode: '098585', unitNumber: '#01-01' },
  { street: '313 Orchard Road', postalCode: '238895' },
  { street: '1 Raffles Place', postalCode: '048616', unitNumber: '#B1-01' },
  { street: '10 Bayfront Avenue', postalCode: '018956' },
  { street: '1 Kim Seng Promenade', postalCode: '237994' },
];

let idx = 0;

export class AddressFactory {
  static forRegion(region: 'VN'): VNAddress;
  static forRegion(region: 'SG'): SGAddress;
  static forRegion(region: Region): Address {
    const i = idx++ % 5;
    if (region === 'VN') {
      return { region: 'VN', ...VN_ADDRESSES[i] };
    }
    return { region: 'SG', city: 'Singapore', ...SG_ADDRESSES[i] };
  }

  static invalidPostalCode(): string {
    return 'ABCDEF';
  }

  static invalidVNPhone(): string {
    return '123';
  }

  static invalidSGPhone(): string {
    return 'abc123';
  }
}
