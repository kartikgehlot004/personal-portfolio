import Time       "mo:core/Time";
import List       "mo:core/List";
import ContactLib "../lib/contact";
import AdminLib   "../lib/admin";
import Types      "../types/contact";
import Common     "../types/common";
import AdminTypes "../types/admin";

mixin (
  contacts   : List.List<Types.ContactRecord>,
  adminState : AdminTypes.AdminState,
) {
  var nextContactId : Nat = 0;

  // ── Public write (no auth needed for submissions) ────────────────────────
  public shared func submitContact(submission : Types.ContactSubmission) : async Common.Result {
    let (newId, result) = ContactLib.submitContact(contacts, nextContactId, submission, Time.now());
    nextContactId := newId;
    result
  };

  // ── Admin read ────────────────────────────────────────────────────────────
  public shared func adminGetContacts(token : Common.Token) : async { #ok : [Types.ContactRecord]; #err : Text } {
    if (not AdminLib.isValidToken(token, adminState)) {
      return #err("unauthorized");
    };
    #ok(ContactLib.getContacts(contacts))
  };
};
