module {
  public type Article = {
    id          : Nat;
    title       : Text;
    excerpt     : Text;
    content     : Text;
    category    : Text;
    publishDate : Text;
    coverImage  : Text;
    pdfUrl      : ?Text;
  };

  public type ArticleInput = {
    title       : Text;
    excerpt     : Text;
    content     : Text;
    category    : Text;
    publishDate : Text;
    coverImage  : Text;
    pdfUrl      : ?Text;
  };
};
