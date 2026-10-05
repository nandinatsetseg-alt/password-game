"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import confetti from "canvas-confetti";

const STORAGE_KEY = "password-game:save";
const BEST_KEY = "password-game:best";
const TARGET_ROMAN_VALUE = 35;

const elementSymbols = [
  "H",
  "He",
  "Li",
  "Be",
  "B",
  "C",
  "N",
  "O",
  "F",
  "Ne",
  "Na",
  "Mg",
  "Al",
  "Si",
  "P",
  "S",
  "Cl",
  "Ar",
  "K",
  "Ca",
  "Sc",
  "Ti",
  "V",
  "Cr",
  "Mn",
  "Fe",
  "Co",
  "Ni",
  "Cu",
  "Zn",
  "Ga",
  "Ge",
  "As",
  "Se",
  "Br",
  "Kr",
  "Rb",
  "Sr",
  "Y",
  "Zr",
  "Nb",
  "Mo",
  "Tc",
  "Ru",
  "Rh",
  "Pd",
  "Ag",
  "Cd",
  "In",
  "Sn",
  "Sb",
  "Te",
  "I",
  "Xe",
  "Cs",
  "Ba",
  "La",
  "Ce",
  "Pr",
  "Nd",
  "Pm",
  "Sm",
  "Eu",
  "Gd",
  "Tb",
  "Dy",
  "Ho",
  "Er",
  "Tm",
  "Yb",
  "Lu",
  "Hf",
  "Ta",
  "W",
  "Re",
  "Os",
  "Ir",
  "Pt",
  "Au",
  "Hg",
  "Tl",
  "Pb",
  "Bi",
  "Po",
  "At",
  "Rn",
  "Fr",
  "Ra",
  "Ac",
  "Th",
  "Pa",
  "U",
  "Np",
  "Pu",
  "Am",
  "Cm",
  "Bk",
  "Cf",
  "Es",
  "Fm",
  "Md",
  "No",
  "Lr",
];

const themes = [
  {
    bg: "bg-[#f7eed3]",
    header: "bg-yellow-200 border-black text-black",
    card: "bg-amber-50 border-black text-black",
    input: "bg-gray-100 border-black text-black focus:bg-amber-100",
    accent: "bg-[#e6c875]",
  },
  {
    bg: "bg-[#e3f2e1]",
    header: "bg-green-200 border-black text-black",
    card: "bg-green-50 border-black text-black",
    input: "bg-white border-black text-black focus:bg-green-100",
    accent: "bg-[#74c69d]",
  },
  {
    bg: "bg-[#dbeafe]",
    header: "bg-sky-200 border-black text-black",
    card: "bg-sky-50 border-black text-black",
    input: "bg-white border-black text-black focus:bg-sky-100",
    accent: "bg-[#2ec4b6]",
  },
  {
    bg: "bg-[#f3e8ff]",
    header: "bg-purple-300 border-black text-black",
    card: "bg-purple-50 border-black text-black",
    input: "bg-white border-black text-black focus:bg-purple-100",
    accent: "bg-[#c77dff]",
  },
  {
    bg: "bg-[#ffe0e0]",
    header: "bg-red-300 border-black text-black",
    card: "bg-red-50 border-black text-black",
    input: "bg-white border-black text-black focus:bg-red-100",
    accent: "bg-[#ff6b6b]",
  },
];

const curses = [
  {
    id: "wiggle",
    name: "Wiggly Input",
    description: "Your password box can't sit still.",
    unlockAt: 3,
  },
  {
    id: "runaway",
    name: "Shy Button",
    description: "The SHOW button runs away from your cursor.",
    unlockAt: 6,
  },
  {
    id: "symbols",
    name: "Glyph Glitch",
    description: "Revealed passwords turn into mystery symbols.",
    unlockAt: 9,
  },
  {
    id: "invert",
    name: "Flashbang",
    description: "The screen randomly inverts its colors.",
    unlockAt: 12,
  },
  {
    id: "chaos-bg",
    name: "Rainbow Chaos",
    description: "The background cycles through every hue.",
    unlockAt: 15,
  },
];

const glyphs = Array.from("☠☢☣⚠⚡☯♆♅♄☿♁⚸⚶✠✡✺❂");

