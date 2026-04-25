import Time     "mo:core/Time";
import AdminLib "../lib/admin";
import Types    "../types/admin";
import Common   "../types/common";

/// Admin authentication mixin.
/// Exposes login/logout and password-change endpoints.
mixin (
  adminState : Types.AdminState,
) {
  /// Login with the admin ID and password. Returns a session token on success.
  public shared func adminLogin(adminId : Text, password : Text) : async { #ok : Common.Token; #err : Text } {
    if (adminId != adminState.adminId) {
      return #err("Invalid credentials");
    };
    if (AdminLib.verifyPassword(password, adminState.passwordHash)) {
      let seed = adminId # password # Time.now().toText();
      let token = AdminLib.generateToken(seed);
      adminState.sessionToken := ?token;
      #ok(token)
    } else {
      #err("Invalid credentials")
    }
  };

  /// Logout — invalidates the current session token.
  public shared func adminLogout(token : Common.Token) : async Common.Result {
    if (AdminLib.isValidToken(token, adminState)) {
      adminState.sessionToken := null;
      #ok("Logged out successfully")
    } else {
      #err("Invalid session token")
    }
  };

  /// Change the admin password. Requires a valid current session token.
  public shared func adminChangePassword(token : Common.Token, newPassword : Text) : async Common.Result {
    if (not AdminLib.isValidToken(token, adminState)) {
      return #err("unauthorized");
    };
    adminState.passwordHash := AdminLib.hashPassword(newPassword);
    adminState.sessionToken := null;
    #ok("Password changed successfully")
  };

  /// Validate a token — useful for frontend session checks.
  public query func adminValidateToken(token : Common.Token) : async Bool {
    AdminLib.isValidToken(token, adminState)
  };
};
