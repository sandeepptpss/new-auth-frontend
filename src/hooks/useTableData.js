// src/hooks/useTableData.js
import { useEffect, useMemo, useState } from "react";

const getValue = (row, key) => key.split(".").reduce((acc, k) => acc?.[k], row);

const compare = (a, b) => {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (typeof a === "boolean" && typeof b === "boolean") return Number(a) - Number(b);
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
};

/**
 * Client-side search + sort + pagination over an in-memory row list.
 *
 * @param rows          the full data set
 * @param searchFields  row keys (dot paths allowed) matched against `search`
 * @param search        free-text query
 * @param initialSort   { key, direction } starting sort
 */
export default function useTableData(rows, searchFields = [], search = "", initialSort = {}) {
  const [sort, setSort] = useState({
    key: initialSort.key || null,
    direction: initialSort.direction || "asc",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) =>
      searchFields.some((field) =>
        String(getValue(row, field) ?? "").toLowerCase().includes(query)
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, search, searchFields.join("|")]);

  const sorted = useMemo(() => {
    if (!sort.key) return filtered;
    const factor = sort.direction === "desc" ? -1 : 1;
    return [...filtered].sort(
      (a, b) => compare(getValue(a, sort.key), getValue(b, sort.key)) * factor
    );
  }, [filtered, sort]);

  // Keep the current page valid as the result set shrinks (e.g. while typing).
  const pageCount = Math.max(1, Math.ceil(sorted.length / rowsPerPage));
  useEffect(() => {
    if (page > pageCount - 1) setPage(pageCount - 1);
  }, [page, pageCount]);

  const paged = useMemo(
    () => sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [sorted, page, rowsPerPage]
  );

  const toggleSort = (key) =>
    setSort((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );

  return {
    rows: paged,
    total: sorted.length,
    sort,
    toggleSort,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage: (n) => {
      setRowsPerPage(n);
      setPage(0);
    },
  };
}
