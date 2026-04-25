module {
  public type ResearchProject = {
    id          : Nat;
    seqNum      : Nat;
    title       : Text;
    description : Text;
    tags        : [Text];
    imageUrl    : Text;
    fullContent : Text;
    pdfUrl      : ?Text;
  };

  public type ResearchInput = {
    seqNum      : Nat;
    title       : Text;
    description : Text;
    tags        : [Text];
    imageUrl    : Text;
    fullContent : Text;
    pdfUrl      : ?Text;
  };
};
