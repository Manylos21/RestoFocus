"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const DEMO_DATA = [
  { day: "J-6", montant: 820 },
  { day: "J-5", montant: 1150 },
  { day: "J-4", montant: 980 },
  { day: "J-3", montant: 1320 },
  { day: "J-2", montant: 1090 },
  { day: "Hier", montant: 1450 },
  { day: "Auj.", montant: 1280 },
];

function formatEur(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function RevenueChart() {
  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-zinc-900">
          Activité (démonstration)
        </h2>
        <p className="text-sm text-zinc-500">
          Volume indicatif sur les 7 derniers jours — données fictives en attendant
          la facturation en base.
        </p>
      </div>
      <div className="h-[280px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={DEMO_DATA}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-100" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fill: "#71717a" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#71717a" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}`}
            />
            <Tooltip
              formatter={(value) => [
                formatEur(Number(value ?? 0)),
                "Volume",
              ]}
              labelStyle={{ color: "#18181b", fontWeight: 600 }}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e4e4e7",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.08)",
              }}
            />
            <Bar
              dataKey="montant"
              name="Volume"
              fill="#18181b"
              radius={[6, 6, 0, 0]}
              maxBarSize={48}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
