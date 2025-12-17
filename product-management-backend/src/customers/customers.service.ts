import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(page: number = 1, limit: number = 100) {
    const skip = (page - 1) * limit;
    
    const [customers, total] = await Promise.all([
      this.prisma.customer.findMany({
        where: {
          deletedAt: null,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.customer.count({
        where: {
          deletedAt: null,
        },
      }),
    ]);
    
    return { data: customers, total, page, limit };
  }

  async *streamCustomersInBatches(batchSize: number = 100, limit?: number) {
    let skip = 0;
    let totalFetched = 0;

    while (true) {
      const take = limit ? Math.min(batchSize, limit - totalFetched) : batchSize;
      if (take <= 0) break;

      const customers = await this.prisma.customer.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      });

      if (customers.length === 0) break;
      
      yield customers;
      skip += customers.length;
      totalFetched += customers.length;

      if (limit && totalFetched >= limit) break;
    }
  }
}
