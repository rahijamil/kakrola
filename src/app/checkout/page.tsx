import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { usePaddleCheckout } from '@/components/Paddle/usePaddleCheckout';

const CheckoutPage = () => {
  const router = useRouter();
  const { openCheckout, isReady } = usePaddleCheckout();

  useEffect(() => {
    if (isReady) {
      const { _ptxn } = router.query;
      
      if (_ptxn && typeof _ptxn === 'string') {
        // If there's a transaction ID in the URL, open the checkout for that transaction
        openCheckout({ transactionId: _ptxn });
      } else {
        // If there's no transaction ID, you might want to redirect to a pricing page
        // or show an error message
        console.error('No transaction ID provided');
        // router.push('/pricing');
      }
    }
  }, [isReady, router.query]);

  return (
    <div>
      <h1>Checkout</h1>
      {!isReady && <p>Loading checkout...</p>}
      {/* You can add more UI elements here if needed */}
    </div>
  );
};

export default CheckoutPage;