import List  "mo:core/List";
import Types "../types/article";

module {
  public func getArticles(
    articles : List.List<Types.Article>,
  ) : [Types.Article] {
    articles.toArray()
  };

  public func getArticle(
    articles : List.List<Types.Article>,
    id       : Nat,
  ) : ?Types.Article {
    articles.find(func(a) { a.id == id })
  };

  public func createArticle(
    articles : List.List<Types.Article>,
    nextId   : Nat,
    input    : Types.ArticleInput,
  ) : Types.Article {
    let article : Types.Article = {
      id          = nextId;
      title       = input.title;
      excerpt     = input.excerpt;
      content     = input.content;
      category    = input.category;
      publishDate = input.publishDate;
      coverImage  = input.coverImage;
      pdfUrl      = input.pdfUrl;
    };
    articles.add(article);
    article
  };

  public func updateArticle(
    articles : List.List<Types.Article>,
    id       : Nat,
    input    : Types.ArticleInput,
  ) : Bool {
    var found = false;
    articles.mapInPlace(func(a) {
      if (a.id == id) {
        found := true;
        { a with
          title       = input.title;
          excerpt     = input.excerpt;
          content     = input.content;
          category    = input.category;
          publishDate = input.publishDate;
          coverImage  = input.coverImage;
          pdfUrl      = input.pdfUrl;
        }
      } else { a }
    });
    found
  };

  public func deleteArticle(
    articles : List.List<Types.Article>,
    id       : Nat,
  ) : Bool {
    let sizeBefore = articles.size();
    let filtered = articles.filter(func(a) { a.id != id });
    articles.clear();
    articles.addAll(filtered.values());
    articles.size() < sizeBefore
  };
};
