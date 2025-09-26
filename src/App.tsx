import { useMemo, useState } from "react";

// --- Basic constants ---------------------------------------------------------
const TITLE = "Character Forge";
const GENRES = [
  "Fantasy",
  "Sci-Fi",
  "Urban Fantasy",
  "Post-Apocalyptic",
  "Historical",
  "Contemporary",
  "Crime/Thriller",
  "Isekai/LitRPG",
  "Romance",
  "System/Progression",
  "Dystopian",
];

const AGE_GROUPS = [
  { key: "child", label: "Child (8–12)" },
  { key: "teen", label: "Teen (13–17)" },
  { key: "young", label: "Young Adult (18–25)" },
  { key: "adult", label: "Adult (26–45)" },
  { key: "mature", label: "Mature (46+)" },
];

const ARCHETYPES = [
  "Everyman/Everywoman","Detective/Investigator","Outlaw/Rogue","Protector/Bodyguard","Lawkeeper/Marshal",
  "Captain/Commander","Strategist/Tactician","Merchant/Smuggler","Monster Hunter/Exorcist","Oracle/Seer",
  "Diplomat/Peacemaker","Spy/Double Agent","Hacker/Technomancer","Rebel/Activist","Community Builder",
  "Survivor/Scavenger","Apocalyptic Homesteader","Romantic Lead","Rival/Love Interest with Agency",
  "Single-Parent Protagonist","Ascender/Progression Cultivator","System-Chosen/Glitched Protagonist",
  "Villain-Protagonist/Anti-Villain","Scholar/Mage","Warrior/Knight","Healer/Cleric","Artist/Performer",
  "Leader/Organizer","Inventor/Artificer","Journalist/Truth-Seeker","Caregiver/Nurturer",
];

const TRAITS = [
  "Adaptive","Adventurous","Affable","Ambitious","Analytical","Artistic","Astute","Audacious","Balanced","Benevolent",
  "Brave","Calm","Candid","Caring","Charming","Cheerful","Clever","Compassionate","Confident","Conscientious",
  "Courageous","Courteous","Creative","Curious","Cynical","Daring","Decisive","Dedicated","Determined","Diplomatic",
  "Driven","Eccentric","Empathetic","Energetic","Enterprising","Erudite","Ethical","Fearless","Feral","Fiercely Loyal",
  "Focused","Free-spirited","Funny","Generous","Gentle","Grim-humored","Hardworking","Honest","Hopeful","Humble",
  "Idealistic","Imaginative","Impartial","Independent","Indomitable","Innovative","Intense","Intuitive","Kind","Leaderly",
  "Logical","Lone Wolf","Meticulous","Methodical","Mischievous","Modest","Moral","Nihilistic","Observant","Open-minded",
  "Optimistic","Patient","Perceptive","Persistent","Persuasive","Playful","Pragmatic","Protective","Quick-witted","Quiet",
  "Rational","Rebellious","Reliable","Relentless","Reserved","Resourceful","Romantic","Ruthless","Sarcastic","Scheming",
  "Self-reliant","Sensitive","Serene","Shrewd","Skeptical","Sly","Spirited","Spontaneous","Steadfast","Stoic",
  "Strategic","Street-smart","Stubborn","Supportive","Swift-thinking","Taciturn","Tenacious","Thoughtful","Tough","Unflappable",
  "Visionary","Warm","Wary","Witty",
];

const FLAWS = [
  "Addictive Tendencies","Allergic to Authority","Aloof","Anxious","Arrogant","Attachment Issues","Bitter","Blunt",
  "Callous","Careless","Clingy","Compulsive Liar","Cowardly","Cynical","Deceitful","Dependent","Disorganized",
  "Distractible","Egomaniacal","Envious","Fanatical","Fatalistic","Fear of Commitment","Fear of Intimacy","Fear of Failure",
  "Gossip-prone","Greedy","Gullible","Haunted by Past","Hot-headed","Hypocritical","Impatient","Impulsive","Inflexible",
  "Insecure","Jealous","Judgmental","Melancholic","Manipulative","Martyr Complex","Masochistic","Miserly","Naïve",
  "Narcissistic","Obsessive","Overconfident","Overly Trusting","Paranoid","Perfectionist","Pessimistic","Possessive",
  "Procrastinator","Reckless","Resentful","Ruthless","Secretive","Self-destructive","Self-righteous","Short-tempered",
  "Smug","Spiteful","Stubborn","Superstitious","Trauma-ridden","Trust Issues","Unforgiving","Vain","Workaholic",
];

