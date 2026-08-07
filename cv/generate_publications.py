#!/usr/bin/env python3
"""Generate the CV publication section from the website BibTeX database."""

from __future__ import annotations

import re
from pathlib import Path


CV_DIR = Path(__file__).resolve().parent
BIB_PATH = CV_DIR.parent / "_bibliography" / "papers.bib"
OUTPUT_PATH = CV_DIR / "cv-publications.tex"


SECTIONS = (
    (
        "Lead Author",
        (
            ("1", "dillavou_double_descent_2025"),
            ("2", "dillavou_physical_reinforcement_2025"),
            ("3", "dillavou_imperfection_2025"),
            ("4", "hanlan_cornerstones_2024"),
            ("5", "hathcock_stochastic_2023"),
            ("6", "dillavou_harnessing_2024"),
            ("7", "dillavou_machine_2024"),
            ("8", "dillavou_bellybutton_2024"),
            ("9", "dillavou_quality_2022"),
            ("10", "dillavou_demonstration_2022"),
            ("11", "dillavou_shear_2020"),
            ("12", "dillavou_virtual_2019"),
            ("13", "dillavou_nonmonotonic_2018"),
        ),
    ),
    (
        "Additional",
        (
            ("14", "murphy_comparing_2024"),
            ("15", "gerra_equation_2024a"),
            ("16", "martin_calculations_2024"),
            ("17", "stern_training_2024"),
            ("18", "steinhardt_seismological_2023"),
            ("19", "srivastava_imitation_2023"),
            ("20", "pasquet_aqueous_2023"),
            ("21", "durian_spatters_2022"),
            ("22", "wycoff_desynchronous_2022"),
            ("23", "stern_physical_2022"),
            ("24", "zheng_air_2021"),
            ("25", "pilvelait_influences_2020"),
            ("26", "silverberg_anatomic_2013"),
        ),
    ),
    (
        "Conference Workshop Proceedings",
        (
            ("a", "dillavou_nonlinear_2023"),
            ("b", "stern_contrastive_power_2023"),
            ("c", "dillavou_circuits_2023"),
            ("d", "stern_out_of_equilibrium_2021"),
        ),
    ),
    ("Patents", (("P", "dillavou_coupled_networks_2025"),)),
)


EQUAL_CONTRIBUTORS = {
    "dillavou_imperfection_2025": {0, 1},
    "hanlan_cornerstones_2024": {0, 1},
    "hathcock_stochastic_2023": {0, 1},
    "dillavou_machine_2024": {4, 5},
    "gerra_equation_2024a": {0, 1},
}

UNDERGRADUATE_CONTRIBUTORS = {
    "dillavou_double_descent_2025": {2},
    "dillavou_machine_2024": {1},
    "gerra_equation_2024a": {0, 1},
    "dillavou_nonlinear_2023": {1},
    "dillavou_circuits_2023": {1},
    "durian_spatters_2022": {0, 2, 3},
    "steinhardt_seismological_2023": {2},
    "wycoff_desynchronous_2022": {0},
    "pilvelait_influences_2020": {0},
    "silverberg_anatomic_2013": {1},
}

AUTHOR_OVERRIDES = {
    "dillavou_harnessing_2024": r"(Perspective) \me",
    "srivastava_imitation_2023": r"A Srivastava … \me\ … Z Wu (100s of authors)",
    "pasquet_aqueous_2023": r"M Pasquet, … AT Chieco, \me, JM Hanlan, DJ Durian, E Rio, A Salonen, D Langevin",
    "dillavou_shear_2020": r"\me\ and SM Rubinstein",
    "dillavou_nonmonotonic_2018": r"\me\ and SM Rubinstein",
}

VENUE_OVERRIDES = {
    "dillavou_demonstration_2022": "Editor’s Choice, Physical Review Applied, 2022",
    "dillavou_nonmonotonic_2018": "Editor’s Choice, Physical Review Letters, 2018",
    "dillavou_nonlinear_2023": r"NeurIPS ML with New Compute Paradigms Workshop, 2023",
    "stern_contrastive_power_2023": r"NeurIPS ML with New Compute Paradigms Workshop, 2023",
    "dillavou_circuits_2023": r"Proceedings SPIE, AI \& Optical Data Sciences IV, 2023",
    "stern_out_of_equilibrium_2021": r"NeurIPS ML \& the Physical Sciences Workshop, 2021",
    "dillavou_coupled_networks_2025": "US Patent 12462202 B2, 2025",
}

