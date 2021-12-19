---
title: Making rebasing faster
description: Do you find yourself running "git rebase -i head~n" a lot?
author: Zach Posten
date: 2017-5-11
tags: git, efficiency
slug: git-i
---

## Background

I believe that one of the biggest arguments in favor of Git as compared to other version control systems is the amount of control that you have over your history. After all, what is source control really for? It's purpose is to allow multiple developers to collaborate on the same code base, and to be able to recover from a screw up. Given that 50% of the reason that we use Git is to look back on what we've done, it would make sense that we should care about, and put effort into making our history understandable and easy to use.

When you're in the heat of development though, you often don't want to take the time to make your commits beautiful and detailed. How do you do that? Well `rebase -i` of course! As any developer who cares about his commit history (which should be _every_ developer) knows, this is a command that gets used a lot. Aside from `commit --amend` or remaking them from scratch, `rebase -i` is the only way in Git to make changes to commits that you have already created.

## The Problem

The most common way that I've seen `rebase -i` used is in combination with `head~n` in order to modify the last `n` commits. It is also of course possible to specify any other commit pointer, but I find that these are oftentimes more cumbersome. However, `git rebase -i head~n` is an awful lot to type 20 times a day. Even my alias'd down version of `k r -i head~n` is too much with that tilde in there. Today my frustration with this came to a boiling point with this and I came up with a much easier way.

## The Solution

Of course, the solution is to write an alias for this; but how? `xargs` will supply (space separated) arguments, but you need to insert the `n` immediately after the tilde. It's probably possible to use `sed` to concat the `head~n` together, but those can get nasty fast. The easiest way when is a batch script.

```bash
# C:\batch\rebaseInteractive.bat
git rebase -i head~%1
```

Simple! Now you just need a way to run it that doesn't involve typing in a path. You could use a git alias, but then you still have to type `git` (or `k`) which is just one extra character. So why not write a bash alias?

```bash
# C:\Users\zach\.bashrc
alias i='/c/batch/rebaseInteractive.bat'
```

Now opening a new bash terminal and running `i 3` is equivalent to `git rebase -i head~3`. How efficient!
