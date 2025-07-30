import { useState } from 'react';
import api              from '@/api/axios';
import { Button }       from '@/components/ui/button';
import { Input }        from '@/components/ui/input';

export default function ExpenseForm({ groupId, payerId, members, onSaved }) {
  const [amount, setAmt]   = useState('');
  const [desc,   setDesc]  = useState('');
  const [payer,  setPayer] = useState(payerId ?? members?.[0]?._id);

  const submit = async e => {
    e.preventDefault();

    const amt    = Number(amount);
    const share  = amt / members.length;

    const payload = {
      group:  groupId,
      payer:  payer,                     // ← selected member
      amount: amt,
      description: desc,
      participants: members.map(u => ({
      user: typeof u === 'string' ? u : u._id,
      share
    }))
    };


    const { data } = await api.post('/expenses', payload);
    onSaved?.(data);                     // update parent list

    setAmt('');
    setDesc('');
  };

  return (
    <form onSubmit={submit} className="space-y-2">
      {/* Amount & description */}
      <Input
        value={amount}
        onChange={e => setAmt(e.target.value)}
        placeholder="Amount"
        type="number"
        min="0"
        required
      />
      <Input
        value={desc}
        onChange={e => setDesc(e.target.value)}
        placeholder="Description"
        required
      />
      {/* --- who paid (plain HTML) --- */}
      <select
        className="w-full border rounded px-3 py-2"
        value={payer}
        onChange={(e) => setPayer(e.target.value)}
      >
        {members.map(m => (
          <option key={m._id} value={m._id}>
            {m.name ?? m.email ?? m._id.slice(-4)}
          </option>
        ))}
      </select>


      <Button className="w-full" disabled={!amount || !desc}>
        Add expense
      </Button>
    </form>
  );
}
