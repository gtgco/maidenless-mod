# Maidenless — DarkScript3 Project (v3, single-file events)

A clean, **ready-to-build** Elden Ring mod project for a *Maidenless* playthrough (no Melina, no Roundtable). This version keeps **all events in one file** (`script-src/common.evs`) to avoid include/path issues.

## What it does
- **Leyndell access** with **≥2 Great Runes** (also spoofs Roundtable milestones so you never have to go).  
- **Rold Medallion** automatically awarded after **Morgott**.  
- **Forge prompt** to burn the Erdtree → **warp to Crumbling Farum Azula** (fill in region IDs when ready).  

## Quick start
1) Install **DarkScript3** (EXE or CLI DLL). Install **.NET 6 x64 Runtime** (and **Windows Desktop Runtime 6** if using GUI).
2) Open `config/paths.example.toml` → save as `config/paths.toml` with your DarkScript3 path.
3) (Optional) Edit `script-src/common.evs` placeholders:
   - `ROLD_MEDALLION_GOODS_ID` (default 8107).
   - `REGION_FORGE_TRIGGER` and `REGION_CFA_SPAWN` (when you’re ready to test Forge → CFA).
4) Build:
   ```powershell
   .	oolsuild.ps1 -VerboseOutput
   ```
   Output: `event\common.emevd` (pack with Witchy/Yabber → `event\common.emevd.dcx`).
5) Deploy to your Mod Engine mod folder:
   ```powershell
   .	ools\deploy.ps1 -Target "D:\Games\ModEngine2\mod\maidenless"
   ```
   This mirrors `event\common.emevd.dcx` under your mod root.
6) Launch Elden Ring via Mod Engine **offline** and load your save.

## Testing on an existing save
- After loading, rest or fast travel once to force event pass.
- You should receive **Rold Medallion** if Morgott is already dead.
- If you want to force the capital flag on an old/glitched save, set `FORCE_LEYNDELL_OK = 1`, build, load once, then set back to 0.

## Troubleshooting
- If DarkScript3 says you need .NET 6:
  - Run `dotnet --list-runtimes`. Ensure **Microsoft.NETCore.App 6.x (x64)** (and **WindowsDesktop.App 6.x** for GUI).
  - If `where dotnet` shows nothing, call it by full path: `C:\Program Files\dotnet\dotnet.exe`.
- If medallion doesn’t appear, double-check the **Goods ID** and that your file path mirrors `event\common.emevd.dcx` under your mod root.

