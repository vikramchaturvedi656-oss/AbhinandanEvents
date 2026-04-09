const toneMap = {
  Confirmed: "bg-emerald-500/15 text-emerald-200 border-emerald-400/30",
  Approved: "bg-emerald-500/15 text-emerald-200 border-emerald-400/30",
  Pending: "bg-amber-500/15 text-amber-200 border-amber-400/30",
  Cancelled: "bg-rose-500/15 text-rose-200 border-rose-400/30",
  Rejected: "bg-rose-500/15 text-rose-200 border-rose-400/30",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
        toneMap[status] || "bg-slate-500/15 text-slate-100 border-white/10"
      }`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;
