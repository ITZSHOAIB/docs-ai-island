# Docs AI Island UI prototype

Throwaway comparison lab for finalizing the Island's visual and interaction direction.

Run from the project root:

```sh
python3 -m http.server 4173 --directory prototype
```

Then open:

```text
http://127.0.0.1:4173/?variant=A
```

Variants:

- `A` — Quiet glass III
- `B` — Context split
- `C` — Command line
- `D` — Editorial sheet

Use the floating prototype bar or the left/right arrow keys to switch. The bar only renders on localhost. Open **Customize** to test accent, surface, density, placement, radius, and host theme.

This code is intentionally disposable. Once a direction is selected, record the verdict in `NOTES.md`, delete the losing variants, and reimplement the chosen behavior in production code.
