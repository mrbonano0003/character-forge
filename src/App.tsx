import React, { useMemo, useState } from "react";

/** --------------------------------------------------------------------
 * Character Forge   App.tsx  (Sex + Orientation patch v1)
 * - Adds: sex, orientation (Straight | Gay | Lesbian)
 * - Uses Tailwind (v4) classes already in your project
 * - Hooks these fields into the backstory generator
 * -------------------------------------------------------------------- */

const TITLE = "Character Forge";

// Example option sets (trim/expand as you like)
const GENRES = ["Fantasy", "Sci-Fi", "Romance", "Apocalypse", "Mystery", "System", "LitRPG"];
const ARCHETYPES = [
  "Reluctant Hero", "Antihero", "Prodigy", "Investigator", "Survivor",
  "Villain in Denial", "Mentor", "Trickster", "Chosen-But-Resisting"
];
const SETTINGS: Record<string, string[]> = {
  Fantasy: ["Low Magic Kingdom", "High Magic Empire", "Frontier Duchy", "Hidden City"],
  "Sci-Fi": ["Orbital Station", "Frontier Colony", "Megacity", "Sleeper Ship"],
  Romance: ["Small Town", "Campus", "Office", "Celebrity Life"],
  Apocalypse: ["Walled Enclave", "Road Convoy", "Underground Bunker", "Quarantined City"],
  Mystery: ["Coastal Village", "Museum", "Newspaper Office", "Isolated Manor"],
  System: ["Tutorial Zone", "Dungeon Hub", "Guild City", "Admin Backroom"],
  LitRPG: ["Starter Village", "Raid Capital", "PvP Arena", "Labyrinth Floor"],
};

const TRAITS = [
  "Stoic","Empathic","Cunning","Idealistic","Pragmatic","Reckless",
  "Methodical","Curious","Protective","Charismatic","Aloof","Driven"
];
const FLAWS = [
  "Trust Issues","Impulsive","Arrogant","Guilt-ridden","Conflict-Avoidant","Vengeful",
  "Na ve","Overprotective","Cynical","Obsessive"
];
const GOALS = [
  "Protect a loved one","Uncover a conspiracy","Redeem past mistakes",
  "Become the best","Find a lost place","Repay a debt","Survive at any cost"
];
const SKILLS = [
  "Swordplay","Hacking","Forensics","Negotiation","Field Medicine",
  "Stealth","Tactics","Lockpicking","Alchemy","Singing","Cooking","Marksmanship"
];

// NEW enums
const SEX_OPTIONS = ["", "Female", "Male", "Prefer not to say"] as const;
type Sex = (typeof SEX_OPTIONS)[number];

const ORIENTATION_OPTIONS = ["", "Straight", "Gay", "Lesbian"] as const;
type Orientation = (typeof ORIENTATION_OPTIONS)[number];

type Character = {
  name: string;
  genre: string;
  archetype: string;
  setting: string;
  ageGroup: "teen" | "young-adult" | "adult" | "middle-aged" | "elder";
  exactAge: string;
  background: string;

  // NEW fields
  sex: Sex;
  orientation: Orientation;

  traits: string[];
  flaws: string[];
  goals: string[];
  skills: string[];
};

const INITIAL: Character = {
  name: "",
  genre: GENRES[0],
  archetype: ARCHETYPES[0],
  setting: SETTINGS[GENRES[0]][0],
  ageGroup: "young-adult",
  exactAge: "",
  background: "Commoner",

  // NEW defaults
  sex: "",
  orientation: "",

  traits: [],
  flaws: [],
  goals: [],
  skills: [],
};

function Section(props: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/15 p-4 md:p-6 bg-white/5">
      <h2 className="text-lg md:text-xl font-semibold mb-3">{props.title}</h2>
      {props.children}
    </section>
  );
}

