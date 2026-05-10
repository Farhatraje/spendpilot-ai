import { supabase } from "@/lib/supabase";

export default async function AuditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = await params;

  const { data, error } = await supabase
    .from("audits")
    .select("*")
    .eq("id", id)
    .single();

  console.log(data);
  console.log(error);

  if (!data) {

    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <h1 className="text-4xl font-bold">
          Audit Not Found
        </h1>
      </main>
    );

  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">

      <div className="max-w-5xl mx-auto">

        {/* HERO */}
        <div className="p-8 rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-blue-500/10">

          <p className="text-cyan-400 font-medium">
            Public AI Spend Audit
          </p>

          <h1 className="text-6xl font-bold mt-4">
            ${data.total_savings}/mo
          </h1>

          <p className="text-gray-300 mt-3 text-xl">
            Potential Monthly Savings
          </p>

        </div>

        {/* TOOL CARDS */}
        <div className="mt-10 space-y-6">

          {data.tools.map((tool: any, index: number) => (

            <div
              key={index}
              className="p-8 rounded-3xl border border-white/10 bg-white/5"
            >

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="text-3xl font-bold">
                    {tool.tool}
                  </h2>

                  <p className="text-gray-300 mt-4 text-lg leading-relaxed">
                    {tool.recommendation}
                  </p>

                </div>

                <div className="text-right">

                  <p className="text-gray-400">
                    Savings
                  </p>

                  <h3 className="text-4xl font-bold text-cyan-400 mt-2">
                    ${tool.savings}
                  </h3>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </main>
  );
}