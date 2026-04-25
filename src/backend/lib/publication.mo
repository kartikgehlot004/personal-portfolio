import List  "mo:core/List";
import Types "../types/publication";

module {
  public func getPublications(
    publications : List.List<Types.Publication>,
  ) : [Types.Publication] {
    publications.toArray()
  };

  public func getPublication(
    publications : List.List<Types.Publication>,
    id           : Nat,
  ) : ?Types.Publication {
    publications.find(func(p) { p.id == id })
  };

  public func createPublication(
    publications : List.List<Types.Publication>,
    nextId       : Nat,
    input        : Types.PublicationInput,
  ) : Types.Publication {
    let publication : Types.Publication = {
      id      = nextId;
      title   = input.title;
      authors = input.authors;
      venue   = input.venue;
      year    = input.year;
      pubType = input.pubType;
      link    = input.link;
      pdfUrl  = input.pdfUrl;
    };
    publications.add(publication);
    publication
  };

  public func updatePublication(
    publications : List.List<Types.Publication>,
    id           : Nat,
    input        : Types.PublicationInput,
  ) : Bool {
    var found = false;
    publications.mapInPlace(func(p) {
      if (p.id == id) {
        found := true;
        { p with
          title   = input.title;
          authors = input.authors;
          venue   = input.venue;
          year    = input.year;
          pubType = input.pubType;
          link    = input.link;
          pdfUrl  = input.pdfUrl;
        }
      } else { p }
    });
    found
  };

  public func deletePublication(
    publications : List.List<Types.Publication>,
    id           : Nat,
  ) : Bool {
    let sizeBefore = publications.size();
    let filtered = publications.filter(func(p) { p.id != id });
    publications.clear();
    publications.addAll(filtered.values());
    publications.size() < sizeBefore
  };
};
