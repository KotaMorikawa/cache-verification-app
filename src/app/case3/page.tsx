import { TestPanel } from "@/components/TestPanel";

export const dynamic = "force-dynamic";

async function getData() {
  const res = await fetch("http://localhost:3000/api/time", {
    next: {
      tags: ["time"],
      revalidate: 60,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();
  console.log(`[Case3] Fetched data at ${new Date().toISOString()}`);

  return data;
}

export default async function Case3Page() {
  const data = await getData();

  return (
    <div className="min-h-screen bg-background p-8">
      <TestPanel
        caseNumber={3}
        caseTitle="Case 3: revalidate + タグ"
        initialData={data}
        fetchConfig={`fetch(url, {
  next: { 
    tags: ['time'],
    revalidate: 60
  }
})`}
      />
    </div>
  );
}
