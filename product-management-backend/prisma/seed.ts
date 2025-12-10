import { PrismaClient, PaymentStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

// Customers: 20,00,000
// Orders: 1,00,00,000 (2,000,000 × 5 orders/customer)
// Items: 30,000,000 (10,000,000 orders × 3 items/order)
// Invoices: 10,000,000 (1 invoice per order)
// Payment Transactions (total): 6,000,000
// Successful: 5,000,000
// Failed: 1,000,000
// (keeps same 500k/100k split scaled by 10)
// Payment Types: 3 (UPI, Credit Card, Debit Card)

// Configuration
const BATCH_SIZE = 1000; 
const CUSTOMERS_COUNT = 2_000_000;
const ORDERS_PER_CUSTOMER = 5;
const ITEMS_PER_ORDER = 3;
const SUCCESSFUL_PAYMENTS = 5_000_000;
const FAILED_PAYMENTS = 1_000_000;

const PAYMENT_TYPES = ['UPI', 'Credit Card', 'Debit Card'];

// Helper function to create batches
function createBatches<T>(items: T[], batchSize: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }
  return batches;
}

async function seedPaymentTypes() {
  console.log('\n🔄 Seeding Payment Types...');

  for (const name of PAYMENT_TYPES) {
    await prisma.paymentType.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log('✅ Payment Types seeded successfully!');
  return await prisma.paymentType.findMany();
}

async function seedCustomers() {
  console.log('\n🔄 Seeding Customers...');
  const customers: any[] = [];

  for (let i = 0; i < CUSTOMERS_COUNT; i++) {
    customers.push({
      userId: faker.string.uuid(),
      phoneNumber: `+91${faker.string.numeric(10)}`,
    });
  }

  console.log('\n📦 Inserting customers in batches...');
  const batches = createBatches(customers, BATCH_SIZE);

  for (let i = 0; i < batches.length; i++) {
    await prisma.customer.createMany({
      data: batches[i],
      skipDuplicates: true,
    });
  }

  console.log('✅ Customers seeded successfully!');
  return await prisma.customer.findMany({ select: { id: true } });
}

async function seedOrdersAndItems(customerIds: string[]) {
  console.log('\n🔄 Seeding Orders and Items...');

  const totalOrders = CUSTOMERS_COUNT * ORDERS_PER_CUSTOMER;
  let ordersProcessed = 0;
  let itemsProcessed = 0;

  // Process in chunks to avoid memory issues
  const CUSTOMER_CHUNK_SIZE = 1000; // Process 1000 customers at a time

  for (let chunkStart = 0; chunkStart < customerIds.length; chunkStart += CUSTOMER_CHUNK_SIZE) {
    const chunkEnd = Math.min(chunkStart + CUSTOMER_CHUNK_SIZE, customerIds.length);
    const customerChunk = customerIds.slice(chunkStart, chunkEnd);

    const orders: any[] = [];
    const orderCustomerMap: { orderId: string; customerId: string }[] = [];

    // Generate orders for this chunk of customers
    for (const customerId of customerChunk) {
      for (let j = 0; j < ORDERS_PER_CUSTOMER; j++) {
        const orderId = faker.string.uuid();
        orders.push({
          id: orderId,
          customerId,
        });
        orderCustomerMap.push({ orderId, customerId });
      }
    }

    // Insert orders
    const orderBatches = createBatches(orders, BATCH_SIZE);
    for (const batch of orderBatches) {
      await prisma.order.createMany({
        data: batch,
        skipDuplicates: true,
      });
      ordersProcessed += batch.length;
    }

    // Generate and insert items for these orders
    const items: any[] = [];
    for (const order of orders) {
      for (let k = 0; k < ITEMS_PER_ORDER; k++) {
        items.push({
          orderId: order.id,
          quantity: faker.number.int({ min: 1, max: 10 }),
          totalPrice: parseFloat(faker.commerce.price({ min: 100, max: 10000 })),
          totalDiscount: parseFloat(faker.commerce.price({ min: 0, max: 500 })),
        });
      }
    }

    const itemBatches = createBatches(items, BATCH_SIZE);
    for (const batch of itemBatches) {
      await prisma.item.createMany({
        data: batch,
        skipDuplicates: true,
      });
      itemsProcessed += batch.length;
    }
  }

  console.log('✅ Orders and Items seeded successfully!');
}

async function seedInvoicesAndPayments(paymentTypes: any[]) {
  console.log('\n🔄 Seeding Invoices and Payment Transactions...');

  const totalPayments = SUCCESSFUL_PAYMENTS + FAILED_PAYMENTS;
  let invoicesProcessed = 0;
  let paymentsProcessed = 0;

  // Fetch orders in batches
  const orderCount = await prisma.order.count();
  const ORDER_BATCH_SIZE = 5000;

  for (let skip = 0; skip < orderCount; skip += ORDER_BATCH_SIZE) {
    const orders = await prisma.order.findMany({
      skip,
      take: ORDER_BATCH_SIZE,
      select: { id: true },
    });

    const invoices: any[] = [];
    const payments: any[] = [];

    for (const order of orders) {
      const invoiceId = faker.string.uuid();
      const invoiceTotal = parseFloat(faker.commerce.price({ min: 1000, max: 50000 }));

      invoices.push({
        id: invoiceId,
        orderId: order.id,
        total: invoiceTotal,
      });

      // Determine if this payment will be successful or failed
      const isSuccessful = paymentsProcessed < SUCCESSFUL_PAYMENTS;
      const paymentStatus = isSuccessful ? PaymentStatus.Success : PaymentStatus.Fail;

      // Random payment type
      const paymentType = paymentTypes[Math.floor(Math.random() * paymentTypes.length)];

      payments.push({
        invoiceId,
        paymentTypeId: paymentType.id,
        amount: invoiceTotal,
        status: paymentStatus,
      });

      paymentsProcessed++;

      // Stop creating payments once we reach the total
      if (paymentsProcessed >= totalPayments) {
        break;
      }
    }

    // Insert invoices
    const invoiceBatches = createBatches(invoices, BATCH_SIZE);
    for (const batch of invoiceBatches) {
      await prisma.invoice.createMany({
        data: batch,
        skipDuplicates: true,
      });
      invoicesProcessed += batch.length;
    }

    // Insert payments
    const paymentBatches = createBatches(payments, BATCH_SIZE);
    for (const batch of paymentBatches) {
      await prisma.paymentTransaction.createMany({
        data: batch,
        skipDuplicates: true,
      });
    }

    if (paymentsProcessed >= totalPayments) {
      break;
    }
  }

  console.log('✅ Invoices and Payment Transactions seeded successfully!');
}

async function main() {
  console.log('🚀 Starting database seeding...');
  console.log('⚠️  This will take a significant amount of time due to the large dataset.');
  console.log('⚠️  Ensure your database has sufficient storage and resources.\n');

  const startTime = Date.now();

  try {
    const paymentTypes = await seedPaymentTypes();

    const customers = await seedCustomers();
    const customerIds = customers.map(c => c.id);
    await seedOrdersAndItems(customerIds);
    await seedInvoicesAndPayments(paymentTypes);

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000 / 60).toFixed(2);

    console.log(`✅ Seeding completed successfully in ${duration} minutes!`);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
