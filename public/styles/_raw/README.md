# AI Style Match — guide images

Each face shape uses ONE full guide image (the whole composite: face + shape
description + the recommended looks, exactly like the generated images).

Save them directly here, with these EXACT paths/names:

```
public/styles/female/oval.jpg        public/styles/male/oval.jpg
public/styles/female/round.jpg       public/styles/male/round.jpg
public/styles/female/square.jpg      public/styles/male/square.jpg
public/styles/female/heart.jpg       public/styles/male/heart.jpg
public/styles/female/oblong.jpg      public/styles/male/oblong.jpg
public/styles/female/diamond.jpg     public/styles/male/diamond.jpg
public/styles/female/triangle.jpg    public/styles/male/triangle.jpg
```

(.jpg recommended; .png/.webp also work if you rename the lookup, but jpg keeps
it simple.)

That's it — no cropping. The result page shows the whole image for the detected
shape, and falls back to the built-in vector portraits for any shape that
doesn't have an image yet.
