import {
  AnyImportSource,
  ImportSourceType,
  ImportedData,
} from "@/types/import";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import StepIndicator from "./StepIndicator";
import PlatformImportConfig from "./PlatformImportConfig";
import FileImportConfig from "./FileImportConfig";
import PasteImportConfig from "./PasteImportConfig";
import { AlertCircle, ArrowLeft, ArrowRight, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ImportSourceConfig({
  source,
  step,
  onStepChange,
  onClose,
}: {
  source: AnyImportSource;
  step: "configure" | "preview" | "importing";
  onStepChange: (step: "configure" | "preview" | "importing") => void;
  onClose: () => void;
}) {
  const [importData, setImportData] = useState<ImportedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDataReceived = (data: ImportedData) => {
    setError(null);
    setImportData(data);
    onStepChange("preview");
  };

  const handleBack = () => {
    switch (step) {
      case "preview":
        onStepChange("configure");
        break;
      case "importing":
        onStepChange("preview");
        break;
    }
  };

  const handleNext = async () => {
    if (!importData && step === "configure") {
      setError("Please import some data before continuing");
      return;
    }

    switch (step) {
      case "configure":
        onStepChange("preview");
        break;
      case "preview":
        setIsProcessing(true);
        try {
          // Here you would process the importData
          // For example: await processImport(importData);
          onStepChange("importing");
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Failed to process import"
          );
        } finally {
          setIsProcessing(false);
        }
        break;
      case "importing":
        onClose();
        break;
    }
  };

  const renderContent = () => {
    switch (step) {
      case "configure":
        switch (source.type) {
          case ImportSourceType.PLATFORM:
            return (
              <PlatformImportConfig
                source={source}
                onData={handleDataReceived}
              />
            );
          case ImportSourceType.FILES:
            return (
              <FileImportConfig source={source} onData={handleDataReceived} />
            );
          case ImportSourceType.PASTE:
            return (
              <PasteImportConfig source={source} onData={handleDataReceived} />
            );
        }
      case "preview":
        return (
          <div className="space-y-4">
            <h4 className="font-medium">Preview Import Data</h4>
            <div className="border rounded-lg p-4 max-h-[400px] overflow-y-auto">
              {importData ? (
                <pre className="text-sm whitespace-pre-wrap">
                  {JSON.stringify(importData, null, 2)}
                </pre>
              ) : (
                <p className="text-gray-500">No data to preview</p>
              )}
            </div>
          </div>
        );

      case "importing":
        return (
          <div className="text-center py-8">
            <h4 className="font-medium mb-4">Import Complete</h4>
            <p className="text-gray-500">
              Successfully imported {importData?.items.length || 0} items
            </p>
          </div>
        );
    }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-end mb-4">
        {/* <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium">Configure Import</h3>
        </div> */}
        <StepIndicator currentStep={step} />
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {renderContent()}

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={step === "configure" || isProcessing}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Button onClick={handleNext} disabled={isProcessing}>
          {step === "importing" ? (
            "Close"
          ) : (
            <>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
