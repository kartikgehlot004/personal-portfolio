import Common "../types/common";

module {
  public type Milestone = {
    year        : Nat;
    title       : Text;
    description : Text;
  };

  public type Profile = {
    name       : Text;
    bio        : Text;
    avatarUrl  : Text;
    skills     : [Text];
    milestones : [Milestone];
    stats      : [Common.StatItem];
  };

  public type ProfileInput = {
    name       : Text;
    bio        : Text;
    avatarUrl  : Text;
    skills     : [Text];
    milestones : [Milestone];
    stats      : [Common.StatItem];
  };

  /// Mutable wrapper so mixins can update the profile via reference.
  public type ProfileState = {
    var data : ?Profile;
  };
};
