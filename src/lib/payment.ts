// Single source of truth for the Financial Kundali unlock price — was
// previously hardcoded separately in the order-creation route, the payment
// confirmation email, and the unlock page UI, risking silent drift if the
// price ever changes.
export const FINANCIAL_KUNDALI_PRICE_INR = 999;
export const FINANCIAL_KUNDALI_PRICE_PAISE = FINANCIAL_KUNDALI_PRICE_INR * 100;
