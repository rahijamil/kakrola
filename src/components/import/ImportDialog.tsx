// components/import/ImportDialog.tsx
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { importSources } from "@/config/importSources";
import { ImportSourceType, AnyImportSource } from "@/types/import";
import { cn } from "@/lib/utils";
import ImportSourceCard from "./ImportSourceCard";
import ImportSourceConfig from "./ImportSourceConfig";

export function ImportDialog({
  open,
  onClose,
  source,
}: {
  open: boolean;
  onClose: () => void;
  source: AnyImportSource | null;
}) {
  const [selectedSource, setSelectedSource] = useState<AnyImportSource | null>(
    null
  );
  const [importStep, setImportStep] = useState<
     "configure" | "preview" | "importing"
  >("configure");

  const platformSources = importSources.filter(
    (source) => source.type === ImportSourceType.PLATFORM
  );
  const fileSources = importSources.filter(
    (source) => source.type === ImportSourceType.FILES
  );
  const pasteSources = importSources.filter(
    (source) => source.type === ImportSourceType.PASTE
  );

  useEffect(() => {
    if (source) {
      setSelectedSource(source);
      setImportStep("configure");
    }
  }, [source]);

  const handleSourceSelect = (source: AnyImportSource) => {
    setSelectedSource(source);
    setImportStep("configure");
  };

  const handleClose = () => {
    setSelectedSource(null);
    setImportStep("configure");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Configure Import</DialogTitle>
        </DialogHeader>

        {/* <Tabs
          defaultValue={selectedSource?.type || "platforms"}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="platforms">Platforms</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="paste">Paste</TabsTrigger>
          </TabsList>

          <TabsContent value="platforms" className="mt-4">
            <div className="grid grid-cols-3 gap-4">
              {platformSources.map((source) => (
                <ImportSourceCard
                  key={source.id}
                  source={source}
                  selected={selectedSource?.id === source.id}
                  onSelect={() => handleSourceSelect(source)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="files" className="mt-4">
            <div className="grid grid-cols-3 gap-4">
              {fileSources.map((source) => (
                <ImportSourceCard
                  key={source.id}
                  source={source}
                  selected={selectedSource?.id === source.id}
                  onSelect={() => handleSourceSelect(source)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="paste" className="mt-4">
            <div className="grid grid-cols-3 gap-4">
              {pasteSources.map((source) => (
                <ImportSourceCard
                  key={source.id}
                  source={source}
                  selected={selectedSource?.id === source.id}
                  onSelect={() => handleSourceSelect(source)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs> */}

        {selectedSource && (
          <ImportSourceConfig
            source={selectedSource}
            step={importStep}
            onStepChange={setImportStep}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
