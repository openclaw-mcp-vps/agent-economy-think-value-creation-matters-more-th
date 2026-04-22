import { redirect } from "next/navigation";

import { Dashboard } from "@/components/ui/dashboard";
import { getAccessSession } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getAccessSession();

  if (!session) {
    redirect("/");
  }

  return (
    <main className="min-h-screen px-4 py-8 md:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <Dashboard />
      </div>
    </main>
  );
}
