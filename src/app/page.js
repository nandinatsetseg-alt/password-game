"use client";
import { Unlock } from "next/font/google";
import { useEffect, useMemo, useState } from "react";

export default function Home() {
  const [password, setPassword] = useState("");
  const rule_1 = (/[a-z]/.test(password))
  const rule_2 = rule_1 &&(/[0-9]/.test(password))
  const rule_3 = rule_2 && (/[A-Z]/.test(password))
  const rule_4 = rule_3 && password.length>=20
  const rule_5 = rule_4 && hasNumberEveryFiveChars(password)
  const rule_6 = rule_5 && hasUpperCaseEveryThreeChars(password)
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link)
      };
    }
  }, [])
  const rulesList = useMemo(() => {
    return [
      {
        id: 1,
        title: "Must include at least one lowercase letter",
        passed: rule_1,
        unlocked: true,
      },
      {
        id: 2,
        title: "Must include at least one number",
        passed: rule_2,
        unlocked: rule_1
      },
      {
        id: 3,
        title: "Must include at least one uppercase letter",
        passed: rule_3,
        unlocked: rule_2
      },
      {}
    ]
  })
  return (
    <div className="flex flex-col justify-center items-center w-full bg-beige">
      <div className="flex flex-col">
        <h1>The Password Game</h1>
        <p>Password</p>
        <input className="w-full" placeholder="Enter Your Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      {password && <div className="text-red-800">
        {!rule_1 && <div>Must include a lowercase letter</div>}
      </div>}
      {rule_1 && <div className="text-red-800">  
        {!rule_2 && <div>Must include a number</div>}
      </div>}
      {rule_2 && <div className="text-red-800">
        {(!rule_3) && <div>Must include an uppercase letter</div>}
      </div>
      }
      {rule_3 && <div className="text-red-800">
        {(!rule_4) && <div>Must be at least 20 characters</div>}
      </div>
      }
      {rule_4 && <div className="text-red-800">
        {!rule_5 && <div>Must include a number every five characters btw :p</div>}
        </div>}
      {rule_5 && <div className="text-red-800">
        {!rule_6 && <div>Must include an uppercase letter every 3 character after the 15th character</div>}
        </div>}
    </div>
  );
}

const hasNumberEveryFiveChars = (password) => {
  for (let i= 0; i<password.length; i+=5) {
    const chunk = password.slice(i, i+5)
    if (!/[0-9]/.test(chunk)) {
      return false
    }
  }
  return true
}

const hasUpperCaseEveryThreeChars = (password) => {
  for (let i= 15; i<password.length; i+=3) {
    const chump = password.slice(i, i+3)
    if (!/[A-Z]/.test(chump)) {
      return false
    }
  }
  return true
}