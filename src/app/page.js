"use client";
import { Unlock } from "next/font/google";
import { useEffect, useMemo, useState } from "react";

export default function Home() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const rule_1 = /[a-z]/.test(password);
  const rule_2 = rule_1 && /[0-9]/.test(password);
  const rule_3 = rule_2 && /[A-Z]/.test(password);
  const rule_4 = rule_3 && password.length >= 20;
  const rule_5 = rule_4 && hasNumberEveryFiveChars(password);
  const rule_6 = rule_5 && hasUpperCaseEveryThreeChars(password);
  const rule_7 =
    rule_6 &&
    password.toLowerCase().includes("p") &&
    password.toLowerCase().includes("l") &&
    password.toLowerCase().includes("e") &&
    password.toLowerCase().includes("a") &&
    password.toLowerCase().includes("s") &&
    password.toLowerCase().includes("e");
    const rule_8 = rule_7 && /(I|V|X|L|C|D|M){2,}/.test(password);
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  const rulesList = useMemo(() => {
    return [
      {
        id: 1,
        title: "Must include at least one lowercase letter",
        passed: rule_1,
        unlocked: password,
      },
      {
        id: 2,
        title: "Must include at least one number",
        passed: rule_2,
        unlocked: rule_1,
      },
      {
        id: 3,
        title: "Must include at least one uppercase letter",
        passed: rule_3,
        unlocked: rule_2,
      },
      {
        id: 4,
        title: "Must be at least 20 characters long",
        passed: rule_4,
        unlocked: rule_3,
      },
      {
        id: 5,
        title: "Must include a number in every 5 characters :p",
        passed: rule_5,
        unlocked: rule_4,
      },
      {
        id: 6,
        title:
          "Must include an uppercase letter in every 3 characters after the 15th character ",
        passed: rule_6,
        unlocked: rule_5,
      },
      {
        id: 7,
        title: "Must include the word 'please' because manners matter",
        passed: rule_7,
        unlocked: rule_6,
      },
      {
        id: 8,
        title: "Must include a Roman numeral sequence",
        passed: rule_8,
        unlocked: rule_7,
      },
    ];
  }, [rule_1, rule_2, rule_3, rule_4, rule_5, rule_6, rule_7, rule_8, password]);
  const activeRules = useMemo(() => {
    return rulesList.filter((rev) => rev.unlocked).slice().reverse();
  }, [rulesList]);
  const passedCount = rulesList.filter((rev) => rev.passed).length;
  const progressPercentage = Math.round((passedCount / rulesList.length) * 100);
  const themes = [ 
       {
        bg: "bg-[#f7eed3] text-black selection:bg-[#e6c875]",
        header: "bg-yellow-200 text-black border-black",
        card: "bg-amber-50 border-black text-black",
        input: "bg-gray-100 text-black focus:bg-amber-100 border-black",
        accent: "bg-[#e6c875]",
      },
      {
        bg: "bg-[#fef3c7] text-stone-800 selection:bg-amber-400",
        header: "bg-amber-300 text-stone-800 border-amber-900",
        card: "bg-amber-100 border-amber-900 text-stone-800",
        input: "bg-amber-50 text-stone-800 focus:bg-amber-200 border-amber-900",
        accent: "bg-amber-400",
      },
      {
        bg: "bg-[#ecfccb] text-stone-800 selection:bg-lime-400",
        header: "bg-lime-300 text-stone-800 border-lime-900",
        card: "bg-lime-100 border-lime-900 text-stone-800",
        input: "bg-lime-50 text-stone-800 focus:bg-lime-200 border-lime-900",
        accent: "bg-lime-400",
      },
      {
        bg: "bg-[#cffafe] text-cyan-950 selection:bg-cyan-400",
        header: "bg-cyan-300 text-cyan-950 border-cyan-900",
        card: "bg-cyan-100 border-cyan-900 text-cyan-950",
        input: "bg-cyan-50 text-cyan-950 focus:bg-cyan-200 border-cyan-900",
        accent: "bg-cyan-400",
      },
      {
        bg: "bg-[#dbeafe] text-blue-950 selection:bg-blue-400",
        header: "bg-blue-300 text-blue-950 border-blue-900",
        card: "bg-blue-100 border-blue-900 text-blue-950",
        input: "bg-blue-50 text-blue-950 focus:bg-blue-200 border-blue-900",
        accent: "bg-blue-400",
      },
      {
        bg: "bg-[#0b132b] text-[#1ccd6e] selection:bg-[#1ccd6e]",
        header: "bg-[#1ccd6e] text-[#0b132b] border-[#0b132b]",
        card: "bg-[#1c2541] border-[#1ccd6e] text-[#1ccd6e]",
        input: "bg-[#0b132b] text-[#1ccd6e] focus:bg-[#1c2541] border-[#1ccd6e]",
        accent: "bg-[#1ccd6e]",
      },
      {
        bg: "bg-[#1a0a2e] text-[#e94560] selection:bg-[#e94560]",
        header: "bg-[#e94560] text-white border-[#0f0518]",
        card: "bg-[#2d1b4e] border-[#e94560] text-[#e94560]",
        input: "bg-[#1a0a2e] text-[#e94560] focus:bg-[#2d1b4e] border-[#e94560]",
        accent: "bg-[#e94560]",
      },
      {
        bg: "bg-[#0f0f0f] text-[#f5d300] selection:bg-[#f5d300]",
        header: "bg-[#f5d300] text-[#0f0f0f] border-[#f5d300]",
        card: "bg-[#1a1a1a] border-[#f5d300] text-[#f5d300]",
        input: "bg-[#0f0f0f] text-[#f5d300] focus:bg-[#1a1a1a] border-[#f5d300]",
        accent: "bg-[#f5d300]", 
      },
      {
        bg: "bg-[#fffbeb] text-amber-950 selection:bg-amber-300",
        header: "bg-amber-400 text-amber-950 border-amber-900",
        card: "bg-white border-amber-950 text-amber-950",
        input: "bg-amber-50 text-amber-950 focus:bg-amber-100 border-amber-800",
        accent: "bg-amber-400 hover:bg-amber-300 text-amber-950"
      },
   ]
   const currentTheme = themes[Math.min(passedCount, themes.length - 1)];
  return (
    <div className={`flex flex-col justify-start p-4 items-center w-full min-h-screen text-black font-[VT323] sm:p-8 selection:bg-[#e6c875] transition-colors duration-700 ${currentTheme.bg}`}>
      <div className="w-full max-w-xl space-y-5">
        <div className={`border-4 p-5 shadow-[4px_4px_0px_0px_#000] text-center transition-colors duration-500 ${currentTheme.header}`}>
          <h1 className="font-['Press_Start_2P'] text-lg sm:text-xl uppercase mb-1">
            The Password Game
          </h1>
          <p className="text-xl text-brown-300">Goodluck!</p>
        </div>
        <div className={` border-4 p-4 sm:p-6 shadow-[4px_4px_0px_0px_#000] transition-colors duration-500 ${currentTheme.card}`}>
          <div className="flex justify-between items-center mb-2">
            <span className="font-['Press_Start_2P'] text-[9px] text-black px-2 py-0.5 border-2 border-black bg-gray-100">
              Length: {password.length}
            </span>
          </div>
          <div className="relative flex items-center">
            <input
              className={`w-full border-4 p-3 pr-28 font-['VT323'] text-2xl outline-none transition-colors ${currentTheme.input}`}
              type={showPassword ? "text" : "password"}
              placeholder="Enter Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={() => setShowPassword(!showPassword)} className={`absolute right-2 font-['Press_Start_2P'] text-[9px] bg-[#e6c875] hover:bg-[#d8b863] text-black border-2 border-black px-2.5 py-1.5 shadow-[2px_2px_0px_0px_#000] active:translate-y-[1px] active:shadow-none select-none uppercase ${currentTheme.accent}`}>{showPassword ? "HIDE" : "SHOW"}</button>
          </div>
          <div className="mt-4">
              <div className="flex justify-between items-center mb-1 text-xs font-['Press_Start_2P']">
              <span>Progress</span>
              <span>{progressPercentage}%</span>
              </div>
          </div>
          <div className="w-full h-4 bg-black/20 border-2 border-black p-0.5 overflow-hidden">
            <div className={`h-full transition-all duration-500 ${passedCount === rulesList.length ? "bg-green-400 animate-pulse " : currentTheme.accent || "bg-yellow-400"}`} style={{width: `${progressPercentage}%`}}>
          </div>
          </div>
        </div>
        <div>
          {passedCount === rulesList.length && (
            <div className="bg-green-300 border-4 border-black p-5 shadow-[4px_4px_0px_0px_#000] text-center animate-bounce">
              <h2 className="font-['Press_Start_2P'] text-lg text-black uppercase">Password Accepted!</h2>
              <p className="text-xl mt-2">You survived the game!</p>
            </div>
          )}
        </div>
        <div className="space-y-4">
          {activeRules.map((rule) => {
            const isFailing = !rule.passed;
            return (
              <div key={rule.id} className={`border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000] transition-all ${
                isFailing ? "bg-[#ffdede] border-red-900 text-[#500]" : "bg-[#d8f3dc] border-green-900 text-[#050]"
              }`}>
                <div className="flex items-center justify-between border-b-2 border-black/20 pb-2 mb-2">
                  <div className="font-['Press_Start_2P'] text-[10px] sm:text-xs flex items-center space-x-1">
                    <span>{rule.title}</span>
                  </div>
                  <div className={`font-['Press_Start_2P'] text-[9px] px-2 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] uppercase ${
                    isFailing ? "bg-[#e63946] text-white" : "bg-[#2ec4b6] text-black"
                  }`}>
                    {isFailing ? "FAIL": "PASS"}
                  </div>
                </div>
               </div> 
            )
          })}
        </div>
      </div>
    </div>
  );
}

const hasNumberEveryFiveChars = (password) => {
  for (let i = 0; i < password.length; i += 5) {
    const chunk = password.slice(i, i + 5);
    if (!/[0-9]/.test(chunk)) {
      return false;
    }
  }
  return true;
};

const hasUpperCaseEveryThreeChars = (password) => {
  for (let i = 15; i < password.length; i += 3) {
    const chump = password.slice(i, i + 3);
    if (!/[A-Z]/.test(chump)) {
      return false;
    }
  }
  return true;
};
