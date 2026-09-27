"use client";

import { useEffect, useMemo, useState } from "react";

export default function Home() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  // Add near the top component:

  const [isBreached, setIsBreached] = useState(null); // null = not checked yet, true/false after

  const [checkingBreach, setCheckingBreach] = useState(false);

  useEffect(() => {
    if (!password) {
      setIsBreached(null);

      return;
    }

    const timeout = setTimeout(async () => {
      setCheckingBreach(true);

      try {
        const encoder = new TextEncoder();

        const data = encoder.encode(password);

        const hashBuffer = await crypto.subtle.digest("SHA-1", data);

        const hashArray = Array.from(new Uint8Array(hashBuffer));

        const hashHex = hashArray
          .map((b) => b.toString(16).padStart(2, "0"))

          .join("")

          .toUpperCase();

        const prefix = hashHex.slice(0, 5);

        const suffix = hashHex.slice(5);

        const res = await fetch(
          `https://api.pwnedpasswords.com/range/${prefix}`,
        );

        const text = await res.text();

        const found = text
          .split("\r\n")

          .some((line) => line.split(":")[0] === suffix);

        setIsBreached(found);
      } catch (e) {
        setIsBreached(null); // fail open â€” don't block on network errors
      } finally {
        setCheckingBreach(false);
      }
    }, 600); // debounce: wait 600ms after typing stops

    return () => clearTimeout(timeout);
  }, [password]);

  useEffect(() => {
    const link = document.createElement("link");

    link.href =
      "https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap";

    link.rel = "stylesheet";

    document.head.appendChild(link);

    return () => {
      if (document.head.contains(link)) document.head.removeChild(link);
    };
  }, []);

  const rulesList = useMemo(() => {
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

        passed: hasNumberEveryFiveChars(password),
      },

      {
        id: 6,

        title:
          "Must include an uppercase letter in every 3 characters after the 15th character",

        passed: hasUpperCaseEveryThreeChars(password),
      },

      {
        id: 7,

        title: "Must include the word 'please' because manners matter",

        passed: password.toLowerCase().includes("please"),
      },
      {
        id: 8,
        title: "Must include the Mongolian word for banana",
        passed:
          password.toLowerCase().includes("гадил") ||
          password.toLowerCase().includes("банана"),
      },
      {
        id: 9,

        title: checkingBreach
          ? "Checking if this password has been breached..."
          : "Must NOT be a password found in a known data breach",

        passed: isBreached === false,
      },
    ];
  }, [password, isBreached, checkingBreach]);

  const firstFailingIndex = rulesList.findIndex((r) => !r.passed);

  const visibleCount =
    firstFailingIndex === -1 ? rulesList.length : firstFailingIndex + 1;

  // Newest/currently-failing rule on top, like the styled version's activeRules.

  const visibleRules = rulesList.slice(0, visibleCount).slice().reverse();

  const passedCount = rulesList.filter((r) => r.passed).length;

  return (
    <div className="flex flex-col justify-start p-4 items-center w-full min-h-screen bg-[#f7eed3] text-black font-[VT323] sm:p-8 selection:bg-[#e6c875]">
      <div className="w-full max-w-xl space-y-5">
        <div className="bg-yellow-200 border-4 border-black p-5 shadow-[4px_4px_0px_0px_#000] text-center">
          <h1 className="font-['Press_Start_2P'] text-lg sm:text-xl text-black uppercase mb-1">
            The Password Game
          </h1>
          <p className="text-xl text-brown-300">
            {passedCount} / {rulesList.length} rules passed
          </p>
        </div>

        <div className="bg-amber-50 border-4 border-black p-4 sm:p-6 shadow-[4px_4px_0px_0px_#000]">
          <div className="flex justify-between items-center mb-2">
            <span className="font-['Press_Start_2P'] text-[9px] text-black px-2 py-0.5 border-2 border-black bg-gray-100">
              Length: {password.length}
            </span>
          </div>
          <div className="relative flex items-center">
            <input
              className="w-full bg-gray-100 border-4 border-black p-3 pr-28 font-['VT323'] text-2xl text-black outline-none focus:bg-amber-100"
              type={showPassword ? "text" : "password"}
              placeholder="Enter Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 font-['Press_Start_2P'] text-[9px] bg-[#e6c875] hover:bg-[#d8b863] text-black border-2 border-black px-2.5 py-1.5 shadow-[2px_2px_0px_0px_#000] active:translate-y-[1px] active:shadow-none select-none uppercase"
            >
              {showPassword ? "HIDE" : "SHOW"}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {visibleRules.map((rule) => {
            const isFailing = !rule.passed;

            return (
              <div
                key={rule.id}
                className={`border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000] transition-all ${
                  isFailing
                    ? "bg-[#ffdede] border-red-900 text-[#500]"
                    : "bg-[#d8f3dc] border-green-900 text-[#050]"
                }`}
              >
                <div className="flex items-center justify-between border-b-2 border-black/20 pb-2 mb-2">
                  <div className="font-['Press_Start_2P'] text-[10px] sm:text-xs flex items-center space-x-1">
                    <span>{rule.title}</span>
                  </div>
                  <div
                    className={`font-['Press_Start_2P'] text-[9px] px-2 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] uppercase ${
                      isFailing
                        ? "bg-[#e63946] text-white"
                        : "bg-[#2ec4b6] text-black"
                    }`}
                  >
                    {isFailing ? "FAIL" : "PASS"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const hasNumberEveryFiveChars = (password) => {
  for (let i = 0; i < password.length; i += 5) {
    const chunk = password.slice(i, i + 5);

    if (!/[0-9]/.test(chunk)) return false;
  }

  return true;
};

const hasUpperCaseEveryThreeChars = (password) => {
  for (let i = 15; i < password.length; i += 3) {
    const chunk = password.slice(i, i + 3);

    if (!/[A-Z]/.test(chunk)) return false;
  }

  return true;
};
