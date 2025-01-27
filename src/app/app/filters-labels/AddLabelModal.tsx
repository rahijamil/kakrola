import ColorSelector from "@/components/AddEditProject/ColorSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/Spinner";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { useAuthProvider } from "@/context/AuthContext";
import {
  ActivityAction,
  createActivityLog,
  EntityType,
} from "@/types/activitylog";
import { TaskLabelType } from "@/types/project";
import { generateSlug } from "@/utils/generateSlug";
import { supabaseBrowser } from "@/utils/supabase/client";
import { Tag, X } from "lucide-react";
import React, { useState } from "react";

const AddLabelModal = ({ onClose }: { onClose: () => void }) => {
  const { profile } = useAuthProvider();

  const [labelData, setLabelData] = useState<Omit<TaskLabelType, "id">>({
    name: "",
    slug: "",
    color: "gray-500",
    profile_id: profile?.id || "",
    is_favorite: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (!labelData.name.trim()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (profile) {
        const dataToInsert: Omit<TaskLabelType, "id"> = {
          color: labelData.color,
          name: labelData.name.trim(),
          slug: labelData.slug.trim(),
          is_favorite: labelData.is_favorite,
          profile_id: profile.id,
        };

        const { data, error } = await supabaseBrowser
          .from("task_labels")
          .insert(dataToInsert)
          .select()
          .single();

        if (error) throw error;

        createActivityLog({
          actor_id: profile.id,
          action: ActivityAction.CREATED_LABEL,
          entity: {
            type: EntityType.LABEL,
            id: data.id,
            name: data.name,
          },
          metadata: {
            new_data: data,
          },
        });
      }
    } catch (error: any) {
      console.error(`Error: ${error.message}`);
      setError(error.message);
    } finally {
      setLoading(false);
      onClose();
    }
  };
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-lg shadow-xl w-full max-w-md mx-4"
        onClick={(ev) => ev.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-text-100">
          <h2 className="text-xl font-semibold">Add label</h2>
          <button
            onClick={onClose}
            className="text-text-500 hover:text-text-700 hover:bg-text-100 transition p-1 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 p-4">
            <Input
              howBig="sm"
              type="text"
              id="name"
              label="Name"
              value={labelData.name}
              onChange={(ev) => {
                setLabelData({
                  ...labelData,
                  name: ev.target.value,
                  slug: generateSlug(ev.target.value),
                });
              }}
              placeholder="Label name"
              required
              autoComplete="off"
              autoFocus
            />

            <ColorSelector
              height="h-8"
              value={labelData.color}
              onChange={(color) => setLabelData({ ...labelData, color })}
            />

            <div>
              <button
                className="flex items-center space-x-2 w-full"
                type="button"
                onClick={() =>
                  setLabelData({
                    ...labelData,
                    is_favorite: !labelData.is_favorite,
                  })
                }
              >
                <ToggleSwitch
                  checked={labelData.is_favorite}
                  onCheckedChange={(value) =>
                    setLabelData({ ...labelData, is_favorite: value })
                  }
                />

                <span>Add to favorites</span>
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          <div className="flex items-center justify-end gap-4 border-t border-text-100 p-4">
            <Button
              type="button"
              variant="ghost"
              disabled={loading}
              size="sm"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={labelData.name.trim().length == 0 || loading}
              size="sm"
            >
              {loading ? <Spinner color="white" /> : "Add"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLabelModal;
