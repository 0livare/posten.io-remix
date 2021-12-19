---
title: Time Traveling with Git
subtitle: Part 1 - Viewing the log
description: This post is part one of what I hope to be a comprehensive explanation of the most effective git strategies and workflows
author: Zach Posten
date: 2019-5-3
tags: git
slug: git-time-travel-pt1
imageFilename: git-warp.png
---

Git is a very powerful and complicated tool. While there are a lot of ways to use it, it is my belief that there is a single method that leads to the most understandable, useful, and powerful git workflow. I say this with the knowledge that there are millions of developers all around the world using Git to store their source code, many of them very happy with their workflows. While it's nowhere near millions, I have personally worked with dozens of developers at several different companies and have seen that typical strategies have room for improvement.

In this series of posts, I hope to explain in detail all the different facets of what I have found to be the most effective Git workflow for teams of any size. Be warned, this is definitely not the simplest method. Taking advantage of it requires a deeper understanding of Git than many developers have before dedicating some time to actually learning the tool. But I don't believe the method is overly complicated either. The only problem with it is, as I said, using it requires more knowledge about Git. But don't worry, you're in the right place.

In this post in particular, I hope to discuss what is, in my opinion, the most powerful feature of Git that no one ever uses: The Log. Understanding the log is essential to understanding Git as a whole. In many ways they are one in the same, yet, when's the last time you typed `git log`? We're about to change that!

## Some prerequisite knowledge

### Branches

Many people think about branches in Git the wrong way. They think of branches being these heavy constructs that "contain" commits. This is understandable because language like commits being "on a branch" or your repo being "on a branch" is common, and that fits with prior understanding from other version control tools. But branches in Git are very simple. The only thing they do is point to commits, that's it! Every branch in Git is a pointer to a particular commit hash, and because they're just pointers, branches can easily be created, moved and deleted. You can `checkout` a branch, but all that really means is that when you make a commit, the branch you have "checked out" will automatically be moved forward to your newly created commit.

It is possible to use Git (locally, anyway) without any branches at all, but that would be extremely inconvenient and I don't recommend it. Branches serve as convenient aliases for hard to remember and at times fluid commit hashes, but they also mark which commits are important. If a commit is somewhere in the ancestry of a commit that is pointed to by a branch, then Git considers it important enough to show it in the log. Any "hanging chads", if you will, commits that are not in the ancestry of any commit pointed to by a branch (or a tag), do not show up in the log. If that language is confusing to you, don't worry, keep reading!

### HEAD

Your HEAD (in Git) is like a weird kind of branch in the sense that it points to a particular commit. But unlike a branch, it can't be deleted. That's because your HEAD represents the files that currently exist in your file system, i.e. the files that you see in your IDE. When you have a branch checked out and you run `git log`, you'll see that git shows your HEAD pointing to that branch: `HEAD -> dev`. Like I mentioned before, that just means that when you create a new commit, both your HEAD and the branch that you have checked out (`dev` in this example) will both move forward to that commit.

> Fun fact: When using git, HEAD does not have to be capitalized. `head` and `HEAD` are absolutely equivalent

### Commits

If the atom is the is the building block of the universe, then the commit is the building block of Git. Everything in Git is based around commits.

> Remember from a previous section that branches are just pointers to commits.

But what _is_ a commit exactly? A Git commit is made up of three parts

- The content of the commit. This is the actual source code that you're trying to store in Git by making this commit
- A commit message. This is a description you include when you make a commit.
- A parent. This is the commit that your HEAD pointed to before making this commit. Every commit apart from the very first one in the repo (the "root commit") has a parent

## Let's take a look at the log

Okay okay, enough of this talky talky nonsense. Go ahead, `cd` to your most convenient Git repo and type `git log`. You'll see something like the following:

