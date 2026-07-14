#!/usr/bin/env python3
"""One-shot (done): move gen/registry into global codegen|unitgen|testgen|…/registries layout.

Re-run only on a fresh clone that still has scripts/portal-gen + shared/*.registry.json.
"""
from __future__ import annotations

import os
import shutil
import sys
from pathlib import Path

WORKSPACE = Path("/home/vutv/workspace")

REGISTRY_RENAMES = {
    "portal-design.registry.json": "design.registry.json",
    "platform-common.registry.json": "common.registry.json",
    "portal-unit-test.registry.json": "unit-test.registry.json",
    "portal-e2e-test.registry.json": "e2e-test.registry.json",
    "page-lifecycle.registry.json": "page-lifecycle.registry.json",
    "contract-field.registry.json": "contract-field.registry.json",
    "nest-codegen.registry.json": "nest-codegen.registry.json",
    "nest-unit-test.registry.json": "nest-unit-test.registry.json",
    "fast-codegen.registry.json": "codegen.registry.json",
    "fast-unit-test.registry.json": "unit-test.registry.json",
    "api-codegen.registry.json": "codegen.registry.json",
    "api-unit-test.registry.json": "unit-test.registry.json",
    "integration-codegen.registry.json": "codegen.registry.json",
    "line-codegen.registry.json": "codegen.registry.json",
}

NODE_PACKAGES = [
    ("portal-gen", "codegen"),
    ("portal-unit-gen", "unitgen"),
    ("testcase-gen", "testgen"),
    ("contract-gen", "contractgen"),
    ("nest-gen", "nestgen"),
    ("nest-unit-gen", "nest-unitgen"),
    ("openapi-gen", "openapigen"),
    ("api-gen", "codegen"),
    ("api-unit-gen", "unitgen"),
]

# Do NOT include this script's path strings as replace targets that equal new paths.
TEXT_REPLACEMENTS = [
    ("scripts/platform-common-registry.mjs", "registries/validate-common.mjs"),
    ("scripts/platform-common-registry", "registries/validate-common"),
    ("scripts/portal-gen/templates", "codegen/templates"),
    ("scripts/portal-unit-gen/templates", "unitgen/templates"),
    ("scripts/testcase-gen/templates", "testgen/templates"),
    ("scripts/contract-gen/templates", "contractgen/templates"),
    ("scripts/nest-gen/templates", "nestgen/templates"),
    ("scripts/nest-unit-gen/templates", "nest-unitgen/templates"),
    ("scripts/api-unit-gen/templates", "unitgen/templates"),
    ("scripts/portal-gen/", "codegen/runners/"),
    ("scripts/portal-gen", "codegen/runners"),
    ("scripts/portal-unit-gen/", "unitgen/runners/"),
    ("scripts/portal-unit-gen", "unitgen/runners"),
    ("scripts/testcase-gen/", "testgen/runners/"),
    ("scripts/testcase-gen", "testgen/runners"),
    ("scripts/contract-gen/", "contractgen/runners/"),
    ("scripts/contract-gen", "contractgen/runners"),
    ("scripts/nest-gen/", "nestgen/runners/"),
    ("scripts/nest-gen", "nestgen/runners"),
    ("scripts/nest-unit-gen/", "nest-unitgen/runners/"),
    ("scripts/nest-unit-gen", "nest-unitgen/runners"),
    ("scripts/openapi-gen/", "openapigen/runners/"),
    ("scripts/openapi-gen", "openapigen/runners"),
    ("scripts/api-gen/", "codegen/runners/"),
    ("scripts/api-gen", "codegen/runners"),
    ("scripts/api-unit-gen/", "unitgen/runners/"),
    ("scripts/api-unit-gen", "unitgen/runners"),
    ("scripts/fast-gen", "codegen/runners/generate"),
    ("scripts/fast-unit-gen", "unitgen/runners/generate"),
    ("scripts/integration-gen", "codegen/runners/generate"),
    ("scripts/line-gen", "codegen/runners/generate"),
    ("tools/fast_gen/templates", "codegen/templates"),
    ("tools/fast_unit_gen/templates", "unitgen/templates"),
    ("tools/fast_gen", "codegen/runners/fast_gen"),
    ("tools/fast_unit_gen", "unitgen/runners/fast_unit_gen"),
    ("tools/platform_common", "registries/platform_common"),
    ("shared/portal-design.registry.json", "registries/design.registry.json"),
    ("shared/platform-common.registry.json", "registries/common.registry.json"),
    ("shared/portal-unit-test.registry.json", "registries/unit-test.registry.json"),
    ("shared/portal-e2e-test.registry.json", "registries/e2e-test.registry.json"),
    ("shared/page-lifecycle.registry.json", "registries/page-lifecycle.registry.json"),
    ("shared/contract-field.registry.json", "registries/contract-field.registry.json"),
    ("shared/nest-codegen.registry.json", "registries/nest-codegen.registry.json"),
    ("shared/nest-unit-test.registry.json", "registries/nest-unit-test.registry.json"),
    ("shared/fast-codegen.registry.json", "registries/codegen.registry.json"),
    ("shared/fast-unit-test.registry.json", "registries/unit-test.registry.json"),
    ("shared/api-codegen.registry.json", "registries/codegen.registry.json"),
    ("shared/api-unit-test.registry.json", "registries/unit-test.registry.json"),
    ("shared/integration-codegen.registry.json", "registries/codegen.registry.json"),
    ("shared/line-codegen.registry.json", "registries/codegen.registry.json"),
    ("~/shared/page-lifecycle.registry.json", "~/registries/page-lifecycle.registry.json"),
    ("tools/IntegrationGen", "codegen/runners/IntegrationGen"),
    ("tools/LineGen", "codegen/runners/LineGen"),
]

