import { PdfUploadField } from "@/components/PdfUploadField";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAdmin } from "@/hooks/use-admin";
import {
  useAdminCreateArticle,
  useAdminCreateNote,
  useAdminCreatePublication,
  useAdminCreateResearch,
  useAdminDeleteArticle,
  useAdminDeleteNote,
  useAdminDeletePublication,
  useAdminDeleteResearch,
  useAdminGetContacts,
  useAdminUpdateArticle,
  useAdminUpdateNote,
  useAdminUpdateProfile,
  useAdminUpdatePublication,
  useAdminUpdateResearch,
  useArticles,
  useNotes,
  useProfile,
  usePublications,
  useResearchProjects,
} from "@/hooks/use-backend";
import type {
  Article,
  ArticleInput,
  Note,
  NoteInput,
  Profile,
  Publication,
  PublicationInput,
  ResearchInput,
  ResearchProject,
} from "@/types";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  BookOpen,
  ExternalLink,
  FileText,
  FlaskConical,
  Home,
  LogOut,
  Mail,
  Pencil,
  Plus,
  StickyNote,
  Trash2,
  User,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

// ─── Gold styling ─────────────────────────────────────────────────────────────
const goldBtnStyle = {
  background: "#d4af37",
  color: "#1a1200",
  border: "none",
} as const;

// ─── Small helpers ────────────────────────────────────────────────────────────

function GoldBadge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-block px-2 py-0.5 rounded text-xs font-medium"
      style={{
        background: "rgba(212,175,55,0.15)",
        color: "#d4af37",
        border: "1px solid rgba(212,175,55,0.3)",
      }}
    >
      {children}
    </span>
  );
}

function SectionHeader({
  title,
  icon,
  onAdd,
}: { title: string; icon: React.ReactNode; onAdd?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
        {icon}
        {title}
      </div>
      {onAdd && (
        <Button
          size="sm"
          onClick={onAdd}
          className="gap-1.5"
          style={goldBtnStyle}
        >
          <Plus size={14} /> Add New
        </Button>
      )}
    </div>
  );
}

// ─── Delete Confirm Dialog ────────────────────────────────────────────────────

