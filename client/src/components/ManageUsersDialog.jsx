import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, PenLine, Check } from "lucide-react";
import api from "../api/axios.js";

export default function ManageUsersDialog({ open, setOpen, onUsersChange }) {
  const [users, setUsers] = useState([]);
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  /* fetch users each time dialog opens */
  useEffect(() => {
    if (open) api.get("/members").then((res) => setUsers(res.data));
  }, [open]);

  /* helper to sync parent */
  const syncUp = (list) => {
    setUsers(list);
    onUsersChange && onUsersChange(list);
  };

  /* ---------------- CRUD handlers ---------------- */
  const addUser = async () => {
    const name = newName.trim();
    if (!name) return;
    const { data } = await api.post("/members", { name });
    syncUp([...users, data]);
    setNewName("");
  };

  const saveRename = async () => {
    const name = editName.trim();
    if (!name) return;
    const { data } = await api.put(`/members/${editId}`, { name });
    syncUp(users.map((x) => (x._id === data._id ? data : x)));
    setEditId(null);
    setEditName("");
  };

  const deleteUser = async (id) => {
    await api.delete(`/members/${id}`);
    syncUp(users.filter((x) => x._id !== id));
  };

  /* ---------------- UI ---------------- */
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="sm:max-w-md
                   [&>button]:bg-red-600
                   [&>button]:text-white
                   [&>button]:hover:bg-red-700"
      >
        <DialogHeader>
          <DialogTitle>Manage users</DialogTitle>
        </DialogHeader>

        {/* Add new */}
        <div className="flex gap-2">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New user name"
          />
          <Button onClick={addUser}>Add</Button>
        </div>

        {/* List */}
        <div className="max-h-56 overflow-y-auto border rounded p-2 space-y-2">
          {users.map((u) => (
            <div key={u._id} className="flex items-center gap-2">
              {/* Name / edit field */}
              {editId === u._id ? (
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1"
                  autoFocus
                />
              ) : (
                <span className="flex-1 truncate">{u.name}</span>
              )}

              {/* Save or Pen */}
              {editId === u._id ? (
                <button
                  onClick={saveRename}
                  className="p-1 bg-transparent text-green-600 hover:bg-green-100 rounded focus:outline-none"
                  title="Save"
                >
                  <Check size={16} />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setEditId(u._id);
                    setEditName(u.name);
                  }}
                  className="p-1 bg-transparent text-blue-600 hover:bg-blue-100 rounded focus:outline-none"
                  title="Rename"
                >
                  <PenLine size={16} />
                </button>
              )}

              {/* Trash */}
              <button
                onClick={() => deleteUser(u._id)}
                className="p-1 bg-transparent text-red-600 hover:bg-red-100 rounded focus:outline-none"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button className="w-full" onClick={() => setOpen(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
