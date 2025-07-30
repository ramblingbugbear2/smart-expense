import { Pen, Trash2 } from 'lucide-react';
import { useEditExpense, useDeleteExpense } from '@/hooks/useExpenseMutations';
import { useState } from 'react';
import { Button } from "@/components/ui/button"; 

export default function ExpenseRow({ e }) {
  const editM   = useEditExpense();
  const delM    = useDeleteExpense();
  const [edit, setEdit] = useState(false);
  const [draftDesc, setDesc] = useState(e.description);
  const [draftAmt,  setAmt]  = useState(e.amount);

  if (edit) {
    return (
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
            editM.mutate({
            id:    e._id,
            group: e.group,        // <= we need this for cache-busting later
            description: draftDesc,
            amount: +draftAmt,
            });
          setEdit(false);
        }}
        className="border p-2 rounded space-y-1"
      >
        <input value={draftDesc} onChange={(e) => setDesc(e.target.value)} />
        <input
          type="number"
          value={draftAmt}
          onChange={(e) => setAmt(e.target.value)}
        />
        <button className="btn btn-sm">Save</button>
      </form>
    );
  }

  return (
    <div className="border p-2 rounded flex justify-between items-center">
      <p>
        {e.description} — ₹{e.amount.toLocaleString()}
        <span className="text-xs italic text-gray-500">
          &nbsp;(paid by {e.payer?.name ?? '-'})
        </span>
      </p>
      <div className="flex gap-2">
        <Button
            size="icon"
            variant="outline"
            onClick={() => setEdit(true)}
        >
            <Pen className="w-4 h-4" />
        </Button>

        <Button
            size="icon"
            variant="destructive"
            onClick={() => delM.mutate({ id: e._id, group: e.group })}
        >
            <Trash2 className="w-4 h-4" />
        </Button>
       </div>
    </div>
  );
}
