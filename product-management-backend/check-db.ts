import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    const [customers, orders, items, invoices, payments, paymentTypes] = await Promise.all([
      prisma.customer.count(),
      prisma.order.count(),
      prisma.item.count(),
      prisma.invoice.count(),
      prisma.paymentTransaction.count(),
      prisma.paymentType.count(),
    ]);
    
    console.log('\n📊 Current Database State:');
    console.log('═══════════════════════════════════════');
    console.log(`Customers:         ${customers.toLocaleString()}`);
    console.log(`Orders:            ${orders.toLocaleString()}`);
    console.log(`Items:             ${items.toLocaleString()}`);
    console.log(`Invoices:          ${invoices.toLocaleString()}`);
    console.log(`Payments:          ${payments.toLocaleString()}`);
    console.log(`Payment Types:     ${paymentTypes.toLocaleString()}`);
    console.log('═══════════════════════════════════════\n');
    
    if (customers === 0) {
      console.log('❌ Database is empty. Run "npm run prisma:seed" to populate it.\n');
    }
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
