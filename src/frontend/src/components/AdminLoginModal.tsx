import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdmin } from "@/hooks/use-admin";
import { AlertCircle, Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import { useState } from "react";

interface AdminLoginModalProps {
  open: boolean;
  onClose: () => void;
}

export function AdminLoginModal({ open, onClose }: AdminLoginModalProps) {
  const { login } = useAdmin();
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!adminId.trim() || !password.trim()) return;
    setLoading(true);
    setError(null);
    const result = await login(adminId, password);
    setLoading(false);
    if (result.ok) {
      setAdminId("");
      setPassword("");
      onClose();
      window.location.href = "/admin";
    } else {
      setError(result.error ?? "Invalid credentials. Please try again.");
    }
  }

  function handleClose() {
    setAdminId("");
    setPassword("");
    setError(null);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        data-ocid="admin_login.dialog"
        className="sm:max-w-md border-border bg-card"
        style={{ borderColor: "rgba(212,175,55,0.3)" }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground font-display text-xl">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{
                background: "rgba(212,175,55,0.15)",
                border: "1px solid rgba(212,175,55,0.4)",
              }}
            >
              <Lock size={15} style={{ color: "#d4af37" }} />
            </span>
            Admin Access
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 space-y-4">
          {/* Admin ID field */}
          <div className="space-y-2">
            <Label htmlFor="admin-id" className="text-muted-foreground text-sm">
              Admin ID
            </Label>
            <Input
              id="admin-id"
              data-ocid="admin_login.input"
              type="text"
              value={adminId}
              onChange={(e) => {
                setAdminId(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Enter admin ID"
              className="border-input bg-background focus:ring-2"
              style={{ outlineColor: "#d4af37" }}
              autoFocus
              autoComplete="username"
            />
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <Label
              htmlFor="admin-password"
              className="text-muted-foreground text-sm"
            >
              Password
            </Label>
            <div className="relative">
              <Input
                id="admin-password"
                data-ocid="admin_login.password_input"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Enter admin password"
                className="pr-10 border-input bg-background focus:ring-2"
                style={{ outlineColor: "#d4af37" }}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div
              data-ocid="admin_login.error_state"
              className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              <AlertCircle size={14} className="shrink-0" />
              {error}
            </div>
          )}

          <div className="flex gap-3 justify-end pt-1">
            <Button
              type="button"
              variant="ghost"
              data-ocid="admin_login.cancel_button"
              onClick={handleClose}
              className="text-muted-foreground"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              data-ocid="admin_login.submit_button"
              disabled={loading || !adminId.trim() || !password.trim()}
              className="gap-2 font-semibold"
              style={{
                background: loading ? "rgba(212,175,55,0.5)" : "#d4af37",
                color: "#1a1200",
                border: "none",
              }}
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  Verifying…
                </>
              ) : (
                <>
                  <ShieldCheck size={15} />
                  Access Admin
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
