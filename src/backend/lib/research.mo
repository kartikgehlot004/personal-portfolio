import List  "mo:core/List";
import Nat   "mo:core/Nat";
import Types "../types/research";

module {
  /// Return all research projects sorted by seqNum ascending.
  public func getProjects(
    projects : List.List<Types.ResearchProject>,
  ) : [Types.ResearchProject] {
    let sorted = projects.sort(func(a, b) = Nat.compare(a.seqNum, b.seqNum));
    sorted.toArray()
  };

  /// Return a single project by id, or null if not found.
  public func getProject(
    projects : List.List<Types.ResearchProject>,
    id       : Nat,
  ) : ?Types.ResearchProject {
    projects.find(func(p) { p.id == id })
  };

  /// Create a new project, assign the given nextId, and add it to the list.
  public func createProject(
    projects : List.List<Types.ResearchProject>,
    nextId   : Nat,
    input    : Types.ResearchInput,
  ) : Types.ResearchProject {
    let project : Types.ResearchProject = {
      id          = nextId;
      seqNum      = input.seqNum;
      title       = input.title;
      description = input.description;
      tags        = input.tags;
      imageUrl    = input.imageUrl;
      fullContent = input.fullContent;
      pdfUrl      = input.pdfUrl;
    };
    projects.add(project);
    project
  };

  /// Update an existing project in place. Returns true if found and updated.
  public func updateProject(
    projects : List.List<Types.ResearchProject>,
    id       : Nat,
    input    : Types.ResearchInput,
  ) : Bool {
    var found = false;
    projects.mapInPlace(func(p) {
      if (p.id == id) {
        found := true;
        { p with
          seqNum      = input.seqNum;
          title       = input.title;
          description = input.description;
          tags        = input.tags;
          imageUrl    = input.imageUrl;
          fullContent = input.fullContent;
          pdfUrl      = input.pdfUrl;
        }
      } else { p }
    });
    found
  };

  /// Delete a project by id. Returns true if found and removed.
  public func deleteProject(
    projects : List.List<Types.ResearchProject>,
    id       : Nat,
  ) : Bool {
    let sizeBefore = projects.size();
    let filtered = projects.filter(func(p) { p.id != id });
    projects.clear();
    projects.addAll(filtered.values());
    projects.size() < sizeBefore
  };
};
