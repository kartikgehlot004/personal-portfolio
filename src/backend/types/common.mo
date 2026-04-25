module {
  public type Timestamp = Int;
  public type Result     = { #ok : Text; #err : Text };
  public type Token      = Text;

  public type StatItem = {
    value : Text;
    statLabel : Text;
  };
};
