var github = require('./github');

var CommitBrowser = function(github) {
  this.github = github;
};

CommitBrowser.prototype = {
  getCommit: function(sha) {
    var self = this;
    return self.github.repos.getCommitAsync({
      user: 'ripple',
      repo: 'rippled',
      sha: sha
    });
  },
  getCommits: function() {
    var self = this;
    return self.getCommitPage(1);
  },
  getCommitPage: function(page) {
    var self = this;
    console.log("Fetching commit page %d", page);
    return self.github.repos.getCommitsAsync({
      user: 'ripple',
      repo: 'rippled',
      page: page,
      per_page: 100
    }).then(function(commits) {
      if (commits.length == 100 && page < 2) {
        return self.getCommitPage(page + 1).then(function(nextCommits) {
          return commits.concat(nextCommits);
        });
      } else {
        return commits;
      }
    });
  }
};

module.exports = CommitBrowser;
