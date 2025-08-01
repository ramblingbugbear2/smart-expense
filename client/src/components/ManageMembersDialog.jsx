// components/ManageMembersDialog.jsx
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ManageMembersDialog({
  open,
  setOpen,
  group,          // { _id, name, members }
  allUsers,       // array of user objs
  onSave,         // async (newMembers[]) => void
}) {
  const [members, setMembers] = useState(group?.members ?? []);

  useEffect(() => {
    setMembers(group?.members ?? []);
  }, [group]);

  if (!group) return null;

  const submit = async (e) => {
    e.preventDefault();
    await onSave(members);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="sm:max-w-md
                   [&>button]:bg-red-600
                   [&>button]:text-white
                   [&>button]:hover:bg-red-700"
      >
        <DialogHeader>
          <DialogTitle>Manage members – {group.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div className="max-h-48 overflow-y-auto border rounded p-2 space-y-1">
            {allUsers.map((u) => (
              <label key={u._id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={members.includes(u._id)}
                  onChange={() =>
                    setMembers((m) =>
                      m.includes(u._id)
                        ? m.filter((id) => id !== u._id)
                        : [...m, u._id]
                    )
                  }
                />
                <span>{u.name}</span>
              </label>
            ))}
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
