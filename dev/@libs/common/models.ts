import { TRANSACTION_CATEGORIES } from "./constants";

export type CurrencyCode =
  | "AED"
  | "AFN"
  | "ALL"
  | "AMD"
  | "ANG"
  | "ARS"
  | "AUD"
  | "AWG"
  | "AZN"
  | "BAM"
  | "BBD"
  | "BDT"
  | "BGN"
  | "BHD"
  | "BIF"
  | "BMD"
  | "BND"
  | "BOB"
  | "BRL"
  | "BSD"
  | "BTN"
  | "BWP"
  | "BYN"
  | "BZD"
  | "CAD"
  | "CDF"
  | "CHF"
  | "CLP"
  | "CNY"
  | "COP"
  | "CRC"
  | "CUP"
  | "CVE"
  | "CYP"
  | "CZK"
  | "DJF"
  | "DKK"
  | "DOP"
  | "DZD"
  | "EEK"
  | "EGP"
  | "ERN"
  | "ETB"
  | "EUR"
  | "FIM"
  | "FJD"
  | "FKP"
  | "Fr"
  | "GBP"
  | "GEL"
  | "GGP"
  | "GHS"
  | "GIP"
  | "GMD"
  | "GNF"
  | "GTQ"
  | "GYD"
  | "HKD"
  | "HNL"
  | "HRK"
  | "HTG"
  | "HUF"
  | "IDR"
  | "IEP"
  | "ILS"
  | "IMP"
  | "INR"
  | "IQD"
  | "IRR"
  | "ISK"
  | "JEP"
  | "JMD"
  | "JOD"
  | "JPY"
  | "KES"
  | "KGS"
  | "KHR"
  | "KMF"
  | "KPW"
  | "KRW"
  | "KWD"
  | "KYD"
  | "KZ"
  | "KZT"
  | "LAK"
  | "LBP"
  | "LKR"
  | "LRD"
  | "LTL"
  | "LUF"
  | "LVL"
  | "LYD"
  | "MDL"
  | "MDN"
  | "MGF"
  | "MKD"
  | "MMK"
  | "MNT"
  | "MOP"
  | "MRU"
  | "MTL"
  | "MUR"
  | "MVR"
  | "MWK"
  | "MXN"
  | "MYR"
  | "MZN"
  | "NAD"
  | "NGN"
  | "NIO"
  | "NOK"
  | "NPR"
  | "NZD"
  | "OMR"
  | "PAB"
  | "PEN"
  | "PGK"
  | "PHP"
  | "PKR"
  | "PLN"
  | "PYG"
  | "QAR"
  | "RON"
  | "RSD"
  | "RUB"
  | "RWF"
  | "SAR"
  | "SBD"
  | "SCR"
  | "SDG"
  | "SEK"
  | "SGD"
  | "SHP"
  | "SKK"
  | "SLL"
  | "SOS"
  | "SRD"
  | "SSP"
  | "STD"
  | "SVC"
  | "SYP"
  | "SZL"
  | "THB"
  | "TJS"
  | "TMT"
  | "TND"
  | "TRY"
  | "TTD"
  | "TVD"
  | "TWD"
  | "TZS"
  | "UAH"
  | "UGX"
  | "USD"
  | "UYU"
  | "UZS"
  | "VEF"
  | "VND"
  | "WST"
  | "XAF"
  | "XCD"
  | "XOF"
  | "YER"
  | "ZAR"
  | "ZMW"
  | "ZWD";

export type CurrencyValue = {
  name: string;
  symbol: string;
};

export type Currency = {
  code: CurrencyCode;
} & CurrencyValue;

export type Transaction = {
  modifiedDate: Date;
  date: Date;
  title: string;
  payments: Payment[];
  tags: string[];
};

export type Payment = {
  amount: number;
  currencyCode: CurrencyCode;
  paymentMethodCode: PaymentMethod["code"];
};

export type PaymentMethod = {
  code: string;
  displayName: string;
  uniqueId?: string;
  expiry?: Date;
  defaultAccountId?: Account["id"];
  connectedAccountIds: Account["id"][];
};

export type Account = {
  id: string;
  accountId?: string;
  name: string;
  balance: number;
  currency: CurrencyCode;
};

export type TagCategory = keyof typeof TRANSACTION_CATEGORIES;

export type Tag = {
  name: string;
  type: TagCategory;
  isEditable: boolean;
};

export type Budget = {
  id: string;
  title: string;
  limit: number;
  spend: number;
  currency: CurrencyCode;
};
