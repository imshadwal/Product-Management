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
}
