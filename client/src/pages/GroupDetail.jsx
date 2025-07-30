/* client/src/pages/GroupDetail.jsx */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/api/axios';

import { useSocket }    from '@/hooks/useSocket';

import ExpenseForm      from '@/components/ExpenseForm';
import ExpenseRow       from '@/components/ExpenseRow';
import SettleDialog from '@/components/SettleDialog';

import { HandCoins } from 'lucide-react';

export default function GroupDetail() {
  /* -------------------------------------------------- */
  /* basic context                                      */
  /* -------------------------------------------------- */
  const { id }      = useParams();          // group id from route
  const socket      = useSocket(id);        // socket.io instance

  /* -------------------------------------------------- */
  /* server state via React-Query                       */
  /* -------------------------------------------------- */
  const qc = useQueryClient();

  const { data: expenses = [] } = useQuery({
    queryKey : ['expenses', id],
    queryFn  : () => api.get(`/expenses/group/${id}`).then(r => r.data),
  });

   const { data: balances = {} } = useQuery({
     queryKey : ['balances', id],
     queryFn  : () => api.get(`/expenses/balances/${id}`).then(r => r.data),
   });

   const { data: group } = useQuery({
     queryKey : ['group', id],
     queryFn  : () => api.get(`/groups/${id}`).then(r => r.data),
   });

  //  if(!group) return null;

  /* -------------------------------------------------- */
  /* derived stats                                      */
  /* -------------------------------------------------- */
  // const stats = useStats(expenses);
    const stats = !group
      ? []                                      // ← nothing to show yet
      : Object.entries(balances).map(([uid, net]) => {
          const m = group.members.find((u) => u._id === uid) ?? {};
      const paid =  (net > 0 ?  net : 0);   // she’s owed
      const owed =  (net < 0 ? -net : 0);   // she owes
      return {
        uid,
        name : m.name ?? m.email ?? uid.slice(-4),
        paid,
        owed,
        net,
      };
    });

  /* -------------------------------------------------- */
  /* live updates via Socket.IO                          */
  /* -------------------------------------------------- */
  useEffect(() => {
    // whenever the backend tells us something changed, we just refetch
    socket.on('expense:new',    () => qc.invalidateQueries(['expenses',  id]));
    socket.on('settlement:new', () => qc.invalidateQueries(['balances',  id]));
    socket.on('expense:clear',  () => {
      qc.invalidateQueries(['expenses', id]);
      qc.invalidateQueries(['balances', id]);
    });

    return () => {
      socket.off('expense:new');
      socket.off('settlement:new');
      socket.off('expense:clear');
    };
  }, [socket, id, qc]);

  /* -------------------------------------------------- */
  /* local ui state                                     */
  /* -------------------------------------------------- */
  const [openSettle, setOpenSettle] = useState(false);

  if (!group) return null;   // still loading

  /* -------------------------------------------------- */
  /* render                                             */
  /* -------------------------------------------------- */
  return (
    <div className="p-6 grid lg:grid-cols-3 gap-6">
      {/* -------------------------- history & form ------------------------- */}
      <section className="lg:col-span-2 space-y-2">
        <ExpenseForm
          groupId={id}
          payerId={group.createdBy}
          members={group.members}
          onSaved={() => qc.invalidateQueries(['expenses', id])}
        />

        {expenses.map(exp => (
          <ExpenseRow
            key={exp._id}
            e={exp}
            members={group.members}
          />
        ))}
      </section>

      {/* -------------------------- balances & settle ---------------------- */}
      <aside className="space-y-2">
        {/* summary */}
        <div className="space-y-1">
          {stats.map(({ name, paid, owed, net }) => (
            <div
              key={name}
              className={`
                flex justify-between rounded px-2 py-1 text-sm
                ${net >= 0
                  ? 'bg-green-50 text-green-600'
                  : 'bg-red-50 text-red-600'}
              `}
            >
              <span className="font-medium">{name}</span>
              <span className="tabular-nums">
                ₹{paid.toFixed(2)} / ₹{owed.toFixed(2)} =&nbsp;
                <strong>{net >= 0 ? '+' : ''}{net.toFixed(2)}</strong>
              </span>
            </div>
          ))}
        </div>

        {/* settle button */}
        <button
          className="mt-4 w-full flex items-center justify-center gap-2 py-2 bg-sky-600 text-white rounded"
          onClick={() => setOpenSettle(true)}
        >
          <HandCoins className="w-5 h-5" /> Settle Up
        </button>

        {/* modal */}
        <SettleDialog
          groupId={id}
          open={openSettle}
          onOpenChange={setOpenSettle}
        />
      </aside>
    </div>
  );
}
