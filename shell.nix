
{ pkgs ? import <nixpkgs> {} }: with pkgs;

let
  python = python310;
  pypkgs = python310Packages;
  pillow = pypkgs.pillow;
  django = pypkgs.django_4;
  crispy_forms = pypkgs.django-crispy-forms;

in
  mkShell {
    name = "django4-pillow-crispy";
    buildInputs = [ 
      python 
      pillow
      django 
      crispy_forms 
    ];
  }