LINK_OVERRIDES = {
    "dillavou_nonlinear_2023": "https://openreview.net/attachment?id=4P65OwisG9&name=pdf",
    "murphy_comparing_2024": "https://openreview.net/pdf?id=adhsMqURI1",
}

JOURNAL_SHORT_NAMES = {
    "Proceedings of the National Academy of Sciences": "PNAS",
    "Transactions on Machine Learning Research": "Transactions on ML Research",
    "The Journal of Chemical Physics": "Journal of Chemical Physics",
    "Journal of Cultural Cognitive Science": "J of Cultural Cognitive Science",
    "Journal of Orthopaedic Research": "J Orthopaedic Res",
}


def parse_bibtex(path: Path) -> dict[str, dict[str, str]]:
    """Parse the brace-delimited fields used by this repository's BibTeX file."""

    text = path.read_text(encoding="utf-8")
    start_pattern = re.compile(r"@(\w+)\s*\{\s*([^,\s]+)\s*,", re.MULTILINE)
    entries: dict[str, dict[str, str]] = {}
    position = 0

    while match := start_pattern.search(text, position):
        entry_type, key = match.group(1).lower(), match.group(2)
        depth = 1
        cursor = match.end()
        while cursor < len(text) and depth:
            if text[cursor] == "{":
                depth += 1
            elif text[cursor] == "}":
                depth -= 1
            cursor += 1
        if depth:
            raise ValueError(f"Unclosed BibTeX entry: {key}")

        body = text[match.end() : cursor - 1]
        fields = _parse_fields(body, key)
        fields["entrytype"] = entry_type
        fields["key"] = key
        entries[key] = fields
        position = cursor

    return entries


def _parse_fields(body: str, key: str) -> dict[str, str]:
    fields: dict[str, str] = {}
    cursor = 0

    while cursor < len(body):
        while cursor < len(body) and (body[cursor].isspace() or body[cursor] == ","):
            cursor += 1
        if cursor >= len(body):
            break

        name_match = re.match(r"([A-Za-z][\w-]*)\s*=\s*", body[cursor:])
        if not name_match:
            snippet = body[cursor : cursor + 40].replace("\n", " ")
            raise ValueError(f"Could not parse field in {key}: {snippet}")
        name = name_match.group(1).lower()
        cursor += name_match.end()

        if body[cursor] == "{":
            value, cursor = _read_balanced(body, cursor, "{", "}")
        elif body[cursor] == '"':
            value, cursor = _read_quoted(body, cursor)
        else:
            end = body.find(",", cursor)
            if end == -1:
                end = len(body)
            value = body[cursor:end].strip()
            cursor = end
        fields[name] = value.strip()

    return fields


def _read_balanced(text: str, start: int, opening: str, closing: str) -> tuple[str, int]:
    depth = 1
    cursor = start + 1
    value_start = cursor
    while cursor < len(text) and depth:
        if text[cursor] == opening:
            depth += 1
        elif text[cursor] == closing:
            depth -= 1
        cursor += 1
    if depth:
        raise ValueError("Unclosed braced BibTeX value")
    return text[value_start : cursor - 1], cursor


def _read_quoted(text: str, start: int) -> tuple[str, int]:
    cursor = start + 1
    value_start = cursor
    while cursor < len(text):
        if text[cursor] == '"' and text[cursor - 1] != "\\":
            return text[value_start:cursor], cursor + 1
        cursor += 1
    raise ValueError("Unclosed quoted BibTeX value")


def bibtex_to_text(value: str) -> str:
    replacements = {
        r"{\'e}": "é",
        r"{\'E}": "É",
        r'{\"o}': "ö",
        r'{\"O}': "Ö",
        r"{\`e}": "è",
        r"{\~n}": "ñ",
    }
    for source, target in replacements.items():
        value = value.replace(source, target)
    value = value.replace("``", "“").replace("''", "”")
    return value.replace("{", "").replace("}", "").strip()


def tex_escape(value: str) -> str:
    value = bibtex_to_text(value)
    value = value.replace("\\&", "&")
    for source, target in (("&", r"\&"), ("%", r"\%"), ("#", r"\#"), ("_", r"\_")):
        value = value.replace(source, target)
    return value