SKIP_DIR_NAMES = {
    "node_modules",
    ".git",
    "coverage",
    "dist",
    ".nuxt",
    ".output",
    "playwright-report",
    "test-results",
    "site",
    "_site",
    ".venv",
    "vendor",
    ".next",
    "logs",
    ".cursor",  # AI SSOT (skills/rules/extracts)
    ".kilo",
}

SKIP_FILES = {"migrate-codegen-layout.py"}


def move_node_package(repo: Path, src_name: str, dest_top: str) -> None:
    src = repo / "scripts" / src_name
    if not src.is_dir():
        return
    dest = repo / dest_top
    runners = dest / "runners"
    templates_src = src / "templates"
    runners.mkdir(parents=True, exist_ok=True)
    if templates_src.is_dir():
        templates_dest = dest / "templates"
        if templates_dest.exists():
            raise SystemExit(f"exists: {templates_dest}")
        shutil.move(str(templates_src), str(templates_dest))
    for child in list(src.iterdir()):
        target = runners / child.name
        if target.exists():
            raise SystemExit(f"exists: {target}")
        shutil.move(str(child), str(target))
    src.rmdir()
    print(f"  moved scripts/{src_name} → {dest_top}/{{templates,runners}}")


def fix_render_templates_path(repo: Path) -> None:
    old = (
        "const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')\n"
        "const templatesDir = path.join(rootDir, 'templates')"
    )
    new = (
        "const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')\n"
        "const templatesDir = path.join(rootDir, 'templates')"
    )
    for render in repo.rglob("render.mjs"):
        if "runners" not in render.parts:
            continue
        if any(p in SKIP_DIR_NAMES for p in render.parts):
            continue
        text = render.read_text(encoding="utf-8")
        if old in text:
            render.write_text(text.replace(old, new), encoding="utf-8")
            print(f"  fixed templates path: {render.relative_to(repo)}")


def move_registries(repo: Path) -> None:
    shared = repo / "shared"
    if not shared.is_dir():
        return
    dest = repo / "registries"
    dest.mkdir(parents=True, exist_ok=True)
    for f in list(shared.glob("*.registry.json")):
        new_name = REGISTRY_RENAMES.get(f.name, f.name)
        target = dest / new_name
        if target.exists():
            raise SystemExit(f"exists: {target}")
        shutil.move(str(f), str(target))
        print(f"  registry {f.name} → registries/{new_name}")
    leftover = list(shared.iterdir())
    if not leftover:
        shared.rmdir()
        print("  removed empty shared/")