const GOALS = [
  "Avenge a loved one","Atone for a past wrong","Become the best in their field","Break a curse","Build a safe haven",
  "Clear the family name","Create a masterpiece","Cure a plague/disease","Decode a prophecy","Defy a tyrant","Discover new lands",
  "End a war","Escape an arranged fate","Expose corruption","Find a missing person","Find true love","Forge an alliance",
  "Gain freedom/independence","Get rich fast","Heal the world (or a part of it)","Invent a breakthrough","Join an elite order",
  "Keep family safe","Kill a legendary monster","Learn forbidden knowledge","Master a craft","Master the system/magic",
  "Pay off a crushing debt","Protect a secret","Prove their innocence","Rebuild a community","Reclaim a throne/legacy",
  "Redeem a rival","Rescue hostages","Resist an oppressive regime","Restore balance to nature/magic","Return home",
  "Rewrite their fate","Save a species","Secure immortality","Solve a cold case","Start a revolution","Survive the apocalypse",
  "Topple a megacorp","Uncover their true origin","Win the grand tournament","Win back a lost love","Witness the truth to the world",
];

const BACKGROUNDS = [
  "Abandoned test subject","Accidental time traveler","Apprentice blacksmith","Aristocrat in exile",
  "Archivist who remembers too much","Borderlands ranger","Caravan smuggler’s kid","City courier who knows every back alley",
  "Clanless warrior","Corporate fixer with burned bridges","Coven-raised orphan","Desert nomad map-keeper",
  "Dockside rat turned broker","Exiled scholar","Farmhand with a forbidden gift","Former cult initiate",
  "Former spy with a sealed file","Foundling raised by a guild","Gladiator freed by luck",
  "Guild scribe who reads cursed ledgers","Hacker from the megablock","Healer from a border clinic","Homesteader of the wastes",
  "Hunter from the drowned woods","Inventor’s assistant","Knight cadet who broke an oath","Librarian of restricted stacks",
  "Mercenary orphan","Migrant miner from a shattered moon","Monster wrangler","Musician busker with a golden ear",
  "Noble scion with a stained name","Order acolyte on probation","Orphan ship rat","Outlaw caravaner",
  "Pilgrim chasing a vision","Police cadet who saw too much","Priest defrocked for heresy",
  "Private detective with one big loss","Refugee scholar","Remote village midwife","Sailor navigator","Sanctuary caretaker",
  "Shepherd who tracks monsters","Street magician/illusionist","Student researcher with dangerous mentor",
  "Temple bell ringer with secrets","Veteran with a quiet past","War medic who refused an order",
  "Warehouse clerk turned whistleblower",
];

const SKILLS = [
  // Combat
  "Blades/Close Combat","Polearms","Archery/Marksmanship","Firearms","Explosives","Unarmed/Martial Arts","Shield Work",
  // Survival & Fieldcraft
  "Tracking","Foraging","Hunting/Trapping","Fishing","Camouflage","Animal Handling/Taming","Wilderness Navigation","Cold Weather Survival","Desert Survival",
  // Tech & Science
  "Hacking/Systems","Robotics/Mechatronics","Drone Operation","Cybernetics","Data Analysis","Chemistry","Physics","Biotech/Genetics","Engineering (general)",
  // Magic & Supernatural
  "Elemental Magic","Ritual Magic","Runecraft/Enchanting","Healing Magic","Necromancy","Illusion/Veiling","Divination","Spirit Negotiation/Shamanism",
  // Social & Mind
  "Negotiation/Diplomacy","Deception/Disguise","Intimidation","Interrogation","Leadership","Teaching/Mentorship","Psychology/Profiling","Etiquette/Protocol",
  // Craft & Trade
  "Blacksmithing","Leatherworking","Carpentry","Weaving/Tailoring","Cooking","Baking","Brewing/Winemaking","Glassblowing","Jewelry/Filigree","Shipwright",
  // Investigative
  "Investigation/Forensics","Crime Scene Analysis","Shadowing/Surveillance","Lockpicking/Safecracking","Codebreaking/Cryptography",
  // Medical
  "First Aid","Herbalism","Surgery","Pharmacology",
  // Vehicles
  "Driving","Piloting (Air)","Sailing (Sea)","Riding (Mounts)",
  // Strategy & Logistics
  "Tactics/Small-Unit Command","Siegecraft","Supply/Logistics","Cartography",
  // Art & Performance
  "Music/Composition","Singing/Voice","Dance/Choreography","Acting/Stagecraft","Calligraphy","Painting","Sculpture","Creative Writing",
  // Urban & Subterfuge
  "Parkour/Free Running","Streetwise","Gambling","Heist Planning",
];

