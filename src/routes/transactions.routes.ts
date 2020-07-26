import { Router } from 'express';

import multer from 'multer';
import { getCustomRepository } from 'typeorm';

import uploadConfig from '../config/uploadConfig';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const upload = multer(uploadConfig);

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

  const createTransactionService = new CreateTransactionService();

  const newTransaction = await createTransactionService.execute({
    title,
    value,
    type,
    category,
  });

  response.status(200).send(newTransaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransactionService = new DeleteTransactionService();

  await deleteTransactionService.execute({ id });

  response.status(204).send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const { file } = request;

    const importTransactionsService = new ImportTransactionsService();

    const transactions = await importTransactionsService.execute({
      filePath: file.path,
    });

    response.send({ transactions }).status(204);
  },
);

export default transactionsRouter;
