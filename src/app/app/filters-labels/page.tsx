"use client";
import LayoutWrapper from "@/components/LayoutWrapper";
import { ChevronRightIcon, Droplet, Plus, Tag } from "lucide-react";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import AddLabelModal from "./AddLabelModal";
import { useAuthProvider } from "@/context/AuthContext";
import { supabaseBrowser } from "@/utils/supabase/client";
import { TaskLabelType } from "@/types/project";

const FiltersLabelsPage = () => {
  const { profile } = useAuthProvider();
  const [isFilterCollapse, setIsFilterCollapse] = React.useState(false);
  const [showAddFilterModal, setShowAddFilterModal] = React.useState(false);
  const [isLabelCollapse, setIsLabelCollapse] = React.useState(false);
  const [showAddLabelModal, setShowAddLabelModal] = React.useState(false);

  const [labels, setLabels] = React.useState<TaskLabelType[]>([]);

  useEffect(() => {
    const fetchLabels = async () => {
      if (profile?.id) {
        try {
          const { data, error } = await supabaseBrowser
            .from("task_labels")
            .select("*")
            .eq("profile_id", profile?.id);

          if (!error) {
            setLabels(data || []);
          } else {
            throw error;
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchLabels();
  }, [profile?.id]);

  return (
    <>
      <LayoutWrapper headline="Filters & Labels" view="List">
        <div className="space-y-8">
          <div className="flex items-start gap-1">
            <button
              className={`p-1 hover:bg-text-100 transition rounded-full mt-1 ${
                !isFilterCollapse && "rotate-90"
              }`}
              onClick={() => setIsFilterCollapse(!isFilterCollapse)}
            >
              <ChevronRightIcon
                className="w-4 h-4 text-text-700"
                strokeWidth={1.5}
              />
            </button>

            <div className="w-full">
              <div className="flex items-center justify-between gap-8 border-b border-text-200 w-full p-1">
                <h3 className="font-bold">Filters</h3>

                <button
                  className={`p-1 hover:bg-text-100 transition rounded-full`}
                  onClick={() => setShowAddFilterModal(true)}
                >
                  <Plus className="w-4 h-4 text-text-700" strokeWidth={1.5} />
                </button>
              </div>

              {!isFilterCollapse && (
                <motion.div
                  initial={{ opacity: 0.5, height: 0, y: -10 }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                    y: 0,
                    transition: { type: "spring" },
                  }}
                  exit={{ opacity: 0.5, height: 0, y: -10 }}
                >
                  <ul>
                    <li
                      className={`border-b border-text-200 flex items-center gap-2 cursor-pointer py-2`}
                    >
                      <Droplet
                        strokeWidth={1.5}
                        className="w-4 h-4 text-text-500"
                      />
                      Assigned to me
                    </li>
                    <li
                      className={`border-b border-text-200 flex items-center gap-2 cursor-pointer py-2`}
                    >
                      <Droplet
                        strokeWidth={1.5}
                        className="w-4 h-4 text-text-500"
                      />
                      Priority 1
                    </li>
                  </ul>
                </motion.div>
              )}
            </div>
          </div>

          <div className="flex items-start gap-1">
            <button
              className={`p-1 hover:bg-text-100 transition rounded-full mt-1 ${
                !isLabelCollapse && "rotate-90"
              }`}
              onClick={() => setIsLabelCollapse(!isLabelCollapse)}
            >
              <ChevronRightIcon
                className="w-4 h-4 text-text-700"
                strokeWidth={1.5}
              />
            </button>

            <div className="w-full">
              <div className="flex items-center justify-between gap-8 border-b border-text-200 w-full p-1">
                <h3 className="font-bold">Labels</h3>

                <button
                  className={`p-1 hover:bg-text-100 transition rounded-full`}
                  onClick={() => setShowAddLabelModal(true)}
                >
                  <Plus className="w-4 h-4 text-text-700" strokeWidth={1.5} />
                </button>
              </div>

              {!isLabelCollapse && (
                <motion.div
                  initial={{ opacity: 0.5, height: 0, y: -10 }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                    y: 0,
                    transition: { type: "spring" },
                  }}
                  exit={{ opacity: 0.5, height: 0, y: -10 }}
                >
                  <ul>
                    {labels.map((label) => (
                      <li
                        className={`border-b border-text-200 flex items-center gap-2 cursor-pointer py-2`}
                      >
                        <Tag
                          strokeWidth={1.5}
                          className="w-4 h-4 text-text-500"
                        />
                        {label.name}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </LayoutWrapper>

      {showAddLabelModal && (
        <AddLabelModal onClose={() => setShowAddLabelModal(false)} />
      )}
    </>
  );
};

export default FiltersLabelsPage;
