# Working with preprocessors

With LiveStyle, you can use LESS and SCSS (no SASS dialect yet) for bi-directional editing. Use them [the same way as CSS files](/docs/using-livestyle/): open `.less` or `.scss` files in editor and associate them with browser files in Google Chrome extension popup. But first you should learn a few very important things about preprocessor support.

The most important is:

> LiveStyle uses it’s own implementation of LESS and SCSS preprocessors.

Although these implementations are heavily tested with official unit tests, some things may not work as you expect and some features are missing. If you find something that doesn’t work right, please [report it](/docs/troubleshooting/).

## Adding dependencies

When live editing preprocessor stylesheets, LiveStyle automatically parses and uses `@import`’ed files. Unlike in original preprocessors, LiveStyle doesn’t include their contents into current stylesheet but uses them as a source of variables and mixins. This is a subject for discussion and may change in future, but for now including `@import`’ed content looks like an overhead that reduces performance.

Many developers use code libraries that included elsewhere and assume they are available for every single stylesheet in current project. For example, a Twitter Bootstrap has a [`variables.less`](https://github.com/twbs/bootstrap/blob/v3.3.5/less/variables.less) file, which is included in aggregating [`bootstrap.less`](https://github.com/twbs/bootstrap/blob/v3.3.5/less/bootstrap.less) file. So modules like [`buttons.less`](https://github.com/twbs/bootstrap/blob/v3.3.5/less/buttons.less) simply assume that data from `variables.less` will be available at compile time and they doesn’t explicitly `@import` it.

In order to let LiveStyle know about such “assumed” modules or any other globals, you need to add them as a *global dependencies* of your current project. You can do so in Sublime Text 3 only by adding `globals` array into `livestyle` section of [Project file](http://www.sublimetext.com/docs/3/projects.html):

```
{
    ...
    "livestyle": {
        "globals": ["./less/variables.less", "/path/to/global/mixins.less"]
    }
}
```

After that, when you edit any stylesheet of you current project, all files listed in `globals` section will be used for resolving variables and mixins.

### “Safe patching” mode

LiveStyle uses a so-called “Safe Patching” mode in order to apply changes to preprocessor stylesheet coming from broswer. 

Let’s consider the following example. You may have the following LESS stylesheet:

```less
@a: 100px;
@b: 50px;
div {
    width: @a;
}
```

...which compiles into the following browser stylesheet:

```css
div {
    width: 100px;
}
```

Now, when you set `width` property to `50px` in DevTools, how the original LESS stylesheet should be updated? Possible values are:

* `width: 50px;` — simply override original expression with incoming static value; too stupid and may lead to broken visual styles and hard-to-find errors.
* `@a: 50px;` — override variable value that produced `width` property value; most likely will break your code in other places.
* `width: @b;` — use another variable that resolves to the same incoming value; will likely introduce errors in future.
* `width: @a / 2;` — maybe you need a half of original variable?
* `width: @a - @b;` — ...or this?
* millions of other valid combinations.

Of course, the simplest solution for LiveStyle would be to replace preprocessor value with updated one, e.g. `width: 50px;`. But this is also the most dangerous way to update original stylesheet because *you will loose variable reference*. You no longer can be ensured that changing `@a` variable value will properly update visual style of your page.

LiveStyle tries to be smart in such cases and applies the safest update: it simply adds or removes difference between previous and current value. In this case, it will update your LESS file to `width: @a - 50;`: it still keeps reference to `@a` and it’s easier for you as stylesheet author to spot these changes later and update stylesheet as required. The “safe patching” works for numbers and colors.

Another part of “safe patching” mode is updating properties generates by mixins. For example, if you have the following SCSS code:

```scss
@mixin foo {
    width: 100px;
}

.bar {
    @include foo;
    color: red;
}
```

...and in DevTools you set `width: 50px;` in `.bar` rule, LiveStyle will produce the following result:

```scss
@mixin foo {
    width: 100px;
}

.bar {
    @include foo;
    color: red;
    width: 50px;
}
```

While LiveStyle can perfectly trace the `width` property up its `@mixin foo` origin, changing property inside mixin considered unsafe: this may break visual style of other rules that depend on `foo` mixin and you may not even notice it.