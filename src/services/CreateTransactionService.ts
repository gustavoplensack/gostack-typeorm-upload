// import AppError from '../errors/AppError';

import { getRepository, getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';

import Category from '../models/Category';
import Transaction from '../models/Transaction';

import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const categoryRepo = getRepository(Category);

    let categoryInstance = await categoryRepo.findOne({ title: category });

    if (!categoryInstance) {
      // saving category if doesn't exist
      categoryInstance = await categoryRepo.save({ title: category });
    }

    const category_id = categoryInstance.id;

    const transactionRepo = getCustomRepository(TransactionsRepository);

    const newTransaction = await transactionRepo.create({
      title,
      type,
      value,
      category_id,
    });

    const { total } = await transactionRepo.getBalance();
    if (type === 'outcome' && value > total)
      throw new AppError('Insufficient funds', 400);

    await transactionRepo.save(newTransaction);

    return newTransaction;
  }
}

export default CreateTransactionService;
