import { Router } from 'express';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';

const transactionRouter = Router();

const transactionsRepository = new TransactionsRepository();

transactionRouter.get('/', (request, response) => {
  try {
    const transactions = transactionsRepository.all();
    return response.json(transactions);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

transactionRouter.post('/', (request, response) => {
  try {
    const { title, value, type } = request.body;
    const createTransaction = new CreateTransactionService(
      transactionsRepository,
    );
    const transaction = createTransaction.execute({
      title,
      value,
      type,
    });
    const totalBalance = transactionsRepository.all().balance.total;

    if ((type === 'outcome' && totalBalance > value) || type === 'income') {
      return response.json(transaction);
    }
    return response.status(400).json({ error: 'saldo insuficiente.' });
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default transactionRouter;
