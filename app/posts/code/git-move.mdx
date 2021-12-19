---
title: Moving a branch pointer in Git
description: My struggles with a seemingly simple task
author: Zach Posten
date: 2016-3-2
tags: git
slug: git-move
---

## Branches are just pointers

Before reading this article (article may be a generous term for my ramblings), you should understand that in Git, a branch is nothing more than a pointer to a certain commit. There is very little difference between the name of a branch, and the commit hash that it points to.

```
* c5c2d07 (HEAD) Try different meta tags
* f3dfc69 (facebook) Add meta tags for facebook
* 04268d7 Allow opening of jeopardy category tile on mobile
* 8de6814 Add Jeopardy unanswered state
```

In the above commits, `facebook`, `f3dfc69`, and `head^` are all equivalent to Git in most circumstances.

## Why I want to move them

Often you'll get into a situation where a remote branch gets updated, and then you have to move your local version. You could use `pull`, but `pull` has the potential to unintentionally `merge`, so I avoid it like the plague. Instead, I would like to so something like `git move master origin/master` to update my local `master` branch to point to the same commit that `origin/master` currently points to.

## Writing a custom git command

```bash
#!/bin/bash

# If there are 0 or 1 arguments
if [ $# -eq 0 ] || [ $# -eq 1 ]
  then
    echo "Usage: git move <BRANCH-NAME> <BRANCH-POINTER>"
    exit 1
fi

git branch -D $1
git branch $1 $2

echo ""
echo "Branch $1 moved to $2"
```

## Tracking remote branches

This solution worked fine for me for a long time, but there was always one problem that I didn't even realize was coming from this script. When you delete a branch and create a new one of the same name, your new branch no longer tracks the remote branch (`-u`, `--set-upstream`) that is used to.

## Ok, no deleting

So I needed to figure out a way to do it without deleting the branch. The obvious solution seemed to be `reset --hard`, so I gave that a whirl.

```bash
[alias]
    parseBranchName = !git branch | grep '*' | sed 's/* //' # Get the current branch name
    master = !git parseBranchName > b.txt && git checkout master && git reset --hard up/master && sed 's/ //' b.txt | xargs git checkout && rm b.txt # Move local master to point to up/master
```

I shied away from a bash script because looking up its odd syntax had proven to be a pain for me last time. But that left me with the limitation of writing a typical git alias. The largest problem here is that I wanted to keep the current branch checked out and not end up with master checked out after each time that command is run. Because of that I needed to first parse the current branch name, then pass that data along to the end of the script in order to re-checkout that branch.

The only way I could come up with to do that over several commands was to write it to a file, and then read and delete that file. That was annoying because sometimes when the command would fail for one reason or another, I would end up with a random `b.txt` file sitting in my repo. Also, even though the current branch was checked out in the end, I did checkout a different branch for a few microseconds, which was enough to trigger Visual Studio to think that it should reload.

## How that monstrosity works

`parseBranchName` parses the output of `git branch` to fet the name of the current cranch you're on (it looks for the branch name with a `*` in front of it). This branch name is then written out to a text file `b.txt`. This is all done to store your current branch so that you don't end up on a different branch when the command is finished.

We then do the actual moving with checking out the `master` branch and resetting it to point to the same commit as `up/master`. We then read back in `b.txt`, use `xargs` to pass the stored branch name as an argument to `git checkout`, and finally delete the `b.txt` file.

Whew, that was a lot of work. When this script failed for some reason, you are left with a random `b.txt` file hanging around...which I may have committed more than once.

## Finally

_Finally_, after going through all of this, I learned that git already has a built-in way of doing this (naturally).

```bash
[alias]
    move = branch -f
    master = !git move master up/master
```

Git `branch` has a `-f` flag that will force the branch to be "created" even if the branch already exists, effectively moving it, keeping the remote tracking in tact. I learned a lot about it Git by going through this adventure, but the lesson in the end is clearly "google it before reinventing the wheel".
