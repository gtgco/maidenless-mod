// @ts-nocheck
// common.js — Maidenless (v3.3.1 minimal, DarkScript3 JS)
// Build: Open in DarkScript3 → Build → Save (js→emevd) or Batch Resave.
// Goal: Only remove hard locks; no custom burn. CFA via vanilla Three Fingers after Fire Giant.

// ========= Config toggles =========
const FORCE_LEYNDELL_OK   = 0;  // Set to 1 ONCE for glitched saves, load once, then set back to 0.
const DEBUG_STATUS_TOAST  = 1;  // Show a small toast on load; set to 0 for release.
const DEBUG_PRINT_FLAGS   = 0;  // When 1, prints a few key flags as toasts on load.

// ========= IDs / constants (confirm in your dump if needed) =========
const ROLD_MEDALLION_GOODS_ID = 8107;  // Rold Medallion (verify in EquipParamGoods)

const FLAG_MORGOTT_DEFEATED       = 9104; // Global Morgott defeated
const FLAG_LEYNDELL_REQUIREMENT_MET = 182; // Great Rune Count: 2

// ========= Init =========
$Event(0, Default, function(){
    if (DEBUG_STATUS_TOAST === 1) { DisplayStatusMessage("Maidenless mod active (minimal, JS)", 1); }
    InitializeEvent(0, 20000000); // ≥2 Great Runes → enable Leyndell access (client-local)
    InitializeEvent(0, 20000010); // Rold Medallion after Morgott (client-local)
    if (DEBUG_PRINT_FLAGS === 1) { InitializeEvent(0, 20009999); }
});

// ========= Event 1: Capital access with ≥2 Great Runes (client-local) =========
$Event(20000000, Restart, function() {
    if (EventFlag(FLAG_LEYNDELL_REQUIREMENT_MET)) { EndEvent(); }

    var c = 0;
    if (EventFlag(191)) c += 1; // Godrick
    if (EventFlag(192)) c += 1; // Radahn
    if (EventFlag(193)) c += 1; // Morgott
    if (EventFlag(194)) c += 1; // Rykard
    if (EventFlag(195)) c += 1; // Mohg
    if (EventFlag(196)) c += 1; // Malenia
    if (EventFlag(197)) c += 1; // Rennala (Unborn)

    if (c >= 2 || FORCE_LEYNDELL_OK === 1) {
        // Client-local set; each Seamless player updates their own save.
        SetEventFlagID(FLAG_LEYNDELL_REQUIREMENT_MET, true);
        EndEvent();
    }

    // Wait for any NEW rune to be obtained (or force flag), then re-check.
    let w191 = !EventFlag(191);
    let w192 = !EventFlag(192);
    let w193 = !EventFlag(193);
    let w194 = !EventFlag(194);
    let w195 = !EventFlag(195);
    let w196 = !EventFlag(196);
    let w197 = !EventFlag(197);

    WaitFor(
        (w191 && EventFlag(191)) ||
        (w192 && EventFlag(192)) ||
        (w193 && EventFlag(193)) ||
        (w194 && EventFlag(194)) ||
        (w195 && EventFlag(195)) ||
        (w196 && EventFlag(196)) ||
        (w197 && EventFlag(197)) ||
        (FORCE_LEYNDELL_OK === 1)
    );
    RestartEvent();
});

// ========= Event 2: Auto-grant Rold Medallion after Morgott (client-local) =========
$Event(20000010, Restart, function() {
    WaitFor(EventFlag(FLAG_MORGOTT_DEFEATED));   // 9104
    if (!PlayerHasItem(ItemType.Goods, ROLD_MEDALLION_GOODS_ID)) {
        DirectlyGivePlayerItem(ItemType.Goods, ROLD_MEDALLION_GOODS_ID, 0, 1);
    }
    EndEvent();
});

// ========= Debug helper: print a few flags on load =========
$Event(20009999, Default, function() {
    DisableNetworkSync();
    if (EventFlag(191)) DisplayStatusMessage("Godrick rune flag ON", 1);
    if (EventFlag(192)) DisplayStatusMessage("Radahn rune flag ON", 1);
    if (EventFlag(193)) DisplayStatusMessage("Morgott rune flag ON", 1);
    if (EventFlag(194)) DisplayStatusMessage("Rykard rune flag ON", 1);
    if (EventFlag(195)) DisplayStatusMessage("Mohg rune flag ON", 1);
    if (EventFlag(196)) DisplayStatusMessage("Malenia rune flag ON", 1);
    if (EventFlag(197)) DisplayStatusMessage("Rennala rune flag ON", 1);
    if (EventFlag(FLAG_LEYNDELL_REQUIREMENT_MET)) DisplayStatusMessage("Flag 182 (≥2 runes) ON", 1);
    if (EventFlag(FLAG_MORGOTT_DEFEATED))        DisplayStatusMessage("Flag 9104 (Morgott) ON", 1);
});
