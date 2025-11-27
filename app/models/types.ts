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
  bundleName: string;
  discountName: string;

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