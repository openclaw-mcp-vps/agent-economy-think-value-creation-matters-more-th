export type LegacyWebhookNotice = {
  provider: "lemonsqueezy";
  status: "deprecated";
  message: string;
};

export function getLemonSqueezyDeprecationNotice(): LegacyWebhookNotice {
  return {
    provider: "lemonsqueezy",
    status: "deprecated",
    message:
      "Billing now uses Stripe Payment Links. Keep this helper only if you are migrating old Lemon Squeezy webhook endpoints."
  };
}
