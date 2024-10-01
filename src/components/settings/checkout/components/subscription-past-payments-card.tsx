import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Transaction } from '@paddle/paddle-node-sdk';
import dayjs from 'dayjs';
import { parseMoney } from '@/utils/paddle/parse-money';
import { getPaymentReason } from '@/utils/paddle/data-helpers';
import { Card, CardContent, CardTitle } from '../ui/card';
import { Status } from '../ui/status';

interface Props {
  subscriptionId: string;
  transactions?: Transaction[];
}

export function SubscriptionPastPaymentsCard({ subscriptionId, transactions }: Props) {
  return (
    <Card className={'border-text-100 p-6'}>
      <CardTitle className="flex justify-between items-center pb-6 border-text-100 border-b flex-wrap">
        <span className={'text-xl font-medium'}>Payments</span>
        <Button size={'sm'} variant={'outline'} className={'text-sm rounded-sm border-text-100'}>
          <Link href={`/dashboard/payments/${subscriptionId}`}>View all</Link>
        </Button>
      </CardTitle>
      <CardContent className={'p-0'}>
        {transactions?.slice(0, 3).map((transaction) => {
          const formattedPrice = parseMoney(transaction.details?.totals?.total, transaction.currencyCode);
          return (
            <div key={transaction.id} className={'flex flex-col gap-4 border-text-100 border-b py-6'}>
              <div className={'text-text-700text-base leading-4'}>
                {dayjs(transaction.billedAt ?? transaction.createdAt).format('MMM DD, YYYY')}
              </div>
              <div className={'flex-wrap flex items-center gap-5'}>
                <span className={'font-semibold text-base leading-4'}>{getPaymentReason(transaction.origin)}</span>
                <span className={'text-base leading-6 text-text-700'}>
                  {transaction.details?.lineItems[0].product?.name}
                </span>
              </div>
              <div className={'flex gap-5 items-center flex-wrap'}>
                <div className={'text-base leading-4 font-semibold'}>{formattedPrice}</div>
                <Status status={transaction.status} />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
