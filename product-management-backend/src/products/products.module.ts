import { Module } from '@nestjs/common';
import { ProductService } from './products.service';
import { ProductController } from './products.controller';
import { PrismaModule } from '../prisma/prisma.module'; // <-- import PrismaModule

@Module({
  imports: [PrismaModule], // <-- THIS is required
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductsModule {}