def move_validate_common(repo: Path) -> None:
    dest_dir = repo / "registries"
    dest_dir.mkdir(parents=True, exist_ok=True)
    mjs = repo / "scripts" / "platform-common-registry.mjs"
    sh = repo / "scripts" / "platform-common-registry"
    if mjs.is_file():
        shutil.move(str(mjs), str(dest_dir / "validate-common.mjs"))
        print("  moved → registries/validate-common.mjs")
    if sh.is_file():
        shutil.move(str(sh), str(dest_dir / "validate-common"))
        os.chmod(dest_dir / "validate-common", 0o755)
        print("  moved → registries/validate-common")


def move_shell_gen(repo: Path, script_name: str, dest_top: str) -> None:
    src = repo / "scripts" / script_name
    if not src.is_file():
        return
    runners = repo / dest_top / "runners"
    runners.mkdir(parents=True, exist_ok=True)
    dest = runners / "generate"
    shutil.move(str(src), str(dest))
    text = dest.read_text(encoding="utf-8")
    text2 = text.replace(
        'ROOT="$(cd "$(dirname "$0")/.." && pwd)"',
        'ROOT="$(cd "$(dirname "$0")/../.." && pwd)"',
    )
    if text2 != text:
        dest.write_text(text2, encoding="utf-8")
    os.chmod(dest, 0o755)
    print(f"  moved scripts/{script_name} → {dest_top}/runners/generate")


def move_python_fast(repo: Path) -> None:
    pkg = repo / "tools" / "fast_gen"
    if pkg.is_dir():
        tpl = pkg / "templates"
        if tpl.is_dir():
            dest = repo / "codegen" / "templates"
            dest.parent.mkdir(parents=True, exist_ok=True)
            if dest.exists():
                raise SystemExit(f"exists: {dest}")
            shutil.move(str(tpl), str(dest))
            print("  moved tools/fast_gen/templates → codegen/templates")
        runners = repo / "codegen" / "runners"
        runners.mkdir(parents=True, exist_ok=True)
        target = runners / "fast_gen"
        if not target.exists():
            shutil.move(str(pkg), str(target))
            print("  moved tools/fast_gen → codegen/runners/fast_gen")

    upkg = repo / "tools" / "fast_unit_gen"
    if upkg.is_dir():
        tpl = upkg / "templates"
        if tpl.is_dir():
            dest = repo / "unitgen" / "templates"
            dest.parent.mkdir(parents=True, exist_ok=True)
            if dest.exists():
                raise SystemExit(f"exists: {dest}")
            shutil.move(str(tpl), str(dest))
            print("  moved tools/fast_unit_gen/templates → unitgen/templates")
        runners = repo / "unitgen" / "runners"
        runners.mkdir(parents=True, exist_ok=True)
        target = runners / "fast_unit_gen"
        if not target.exists():
            shutil.move(str(upkg), str(target))
            print("  moved tools/fast_unit_gen → unitgen/runners/fast_unit_gen")

    pc = repo / "tools" / "platform_common"
    if pc.is_dir():
        dest = repo / "registries" / "platform_common"
        dest.parent.mkdir(parents=True, exist_ok=True)
        if not dest.exists():
            shutil.move(str(pc), str(dest))
            print("  moved tools/platform_common → registries/platform_common")