```bash
commit 835dbb9af8804f369d4d6c5b071a0ea5497a30ad (HEAD -> master, origin/master)
Merge: 31aaea6 01c1d1a
Author: Zach Posten <zach@posten.io>
Date:   Sat Apr 20 19:32:12 2019 -0500

    Implement the blog

commit 01c1d1ac1f945b450204d25b34e4d52e7e866925
Author: Zach Posten <zach@posten.io>
Date:   Fri Apr 19 09:46:02 2019 -0500

    feat: Add the date to the blog post cards

commit f96960d3b68656f42627d4fa4434ba6a7d921ea4 (origin/foo)
Author: Zach Posten <zach@posten.io>
Date:   Fri Apr 19 09:32:08 2019 -0500

    feat: Implement blog code syntax highlighting
```

Those, as you're probably aware, are your Git commits. For every commit, you're shown:

- The commit hash. The SHA-256 hash of every commit in your repository will be unique. If you change any of the three pieces of the commit mentioned eariler (content, commit message, parent), the hash will change
- The author. Specifically it shows the name and email that are set in the user's `.gitconfig` when they made the commit
- The date the commit was made
- The entire commit text, both summary and body

You can also see branches listed after the commit hash that point to this particular commit.

The commits are shown with the most recent at the top, and oldest at the bottom.

### Formatting the log

Now we've seen the log. But in its raw form, it's not super useful most of the time. We want to use the log to see the relationships between our commits to better understand the structure of our repository. Git can generate a graph which does exactly that by adding a `--graph` flag to the `git log` command.

```bash
git log --graph

* commit 67d4c100d7327944a80924a3f64c39e0b8c4f231 (HEAD -> dev, origin/dev)
| Author: Zach Posten <zach@posten.io>
| Date:   Sat Jun 1 02:28:42 2019 -0500
|
|     fix: Remove scheduler card from apps page
|
|     It is too much work to re-implement that right now,
|     and I just want to finally get this site published.
|
* commit e1cd1a327739482e96ccafaed33d8f6b5424e4d0
| Author: Zach Posten <zach@posten.io>
| Date:   Sat Jun 1 02:21:39 2019 -0500
|
|     refactor: Move page components into pages directory
|
* commit 7152b37592ff5e0d8a7b33129b5f95d3ca139df8
| Author: Zach Posten <zach@posten.io>
| Date:   Sat Jun 1 01:44:30 2019 -0500
|
|     feat: Create jeopardy score app
```

The graph is nice, but the formatting of the information makes it difficult to extract the most useful information at a glance. Let's add a couple more flags to this command to modify the formatting.

We will add the `--oneline` flag to make each commit display on only a single line instead of five or more. Then we'll add the `--decorate` flag to add some nice colors to the graph and commit text. Finally we'll add the `--all` flag. This flag shows the history of all of the branches in your repository, instead of only showing the history of the commit that you currently have checked out.

```bash
git log --graph --oneline --decorate --all
```

<div style="background-image: url('/static/images/blog/git-time-travel/git-log-screenshot.png');height: 400px;margin-bottom: 50px;background-size: contain; background-repeat: no-repeat;background-position: center;"></div>

Great! This is a much more useful format of the log than what we started with. One final tweak though, I think it's useful to still display the author or each commit. In order to accomplish that, you have to specify a custom `--pretty` format. This command becomes extremely arduous to type, and I would strongly recommend that you create an alias for it

```bash
git log --pretty=format:"%C(auto)%h%d %s %C(cyan)[%aN]" --graph --all
```

<div style="background-image: url('/static/images/blog/git-time-travel/git-ls-screenshot.png');height: 400px;margin-bottom: 50px;background-size: contain; background-repeat: no-repeat;background-position: center;"></div>

This is one of many git aliases that I use. You can find the all of them [here](https://gist.github.com/zposten/4960a81addfbcdc48abfe855fae0af43).

## Wrapping up

In this post, we've discussed some intermediate Git topics that are often misunderstood. Then we came up with a git alias to display a graph of the commits in your repository. This graph shows you the structure of your repository, and in future parts of this series, I will talk about what this graph should look like, and the techniques that are needed to structure commits in that fashion.
