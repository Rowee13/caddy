"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ItemType } from "@/app/generated/prisma/client";

export async function getItems() {
  return prisma.item.findMany({
    orderBy: { createdAt: "desc" },
    include: { folder: true },
  });
}

export async function getItemsByFolder(folderId: string) {
  return prisma.item.findMany({
    where: { folderId },
    orderBy: { createdAt: "desc" },
    include: { folder: true },
  });
}

export async function createItem(data: {
  type: ItemType;
  title: string;
  content: string;
  folderId: string;
  url?: string;
  ogImage?: string;
  language?: string;
}) {
  await prisma.item.create({ data });
  revalidatePath("/");
}

export async function updateItem(
  id: string,
  data: {
    type?: ItemType;
    title?: string;
    content?: string;
    folderId?: string;
    url?: string;
    ogImage?: string;
    language?: string;
  }
) {
  await prisma.item.update({ where: { id }, data });
  revalidatePath("/");
}

export async function deleteItem(id: string) {
  await prisma.item.delete({ where: { id } });
  revalidatePath("/");
}
