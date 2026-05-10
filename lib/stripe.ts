import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

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
