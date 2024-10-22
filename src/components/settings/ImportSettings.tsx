import React, { useEffect, useState } from "react";
import { importSources } from "@/config/importSources";
import { ImportDialog } from "@/components/import/ImportDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { AnyImportSource } from "@/types/import";
import { useSearchParams } from "next/navigation";

const ImportSettings = () => {
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<AnyImportSource | null>(
    null
  );

  const searchParams = useSearchParams();
  const provider = searchParams.get("provider");

  useEffect(() => {
    const findSource = importSources.find((source) => source.id == provider);
    if (findSource) {
      setSelectedSource(findSource);
      setIsImportDialogOpen(true)
    }
  }, [provider]);

  // const [recentImports, setRecentImports] = useState<
  //   { name: string; date: string; items: number }[]
  // >([
  //   // Example data - in real app, fetch this from your backend
  //   { name: "Project Tasks.csv", date: "2024-03-15", items: 24 },
  //   { name: "Trello Board", date: "2024-03-10", items: 56 },
  // ]);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <h2>Import data from other apps and files into Kakrola. </h2>
        <p className="text-xs text-muted-foreground">
          If your data is located somewhere we don't support yet, you can try
          importing it via CSV file.
        </p>
      </div>

      {/* Import Sources Grid */}
      <div>
        {/* <h3 className="text-lg font-medium mb-4">Available Import Sources</h3> */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {importSources.map((source) => (
            <Card
              key={source.id}
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => {
                setSelectedSource(source);
                setIsImportDialogOpen(true);
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary-50">
                  {source.icon}
                </div>
                <div>
                  <h4 className="font-medium">{source.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {source.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Imports Section */}
      {/* {recentImports.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Recent Imports</h3>
          <div className="space-y-2">
            {recentImports.map((import_, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div>
                  <h4 className="font-medium">{import_.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {import_.items} items •{" "}
                    {new Date(import_.date).toLocaleDateString()}
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </div>
      )} */}

      {/* Import Dialog */}
      <ImportDialog
        open={isImportDialogOpen}
        onClose={() => {
          setIsImportDialogOpen(false);
          setSelectedSource(null);
        }}
        source={selectedSource}
      />
    </div>
  );
};

export default ImportSettings;
