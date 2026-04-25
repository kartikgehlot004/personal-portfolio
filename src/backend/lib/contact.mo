import List   "mo:core/List";
import Types  "../types/contact";
import Common "../types/common";

module {
  public func submitContact(
    contacts   : List.List<Types.ContactRecord>,
    nextId     : Nat,
    submission : Types.ContactSubmission,
    now        : Int,
  ) : (Nat, Common.Result) {
    let record : Types.ContactRecord = {
      id        = nextId;
      name      = submission.name;
      email     = submission.email;
      subject   = submission.subject;
      message   = submission.message;
      createdAt = now;
    };
    contacts.add(record);
    (nextId + 1, #ok("Message submitted successfully"));
  };

  public func getContacts(
    contacts : List.List<Types.ContactRecord>,
  ) : [Types.ContactRecord] {
    contacts.toArray();
  };
};
