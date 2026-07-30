---
title: 1. Nix and my rite of passage.
draft: true
tags:
  - nix
  - nixos
date: 2026-07-30
---

As of this writing, I use [NixOS](https://nixos.org) on all of my machines. It
wasn't my first exposure to Nix as a tool, because I've been using Nix on
[Pop!_OS](https://system76.com/pop) well before the
[COSMIC](https://system76.com/cosmic) days. I've spent a few fruitful years
within the Nix ecosystem, and this entry is a record of my journey: what made me
look into Nix, the state of documentation, the _"right way"_ to use flakes, the
under-represented aspects, what it means to build Nix-first tooling, and lastly
the things that still frustrate me, along with some exciting developments.

I like functional programming...a lot. I like the ideas behind functional
programming and how they relate closely to their mathematical foundations. You
might like functional programming too, but not care much about the intricacies;
or you are
[ThePrimeagen](https://www.youtube.com/channel/UC8ENHE5xdFSwx71u3fDH5Xw) who
likes to hate functional programming 'cause it brings in the bucks (sorry
Prime). The academic jargon fatigue is very real, especially when you aren't
used to it. Sometimes, you should choose the most obvious description instead of
compressing concepts into sigils of _"elegant abstraction."_

### 1.1. Is it just another Docker?

I got to know about Nix while I was researching functional alternatives to
classically imperative and object-oriented problem spaces. These include
domain-driven design, databases, GUIs, simulations, package management, etc. For
example, artifact building and deployment using containers is already a
realization of functional principles applied to infrastructure. Although, the
purity is rather questionable but pragmatic nonetheless. Data-driven modeling
falls in the same category. There are countless examples to give.

But, what about package management? How do you abstract away the imperative
steps that are inherent to classical package management solutions like `apt`,
`pacman`, `rpm`, `flatpak` etc.? Do you write a build script and hope for the
best? That...isn't too far from the truth, provided we can guarantee some
properties of our build context; because a build script inherits the guarantees
of its surrounding environment.

However, the thought of package management using derivations (i.e., the
cryptographic recipes used to build packages) never crossed my mind until I read
about Nix. At first, it looked like a Docker competitor.

> _"Why do I need Nix to build or deploy software if I already know Docker?"_

I now have a clear answer. Nix and Docker solve very distinct problems
altogether: _runtime isolation_ versus _reproducible and deterministic builds_.
Containers built using Docker or alternatives like Podman are neither strictly
deterministic nor reproducible, i.e., it doesn't guarantee that running
`docker build` twice will result in the exact same image. This is where Nix
comes into the picture; it evaluates derivations as pure functions inside an
isolated sandbox that enforce strict hermeticity (e.g., completely sealed off
from external network/system state). It forces every dependency to be explicitly
defined and be content-addressable.

> Nix doesn't give bit-exact reproducibility, but it does give reproducible
> environments, by ensuring that the inputs are always bit-exact.
> ([source](https://news.ycombinator.com/item?id=43029567))

This is one of the more important things to know. Comparatively,
[Guix](https://guix.gnu.org) has much stronger bit-reproducibility guarantees.

In fact, in most production scenarios, you'll utilize both Nix and Docker
simultaneously.

### 1.2. The state of documentation...is interesting.

Historically speaking, the documentation has been very lacking and segregated;
you never find important things in one place. The situation has improved over
the recent years but it's far from complete. Btw, when I say "Nix", I mean the
entire ecosystem. This includes: Nix the programming language, NixOS the
operating system, and [nixpkgs](https://github.com/nixos/nixpkgs), the package
repository (which also happens to implement NixOS!).

<p style="font-size: 1rem; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin: 0;">
  <span>Licensed under</span>
  <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display: inline-flex; align-items: center; gap: 3px; text-decoration: none;">
    <strong>CC BY-NC-SA 4.0</strong>
    <img style="height: 14px !important; vertical-align: middle;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1" />
    <img style="height: 14px !important; vertical-align: middle;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1" />
    <img style="height: 14px !important; vertical-align: middle;" src="https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1" />
    <img style="height: 14px !important; vertical-align: middle;" src="https://mirrors.creativecommons.org/presskit/icons/sa.svg?ref=chooser-v1" />
  </a>
  <span>•</span>
  <span>Carries the</span>
  <a href="https://brainmade.org" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; text-decoration: none; vertical-align: middle;">
    <img src="https://brainmade.org/black-logo.png" alt="brainmade" style="height: 1rem; width: auto; vertical-align: middle;" />
    <span style="margin-left: 0.4rem;">mark.</span>
  </a>
  <span>Learn <a href="/night-garden/why-brainmade.org">why</a>.</span>
</p>
