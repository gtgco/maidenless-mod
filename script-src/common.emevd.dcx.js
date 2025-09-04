// ==EMEVD==
// @docs    er-common.emedf.json
// @compress    DCX_KRAK
// @game    Sekiro
// @string    ""
// @linked    []
// @version    3.6.1
// ==/EMEVD==

// Maidenless (v3.5 minimal, DS3 JS → .emevd.dcx)
// Removes hard locks only: (A) ≥2 Great Runes unlocks Leyndell, (B) Rold Medallion after Morgott.
// No custom burn; reach CFA via vanilla Three Fingers after Fire Giant.

// ---- Config ----
// (No string toasts; DS3 requires FMG text IDs for on-screen text.)
const FORCE_LEYNDELL_OK  = 0;  // set to 1 once for glitched saves, load, then set back to 0
// ---- IDs / constants ----
const ROLD_MEDALLION_GOODS_ID = 8107;

const FLAG_MORGOTT_DEFEATED          = 9104; // global
const FLAG_LEYNDELL_REQUIREMENT_MET  = 182;  // ≥2 Great Runes gate

// ---- Init ----
$Event(0, Default, function () {
    $InitializeEvent(0, 20000000); // ≥2 runes → unlock Leyndell (client-local)
    $InitializeEvent(0, 20000010); // grant Rold Medallion after Morgott (client-local)
});

// ≥2 Great Runes → set flag 182 (client-local; uses only 6 AND groups)
$Event(20000000, Restart, function () {
    EndIf(EventFlag(FLAG_LEYNDELL_REQUIREMENT_MET));

    WaitFor(
        (EventFlag(191) && (EventFlag(192) || EventFlag(193) || EventFlag(194) || EventFlag(195) || EventFlag(196) || EventFlag(197))) ||
        (EventFlag(192) && (EventFlag(193) || EventFlag(194) || EventFlag(195) || EventFlag(196) || EventFlag(197))) ||
        (EventFlag(193) && (EventFlag(194) || EventFlag(195) || EventFlag(196) || EventFlag(197))) ||
        (EventFlag(194) && (EventFlag(195) || EventFlag(196) || EventFlag(197))) ||
        (EventFlag(195) && (EventFlag(196) || EventFlag(197))) ||
        (EventFlag(196) && EventFlag(197)) ||
        (FORCE_LEYNDELL_OK == 1)
    );

    SetEventFlagID(FLAG_LEYNDELL_REQUIREMENT_MET, ON);
    EndEvent();
});

// Rold Medallion after Morgott (client-local give)
$Event(20000010, Restart, function () {
    WaitFor(EventFlag(FLAG_MORGOTT_DEFEATED)); // 9104
    if (!PlayerHasItem(ItemType.Goods, ROLD_MEDALLION_GOODS_ID)) {
        DirectlyGivePlayerItem(ItemType.Goods, ROLD_MEDALLION_GOODS_ID, 0, 1);
    }
    EndEvent();
});
