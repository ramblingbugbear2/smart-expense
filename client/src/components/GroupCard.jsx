import { useState } from "react";
import { PenLine } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function GroupCard({ _id, name, members = [], onClick, onRename }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const count = members.length;

  /* commit rename */
  const commit = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== name) onRename(_id, trimmed);
    setEditing(false);
  };

  return (
    <button
      onClick={editing ? undefined : onClick}  // disable nav while editing
      className="relative flex flex-col items-center gap-1 rounded-xl p-6
                 bg-blue-50/80 backdrop-blur-sm shadow
                 hover:shadow-lg hover:-translate-y-0.5 transition"
    >
      {/* blue pen icon to trigger edit -------------------------------- */}
      {!editing && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            setEditing(true);
          }}
          className="absolute right-3 top-3 p-1 bg-transparent
                     text-blue-600 hover:bg-blue-100 rounded cursor-pointer"
          title="Rename"
        >
          <PenLine size={16} />
        </span>
      )}

      {/* name & member count / or input ------------------------------ */}
      {editing ? (
        <Input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => e.key === "Enter" && commit()}
          className="text-center"
        />
      ) : (
        <>
          <h3 className="text-lg font-semibold text-gray-800 select-none">
            {name}
          </h3>
          <p className="text-sm text-gray-500 select-none">
            {count} {count === 1 ? "member" : "members"}
          </p>
        </>
      )}
    </button>
  );
}
