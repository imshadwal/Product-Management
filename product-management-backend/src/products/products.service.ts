import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Product } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a product
  async create(data: Prisma.ProductCreateInput): Promise<Product> {
    return this.prisma.product.create({ data });
  }

  // Get all products with pagination and optional search
  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<{ data: Product[]; total: number }> {
    const where: Prisma.ProductWhereInput = search
      ? { name: { contains: search, mode: 'insensitive' } }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return { data, total };
  }

  // Get a single product by ID
  async findOne(id: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException(`Product with ID ${id} not found`);
    return product;
  }

  // Update a product by ID
  async update(id: string, data: Prisma.ProductUpdateInput): Promise<Product> {
    await this.findOne(id); // ensure product exists
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  // Delete a product by ID
  async remove(id: string): Promise<Product> {
    await this.findOne(id); // ensure product exists
    return this.prisma.product.delete({ where: { id } });
  }

  async seedProducts() {
    const products = [
      { name: "Wireless Mouse", price: 25.99, description: "Ergonomic wireless mouse with adjustable DPI." },
      { name: "Mechanical Keyboard", price: 89.99, description: "RGB backlit mechanical keyboard with blue switches." },
      { name: "USB-C Hub", price: 49.5, description: "7-in-1 USB-C hub with HDMI, USB, and SD card ports." },
      { name: "Noise Cancelling Headphones", price: 129.99, description: "Over-ear headphones with active noise cancellation." },
      { name: "Smartwatch", price: 199.99, description: "Fitness smartwatch with heart rate and sleep tracking." },
      { name: "Portable SSD", price: 109.99, description: "Fast 1TB portable SSD with USB-C connectivity." },
      { name: "Gaming Chair", price: 299.99, description: "Ergonomic gaming chair with lumbar support." },
      { name: "Bluetooth Speaker", price: 59.99, description: "Waterproof portable Bluetooth speaker with 12-hour battery." },
      { name: "4K Monitor", price: 349.99, description: "27-inch 4K UHD monitor with HDR support." },
      { name: "Laptop Stand", price: 39.99, description: "Adjustable aluminum laptop stand for better ergonomics." },
      { name: "Wireless Charger", price: 29.99, description: "Fast wireless charging pad for Qi-enabled devices." },
      { name: "Action Camera", price: 179.99, description: "4K waterproof action camera with image stabilization." },
      { name: "VR Headset", price: 399.99, description: "All-in-one VR headset with motion tracking." },
      { name: "Smart Light Bulb", price: 19.99, description: "Wi-Fi enabled LED light bulb with color changing options." },
      { name: "Drone", price: 499.99, description: "Compact drone with 4K camera and GPS stabilization." },
      { name: "External Hard Drive", price: 79.99, description: "2TB external hard drive with USB 3.0." },
      { name: "Electric Toothbrush", price: 59.99, description: "Rechargeable electric toothbrush with multiple modes." },
      { name: "Fitness Tracker", price: 99.99, description: "Activity tracker with heart rate and step counter." },
      { name: "Smart Thermostat", price: 249.99, description: "Wi-Fi thermostat with energy-saving features." },
      { name: "Portable Projector", price: 329.99, description: "Compact projector with Full HD support and HDMI input." }
    ];

    for (const product of products) {
      await this.prisma.product.create({ data: product });
    }

    console.log('Seeded 20 mock products.');
  }
}
