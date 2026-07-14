#!/usr/bin/env python3
"""Sync portal .cursor SSOT (platform + legacy shared, or full FE harness) to platform-bases.

Source: portal/.cursor/{skills,rules,extracts} + scripts/cursor-export-kilo
Targets: siblings in platform-repos defaultGroup (excludes portal).

Profiles:
  full   — FE/fullstack bases: overlay all portal skills/rules/extracts (keep sibling-only)
  shared — BE/tooling: only platform + legacy skill/rule/extract groups

Also: remove legacy platform-ai/, retarget gitignore to commit .cursor/, copy export scripts.
"""
from __future__ import annotations

import json
import re
import shutil
from pathlib import Path

PORTAL = Path("/home/vutv/workspace/portal")
WS = PORTAL.parent
SRC_CURSOR = PORTAL / ".cursor"

# Shared across all bases — platform DNA + legacy lane
SHARED_SKILLS = (
    "platform-ai",
    "platform-base",
    "platform-mark",
    "artifactgraph",
    "legacy-spec",
    "flow-trace",
    "update-spec-legacy",
)
SHARED_RULES = (
    "platform-ai.mdc",
    "platform-contract-naming.mdc",
    "platform-code-size.mdc",
    "codegraph.mdc",
    "artifactgraph.mdc",
)
SHARED_EXTRACT_PATHS = (
    "core",
    "legacy",
    "flow-trace.md",
    "legacy-trace.md",
    "platform-mark.md",
    "platform-mark-detect.md",
    "artifactgraph-phase-hooks.md",
    "artifact-graph.md",
    "feature-artifact.md",
)

# dirname under workspace → profile
PROFILES: dict[str, str] = {
    "nextjs": "full",
    "nuxt_nest": "full",
    "next_nest": "full",
    "fast-api-base": "shared",
    "api": "shared",
    "integration": "shared",
    "line": "shared",
    "artifactgraph": "shared",
}

GITIGNORE_MIRROR_RE = re.compile(
    r"\n?# platform-ai-link mirror.*?(?=\n# |\nplatform-repos|\nlegacy-repos|\Z)",
    re.S,
)
GITIGNORE_CURSOR_SSOT = """
# Optional Kilo export (SSOT: .cursor/skills|rules|extracts — ./scripts/cursor-export-kilo)
.kilo/skills/
.kilo/instructions/
.kilo/extracts/
.kilo/command/
"""


def load_bases() -> list[str]:
    doc = json.loads((PORTAL / "platform-repos.json").read_text(encoding="utf-8"))
    group = doc["defaultGroup"]
    ids = doc["groups"][group]["projects"]
    out: list[str] = []
    for pid in ids:
        proj = doc["projects"][pid]
        root = proj["root"]
        if root in (".", "./"):
            continue  # portal
        # ../name → name
        name = Path(root).name
        if name and name not in out:
            out.append(name)
    return out


def rsync_tree(src: Path, dst: Path) -> None:
    if not src.exists():
        return
    dst.parent.mkdir(parents=True, exist_ok=True)
    if src.is_dir():
        if dst.exists():
            shutil.rmtree(dst)
        shutil.copytree(src, dst)
    else:
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dst)


def overlay_file(src: Path, dst: Path) -> None:
    if not src.exists():
        return
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dst)


def sync_skills(src_skills: Path, dst_skills: Path, names: tuple[str, ...] | None) -> int:
    dst_skills.mkdir(parents=True, exist_ok=True)
    count = 0
    for child in sorted(src_skills.iterdir()):
        if not child.is_dir():
            continue
        if names is not None and child.name not in names:
            continue
        rsync_tree(child, dst_skills / child.name)
        count += 1
    return count


def sync_rules(src_rules: Path, dst_rules: Path, names: tuple[str, ...] | None) -> int:
    dst_rules.mkdir(parents=True, exist_ok=True)
    count = 0
    for child in sorted(src_rules.iterdir()):
        if not child.is_file():
            continue
        if names is not None and child.name not in names:
            continue
        overlay_file(child, dst_rules / child.name)
        count += 1
    return count


def sync_extracts_full(src: Path, dst: Path) -> int:
    """Overlay all portal extract files; keep sibling-only paths."""
    dst.mkdir(parents=True, exist_ok=True)
    n = 0
    for path in src.rglob("*"):
        if path.is_dir():
            continue
        rel = path.relative_to(src)
        overlay_file(path, dst / rel)
        n += 1
    return n


def sync_extracts_shared(src: Path, dst: Path) -> int:
    dst.mkdir(parents=True, exist_ok=True)
    n = 0
    for rel in SHARED_EXTRACT_PATHS:
        p = src / rel
        if not p.exists():
            continue
        if p.is_dir():
            for f in p.rglob("*"):
                if f.is_file():
                    overlay_file(f, dst / f.relative_to(src))
                    n += 1
        else:
            overlay_file(p, dst / rel)
            n += 1
    # Merge registry bundles we care about
    n += merge_registry_bundles(src / "extract-registry.json", dst / "extract-registry.json")
    return n


