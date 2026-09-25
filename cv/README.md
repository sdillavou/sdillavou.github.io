# Academic CV

The CV is authored in XeLaTeX. Its content lives in `cv-content.tex`; reusable layout and formatting commands live in `Academic_CV.tex`. Publication metadata is shared with the website through `../_bibliography/papers.bib` and rendered into `cv-publications.tex`.

Regenerate the publication section and build the CV from this directory with:

```sh
make
```

Do not edit `cv-publications.tex` directly. Publication ordering and CV-specific annotations are configured in `generate_publications.py`; titles, authors, venues, years, and links come from the shared BibTeX file.

Journal and workshop papers share the Lead Author and Additional lists. In `cv-content.tex`, reference a publication with `\cvpubref{bibtex_key}` rather than a literal number. The generated publication section supplies its current number and PDF destination, keeping mentoring and software references synchronized when the lists change.

Clean generated build files with:

```sh
make clean
```

The source prefers Calibri to match the original Word document and falls back to TeX Gyre Heros when Calibri is unavailable. The website's published PDF in `assets/pdf/Academic_CV.pdf` is intentionally separate, so this version can be reviewed before replacing it.
