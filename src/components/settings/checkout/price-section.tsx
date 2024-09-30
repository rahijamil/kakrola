import { CheckoutPriceContainer } from "./checkout-price-container";
import { CheckoutPriceAmount } from "./checkout-price-amount";
import { CheckoutEventsData } from "@paddle/paddle-js/types/checkout/events";

interface Props {
  checkoutData: CheckoutEventsData | null;
  quantity: number;
}

export function PriceSection({ checkoutData, quantity }: Props) {
  return (
    <>
      <div className={"hidden md:block"}>
        <CheckoutPriceContainer checkoutData={checkoutData} />
      </div>
      <div className={"block md:hidden"}>
        <CheckoutPriceAmount checkoutData={checkoutData} />
      </div>
    </>
  );
}
