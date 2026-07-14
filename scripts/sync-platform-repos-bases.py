#!/usr/bin/env python3
"""Sync platform-repos.json across workspace bases + artifactgraph MCP."""
from __future__ import annotations

import json
from pathlib import Path

WS = Path("/home/vutv/workspace")

# id -> (dirname, role, stack, skill, description)
CATALOG: dict[str, tuple[str, str, str, str, str]] = {
    "portal": ("portal", "frontend", "nuxt4", "platform-base", "Base Nuxt 4 (FE)"),
    "nextjs": ("nextjs", "frontend", "nextjs", "platform-base", "Base Next.js (FE)"),
    "nuxt-nest": (
        "nuxt_nest",
        "fullstack",
        "nuxt4-nest",
        "platform-base",
        "Base Nuxt 4 + NestJS monorepo",
    ),
    "next-nest": (
        "next_nest",
        "fullstack",
        "nextjs-nest",
        "platform-base",
        "Base Next.js + NestJS monorepo",
    ),
    "fast-api-base": ("fast-api-base", "backend", "fastapi", "platform-base", "Base FastAPI (BE)"),
    "api": ("api", "backend", "laravel", "api-base", "Base Laravel 12 (BE)"),
    "integration": ("integration", "backend", "dotnet-integration", "platform-base", "Base .NET (BE)"),
    "line": (
        "line",
        "client",
        "dotnet-line",
        "platform-base",
        "Base WinForms — override in platform-repos.local.json for D:/workspace/line",
    ),
    "artifactgraph": (
        "artifactgraph",
        "tooling",
        "mcp",
        "platform-ai",
        "Local MCP artifactgraph — gaps/tags/gen allowlist (raintr91/artifactgraph)",
    ),
}

BASE_IDS = list(CATALOG.keys())

# dirname -> project id used as defaultGroup primary
PRIMARY_BY_DIR = {
    "portal": "portal",
    "nextjs": "nextjs",
    "nuxt_nest": "nuxt-nest",
    "next_nest": "next-nest",
    "fast-api-base": "fast-api-base",
    "api": "api",
    "integration": "integration",
    "line": "line",
    "artifactgraph": "portal",
}

PORTAL_EXTRAS = {
    "nuxt-nest-fe": {
        "root": "../nuxt_nest",
        "role": "frontend",
        "stack": "nuxt4",
        "repo": "nuxt_nest",
        "skill": "platform-base",
        "write": True,
    },
    "nuxt-nest-be": {
        "root": "../nuxt_nest/apps/api",
        "role": "backend",
        "stack": "nestjs",
        "repo": "nuxt_nest",
        "skill": "platform-base",
        "write": True,
    },
    "next-nest-fe": {
        "root": "../next_nest",
        "role": "frontend",
        "stack": "nextjs",
        "repo": "next_nest",
        "skill": "platform-base",
        "write": True,
    },
    "next-nest-be": {
        "root": "../next_nest/server",
        "role": "backend",
        "stack": "nestjs",
        "repo": "next_nest",
        "skill": "platform-base",
        "write": True,
    },
}

MONOREPO_EXTRAS = {
    "nuxt_nest": {
        "nuxt-nest-fe": {
            "root": ".",
            "role": "frontend",
            "stack": "nuxt4",
            "repo": "nuxt_nest",
            "skill": "platform-base",
            "write": True,
        },
        "nuxt-nest-be": {
            "root": "apps/api",
            "role": "backend",
            "stack": "nestjs",
            "repo": "nuxt_nest",
            "skill": "platform-base",
            "write": True,
        },
    },
    "next_nest": {
        "next-nest-fe": {
            "root": ".",
            "role": "frontend",
            "stack": "nextjs",
            "repo": "next_nest",
            "skill": "platform-base",
            "write": True,
        },
        "next-nest-be": {
            "root": "server",
            "role": "backend",
            "stack": "nestjs",
            "repo": "next_nest",
            "skill": "platform-base",
            "write": True,
        },
    },
}


