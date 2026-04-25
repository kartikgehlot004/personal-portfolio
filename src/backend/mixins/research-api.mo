import List        "mo:core/List";
import ResearchLib "../lib/research";
import AdminLib    "../lib/admin";
import Types       "../types/research";
import Common      "../types/common";
import AdminTypes  "../types/admin";

mixin (
  projects       : List.List<Types.ResearchProject>,
  adminState     : AdminTypes.AdminState,
) {
  var nextResearchId : Nat = 0;

  // ── Public read ──────────────────────────────────────────────────────────
  public query func getResearchProjects() : async [Types.ResearchProject] {
    ResearchLib.getProjects(projects)
  };

  public query func getResearchProject(id : Nat) : async ?Types.ResearchProject {
    ResearchLib.getProject(projects, id)
  };

  // ── Admin mutations ───────────────────────────────────────────────────────
  public shared func adminCreateResearch(token : Common.Token, input : Types.ResearchInput) : async Common.Result {
    if (not AdminLib.isValidToken(token, adminState)) {
      return #err("unauthorized");
    };
    ignore ResearchLib.createProject(projects, nextResearchId, input);
    nextResearchId += 1;
    #ok("Research project created")
  };

  public shared func adminUpdateResearch(token : Common.Token, id : Nat, input : Types.ResearchInput) : async Common.Result {
    if (not AdminLib.isValidToken(token, adminState)) {
      return #err("unauthorized");
    };
    if (ResearchLib.updateProject(projects, id, input)) {
      #ok("Research project updated")
    } else {
      #err("Research project not found")
    }
  };

  public shared func adminDeleteResearch(token : Common.Token, id : Nat) : async Common.Result {
    if (not AdminLib.isValidToken(token, adminState)) {
      return #err("unauthorized");
    };
    if (ResearchLib.deleteProject(projects, id)) {
      #ok("Research project deleted")
    } else {
      #err("Research project not found")
    }
  };
};
