# Drop your AI-generated style composites here

Generate one image per face shape (each a 3-up: the shape's 3 recommended cuts
side by side), then save them here with these EXACT names:

```
male-oval.png       female-oval.png
male-round.png      female-round.png
male-square.png     female-square.png
male-heart.png      female-heart.png
male-oblong.png     female-oblong.png
male-diamond.png    female-diamond.png
male-triangle.png   female-triangle.png
```

(.png, .jpg, .jpeg or .webp all fine.)

Then run:  `node scripts/crop-styles.mjs`

That slices each 3-up into 3 cells and writes them to
`public/styles/{gender}/{shape}-0.jpg`, `-1.jpg`, `-2.jpg`,
which the AI Style Match cards pick up automatically.
