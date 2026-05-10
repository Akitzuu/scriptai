import Stripe from "stripe";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY! as any);

export const PLANS = {
  STARTER: {
    name: "Starter",
    priceId: "price_1TVh0pBhOG2OtVMI7QAlLYBD",
    credits: 50,
    price: 9,
  },
  PRO: {
    name: "Pro",
    priceId: "price_1TVh1GBhOG2OtVMIdGxWAzIp",
    credits: 200,
    price: 29,
  },
};
