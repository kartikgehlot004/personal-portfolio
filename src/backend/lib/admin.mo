import Nat    "mo:core/Nat";
import Types  "../types/admin";

module {
  /// Compute a simple deterministic hash of the password.
  /// Uses a djb2-style hash converted to hex for a compact representation.
  public func hashPassword(password : Text) : Text {
    var h : Nat = 5381;
    for (c in password.toIter()) {
      let code = c.toNat32();
      h := (h * 33 + Nat.fromNat32(code)) % 0xFFFFFFFF;
    };
    natToHex(h)
  };

  // Helper: convert Nat to lowercase hex string
  func natToHex(n : Nat) : Text {
    if (n == 0) return "0";
    let hexChars = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
    var result = "";
    var remaining = n;
    while (remaining > 0) {
      result := hexChars[remaining % 16] # result;
      remaining := remaining / 16;
    };
    result
  };

  /// Verify password against stored hash. Returns true if match.
  public func verifyPassword(password : Text, storedHash : Text) : Bool {
    hashPassword(password) == storedHash
  };

  /// Generate a pseudo-random session token derived from a seed text.
  /// Combines two different hashes for more entropy.
  public func generateToken(seed : Text) : Text {
    var h1 : Nat = 5381;
    var h2 : Nat = 52711;
    for (c in seed.toIter()) {
      let code = c.toNat32();
      h1 := (h1 * 33 + Nat.fromNat32(code)) % 0xFFFFFFFF;
      h2 := (h2 * 37 + Nat.fromNat32(code)) % 0xFFFFFFFF;
    };
    natToHex(h1) # natToHex(h2)
  };

  /// Check whether the supplied token matches the active session.
  public func isValidToken(token : Text, adminState : Types.AdminState) : Bool {
    switch (adminState.sessionToken) {
      case null false;
      case (?t) t == token;
    }
  };
};
