import List  "mo:core/List";
import Types "../types/note";

module {
  public func getNotes(
    notes : List.List<Types.Note>,
  ) : [Types.Note] {
    notes.toArray()
  };

  public func getNote(
    notes : List.List<Types.Note>,
    id    : Nat,
  ) : ?Types.Note {
    notes.find(func(n) { n.id == id })
  };

  public func createNote(
    notes  : List.List<Types.Note>,
    nextId : Nat,
    input  : Types.NoteInput,
  ) : Types.Note {
    let note : Types.Note = {
      id          = nextId;
      title       = input.title;
      excerpt     = input.excerpt;
      content     = input.content;
      publishDate = input.publishDate;
      tags        = input.tags;
      pdfUrl      = input.pdfUrl;
    };
    notes.add(note);
    note
  };

  public func updateNote(
    notes  : List.List<Types.Note>,
    id     : Nat,
    input  : Types.NoteInput,
  ) : Bool {
    var found = false;
    notes.mapInPlace(func(n) {
      if (n.id == id) {
        found := true;
        { n with
          title       = input.title;
          excerpt     = input.excerpt;
          content     = input.content;
          publishDate = input.publishDate;
          tags        = input.tags;
          pdfUrl      = input.pdfUrl;
        }
      } else { n }
    });
    found
  };

  public func deleteNote(
    notes : List.List<Types.Note>,
    id    : Nat,
  ) : Bool {
    let sizeBefore = notes.size();
    let filtered = notes.filter(func(n) { n.id != id });
    notes.clear();
    notes.addAll(filtered.values());
    notes.size() < sizeBefore
  };
};
