"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function getFolders() {
  return prisma.folder.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { items: true } } },
  });
}

export async function createFolder(name: string) {
  await prisma.folder.create({ data: { name } });
  revalidatePath("/");
}

export async function updateFolder(id: string, name: string) {
  await prisma.folder.update({ where: { id }, data: { name } });
  revalidatePath("/");
}

export async function deleteFolder(id: string) {
  await prisma.folder.delete({ where: { id } });
  revalidatePath("/");
}
