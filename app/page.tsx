export const dynamic = "force-dynamic";

import { getFolders } from "@/app/actions/folders";
import { getItems } from "@/app/actions/items";
import Dashboard from "@/components/Dashboard";

export default async function Home() {
  const [folders, items] = await Promise.all([getFolders(), getItems()]);

  return <Dashboard folders={folders} items={items} />;
}
