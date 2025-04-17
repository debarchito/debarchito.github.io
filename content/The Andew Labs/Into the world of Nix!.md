---
title: 1. Into the world of Nix!
date: 2025-02-22
draft: true
tags:
  - nix
---

### 1.1. Intro

I used [Homebrew](https://brew.sh/) as my primary package manager (along with
many _secondaries_ for specific use-cases) for a while after switching to Linux
([Pop!\_OS](https://pop.system76.com/)), but I’ve recently moved away from it.
It was great at first, offering every package I needed and ensuring they were
almost always up-to-date.

However, the honeymoon phase didn’t last for long. Many users regularly complain
about its slowness—while that’s true, it wasn’t the reason I decided to switch.
To be fair, it wasn't entirely Homebrew’s fault; my package management strategy
had been quite chaotic up to this point.

### 1.2. The chaos

I used [vfox](https://vfox.lhan.me/) (an alternative to
[asdf](https://asdf-vm.com/)) primarily to manage multiple versions of JDK
(OpenJDK and GraalVM), Node.js, and other programming languages. For Python and
anything conda-related, I relied on
[Miniforge](https://conda-forge.org/download/) and
[mamba](https://mamba.readthedocs.io/en/latest/). I used
[rustup](https://rust-lang.github.io/rustup/) for Rust and Homebrew for the
rest.

For GUI applications, I primarily used [Flatpak](https://flatpak.org/). Native
GUI apps (_apt_ + _nala_ as a frontend) were reserved for essentials like the
terminal emulator (_WezTerm_) and browser (_LibreWolf_). I preferred to minimize
my reliance on PPAs so I avoided using them whenever possible.

In the end there was **no harmony whatsoever!** I didn't even include the tools
I installed (and managed) through one-time scripts. It was a mess that needed to
be sorted.

### 1.3. A bit of story

I had known about Nix for a long time (thanks, _Cody_!). However, when I looked
it up, I found either glowing praise about how amazing it was or horror stories
about its cryptic error messages. The Nix language itself seemed quite
intimidating. But, I was eager to experience the unification dream—a single
source of truth for all my packages and configurations (yep). The declarative
and reproducible nature of Nix was a cherry on top.

This was around the time [System76](https://system76.com/) was conducting the
alpha test for the
[COSMIC Desktop Environment (DE)](https://system76.com/cosmic/) in Q4 of 2024.
COSMIC felt like a breath of fresh air (the right balance between beauty and
customization) and more importantly, had everything I wanted in a DE. The first
stable release was scheduled for Q1 or Q2 of 2025.

This felt like the perfect opportunity, as I had already decided to do a fresh
install when COSMIC was released. It seemed like the ideal opportunity to switch
to [NixOS](https://nixos.org/).

However, I was thoroughly enjoying my time with Pop!\_OS and wasn’t ready to
change my distro just yet. That decision effectively ruled out NixOS and the
only way forward was to use Nix in Pop!\_OS instead.

### 1.4. Listing what I wanted

After thinking about what I wanted from my package management setup, I came up
with a few key points:

- **Flatpak:** I decided to stick with Flatpak as my primary source for GUI
  applications while decoratively managing them using
  [nix-flatpak](https://github.com/gmodena/nix-flatpak/).
- **APT:** The sole purpose of using APT was to manage and upgrade existing
  system packages and install
  [proprietary fonts](https://github.com/debarchito/.dotfiles#usage/). This
  might change in the future, but for now, I opted not to include these fonts in
  my Nix setup since I don't always need them.
- **Nix**: I decided to use Nix for everything else, including all the tools I
  might need, the few native GUI applications I prefer not to install via
  Flatpak, and all my configurations. I opted to use
  [Home Manager](https://nix-community.github.io/home-manager/) to manage my
  user environment, and
  [System Manager](https://github.com/numtide/system-manager/) to manage some
  system packages, configure my `/etc` files and systemd services.

I essentially segregated my needs to maintain a clear separation between the
different types of packages and their purposes.

### 1.5. The journey begins: Installing Nix

> _This isn't a comprehensive Nix tutorial, though I might write one in the
> future. Common links include [NixOS Wiki](https://wiki.nixos.org) and
> [Nix Documentation](https://nix.dev)._

I went with the
[Determinate Nix Installer](https://github.com/DeterminateSystems/nix-installer?tab=readme-ov-file#determinate-nix-installer)
as it felt like the most straightforward way to get started with
[Nix Flakes](https://nix.dev/concepts/flakes.html) enabled out-of-the-box.

> Determinate also provides a seamless way to
> [uninstall Nix](https://github.com/DeterminateSystems/nix-installer?tab=readme-ov-file#uninstalling)
> just in case.

```sh
curl --proto '=https' --tlsv1.2 -sSf -L https://install.determinate.systems/nix | \
sh -s -- install
```

The installer is well-documented and the installation process was smooth. I was
up and running in no time.

### 1.6. Setting up Home Manager

[Home Manager](https://nix-community.github.io/home-manager/) was the next step.
It’s a tool that allows you to manage your (.)dotfiles and user environment
using Nix. I went with the Nix Flake based
[Standalone Setup](https://nix-community.github.io/home-manager/index.xhtml#sec-flakes-standalone).

> I like to keep all my configurations organized under `~/.dotfiles` and this is
> the assumption throughout this entry. You can opt for the default
> `~/.config/home-manager` directory or go with whatever works best for you.

The first step was to initialize Home Manager and it was rather straight forward
(the `.` means current directory):

```sh
# ~/.dotfiles ❯
nix run home-manager/master -- init .
```

I used the _master_ branch for Home Manager to stay consistent with my use of
the _unstable_ Nixpkgs channel. This step generates two files: `flake.nix` and
`home.nix`.

The content of the files looked something like this:

```nix
# flake.nix
{
  description = "A very basic flake";
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };
  outputs = { self, nixpkgs }: {
    packages.x86_64-linux.hello = nixpkgs.legacyPackages.x86_64-linux.hello;
    packages.x86_64-linux.default = self.packages.x86_64-linux.hello;
  };
}
```

```nix
# home.nix (comments purged for brevity)
{ config, pkgs, ... }:
{
  home.username = "<username>";
  home.homeDirectory = "/home/<username>";
  home.stateVersion = "24.11";
  home.packages = [/* ... */];
  home.file = {/* ... */};
  home.sessionVariables = {/* ... */};
  programs.home-manager.enable = true;
}
```

Whoa...that's a lot of code! But don't worry—we'll tidy things up in the next
section.

### 1.7. Modifying flake.nix

The `flake.nix` defines two primary sections: _inputs_ and _outputs_. The inputs
section specifies the sources in the flake. For instance, in the example
`inputs = { nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable"; };`, the
nixpkgs input points to the
[Nixpkgs repository hosted on GitHub](https://github.com/nixos/nixpkgs). The
_nixos-unstable_ branch is used here, containing the latest bleeding-edge
packages. However, since I'm not using NixOS, I prefer to switch to the
_nixpkgs-unstable_ branch for my flakes.

The outputs section specifies what the flake defines, such as packages,
overlays, or configurations. Refer to the [Nix Documentation](https://nix.dev)
for more information.

Let's dive into it:

```nix
{
  # Type out a cutesy description for your flake :D
  description = "I am a very nice flake!";
  inputs = {
    # Define the input sources for the flake
	# Format: github:nixos/nixpkgs/<branch>
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
    # Add the home-manager flake as an input
    home-manager = {
      url = "github:nix-community/home-manager";
      # Ensure that the flake follows nixpkgs...
      # ...to avoid any compatibility issues!
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };
  outputs =
    # All the inputs are available as arguments for the...
	# ...outputs function
	# And yes, outputs is a function..!
    { nixpkgs, home-manager }:
	# let-in-expr lets you define custom attributes that...
	# ...are accesible within a specific scope
    let
	  # Target your platform and architecture
      system = "x86_64-linux";
	  # Prepare packages for this specific system
      pkgs = import nixpkgs { inherit system; };
    in {
	  # Now, we define a Home Manager configuration
	  # <username> must be the same as the user you are targeting
      homeConfigurations.<username> = home-manager.lib.homeManagerConfiguration {
	    # Let Home Manager use the packages
	    inherit pkgs;
	    # We'll define our Home Manager configuration in home.nix
	    # So, let's include it here!
        modules = [
          ./home.nix
	    ];
      };
    };
}
```

### 1.8. Modifying home.nix

Let's dive into it:

```nix
# Ellipses are used when we are partially choosing entries from a set
# Remember the pkgs we inherited? We can import it as an argument here
{ pkgs, ... }:
{
  # Requires enabling 'cause we aren't using NixOS
  targets.genericLinux.enable = true;
  # Again, <username> must be the same as the user you are targeting
  home.username = "<username>";
  # Change it accordingly
  home.homeDirectory = "/home/<username>";
  # 25.05 cooresponds to unstable nixpkgs as of writing
  home.stateVersion = "25.05";
  # Packages here we come!
  home.packages = with pkgs; [
    # A handy task runner
    just
  ];
  # Or, without using the with-expr:
  # home.packages = [
  #   pkgs.just
  # ];
  # You can also utilize a let-in-expr in conjunction with...
  # ...a inherit-expr if you don't like with-expr polluting...
  # ...the scope
  # home.packages = let inherit (pkgs) just; in [
  #   just
  # ];
  # Allows Home Manager to update itself
  programs.home-manager.enable = true;
  # We can also enable other programs e.g. librewolf
  programs.librewolf.enable = true;
  imports = [
    # And, once again we can import other nix files here
	# e.g. our helix config (keep reading)
	./home/tools/helix.nix
  ];
}
```

[NixOS Search - Packages](https://search.nixos.org/packages) is your best friend
for finding packages in specific channels.

### 1.9. Managing configurations with Home Manager

Let's take a look into the [Helix Editor](https://helix-editor.com/) example.
The `~/.dotfiles` directory looks something like this:

```sh
.dotfiles/
├── home/
│   └── tools/
│       └── helix.nix
├── flake.nix
└── home.nix
```

The `~/.dotfiles/home/tools` directory is used purely for namespacing, and you
can structure this however you prefer. The content of `helix.nix` is as follows:

```nix
{
  # Enable Helix
  programs.helix.enable = true;
}
```

Now, you have two options: _either write the configuration in Nix_ or _link
non-Nix files to their respective locations_. Personally, I prefer the second
approach. It’s probably a good way to start, and then you can gradually
transition your configurations to Nix over time.

In our case, Helix configuration is written in [TOML](https://toml.io/en).
Specifically, the configuration is stored in `config.toml` under the
`~/.config/helix` directory. Instead of adding the configuration directly, we'll
have Home Manager orchestrate it, keeping the config neatly under `~/.dotfiles`.
So, we create a new file `~/.dotfiles/home/tools/helix/config.toml` (again
name-spacing!), where we put out configuration:

```toml
# Best theme ever
theme = "catppuccin_mocha"

[editor]
# I like relative line-numbers!
line-number = "relative"
```

That should be more than enough for a quick demonstration. Now, we can modify
`helix.nix` with:

```nix
{
  # Enable Helix
  programs.helix.enable = true;
  # Put the local config.toml in the correct place
  # Good 'ol XDG standards to the rescue
  xdg.configFile."helix/config.toml".source = ./helix/config.toml;
}
```

<p xmlns:cc="http://creativecommons.org/ns#" >This work is licensed under <a href="https://creativecommons.org/licenses/by/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">CC BY 4.0<img style="height:18px!important;margin-left:3px;vertical-align:middle;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1" alt=""><img style="height:18px!important;margin-left:3px;vertical-align:middle" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1" alt=""></a></p>

<a href="https://brainmade.org"><img src="https://brainmade.org/black-logo.png" alt="brainmade" width="160" height="50" /></a>

> [!info] Footnotes
>
> - **LLM Contribution:** _None_. [[Why BRAINMADE.ORG?]]
