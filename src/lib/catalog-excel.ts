import * as XLSX from "xlsx";

import {
  catalogSettingsSchema,
  type CatalogItem,
  type CatalogSettings,
} from "@/lib/catalog-schema";

const EXCEL_HEADERS = [
  "url foto",
  "nombre",
  "url ficha tecnica",
] as const;

type ExcelRow = Record<string, unknown>;

function normalizeCellValue(value: unknown) {
  return typeof value === "string" ? value.trim() : String(value ?? "").trim();
}

export function buildCatalogWorkbookBuffer(catalog: CatalogSettings) {
  const rows = catalog.items.map((item) => ({
    [EXCEL_HEADERS[0]]: item.imageUrl,
    [EXCEL_HEADERS[1]]: item.name,
    [EXCEL_HEADERS[2]]: item.technicalSheetUrl,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows, {
    header: [...EXCEL_HEADERS],
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "catalogo");

  return XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
  });
}

export function parseCatalogWorkbookBuffer(buffer: ArrayBuffer) {
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];

  if (!sheetName) {
    return catalogSettingsSchema.parse({ items: [] });
  }

  const worksheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<ExcelRow>(worksheet, {
    defval: "",
  });

  const items: CatalogItem[] = rows
    .map((row) => ({
      imageUrl: normalizeCellValue(row[EXCEL_HEADERS[0]]),
      name: normalizeCellValue(row[EXCEL_HEADERS[1]]),
      technicalSheetUrl: normalizeCellValue(row[EXCEL_HEADERS[2]]),
    }))
    .filter((item) =>
      item.imageUrl !== "" ||
      item.name !== "" ||
      item.technicalSheetUrl !== "",
    );

  return catalogSettingsSchema.parse({ items });
}
