"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as echarts from "echarts/core";
import { PieChart } from "echarts/charts";
import {
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  type TitleComponentOption,
  type TooltipComponentOption,
  type LegendComponentOption,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

import type { CredentialMetric } from "@/lib/credential-metrics";

echarts.use([PieChart, TitleComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

type EChartsOption = echarts.ComposeOption<
  TitleComponentOption | TooltipComponentOption | LegendComponentOption
>;

type MetricsDashboardClientProps = {
  metrics: CredentialMetric[];
};

type SlugChartProps = {
  slug: string;
  saveContactClicks: number;
  whatsappClicks: number;
  anio: number;
  mes: number;
};

const MONTH_LABELS = [
  "",
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

function formatMonth(mes: number) {
  return MONTH_LABELS[mes] ?? `Mes ${mes}`;
}

function SlugPieChart({
  slug,
  saveContactClicks,
  whatsappClicks,
  anio,
  mes,
}: SlugChartProps) {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const normalizedSaveContactClicks = Number.isFinite(saveContactClicks)
    ? saveContactClicks
    : 0;
  const normalizedWhatsappClicks = Number.isFinite(whatsappClicks)
    ? whatsappClicks
    : 0;

  useEffect(() => {
    if (!chartRef.current) {
      return;
    }

    const chart = echarts.init(chartRef.current);
    const option: EChartsOption = {
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} ({d}%)",
      },
      legend: {
        bottom: 0,
        icon: "circle",
        textStyle: {
          color: "#4b5563",
          fontSize: 12,
        },
      },
      series: [
        {
          name: slug,
          type: "pie",
          radius: ["48%", "76%"],
          center: ["50%", "45%"],
          avoidLabelOverlap: true,
          itemStyle: {
            borderColor: "#ffffff",
            borderWidth: 3,
          },
          label: {
            color: "#111827",
            fontSize: 12,
            formatter: "{d}%",
          },
          labelLine: {
            length: 12,
            length2: 10,
          },
          data: [
            {
              value: normalizedSaveContactClicks,
              name: "Guardar contacto",
              itemStyle: { color: "#111111" },
            },
            {
              value: normalizedWhatsappClicks,
              name: "WhatsApp",
              itemStyle: { color: "#d4d4d8" },
            },
          ],
        },
      ],
    };

    chart.setOption(option);

    const resizeObserver = new ResizeObserver(() => {
      chart.resize();
    });

    resizeObserver.observe(chartRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.dispose();
    };
  }, [normalizedSaveContactClicks, normalizedWhatsappClicks, slug]);

  const total = normalizedSaveContactClicks + normalizedWhatsappClicks;

  return (
    <article className="rounded-3xl border border-border bg-card p-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">{slug}</h2>
        <p className="text-sm text-muted-foreground">
          {formatMonth(mes)} {anio}
        </p>
      </div>

      <div ref={chartRef} className="mt-4 h-[320px] w-full" />

      <div className="grid gap-3 border-t border-border pt-4 sm:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Total
          </p>
          <p className="mt-1 text-2xl font-semibold">{total}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Guardar contacto
          </p>
          <p className="mt-1 text-xl font-medium">{normalizedSaveContactClicks}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            WhatsApp
          </p>
          <p className="mt-1 text-xl font-medium">{normalizedWhatsappClicks}</p>
        </div>
      </div>
    </article>
  );
}

export function MetricsDashboardClient({
  metrics,
}: MetricsDashboardClientProps) {
  const fallbackYear = new Date().getFullYear();
  const yearOptions = useMemo(
    () =>
      Array.from(new Set(metrics.map((metric) => metric.anio))).sort((a, b) => b - a),
    [metrics],
  );

  const [yearSelection, setYearSelection] = useState<number>(yearOptions[0] ?? fallbackYear);
  const selectedYear = yearOptions.includes(yearSelection)
    ? yearSelection
    : (yearOptions[0] ?? fallbackYear);

  const monthOptions = useMemo(
    () =>
      Array.from(
        new Set(
          metrics
            .filter((metric) => metric.anio === selectedYear)
            .map((metric) => metric.mes),
        ),
      ).sort((a, b) => a - b),
    [metrics, selectedYear],
  );

  const [monthSelection, setMonthSelection] = useState<number>(
    monthOptions[monthOptions.length - 1] ?? 1,
  );
  const selectedMonth = monthOptions.includes(monthSelection)
    ? monthSelection
    : (monthOptions[monthOptions.length - 1] ?? 1);

  const filteredMetrics = useMemo(
    () =>
      metrics.filter(
        (metric) => metric.anio === selectedYear && metric.mes === selectedMonth,
      ),
    [metrics, selectedMonth, selectedYear],
  );

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-3xl border border-border bg-card p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Filtro de periodo</h2>
            <p className="text-sm text-muted-foreground">
              Selecciona mes y ano para comparar las interacciones por slug.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="metrics-year" className="text-sm font-medium">
                Ano
              </label>
              <select
                id="metrics-year"
                value={selectedYear}
                onChange={(event) => {
                  const nextYear = Number(event.target.value);
                  const nextMonthOptions = Array.from(
                    new Set(
                      metrics
                        .filter((metric) => metric.anio === nextYear)
                        .map((metric) => metric.mes),
                    ),
                  ).sort((a, b) => a - b);

                  setYearSelection(nextYear);
                  setMonthSelection(nextMonthOptions[nextMonthOptions.length - 1] ?? 1);
                }}
                className="min-h-11 rounded-2xl border border-input bg-background px-4 text-sm outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/20"
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="metrics-month" className="text-sm font-medium">
                Mes
              </label>
              <select
                id="metrics-month"
                value={selectedMonth}
                onChange={(event) => setMonthSelection(Number(event.target.value))}
                className="min-h-11 rounded-2xl border border-input bg-background px-4 text-sm outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/20"
              >
                {monthOptions.map((month) => (
                  <option key={month} value={month}>
                    {formatMonth(month)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {filteredMetrics.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
          No hay metricas registradas para {formatMonth(selectedMonth)} {selectedYear}.
        </section>
      ) : (
        <section className="grid gap-6 xl:grid-cols-2 2xl:grid-cols-3">
          {filteredMetrics.map((metric) => (
            <SlugPieChart
              key={`${metric.slug}-${metric.anio}-${metric.mes}`}
              slug={metric.slug}
              saveContactClicks={metric.saveContactClicks}
              whatsappClicks={metric.whatsappClicks}
              anio={metric.anio}
              mes={metric.mes}
            />
          ))}
        </section>
      )}
    </div>
  );
}