function limitToggle(list: string[], set: (updater: (cur: string[]) => string[]) => void, item: string, max: number) {
  set((cur) => {
    const has = cur.includes(item);
    if (has) return cur.filter((x) => x !== item);
    if (cur.length >= max) return cur; // ignore if at limit
    return [...cur, item];
  });
}

function chip(active: boolean) {
  return `px-2.5 py-1.5 rounded-xl border text-sm ${
    active
      ? "bg-white text-black border-white"
      : "border-white/25 text-white hover:bg-white/10"
  }`;
}

function generateBackstory(c: Character): string {
  const ageBit =
    c.exactAge
      ? `is ${c.exactAge} years old`
      : c.ageGroup === "teen"
      ? "is a teenager"
      : c.ageGroup === "young-adult"
      ? "is in their early adulthood"
      : c.ageGroup === "adult"
      ? "is an adult"
      : c.ageGroup === "middle-aged"
      ? "is middle-aged"
      : "is an elder";

  const settingBit = c.setting ? ` in ${c.setting}` : "";
  const archetypeBit = c.archetype ? `A ${c.archetype.toLowerCase()} by nature.` : "";

  // NEW: identity line
  const idBits: string[] = [];
  if (c.sex) idBits.push(`sex: ${c.sex}`);
  if (c.orientation) idBits.push(`orientation: ${c.orientation}`);
  const identityLine = idBits.length ? `Identity   ${idBits.join("   ")}.` : "";

  const t = c.traits.length ? `Known for being ${c.traits.join(", ")}.` : "";
  const f = c.flaws.length ? `Flaws include ${c.flaws.join(", ")}.` : "";
  const g = c.goals.length ? `Motivated by ${c.goals.join(", ")}.` : "";
  const s = c.skills.length ? `Capable in ${c.skills.join(", ")}.` : "";

  const bg = c.background ? `Background: ${c.background}.` : "";

  const intro = [
    `${c.name || "This character"} ${ageBit}${settingBit}.`,
    identityLine,
    archetypeBit,
  ]
    .filter(Boolean)
    .join(" ");

  const arc = `In a ${c.genre} narrative, ${c.name || "they"} will be tested where ${
    c.skills[0] || "their abilities"
  } intersect with ${c.flaws[0] || "their shortcomings"}, forcing choices aligned with ${
    c.goals[0] || "their deepest aim"
  }.`;

  return [intro, bg, t, f, s, g, "", arc].filter(Boolean).join("\n\n");
}

