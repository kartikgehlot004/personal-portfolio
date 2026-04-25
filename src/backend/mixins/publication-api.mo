import List            "mo:core/List";
import PublicationLib  "../lib/publication";
import AdminLib        "../lib/admin";
import Types           "../types/publication";
import Common          "../types/common";
import AdminTypes      "../types/admin";

mixin (
  publications : List.List<Types.Publication>,
  adminState   : AdminTypes.AdminState,
) {
  var nextPublicationId : Nat = 0;

  // ── Public read ──────────────────────────────────────────────────────────
  public query func getPublications() : async [Types.Publication] {
    PublicationLib.getPublications(publications)
  };

  public query func getPublication(id : Nat) : async ?Types.Publication {
    PublicationLib.getPublication(publications, id)
  };

  // ── Admin mutations ───────────────────────────────────────────────────────
  public shared func adminCreatePublication(token : Common.Token, input : Types.PublicationInput) : async Common.Result {
    if (not AdminLib.isValidToken(token, adminState)) {
      return #err("unauthorized");
    };
    ignore PublicationLib.createPublication(publications, nextPublicationId, input);
    nextPublicationId += 1;
    #ok("Publication created")
  };

  public shared func adminUpdatePublication(token : Common.Token, id : Nat, input : Types.PublicationInput) : async Common.Result {
    if (not AdminLib.isValidToken(token, adminState)) {
      return #err("unauthorized");
    };
    if (PublicationLib.updatePublication(publications, id, input)) {
      #ok("Publication updated")
    } else {
      #err("Publication not found")
    }
  };

  public shared func adminDeletePublication(token : Common.Token, id : Nat) : async Common.Result {
    if (not AdminLib.isValidToken(token, adminState)) {
      return #err("unauthorized");
    };
    if (PublicationLib.deletePublication(publications, id)) {
      #ok("Publication deleted")
    } else {
      #err("Publication not found")
    }
  };
};
