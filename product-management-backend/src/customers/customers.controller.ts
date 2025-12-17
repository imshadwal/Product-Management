import { Controller, Get, Query, Res } from '@nestjs/common';
import { CustomersService } from './customers.service';
import type { Response } from 'express';
import * as ExcelJS from 'exceljs';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 100;
    return await this.customersService.findAll(pageNum, limitNum);
  }

  @Get('export')
  async exportToExcel(@Res() res: Response) {
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=customers.xlsx');

    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({ stream: res });
    const worksheet = workbook.addWorksheet('Customers');

    worksheet.columns = [
      { header: 'ID', key: 'id' },
      { header: 'User ID', key: 'userId' },
      { header: 'Phone Number', key: 'phoneNumber' },
      { header: 'Created At', key: 'createdAt' },
      { header: 'Updated At', key: 'updatedAt' },
      { header: 'Deleted At', key: 'deletedAt' },
    ];

    for await (const batch of this.customersService.streamCustomersInBatches(100,20000)) {
      for (const customer of batch) {
        worksheet.addRow({
          id: customer.id,
          userId: customer.userId,
          phoneNumber: customer.phoneNumber,
          createdAt: customer.createdAt.toISOString(),
          updatedAt: customer.updatedAt.toISOString(),
          deletedAt: customer.deletedAt ? customer.deletedAt.toISOString() : '',
        }).commit();
      }
    }

    await workbook.commit();
  }
}