export default function App() {
  const [character, setCharacter] = useState<Character>(INITIAL);
  const [draft, setDraft] = useState("");

  const genreSettings = useMemo(
    () => SETTINGS[character.genre] ?? [],
    [character.genre]
  );

  function reset() {
    setCharacter(INITIAL);
    setDraft("");
  }

  function download(filename: string, text: string) {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-zinc-950 to-zinc-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">{TITLE}</h1>
            <p className="text-white/70 text-sm">
              Build any character for any genre. (Now includes <b>Sex</b> and <b>Sexual orientation</b>.)
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={reset}
              className="px-3 py-2 rounded-xl border border-white/20 hover:bg-white/10"
            >
              Reset
            </button>
            <button
              onClick={() => {
                const text = generateBackstory(character);
                setDraft(text);
              }}
              className="px-3 py-2 rounded-xl bg-white text-black font-medium hover:bg-white/90"
            >
              Generate
            </button>
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {/* LEFT: Inputs */}
          <div className="space-y-4 md:space-y-6">
            <Section title="Basics">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <label className="flex flex-col gap-1">
                  <span className="text-sm text-white/80">Name</span>
                  <input
                    value={character.name}
                    onChange={(e) =>
                      setCharacter({ ...character, name: e.target.value })
                    }
                    className="bg-black/30 border border-white/20 rounded-xl px-3 py-2"
                    placeholder="e.g., Kaia Voss"
                  />
                </label>

                {/* Genre */}
                <label className="flex flex-col gap-1">
                  <span className="text-sm text-white/80">Genre</span>
                  <select
                    value={character.genre}
                    onChange={(e) => {
                      const next = e.target.value;
                      setCharacter((c) => ({
                        ...c,
                        genre: next,
                        setting: SETTINGS[next]?.[0] ?? "",
                      }));
                    }}
                    className="bg-black/30 border border-white/20 rounded-xl px-3 py-2"
                  >
                    {GENRES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Archetype */}
                <label className="flex flex-col gap-1">
                  <span className="text-sm text-white/80">Archetype</span>
                  <select
                    value={character.archetype}
                    onChange={(e) =>
                      setCharacter({ ...character, archetype: e.target.value })
                    }
                    className="bg-black/30 border border-white/20 rounded-xl px-3 py-2"
                  >
                    {ARCHETYPES.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Setting */}
                <label className="flex flex-col gap-1">
                  <span className="text-sm text-white/80">Setting</span>
                  <select
                    value={character.setting}
                    onChange={(e) =>
                      setCharacter({ ...character, setting: e.target.value })
                    }
                    className="bg-black/30 border border-white/20 rounded-xl px-3 py-2"
                  >
                    {genreSettings.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Age group */}
                <label className="flex flex-col gap-1">
                  <span className="text-sm text-white/80">Age Group</span>
                  <select
                    value={character.ageGroup}
                    onChange={(e) =>
                      setCharacter({
                        ...character,
                        ageGroup: e.target.value as Character["ageGroup"],
                      })
                    }
                    className="bg-black/30 border border-white/20 rounded-xl px-3 py-2"
                  >
                    <option value="teen">Teen</option>
                    <option value="young-adult">Young Adult</option>
                    <option value="adult">Adult</option>
                    <option value="middle-aged">Middle-aged</option>
                    <option value="elder">Elder</option>
                  </select>
                </label>

                {/* Exact age */}
                <label className="flex flex-col gap-1">
                  <span className="text-sm text-white/80">Exact Age (optional)</span>
                  <input
                    value={character.exactAge}
                    onChange={(e) =>
                      setCharacter({ ...character, exactAge: e.target.value })
                    }
                    className="bg-black/30 border border-white/20 rounded-xl px-3 py-2"
                    placeholder="e.g., 23"
                    inputMode="numeric"
                  />
                </label>

                {/* Background */}
                <label className="flex flex-col gap-1 md:col-span-2">
                  <span className="text-sm text-white/80">Background</span>
                  <select
                    value={character.background}
                    onChange={(e) =>
                      setCharacter({ ...character, background: e.target.value })
                    }
                    className="bg-black/30 border border-white/20 rounded-xl px-3 py-2"
                  >
                    {["Commoner", "Noble", "Soldier", "Scholar", "Outlaw", "Orphan", "Merchant"]
                      .map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                  </select>
                </label>

                {/* NEW: Sex */}
                <label className="flex flex-col gap-1">
                  <span className="text-sm text-white/80">Sex</span>
                  <select
                    value={character.sex}
                    onChange={(e) =>
                      setCharacter({ ...character, sex: e.target.value as Sex })
                    }
                    className="bg-black/30 border border-white/20 rounded-xl px-3 py-2"
                  >
                    {SEX_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s === "" ? "(choose)" : s}
                      </option>
                    ))}
                  </select>
                </label>

                {/* NEW: Sexual orientation */}
                <label className="flex flex-col gap-1">
                  <span className="text-sm text-white/80">Sexual orientation</span>
                  <select
                    value={character.orientation}
                    onChange={(e) =>
                      setCharacter({
                        ...character,
                        orientation: e.target.value as Orientation,
                      })
                    }
                    className="bg-black/30 border border-white/20 rounded-xl px-3 py-2"
                  >
                    {ORIENTATION_OPTIONS.map((o) => (
                      <option key={o} value={o}>
                        {o === "" ? "(choose)" : o}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </Section>

            <Section title="Personality & Capabilities">
              {/* Traits */}
              <div className="mb-4">
                <div className="text-sm text-white/80 mb-2">
                  Traits (pick up to 3){" "}
                  <span className="text-white/50">[{character.traits.length}/3]</span>
                </div>
                <div className="flex flex-wrap gap-2 max-h-56 overflow-auto pr-1">
                  {TRAITS.map((t) => {
                    const active = character.traits.includes(t);
                    return (
                      <button
                        key={t}
                        className={chip(active)}
                        onClick={() => limitToggle(character.traits, (fn) => setCharacter({ ...character, traits: fn(character.traits) }), t, 3)}
                        type="button"
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Flaws */}
              <div className="mb-4">
                <div className="text-sm text-white/80 mb-2">
                  Flaws (pick up to 2){" "}
                  <span className="text-white/50">[{character.flaws.length}/2]</span>
                </div>
                <div className="flex flex-wrap gap-2 max-h-44 overflow-auto pr-1">
                  {FLAWS.map((f) => {
                    const active = character.flaws.includes(f);
                    return (
                      <button
                        key={f}
                        className={chip(active)}
                        onClick={() => limitToggle(character.flaws, (fn) => setCharacter({ ...character, flaws: fn(character.flaws) }), f, 2)}
                        type="button"
                      >
                        {f}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Goals */}
              <div className="mb-4">
                <div className="text-sm text-white/80 mb-2">
                  Goals (pick up to 2){" "}
                  <span className="text-white/50">[{character.goals.length}/2]</span>
                </div>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-auto pr-1">
                  {GOALS.map((g) => {
                    const active = character.goals.includes(g);
                    return (
                      <button
                        key={g}
                        className={chip(active)}
                        onClick={() => limitToggle(character.goals, (fn) => setCharacter({ ...character, goals: fn(character.goals) }), g, 2)}
                        type="button"
                      >
                        {g}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Skills */}
              <div>
                <div className="text-sm text-white/80 mb-2">
                  Skills (pick up to 3){" "}
                  <span className="text-white/50">[{character.skills.length}/3]</span>
                </div>
                <div className="flex flex-wrap gap-2 max-h-56 overflow-auto pr-1">
                  {SKILLS.map((s) => {
                    const active = character.skills.includes(s);
                    return (
                      <button
                        key={s}
                        className={chip(active)}
                        onClick={() => limitToggle(character.skills, (fn) => setCharacter({ ...character, skills: fn(character.skills) }), s, 3)}
                        type="button"
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            </Section>
          </div>

          {/* RIGHT: Output */}
          <div className="space-y-4 md:space-y-6">
            <Section title="Backstory Draft">
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setDraft(generateBackstory(character))}
                  className="px-3 py-2 rounded-xl bg-white text-black font-medium hover:bg-white/90"
                >
                  Generate
                </button>
                <button
                  onClick={() => {
                    const text = draft || generateBackstory(character);
                    navigator.clipboard.writeText(text);
                  }}
                  className="px-3 py-2 rounded-xl border border-white/20 hover:bg-white/10"
                >
                  Copy
                </button>
                <button
                  onClick={() => {
                    const text = draft || generateBackstory(character);
                    const filename = `${(character.name || "character").replace(/\s+/g, "_")}.txt`;
                    download(filename, text);
                  }}
                  className="px-3 py-2 rounded-xl border border-white/20 hover:bg-white/10"
                >
                  Download .txt
                </button>
              </div>

              <textarea
                className="w-full min-h-[320px] bg-black/30 border border-white/15 rounded-xl p-3 leading-relaxed"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Click Generate to create a tailored backstory..."
              />
            </Section>
          </div>
        </div>

        <footer className="mt-8 text-xs text-white/50">
          Built with ?   {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}