function DeleteConfirmDialog({
  open,
  itemName,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete "{itemName}"?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The item will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            data-ocid="admin.delete.cancel_button"
            onClick={onCancel}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            data-ocid="admin.delete.confirm_button"
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ─── Image URL Field ─────────────────────────────────────────────────────────

function ImageUploadField({
  label,
  value,
  onChange,
  id,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  id: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://..."
        type="url"
      />
      {value?.startsWith("http") && (
        <div className="mt-2 rounded overflow-hidden border border-border h-20 w-full">
          <img
            src={value}
            alt="preview"
            className="h-full w-full object-cover"
          />
        </div>
      )}
    </div>
  );
}

// ─── Unsaved Changes Guard ────────────────────────────────────────────────────

function useUnsavedGuard(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);
}

// ─── Home (Stats) section ─────────────────────────────────────────────────────

function HomeSection({ token }: { token: string }) {
  const { data: profile } = useProfile();
  const updateProfile = useAdminUpdateProfile(token);
  const [stats, setStats] = useState<{ value: string; label: string }[]>([]);
  const [dirty, setDirty] = useState(false);

  useUnsavedGuard(dirty);

  useEffect(() => {
    if (profile && !dirty) {
      setStats(profile.stats.map((s) => ({ value: s.value, label: s.label })));
    }
  }, [profile, dirty]);

  function updateStat(i: number, field: "value" | "label", val: string) {
    setStats((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: val };
      return next;
    });
    setDirty(true);
  }

  async function handleSave() {
    if (!profile) return;
    await updateProfile.mutateAsync({
      name: profile.name,
      bio: profile.bio,
      avatarUrl: profile.avatarUrl,
      stats: stats.map((s) => ({ value: s.value, statLabel: s.label })),
      skills: profile.skills,
      milestones: profile.milestones.map((m) => ({
        year: m.year,
        title: m.title,
        description: m.description,
      })),
    });
    toast.success("Stats saved");
    setDirty(false);
  }

  return (
    <div>
      <SectionHeader
        title="Home — Stats"
        icon={<Home size={18} style={{ color: "#d4af37" }} />}
      />
      <Card className="border-border bg-card">
        <CardContent className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground mb-2">
            Edit the four stat counters shown in the Hero section.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stats.map((stat, i) => (
              <div
                key={`home-stat-pos${i}-${stat.label || "empty"}`}
                className="rounded-lg border border-border p-4 space-y-3"
                style={{ background: "rgba(212,175,55,0.04)" }}
              >
                <div className="flex items-center gap-2">
                  <GoldBadge>Stat {i + 1}</GoldBadge>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`stat-val-${i}`}>Value</Label>
                  <Input
                    id={`stat-val-${i}`}
                    data-ocid={`admin.home.stat_value.${i + 1}`}
                    value={stat.value}
                    onChange={(e) => updateStat(i, "value", e.target.value)}
                    placeholder="e.g. 62"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`stat-lbl-${i}`}>Label</Label>
                  <Input
                    id={`stat-lbl-${i}`}
                    data-ocid={`admin.home.stat_label.${i + 1}`}
                    value={stat.label}
                    onChange={(e) => updateStat(i, "label", e.target.value)}
                    placeholder="e.g. Publications"
                  />
                </div>
              </div>
            ))}
          </div>
          {stats.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Loading stats…
            </p>
          )}
          <div className="flex justify-end pt-2">
            <Button
              disabled={updateProfile.isPending || !dirty}
              onClick={handleSave}
              style={dirty ? goldBtnStyle : undefined}
            >
              {updateProfile.isPending ? "Saving…" : "Save Stats"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Research section ─────────────────────────────────────────────────────────

type ResearchFormState = Omit<ResearchProject, "id">;

function ResearchSection({ token }: { token: string }) {
  const { data: items = [] } = useResearchProjects();
  const createResearch = useAdminCreateResearch(token);
  const updateResearch = useAdminUpdateResearch(token);
  const deleteResearch = useAdminDeleteResearch(token);

  const [editing, setEditing] = useState<ResearchProject | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ResearchProject | null>(
    null,
  );
  const [form, setForm] = useState<ResearchFormState>({
    seqNum: 1,
    title: "",
    description: "",
    tags: [],
    imageUrl: "",
    fullContent: "",
    pdfUrl: undefined,
  });

  useUnsavedGuard(dirty && formOpen);

  function openCreate() {
    setEditing(null);
    setForm({
      seqNum: items.length + 1,
      title: "",
      description: "",
      tags: [],
      imageUrl: "",
      fullContent: "",
      pdfUrl: undefined,
    });
    setDirty(false);
    setFormOpen(true);
  }

  function openEdit(item: ResearchProject) {
    setEditing(item);
    setForm({
      seqNum: item.seqNum,
      title: item.title,
      description: item.description,
      tags: item.tags,
      imageUrl: item.imageUrl,
      fullContent: item.fullContent,
      pdfUrl: item.pdfUrl,
    });
    setDirty(false);
    setFormOpen(true);
  }

  function updateForm<K extends keyof ResearchFormState>(
    key: K,
    value: ResearchFormState[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }));
    setDirty(true);
  }

  async function handleDelete(item: ResearchProject) {
    try {
      await deleteResearch.mutateAsync(item.id);
      setDeleteTarget(null);
      toast.success("Research project deleted");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  }

  async function handleSave() {
    const input: ResearchInput = {
      seqNum: form.seqNum,
      title: form.title,
      description: form.description,
      tags: form.tags,
      imageUrl: form.imageUrl,
      fullContent: form.fullContent,
      pdfUrl: form.pdfUrl,
    };
    try {
      if (editing) {
        await updateResearch.mutateAsync({ id: editing.id, input });
        toast.success("Research updated");
      } else {
        await createResearch.mutateAsync(input);
        toast.success("Research created");
      }
      setFormOpen(false);
      setDirty(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  }

  function handleClose() {
    if (dirty && !window.confirm("Discard unsaved changes?")) return;
    setFormOpen(false);
    setDirty(false);
  }

  const isSaving = createResearch.isPending || updateResearch.isPending;

  return (
    <div>
      <SectionHeader
        title="Research Projects"
        icon={<FlaskConical size={18} style={{ color: "#d4af37" }} />}
        onAdd={openCreate}
      />
      <div className="space-y-3">
        {items.map((item, i) => (
          <Card
            key={item.id}
            data-ocid={`admin.research.item.${i + 1}`}
            className="border-border bg-card"
          >
            <CardContent className="p-4 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <GoldBadge>{String(item.seqNum).padStart(2, "0")}</GoldBadge>
                  <span className="font-semibold text-sm text-foreground truncate">
                    {item.title}
                  </span>
                  {item.pdfUrl && <GoldBadge>PDF</GoldBadge>}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.tags.slice(0, 3).map((t) => (
                    <Badge key={t} variant="secondary" className="text-xs">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  size="icon"
                  variant="ghost"
                  data-ocid={`admin.research.edit_button.${i + 1}`}
                  onClick={() => openEdit(item)}
                  className="h-8 w-8"
                >
                  <Pencil size={14} />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  data-ocid={`admin.research.delete_button.${i + 1}`}
                  onClick={() => setDeleteTarget(item)}
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && (
          <div
            data-ocid="admin.research.empty_state"
            className="text-center text-muted-foreground py-8 text-sm"
          >
            No research projects yet.
          </div>
        )}
      </div>

      <DeleteConfirmDialog
        open={!!deleteTarget}
        itemName={deleteTarget?.title ?? ""}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />

      <Dialog open={formOpen} onOpenChange={(v) => !v && handleClose()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Research Project" : "New Research Project"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Sequence #</Label>
                <Input
                  type="number"
                  value={form.seqNum}
                  onChange={(e) => updateForm("seqNum", Number(e.target.value))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Tags (comma-separated)</Label>
                <Input
                  value={form.tags.join(", ")}
                  onChange={(e) =>
                    updateForm(
                      "tags",
                      e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean),
                    )
                  }
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) => updateForm("title", e.target.value)}
              />
            </div>
            <ImageUploadField
              label="Image URL"
              value={form.imageUrl}
              onChange={(v) => updateForm("imageUrl", v)}
              id="research-img"
            />
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                rows={3}
                value={form.description}
                onChange={(e) => updateForm("description", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Full Content</Label>
              <Textarea
                rows={10}
                value={form.fullContent}
                onChange={(e) => updateForm("fullContent", e.target.value)}
                placeholder="Full scientific write-up, methodology, findings…"
              />
            </div>
            <PdfUploadField
              label="Research PDF (Google Drive, Dropbox, or upload)"
              value={form.pdfUrl}
              onChange={(url) => updateForm("pdfUrl", url)}
              id="research-pdf"
            />
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                disabled={isSaving || !form.title}
                onClick={handleSave}
                style={goldBtnStyle}
              >
                {isSaving ? "Saving…" : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Articles section ─────────────────────────────────────────────────────────

type ArticleFormState = Omit<Article, "id">;

function ArticlesSection({ token }: { token: string }) {
  const { data: items = [] } = useArticles();
  const createArticle = useAdminCreateArticle(token);
  const updateArticle = useAdminUpdateArticle(token);
  const deleteArticle = useAdminDeleteArticle(token);

  const [editing, setEditing] = useState<Article | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);
  const [form, setForm] = useState<ArticleFormState>({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    publishDate: "",
    coverImage: "",
    pdfUrl: undefined,
  });

  useUnsavedGuard(dirty && formOpen);

  function openCreate() {
    setEditing(null);
    setForm({
      title: "",
      excerpt: "",
      content: "",
      category: "",
      publishDate: "",
      coverImage: "",
      pdfUrl: undefined,
    });
    setDirty(false);
    setFormOpen(true);
  }

  function openEdit(item: Article) {
    setEditing(item);
    setForm({
      title: item.title,
      excerpt: item.excerpt,
      content: item.content,
      category: item.category,
      publishDate: item.publishDate,
      coverImage: item.coverImage,
      pdfUrl: item.pdfUrl,
    });
    setDirty(false);
    setFormOpen(true);
  }

  function updateForm<K extends keyof ArticleFormState>(
    key: K,
    value: ArticleFormState[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }));
    setDirty(true);
  }

  async function handleDelete(item: Article) {
    try {
      await deleteArticle.mutateAsync(item.id);
      setDeleteTarget(null);
      toast.success("Article deleted");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  }

  async function handleSave() {
    const input: ArticleInput = {
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      category: form.category,
      publishDate: form.publishDate,
      coverImage: form.coverImage,
      pdfUrl: form.pdfUrl,
    };
    try {
      if (editing) {
        await updateArticle.mutateAsync({ id: editing.id, input });
        toast.success("Article updated");
      } else {
        await createArticle.mutateAsync(input);
        toast.success("Article created");
      }
      setFormOpen(false);
      setDirty(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  }

  function handleClose() {
    if (dirty && !window.confirm("Discard unsaved changes?")) return;
    setFormOpen(false);
    setDirty(false);
  }

  const isSaving = createArticle.isPending || updateArticle.isPending;

  return (
    <div>
      <SectionHeader
        title="Articles"
        icon={<FileText size={18} style={{ color: "#d4af37" }} />}
        onAdd={openCreate}
      />
      <div className="space-y-3">
        {items.map((item, i) => (
          <Card
            key={item.id}
            data-ocid={`admin.articles.item.${i + 1}`}
            className="border-border bg-card"
          >
            <CardContent className="p-4 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <GoldBadge>{item.category}</GoldBadge>
                  <span className="font-semibold text-sm text-foreground truncate">
                    {item.title}
                  </span>
                  {item.pdfUrl && <GoldBadge>PDF</GoldBadge>}
                </div>
                <p className="text-xs text-muted-foreground">
                  {item.publishDate}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  size="icon"
                  variant="ghost"
                  data-ocid={`admin.articles.edit_button.${i + 1}`}
                  onClick={() => openEdit(item)}
                  className="h-8 w-8"
                >
                  <Pencil size={14} />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  data-ocid={`admin.articles.delete_button.${i + 1}`}
                  onClick={() => setDeleteTarget(item)}
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && (
          <div
            data-ocid="admin.articles.empty_state"
            className="text-center text-muted-foreground py-8 text-sm"
          >
            No articles yet.
          </div>
        )}
      </div>

      <DeleteConfirmDialog
        open={!!deleteTarget}
        itemName={deleteTarget?.title ?? ""}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />

      <Dialog open={formOpen} onOpenChange={(v) => !v && handleClose()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Article" : "New Article"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Input
                  value={form.category}
                  onChange={(e) => updateForm("category", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Publish Date</Label>
                <Input
                  value={form.publishDate}
                  onChange={(e) => updateForm("publishDate", e.target.value)}
                  placeholder="Jan 1, 2024"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) => updateForm("title", e.target.value)}
              />
            </div>
            <ImageUploadField
              label="Cover Image"
              value={form.coverImage}
              onChange={(v) => updateForm("coverImage", v)}
              id="article-cover"
            />
            <div className="space-y-1.5">
              <Label>Excerpt</Label>
              <Textarea
                rows={2}
                value={form.excerpt}
                onChange={(e) => updateForm("excerpt", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Content</Label>
              <Textarea
                rows={10}
                value={form.content}
                onChange={(e) => updateForm("content", e.target.value)}
                placeholder="Full article content…"
              />
            </div>
            <PdfUploadField
              label="Article PDF (Google Drive, Dropbox, or upload)"
              value={form.pdfUrl}
              onChange={(url) => updateForm("pdfUrl", url)}
              id="article-pdf"
            />
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                disabled={isSaving || !form.title}
                onClick={handleSave}
                style={goldBtnStyle}
              >
                {isSaving ? "Saving…" : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Publications section ─────────────────────────────────────────────────────

type PubFormState = Omit<Publication, "id">;

function PublicationsSection({ token }: { token: string }) {
  const { data: items = [] } = usePublications();
  const createPub = useAdminCreatePublication(token);
  const updatePub = useAdminUpdatePublication(token);
  const deletePub = useAdminDeletePublication(token);

  const [editing, setEditing] = useState<Publication | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Publication | null>(null);
  const [form, setForm] = useState<PubFormState>({
    title: "",
    authors: [],
    venue: "",
    year: new Date().getFullYear(),
    pubType: "",
    link: "",
    pdfUrl: undefined,
  });

  useUnsavedGuard(dirty && formOpen);

  function openCreate() {
    setEditing(null);
    setForm({
      title: "",
      authors: [],
      venue: "",
      year: new Date().getFullYear(),
      pubType: "",
      link: "",
      pdfUrl: undefined,
    });
    setDirty(false);
    setFormOpen(true);
  }

  function openEdit(item: Publication) {
    setEditing(item);
    setForm({
      title: item.title,
      authors: item.authors,
      venue: item.venue,
      year: item.year,
      pubType: item.pubType,
      link: item.link,
      pdfUrl: item.pdfUrl,
    });
    setDirty(false);
    setFormOpen(true);
  }

  function updateForm<K extends keyof PubFormState>(
    key: K,
    value: PubFormState[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }));
    setDirty(true);
  }

  async function handleDelete(item: Publication) {
    try {
      await deletePub.mutateAsync(item.id);
      setDeleteTarget(null);
      toast.success("Publication deleted");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  }

  async function handleSave() {
    const input: PublicationInput = {
      title: form.title,
      authors: form.authors,
      venue: form.venue,
      year: form.year,
      pubType: form.pubType,
      link: form.link,
      pdfUrl: form.pdfUrl,
    };
    try {
      if (editing) {
        await updatePub.mutateAsync({ id: editing.id, input });
        toast.success("Publication updated");
      } else {
        await createPub.mutateAsync(input);
        toast.success("Publication created");
      }
      setFormOpen(false);
      setDirty(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  }

  function handleClose() {
    if (dirty && !window.confirm("Discard unsaved changes?")) return;
    setFormOpen(false);
    setDirty(false);
  }

  const isSaving = createPub.isPending || updatePub.isPending;

  return (
    <div>
      <SectionHeader
        title="Publications"
        icon={<BookOpen size={18} style={{ color: "#d4af37" }} />}
        onAdd={openCreate}
      />
      <div className="space-y-3">
        {items.map((item, i) => (
          <Card
            key={item.id}
            data-ocid={`admin.publications.item.${i + 1}`}
            className="border-border bg-card"
          >
            <CardContent className="p-4 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <GoldBadge>{item.pubType}</GoldBadge>
                  <span className="font-semibold text-sm text-foreground truncate">
                    {item.title}
                  </span>
                  {item.pdfUrl && <GoldBadge>PDF</GoldBadge>}
                </div>
                <p className="text-xs text-muted-foreground">
                  {item.venue} · {item.year}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                {item.link && item.link !== "#" && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
                <Button
                  size="icon"
                  variant="ghost"
                  data-ocid={`admin.publications.edit_button.${i + 1}`}
                  onClick={() => openEdit(item)}
                  className="h-8 w-8"
                >
                  <Pencil size={14} />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  data-ocid={`admin.publications.delete_button.${i + 1}`}
                  onClick={() => setDeleteTarget(item)}
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && (
          <div
            data-ocid="admin.publications.empty_state"
            className="text-center text-muted-foreground py-8 text-sm"
          >
            No publications yet.
          </div>
        )}
      </div>

      <DeleteConfirmDialog
        open={!!deleteTarget}
        itemName={deleteTarget?.title ?? ""}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />

      <Dialog open={formOpen} onOpenChange={(v) => !v && handleClose()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Publication" : "New Publication"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) => updateForm("title", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Venue / Journal</Label>
                <Input
                  value={form.venue}
                  onChange={(e) => updateForm("venue", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Year</Label>
                <Input
                  type="number"
                  value={form.year}
                  onChange={(e) => updateForm("year", Number(e.target.value))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Input
                  value={form.pubType}
                  onChange={(e) => updateForm("pubType", e.target.value)}
                  placeholder="Journal Article"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Link / DOI</Label>
                <Input
                  value={form.link}
                  onChange={(e) => updateForm("link", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Authors (comma-separated)</Label>
              <Input
                value={form.authors.join(", ")}
                onChange={(e) =>
                  updateForm(
                    "authors",
                    e.target.value
                      .split(",")
                      .map((a) => a.trim())
                      .filter(Boolean),
                  )
                }
              />
            </div>
            <PdfUploadField
              label="Publication PDF (Google Drive, Dropbox, or upload)"
              value={form.pdfUrl}
              onChange={(url) => updateForm("pdfUrl", url)}
              id="publication-pdf"
            />
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                disabled={isSaving || !form.title}
                onClick={handleSave}
                style={goldBtnStyle}
              >
                {isSaving ? "Saving…" : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Notes section ────────────────────────────────────────────────────────────

type NoteFormState = Omit<Note, "id">;

function NotesSection({ token }: { token: string }) {
  const { data: items = [] } = useNotes();
  const createNote = useAdminCreateNote(token);
  const updateNote = useAdminUpdateNote(token);
  const deleteNote = useAdminDeleteNote(token);

  const [editing, setEditing] = useState<Note | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Note | null>(null);
  const [form, setForm] = useState<NoteFormState>({
    title: "",
    excerpt: "",
    content: "",
    publishDate: "",
    tags: [],
    pdfUrl: undefined,
  });

  useUnsavedGuard(dirty && formOpen);

  function openCreate() {
    setEditing(null);
    setForm({
      title: "",
      excerpt: "",
      content: "",
      publishDate: "",
      tags: [],
      pdfUrl: undefined,
    });
    setDirty(false);
    setFormOpen(true);
  }

  function openEdit(item: Note) {
    setEditing(item);
    setForm({
      title: item.title,
      excerpt: item.excerpt,
      content: item.content,
      publishDate: item.publishDate,
      tags: item.tags,
      pdfUrl: item.pdfUrl,
    });
    setDirty(false);
    setFormOpen(true);
  }

  function updateForm<K extends keyof NoteFormState>(
    key: K,
    value: NoteFormState[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }));
    setDirty(true);
  }

  async function handleDelete(item: Note) {
    try {
      await deleteNote.mutateAsync(item.id);
      setDeleteTarget(null);
      toast.success("Note deleted");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  }

  async function handleSave() {
    const input: NoteInput = {
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      publishDate: form.publishDate,
      tags: form.tags,
      pdfUrl: form.pdfUrl,
    };
    try {
      if (editing) {
        await updateNote.mutateAsync({ id: editing.id, input });
        toast.success("Note updated");
      } else {
        await createNote.mutateAsync(input);
        toast.success("Note created");
      }
      setFormOpen(false);
      setDirty(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  }

  function handleClose() {
    if (dirty && !window.confirm("Discard unsaved changes?")) return;
    setFormOpen(false);
    setDirty(false);
  }

  const isSaving = createNote.isPending || updateNote.isPending;

  return (
    <div>
      <SectionHeader
        title="Notes"
        icon={<StickyNote size={18} style={{ color: "#d4af37" }} />}
        onAdd={openCreate}
      />
      <div className="space-y-3">
        {items.map((item, i) => (
          <Card
            key={item.id}
            data-ocid={`admin.notes.item.${i + 1}`}
            className="border-border bg-card"
          >
            <CardContent className="p-4 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-sm text-foreground">
                    {item.title}
                  </span>
                  {item.pdfUrl && <GoldBadge>PDF</GoldBadge>}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {item.publishDate}
                </p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {item.tags.map((t) => (
                    <Badge key={t} variant="secondary" className="text-xs">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  size="icon"
                  variant="ghost"
                  data-ocid={`admin.notes.edit_button.${i + 1}`}
                  onClick={() => openEdit(item)}
                  className="h-8 w-8"
                >
                  <Pencil size={14} />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  data-ocid={`admin.notes.delete_button.${i + 1}`}
                  onClick={() => setDeleteTarget(item)}
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && (
          <div
            data-ocid="admin.notes.empty_state"
            className="text-center text-muted-foreground py-8 text-sm"
          >
            No notes yet.
          </div>
        )}
      </div>

      <DeleteConfirmDialog
        open={!!deleteTarget}
        itemName={deleteTarget?.title ?? ""}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />

      <Dialog open={formOpen} onOpenChange={(v) => !v && handleClose()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Note" : "New Note"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input
                  value={form.title}
                  onChange={(e) => updateForm("title", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Publish Date</Label>
                <Input
                  value={form.publishDate}
                  onChange={(e) => updateForm("publishDate", e.target.value)}
                  placeholder="Jan 1, 2024"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Tags (comma-separated)</Label>
              <Input
                value={form.tags.join(", ")}
                onChange={(e) =>
                  updateForm(
                    "tags",
                    e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  )
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Excerpt</Label>
              <Textarea
                rows={2}
                value={form.excerpt}
                onChange={(e) => updateForm("excerpt", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Content</Label>
              <Textarea
                rows={10}
                value={form.content}
                onChange={(e) => updateForm("content", e.target.value)}
                placeholder="Full note content…"
              />
            </div>
            <PdfUploadField
              label="Note PDF (Google Drive, Dropbox, or upload)"
              value={form.pdfUrl}
              onChange={(url) => updateForm("pdfUrl", url)}
              id="note-pdf"
            />
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                disabled={isSaving || !form.title}
                onClick={handleSave}
                style={goldBtnStyle}
              >
                {isSaving ? "Saving…" : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── About (Profile) section ──────────────────────────────────────────────────

function AboutSection({ token }: { token: string }) {
  const { data: profile } = useProfile();
  const updateProfile = useAdminUpdateProfile(token);
  const [form, setForm] = useState<Profile | null>(null);
  const [dirty, setDirty] = useState(false);

  useUnsavedGuard(dirty);

  useEffect(() => {
    if (profile && !dirty) setForm(profile);
  }, [profile, dirty]);

  function update<K extends keyof Profile>(key: K, value: Profile[K]) {
    setForm((f) => (f ? { ...f, [key]: value } : f));
    setDirty(true);
  }

  const handleSave = useCallback(async () => {
    if (!form) return;
    try {
      await updateProfile.mutateAsync({
        name: form.name,
        bio: form.bio,
        avatarUrl: form.avatarUrl,
        stats: form.stats.map((s) => ({ value: s.value, statLabel: s.label })),
        skills: form.skills,
        milestones: form.milestones.map((m) => ({
          year: m.year,
          title: m.title,
          description: m.description,
        })),
      });
      toast.success("Profile updated");
      setDirty(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  }, [form, updateProfile]);

  if (!form)
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading profile…
      </div>
    );

  return (
    <div>
      <SectionHeader
        title="About — Profile"
        icon={<User size={18} style={{ color: "#d4af37" }} />}
      />
      <Card className="border-border bg-card">
        <CardContent className="p-6 space-y-5">
          {/* Name & Avatar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="profile-name">Display Name</Label>
              <Input
                id="profile-name"
                data-ocid="admin.about.name_input"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
              />
            </div>
          </div>
          <ImageUploadField
            label="Avatar / Profile Photo"
            value={form.avatarUrl}
            onChange={(v) => update("avatarUrl", v)}
            id="profile-avatar"
          />

          {/* Bio */}
          <div className="space-y-1.5">
            <Label htmlFor="profile-bio">Bio</Label>
            <Textarea
              id="profile-bio"
              data-ocid="admin.about.bio_textarea"
              rows={5}
              value={form.bio}
              onChange={(e) => update("bio", e.target.value)}
              placeholder="Write a professional bio…"
            />
          </div>

          {/* Skills */}
          <div className="space-y-1.5">
            <Label htmlFor="profile-skills">Skills (comma-separated)</Label>
            <Input
              id="profile-skills"
              data-ocid="admin.about.skills_input"
              value={form.skills.join(", ")}
              onChange={(e) =>
                update(
                  "skills",
                  e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                )
              }
            />
            <div className="flex flex-wrap gap-1 mt-1">
              {form.skills.map((s) => (
                <Badge key={s} variant="secondary" className="text-xs">
                  {s}
                </Badge>
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div className="space-y-2">
            <Label>Career Milestones</Label>
            {form.milestones.map((m, i) => (
              <div
                key={`milestone-${m.year}-${m.title}-${i}`}
                className="grid grid-cols-[80px_1fr_1fr_32px] gap-2 items-start"
              >
                <Input
                  type="number"
                  placeholder="Year"
                  value={m.year}
                  data-ocid={`admin.about.milestone_year.${i + 1}`}
                  onChange={(e) => {
                    setDirty(true);
                    setForm((f) => {
                      if (!f) return f;
                      const milestones = [...f.milestones];
                      milestones[i] = {
                        ...milestones[i],
                        year: Number(e.target.value),
                      };
                      return { ...f, milestones };
                    });
                  }}
                />
                <Input
                  placeholder="Title"
                  value={m.title}
                  onChange={(e) => {
                    setDirty(true);
                    setForm((f) => {
                      if (!f) return f;
                      const milestones = [...f.milestones];
                      milestones[i] = {
                        ...milestones[i],
                        title: e.target.value,
                      };
                      return { ...f, milestones };
                    });
                  }}
                />
                <Input
                  placeholder="Description"
                  value={m.description}
                  onChange={(e) => {
                    setDirty(true);
                    setForm((f) => {
                      if (!f) return f;
                      const milestones = [...f.milestones];
                      milestones[i] = {
                        ...milestones[i],
                        description: e.target.value,
                      };
                      return { ...f, milestones };
                    });
                  }}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  type="button"
                  data-ocid={`admin.about.milestone_delete.${i + 1}`}
                  onClick={() => {
                    setDirty(true);
                    setForm((f) =>
                      f
                        ? {
                            ...f,
                            milestones: f.milestones.filter((_, j) => j !== i),
                          }
                        : f,
                    );
                  }}
                  className="h-9 w-8 text-destructive"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}
            <Button
              size="sm"
              variant="outline"
              type="button"
              data-ocid="admin.about.add_milestone_button"
              onClick={() => {
                setDirty(true);
                setForm((f) =>
                  f
                    ? {
                        ...f,
                        milestones: [
                          ...f.milestones,
                          {
                            year: new Date().getFullYear(),
                            title: "",
                            description: "",
                          },
                        ],
                      }
                    : f,
                );
              }}
            >
              + Add Milestone
            </Button>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              data-ocid="admin.about.save_button"
              disabled={updateProfile.isPending}
              onClick={handleSave}
              style={goldBtnStyle}
            >
              {updateProfile.isPending ? "Saving…" : "Save Profile"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Contact section (read-only, auto-refreshes) ──────────────────────────────

function ContactSection({ token }: { token: string }) {
  const { data: contacts = [], isLoading, error } = useAdminGetContacts(token);
  const [expanded, setExpanded] = useState<number | null>(null);

  const formatDate = (ts: number) => {
    if (!ts) return "";
    // Backend returns nanoseconds — convert to ms
    const ms = ts > 1e15 ? Math.floor(ts / 1_000_000) : ts;
    return new Date(ms).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      <SectionHeader
        title="Contact Messages"
        icon={<Mail size={18} style={{ color: "#d4af37" }} />}
      />
      {isLoading && (
        <div
          data-ocid="admin.contact.loading_state"
          className="text-center py-8 text-muted-foreground text-sm"
        >
          Loading messages…
        </div>
      )}
      {error && (
        <div
          data-ocid="admin.contact.error_state"
          className="text-center py-8 text-destructive text-sm flex items-center justify-center gap-2"
        >
          <AlertCircle size={14} />
          {error instanceof Error ? error.message : "Failed to load contacts"}
        </div>
      )}
      {!isLoading && !error && (
        <div className="space-y-3">
          {contacts.length === 0 && (
            <div
              data-ocid="admin.contact.empty_state"
              className="text-center text-muted-foreground py-8 text-sm"
            >
              No contact messages yet.
            </div>
          )}
          {contacts.map((c, i) => (
            <Card
              key={`contact-${c.id}`}
              data-ocid={`admin.contact.item.${i + 1}`}
              className="border-border bg-card"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-foreground">
                        {c.name}
                      </span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <a
                        href={`mailto:${c.email}`}
                        className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
                      >
                        {c.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <GoldBadge>{c.subject || "No subject"}</GoldBadge>
                      {c.createdAt > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {formatDate(c.createdAt)}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    data-ocid={`admin.contact.toggle_button.${i + 1}`}
                    onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                    className="shrink-0 text-xs"
                  >
                    {expanded === c.id ? "Collapse" : "View"}
                  </Button>
                </div>
                {expanded === c.id && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {c.message}
                    </p>
                    <a
                      href={`mailto:${c.email}?subject=Re: ${encodeURIComponent(c.subject)}`}
                      className="inline-flex items-center gap-1.5 mt-3 text-xs"
                      style={{ color: "#d4af37" }}
                    >
                      <Mail size={12} /> Reply via email
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main AdminPage ───────────────────────────────────────────────────────────

const TABS = [
  { value: "home", label: "Home", icon: <Home size={14} /> },
  { value: "research", label: "Research", icon: <FlaskConical size={14} /> },
  { value: "articles", label: "Articles", icon: <FileText size={14} /> },
  {
    value: "publications",
    label: "Publications",
    icon: <BookOpen size={14} />,
  },
  { value: "notes", label: "Notes", icon: <StickyNote size={14} /> },
  { value: "about", label: "About", icon: <User size={14} /> },
  { value: "contact", label: "Contact", icon: <Mail size={14} /> },
];

export default function AdminPage() {
  const { isAdmin, token, logout } = useAdmin();

  if (!isAdmin || !token) {
    return (
      <div
        data-ocid="admin.page"
        className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background"
      >
        <div className="flex items-center gap-2" style={{ color: "#d4af37" }}>
          <AlertCircle size={20} />
          <span className="font-semibold">Access Denied</span>
        </div>
        <p className="text-sm text-muted-foreground">
          You must be logged in as admin to view this page.
        </p>
        <Link
          to="/"
          className="text-sm underline text-muted-foreground hover:text-foreground"
        >
          ← Back to site
        </Link>
      </div>
    );
  }

  return (
    <div data-ocid="admin.page" className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{
                background: "rgba(212,175,55,0.15)",
                border: "1px solid rgba(212,175,55,0.35)",
              }}
            >
              <span className="text-xs font-bold" style={{ color: "#d4af37" }}>
                A
              </span>
            </div>
            <span className="font-display font-semibold text-foreground">
              Admin Dashboard
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              data-ocid="admin.home_link"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home size={14} /> View Site
            </Link>
            <Button
              size="sm"
              variant="ghost"
              data-ocid="admin.logout_button"
              onClick={() => {
                logout();
                window.location.href = "/";
              }}
              className="gap-1.5 text-muted-foreground hover:text-destructive"
            >
              <LogOut size={14} /> Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground">
            Content Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage all sections of the Ashwin Singh Chouhan portfolio.
          </p>
        </div>

        <Tabs defaultValue="home" data-ocid="admin.tabs">
          <TabsList className="mb-6 flex flex-wrap gap-1 h-auto bg-card border border-border p-1 rounded-lg">
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                data-ocid={`admin.${tab.value}.tab`}
                className="flex items-center gap-1.5 text-xs sm:text-sm data-[state=active]:text-foreground"
                style={
                  {
                    "--tab-active-bg": "rgba(212,175,55,0.15)",
                    "--tab-active-color": "#d4af37",
                  } as React.CSSProperties
                }
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.slice(0, 3)}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="home">
            <HomeSection token={token} />
          </TabsContent>
          <TabsContent value="research">
            <ResearchSection token={token} />
          </TabsContent>
          <TabsContent value="articles">
            <ArticlesSection token={token} />
          </TabsContent>
          <TabsContent value="publications">
            <PublicationsSection token={token} />
          </TabsContent>
          <TabsContent value="notes">
            <NotesSection token={token} />
          </TabsContent>
          <TabsContent value="about">
            <AboutSection token={token} />
          </TabsContent>
          <TabsContent value="contact">
            <ContactSection token={token} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
