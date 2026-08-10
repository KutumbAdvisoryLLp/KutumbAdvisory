"use client";

import { useEffect, useState, useMemo } from "react";
import { UserCheck, Plus, Trash2, Crown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image_url: string;
  linkedin_url: string | null;
  is_founder: boolean;
  display_order: number;
  created_at: string;
}

export default function AdminTeamPage() {
  const supabase = useMemo(() => createClient(), []);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [isFounder, setIsFounder] = useState(false);

  const fetchMembers = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("team_members")
      .select("*")
      .order("display_order", { ascending: true });
    if (data) setMembers(data as TeamMember[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchMembers();
  }, [supabase]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim() || !bio.trim()) return;
    setSaving(true);

    await supabase.from("team_members").insert({
      name: name.trim(),
      role: role.trim(),
      bio: bio.trim(),
      image_url: imageUrl.trim() || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      linkedin_url: linkedinUrl.trim() || null,
      is_founder: isFounder,
      display_order: members.length + 1,
    });

    setName("");
    setRole("");
    setBio("");
    setImageUrl("");
    setLinkedinUrl("");
    setSaving(false);
    fetchMembers();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;
    await supabase.from("team_members").delete().eq("id", id);
    fetchMembers();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-navy">Team &amp; Leadership Manager</h1>
        <p className="mt-1 text-sm text-stone/60">
          Manage founder bio, leadership team bios, photos, and roles displayed on the About page.
        </p>
      </div>

      {/* Add Team Member Form */}
      <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-card border border-stone/10">
        <h2 className="font-serif text-xl text-navy mb-4 flex items-center gap-2">
          <UserCheck className="text-gold" size={20} />
          <span>Add New Team Member</span>
        </h2>

        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-stone/60 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Deepika"
                required
                className="w-full px-4 py-3 rounded-xl border border-stone/20 bg-cream/30 text-sm focus:border-gold outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-stone/60 mb-1">Designation / Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Founder & Principal Advisor"
                required
                className="w-full px-4 py-3 rounded-xl border border-stone/20 bg-cream/30 text-sm focus:border-gold outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-stone/60 mb-1">Professional Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. Over 12 years of experience in wealth management and private banking..."
              required
              className="w-full px-4 py-3 rounded-xl border border-stone/20 bg-cream/30 text-sm focus:border-gold outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-stone/60 mb-1">Image URL</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://res.cloudinary.com/..."
                className="w-full px-4 py-3 rounded-xl border border-stone/20 bg-cream/30 text-sm focus:border-gold outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-stone/60 mb-1">LinkedIn URL (Optional)</label>
              <input
                type="text"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-4 py-3 rounded-xl border border-stone/20 bg-cream/30 text-sm focus:border-gold outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-navy">
              <input
                type="checkbox"
                checked={isFounder}
                onChange={(e) => setIsFounder(e.target.checked)}
                className="w-4 h-4 accent-gold"
              />
              <span>Highlight as Founder / Principal</span>
            </label>

            <button
              type="submit"
              disabled={saving}
              className="ml-auto px-6 py-2.5 bg-gold text-navy font-medium rounded-xl hover:bg-gold-dark transition-all text-sm flex items-center gap-2"
            >
              <Plus size={16} />
              <span>{saving ? "Saving..." : "Add Member"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Team List */}
      <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-card border border-stone/10">
        <h2 className="font-serif text-xl text-navy mb-4">Current Team</h2>

        {loading ? (
          <p className="text-sm text-stone/60 py-4">Loading team members...</p>
        ) : members.length === 0 ? (
          <p className="text-sm text-stone/60 py-4">No team members added yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {members.map((m) => (
              <div key={m.id} className="p-5 rounded-2xl border border-stone/20 bg-cream/20 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    {m.is_founder && (
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-gold text-navy flex items-center gap-1">
                        <Crown size={12} /> Founder
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-navy">{m.name}</h3>
                  <p className="text-xs text-gold-dark font-medium mb-2">{m.role}</p>
                  <p className="text-xs text-stone leading-relaxed line-clamp-3">{m.bio}</p>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone/10">
                  <span className="text-[11px] text-stone/50 font-mono">Order: #{m.display_order}</span>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
