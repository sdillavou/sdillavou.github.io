.PHONY: all clean

all: Academic_CV.pdf

cv-publications.tex: ../_bibliography/papers.bib generate_publications.py
	python3 generate_publications.py

Academic_CV.pdf: Academic_CV.tex cv-content.tex cv-publications.tex
	latexmk -xelatex Academic_CV.tex

clean:
	latexmk -c Academic_CV.tex
	$(RM) Academic_CV.xdv
