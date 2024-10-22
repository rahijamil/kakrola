import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { Checkbox } from "../ui/checkbox";
import { useAuthProvider } from "@/context/AuthContext";
import { supabaseBrowser } from "@/utils/supabase/client";
import { PlatformSource } from "@/types/import";
import { Label } from "../ui/label";

interface PlatformImportConfigProps {
  source: PlatformSource;
  onData: (data: any) => void;
}

interface ImportItem {
  id: string;
  title: string;
  parent_id: string;
  icon?: string;
}

export default function PlatformImportConfig({
  source,
  onData,
}: PlatformImportConfigProps) {
  const { profile } = useAuthProvider();
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [items, setItems] = useState<ImportItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Fetch items from Notion using the access token (via Next.js API route)
  const fetchItems = async (token: string) => {
    try {
      const response = await fetch(
        `/api/import/notion/pages?access_token=${token}`
      );

      if (!response.ok) throw new Error("Failed to fetch pages");

      const { data } = await response.json();

      if (!data.results) throw new Error("No pages found");

      setItems(
        data.results.map(
          (result: {
            id: string;
            icon?: { emoji?: string };
            properties: { title?: { title?: { plain_text: string }[] } };
          }) => ({
            id: result.id,
            title: result.properties?.title?.title
              ? result.properties.title.title[0].plain_text
              : "Untitled page",
            icon: result?.icon?.emoji,
          })
        )
      );
    } catch (error) {
      console.error("Error fetching items:", error);
      setError("Failed to fetch pages.");
    }
  };

  // Fetch user's access token and check authentication
  useEffect(() => {
    const fetchAccessToken = async () => {
      setIsAuthenticating(true);

      try {
        const { data, error } = await supabaseBrowser
          .from("oauth_tokens")
          .select("token")
          .eq("profile_id", profile?.id)
          .eq("provider", source.id)
          .single();

        if (error) throw error;
        if (!data) throw new Error("User is not authenticated.");

        setIsAuthenticated(true);
        setAccessToken(data.token);

        // Once access token is set, fetch items
        fetchItems(data.token);
      } catch (error: any) {
        console.error("Authentication error:", error);
        setError("Authentication failed");
        setIsAuthenticated(false);
      } finally {
        setIsAuthenticating(false);
      }
    };

    if (profile?.id && source.id) {
      fetchAccessToken();
    }
  }, [profile?.id, source.id]);

  // Handle item selection toggle
  const handleSelectItem = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Handle import of selected items
  const handleImport = async () => {
    if (!selectedItems.length) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/import/${source.id}/import`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Use the stored access token
        },
        body: JSON.stringify({
          items: selectedItems,
        }),
      });

      if (!response.ok) throw new Error("Import failed");

      const data = await response.json();
      onData(data);
    } catch (error) {
      setError("Failed to import selected items");
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticating) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Connecting...</CardTitle>
        </CardHeader>
        <CardContent>
          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
        </CardContent>
      </Card>
    );
  }

  if (!isAuthenticated) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {source.icon}
            <span>Connect to {source.name}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button
            onClick={() => {
              window.location.href = source.auth_url(
                encodeURIComponent(window.location.pathname)
              );
            }}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Connecting..." : `Connect ${source.name}`}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-y-auto max-h-[600px]">
      <CardHeader>
        <CardTitle>Select Items to Import</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-4">
          {items?.map((item) => (
            <div key={item.id} className="flex items-center space-x-2">
              <Checkbox
                id={item.id}
                checked={selectedItems.includes(item.id)}
                onChange={() => handleSelectItem(item.id)}
              />
              <Label
                htmlFor={item.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
              >
                {item.icon ? (
                  <span>{item.icon}</span>
                ) : (
                  <FileText strokeWidth={1.5} className="w-4 h-4" />
                )}
                <span>{item.title}</span>
              </Label>
            </div>
          ))}
        </div>
        {items?.length > 0 && (
          <Button
            onClick={handleImport}
            disabled={isLoading || selectedItems.length === 0}
            className="mt-4"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Import Selected Items
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
