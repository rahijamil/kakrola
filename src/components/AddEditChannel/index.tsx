import useScreen from "@/hooks/useScreen";
import { PageType } from "@/types/pageTypes";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, Hash, Lock, X } from "lucide-react";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { generateSlug } from "@/utils/generateSlug";
import { Button } from "../ui/button";
import Spinner from "../ui/Spinner";
import { useAuthProvider } from "@/context/AuthContext";
import { supabaseBrowser } from "@/utils/supabase/client";
import { ChannelType } from "@/types/channel";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";

const AddEditChannel = ({
  teamId,
  channelId,
  onClose,
  page,
  aboveBellow,
}: {
  teamId: number;
  channelId?: number;
  onClose: () => void;
  page?: PageType;
  aboveBellow?: "above" | "below" | null;
}) => {
  const { screenWidth } = useScreen();
  const { profile } = useAuthProvider();

  const { teams } = useSidebarDataProvider();

  const [channelName, setChannelName] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  const findTeam = teams.find((team) => team.id === teamId);

  if (!findTeam) return null;

  const forEdit = !!channelId;

  const handleAddChannel = async () => {
    if (!profile?.id || !teamId) return;

    if (!channelName) {
      setError("Channel name is required.");
      return;
    }

    try {
      setLoading(true);
      if (error) setError(null);

      if (forEdit) {
      } else {
        if (aboveBellow) {
        } else {
          const channelData: Omit<ChannelType, "id"> = {
            name: channelName,
            slug: generateSlug(channelName),
            team_id: teamId,
            profile_id: profile.id,
            description: "",
            is_archived: false,
            is_private: visibility === "private",
            settings: {
              color: "gray-500",
            },
          };

          const { data, error } = await supabaseBrowser
            .from("channels")
            .insert(channelData);

          if (error) throw error;
        }
      }
    } catch (error: any) {
      console.error(error);
      error.message && setError(error.message);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{ opacity: 1, y: 0 }}
          exit={{
            opacity: 0,
            y: 20,
          }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="bg-surface md:rounded-lg md:shadow-xl w-full space-y-6 md:space-y-8 max-w-md md:p-8 h-full md:h-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {screenWidth > 768 ? (
            <div className="flex justify-between items-center">
              <div>
                <h1 className="font-semibold text-xl">
                  {page && !aboveBellow ? "Edit Channel" : "Create a Channel"}
                </h1>
                {currentStep == 2 && (
                  <span className="text-text-500 flex items-center text-xs gap-0.5">
                    {visibility == "public" ? (
                      <Hash strokeWidth={1.5} size={12} />
                    ) : (
                      <Lock strokeWidth={1.5} size={12} />
                    )}
                    {channelName}
                  </span>
                )}
              </div>

              <button
                onClick={onClose}
                className="text-text-500 hover:text-text-700 hover:bg-text-100 transition p-1 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center px-4 py-2 border-b border-text-100">
              <div className="flex items-center gap-3">
                <button onClick={onClose} className="w-6 h-6">
                  <ChevronLeft strokeWidth={1.5} size={24} />
                </button>

                <div>
                  <h1 className="font-medium">
                    {page && !aboveBellow ? "Edit Channel" : "Create a Channel"}
                  </h1>

                  {currentStep == 2 && (
                    <span className="text-text-500 flex items-center text-xs gap-0.5">
                      {visibility == "public" ? (
                        <Hash strokeWidth={1.5} size={12} />
                      ) : (
                        <Lock strokeWidth={1.5} size={12} />
                      )}
                      {channelName}
                    </span>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || !channelName.trim()}
                size="xs"
                variant="ghost"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Spinner color="white" />

                    {page && !aboveBellow ? (
                      <span>Editing...</span>
                    ) : (
                      <span>Creating...</span>
                    )}
                  </div>
                ) : page && !aboveBellow ? (
                  "Edit"
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          )}

          <div className="md:space-y-8">
            {currentStep == 1 ? (
              <div className="md:space-y-2">
                <Input
                  type="text"
                  value={channelName}
                  onChange={(e) => {
                    setChannelName(e.target.value);
                  }}
                  required
                  autoFocus
                  label="Name"
                  Icon={Hash}
                  placeholder="e.g. Marketing, Design, Product"
                />

                <div className="p-4 md:p-0 whitespace-normal text-xs">
                  {error ? (
                    <p className="text-red-500 text-center">{error}</p>
                  ) : screenWidth > 768 ? (
                    <p className="text-text-500">
                      Channels are where conversations happen around a topic.
                      Use a name that is easy to find and understand.
                    </p>
                  ) : (
                    <p className="text-text-500 p-2 rounded-lg border border-text-100 bg-background">
                      Channels are where conversations happen around a topic.
                      Use a name that is easy to find and understand.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="font-semibold text-text-700 pl-4 md:p-0">
                  Visibility
                </label>

                <div
                  className="mt-1.5 flex items-center gap-4 pl-4 md:p-0 cursor-pointer"
                  onClick={() => setVisibility("public")}
                >
                  <Input
                    type="radio"
                    id="public"
                    name="visibility"
                    value="public"
                    checked={visibility === "public"}
                    onChange={() => setVisibility("public")}
                    className="pointer-events-none"
                  />
                  <div className="text-text-500">
                    Public — anyone in {findTeam.name}
                  </div>
                </div>
                <div
                  className="flex items-center gap-4 pl-4 md:p-0 cursor-pointer"
                  onClick={() => setVisibility("private")}
                >
                  <Input
                    type="radio"
                    id="private"
                    name="visibility"
                    value="private"
                    checked={visibility === "private"}
                    onChange={() => setVisibility("private")}
                    className="pointer-events-none"
                  />
                  <div className="text-text-500">
                    Private — only specific people
                    <br />
                    Can only be viewed or joined by invitation
                  </div>
                </div>
              </div>
            )}

            {screenWidth > 768 &&
              (currentStep == 1 ? (
                <div className="flex items-center justify-between gap-8">
                  <div className="text-text-500">Step {currentStep} of 2</div>
                  <Button
                    type="button"
                    onClick={() => {
                      if (channelName.trim()) {
                        setCurrentStep(2);
                      }
                    }}
                    disabled={!channelName.trim()}
                  >
                    Next
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="text-text-500">Step {currentStep} of 2</div>

                  <div className="flex items-center gap-4">
                    <Button
                      onClick={() => setCurrentStep(1)}
                      disabled={loading}
                      type="button"
                      variant="outline"
                    >
                      Back
                    </Button>

                    <Button
                      onClick={handleAddChannel}
                      disabled={loading || !channelName.trim()}
                      type="button"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <Spinner color="white" size='sm' />

                          {page && !aboveBellow ? (
                            <span>Editing...</span>
                          ) : (
                            <span>Creating...</span>
                          )}
                        </div>
                      ) : page && !aboveBellow ? (
                        "Edit"
                      ) : (
                        "Create"
                      )}
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddEditChannel;