# Academic CV

The CV is authored in XeLaTeX. Its content lives in `cv-content.tex`; reusable layout and formatting commands live in `Academic_CV.tex`.

Build it from this directory with:

```sh
latexmk -xelatex Academic_CV.tex
```

Clean generated build files with:

```sh
latexmk -c Academic_CV.tex
```

The source prefers Calibri to match the original Word document and falls back to Carlito when Calibri is unavailable. The website's published PDF in `assets/pdf/Academic_CV.pdf` is intentionally separate, so this version can be reviewed before replacing it.
