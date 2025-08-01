import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";
import { useSocket } from "@/hooks/useSocket";

import ExpenseForm from "@/components/ExpenseForm";
import ExpenseRow from "@/components/ExpenseRow";
import SettleDialog from "@/components/SettleDialog";
import { HandCoins } from "lucide-react";

export default function GroupDetail() {
  /* -------------------------------------------------- */
  /*  context                                            */
  /* -------------------------------------------------- */
  const { id } = useParams();
  const socket = useSocket(id);
  const qc = useQueryClient();

  /* -------------------------------------------------- */
  /*  data (React-Query)                                */
  /* -------------------------------------------------- */
  const { data: group } = useQuery({
    queryKey: ["group", id],
    queryFn: () => api.get(`/groups/${id}`).then((r) => r.data),
  });

  const { data: expenses = [] } = useQuery({
    queryKey: ["expenses", id],
    queryFn: () => api.get(`/expenses/group/${id}`).then((r) => r.data),
  });

  const { data: balances = {} } = useQuery({
    queryKey: ["balances", id],
    queryFn: () => api.get(`/expenses/balances/${id}`).then((r) => r.data),
  });

  /* -------------------------------------------------- */
  /*  derived stats                                     */
  /* -------------------------------------------------- */
  const stats =
    !group
      ? []
      : Object.entries(balances).map(([uid, net]) => {
          const m = group.members.find((u) => u._id === uid) ?? {};
          const paid = net > 0 ? net : 0;
          const owed = net < 0 ? -net : 0;
          return {
            uid,
            name: m.name ?? m.email ?? uid.slice(-4),
            paid,
            owed,
            net,
          };
        });

  /* -------------------------------------------------- */
  /*  live updates                                      */
  /* -------------------------------------------------- */
  useEffect(() => {
    socket.on("expense:new", () => qc.invalidateQueries(["expenses", id]));
    socket.on("settlement:new", () => qc.invalidateQueries(["balances", id]));
    socket.on("expense:clear", () => {
      qc.invalidateQueries(["expenses", id]);
      qc.invalidateQueries(["balances", id]);
    });
    return () => {
      socket.off("expense:new");
      socket.off("settlement:new");
      socket.off("expense:clear");
    };
  }, [socket, id, qc]);

  /* -------------------------------------------------- */
  /*  local state                                       */
  /* -------------------------------------------------- */
  const [openSettle, setOpenSettle] = useState(false);
  if (!group) return null;

/* 1️⃣  page wrapper — fills viewport & centres content */
return (
    <main className="pt-24 pb-16 px-4 min-h-screen flex justify-center">
      <div
        className="
           max-w-[82rem]            /* ⬅ wider entire stage */
           grid gap-12
           lg:grid-cols-[34rem_26rem] /* ⬅ 34 rem form | 26 rem balances */
           mx-auto items-start"
      >
        {/* Left: form + history */}
        <section className="space-y-4 bg-blue-50/60 backdrop-blur rounded-2xl p-6 shadow">
          <ExpenseForm
            groupId={id}
            payerId={group.createdBy}
            members={group.members}
            onSaved={() => qc.invalidateQueries(['expenses', id])}
          />
          {expenses.map((e) => (
            <ExpenseRow key={e._id} e={e} members={group.members} />
          ))}
        </section>
        {/* Right: balances */}
        <aside className="space-y-4 self-start w-full lg:w-[26rem] flex flex-col items-center">
          {stats.map(({ uid, name, paid, owed, net }) => (
            <div
              key={uid}
              className={`
                w-full rounded-xl px-4 py-3 shadow flex flex-col items-center ${net >= 0 ? 'bg-green-50 text-green-700'
                            : 'bg-red-50  text-red-700'}`}
            >
              <span className="font-semibold">{name}</span>
              <span className="tabular-nums text-xs">
                ₹{paid.toLocaleString(undefined,{minimumFractionDigits:2})}
                &nbsp;/&nbsp;
                ₹{owed.toLocaleString(undefined,{minimumFractionDigits:2})}<br />
                = <strong>{net >= 0 ? '+' : ''}{net.toFixed(2)}</strong>
              </span>
            </div>
          ))}
          <button
            onClick={() => setOpenSettle(true)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white transition"
          >
            <HandCoins className="w-5 h-5" />
            Settle Up
          </button>
          <SettleDialog
            groupId={id}
            open={openSettle}
            onOpenChange={setOpenSettle}
          />
        </aside>
      </div>
    </main>
  );
}
