# mercurial-bower-resolver v0.1.1
A Mercurial resolver for Bower

# Usage:

Include `"mercurial-bower-resolver"` in your .bowerrc:

    {
      "resolvers": [
        "mercurial-bower-resolver"
      ]
    }

Then add a reference to a hg repo in your bower.json:

    "dependencies": {
        "repo": "hg+http://mysite.org/some/repo"
    }


# Tags/Branches/Revisions:

    "dependencies": {
        "some-branch": "hg+http://mysite.org/some/repo#some-branch",
        "some-tag": "hg+http://mysite.org/some/other/repo#some-tag",
        "some-sem-ver-tag": "hg+http://mysite.org/some/other/repo#1.2.3",
        "some-revision":  "hg+http://mysite.org/some/other/repo#432fbee7ecb6"
    }

# Known issues:

* Will not resolve tags/branches that look like semver ranges (but aren't actually, like 1234 or 1.0). This is due to how Bower decides whether to check the versions. Not actually sure how to deal with this!
