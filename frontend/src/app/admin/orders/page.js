"use client";

import { useEffect, useMemo, useState } from "react";
import { ClipboardList, RefreshCw, Search } from "lucide-react";
import { adminFetch, formatDate, formatMoney } from "../adminApi";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await adminFetch("/api/admin/orders");
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = `${order.id} ${order.user_name}`.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === "all" || order.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, status]);

  const statuses = Array.from(new Set(orders.map((order) => order.status).filter(Boolean)));

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ClipboardList size={18} />
            <h2 className="text-base font-black text-stone-950">Orders From Database</h2>
          </div>
          <p className="mt-1 text-xs font-semibold text-stone-500">{filtered.length} orders shown</p>
        </div>

        <button
          type="button"
          onClick={loadOrders}
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-stone-300 px-3 py-2 text-xs font-bold uppercase tracking-wider text-stone-700 hover:bg-stone-50"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      <div className="mb-4 grid gap-3 md:grid-cols-[1fr_180px]">
        <label className="relative block">
          <Search className="absolute left-3 top-2.5 text-stone-400" size={16} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search order or customer"
            className="w-full rounded-lg border border-stone-300 py-2 pl-9 pr-3 text-sm font-semibold outline-none focus:border-stone-950"
          />
        </label>

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-semibold outline-none focus:border-stone-950"
        >
          <option value="all">All statuses</option>
          {statuses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {loading && <EmptyText>Loading orders...</EmptyText>}
      {error && <EmptyText>{error}</EmptyText>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-xs font-black uppercase tracking-widest text-stone-500">
                <th className="px-3 py-3">Order</th>
                <th className="px-3 py-3">Customer</th>
                <th className="px-3 py-3">Items</th>
                <th className="px-3 py-3">Total</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((order) => (
                <tr key={order.id} className="text-sm">
                  <td className="px-3 py-3 font-black text-stone-950">#{order.id}</td>
                  <td className="px-3 py-3 font-semibold text-stone-700">{order.user_name}</td>
                  <td className="px-3 py-3 font-semibold text-stone-600">{order.items_count}</td>
                  <td className="px-3 py-3 font-black text-stone-950">{formatMoney(order.total_amount)}</td>
                  <td className="px-3 py-3">
                    <span className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-black uppercase text-emerald-700">
                      {order.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 font-semibold text-stone-600">{formatDate(order.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && <EmptyText>No matching orders found.</EmptyText>}
        </div>
      )}
    </section>
  );
}

function EmptyText({ children }) {
  return <p className="rounded-lg border border-dashed border-stone-300 p-6 text-center text-sm font-semibold text-stone-500">{children}</p>;
}
