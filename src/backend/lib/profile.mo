import Types "../types/profile";

module {
  public func getProfile(
    profileState : Types.ProfileState,
  ) : ?Types.Profile {
    profileState.data;
  };

  public func upsertProfile(
    profileState : Types.ProfileState,
    input        : Types.ProfileInput,
  ) {
    profileState.data := ?{
      name       = input.name;
      bio        = input.bio;
      avatarUrl  = input.avatarUrl;
      skills     = input.skills;
      milestones = input.milestones;
      stats      = input.stats;
    };
  };
};
