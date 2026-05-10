"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface ToolItem {
  id: number;
  tool: string;
  plan: string;
  spend: string;
  seats: string;
}

interface AuditResult {
  tool: string;
  recommendation: string;
  savings: number;
}

export default function Home() {

  const [tools, setTools] = useState<ToolItem[]>([
    {
      id: 1,
      tool: "",
      plan: "",
      spend: "",
      seats: "",
    },
  ]);

  const [results, setResults] = useState<AuditResult[]>([]);
  const [aiSummary, setAiSummary] = useState("");
  const [showResult, setShowResult] = useState(false);

  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");

  const [auditId, setAuditId] = useState("");

  useEffect(() => {

    const saved = localStorage.getItem("multiTools");

    if (saved) {
      setTools(JSON.parse(saved));
    }

  }, []);

  useEffect(() => {

    localStorage.setItem(
      "multiTools",
      JSON.stringify(tools)
    );

  }, [tools]);

  const handleChange = (
    id: number,
    field: keyof ToolItem,
    value: string
  ) => {

    const updated = tools.map((item) =>
      item.id === id
        ? { ...item, [field]: value }
        : item
    );

    setTools(updated);
  };

  const addTool = () => {

    setTools([
      ...tools,
      {
        id: Date.now(),
        tool: "",
        plan: "",
        spend: "",
        seats: "",
      },
    ]);
  };

  const generateAudit = async () => {

    const auditResults: AuditResult[] = [];

    tools.forEach((item) => {

      const spend = Number(item.spend);
      const seats = Number(item.seats);

      let recommendation = "";
      let savings = 0;

      if (item.tool === "ChatGPT") {

        if (seats <= 2 && spend > 50) {
          recommendation =
            "Switch from ChatGPT Team to ChatGPT Plus.";
          savings = 25;
        }

        else if (spend > 300) {
          recommendation =
            "Use OpenAI API credits for better scaling.";
          savings = 120;
        }

        else {
          recommendation =
            "Your ChatGPT setup already looks optimized.";
        }

      }

      else if (item.tool === "Claude") {

        if (spend > 200) {
          recommendation =
            "Claude API usage may reduce operational costs.";
          savings = 80;
        }

        else {
          recommendation =
            "Claude usage appears healthy.";
        }

      }

      else if (item.tool === "Cursor") {

        if (seats < 5 && spend > 100) {
          recommendation =
            "Downgrade from Cursor Business to Cursor Pro.";
          savings = 40;
        }

        else {
          recommendation =
            "Cursor plan configuration looks efficient.";
        }

      }

      else if (item.tool === "GitHub Copilot") {

        if (spend > 150) {
          recommendation =
            "Reduce inactive GitHub Copilot seats.";
          savings = 35;
        }

        else {
          recommendation =
            "GitHub Copilot spend is reasonable.";
        }

      }

      else if (item.tool === "Gemini") {

        if (spend > 100) {
          recommendation =
            "Gemini API pricing may reduce costs.";
          savings = 20;
        }

        else {
          recommendation =
            "Gemini setup looks optimized.";
        }

      }

      else if (item.tool === "Windsurf") {

        if (spend > 120) {
          recommendation =
            "Review unused Windsurf licenses.";
          savings = 30;
        }

        else {
          recommendation =
            "Windsurf configuration appears healthy.";
        }

      }

      auditResults.push({
        tool: item.tool,
        recommendation,
        savings,
      });

    });

    const { data } = await supabase
      .from("audits")
      .insert([
        {
          tools: auditResults,
          total_savings: auditResults.reduce(
            (acc, item) => acc + item.savings,
            0
          ),
        },
      ])
      .select()
      .single();

    if (data) {
      setAuditId(data.id);
    }

    setResults(auditResults);

    try {

      const response = await fetch("/api/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tools: auditResults,
          savings: auditResults.reduce(
            (acc, item) => acc + item.savings,
            0
          ),
        }),
      });

      const responseData = await response.json();

      setAiSummary(responseData.summary);

    } catch {

      setAiSummary(
        "Your AI stack has optimization opportunities with potential monthly savings."
      );

    }

    setShowResult(true);
  };

  const totalSavings = results.reduce(
    (acc, item) => acc + item.savings,
    0
  );

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">

      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/20 blur-[120px]" />
      </div>

      {/* NAVBAR */}
      <nav className="border-b border-white/10 backdrop-blur-xl sticky top-0 z-50 bg-black/40">

        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-2xl bg-cyan-500 flex items-center justify-center font-bold text-black text-xl">
              S
            </div>

            <div>
              <h1 className="font-bold text-xl">
                SpendPilot AI
              </h1>

              <p className="text-xs text-gray-400">
                AI Spend Intelligence
              </p>
            </div>

          </div>

          <button className="px-5 py-2 rounded-xl bg-cyan-500 text-black font-semibold">
            Live Audit
          </button>

        </div>

      </nav>

      {/* HERO */}
      <section className="px-6 py-20">

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-start">

          {/* LEFT */}
          <div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 text-sm">
              AI Cost Optimization Platform
            </div>

            <h1 className="text-6xl lg:text-7xl font-black mt-8 leading-tight">

              Optimize
              <span className="block text-cyan-400">
                AI Spending
              </span>

            </h1>

            <p className="text-gray-400 text-xl mt-8 leading-relaxed max-w-xl">
              Analyze your AI stack, uncover hidden savings,
              and generate intelligent optimization reports
              for your entire team.
            </p>

            <div className="flex gap-4 mt-10">

              <div className="p-5 rounded-3xl border border-white/10 bg-white/5 flex-1">
                <h3 className="text-4xl font-bold text-cyan-400">
                  40%
                </h3>
                <p className="text-gray-400 mt-2">
                  Average Savings
                </p>
              </div>

              <div className="p-5 rounded-3xl border border-white/10 bg-white/5 flex-1">
                <h3 className="text-4xl font-bold text-purple-400">
                  6+
                </h3>
                <p className="text-gray-400 mt-2">
                  AI Platforms
                </p>
              </div>

            </div>

          </div>

          {/* RIGHT */}
          <div className="space-y-6">

            <div className="p-8 rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">

              <h2 className="text-3xl font-bold">
                AI Stack Audit
              </h2>

              <p className="text-gray-400 mt-3">
                Analyze and optimize your AI software costs.
              </p>

              <div className="mt-8 space-y-6">

                {tools.map((item) => (

                  <div
                    key={item.id}
                    className="p-6 rounded-3xl border border-white/10 bg-black/30"
                  >

                    <div className="space-y-4">

                      <select
                        value={item.tool}
                        onChange={(e) =>
                          handleChange(
                            item.id,
                            "tool",
                            e.target.value
                          )
                        }
                        className="w-full p-4 rounded-2xl bg-black border border-white/10 outline-none"
                      >
                        <option value="">Choose Tool</option>
                        <option>ChatGPT</option>
                        <option>Claude</option>
                        <option>Cursor</option>
                        <option>GitHub Copilot</option>
                        <option>Gemini</option>
                        <option>Windsurf</option>
                      </select>

                      <input
                        type="text"
                        placeholder="Current Plan"
                        value={item.plan}
                        onChange={(e) =>
                          handleChange(
                            item.id,
                            "plan",
                            e.target.value
                          )
                        }
                        className="w-full p-4 rounded-2xl bg-black border border-white/10 outline-none"
                      />

                      <input
                        type="number"
                        placeholder="Monthly Spend ($)"
                        value={item.spend}
                        onChange={(e) =>
                          handleChange(
                            item.id,
                            "spend",
                            e.target.value
                          )
                        }
                        className="w-full p-4 rounded-2xl bg-black border border-white/10 outline-none"
                      />

                      <input
                        type="number"
                        placeholder="Seats"
                        value={item.seats}
                        onChange={(e) =>
                          handleChange(
                            item.id,
                            "seats",
                            e.target.value
                          )
                        }
                        className="w-full p-4 rounded-2xl bg-black border border-white/10 outline-none"
                      />

                    </div>

                  </div>

                ))}

                <div className="flex gap-4">

                  <button
                    onClick={addTool}
                    className="flex-1 py-4 rounded-2xl border border-white/10 hover:bg-white/5 transition"
                  >
                    Add Tool
                  </button>

                  <button
                    onClick={generateAudit}
                    className="flex-1 py-4 rounded-2xl bg-cyan-500 text-black font-bold hover:scale-[1.02] transition"
                  >
                    Generate Audit
                  </button>

                </div>

              </div>

            </div>

            {/* RESULTS */}
            {showResult && (

              <div className="space-y-6">

                <div className="p-8 rounded-3xl border border-cyan-500/20 bg-cyan-500/10">

                  <h2 className="text-6xl font-black">
                    ${totalSavings}/mo
                  </h2>

                  <p className="text-gray-300 mt-3 text-lg">
                    Potential Monthly Savings
                  </p>

                </div>

                {auditId && (

                  <div className="p-8 rounded-3xl border border-green-500/20 bg-green-500/10">

                    <h3 className="text-2xl font-bold">
                      Shareable URL
                    </h3>

                    <div className="mt-5 flex gap-4">

                      <input
                        readOnly
                        value={`https://spendpilot-ai-two.vercel.app/audit/${auditId}`}
                        className="flex-1 p-4 rounded-2xl bg-black border border-white/10"
                      />

                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `https://spendpilot-ai-two.vercel.app/audit/${auditId}`
                          );

                          alert("Copied!");
                        }}
                        className="px-6 rounded-2xl bg-cyan-500 text-black font-bold"
                      >
                        Copy
                      </button>

                    </div>

                  </div>

                )}

                <div className="p-8 rounded-3xl border border-purple-500/20 bg-purple-500/10">

                  <h3 className="text-2xl font-bold">
                    AI Summary
                  </h3>

                  <p className="text-gray-300 mt-4 leading-relaxed">
                    {aiSummary}
                  </p>

                </div>

              </div>

            )}

          </div>

        </div>

      </section>
{/* LEAD CAPTURE */}
<div className="p-8 rounded-3xl border border-cyan-500/20 bg-cyan-500/10">

  <h3 className="text-2xl font-bold">
    Save Full Audit Report
  </h3>

  <p className="text-gray-300 mt-3">
    Get your AI savings report delivered to your email.
  </p>

  <div className="mt-8 space-y-4">

    <input
      type="email"
      placeholder="Email Address"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="w-full p-4 rounded-2xl bg-black border border-white/10 outline-none"
    />

    <input
      type="text"
      placeholder="Company Name"
      value={company}
      onChange={(e) => setCompany(e.target.value)}
      className="w-full p-4 rounded-2xl bg-black border border-white/10 outline-none"
    />

    <input
      type="text"
      placeholder="Your Role"
      value={role}
      onChange={(e) => setRole(e.target.value)}
      className="w-full p-4 rounded-2xl bg-black border border-white/10 outline-none"
    />

    <button
      onClick={async () => {

        if (!email) {
          alert("Please enter email");
          return;
        }

        const { error } = await supabase
          .from("leads")
          .insert([
            {
              email,
              company,
              role,
              team_size: tools.length.toString(),
            },
          ]);

        if (error) {

          console.log(error);

          alert("Error saving lead");

        } else {

          alert("Lead saved successfully!");

        }

      }}
      className="w-full py-4 rounded-2xl bg-cyan-500 text-black font-bold hover:scale-[1.02] transition"
    >
      Save Audit Report
    </button>

  </div>

</div>
      {/* FOOTER */}
      <footer className="border-t border-white/10 py-10 px-6 mt-20">

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">

          <div>

            <h2 className="text-2xl font-bold">
              SpendPilot AI
            </h2>

            <p className="text-gray-500 mt-2">
              AI Spend Intelligence Platform
            </p>

          </div>

          <div className="flex items-center gap-6 text-gray-400">

            <p>Next.js</p>
            <p>Supabase</p>
            <p>OpenAI</p>

          </div>

        </div>

      </footer>

    </main>
  );
}