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
        const clear = i === 0;                       // only **first** request
        await createSettle.mutateAsync({ ...tx, clear, group: groupId });
      }
      onOpenChange(false);                     // close on success
    } catch (err) {
      // react-query already stores the error; no re-throw
    }
  };

  const processing = isLoading || createSettle.isLoading;

  /* ─────────────────────────  ui  ───────────────────────── */
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HandCoins className="h-5 w-5 text-sky-600" />
            Settle&nbsp;Up
          </DialogTitle>

          {/*   ←–––– fixes the “Missing Description” warning  */}
          <DialogDescription>
            We’ll create individual settlement records
            &nbsp;– one for each transfer shown below.
          </DialogDescription>
        </DialogHeader>

        {/* --------------- content --------------- */}
        {isLoading ? (
          <p>Loading…</p>
        ) : isError ? (
          <p className="text-red-600 text-sm">
            Couldn’t fetch pending transfers (are you logged in?)&nbsp;–&nbsp;try again.
          </p>
        ) : xfers.length === 0 ? (
          <p className="italic text-gray-500">Nothing to settle 🎉</p>
        ) : (
          <ul className="space-y-1">
            {xfers.map((x) => (
              <li
                key={`${x.from}-${x.to}`}
                className="flex justify-between font-mono text-sm"
              >
                <span>{x.fromName} → {x.toName}</span>
                <span>₹{x.amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}

        {/* --------------- footer --------------- */}
        <Button
          className="w-full mt-4"
          onClick={confirm}
          disabled={processing || xfers.length === 0}
        >
          {processing ? 'Processing…' : 'Confirm & Pay'}
        </Button>

        {/* optional error from create-mutation */}
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