const SETTINGS_BY_GENRE: Record<string, string[]> = {
  "Fantasy": ["Crumbling keep", "Market quarter", "Mage academy", "Haunted marsh"],
  "Sci-Fi": ["Orbital station ring", "Megablock sprawl", "Terraformer outpost", "Ship graveyard"],
  "Urban Fantasy": ["Neon alley", "Abandoned church", "Riverside arcade", "Underground library"],
  "Post-Apocalyptic": ["Wasteland caravansary", "Quarantine arcology", "Collapsed overpass", "Underground metro"],
  "Historical": ["Harbor docks", "Manor estate", "Frontier fort", "Printing press"],
  "Contemporary": ["Small-town café", "Community center", "Hospital ward at night", "High school gym"],
  "Crime/Thriller": ["Back-alley speakeasy", "Corporate high-rise", "Safehouse", "Harbor warehouse"],
  "Isekai/LitRPG": ["Starter town", "Endless tower floor", "Glitched instance", "Boss arena"],
  "Romance": ["Bookshop at dusk", "Farmers’ market", "Rooftop garden", "Airport terminal"],
  "System/Progression": ["Tutorial zone", "Dungeon hub", "Trial grounds", "Ascension hall"],
  "Dystopian": ["Surveillance square", "Censor's archive", "Ration line", "Grey tenements"],
};

const HOOKS = [
  "a stranger arrives with a bleeding map",
  "a forbidden signal repeats your name",
  "the moon cracks like glass",
  "a letter reveals your past is a lie",
  "the relic you touched won’t let go",
  "a bounty is posted with your face",
  "time rewinds—but only for you",
];

// --- Helpers -----------------------------------------------------------------
function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}
function rand<T>(xs: T[]) { return xs[Math.floor(Math.random() * xs.length)]; }
async function copyToClipboard(text: string) {
  try { await navigator.clipboard.writeText(text); alert("Copied!"); } catch { /* ignore */ }
}
function download(filename: string, text: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
  a.download = filename; a.click(); URL.revokeObjectURL(a.href);
}

// --- Types & default model ---------------------------------------------------
const emptyCharacter = () => ({
  name: "",
  ageGroup: "young",
  exactAge: "",
  genre: GENRES[0],
  archetype: ARCHETYPES[0],
  traits: [] as string[],
  flaws: [] as string[],
  goals: [] as string[],
  background: BACKGROUNDS[0],
  skills: [] as string[],
  setting: SETTINGS_BY_GENRE[GENRES[0]][0],
});

function generateBackstory(c: ReturnType<typeof emptyCharacter>) {
  const ageText = c.exactAge
    ? `${c.exactAge}`
    : `${AGE_GROUPS.find(a => a.key === c.ageGroup)?.label ?? "Unknown age"}`;

  const hook = rand(HOOKS);
  const hookPara = `${c.name || "Unnamed"} is a ${ageText.toLowerCase()} ${c.archetype.toLowerCase()} in a ${c.genre.toLowerCase()} setting, where ${hook}.`;
  const settingPara = `They come from ${c.background.toLowerCase()}, making a life in ${c.setting.toLowerCase()}. ${c.name || "They"} tends to be ${(c.traits.join(", ") || "unassuming").toLowerCase()}, yet ${(c.flaws.join(" and ") || "lingering doubts").toLowerCase()} shadow every choice.`;
  const skillPara = `Practical talents include ${(c.skills.join(", ") || "untapped potential").toLowerCase()}. The immediate goal: ${(c.goals.join(" and ") || "find a place to belong").toLowerCase()}.`;

  const complication = {
    "Fantasy": `Magic leaves scars. Each spell costs a memory, and ${c.name || "our hero"} is starting to forget the faces that matter.`,
    "Sci-Fi": `An AI predictive warrant flags ${c.name || "them"} as a future threat, turning allies into watchers.`,
    "Urban Fantasy": `Vows sworn at a crossroads still bind; breaking them invites something old to collect.`,
    "Post-Apocalyptic": `Water shares are counted in heartbeats; a friend sold theirs to pay your debt.`,
    "Historical": `Honor duels are back in fashion, and a hidden patron demands a victory you cannot afford.`,
    "Contemporary": `Going viral ruined privacy; every favor now arrives with a camera.`,
    "Crime/Thriller": `The only witness trusts you—but only if you bury evidence that saves someone else.`,
    "Isekai/LitRPG": `The system mocks your choices, yet offers a rare quest that risks a total reset.`,
    "Romance": `Love is the prize and the test: one misstep costs the future you've almost built.`,
    "System/Progression": `A hidden modifier skews your path—fast gains with invisible debts.`,
    "Dystopian": `Truth is contraband; speaking it brands your voice for deletion.`,
  }[c.genre];

  const beat1 = `Inciting Incident: On a grey morning, ${c.name || "the protagonist"} stumbles upon proof that the stakes are larger than a single life.`;
  const beat2 = `Choice: Embrace the path of a ${c.archetype.toLowerCase()} or walk away and watch the world narrow.`;
  const beat3 = `Complication: ${complication}`;
  const beat4 = `Hook for Chapter One: ${c.name || "They"} answer a knock that should not exist at ${c.setting.toLowerCase()}.`;

  return [hookPara, settingPara, skillPara, beat1, beat2, beat3, beat4].join("\n\n");
}

