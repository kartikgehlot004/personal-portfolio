import List       "mo:core/List";
import ArticleLib "../lib/article";
import AdminLib   "../lib/admin";
import Types      "../types/article";
import Common     "../types/common";
import AdminTypes "../types/admin";

mixin (
  articles   : List.List<Types.Article>,
  adminState : AdminTypes.AdminState,
) {
  var nextArticleId : Nat = 0;

  // ── Public read ──────────────────────────────────────────────────────────
  public query func getArticles() : async [Types.Article] {
    ArticleLib.getArticles(articles)
  };

  public query func getArticle(id : Nat) : async ?Types.Article {
    ArticleLib.getArticle(articles, id)
  };

  // ── Admin mutations ───────────────────────────────────────────────────────
  public shared func adminCreateArticle(token : Common.Token, input : Types.ArticleInput) : async Common.Result {
    if (not AdminLib.isValidToken(token, adminState)) {
      return #err("unauthorized");
    };
    ignore ArticleLib.createArticle(articles, nextArticleId, input);
    nextArticleId += 1;
    #ok("Article created")
  };

  public shared func adminUpdateArticle(token : Common.Token, id : Nat, input : Types.ArticleInput) : async Common.Result {
    if (not AdminLib.isValidToken(token, adminState)) {
      return #err("unauthorized");
    };
    if (ArticleLib.updateArticle(articles, id, input)) {
      #ok("Article updated")
    } else {
      #err("Article not found")
    }
  };

  public shared func adminDeleteArticle(token : Common.Token, id : Nat) : async Common.Result {
    if (not AdminLib.isValidToken(token, adminState)) {
      return #err("unauthorized");
    };
    if (ArticleLib.deleteArticle(articles, id)) {
      #ok("Article deleted")
    } else {
      #err("Article not found")
    }
  };
};