def merge_registry_bundles(src_reg: Path, dst_reg: Path) -> int:
    if not src_reg.exists():
        return 0
    src = json.loads(src_reg.read_text(encoding="utf-8"))
    if dst_reg.exists():
        dst = json.loads(dst_reg.read_text(encoding="utf-8"))
    else:
        dst = {"version": src.get("version", 1), "bundles": {}}
    dst.setdefault("bundles", {})
    keys = (
        "core",
        "flow-trace",
        "legacy-spec",
        "platform-ai",
        "platform-mark",
        "update-spec-legacy",
    )
    changed = 0
    for k in keys:
        if k in src.get("bundles", {}):
            dst["bundles"][k] = src["bundles"][k]
            changed += 1
    # Force .cursor/extracts/ paths (not platform-ai/)
    text = json.dumps(dst, indent=2, ensure_ascii=False) + "\n"
    text = text.replace("platform-ai/extracts/", ".cursor/extracts/")
    dst_reg.parent.mkdir(parents=True, exist_ok=True)
    dst_reg.write_text(text, encoding="utf-8")
    return changed


def retarget_platform_ai_paths(cursor: Path) -> int:
    n = 0
    for p in list(cursor.rglob("*.md")) + list(cursor.rglob("*.mdc")) + list(cursor.rglob("*.json")):
        t = p.read_text(encoding="utf-8")
        t2 = (
            t.replace("platform-ai/extracts/", ".cursor/extracts/")
            .replace("platform-ai/skills/", ".cursor/skills/")
            .replace("platform-ai/rules/", ".cursor/rules/")
        )
        if t2 != t:
            p.write_text(t2, encoding="utf-8")
            n += 1
    return n


def fix_gitignore(root: Path) -> bool:
    gi = root / ".gitignore"
    if not gi.exists():
        return False
    text = gi.read_text(encoding="utf-8")
    original = text
    if "platform-ai-link mirror" in text or ".cursor/skills/" in text:
        text2, n = GITIGNORE_MIRROR_RE.subn("\n" + GITIGNORE_CURSOR_SSOT.strip() + "\n", text)
        if n:
            text = text2
        else:
            # Fallback: strip cursor ignore lines individually
            lines = []
            skip_block = False
            for line in text.splitlines(keepends=True):
                if "platform-ai-link mirror" in line:
                    skip_block = True
                    continue
                if skip_block:
                    if line.startswith(".cursor/") or line.startswith(".kilo/"):
                        continue
                    if line.strip() == "":
                        continue
                    skip_block = False
                if line.strip() in {
                    ".cursor/skills/",
                    ".cursor/rules/",
                    ".cursor/extracts/",
                }:
                    continue
                lines.append(line)
            text = "".join(lines)
            if "# Optional Kilo export" not in text:
                text = text.rstrip() + "\n" + GITIGNORE_CURSOR_SSOT
    if text != original:
        gi.write_text(text if text.endswith("\n") else text + "\n", encoding="utf-8")
        return True
    # Ensure kilo block exists and cursor is NOT ignored
    if ".cursor/skills/" in text and "Optional Kilo export" not in text:
        text = text.replace(".cursor/skills/\n", "").replace(".cursor/rules/\n", "").replace(
            ".cursor/extracts/\n", ""
        )
        text = text.rstrip() + "\n" + GITIGNORE_CURSOR_SSOT
        gi.write_text(text, encoding="utf-8")
        return True
    return False


def copy_scripts(dest: Path) -> None:
    scripts = dest / "scripts"
    scripts.mkdir(parents=True, exist_ok=True)
    for name in ("cursor-export-kilo", "platform-ai-link"):
        src = PORTAL / "scripts" / name
        if src.exists():
            shutil.copy2(src, scripts / name)
            (scripts / name).chmod(0o755)
    obsolete = scripts / "platform-ai-migrate-to-ssot"
    if obsolete.exists():
        obsolete.unlink()


def remove_platform_ai_dir(dest: Path) -> bool:
    p = dest / "platform-ai"
    if p.is_dir():
        shutil.rmtree(p)
        return True
    return False


def sync_one(dirname: str, profile: str) -> None:
    dest = WS / dirname
    if not dest.is_dir():
        print(f"SKIP missing {dirname}")
        return
    cursor = dest / ".cursor"
    cursor.mkdir(parents=True, exist_ok=True)

    if profile == "full":
        sk = sync_skills(SRC_CURSOR / "skills", cursor / "skills", None)
        ru = sync_rules(SRC_CURSOR / "rules", cursor / "rules", None)
        ex = sync_extracts_full(SRC_CURSOR / "extracts", cursor / "extracts")
    else:
        sk = sync_skills(SRC_CURSOR / "skills", cursor / "skills", SHARED_SKILLS)
        ru = sync_rules(SRC_CURSOR / "rules", cursor / "rules", SHARED_RULES)
        ex = sync_extracts_shared(SRC_CURSOR / "extracts", cursor / "extracts")

    patch = retarget_platform_ai_paths(cursor)
    gi = fix_gitignore(dest)
    copy_scripts(dest)
    removed = remove_platform_ai_dir(dest)

    # Optional kilo refresh
    if (dest / ".kilo").is_dir():
        export = dest / "scripts" / "cursor-export-kilo"
        if export.exists():
            import subprocess

            subprocess.run([str(export)], cwd=str(dest), check=False)

    print(
        f"OK {dirname} profile={profile} skills={sk} rules={ru} extracts~={ex} "
        f"retarget={patch} gitignore={gi} rm_platform_ai={removed}"
    )


def main() -> None:
    bases = load_bases()
    print(f"Sync .cursor SSOT from portal → {len(bases)} bases")
    for dirname in bases:
        profile = PROFILES.get(dirname, "shared")
        sync_one(dirname, profile)
    print("Done.")


if __name__ == "__main__":
    main()
