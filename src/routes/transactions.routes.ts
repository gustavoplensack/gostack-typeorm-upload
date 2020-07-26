import { Router } from 'express';

import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionRepo = getCustomRepository(TransactionsRepository);

  const transactions = await transactionRepo.find({
    relations: ['category'],
  });

  const balance = await transactionRepo.getBalance();

  response.send({ transactions, balance }).status(200);
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const transactionService = new CreateTransactionService();

  const newTransaction = await transactionService.execute({
    title,
    value,
    type,
    category,
  });

  response.status(200).send(newTransaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  // TODO
});

transactionsRouter.post('/import', async (request, response) => {
  // TODO
});

export default transactionsRouter;
