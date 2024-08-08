"use client";

import { useState } from "react";
import { AtSign, TrashIcon, User } from "lucide-react";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";

export default function AccountSettingsPage() {
  const [username, setUsername] = useState("mohammadrahi003");
  const [email, setEmail] = useState("mohammadrahi003@gmail.com");
  const [newPassword, setNewPassword] = useState("");
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  return (
    <div className="space-y-6">
      <section className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Plan</h2>
          <p className="text-sm text-gray-500">Beginner</p>
        </div>
        <Button variant="outline" size="sm">
          Manage plan
        </Button>
      </section>

      <div className="h-[1px] bg-gray-100"></div>

      <section className="space-y-4 max-w-sm">
        <div className="flex items-center space-x-4">
          <img
            src="https://i.pravatar.cc/150?img=3" // Replace with your image path
            alt="Profile Picture"
            width={64}
            height={64}
            className="rounded-full"
          />

          <div>
            <Button variant="outline" size="sm">
              Change photo
            </Button>
            <Button variant="outline" color="red" size="sm" className="ml-2">
              Remove photo
            </Button>
            <p className="text-xs text-gray-500 mt-1">
              Pick a photo up to 4MB. Your avatar photo will be public.
            </p>
          </div>
        </div>

        <div>
          <Input
            id="username"
            label="Name"
            placeholder="Enter your name"
            Icon={User}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label className="font-bold">Email</label>
          <p>{email}</p>
          <Button variant="outline" size="sm" className="w-fit">
            Change email
          </Button>
        </div>

        <div className="flex flex-col space-y-1">
          <label className="font-bold">Password</label>
          <Button variant="outline" size="sm" className="w-fit">
            Add Password
          </Button>
        </div>

        <div className="space-y-1">
          <p className="font-bold">Two-factor authentication</p>
          <ToggleSwitch
            id="2fa"
            size="sm"
            checked={twoFactorAuth}
            onCheckedChange={() => setTwoFactorAuth(!twoFactorAuth)}
          />
          <p className="text-sm text-gray-500">
            2FA is {twoFactorAuth ? "enabled" : "disabled"} on your Todoist
            account.
          </p>
        </div>
      </section>

      <div className="h-[1px] bg-gray-100"></div>

      <section className="space-y-3">
        <div className="space-y-1">
          <h3 className="font-bold">Connected accounts</h3>
          <p className="text-xs text-gray-500">
            Log in to Todoist with your Google, Facebook, or Apple account.
          </p>
        </div>
        <p className="text-sm text-gray-700">
          You can log in to Todoist with your Google account {email}.
        </p>
        <p className="text-sm text-gray-500">
          Your password is not set, so we cannot disconnect you from your Google
          account. If you want to disconnect, please{" "}
          <a href="#" className="text-blue-500">
            set up your password
          </a>{" "}
          first.
        </p>

        <div className="space-y-2 max-w-sm">
          <Button variant="outline" size="sm" className="w-full mt-2">
            <div className="flex items-center justify-center space-x-2">
              <i className="fab fa-facebook-square"></i>{" "}
              {/* Replace with an icon component */}
              <span>Connect with Facebook</span>
            </div>
          </Button>

          <Button variant="outline" size="sm" className="w-full mt-2">
            <div className="flex items-center justify-center space-x-2">
              <i className="fab fa-apple"></i>{" "}
              {/* Replace with an icon component */}
              <span>Connect with Apple</span>
            </div>
          </Button>
        </div>
      </section>

      <div className="h-[1px] bg-gray-100"></div>

      <section className="space-y-3">
        <div className="space-y-1">
          {" "}
          <h3 className="font-bold">Delete account</h3>
          <p className="text-gray-500 text-xs">
            This will immediately delete all of your data including tasks,
            projects, comments, and more. This can’t be undone.
          </p>
        </div>
        <Button variant="outline" color="red" size="sm" className="mt-2">
          <TrashIcon className="w-5 h-5 mr-2" />
          Delete account
        </Button>
      </section>
    </div>
  );
}
