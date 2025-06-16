"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function Home() {

  const { data: session } = authClient.useSession() 

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async () => {
    authClient.signUp.email({
      email,
      name,
      password,
    }, {
      onSuccess: () => {
        window.alert("Success!");
      },
      onError: () => {
        window.alert("Something went wrong, please try again.");
    }
    });
  }

    const onLogin = async () => {
    authClient.signIn.email({
      email,
      password,
    }, {
      onSuccess: () => {
        window.alert("Success!");
      },
      onError: () => {
        window.alert("Something went wrong, please try again.");
    }
    });
  }

  if (session) {
    <div className=" flex flex-col p-4 gap-y-4">
      <p>Logged in as {session.user.name}</p>
      <Button onClick={() => authClient.signOut()}>
        Sign Out 
      </Button>
    </div>
  }

  return (
    <div className="flex flex-col gap-y-20">
    <div className=" p-4 flex flex-col gap-y-4">
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button onClick={onSubmit}>
        Sign Up
      </Button>
    </div>
    <div className=" p-4 flex flex-col gap-y-4">
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button onClick={onLogin}>
        Login
      </Button>
    </div>
    </div>
  )
}