def fix_fast_python_paths(repo: Path) -> None:
    plan = repo / "codegen" / "runners" / "fast_gen" / "plan.py"
    if plan.is_file():
        text = plan.read_text(encoding="utf-8")
        text = text.replace(
            'base = templates_dir or (Path(__file__).parent / "templates")',
            'base = templates_dir or (Path(__file__).resolve().parents[2] / "templates")',
        )
        plan.write_text(text, encoding="utf-8")
        print("  patched fast_gen/plan.py")

    reg = repo / "codegen" / "runners" / "fast_gen" / "registry.py"
    if reg.is_file():
        text = reg.read_text(encoding="utf-8")
        text = text.replace(
            'path = repo_root / "shared" / "fast-codegen.registry.json"',
            'path = repo_root / "registries" / "codegen.registry.json"',
        )
        text = text.replace(
            'path = repo_root / "registries" / "codegen.registry.json"',
            'path = repo_root / "registries" / "codegen.registry.json"',
        )
        reg.write_text(text, encoding="utf-8")
        print("  patched fast_gen/registry.py")

    unit_root = repo / "unitgen" / "runners" / "fast_unit_gen"
    if unit_root.is_dir():
        for py in unit_root.rglob("*.py"):
            text = py.read_text(encoding="utf-8")
            orig = text
            text = text.replace(
                'Path(__file__).parent / "templates"',
                'Path(__file__).resolve().parents[2] / "templates"',
            )
            text = text.replace(
                'repo_root / "shared" / "fast-unit-test.registry.json"',
                'repo_root / "registries" / "unit-test.registry.json"',
            )
            if text != orig:
                py.write_text(text, encoding="utf-8")
                print(f"  patched {py.relative_to(repo)}")

    for wrapper_rel in ("codegen/runners/generate", "unitgen/runners/generate"):
        w = repo / wrapper_rel
        if not w.is_file():
            continue
        text = w.read_text(encoding="utf-8")
        if "codegen/runners" not in text:
            text = text.replace(
                'export PYTHONPATH="${ROOT}/tools:${ROOT}/src"',
                'export PYTHONPATH="${ROOT}/codegen/runners:${ROOT}/unitgen/runners:${ROOT}/registries:${ROOT}/tools:${ROOT}/src"',
            )
            w.write_text(text, encoding="utf-8")
            print(f"  patched PYTHONPATH {wrapper_rel}")

    vc = repo / "registries" / "validate-common"
    if vc.is_file():
        text = vc.read_text(encoding="utf-8")
        text = text.replace(
            'export PYTHONPATH="${ROOT}/tools:${ROOT}/src"',
            'export PYTHONPATH="${ROOT}/registries:${ROOT}/codegen/runners:${ROOT}/tools:${ROOT}/src"',
        )
        vc.write_text(text, encoding="utf-8")
        print("  patched registries/validate-common")


def move_dotnet_tools(repo: Path, project: str) -> None:
    src = repo / "tools" / project
    if not src.is_dir():
        return
    runners = repo / "codegen" / "runners"
    runners.mkdir(parents=True, exist_ok=True)
    dest = runners / project
    if dest.exists():
        return
    shutil.move(str(src), str(dest))
    print(f"  moved tools/{project} → codegen/runners/{project}")


def replace_in_tree(repo: Path) -> None:
    exts = {
        ".mjs",
        ".js",
        ".ts",
        ".tsx",
        ".vue",
        ".md",
        ".mdc",
        ".json",
        ".yml",
        ".yaml",
        ".sh",
        ".cs",
        ".py",
        ".toml",
        ".txt",
    }
    special_names = {"Makefile", "AGENTS.md", "README.md", "generate", "validate-common"}
    for path in repo.rglob("*"):
        if not path.is_file():
            continue
        if any(p in SKIP_DIR_NAMES for p in path.parts):
            continue
        if path.name in SKIP_FILES:
            continue
        if path.suffix not in exts and path.name not in special_names:
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except (UnicodeDecodeError, IsADirectoryError, OSError):
            continue
        orig = text
        for old, new in TEXT_REPLACEMENTS:
            if old != new:
                text = text.replace(old, new)
        if text != orig:
            path.write_text(text, encoding="utf-8")
            print(f"  text: {path.relative_to(repo)}")


def migrate_repo(name: str) -> None:
    repo = WORKSPACE / name
    if not repo.is_dir():
        print(f"SKIP missing {name}")
        return
    print(f"\n===== {name} =====")

    for src_name, dest_top in NODE_PACKAGES:
        move_node_package(repo, src_name, dest_top)

    move_registries(repo)
    move_validate_common(repo)

    if name == "fast-api-base":
        move_shell_gen(repo, "fast-gen", "codegen")
        move_shell_gen(repo, "fast-unit-gen", "unitgen")
        move_python_fast(repo)
        fix_fast_python_paths(repo)

    if name == "integration":
        move_shell_gen(repo, "integration-gen", "codegen")
        move_dotnet_tools(repo, "IntegrationGen")

    if name == "line":
        move_shell_gen(repo, "line-gen", "codegen")
        move_dotnet_tools(repo, "LineGen")

    fix_render_templates_path(repo)
    replace_in_tree(repo)
    print(f"DONE {name}")


def main() -> None:
    repos = sys.argv[1:] or [
        "portal",
        "nextjs",
        "nuxt_nest",
        "next_nest",
        "fast-api-base",
        "api",
        "integration",
        "line",
    ]
    for r in repos:
        migrate_repo(r)


if __name__ == "__main__":
    main()
