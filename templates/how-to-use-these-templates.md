# How this template system works

## Deprecated! Use the include tag as well!

The main idea here is to only have the html boilerplate in one place that will be used globally.

The logic is this:

- Start with a base boilerplate html.
- then overwrite all the site-wide blocks from top to bottom
- then have a simple starting template called `base.html` that is used as the starting point for all other apps.

## Note

If a new block is added to the `boilerplate.html`, then the below `Order of Templates` needs to be updated.

## Order of templates

1. `boilerplate.html`
1. `favicon.html`
1. `style.html`
1. `navbar.html`
1. `footer.html`
1. `base.html`