def rel_root(from_dir: str, to_dir: str) -> str:
    return "." if from_dir == to_dir else f"../{to_dir}"


def stack_group(name: str, fe: str, be: str, desc: str) -> dict:
    return {
        "description": desc,
        "primary": fe,
        "projects": [fe, be],
        "contract": {
            "frontend": fe,
            "backend": be,
            "sourceOfTruth": "docs-features-ir-spec",
        },
    }


def build_for(repo_dirname: str, *, is_mcp: bool) -> dict:
    projects: dict = {}
    for pid, (dirname, role, stack, skill, desc) in CATALOG.items():
        root = dirname if is_mcp and pid != "artifactgraph" else rel_root(repo_dirname, dirname)
        if is_mcp and pid == "artifactgraph":
            root = "."
        entry: dict = {
            "root": root,
            "role": role,
            "stack": stack,
            "repo": dirname,
            "skill": skill,
            "description": desc,
            "write": True,
        }
        if is_mcp:
            # MCP map is path resolution only — skill/write optional noise
            entry.pop("skill", None)
            entry.pop("write", None)
        projects[pid] = entry

    primary = PRIMARY_BY_DIR[repo_dirname]
    groups: dict = {
        "platform-bases": {
            "description": "Workspace base templates — FE / BE / fullstack / MCP tooling",
            "primary": primary,
            "projects": list(BASE_IDS),
        }
    }

    if repo_dirname == "portal":
        projects.update(PORTAL_EXTRAS)
        groups["nuxt-nest-stack"] = stack_group(
            "nuxt-nest-stack",
            "nuxt-nest-fe",
            "nuxt-nest-be",
            "Nuxt 4 FE + NestJS BE (monorepo)",
        )
        groups["next-nest-stack"] = stack_group(
            "next-nest-stack",
            "next-nest-fe",
            "next-nest-be",
            "Next.js FE + NestJS BE (monorepo)",
        )
    elif repo_dirname in MONOREPO_EXTRAS:
        projects.update(MONOREPO_EXTRAS[repo_dirname])
        if repo_dirname == "nuxt_nest":
            groups["nuxt-nest-stack"] = stack_group(
                "nuxt-nest-stack",
                "nuxt-nest-fe",
                "nuxt-nest-be",
                "Nuxt 4 FE + NestJS BE (this monorepo)",
            )
        else:
            groups["next-nest-stack"] = stack_group(
                "next-nest-stack",
                "next-nest-fe",
                "next-nest-be",
                "Next.js FE + NestJS BE (this monorepo)",
            )

    doc: dict = {
        "defaultGroup": "platform-bases",
        "groups": groups,
        "projects": projects,
    }
    if is_mcp:
        doc = {
            "version": 1,
            "description": (
                "Workspace map for artifactgraph — roots relative to "
                "workspaceRoot (or ARTIFACTGRAPH_WORKSPACE)."
            ),
            "workspaceRoot": "..",
            **doc,
        }
    return doc


def main() -> None:
    targets = [
        ("portal", False),
        ("nextjs", False),
        ("nuxt_nest", False),
        ("next_nest", False),
        ("fast-api-base", False),
        ("api", False),
        ("integration", False),
        ("line", False),
        ("artifactgraph", True),
    ]
    for dirname, is_mcp in targets:
        root = WS / dirname
        if not root.is_dir():
            print(f"SKIP missing {dirname}")
            continue
        doc = build_for(dirname, is_mcp=is_mcp)
        path = root / "platform-repos.json"
        path.write_text(json.dumps(doc, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(f"OK {path}")

    example = build_for("portal", is_mcp=False)
    (WS / "portal" / "platform-repos.example.json").write_text(
        json.dumps(example, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print("OK portal/platform-repos.example.json")


if __name__ == "__main__":
    main()
