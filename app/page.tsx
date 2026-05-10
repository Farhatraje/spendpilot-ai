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

  // LOAD DATA
  useEffect(() => {

    const saved = localStorage.getItem("multiTools");

    if (saved) {
      setTools(JSON.parse(saved));
    }

  }, []);

  // SAVE DATA
  useEffect(() => {

    localStorage.setItem(
      "multiTools",
      JSON.stringify(tools)
    );

  }, [tools]);

  // HANDLE CHANGE
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

  // ADD TOOL
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

  // REMOVE TOOL
  const removeTool = (id: number) => {

    const filtered = tools.filter(
      (item) => item.id !== id
    );

    setTools(filtered);
  };

  // GENERATE AUDIT
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

    // SAVE AUDIT
    const { data, error } = await supabase
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

    console.log(data);
    console.log(error);

    if (data) {
      setAuditId(data.id);
    }

    setResults(auditResults);

    // AI SUMMARY
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

    } catch (error) {

      setAiSummary(
        "Your AI stack has optimization opportunities with potential monthly savings."
      );

    }

    setShowResult(true);
  };

  // SAVE LEAD
  const saveLead = async () => {

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

  };

  // TOTAL SAVINGS
  const totalSavings = results.reduce(
    (acc, item) => acc + item.savings,
    0
  );

  return (
    <main className="min-h-screen bg-black text-white">

      <section className="px-6 py-20">

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start">

          {/* LEFT */}
          <div>

            <div className="inline-block px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm">
              Multi-Tool AI Audit
            </div>

            <h1 className="text-6xl font-bold mt-8 leading-tight">
              Optimize Your
              <span className="block text-cyan-400">
                AI Stack
              </span>
            </h1>

          </div>

          {/* RIGHT */}
          <div className="space-y-6">

            {/* FORM */}
            <div className="p-8 rounded-3xl border border-white/10 bg-white/5">

              <h2 className="text-3xl font-bold">
                AI Stack Audit
              </h2>

              <div className="mt-8 space-y-6">

                {tools.map((item, index) => (

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
                        className="w-full p-4 rounded-2xl bg-black border border-white/10"
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
                        className="w-full p-4 rounded-2xl bg-black border border-white/10"
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
                        className="w-full p-4 rounded-2xl bg-black border border-white/10"
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
                        className="w-full p-4 rounded-2xl bg-black border border-white/10"
                      />

                    </div>

                  </div>

                ))}

                <div className="flex gap-4">

                  <button
                    onClick={addTool}
                    className="flex-1 py-4 rounded-2xl border border-white/10"
                  >
                    Add Tool
                  </button>

                  <button
                    onClick={generateAudit}
                    className="flex-1 py-4 rounded-2xl bg-cyan-500"
                  >
                    Generate Audit
                  </button>

                </div>

              </div>

            </div>

            {/* RESULTS */}
            {showResult && (

              <div className="space-y-6">

                {/* HERO */}
                <div className="p-8 rounded-3xl border border-cyan-500/20 bg-cyan-500/10">

                  <h2 className="text-6xl font-bold">
                    ${totalSavings}/mo
                  </h2>

                  <p className="text-gray-300 mt-3">
                    Potential Monthly Savings
                  </p>

                </div>

                {/* SHARE URL */}
                {auditId && (

                  <div className="p-8 rounded-3xl border border-green-500/20 bg-green-500/10">

                    <h3 className="text-2xl font-bold">
                      Shareable URL
                    </h3>

                    <div className="mt-5 flex gap-4">

                      <input
                        readOnly
                        value={`http://localhost:3000/audit/${auditId}`}
                        className="flex-1 p-4 rounded-2xl bg-black border border-white/10"
                      />

                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `http://localhost:3000/audit/${auditId}`
                          );

                          alert("Copied!");
                        }}
                        className="px-6 rounded-2xl bg-cyan-500"
                      >
                        Copy
                      </button>

                    </div>

                  </div>

                )}

                {/* AI SUMMARY */}
                <div className="p-8 rounded-3xl border border-purple-500/20 bg-purple-500/10">

                  <h3 className="text-2xl font-bold">
                    AI Summary
                  </h3>

                  <p className="text-gray-300 mt-4">
                    {aiSummary}
                  </p>

                </div>

              </div>

            )}

          </div>

        </div>

      </section>

    </main>
  );
}