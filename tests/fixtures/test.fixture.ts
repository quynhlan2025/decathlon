/**
 * test.fixture.ts — Playwright fixtures (Dependency Injection)
 * Injects: pages, actors, API clients, softAssert
 * Region auto-detected from project name (VN | SG | VN-mobile | SG-mobile ...)
 */

import { test as baseTest, request } from '@playwright/test';
import { BuyerActor } from '@actors/buyer.actor';
import { SellerActor } from '@actors/seller.actor';
import { HomePage } from '@ui/pages/home.page';
import { CartPage } from '@ui/pages/cart.page';
import { CheckoutPage } from '@ui/pages/checkout.page';
import { ProductDetailPage } from '@ui/pages/product-detail.page';
import { SearchResultsPage } from '@ui/pages/search-results.page';
import { CategoryPage } from '@ui/pages/category.page';
import { LoginPage } from '@ui/pages/login.page';
import { AccountPage } from '@ui/pages/account.page';
import { WishlistPage } from '@ui/pages/wishlist.page';
import { ProductApiClient } from '@api/clients/product.api';
import { CartApiClient } from '@api/clients/cart.api';
import { AuthApiClient } from '@api/clients/auth.api';
import { OrderApiClient } from '@api/clients/order.api';
import { SoftAssert } from '@utils/soft-assert';
import { PopupHandler } from '@utils/popup-handler';
import { getUrlConfig, type Region } from '@constants/urls';

interface Pages {
  home: HomePage;
  cart: CartPage;
  checkout: CheckoutPage;
  productDetail: ProductDetailPage;
  searchResults: SearchResultsPage;
  category: CategoryPage;
  login: LoginPage;
  account: AccountPage;
  wishlist: WishlistPage;
}

interface ApiClients {
  products: ProductApiClient;
  cart: CartApiClient;
  auth: AuthApiClient;
  orders: OrderApiClient;
}

const test = baseTest.extend<{
  region: Region;
  buyer: BuyerActor;
  seller: SellerActor;
  pages: Pages;
  api: ApiClients;
  softAssert: SoftAssert;
}>({
  region: async ({}, use, testInfo) => {
    await use(testInfo.project.name.split('-')[0] as Region);
  },

  // ─── Auto-dismiss regional popups on every page load ───────
  page: async ({ page }, use, testInfo) => {
    const region = testInfo.project.name.split('-')[0] as Region;
    if (region === 'VN' || region === 'SG') {
      PopupHandler.setup(page, region);
    }
    await use(page);
  },

  buyer: async ({ page }, use, testInfo) => {
    const region = testInfo.project.name.split('-')[0] as Region;
    await use(new BuyerActor(page, region));
  },

  seller: async ({ page }, use, testInfo) => {
    const region = testInfo.project.name.split('-')[0] as Region;
    await use(new SellerActor(page, region));
  },

  pages: async ({ page }, use, testInfo) => {
    const region = testInfo.project.name.split('-')[0] as Region;
    await use({
      home:          new HomePage(page, region),
      cart:          new CartPage(page),
      checkout:      new CheckoutPage(page, region),
      productDetail: new ProductDetailPage(page),
      searchResults: new SearchResultsPage(page),
      category:      new CategoryPage(page, region),
      login:         new LoginPage(page),
      account:       new AccountPage(page),
      wishlist:      new WishlistPage(page),
    });
  },

  api: async ({}, use, testInfo) => {
    const region = testInfo.project.name.split('-')[0] as Region;
    const env = (process.env.ENV || 'prod') as 'dev' | 'prod';
    const { baseURL } = getUrlConfig(region, env);
    const ctx = await request.newContext({ baseURL });
    await use({
      products: new ProductApiClient(ctx, baseURL, region),
      cart:     new CartApiClient(ctx, baseURL, region),
      auth:     new AuthApiClient(ctx, baseURL),
      orders:   new OrderApiClient(ctx, baseURL, region),
    });
    await ctx.dispose();
  },

  softAssert: async ({}, use) => {
    const soft = new SoftAssert();
    await use(soft);
    soft.throwIfFailed();
  },
});

export default test;
export const expect = test.expect;
