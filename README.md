# Decathlon Playwright Automation Framework

> Enterprise-grade E2E automation framework cho **Decathlon VN** & **Decathlon SG**  
> Stack: Playwright · TypeScript · Hybrid Architecture (POM + Screenplay Pattern + Strategy)  
> Target: **1,260+ test runs** (252 unique tests × 5 projects)

---

## Mục lục

- [Kiến trúc tổng quan](#kiến-trúc-tổng-quan)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Path Aliases](#path-aliases)
- [Cài đặt](#cài-đặt)
- [Chạy test](#chạy-test)
- [Projects & Regions](#projects--regions)
- [Tag Taxonomy](#tag-taxonomy)
- [Design Patterns](#design-patterns)
- [Tầng API](#tầng-api)
- [Data Layer](#data-layer)
- [Visual Regression](#visual-regression)
- [CI/CD](#cicd)
- [Thêm test mới](#thêm-test-mới)
- [Test Count Summary](#test-count-summary)

---

## Kiến trúc tổng quan

Framework áp dụng **Hybrid Architecture** — kết hợp điểm mạnh của POM và Screenplay Pattern:

```
┌──────────────────────────────────────────────────────────────────┐
│                         SPEC LAYER                               │
│   tests/specs/{smoke, e2e, regression, api, visual, a11y, perf}  │
│   import test from '@fixtures/test.fixture'                       │
└───────────────────────────┬──────────────────────────────────────┘
                            │ fixtures inject
          ┌─────────────────▼──────────────────────┐
          │             FIXTURE LAYER               │
          │   test.fixture.ts  ←  auth.setup.ts     │
          │   Injects: buyer · seller · pages       │
          │            api · softAssert             │
          └──────┬──────────────┬───────────────────┘
                 │              │
        ┌────────▼───┐   ┌──────▼──────────────────────────┐
        │   ACTORS   │   │          PAGES (POM)             │
        │  buyer     │   │  @ui/pages/  +  @ui/components/  │
        │  seller    │   │  BasePage, 9 pages, 11 components│
        └──────┬─────┘   └──────────────────────────────────┘
               │ delegates to
    ┌──────────▼──────────────────────────────────────────┐
    │                   TASK LAYER                        │
    │  @tasks/  →  LoginTask · SearchTask                 │
    │              AddToCartTask · CheckoutTask            │
    │  Atomic, reusable, builder-pattern API              │
    └──────────────────────┬──────────────────────────────┘
                           │ composed into
    ┌──────────────────────▼──────────────────────────────┐
    │                   FLOW LAYER                        │
    │  @flows/  →  BuyProductFlow · GuestCheckoutFlow     │
    │  Business journeys — no selectors, no assertions     │
    └──────────────────────┬──────────────────────────────┘
                           │ region logic via
    ┌──────────────────────▼──────────────────────────────┐
    │               STRATEGY LAYER                        │
    │  @strategies/  →  VNCheckoutStrategy                │
    │                    SGCheckoutStrategy               │
    │  Eliminates all if/else region checks               │
    └─────────────────────────────────────────────────────┘
```

### Tại sao Hybrid Architecture?

| Tiêu chí | POM thuần | Screenplay thuần | **Hybrid** |
|----------|-----------|-----------------|------------|
| Dễ đọc | ✅ | ⚠️ verbose | ✅ |
| Reusability | ⚠️ | ✅ | ✅ |
| Multi-region | ❌ if/else | ⚠️ | ✅ Strategy |
| Tốc độ viết test | ✅ | ⚠️ | ✅ |
| Tách biệt UI / logic | ⚠️ | ✅ | ✅ |

---

## Cấu trúc thư mục

```
decatong/
│
├── playwright.config.ts           ← 5 projects, auth state, sharding, reporters
├── tsconfig.json                  ← Path aliases @ui/* @actors/* @tasks/* ...
│
└── tests/                         ← TẤT CẢ code nằm trong tests/
    │
    ├── actors/                    ← Orchestration layer (Who)
    │   ├── actor.ts               ← Abstract base: page + region + homePage
    │   ├── buyer.actor.ts         ← BuyerActor — delegates to Tasks & Flows
    │   └── seller.actor.ts        ← SellerActor — admin/backend user
    │
    ├── tasks/                     ← Atomic actions (What — single step)
    │   ├── login.task.ts          ← LoginTask.perform(page, {email, password})
    │   ├── search.task.ts         ← SearchTask.for(page).withKeyword(kw).execute()
    │   ├── add-to-cart.task.ts    ← AddToCartTask.for(page).product(url).execute()
    │   └── checkout.task.ts       ← CheckoutTask.for(page, region).withInfo().execute()
    │
    ├── flows/                     ← Business journeys (multi-step)
    │   ├── buy-product.flow.ts    ← home → search/direct → addToCart
    │   └── guest-checkout.flow.ts ← cart → checkout → payment → confirm
    │
    ├── strategies/                ← Region logic (Strategy Pattern)
    │   ├── checkout.strategy.ts   ← Interface: fillAddress + selectPayment
    │   ├── vn.strategy.ts         ← COD, province/district/ward cascade
    │   ├── sg.strategy.ts         ← Credit card, postal code
    │   └── index.ts               ← getCheckoutStrategy(region)
    │
    ├── ui/                        ← Page Object Model (UI layer)
    │   ├── pages/
    │   │   ├── BasePage.ts        ← 20+ base actions (click, fill, navigate...)
    │   │   ├── VisualBase.ts      ← Screenshot comparison helpers
    │   │   ├── BaseOrderFlow.ts   ← Template Method cho order flow
    │   │   ├── page.factory.ts    ← PageFactory.getPage(page, 'Cart', 'SG')
    │   │   ├── home.page.ts
    │   │   ├── product-detail.page.ts
    │   │   ├── cart.page.ts
    │   │   ├── checkout.page.ts   ← Region-aware: GuestInfo, CheckoutAddress
    │   │   ├── search-results.page.ts
    │   │   ├── category.page.ts
    │   │   ├── login.page.ts
    │   │   ├── account.page.ts
    │   │   └── wishlist.page.ts
    │   └── components/
    │       ├── navbar.component.ts
    │       ├── search.component.ts
    │       ├── navmenu.component.ts     ← Mega menu L1→L2→L3
    │       ├── home-sections.component.ts
    │       ├── filter.component.ts      ← Brand/size/price/sort
    │       ├── product-card.component.ts + ProductGridComponent
    │       ├── footer.component.ts
    │       ├── breadcrumb.component.ts
    │       ├── pagination.component.ts
    │       ├── toast.component.ts
    │       └── chat.component.ts
    │
    ├── fixtures/                  ← Dependency Injection
    │   ├── test.fixture.ts        ← Injects: buyer · seller · pages · api · softAssert
    │   ├── auth.setup.ts          ← Login 1 lần → save storageState → reuse
    │   ├── global-setup.ts
    │   └── global-teardown.ts
    │
    ├── api/                       ← API testing (no browser)
    │   ├── base/ApiClient.ts      ← Base HTTP client (GET/POST/PUT/DELETE)
    │   └── clients/
    │       ├── product.api.ts     ← Search, PDP, category listing
    │       ├── cart.api.ts        ← CRUD giỏ hàng
    │       ├── auth.api.ts        ← Login, register, token
    │       └── order.api.ts       ← Tạo đơn, track, cancel
    │
    ├── assertions/                ← Domain assertion helpers
    │   ├── product.assertions.ts  ← assertPDPLoaded, assertPriceFormat...
    │   └── cart.assertions.ts     ← assertCartNotEmpty, assertTotalFormat...
    │
    ├── factories/                 ← Test data generation (Builder pattern)
    │   ├── user.factory.ts        ← UserFactory.create('SG').withEmail().build()
    │   ├── address.factory.ts     ← VN provinces / SG postal codes
    │   └── product.factory.ts     ← Product URLs + metadata per region
    │
    ├── data/                      ← Static test data constants
    │   ├── product-data.ts        ← PRODUCT_DATA, PRODUCTS, SEARCH_KEYWORDS
    │   ├── checkout-data.ts       ← CHECKOUT_TEST_DATA, GUEST_USERS
    │   └── auth-data.ts           ← VALID_ACCOUNTS, INVALID_CREDENTIALS, TEST_ACCOUNTS
    │
    ├── constants/                 ← Shared config & constants
    │   ├── urls.ts                ← URL map: dev/prod × VN/SG + getUrlConfig()
    │   ├── routes.ts              ← ROUTES: HOME, LOGIN, CART, CHECKOUT...
    │   ├── test-data.ts           ← TEST_ACCOUNTS (credentials)
    │   ├── tags.ts                ← Tag constants @p0 @smoke @visual ...
    │   └── selectors.ts           ← Centralized CSS/data-testid selectors
    │
    ├── specs/                     ← Test files (testDir)
    │   ├── smoke/                 ← @smoke @p0 (~6 tests, < 5 phút)
    │   │   ├── homepage.smoke.spec.ts
    │   │   ├── search.smoke.spec.ts
    │   │   └── add-to-cart.smoke.spec.ts
    │   ├── e2e/                   ← Full user journeys
    │   │   ├── guest-checkout.e2e.spec.ts
    │   │   ├── logged-in-checkout.e2e.spec.ts
    │   │   ├── search-to-purchase.e2e.spec.ts
    │   │   ├── wishlist-to-cart.e2e.spec.ts
    │   │   ├── account-management.e2e.spec.ts
    │   │   └── multi-region.e2e.spec.ts
    │   ├── regression/            ← Domain-organized regression suite
    │   │   ├── homepage/          ← hero, sections, footer
    │   │   ├── navigation/        ← main-nav, breadcrumb
    │   │   ├── search/            ← basic, filters, suggestions
    │   │   ├── category/          ← category-page, subcategory
    │   │   ├── product/           ← product-detail, gallery
    │   │   ├── cart/              ← add, update-qty, remove
    │   │   ├── checkout/          ← shipping, payment
    │   │   ├── auth/              ← login, register
    │   │   ├── account/           ← profile
    │   │   └── wishlist/          ← wishlist
    │   ├── api/                   ← API tests (no browser)
    │   │   ├── auth-api.spec.ts
    │   │   └── product-api.spec.ts
    │   ├── visual/                ← Screenshot comparison
    │   │   ├── homepage-visual.spec.ts
    │   │   └── pdp-visual.spec.ts
    │   ├── accessibility/         ← WCAG 2.1 AA audit
    │   │   └── a11y.spec.ts
    │   └── performance/           ← Core Web Vitals
    │       └── core-web-vitals.spec.ts
    │
    └── utils/                     ← Shared utilities
        ├── logger.ts              ← Structured logger: debug/info/warn/error/step
        ├── soft-assert.ts         ← Collect failures, throw once at end
        ├── custom-matchers.ts     ← toBeValidPrice(), toBeDecathlonUrl()
        ├── browser-manager.ts
        ├── common.ts              ← Formatters, retry, FormHelper, TableHelper
        └── screenshot.ts
```

---

## Path Aliases

Tất cả imports dùng `@*` aliases — không có relative paths `../../`:

```typescript
import test, { expect }       from '@fixtures/test.fixture';
import { BuyerActor }          from '@actors/buyer.actor';
import { LoginTask }            from '@tasks/login.task';
import { BuyProductFlow }       from '@flows/buy-product.flow';
import { getCheckoutStrategy }  from '@strategies/index';
import { HomePage }             from '@ui/pages/home.page';
import { SearchComponent }      from '@ui/components/search.component';
import { ProductApiClient }     from '@api/clients/product.api';
import { ProductAssertions }    from '@assertions/product.assertions';
import { UserFactory }          from '@factories/user.factory';
import { PRODUCTS }             from '@data/product-data';
import { getUrlConfig }         from '@constants/urls';
import { logger }               from '@utils/logger';
```

| Alias | Trỏ đến |
|-------|---------|
| `@ui/*` | `tests/ui/*` |
| `@actors/*` | `tests/actors/*` |
| `@tasks/*` | `tests/tasks/*` |
| `@flows/*` | `tests/flows/*` |
| `@strategies/*` | `tests/strategies/*` |
| `@api/*` | `tests/api/*` |
| `@factories/*` | `tests/factories/*` |
| `@assertions/*` | `tests/assertions/*` |
| `@data/*` | `tests/data/*` |
| `@constants/*` | `tests/constants/*` |
| `@fixtures/*` | `tests/fixtures/*` |
| `@utils/*` | `tests/utils/*` |

---

## Cài đặt

```bash
# 1. Clone repo
git clone <repo-url>
cd decatong

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install chromium
# Hoặc cài tất cả:
npx playwright install --with-deps

# 4. Verify TypeScript compiles clean
npx tsc --noEmit
```

---

## Chạy test

### Nhanh (khuyến nghị khi dev)

```bash
npm run test:sg           # SG desktop
npm run test:vn           # VN desktop
npm run test:headed       # Xem browser chạy
npm run test:debug        # Debug mode — pause và inspect
```

### Theo tag

```bash
# Smoke — kiểm tra nhanh trước merge (< 5 phút)
npx playwright test --grep "@smoke"

# P0 + P1 critical path
npx playwright test --grep "@p0|@p1"

# Một domain cụ thể
npx playwright test --grep "@search"
npx playwright test --grep "@cart"
npx playwright test --grep "@checkout"

# Bỏ qua slow tests
npx playwright test --grep-invert "@visual|@performance"

# Chuyên biệt
npx playwright test --grep "@visual"
npx playwright test --grep "@api"
npx playwright test --grep "@a11y"
npx playwright test --grep "@performance"
```

### Theo project (region)

```bash
npx playwright test --project=VN
npx playwright test --project=SG
npx playwright test --project=VN-mobile --grep "@mobile"
npx playwright test --project=SG-webkit
```

### Theo thư mục / file

```bash
# Cả regression suite
npx playwright test tests/specs/regression/

# Một domain
npx playwright test tests/specs/regression/search/
npx playwright test tests/specs/regression/cart/

# Một file cụ thể
npx playwright test tests/specs/regression/cart/add-to-cart.spec.ts

# Smoke
npx playwright test tests/specs/smoke/

# API tests (headless, nhanh)
npx playwright test tests/specs/api/
```

### CI sharding

```bash
npx playwright test --shard=1/4
npx playwright test --shard=2/4
npx playwright test --shard=3/4
npx playwright test --shard=4/4
```

### Xem báo cáo

```bash
npm run report
# Hoặc:
npx playwright show-report
```

---

## Projects & Regions

| Project | Browser | Region | Locale | Khi nào chạy |
|---------|---------|--------|--------|--------------|
| `VN` | Chromium desktop | decathlon.vn | vi-VN | Mặc định |
| `SG` | Chromium desktop | decathlon.sg | en-SG | Mặc định |
| `VN-mobile` | Pixel 5 | decathlon.vn | vi-VN | Chỉ `@mobile` |
| `SG-mobile` | iPhone 12 | decathlon.sg | en-SG | Chỉ `@mobile` |
| `SG-webkit` | Desktop Safari | decathlon.sg | en-SG | Chỉ `smoke/` |

**Auth state caching:** `auth.setup.ts` login 1 lần → lưu `playwright/.auth/*.json` → tất cả tests reuse, tiết kiệm thời gian đáng kể.

---

## Tag Taxonomy

| Tag | Ý nghĩa | Số tests |
|-----|---------|---------|
| `@p0` | Production blocker — phải pass trước deploy | ~6 |
| `@p1` | Critical path — chạy mỗi PR | ~80 |
| `@p2` | Important — chạy mỗi đêm | ~150 |
| `@smoke` | Quick health check (< 5 phút) | ~6 |
| `@regression` | Full regression suite | ~200+ |
| `@vn-only` | Chỉ chạy trên VN project | varies |
| `@sg-only` | Chỉ chạy trên SG project | varies |
| `@visual` | Screenshot comparison | ~4 |
| `@api` | API-only (no browser) | ~20 |
| `@a11y` | Accessibility audit | ~5 |
| `@performance` | Core Web Vitals | ~5 |
| `@mobile` | Mobile viewport | varies |

---

## Design Patterns

### 1. Strategy Pattern — Loại bỏ if/else region logic

Thay vì `if (region === 'SG')` rải rác trong codebase, mỗi region có strategy riêng:

```typescript
// ❌ Trước — if/else rải rác
if (region === 'VN') {
  await checkout.fillProvince('Hồ Chí Minh');
  await checkout.selectCOD();
} else {
  await checkout.fillPostalCode('238888');
  await checkout.selectCreditCard();
}

// ✅ Sau — Strategy Pattern
const strategy = getCheckoutStrategy(region); // tự chọn đúng strategy
await strategy.fillAddress(checkout, address);
await strategy.selectDefaultPayment(checkout);
```

### 2. Task Layer — Atomic Reusable Actions

Tasks encapsulate một hành động duy nhất với Builder API:

```typescript
// Fluent builder API
await LoginTask.for(page)
  .withCredentials(email, password)
  .execute();

// Hoặc shorthand static method
await LoginTask.perform(page, { email, password });

await AddToCartTask.for(page)
  .product('/sg/p/bike-riverside-500.html')
  .withSize(1)
  .execute();
```

### 3. Flow Layer — Business Journeys

Flows compose nhiều Tasks thành một user journey hoàn chỉnh:

```typescript
// Tests chỉ cần 1 dòng
await BuyProductFlow.run(page, { productUrl, region });

// Hoặc qua Actor
await buyer.buyProduct(productUrl);
await buyer.buyProductBySearch('running shoes');
await buyer.completeGuestCheckout({ region, guestInfo, address });
```

### 4. Actor Pattern — User Roles

Actors là facade cho Tasks + Flows, giữ context (page, region):

```typescript
// BuyerActor — tất cả action của một buyer
const result = await buyer.completeGuestCheckout({
  region: 'SG',
  guestInfo: { fullName: 'John Tan', phone: '91234567' },
  address: { postalCode: '238888' },
});
expect(result.orderNumber).toMatch(/\w+/);
```

### 5. Page Object Model (POM)

Pages và Components là pure UI wrappers — không chứa business logic:

```typescript
// Spec chỉ thao tác qua page object
test('cart has items', async ({ pages }) => {
  await pages.cart.goto();
  const count = await pages.cart.getItemCount();
  expect(count).toBeGreaterThan(0);
});
```

### 6. Fixtures — Dependency Injection

Tất cả dependencies được inject tự động theo region:

```typescript
// Region tự động từ project name (VN / SG / VN-mobile / SG-mobile)
test('example', async ({ buyer, pages, api, softAssert }) => {
  buyer.getRegion();        // → 'SG' hoặc 'VN'
  pages.home.goto();        // homepage theo region
  api.products.search(...); // API client đúng base URL
});
```

### 7. Soft Assertions

Thu thập nhiều failures, throw 1 lần ở cuối:

```typescript
test('all cards have names and prices', async ({ pages, softAssert }) => {
  const count = await pages.searchResults.productGrid.getCount();
  for (let i = 0; i < count; i++) {
    await softAssert.assertAsync(
      async () => expect(await pages.searchResults.productGrid.getCard(i).getName()).not.toBe(''),
      `Card ${i} has name`
    );
  }
  // softAssert tự throw ở cuối nếu có failures
});
```

### 8. Custom Matchers

```typescript
expect(price).toBeValidPrice('SG');     // kiểm tra $xx.xx hoặc SGD
expect(price).toBeValidPrice('VN');     // kiểm tra xxxđ hoặc VND
expect(url).toBeDecathlonUrl('SG');     // kiểm tra domain đúng region
```

---

## Tầng API

Tests trong `tests/specs/api/` gọi thẳng API — không cần browser, nhanh hơn 10×:

```typescript
test('search API returns results', async ({ api }) => {
  const response = await api.products.searchProducts('running');
  expect(response.products.length).toBeGreaterThan(0);
});

test('login API rejects wrong password', async ({ api }) => {
  const result = await api.auth.login('user@test.com', 'wrong')
    .catch(e => ({ error: e.message }));
  expect('error' in result).toBe(true);
});
```

---

## Data Layer

### Static test data (`tests/data/`)

```typescript
import { PRODUCTS, PRODUCT_DATA } from '@data/product-data';
import { CHECKOUT_TEST_DATA }      from '@data/checkout-data';
import { VALID_ACCOUNTS }           from '@data/auth-data';

// Region-aware product data
const data = CHECKOUT_TEST_DATA['SG'];
// → { guestInfo, address, paymentMethod, productUrl }

// Named product shortcuts
PRODUCTS.running_shoes.url  // SG product URL (skeleton)
PRODUCTS.shirt.url           // VN product URL
```

### Factories (`tests/factories/`)

```typescript
// User Factory — Builder pattern
const buyer = UserFactory.create('SG')
  .withEmail('custom@test.sg')
  .withPhone('91234567')
  .build();

// Address Factory
const sgAddr = AddressFactory.forRegion('SG');
// → { postalCode: '238888', city: 'Singapore' }

const vnAddr = AddressFactory.forRegion('VN');
// → { province: 'Hồ Chí Minh', district: 'Quận 1', ward: 'Phường Bến Nghé' }

// Product Factory
const product = ProductFactory.getProduct('SG', 0);
```

### Logger (`tests/utils/logger.ts`)

```typescript
import { logger } from '@utils/logger';

logger.info('AddToCartTask', 'added product', { url, qty });
logger.warn('BuyerActor', 'cart was empty, skipping');
logger.error('CheckoutFlow', 'order confirmation not found');
logger.step('GuestCheckoutFlow', 'Step 3: fill shipping address');

// Log level controlled via env var (default: info)
LOG_LEVEL=debug npx playwright test
```

---

## Visual Regression

```bash
# Lần đầu — tạo baseline snapshots
npx playwright test tests/specs/visual/ --update-snapshots

# Các lần sau — so sánh với baseline
npx playwright test tests/specs/visual/

# Snapshots lưu tại:
tests/specs/visual/__snapshots__/
```

Cấu hình masking vùng dynamic:

```typescript
await expect(heroBanner).toHaveScreenshot('hero.png', {
  mask: [page.locator("[class*='price']")],
  maxDiffPixelRatio: 0.02,
});
```

---

## CI/CD

### Smoke (mỗi PR)

```
Push/PR → smoke.yml
  ├── [VN] @smoke @p0  → artifact: smoke-report-VN
  └── [SG] @smoke @p0  → artifact: smoke-report-SG
```

### Regression (mỗi đêm — Thứ 2 đến Thứ 6, 8PM SGT)

```
Schedule → regression.yml
  ├── [VN] shard 1/4  ┐
  ├── [VN] shard 2/4  ├── 8 jobs song song
  ├── [VN] shard 3/4  │   (~60 phút → ~15 phút)
  ├── [VN] shard 4/4  │
  ├── [SG] shard 1/4  │
  ├── [SG] shard 2/4  │
  ├── [SG] shard 3/4  │
  └── [SG] shard 4/4  ┘
       ↓
  merge-reports → HTML report + PR comment
```

**GitHub Secrets:**

| Secret | Giá trị |
|--------|---------|
| `BUYER_VN_EMAIL` | Email tài khoản test VN |
| `BUYER_VN_PASSWORD` | Password |
| `BUYER_SG_EMAIL` | Email tài khoản test SG |
| `BUYER_SG_PASSWORD` | Password |

---

## Thêm test mới

### Thêm test case vào spec có sẵn

```typescript
// tests/specs/regression/search/basic-search.spec.ts
test('TC-SEARCH-BASIC-005: search với ký tự đặc biệt @regression @p2', async ({ buyer }) => {
  await buyer.searchProduct('áo thể thao');
  await expect(buyer.getPage()).toHaveURL(/search|q=/i);
});
```

### Thêm spec file mới

```bash
# 1. Tạo file
touch tests/specs/regression/<domain>/<feature>.spec.ts

# 2. Template
```

```typescript
import test, { expect } from '@fixtures/test.fixture';

test.describe('Regression – <Feature> @regression @p1', () => {
  test('TC-<DOMAIN>-001: <description>', async ({ pages, buyer }) => {
    // ...
  });
});
```

### Thêm Task mới

```typescript
// tests/tasks/my-action.task.ts
export class MyActionTask {
  static for(page: Page): MyActionTask { return new MyActionTask(page); }

  async execute(): Promise<void> {
    return test.step('MyActionTask: do the thing', async () => {
      // ...
    });
  }

  static async perform(page: Page): Promise<void> {
    await new MyActionTask(page).execute();
  }
}
```

### Thêm page mới

```typescript
// tests/ui/pages/new.page.ts
import BasePage from './BasePage';

export class NewPage extends BasePage {
  readonly someLocator: Locator;
  constructor(page: Page) {
    super(page);
    this.someLocator = page.locator('[data-testid="something"]');
  }
  async goto() { await this.navigate('/new-page'); }
}
```

Sau đó thêm vào fixture `Pages` interface trong `tests/fixtures/test.fixture.ts`.

### TC ID Convention

| Domain | Prefix | Ví dụ |
|--------|--------|-------|
| Homepage | `TC-HP-` | `TC-HP-HERO-001` |
| Navigation | `TC-NAV-` | `TC-NAV-MAIN-001` |
| Search | `TC-SEARCH-` | `TC-SEARCH-BASIC-001` |
| Category | `TC-CAT-` | `TC-CAT-001` |
| Product/PDP | `TC-PDP-` | `TC-PDP-001` |
| Cart | `TC-CART-` | `TC-CART-ADD-001` |
| Checkout | `TC-CHECKOUT-` | `TC-CHECKOUT-SHIPPING-001` |
| Auth | `TC-AUTH-` | `TC-AUTH-LOGIN-001` |
| Account | `TC-ACCOUNT-` | `TC-ACCOUNT-PROFILE-001` |
| Wishlist | `TC-WL-` | `TC-WL-001` |
| E2E flows | `TC-E2E-` | `TC-E2E-GUEST-001` |
| API | `TC-API-` | `TC-API-AUTH-001` |
| Visual | `TC-VISUAL-` | `TC-VISUAL-HP-001` |
| A11y | `TC-A11Y-` | `TC-A11Y-001` |
| Performance | `TC-PERF-` | `TC-PERF-001` |

---

## Test Count Summary

| Layer | Spec Files | Tests | × Projects | Total Runs |
|-------|-----------|-------|-----------|-----------|
| Smoke | 3 | 7 | ×2 | 14 |
| E2E | 6 | 12 | ×2 | 24 |
| Regression: Homepage | 3 | 9 | ×2 | 18 |
| Regression: Navigation | 2 | 5 | ×2 | 10 |
| Regression: Search | 3 | 10 | ×2 | 20 |
| Regression: Category | 2 | 5 | ×2 | 10 |
| Regression: Product | 2 | 8 | ×2 | 16 |
| Regression: Cart | 3 | 9 | ×2 | 18 |
| Regression: Checkout | 2 | 5 | ×2 | 10 |
| Regression: Auth | 2 | 6 | ×2 | 12 |
| Regression: Account | 1 | 4 | ×2 | 8 |
| Regression: Wishlist | 1 | 4 | ×2 | 8 |
| API | 2 | ~20 | ×2 | 40 |
| Visual | 2 | 4 | ×2 | 8 |
| Accessibility | 1 | 5 | ×2 | 10 |
| Performance | 1 | 5 | ×2 | 10 |
| **TOTAL** | **36** | **~118** | **×5** | **~590+** |

> Với `fullyParallel: true` và 4 CI shards, toàn bộ suite chạy xong trong ~15 phút.

---

## Scripts tham khảo

```bash
npm test                      # Chạy tất cả (VN + SG)
npm run test:vn               # Chỉ VN desktop
npm run test:sg               # Chỉ SG desktop
npm run test:vn:dev           # VN trên môi trường dev
npm run test:sg:prod          # SG trên production
npm run test:headed           # Xem browser chạy
npm run test:debug            # Debug mode
npm run report                # Mở HTML report
npm run format                # Prettier format
npm run format:check          # Kiểm tra format
```

---

*Framework thiết kế theo chuẩn **Senior/Lead Automation Engineer** — Hybrid Architecture (POM + Screenplay + Strategy), TypeScript path aliases, Dependency Injection, Auth State Caching, CI/CD Sharding, Data-driven testing.*
