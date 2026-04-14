/**
 * UserFactory — Generate realistic user data for tests
 * Pattern: Builder — chain methods, call build() to get the object
 */

import type { Region } from '@constants/urls';

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  region: Region;
}

const FIRST_NAMES = {
  VN: ['Nguyen', 'Tran', 'Le', 'Pham', 'Hoang'],
  SG: ['John', 'Sarah', 'Wei', 'Mei', 'Raj'],
};

const LAST_NAMES = {
  VN: ['Van An', 'Thi Bich', 'Minh Duc', 'Thanh Ha', 'Quoc Bao'],
  SG: ['Tan', 'Lee', 'Lim', 'Wong', 'Kumar'],
};

let sequence = 0;

export class UserFactory {
  private data: Partial<UserData> = {};

  static create(region: Region = 'SG'): UserFactory {
    return new UserFactory().withRegion(region);
  }

  withRegion(region: Region): this {
    this.data.region = region;
    return this;
  }

  withEmail(email: string): this {
    this.data.email = email;
    return this;
  }

  withPassword(password: string): this {
    this.data.password = password;
    return this;
  }

  withPhone(phone: string): this {
    this.data.phone = phone;
    return this;
  }

  build(): UserData {
    const region = this.data.region ?? 'SG';
    const id = ++sequence;
    const ts = Date.now();
    const firstNames = FIRST_NAMES[region];
    const lastNames = LAST_NAMES[region];
    const firstName = firstNames[id % firstNames.length];
    const lastName = lastNames[id % lastNames.length];

    return {
      firstName,
      lastName,
      email: this.data.email ?? `test.user.${ts}.${id}@decathlon.test`,
      password: this.data.password ?? 'Test@12345',
      phone: this.data.phone ?? (region === 'VN' ? `090${String(ts).slice(-7)}` : `8${String(ts).slice(-7)}`),
      region,
      ...this.data,
    };
  }

  static buildMany(count: number, region: Region = 'SG'): UserData[] {
    return Array.from({ length: count }, () => UserFactory.create(region).build());
  }
}
