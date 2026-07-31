"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCategory(name: string, slug: string) {
  try {
    await prisma.category.create({
      data: { name, slug }
    });
    revalidatePath("/admin/products");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function createProduct(data: { name: string, categoryId?: string, description?: string, price: number, image?: string }) {
  try {
    await prisma.product.create({
      data: {
        name: data.name,
        categoryId: data.categoryId || null,
        description: data.description,
        price: data.price,
        image: data.image,
      }
    });
    revalidatePath("/admin/products");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function updateProduct(id: string, data: { name: string, categoryId?: string, description?: string, price: number, image?: string }) {
  try {
    await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        categoryId: data.categoryId || null,
        description: data.description,
        price: data.price,
        image: data.image,
      }
    });
    revalidatePath("/admin/products");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function deleteProduct(id: string) {
  try {
    // Delete stock items first
    await prisma.stockItem.deleteMany({ where: { productId: id } });
    await prisma.product.delete({ where: { id } });
    revalidatePath("/admin/products");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function addStockItems(productId: string, keys: string[]) {
  try {
    const data = keys.map(content => ({
      productId,
      content,
      isDelivered: false
    }));
    await prisma.stockItem.createMany({
      data
    });
    revalidatePath("/admin/products");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function updateManualStock(productId: string, stock: number) {
  try {
    await prisma.product.update({
      where: { id: productId },
      data: { stock }
    });
    revalidatePath("/admin/products");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