const romanValues = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000,
};

const countVowels = (text) => (text.match(/[aeiouAEIOU]/g) || []).length;

const getDigitSum = (text) =>
  (text.match(/[0-9]/g) || []).reduce((sum, digit) => sum + Number(digit), 0);

const isPrime = (number) => {
  if (number < 2) return false;

  for (let i = 2; i * i <= number; i++) {
    if (number % i === 0) {
      return false;
    }
  }

  return true;
};

const romanToNumber = (roman) => {
  let total = 0;

  for (let i = 0; i < roman.length; i++) {
    const current = romanValues[roman[i]];
    const next = romanValues[roman[i + 1]] || 0;

    if (current < next) {
      total -= current;
    } else {
      total += current;
    }
  }

  return total;
};

const getRomanProduct = (password) => {
  const romanGroups = password.match(/[IVXLCDM]+/g);

  if (!romanGroups) {
    return 0;
  }

  return romanGroups.reduce(
    (product, group) => product * romanToNumber(group),
    1,
  );
};

const hasNumberInEachGroup = (password) => {
  if (!password) return false;

  for (let i = 0; i < password.length; i += 5) {
    const group = password.slice(i, i + 5);

    if (!/[0-9]/.test(group)) {
      return false;
    }
  }

  return true;
};

const hasUppercaseInGroups = (password) => {
  if (!password) return false;

  for (let i = 15; i < password.length; i += 3) {
    const group = password.slice(i, i + 3);

    if (!/[A-Z]/.test(group)) {
      return false;
    }
  }

  return true;
};

const hasNoConsecutiveRepeats = (password) => {
  if (!password) return false;

  for (let i = 1; i < password.length; i++) {
    if (password[i] === password[i - 1]) {
      return false;
    }
  }

  return true;
};

const toCursedGlyphs = (password) => {
  return Array.from(password)
    .map((character, index) => {
      const code = character.codePointAt(0);
      return glyphs[(code + index) % glyphs.length];
    })
    .join("");
};

