// client/src/pages/GroupsPage.jsx
import {useEffect, useState}          from 'react';
import {useNavigate}                  from 'react-router-dom';
import {Plus}                         from 'lucide-react';

import api                            from '../api/axios.js';
import {useSocket}                    from '../hooks/useSocket.js';
import {Button}                       from '@/components/ui/button';
import {Input}                        from '@/components/ui/input';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
}                                     from '@/components/ui/dialog';

import GroupCard                      from '../components/GroupCard.jsx';

export default function GroupsPage() {
  /* ------------------------------------------------------------------ */
  /*  state                                                             */
  /* ------------------------------------------------------------------ */

  const [groups,    setGroups]  = useState([]);
  const [allUsers,  setAll]     = useState([]);
  const [name,      setName]    = useState('');
  const [members,   setMembers] = useState([]);
  const [open,      setOpen]    = useState(false);      // dialog toggle
  const nav                     = useNavigate();
  const socket                  = useSocket();

  /* ------------------------------------------------------------------ */
  /*  initial data                                                      */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    api.get('/groups').then(res => setGroups(res.data));
    api.get('/auth/users').then(res => setAll(res.data));    // <-- list of users
  }, []);

  /* ------------------------------------------------------------------ */
  /*  live updates                                                      */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    socket.on('group:new', g => setGroups(p => [g, ...p]));
    return () => socket.off('group:new');
  }, [socket]);

  /* ------------------------------------------------------------------ */
  /*  dialog submit handler                                             */
  /* ------------------------------------------------------------------ */

  const createGroup = async e => {
    e.preventDefault();
    try {
      const {data} = await api.post('/groups', {name, members});
      setGroups(p => [data, ...p]);          // optimistic add
      /* reset + close */
      setName('');
      setMembers([]);
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to create group');       // simple feedback
    }
  };

  /* ------------------------------------------------------------------ */
  /*  render                                                            */
  /* ------------------------------------------------------------------ */

  return (
    <main className="p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* group cards --------------------------------------------------- */}
      {groups.map(g => (
        <GroupCard
          key={g._id}
          {...g}
          onClick={() => nav(`/groups/${g._id}`)}
        />
      ))}

      {/* floating "+" -------------------------------------------------- */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full
                       bg-black text-white flex items-center justify-center
                       shadow-lg hover:scale-105 transition"
          >
            <Plus size={24}/>
          </button>
        </DialogTrigger>

        {/* dialog content ---------------------------------------------- */}
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New group</DialogTitle>
          </DialogHeader>

          <form onSubmit={createGroup} className="space-y-4">
            {/* name input */}
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Trip name"
              required
            />

            {/* member picker */}
            <div>
              <p className="mb-1 text-sm font-medium">Members</p>
              <div className="max-h-48 overflow-y-auto border rounded p-2 space-y-1">
                {allUsers.map(u => (
                  <label key={u._id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={members.includes(u._id)}
                      onChange={() =>
                        setMembers(m =>
                          m.includes(u._id)
                            ? m.filter(id => id !== u._id)
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
              <Button type="submit" className="w-full">Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}