// app/models/types.ts
export type BundleType =
  | 'single'
  | 'duo'
  | 'bogo'
  | 'quantity-breaks'
  | 'complete'
  | 'multi-pack';

export type BundleStatus = 'draft' | 'active' | 'inactive';

export interface Bundle {
  id: string;
  name: string;
  type: BundleType;
  status: BundleStatus;
  products: string[]; // Product IDs
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  stats: BundleStats;
  createdAt: string;
  updatedAt: string;
  settings: BundleSettings;
}

export interface BundleStats {
  visitors: number;
  conversionRate: number;
  bundlesRate: number;
  aov: number;
  addedRevenue: number;
  totalRevenue: number;
  revenuePerVisitor: number;
  profitPerVisitor: number;
}

export interface BundleSettings {
  colorTheme?: string;
  title?: string;
  description?: string;
  showSavings?: boolean;
  freeGift?: {
    enabled: boolean;
    products: string[];
  };
  subscription?: {
    enabled: boolean;
    discount: number;
    frequency: 'weekly' | 'monthly';
  };
}

export interface Analytics {
  thisMonthRevenue: number;
  allTimeRevenue: number;
  resetDate: string;
}

export interface BundleTypeOption {
  type: BundleType;
  title: string;
  description: string;
  popular?: boolean;
}

export interface GeneralSetting {
  id: string;
  bundleId: string;
  bundleName: string;//
  discountName: string;//
  blockTitle: string;//
  visibility: string;//
  markets: string;//
  excludedProducts: string;
  excludedCollections: string;
  selectedProducts: string;
  selectedCollections: string;
  excludeB2B: boolean;//
  excludePOS: boolean;
  startDateTime: string;//
  setEndDate: boolean;//
  endDateTime: string;//
  letCustomer: boolean;//
  showVariant: boolean;//
  hideTheme: boolean;//
  colorSwatchArray: string;
  imageSwatchArray: string;
  swatchOption: string;
  swatchType: string;
  swatchSize: number;
  swatchShape: string;
  setDefaultVariant: string;
  showPrices: boolean;//
  showBothPrices: boolean;//
  unitLabel: string;//
  useProductCompare: boolean;//
  showPricesWithout: boolean;//
  showPriceRounding: boolean;//
  priceRounding: string;//
  updateTheme: boolean;//
  priceSelect: string;//
  skipCart: boolean;//
  showAlert: boolean;//
  showWhenStock: number;//
  msgText: string;//
  msgColor: string;//
  createdAt: string;
  updatedAt: string;
}

export interface CountdownTimer {
  id: string
  isCountdown: boolean
  visibility: string
  fixedDurationTime: number
  endDateTime: string
  msgText: string
  msgAlignment: number
  msgBold: boolean
  msgItalic: boolean
  msgBgColor: string
  msgTextColor: string
  msgSize: number
  createdAt: string
  updatedAt: string
}

export interface GeneralStyle {
  id: string
  bundleId: string
  cornerRadius: number
  spacing: number
  cardsBgColor: string
  selectedBgColor: string
  borderColor: string
  blockTitleColor: string
  barTitleColor: string
  barSubTitleColor: string
  barPriceColor: string
  barFullPriceColor: string
  barLabelBackColor: string
  barLabelTextColor: string
  barBadgebackColor: string
  barBadgeTextColor: string
  barUpsellBackColor: string
  barUpsellTextColor: string
  barUpsellSelectedBackColor: string
  barUpsellSelectedTextColor: string
  barBlocktitle: number
  barBlocktitleFontStyle: string
  bartitleSize: number
  bartitleFontStyle: string
  subTitleSize: number
  subTitleStyle: string
  labelSize: number
  labelStyle: string
  upsellSize: number
  upsellStyle: string
  unitLabelSize: number
  unitLabelStyle: string
  createdAt: string
  updatedAt: string
}

export interface VolumeDiscount {
  id: string
  bundleId: string
  visibility: string
  layoutImageUrl: string
  layoutButtonText: string
  layoutColor: string
  productPhotoSize: number
  showProductName: boolean
  showPrice: boolean
  customButtonSize: number
  customTextSize: number
  customOverlayColor: string
  customPriceColor: string
  customCompareAtPriceColor: string
  customTextColor: string
  customButtonColor: string
  customButtonTextColor: string
  customHeadingText: string
  customMessageText: string
  customButtonText: string
  customPhotoSize: number
  createdAt: string
  updatedAt: string
}

export interface StickyAdd {
  id: string,
  bundleId: string,
  contentTitleText: string,
  contentButtonText: string,
  styleBgColor: string,
  styleTitleColor: string,
  styleButtonColor: string,
  styleButtonTextColor: string,
  styleTitleFontSize: number,
  styleTitleFontStyle: string,
  styleButtonFontSize: number,
  styleButtonFontStyle: string,
  stylePhotoSize: number,
  stylePhotoCornerRadius: number,
  styleButtonPadding: number,
  styleButtonCornerRadius: number,
  createdAt: string,
  updatedAt: string
}

export interface CheckboxUpsell {
  id: string,
  bundleId: string,
  upsellData: string,
  createdAt: string,
  updatedAt: string
}

