module {
  public type ContactSubmission = {
    name    : Text;
    email   : Text;
    subject : Text;
    message : Text;
  };

  public type ContactRecord = {
    id        : Nat;
    name      : Text;
    email     : Text;
    subject   : Text;
    message   : Text;
    createdAt : Int;
  };
};
