import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ProductService } from './products.service';
import { Prisma } from '@prisma/client';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // 1️⃣ Create Product
  @Post()
  create(@Body() data: Prisma.ProductCreateInput) {
    return this.productService.create(data);
  }

  // 2️⃣ Get All Products (with optional pagination & search)
  @Get()
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('search') search?: string,
  ) {
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 10;
    return this.productService.findAll(pageNum, limitNum, search);
  }

  // 3️⃣ Edit Product
  @Put(':id')
  update(@Param('id') id: string, @Body() data: Prisma.ProductUpdateInput) {
    return this.productService.update(id, data);
  }

  // 4️⃣ Delete Product
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }

  @Get('seed')
  async seed() {
    await this.productService.seedProducts();
    return { message: '20 mock products inserted!' };
  }

}
