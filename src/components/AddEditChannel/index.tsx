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
import PortalWrapper from "../PortalWrapper";
import { TeamType } from "@/types/team";
import { Dialog, DialogContent } from "../ui/dialog";

const AddEditChannel = ({
  teamId,
  channel,
  onClose,
  page,
  aboveBellow,
}: {
  teamId: TeamType["id"];
  channel?: ChannelType;
  onClose: () => void;
  page?: PageType;
  aboveBellow?: "above" | "below" | null;
}) => {
  const { screenWidth } = useScreen();
  const { profile } = useAuthProvider();

  const { teams, channels, setChannels } = useSidebarDataProvider();

  const [channelName, setChannelName] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  const findTeam = teams.find((team) => team.id === teamId);

  if (!findTeam) return null;

  const forEdit = !!channel && !aboveBellow;

  const handleAddChannel = async () => {
    if (!profile?.id || !teamId || !profile.metadata?.current_workspace_id)
      return;

    if (!channelName) {
      setError("Channel name is required.");
      return;
    }

    try {
      setLoading(true);
      if (error) setError(null);

      const targetChannelOrder = channel?.settings.order;
      let newOrder: number;
      if (targetChannelOrder === undefined) {
        newOrder = channels.length + 1;
      } else {
        const sortedchannels = [...channels].sort(
          (a, b) => Number(a.id) - Number(b.id)
        );
        // Find the current index based on the channel's order
        const currentIndex = sortedchannels.findIndex(
          (ch) => ch.settings.order === targetChannelOrder
        );

        if (aboveBellow === "above") {
          const prevPage = sortedchannels[currentIndex - 1];
          newOrder = prevPage
            ? (Number(prevPage.id) + targetChannelOrder) / 2
            : targetChannelOrder - 0.5;
        } else {
          // "below"
          const nextPage = sortedchannels[currentIndex + 1];
          newOrder = nextPage
            ? (targetChannelOrder + Number(nextPage.id)) / 2
            : targetChannelOrder + 0.5;
        }
      }

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
          order: newOrder,
        },
        workspace_id: profile.metadata.current_workspace_id,
      };

      if (forEdit) {
        // optimistic udpate
      } else {
        // optimistic udpate

        const { data, error } = await supabaseBrowser
          .from("channels")
          .insert(channelData)
          .select("id")
          .single();

        if (error) throw error;
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
    <PortalWrapper>
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="w-full md:max-w-md h-screen md:h-auto [&>button]:hidden md:[&>button]:block p-0 md:p-6">
          <div className="space-y-6 md:space-y-8">
            {screenWidth > 768 ? (
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
            ) : (
              <div className="flex justify-between items-center px-4 py-2 border-b border-text-100 h-[53px]">
                <div className="flex items-center gap-3">
                  <button onClick={onClose} className="w-6 h-6">
                    <ChevronLeft strokeWidth={1.5} size={24} />
                  </button>

                  <div>
                    <h1 className="font-medium">
                      {page && !aboveBellow
                        ? "Edit Channel"
                        : "Create a Channel"}
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

            <div className="md:space-y-8 p-4 md:p-0">
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

                  <div className="py-4 md:py-0 whitespace-normal text-xs">
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
                            <Spinner color="white" size="sm" />

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
          </div>
        </DialogContent>
      </Dialog>
    </PortalWrapper>
  );
};

export default AddEditChannel;
