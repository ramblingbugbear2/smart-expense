// pages/GroupsPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Users } from "lucide-react";

import ManageUsersDialog from "../components/ManageUsersDialog.jsx";
import GroupCard from "../components/GroupCard.jsx";

import api from "../api/axios.js";
import { useSocket } from "../hooks/useSocket.js";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";

export default function GroupsPage() {
  /* ------------------------------------------------------------------ */
  /*  state + hooks                                                     */
  /* ------------------------------------------------------------------ */
  const [groups, setGroups]   = useState([]);
  const [allUsers, setAll]    = useState([]);
  const [name, setName]       = useState("");
  const [members, setMembers] = useState([]);
  const [open, setOpen]       = useState(false);   // create-group dialog
  const [userOpen, setUserOpen] = useState(false); // manage-users dialog

  const nav    = useNavigate();
  const socket = useSocket();

  /* ------------------------------------------------------------------ */
  /*  initial fetch                                                     */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    api.get("/groups").then((res) => setGroups(res.data));
    api.get("/auth/users").then((res) => setAll(res.data));
  }, []);

  /* ------------------------------------------------------------------ */
  /*  live updates via socket                                           */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    socket.on("group:new", (g) => setGroups((p) => [g, ...p]));
    return () => socket.off("group:new");
  }, [socket]);

  /* ------------------------------------------------------------------ */
  /*  handlers                                                          */
  /* ------------------------------------------------------------------ */
  const createGroup = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/groups", { name, members });
      setGroups((p) => [data, ...p]);
      setName("");
      setMembers([]);
      setOpen(false);
    } catch {
      alert("Failed to create group");
    }
  };

  /* rename trip/group */
const renameGroup = async (id, newName) => {
  try {
    const { data } = await api.put(`/groups/${id}`, { name: newName });
    setGroups((g) => g.map((grp) => (grp._id === id ? data : grp)));
  } catch {
    alert("Rename failed");
  }
};

  /* ------------------------------------------------------------------ */
  /*  render                                                            */
  /* ------------------------------------------------------------------ */
  return (
    <main
      className="pt-24 min-h-screen w-screen overflow-y-auto
                 bg-gradient-to-tr from-blue-50 via-white to-purple-50 p-6"
    >
      <section className="mx-auto max-w-6xl">
        {/* ---------- top bar ---------- */}
        <div className="flex items-center gap-4 justify-end mb-6">
          {/* manage users */}
          <Button
            onClick={() => setUserOpen(true)}
            className="flex items-center gap-2 bg-slate-200 text-gray-700
                       hover:bg-slate-300 transition"
          >
            <Users size={18} />
            Users
          </Button>

          {/* new group */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                className="flex items-center gap-2 bg-blue-600 text-white
                           hover:bg-blue-700 transition"
              >
                <Plus size={18} />
                New Trip / Group
              </Button>
            </DialogTrigger>

            {/* create-group dialog */}
            <DialogContent
              className="sm:max-w-md
                         [&>button]:bg-red-600 [&>button]:text-white
                         [&>button]:hover:bg-red-700"
            >
              <DialogHeader>
                <DialogTitle>Create a new group</DialogTitle>
              </DialogHeader>

              <form onSubmit={createGroup} className="space-y-4">
                {/* name */}
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Trip name"
                  required
                />

                {/* members */}
                <div>
                  <p className="mb-1 text-sm font-medium">Members</p>
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
                </div>

                <DialogFooter>
                  <Button type="submit" className="w-full">
                    Create
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* ---------- grid ---------- */}
        <div
          className="grid gap-6
                     grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
                     mx-auto max-w-5xl"
        >
          {groups.map((g) => (
            <GroupCard
              key={g._id}
              {...g}
              onClick={() => nav(`/app/${g._id}`)}
              onRename={renameGroup}
            />
          ))}
        </div>

        {/* dialogs mounted here */}
        <ManageUsersDialog
          open={userOpen}
          setOpen={setUserOpen}
          onUsersChange={setAll}
        />
      </section>
    </main>
  );
}