function usePasswordBreachCheck(password) {
  const [breach, setBreach] = useState({
    pw: "",
    breached: null,
  });

  useEffect(() => {
    if (!password) {
      setBreach({ pw: "", breached: null });
      return;
    }

    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      try {
        const data = new TextEncoder().encode(password);
        const hashBuffer = await crypto.subtle.digest("SHA-1", data);

        const hash = Array.from(new Uint8Array(hashBuffer))
          .map((byte) => byte.toString(16).padStart(2, "0"))
          .join("")
          .toUpperCase();

        const prefix = hash.slice(0, 5);
        const suffix = hash.slice(5);

        const response = await fetch(
          `https://api.pwnedpasswords.com/range/${prefix}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("API network error");
        }

        const result = await response.text();

        const wasBreached = result
          .split(/\r?\n/)
          .some((line) => line.split(":")[0].trim() === suffix);

        setBreach({ pw: password, breached: wasBreached });
      } catch (error) {
        if (error && error.name === "AbortError") {
          return;
        }

        setBreach({ pw: password, breached: "error" });
      }
    }, 600);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [password]);

  return breach;
}

function usePasswordRules(password, breach) {
  const waitingForBreachCheck = password.length > 0 && breach.pw !== password;

  const rules = useMemo(() => {
    const today = new Date().getDate();

    let breachRuleText = "Must NOT be a password found in a known data breach";

    if (waitingForBreachCheck) {
      breachRuleText = "Checking if this password has been breached...";
    } else if (breach.breached === "error") {
      breachRuleText = "Couldn't reach the breach database, skipping this rule";
    }

    return [
      {
        id: 1,
        title: "Must include at least one lowercase letter",
        passed: /[a-z]/.test(password),
      },
      {
        id: 2,
        title: "Must include at least one number",
        passed: /[0-9]/.test(password),
      },
      {
        id: 3,
        title: "Must include at least one uppercase letter",
        passed: /[A-Z]/.test(password),
      },
      {
        id: 4,
        title: "Must be at least 20 characters long",
        passed: password.length >= 20,
      },
      {
        id: 5,
        title: "Must include a number in every 5 characters :p",
        passed: hasNumberInEachGroup(password),
      },
      {
        id: 6,
        title:
          "Must include an uppercase letter in every 3 characters after the 15th character",
        passed: hasUppercaseInGroups(password),
      },
      {
        id: 7,
        title: "Must include the word 'please' because manners matter",
        passed: password.toLowerCase().includes("please"),
      },
      {
        id: 8,
        title: "Must include the Mongolian word for banana (in Cyrillic)",
        passed:
          password.toLowerCase().includes("гадил") ||
          password.toLowerCase().includes("банан"),
      },
      {
        id: 9,
        title: breachRuleText,
        passed: breach.breached === false || breach.breached === "error",
        pending: waitingForBreachCheck,
      },
      {
        id: 10,
        title: "The digits in your password must add up to 25",
        passed: getDigitSum(password) === 25,
      },
      {
        id: 11,
        title: `Roman numerals in your password must multiply to ${TARGET_ROMAN_VALUE}`,
        passed: getRomanProduct(password) === TARGET_ROMAN_VALUE,
      },
      {
        id: 12,
        title: "Password length must be a prime number",
        passed: isPrime(password.length),
      },
      {
        id: 13,
        title: "Must contain a chemical element symbol",
        passed: elementSymbols.some((symbol) => password.includes(symbol)),
      },
      {
        id: 14,
        title: "No two consecutive characters may be the same",
        passed: hasNoConsecutiveRepeats(password),
      },
      {
        id: 15,
        title: "Must contain exactly 3 vowels (a, e, i, o, u)",
        passed: countVowels(password) === 3,
      },
      {
        id: 16,
        title: `Must include today's date number (${today})`,
        passed: password.includes(String(today)),
      },
      {
        id: 17,
        title: "Password length must not exceed 40 characters",
        passed: password.length <= 40,
      },
    ];
  }, [password, breach, waitingForBreachCheck]);

  const totalRules = rules.length;

  const firstFailedRule = rules.findIndex((rule) => !rule.passed);

  const passedCount = firstFailedRule === -1 ? totalRules : firstFailedRule;

  const visibleCount =
    firstFailedRule === -1 ? totalRules : firstFailedRule + 1;

  const visibleRules = rules.slice(0, visibleCount).reverse();

  const progress = Math.round((passedCount / totalRules) * 100);

  const allPassed = passedCount === totalRules && !waitingForBreachCheck;

  return {
    rules,
    visibleRules,
    totalRules,
    passedCount,
    progress,
    allPassed,
    waitingForBreachCheck,
  };
}

function StatsBar({
  seconds,
  keystrokes,
  score,
  bestScore,
  theme,
  scoreChanged,
}) {
  return (
    <div
      className={`border-4 p-3 shadow-[4px_4px_0px_0px_#000] flex flex-wrap gap-2 justify-around text-xs sm:text-sm font-['Press_Start_2P'] transition-colors duration-500 ${theme.card}`}
    >
      <div className={seconds >= 30 ? "text-red-500 animate-pulse" : ""}>
        TIME: {seconds}s
      </div>

      <div>KEYS: {keystrokes}</div>

      <div
        className={`transition-all duration-200 ${
          scoreChanged ? "scale-125 text-green-500" : "scale-100"
        }`}
      >
        SCORE: {score}
      </div>

      <div>BEST: {bestScore ? bestScore.score : "--"}</div>
    </div>
  );
}

function RuleCard({ rule }) {
  let status = "fail";

  if (rule.pending) {
    status = "wait";
  } else if (rule.passed) {
    status = "pass";
  }

  const cardStyles = {
    wait: "bg-[#fff3bf] border-yellow-900 text-[#543]",
    pass: "bg-[#d8f3dc] border-green-900 text-[#050]",
    fail: "bg-[#ffdede] border-red-900 text-[#500]",
  };

  const badgeStyles = {
    wait: "bg-[#ffd166] text-black animate-pulse",
    pass: "bg-[#2ec4b6] text-black",
    fail: "bg-[#e63946] text-white",
  };

  return (
    <div
      className={`border-4 p-4 shadow-[4px_4px_0px_0px_#000] transition-all ${cardStyles[status]}`}
    >
      <div className="flex items-center justify-between border-b-2 border-black/20 pb-2 mb-2">
        <span className="font-['Press_Start_2P'] text-[10px] sm:text-xs">
          {rule.title}
        </span>

        <div
          className={`font-['Press_Start_2P'] text-[9px] px-2 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] uppercase ${badgeStyles[status]}`}
        >
          {status.toUpperCase()}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [cursesEnabled, setCursesEnabled] = useState(false);

  const [isShaking, setIsShaking] = useState(false);
  const [keystrokes, setKeystrokes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [bestScore, setBestScore] = useState(null);
  const [scoreChanged, setScoreChanged] = useState(false);

  const [isLoaded, setIsLoaded] = useState(false);
  const [restoredBanner, setRestoredBanner] = useState(false);
  const [restoredProgress, setRestoredProgress] = useState(0);

  const runawayButtonRef = useRef(null);
  const previousPassedRef = useRef(0);

  const breach = usePasswordBreachCheck(password);

  const { visibleRules, totalRules, passedCount, progress, allPassed } =
    usePasswordRules(password, breach);

  const score = Math.max(
    0,
    passedCount * 1000 - seconds * 50 - keystrokes * 10,
  );

  const themeIndex = Math.min(
    themes.length - 1,
    Math.floor((passedCount / totalRules) * themes.length),
  );

  const currentTheme = themes[themeIndex];

  const activeCurses = useMemo(() => {
    if (!cursesEnabled) {
      return [];
    }

    return curses.filter((curse) => passedCount >= curse.unlockAt);
  }, [passedCount, cursesEnabled]);

  const activeCurseIds = activeCurses.map((curse) => curse.id);

  const invertActive = activeCurseIds.includes("invert");
  const wiggleActive = activeCurseIds.includes("wiggle");
  const symbolsActive = activeCurseIds.includes("symbols");
  const runawayActive = activeCurseIds.includes("runaway");
  const chaosBackgroundActive = activeCurseIds.includes("chaos-bg");

  useEffect(() => {
    try {
      const savedGame = localStorage.getItem(STORAGE_KEY);

      if (savedGame) {
        const data = JSON.parse(savedGame);

        setCursesEnabled(!!data.cursesEnabled);

        if (data.password) {
          setPassword(data.password);
          setKeystrokes(Number(data.keystrokes) || 0);
          setSeconds(Number(data.seconds) || 0);
          setGameStarted(true);
          setRestoredProgress(data.passedCount ?? 0);
          setRestoredBanner(true);
        }
      }

      const savedBest = localStorage.getItem(BEST_KEY);

      if (savedBest) {
        setBestScore(JSON.parse(savedBest));
      }
    } catch {
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!restoredBanner) return;

    const timer = setTimeout(() => {
      setRestoredBanner(false);
    }, 6000);

    return () => clearTimeout(timer);
  }, [restoredBanner]);

  useEffect(() => {
    if (!gameStarted || allPassed) {
      return;
    }

    const timer = setInterval(() => {
      setSeconds((current) => current + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, allPassed]);

  useEffect(() => {
    const previous = previousPassedRef.current;
    previousPassedRef.current = passedCount;

    if (passedCount < previous) {
      setIsShaking(true);

      const timer = setTimeout(() => {
        setIsShaking(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [passedCount]);

  useEffect(() => {
    if (passedCount === 0) {
      return;
    }

    setScoreChanged(true);

    const timer = setTimeout(() => {
      setScoreChanged(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [passedCount]);

  useEffect(() => {
    if (!allPassed || !gameStarted) {
      return;
    }

    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ["#e6c875", "#2ec4b6", "#e63946", "#ffd166", "#06d6a0"],
    });

    const finalTime = Math.max(1, seconds);

    const finalScore = Math.max(
      0,
      passedCount * 1000 - finalTime * 50 - keystrokes * 10,
    );

    const result = {
      score: finalScore,
      time: finalTime,
      keys: keystrokes,
    };

    try {
      const savedBest = localStorage.getItem(BEST_KEY);
      const currentBest = savedBest ? JSON.parse(savedBest) : null;

      if (!currentBest || finalScore > currentBest.score) {
        localStorage.setItem(BEST_KEY, JSON.stringify(result));
        setBestScore(result);
      }
    } catch (error) {
      console.error("Could not save score", error);
    }
  }, [allPassed, gameStarted]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          password,
          cursesEnabled,
          passedCount,
          keystrokes,
          seconds,
        }),
      );
    } catch {}
  }, [password, cursesEnabled, passedCount, keystrokes, seconds, isLoaded]);

  useEffect(() => {
    const button = runawayButtonRef.current;

    if (!runawayActive) {
      if (button) {
        button.style.transform = "";
      }

      return;
    }

    const moveButton = (event) => {
      if (!button) {
        return;
      }

      const rect = button.getBoundingClientRect();

      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);

      const distance = Math.hypot(dx, dy);

      if (distance < 90) {
        const angle = Math.atan2(dy, dx);

        button.style.transform = `translate(${-Math.cos(angle) * 70}px, ${
          -Math.sin(angle) * 70
        }px)`;
      }
    };

    window.addEventListener("mousemove", moveButton);

    return () => {
      window.removeEventListener("mousemove", moveButton);
    };
  }, [runawayActive]);

  const handlePasswordChange = (event) => {
    const value = event.target.value;

    setPassword(value);
    setKeystrokes((current) => current + 1);

    if (!gameStarted && value.length > 0) {
      setGameStarted(true);
    }
  };

  const resetGame = () => {
    previousPassedRef.current = 0;

    setPassword("");
    setGameStarted(false);
    setSeconds(0);
    setKeystrokes(0);
    setRestoredBanner(false);
  };

  const reaction = useMemo(() => {
    if (!password) {
      return "Enter your password...";
    }

    if (allPassed) {
      return "YOU DID IT?! CONGRATS";
    }

    if (password.length >= 100) {
      return "PLEASE STOP. THIS IS A PASSWORD.";
    }

    if (password.length >= 50) {
      return "This password is becoming a novel...";
    }

    const ratio = passedCount / totalRules;

    if (ratio >= 0.75) {
      return "Okay. You're actually good at this.";
    }

    if (ratio >= 0.5) {
      return "It gets worse from here.";
    }

    if (ratio >= 0.25) {
      return "Not bad. Keep going!";
    }

    return "Let's see what you've got.";
  }, [password, passedCount, totalRules, allPassed]);
  return (
    <div className={invertActive ? "animate-[invertPulse_6s_infinite]" : ""}>
      {}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap');

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-1.2deg) translateX(-3px); }
          50% { transform: rotate(1.2deg) translateX(3px); }
        }
        @keyframes invertPulse {
          0%, 82%, 100% { filter: none; }
          86%, 94% { filter: invert(1); }
        }
        @keyframes hueCycle {
          from { filter: hue-rotate(0deg); }
          to { filter: hue-rotate(360deg); }
        }
      `}</style>

      <div
        className={`flex flex-col justify-start p-4 items-center w-full min-h-screen font-['VT323'] sm:p-8 transition-colors duration-700 ${currentTheme.bg} ${
          chaosBackgroundActive ? "animate-[hueCycle_8s_linear_infinite]" : ""
        }`}
      >
        <div className="w-full max-w-xl space-y-5">
          {}
          <div
            className={`border-4 p-5 shadow-[4px_4px_0px_0px_#000] text-center transition-colors duration-500 ${currentTheme.header}`}
          >
            <h1 className="font-['Press_Start_2P'] text-lg sm:text-xl uppercase mb-1">
              The Password Game
            </h1>

            <p className="text-xl">
              Good luck! {passedCount} / {totalRules} rules passed
            </p>
          </div>

          {}
          <StatsBar
            seconds={seconds}
            keystrokes={keystrokes}
            score={score}
            bestScore={bestScore}
            theme={currentTheme}
            scoreChanged={scoreChanged}
          />

          {}
          {restoredBanner && (
            <div className="bg-blue-100 border-4 border-black p-3 shadow-[4px_4px_0px_0px_#000] flex items-center justify-between">
              <span className="text-lg">
                Welcome back! Progress restored ({restoredProgress}/{totalRules}
                ).
              </span>

              <button
                onClick={() => setRestoredBanner(false)}
                className="font-['Press_Start_2P'] text-[8px] border-2 border-black px-2 py-1 bg-gray-200"
              >
                DISMISS
              </button>
            </div>
          )}

          {}
          <div
            className={`border-4 p-3 shadow-[4px_4px_0px_0px_#000] flex items-center justify-between transition-colors duration-500 ${currentTheme.card}`}
          >
            <span className="font-['Press_Start_2P'] text-[9px] uppercase">
              Curses {cursesEnabled ? "ON" : "OFF"}
            </span>

            <button
              onClick={() => setCursesEnabled((current) => !current)}
              className={`font-['Press_Start_2P'] text-[9px] border-2 border-black px-3 py-1.5 shadow-[2px_2px_0px_0px_#000] uppercase ${
                cursesEnabled
                  ? "bg-[#e63946] text-white"
                  : "bg-[#2ec4b6] text-black"
              }`}
            >
              {cursesEnabled ? "Disable" : "Enable"}
            </button>
          </div>

          {}
          {activeCurses.length > 0 && (
            <div className="bg-[#2b0a3d] border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000]">
              <p className="font-['Press_Start_2P'] text-[9px] text-purple-200 uppercase mb-2">
                Active Curses
              </p>

              {activeCurses.map((curse) => (
                <p key={curse.id} className="text-lg text-purple-100">
                  <span className="font-bold">{curse.name}:</span>{" "}
                  {curse.description}
                </p>
              ))}
            </div>
          )}

          {}
          <div
            className={`border-4 p-4 sm:p-6 shadow-[4px_4px_0px_0px_#000] transition-colors duration-500 ${currentTheme.card} ${
              isShaking ? "animate-[shake_0.3s]" : ""
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-['Press_Start_2P'] text-[9px] border-2 border-black bg-gray-100 px-2 py-0.5">
                Length: {password.length}
              </span>
            </div>

            <div
              className={`relative flex items-center ${
                wiggleActive ? "animate-[wiggle_0.25s_infinite]" : ""
              }`}
            >
              <input
                className={`w-full border-4 p-3 pr-44 text-2xl outline-none transition-all duration-300 ${
                  showPassword ? "blur-0" : "blur-[3px]"
                } ${currentTheme.input}`}
                style={
                  symbolsActive && showPassword
                    ? {
                        WebkitTextFillColor: "transparent",
                      }
                    : undefined
                }
                type={showPassword ? "text" : "password"}
                placeholder="Enter Your Password"
                value={password}
                onChange={handlePasswordChange}
              />

              {}
              {symbolsActive && showPassword && (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center p-3 pr-44 pointer-events-none text-2xl overflow-hidden whitespace-pre"
                >
                  {toCursedGlyphs(password)}
                </div>
              )}

              <div className="absolute right-2 flex space-x-1">
                <button
                  onClick={resetGame}
                  className="font-['Press_Start_2P'] text-[9px] bg-red-400 border-2 border-black px-2 py-1.5 shadow-[2px_2px_0px_0px_#000]"
                >
                  RESET
                </button>

                <button
                  ref={runawayButton}
                  onClick={() => setShowPassword((current) => !current)}
                  style={
                    runawayActive
                      ? {
                          transition: "transform 0.12s ease-out",
                        }
                      : undefined
                  }
                  className={`font-['Press_Start_2P'] text-[9px] border-2 border-black px-2.5 py-1.5 shadow-[2px_2px_0px_0px_#000] ${
                    showPassword ? "scale-100" : "scale-110 rotate-2"
                  } ${currentTheme.accent}`}
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            {}
            <div className="mt-4">
              <div className="flex justify-between mb-1 text-xs font-['Press_Start_2P']">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>

              <div className="w-full h-4 bg-black/20 border-2 border-black p-0.5">
                <div
                  className={`h-full transition-all duration-500 ${
                    allPassed
                      ? "bg-green-400 animate-pulse"
                      : currentTheme.accent
                  }`}
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>

            {}
            <div className="mt-4 text-center">
              <div
                className={`inline-block border-2 border-black px-4 py-2 font-['Press_Start_2P'] text-[9px] shadow-[3px_3px_0px_0px_#000] ${
                  allPassed ? "bg-green-300 animate-bounce" : "bg-white"
                }`}
              >
                {reaction}
              </div>
            </div>
          </div>

          {}
          <div className="space-y-4">
            {visibleRules.map((rule) => (
              <RuleCard key={rule.id} rule={rule} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
