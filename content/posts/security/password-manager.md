---
title: Online Security for the Normal Person, Part 1
description: Using a password manager
author: Zach Posten
date: 2020-2-4
tags: security, online, digital
slug: password-manager
imageFilename: security.jpg
---

### Background

For those who don't know, my full time job is to sit in front of a computer and write code. That means I spend a lot of time in and around the internet.

I've recently had some personal experience with the dark side of the internet and the people on it. That experience made me want to share some of the things I've learned about how to keep yourself safe in the digital era that we are all living in.

I intend for this to be a multi-part series on steps that _everyone_ can take to improve their online security. I want to help make sure that **you** are not the low hanging fruit for some bad actor thousands of miles away to take advantage of.

My primary audience for this post is my friends and family who don't necessarily sit down every morning and wonder about how safe they are online. I hope to both illustrate to you why it's important to think about these things, and provide some easy steps that you can take to help.

### Series

This is part 1 of the series, so you're in the right place!

I'll link to the other parts below once they're written:

1. <span>Using a password manager <i><small>(this post)</small></i></span>
1. Buying things online with your credit card
1. Providing your bank account information to websites

### What is a password manager?

How many online accounts do you think you have? You should actually try to count, I'll give you a moment

.

.

.

.

How many did you get? I bet you underestimated it. Think of every old social media account (did you have a MySpace?), every site you ever bought some trinket off of (I have three accounts I used just to get cheap books in college), every app you ever used that required an account.

Just for a ballpark number, I have about 390 online accounts.

Now, think about how many times in the last year you used the "forgot my password" feature of some site. Isn't that annoying? You swear you know what the password is but the darn site just disagrees with you.

A password manager is tool that you can use to store all of your passwords. I have all 390 of those accounts in my password manager. Having one place to store all your passwords means that will never forget and have to reset another password.

Using a password manager also means that (for the most part), you can avoid typing out any of those passwords in the future. But I can already hear you saying..."but Zach, Chrome saves all my passwords!" Chrome can save your passwords! But what about when you you want to access one of those passwords on your phone to put in some app? Or on someone elses computer?

The good password managers all have browser extensions, apps for your phone, and websites. So no matter what computer or device you're on, you will always have access to your passwords.

### But my current method works just fine!

I've been preaching this whole "use a password manager" thing for years now, and have talked to a number of people about what their current password strategy is. By far, the most common practice is for people to use a few different passwords for every site they sign up for. Usually there are variations on those passwords by tacking a number or a few `!`s on the end.

When they need to sign into a site that they haven't used in awhile, they just cycle through their passwords until their log in is successful! Occasionally they'll fail to find the right variation, and just use the "Forgot your password?" link to reset their password to the one they have been using most frequently lately.

