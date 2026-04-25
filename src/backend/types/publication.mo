module {
  public type Publication = {
    id      : Nat;
    title   : Text;
    authors : [Text];
    venue   : Text;
    year    : Nat;
    pubType : Text;
    link    : Text;
    pdfUrl  : ?Text;
  };

  public type PublicationInput = {
    title   : Text;
    authors : [Text];
    venue   : Text;
    year    : Nat;
    pubType : Text;
    link    : Text;
    pdfUrl  : ?Text;
  };
};