// --- UI Components -----------------------------------------------------------
function Section(props: { title: string; children: any }) {
  return (
    <section className="rounded-2xl border border-white/15 p-4 md:p-6 bg-white/5">
      <h2 className="text-lg md:text-xl font-semibold mb-3">{props.title}</h2>
      {props.children}
    </section>
  );
}

export default function App() {
  const [character, setCharacter] = useState(emptyCharacter());
  const [draft, setDraft] = useState("");

  const genreSettings = useMemo(
    () => SETTINGS_BY_GENRE[character.genre] ?? [],
    [character.genre]
  );

  function reset() {
    setCharacter(emptyCharacter());
    setDraft("");
  }

  function saveCharacter() {
    const text = JSON.stringify(character, null, 2);
    download(`${(character.name || "character").replace(/\s+/g, "_")}.json`, text);
  }

  function loadFromJSON() {
    const raw = prompt("Paste character JSON");
    if (!raw) return;
    try {
      const obj = JSON.parse(raw);
      setCharacter({ ...emptyCharacter(), ...obj });
      setDraft("");
    } catch {
      alert("Invalid JSON");
    }
  }

  function toggleMulti(key: "traits" | "flaws" | "goals" | "skills", value: string) {
    const MAX: Record<typeof key, number> = { traits: 3, flaws: 2, goals: 2, skills: 3 };
    setCharacter((c) => {
      const set = new Set(c[key]);
      if (set.has(value)) set.delete(value);
      else set.add(value);
      return { ...c, [key]: Array.from(set).slice(0, MAX[key]) };
    });
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-zinc-950 to-zinc-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">{TITLE}</h1>
            <p className="text-white/70 text-sm">Build any character for any genre. Generate a draft backstory in one click.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={reset} className="px-3 py-2 rounded-xl border border-white/20 hover:bg-white/10">Reset</button>
            <button
              onClick={() => {
                const text = draft || generateBackstory(character);
                setDraft(text);
                copyToClipboard(text);
              }}
              className="px-3 py-2 rounded-xl bg-white text-black font-medium hover:bg-white/90"
            >
              Generate & Copy
            </button>
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {/* Left column: form */}
          <div className="space-y-4 md:space-y-6">
            <Section title="Basics">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1">
                  <span className="text-sm text-white/80">Name</span>
                  <input
                    value={character.name}
                    onChange={(e) => setCharacter({ ...character, name: e.target.value })}
                    className="bg-black/30 border border-white/20 rounded-xl px-3 py-2"
                    placeholder="e.g., Kaia Voss"
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-sm text-white/80">Genre</span>
                  <select
                    value={character.genre}
                    onChange={(e) => {
                      const g = e.target.value;
                      setCharacter((c) => ({
                        ...c,
                        genre: g,
                        setting: (SETTINGS_BY_GENRE[g] ?? [c.setting])[0],
                      }));
                    }}
                    className="bg-black/30 border border-white/20 rounded-xl px-3 py-2"
                  >
                    {GENRES.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-sm text-white/80">Archetype</span>
                  <select
                    value={character.archetype}
                    onChange={(e) => setCharacter({ ...character, archetype: e.target.value })}
                    className="bg-black/30 border border-white/20 rounded-xl px-3 py-2"
                  >
                    {ARCHETYPES.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-sm text-white/80">Setting</span>
                  <select
                    value={character.setting}
                    onChange={(e) => setCharacter({ ...character, setting: e.target.value })}
                    className="bg-black/30 border border-white/20 rounded-xl px-3 py-2"
                  >
                    {genreSettings.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-sm text-white/80">Age Group</span>
                  <select
                    value={character.ageGroup}
                    onChange={(e) => setCharacter({ ...character, ageGroup: e.target.value })}
                    className="bg-black/30 border border-white/20 rounded-xl px-3 py-2"
                  >
                    {AGE_GROUPS.map((a) => (
                      <option key={a.key} value={a.key}>{a.label}</option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-sm text-white/80">Exact Age (optional)</span>
                  <input
                    value={character.exactAge}
                    onChange={(e) => setCharacter({ ...character, exactAge: e.target.value })}
                    className="bg-black/30 border border-white/20 rounded-xl px-3 py-2"
                    placeholder="e.g., 23"
                    inputMode="numeric"
                  />
                </label>

                <label className="flex flex-col gap-1 md:col-span-2">
                  <span className="text-sm text-white/80">Background</span>
                  <select
                    value={character.background}
                    onChange={(e) => setCharacter({ ...character, background: e.target.value })}
                    className="bg-black/30 border border-white/20 rounded-xl px-3 py-2"
                  >
                    {BACKGROUNDS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </label>
              </div>
            </Section>

            <Section title="Personality & Capabilities">
              {/* Traits */}
              <div className="mb-4">
                <div className="text-sm text-white/80 mb-2">Traits (pick up to 3) <span className="text-white/50">[{character.traits.length}/3]</span></div>
                <div className="flex flex-wrap gap-2 max-h-56 overflow-auto pr-1">
                  {TRAITS.map((t) => (
                    <button
                      key={t}
                      onClick={() => toggleMulti("traits", t)}
                      className={cn(
                        "px-3 py-1 rounded-full border transition",
                        character.traits.includes(t) ? "bg-white text-black border-white" : "border-white/30 hover:bg-white/10"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Flaws */}
              <div className="mb-4">
                <div className="text-sm text-white/80 mb-2">Flaws (pick up to 2) <span className="text-white/50">[{character.flaws.length}/2]</span></div>
                <div className="flex flex-wrap gap-2 max-h-44 overflow-auto pr-1">
                  {FLAWS.map((f) => (
                    <button
                      key={f}
                      onClick={() => toggleMulti("flaws", f)}
                      className={cn(
                        "px-3 py-1 rounded-full border transition",
                        character.flaws.includes(f) ? "bg-white text-black border-white" : "border-white/30 hover:bg-white/10"
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Goals */}
              <div className="mb-4">
                <div className="text-sm text-white/80 mb-2">Goals (pick up to 2) <span className="text-white/50">[{character.goals.length}/2]</span></div>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-auto pr-1">
                  {GOALS.map((g) => (
                    <button
                      key={g}
                      onClick={() => toggleMulti("goals", g)}
                      className={cn(
                        "px-3 py-1 rounded-full border transition",
                        character.goals.includes(g) ? "bg-white text-black border-white" : "border-white/30 hover:bg-white/10"
                      )}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="">
                <div className="text-sm text-white/80 mb-2">Skills (pick up to 3) <span className="text-white/50">[{character.skills.length}/3]</span></div>
                <div className="flex flex-wrap gap-2 max-h-56 overflow-auto pr-1">
                  {SKILLS.map((s) => (
                    <button
                      key={s}
                      onClick={() => toggleMulti("skills", s)}
                      className={cn(
                        "px-3 py-1 rounded-full border transition",
                        character.skills.includes(s) ? "bg-white text-black border-white" : "border-white/30 hover:bg-white/10"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </Section>
          </div>

          {/* Right column: output */}
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
                  onClick={() => copyToClipboard(draft || generateBackstory(character))}
                  className="px-3 py-2 rounded-xl border border-white/20 hover:bg-white/10"
                >
                  Copy
                </button>
                <button
                  onClick={() => download(`${(character.name || "character").replace(/\s+/g, "_")}.txt`, draft || generateBackstory(character))}
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

            <Section title="Save & Export">
              <div className="flex flex-wrap gap-2">
                <button onClick={saveCharacter} className="px-3 py-2 rounded-xl bg-white text-black font-medium hover:bg-white/90">
                  Save Character (.json)
                </button>
                <button
                  onClick={() => {
                    const json = JSON.stringify(character, null, 2);
                    copyToClipboard(json);
                  }}
                  className="px-3 py-2 rounded-xl border border-white/20 hover:bg-white/10"
                >
                  Copy JSON
                </button>
                <button onClick={loadFromJSON} className="px-3 py-2 rounded-xl border border-white/20 hover:bg-white/10">
                  Load from JSON
                </button>
              </div>
            </Section>
          </div>
        </div>

        <footer className="mt-8 text-xs text-white/50">
          v2 root system • Tailwind + React (Vite)
        </footer>
      </div>
    </div>
  );
}
