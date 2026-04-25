module {
  /// Session token is a random hex string stored in actor state.
  /// The admin password hash is stored as a SHA-256 hex digest.
  public type AdminState = {
    var adminId      : Text;  // admin login ID (username)
    var passwordHash : Text;  // hash of the admin password
    var sessionToken : ?Text; // active session token, null when logged out
  };
};
