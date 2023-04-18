# shell.nix is for vscode Environment
# this is for manually running the dev server for testing

{ pkgs ? import <nixpkgs> {} }: with pkgs;

let
  python = python310;
  pypkgs = python310Packages;
  pillow = pypkgs.pillow;
  django = pypkgs.django_4;
  crispy_forms = pypkgs.django-crispy-forms;

in
  mkShell {
    name = "django4-pillow-crispy-env";
    buildInputs = [ 
      python 
      pillow
      django 
      crispy_forms 
    ];

    shellHook = ''
        python manage.py runserver 0.0.0.0:1234
    '';

  }
