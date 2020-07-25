import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

function cumulateTransactionValues(
  cumulated: Transaction,
  actual: Transaction,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  index: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  array: Transaction[],
): Transaction {
  // eslint-disable-next-line no-param-reassign
  cumulated.value += actual.value;
  return cumulated;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const incomeTransactions = await this.find({ type: 'income' });
    const outcomeTransactions = await this.find({ type: 'outcome' });

    let income = 0;
    let outcome = 0;

    if (incomeTransactions.length > 0)
      income = incomeTransactions.reduce(cumulateTransactionValues).value;

    if (outcomeTransactions.length > 0)
      outcome = outcomeTransactions.reduce(cumulateTransactionValues).value;

    const total = income - outcome;

    return {
      income,
      outcome,
      total,
    };
  }
}

export default TransactionsRepository;
