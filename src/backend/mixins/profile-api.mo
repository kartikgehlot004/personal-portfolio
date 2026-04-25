import ProfileLib "../lib/profile";
import AdminLib   "../lib/admin";
import Types      "../types/profile";
import Common     "../types/common";
import AdminTypes "../types/admin";

mixin (
  profileState : Types.ProfileState,
  adminState   : AdminTypes.AdminState,
) {
  // ── Public read ──────────────────────────────────────────────────────────
  public query func getProfile() : async ?Types.Profile {
    ProfileLib.getProfile(profileState)
  };

  // ── Admin mutations ───────────────────────────────────────────────────────
  public shared func adminUpdateProfile(token : Common.Token, input : Types.ProfileInput) : async Common.Result {
    if (not AdminLib.isValidToken(token, adminState)) {
      return #err("unauthorized");
    };
    ProfileLib.upsertProfile(profileState, input);
    #ok("Profile updated")
  };
};
