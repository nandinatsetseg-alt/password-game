"use client";
import { useState } from "react";

export default function Home() {
  const [password, setPassword] = useState("");
  return (
    <div>
      <div>
        <h1>The Password Game</h1>
        <p>Password</p>
        <input placeholder="Enter Your Password" value={password} />
      </div>
    </div>
  );
}
