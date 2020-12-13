import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const income = this.transactions.reduce((acumulator, currentValue) => {
      return currentValue.type === 'outcome'
        ? acumulator
        : acumulator + currentValue.value;
    }, 0);

    const outcome = this.transactions.reduce((acumulator, currentValue) => {
      return currentValue.type === 'income'
        ? acumulator
        : acumulator + currentValue.value;
    }, 0);

    const total = income - outcome;

    return {
      income,
      outcome,
      total,
    };
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const newTransaction = new Transaction({
      title,
      value,
      type,
    });
    const totalBalance = this.getBalance();
    if (totalBalance.total <= 0 && newTransaction.type === 'outcome') {
      throw Error('Your balance is negative');
    }
    this.transactions.push(newTransaction);
    return newTransaction;
  }
}

export default TransactionsRepository;
