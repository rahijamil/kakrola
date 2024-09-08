import React, { useMemo, useRef, useState } from "react";
import { MoveUpLeft, UserPlus, X } from "lucide-react";
import { useAuthProvider } from "@/context/AuthContext";
import axios from "axios";
import { Button } from "@/components/ui/button";
import RoleItem from "./RoleItem";
import Spinner from "@/components/ui/Spinner";
import { RoleType } from "@/types/role";

const InviteEmailInput = ({
  projectId,
  teamId,
  error,
  setError,
  searchQuery,
  setSearchQuery,
  emails,
  setEmails,
  fetchPendingUsers
}: {
  projectId?: number | null;
  teamId?: number | null;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  emails: string[];
  setEmails: React.Dispatch<React.SetStateAction<string[]>>;
  fetchPendingUsers?: () => Promise<void>;
}) => {
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const domainSuggestions = ["gmail.com", "outlook.com", "yahoo.com"];
  const [role, setRole] = React.useState<RoleType>(RoleType.MEMBER);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { profile } = useAuthProvider();

  const handleInvite = async () => {
    if (!profile || (!projectId && !teamId)) {
      setError("Invalid project or team context.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/invite/invite-members", {
        emails,
        team_id: teamId,
        project_id: projectId,
        inviter: {
          id: profile.id,
          first_name: profile.full_name.split(" ")[0] || "Unknown User",
          email: profile.email,
        },
      });

      if (response.data.success) {
        setSearchQuery("");
        setSuccessMessage("Invitation sent successfully!");
        setEmails([]);
        if (fetchPendingUsers) fetchPendingUsers();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        throw new Error(response.data.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send invite. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = useMemo(() => {
    if (!searchQuery) return [];

    const trimmedQuery = searchQuery.trim();
    const [localPart, domainPart] = trimmedQuery.split("@");

    // If there's no '@', suggest common domains
    if (!domainPart) {
      return domainSuggestions
        .map((domain) => `${trimmedQuery}@${domain}`)
        .filter(
          (suggestion) =>
            emailRegex.test(suggestion) && !emails.includes(suggestion)
        );
    }

    // If there's an '@', suggest completions based on the domain part
    if (domainPart) {
      const suggestionsBasedOnDomain = domainSuggestions
        .filter((domain) => domain.startsWith(domainPart))
        .map((domain) => `${localPart}@${domain}`)
        .filter(
          (suggestion) =>
            emailRegex.test(suggestion) && !emails.includes(suggestion)
        );

      // If there are suggestions based on the domain part, return them
      if (suggestionsBasedOnDomain.length) {
        return suggestionsBasedOnDomain;
      } else if (localPart && domainPart) {
        // If there are no domain suggestions but localPart exists, return the current search query
        return [searchQuery];
      }
    }

    // Default case: Return the search query if no other suggestions
    return [searchQuery];
  }, [searchQuery, emails]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmedEmail = searchQuery.trim();
      if (trimmedEmail && !emails.includes(trimmedEmail)) {
        if (emailRegex.test(trimmedEmail)) {
          setEmails([...emails, trimmedEmail]);
        } else if (suggestions.length > 0) {
          setEmails([...emails, suggestions[0]]);
        }
        setSearchQuery("");
      }
    } else if (e.key === "Backspace" && searchQuery === "") {
      setEmails(emails.slice(0, -1));
    }
  };

  const handleRemoveEmail = (email: string) => {
    setEmails(emails.filter((e) => e !== email));
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="rounded-2xl border border-text-300 hover:border-text-400 focus-within:border-text-400 bg-transparent focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-300 overflow-hidden w-full">
          <div className="flex flex-col p-1">
            {emails.length > 0 && (
              <div className="flex justify-between gap-1">
                <div className="space-y-1">
                  {emails.map((email) => (
                    <div
                      key={email}
                      className={`flex items-center px-2 py-1 rounded-full shadow-sm w-fit border ${
                        !emailRegex.test(email)
                          ? "border-red-500 text-red-500 bg-red-50"
                          : "bg-text-100 border-text-300 text-text-700"
                      }`}
                    >
                      <span className="text-xs text-text-700">
                        {email.length > 20 ? `${email.slice(0, 20)}...` : email}
                      </span>
                      <button
                        onClick={() => handleRemoveEmail(email)}
                        className="ml-2 text-text-500 hover:text-text-600 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <RoleItem
                  value={role}
                  onChange={(newRole) => setRole(newRole)}
                />
              </div>
            )}
            
            <input
              ref={inputRef}
              type="text"
              placeholder={
                (emails.length === 0 && "Add email with Enter or comma") || ""
              }
              value={searchQuery}
              onChange={(e) => {
                setError(null);
                setSearchQuery(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              aria-label="Search or add email"
              className={`flex-1 bg-transparent focus:outline-none border-none placeholder-gray-500 w-full pl-1 ${emails.length > 0 ? "pt-1" : "pt-0.5"}`}
            />
          </div>
        </div>
        <Button
          size="sm"
          onClick={handleInvite}
          disabled={emails.length === 0 || isLoading}
        >
          {isLoading ? <Spinner color="white" /> : "Invite"}
        </Button>
      </div>
      {successMessage && (
        <p className="mt-2 p-2 text-green-500 text-xs">{successMessage}</p>
      )}
      {error && <p className="mt-2 p-2 text-red-500 text-xs">{error}</p>}
      {suggestions.length > 0 && (
        <div className="mt-2 p-2 shadow-lg border border-text-200 bg-background rounded-xl z-10">
          <p className="text-xs font-medium mb-1">
            Keep typing an email to invite
          </p>
          {suggestions.map((suggestion) => (
            <div
              key={suggestion}
              className="flex items-center justify-between gap-2 px-2 py-1 hover:bg-text-100 rounded-lg cursor-pointer transition"
              onClick={() => {
                if (suggestion) {
                  setEmails([...emails, suggestion]);
                  setSearchQuery("");
                  inputRef.current?.focus();
                }
              }}
              role="option"
            >
              <div className="flex items-center gap-2">
                <UserPlus className="text-text-400 w-4 h-4" />
                <span>{suggestion}</span>
              </div>

              <MoveUpLeft strokeWidth={1.5} className="w-4 h-4" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InviteEmailInput;
