# Reference CV design distillation

## Source and page system

- Reference: `Academic_CV.docx` (SHA-256 `ec5a78486d45c0b0c34e53a9b6d624c5207b4861317efa4d467c3a2fda6b09bd`).
- Six US Letter portrait pages with 1-inch margins on every side.
- One continuous section; no special first page.
- Running header: `Sam Dillavou, Ph.D.` at left and `dillavou@sas.upenn.edu` at right, medium gray.
- Running footer: centered `N of 6`; `Updated 7/26` at lower right, medium gray.

## Typography and color

- Calibri throughout, approximately 10–11 pt body copy with compact leading.
- Name/header is approximately 14–16 pt.
- Major headings are uppercase, bold, approximately 17 pt, followed by a black horizontal rule.
- Subheadings are bold, approximately 11 pt; talk/press category labels are underlined.
- Body copy is black. Dates, affiliations, and right-column metadata are gray.
- Linked publication venues and linked titles are blue.
- Publication legend and markers use red for equal contribution and orange for undergraduate work.
- Award values use orange emphasis.

## Spacing and alignment

- Dense academic-CV rhythm with minimal paragraph spacing and no paragraph indentation.
- Major sections have a small gap above and below their ruled headings.
- Most records use a flexible left column and a right-aligned date, venue, or value column.
- Research-experience topic lines are indented below their role.
- Publication entries use hanging labels (`[1]`, `[2]`, … and `[a]`, `[b]`, …), bold the CV author's name, italicize titles, and place linked venue/preprint metadata in blue.
- Research mentorship uses four aligned columns: name, career stage/university, coauthored-publication references, and years.
- Presentations and press use a flexible title column with a gray right-aligned event/publication column.

## Content architecture

1. Education
2. Research Experience
3. Funding and Awards
4. Publications
   - Lead Author
   - Additional
   - Conference Workshop Proceedings
   - Patents
   - Software Packages Authored
5. Teaching and Mentoring Experience
   - Research Mentorship
   - Teaching
   - Short Courses / Workshops / Tutoring
   - Pedagogical Training
6. Presentations and Press
   - Invited Talks
   - Selected Press
   - Contributed Talks
   - Posters/Rapid Talks
7. Professional Service
   - Journal Referee
   - Outreach
   - Professional Membership
   - Miscellaneous

## Fidelity priorities for the LaTeX implementation

- Preserve all source text and live hyperlinks from the Word document.
- Preserve six-page pagination where practical, while avoiding clipped or overlapping text.
- Prefer stable, editable macros and tables over manual horizontal spacing.
- Keep the existing Word-generated website PDF unchanged until the LaTeX rendering is approved.
