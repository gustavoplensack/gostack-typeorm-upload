// import AppError from '../errors/AppError';

import { getRepository, getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';

import Category from '../models/Category';

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
  }: Request): Promise<void> {
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

    transactionRepo.save(newTransaction);

    console.log(newTransaction);
  }
}

export default CreateTransactionService;
