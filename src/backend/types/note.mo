module {
  public type Note = {
    id          : Nat;
    title       : Text;
    excerpt     : Text;
    content     : Text;
    publishDate : Text;
    tags        : [Text];
    pdfUrl      : ?Text;
  };

  public type NoteInput = {
    title       : Text;
    excerpt     : Text;
    content     : Text;
    publishDate : Text;
    tags        : [Text];
    pdfUrl      : ?Text;
  };
};