def format_author_name(name: str) -> str:
    clean_name = bibtex_to_text(name)
    if "," in clean_name:
        last, given = (part.strip() for part in clean_name.split(",", 1))
    else:
        parts = clean_name.split()
        given, last = " ".join(parts[:-1]), parts[-1]

    if last == "Dillavou" and given.startswith("Sam"):
        return r"\me"

    initials = "".join(
        match.group(0).upper()
        for token in re.split(r"[\s-]+", given)
        if (match := re.search(r"[A-Za-z]", token))
    )
    return f"{initials} {tex_escape(last)}".strip()


def format_authors(key: str, entry: dict[str, str]) -> str:
    if key in AUTHOR_OVERRIDES:
        return AUTHOR_OVERRIDES[key]

    authors = re.split(r"\s+and\s+", entry["author"])
    formatted = []
    for index, author in enumerate(authors):
        display = format_author_name(author)
        if index in EQUAL_CONTRIBUTORS.get(key, set()):
            display += r"\equalcontrib"
        if index in UNDERGRADUATE_CONTRIBUTORS.get(key, set()):
            display += r"\undergrad"
        formatted.append(display)
    return ", ".join(formatted)


def format_venue(key: str, entry: dict[str, str]) -> str:
    if key in VENUE_OVERRIDES:
        return VENUE_OVERRIDES[key]

    entry_type = entry["entrytype"]
    year = bibtex_to_text(entry.get("year", ""))
    if entry_type == "preprint":
        return f"arXiv {bibtex_to_text(entry['arxiv'])}"

    if entry_type in {"article", "misc"}:
        journal = bibtex_to_text(entry.get("journal", ""))
        journal = JOURNAL_SHORT_NAMES.get(journal, journal)
        if entry.get("pubstate", "").lower() == "inpress":
            return f"{journal}, in press, {year}"
        return ", ".join(part for part in (journal, year) if part)

    if entry_type == "inproceedings":
        booktitle = tex_escape(entry.get("booktitle", ""))
        return ", ".join(part for part in (booktitle, year) if part)

    if entry_type == "patent":
        number = bibtex_to_text(entry.get("number", ""))
        return ", ".join(part for part in (number, year) if part)

    raise ValueError(f"Unsupported entry type for {key}: {entry_type}")


def format_link(key: str, entry: dict[str, str]) -> str:
    link = LINK_OVERRIDES.get(key)
    if not link:
        link = entry.get("url") or entry.get("html")
    if not link and entry.get("doi"):
        link = f"https://doi.org/{entry['doi']}"
    if not link and entry.get("arxiv"):
        link = f"https://arxiv.org/abs/{entry['arxiv']}"
    if not link:
        raise ValueError(f"No CV link available for {key}")
    return tex_escape(link)


def render(entries: dict[str, dict[str, str]]) -> str:
    requested_keys = [key for _, section in SECTIONS for _, key in section]
    missing = [key for key in requested_keys if key not in entries]
    if missing:
        raise ValueError(f"CV entries missing from {BIB_PATH}: {', '.join(missing)}")

    lines = [
        "% Generated by generate_publications.py from ../_bibliography/papers.bib.",
        "% Do not edit this file by hand.",
        r"\cvsectionnote{Publications}{\equalcontrib\ equal contribution\quad\undergrad\ work performed as an undergraduate}",
    ]
    for section_name, section_entries in SECTIONS:
        lines.append(rf"\cvpubsubsection{{{section_name}}}")
        for label, key in section_entries:
            entry = entries[key]
            lines.append(
                rf"\pubentry{{{label}}}"
                rf"{{{format_authors(key, entry)}}}"
                rf"{{{tex_escape(entry['title'])}}}"
                rf"{{{format_venue(key, entry)}}}"
                rf"{{{format_link(key, entry)}}}"
            )
        lines.append("")
    return "\n".join(lines).rstrip() + "\n"


def main() -> None:
    OUTPUT_PATH.write_text(render(parse_bibtex(BIB_PATH)), encoding="utf-8")
    print(f"Generated {OUTPUT_PATH.relative_to(CV_DIR.parent)}")


if __name__ == "__main__":
    main()
