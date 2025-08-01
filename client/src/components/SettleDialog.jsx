import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button }          from '@/components/ui/button';
import { HandCoins }       from 'lucide-react';
import { usePending,
         useCreateSettlement } from '@/hooks/useSettlement';

export default function SettleDialog({ groupId, open, onOpenChange }) {
  
  /* ───────────────────────── data ───────────────────────── */
  const { data: xfers = [], isLoading, isError } = usePending(groupId);
  const createSettle  = useCreateSettlement();

  /* ──────────────────────── helpers ─────────────────────── */
  const confirm = async () => {
    try {
      for (let i = 0; i < xfers.length; i++) {
        const tx    = xfers[i];
        const clear = i === xfers.length - 1;                   
        await createSettle.mutateAsync({ ...tx, clear, group: groupId });
      }
      qc.invalidateQueries(['pending', groupId]);
      onOpenChange(false);                     // close on success
    } catch (err) {
      // react-query already stores the error; no re-throw
    }
  };

  const processing = isLoading || createSettle.isLoading;

  /* ─────────────────────────  ui  ───────────────────────── */
  return (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent
      className="sm:max-w-md
                 [&>button]:bg-red-600
                 [&>button]:text-white
                 [&>button]:hover:bg-red-700
                 [&>button]:focus:outline-none"
    >
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-lg">
          <HandCoins className="w-5 h-5 text-sky-600" />
          Settle Up
        </DialogTitle>
        <DialogDescription>
          We’ll create individual settlement records — one for each transfer below.
        </DialogDescription>
      </DialogHeader>

      {/* ---------- transfers ---------- */}
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading&hellip;</p>
      ) : isError ? (
        <p className="text-sm text-red-600">
          Couldn’t load pending transfers. Try again.
        </p>
      ) : xfers.length === 0 ? (
        <div className="rounded-lg bg-green-50 p-4 text-center text-green-700">
          <p className="text-sm">Nothing to settle&nbsp;🎉</p>
        </div>
      ) : (
        <>
          {/* grand total */}
          <div className="text-right font-mono font-semibold text-lg">
            ₹
            {xfers
              .reduce((sum, x) => sum + x.amount, 0)
              .toFixed(2)}
          </div>

          {/* list */}
          <ul className="divide-y divide-border rounded-md border border-border">
            {xfers.map((x) => (
              <li
                key={`${x.from}-${x.to}`}
                className="flex items-center justify-between px-3 py-2 text-sm"
              >
                <span className="flex items-center gap-1">
                  {x.fromName}
                  <HandCoins className="w-3 h-3 opacity-60" />
                  {x.toName}
                </span>
                <span className="font-mono">₹{x.amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* ---------- footer ---------- */}
      <Button
        disabled={processing || xfers.length === 0}
        onClick={confirm}
        className="w-full mt-4 hover:bg-neutral-800 disabled:opacity-50"
      >
        {processing ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                d="M4 12a8 8 0 018-8"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
            Processing…
          </span>
        ) : (
          'Confirm & Pay'
        )}
      </Button>

      {createSettle.isError && (
        <p className="mt-2 text-xs text-red-600">
          {createSettle.error?.response?.data?.msg ??
            createSettle.error?.message ??
            'Something went wrong'}
        </p>
      )}
    </DialogContent>
  </Dialog>
);
}
