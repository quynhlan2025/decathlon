/**
 * PageFactory — Centralised page object instantiation
 * Pattern: Factory Method
 * Usage: PageFactory.getPage(page, 'Category', 'SG')
 */

import { Page } from '@playwright/test';
import { HomePage } from './home.page';
import { ProductDetailPage } from './product-detail.page';
import { CartPage } from './cart.page';
import { CheckoutPage } from './checkout.page';
import { SearchResultsPage } from './search-results.page';
import { CategoryPage } from './category.page';
import { LoginPage } from './login.page';
import { AccountPage } from './account.page';
import { WishlistPage } from './wishlist.page';
import type { Region } from '@constants/urls';

type PageName =
  | 'Home'
  | 'ProductDetail'
  | 'Cart'
  | 'Checkout'
  | 'SearchResults'
  | 'Category'
  | 'Login'
  | 'Account'
  | 'Wishlist';

export class PageFactory {
  static getPage(page: Page, pageName: PageName, region: Region = 'SG') {
    switch (pageName) {
      case 'Home':           return new HomePage(page, region);
      case 'ProductDetail':  return new ProductDetailPage(page);
      case 'Cart':           return new CartPage(page);
      case 'Checkout':       return new CheckoutPage(page, region);
      case 'SearchResults':  return new SearchResultsPage(page);
      case 'Category':       return new CategoryPage(page, region);
      case 'Login':          return new LoginPage(page);
      case 'Account':        return new AccountPage(page);
      case 'Wishlist':       return new WishlistPage(page);
      default:
        throw new Error(`Page "${pageName}" not found in PageFactory`);
    }
  }
}
