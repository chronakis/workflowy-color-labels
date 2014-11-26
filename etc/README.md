# Notes

## Knowledge sources

### Extracting percieved brightness for colour

[Excellent algorithm](http://www.nbdtech.com/Blog/archive/2008/04/27/Calculating-the-Perceived-Brightness-of-a-Color.aspx). In a nutshell:

```
function Brightness(R, G, B)
{
   return (int)Math.Sqrt(
      R * R * .241 + 
      G * G * .691 + 
      B * B * .068);
}
```

You can use the following to extract an rgb:
```
function getRGB(jElm) {
    var res = [];
    jElm.css("backgroundColor")
    .replace(/\s*rgba?\((.*)\)/, "$1")
    .split(/\s*,\s*/)
    .forEach(function(i) {
        res.push(parseInt(i));
    });
    return res;
}

// jquery will return:
// If there was no color set yet, in chrome:  "rgba(r, g, b, a)" (actually "rgba(0, 0, 0, 0)")
// If there is a color and it was set as hex: "rgb(r, g, b)"
// Our function will return either [r, g, b, a] or [r, g, b]. All as integers


```

