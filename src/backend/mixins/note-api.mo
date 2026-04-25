import List       "mo:core/List";
import NoteLib    "../lib/note";
import AdminLib   "../lib/admin";
import Types      "../types/note";
import Common     "../types/common";
import AdminTypes "../types/admin";

mixin (
  notes      : List.List<Types.Note>,
  adminState : AdminTypes.AdminState,
) {
  var nextNoteId : Nat = 0;

  // ── Public read ──────────────────────────────────────────────────────────
  public query func getNotes() : async [Types.Note] {
    NoteLib.getNotes(notes)
  };

  public query func getNote(id : Nat) : async ?Types.Note {
    NoteLib.getNote(notes, id)
  };

  // ── Admin mutations ───────────────────────────────────────────────────────
  public shared func adminCreateNote(token : Common.Token, input : Types.NoteInput) : async Common.Result {
    if (not AdminLib.isValidToken(token, adminState)) {
      return #err("unauthorized");
    };
    ignore NoteLib.createNote(notes, nextNoteId, input);
    nextNoteId += 1;
    #ok("Note created")
  };

  public shared func adminUpdateNote(token : Common.Token, id : Nat, input : Types.NoteInput) : async Common.Result {
    if (not AdminLib.isValidToken(token, adminState)) {
      return #err("unauthorized");
    };
    if (NoteLib.updateNote(notes, id, input)) {
      #ok("Note updated")
    } else {
      #err("Note not found")
    }
  };

  public shared func adminDeleteNote(token : Common.Token, id : Nat) : async Common.Result {
    if (not AdminLib.isValidToken(token, adminState)) {
      return #err("unauthorized");
    };
    if (NoteLib.deleteNote(notes, id)) {
      #ok("Note deleted")
    } else {
      #err("Note not found")
    }
  };
};
