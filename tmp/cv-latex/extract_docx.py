#!/usr/bin/env python3
"""Extract ordered text, hyperlinks, and basic paragraph metadata from a DOCX."""

from __future__ import annotations

import json
import sys
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET


W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
R = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"
REL = "{http://schemas.openxmlformats.org/package/2006/relationships}"


def relationships(archive: zipfile.ZipFile, path: str) -> dict[str, str]:
    try:
        root = ET.fromstring(archive.read(path))
    except KeyError:
        return {}
    return {
        node.attrib["Id"]: node.attrib.get("Target", "")
        for node in root.findall(f"{REL}Relationship")
    }


def run_text(node: ET.Element) -> str:
    chunks: list[str] = []
    for child in node.iter():
        if child.tag == f"{W}t":
            chunks.append(child.text or "")
        elif child.tag == f"{W}tab":
            chunks.append("\t")
        elif child.tag in {f"{W}br", f"{W}cr"}:
            chunks.append("\n")
    return "".join(chunks)


def paragraph_data(p: ET.Element, rels: dict[str, str]) -> dict[str, object]:
    ppr = p.find(f"{W}pPr")
    style = None
    if ppr is not None:
        style_node = ppr.find(f"{W}pStyle")
        if style_node is not None:
            style = style_node.attrib.get(f"{W}val")

    segments: list[dict[str, object]] = []
    text_chunks: list[str] = []
    for child in p:
        if child.tag == f"{W}hyperlink":
            label = run_text(child)
            rid = child.attrib.get(f"{R}id")
            anchor = child.attrib.get(f"{W}anchor")
            target = rels.get(rid or "") or (f"#{anchor}" if anchor else "")
            segments.append({"text": label, "url": target or None})
            text_chunks.append(label)
        elif child.tag in {f"{W}r", f"{W}smartTag", f"{W}sdt", f"{W}fldSimple"}:
            label = run_text(child)
            if label:
                segments.append({"text": label, "url": None})
                text_chunks.append(label)

    return {"style": style, "text": "".join(text_chunks), "segments": segments}


def extract_part(archive: zipfile.ZipFile, xml_path: str, rels_path: str) -> list[dict[str, object]]:
    root = ET.fromstring(archive.read(xml_path))
    rels = relationships(archive, rels_path)
    result: list[dict[str, object]] = []
    for p in root.iter(f"{W}p"):
        result.append(paragraph_data(p, rels))
    return result


def main() -> None:
    source = Path(sys.argv[1]).resolve()
    output = Path(sys.argv[2]).resolve()
    with zipfile.ZipFile(source) as archive:
        data: dict[str, object] = {
            "source": str(source),
            "document": extract_part(
                archive,
                "word/document.xml",
                "word/_rels/document.xml.rels",
            ),
        }
        for name in archive.namelist():
            if name.startswith("word/header") and name.endswith(".xml"):
                rel_path = "word/_rels/" + Path(name).name + ".rels"
                data[name] = extract_part(archive, name, rel_path)
            elif name.startswith("word/footer") and name.endswith(".xml"):
                rel_path = "word/_rels/" + Path(name).name + ".rels"
                data[name] = extract_part(archive, name, rel_path)
    output.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")


if __name__ == "__main__":
    main()
