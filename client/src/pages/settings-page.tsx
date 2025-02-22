import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/hooks/use-theme";
import SidebarNav from "@/components/sidebar-nav";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex min-h-screen">
      <SidebarNav />
      
      <main className="flex-1 p-8 lg:pl-72">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Settings</h1>

          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode" className="text-base">Dark Mode</Label>
                <Switch
                  id="dark-mode"
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}