As it turns out, that this strategy is really, _really_ insecure. The reason for that boils down to a hacking technique called "credential stuffing". What you have to understand is that websites get hacked _alllllllllll the time_. According to [a 2019 study](https://www.webarxsecurity.com/website-hacking-statistics-2018-february), on average there is an attempted hack on a website every 39 seconds. While not all of them are successful, plenty of them are. Sometimes when a website gets hacked, the hackers are able to steal user information from that site, including usernames and passwords.

Hackers take those stolen username/password combinations and "stuff" them into all the popular websites (e.g. Google, Facebook, banks, Twitter). Because of how common it is to reuse passwords, that technique is often successful. Because some crappy little website that you signed up for one time got hacked, the hacker now has access to your banking information because you used the same login!

> Try this: Go to the website [haveibeenpwned.com](https://haveibeenpwned.com) and enter a couple of your most common email addresses. This site is maintained by security researcher Troy Hunt. Troy collects hacked emails from the largest breaches around the internet and can tell you if he's found your email address in any of those hacks. If your email doesn't come up, it's no guarantee that it hasn't been "pwned", but it's a nice initial indicator.

#### How can a password manager help with this?

Password managers solve this problem by making every username/password combination that you use for every site completely unique. So if one site gets hacked and your credentials stolen, those credentials won't get the hacker into any other site.

In addition to reusing passwords, many people tend to use very [weak passwords](https://www.wrc.noaa.gov/wrso/security_guide/password.htm) passwords. The weaker (i.e. shorter, less complex) a password the more easily it can be guessed by a computer. Computers often guess by starting with [common passwords](https://nordpass.com/blog/top-worst-passwords-2019) and trying variations. If that fails, they can just try every combination of letters and numbers. If your password is relatively short, it can be "brute forced" by a computer in seconds if there are no other constraints or delays.

Password managers solve this problem by generating long, complex, and random passwords that cannot be guessed or brute forced<sup>1</sup>.

### But what if they hack te password manager!?

When you sign into your password manager, you do so using a "master password". This becomes the only password you have to remember now. It should be long (more than 15 characters), complex, and completely unique from anything you've used online before.

Password managers work by encrypting your stored passwords using your master password. This means that even the password manager company themselves cannot access your stored passwords, because they don't have your master password! So if someone hacks the password manager, all they get is a bunch of encrypted, meaningless text that is in no way helpful to them in accomplishing their nefarious tasks.

### Okay, so how do I get one?

I would personally recommend one of two password managers to you.

- [LastPass](https://www.lastpass.com) <small><i>(The one I use)</i></small>
- [1Password](https://1password.com)

These password managers are both well known and very secure. You can read [feature comparisons](https://www.digitaltrends.com/computing/lastpass-vs-1password-comparison) between them if you would like. Honestly no matter which one you choose, you'll be far better off than you were before using one.

I personally use LastPass though, so I'm more familiar with it. Because of that I'm going to talk briefly about some of its features here.

LastPass has a really nice free tier, so you can [get started](https://lastpass.com/create-account.php) right now without spending a dime. It has [browser extensions for all the major browsers](https://lastpass.com/misc_download2.php), as well as mobile applications for both iOS and Android. And it's all free!

To get started with a password manager, I would recommend starting with your most important accounts first:

1. Your bank
1. All other financial institutions, like your credit card
1. Any bills that you have online accounts for
1. Any website that has your credit card information
1. Your Google account
1. Your social media accounts

<div style="margin-top: 80px"></div>

To add a site to your password manager, make sure you have its browser extension installed and do the following:

1. Go to the site in question and sign out of it if you're already signed in
2. Sign into the website
3. LastPass will ask you if you want it to remember the site in question, choose yes
4. Click on the browser extension icon and choose "Generate secure password"
   <div style="background-image: url('/static/images/blog/pass-manager/lastpass-generate-pass.png');height: 400px;width: 100%;margin-bottom: 50px;background-size: contain; background-repeat: no-repeat;background-position: center;"></div>
5. Make sure you have a length of at least 20 characters, "All characters" selected, and all 4 checkboxes checked.
   <div style="background-image: url('/static/images/blog/pass-manager/lastpass-gen-options.png');height: 400px;margin-bottom: 50px;background-size: contain; background-repeat: no-repeat;background-position: center;"></div>
6. Then copy the generated password (you can click the multiple squares icon to the right of the password).
   - When you're first getting started, it may be helpful to paste the password somewhere (e.g. Notepad) just temporarily to make sure you don't lose it (make sure you close that file without saving though!).
7. Use the change password feature of the website to change your password.
   - Use LastPass' autofill feature to fill your current password by clicking the little box that appears in the text field
   - Paste (right click, choose "Paste") the random password you generated into the new password field
8. LastPass should prompt you to update your stored password, choose yes.
   - It might not hurt to open your LastPass vault just to confirm that it stored the password you expected, especially on your first few passwords.

That might sound like a lot of work, and it's definitely a bit laborious. But when you weigh it against getting your bank account emptied because someone hacked your MySpace account, the scales are pretty heavily tilted.

### Conclusion

That's it! In short, please consider using a password manager. There is a real possibility of one of your accounts getting hacked at some point, if one [hasn't already](https://www.cnbc.com/2019/12/23/the-10-biggest-data-hacks-of-the-decade.html).

If you found this article helpful, or have additional questions, please reach out to me!

Stay safe out there.

<div style="margin-top: 80px"></div>

---

<div style="margin-top: 80px"></div>

<sup>1</sup> Any password can be brute forced if given enough time. But by making your password sufficiently complex, you can ensure that it will take a hacker with an extremely fast computer years to guess your password. If the website declines access after `n` number of incorrect entries, then this strategy can take centuries. This ability to eventually guess any password is why some places requires you to change your password every so often.
