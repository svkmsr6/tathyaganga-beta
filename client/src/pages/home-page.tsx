import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Content } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, File, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import SidebarNav from "@/components/sidebar-nav";

export default function HomePage() {
  const { user } = useAuth();
  const { data: contents, isLoading } = useQuery<Content[]>({
    queryKey: ["/api/contents"],
  });

  return (
    <div className="flex min-h-screen">
      <SidebarNav />
      
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Welcome, {user?.username}</h1>
          <Link href="/editor">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Content
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : !contents?.length ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <File className="h-12 w-12 mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">No content yet</h2>
              <p className="text-muted-foreground mb-4">
                Create your first piece of content to get started
              </p>
              <Link href="/editor">
                <Button>Create Content</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {contents.map((content) => (
              <Link key={content.id} href={`/editor/${content.id}`}>
                <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{content.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {content.content}
                    </p>
                    <div className="flex items-center mt-4 gap-2">
                      <div className="text-sm px-2 py-1 rounded-md bg-secondary">
                        {content.status}
                      </div>
                      {content.factCheckScore !== null && (
                        <div className="flex items-center gap-1 text-sm">
                          <AlertCircle className="h-4 w-4" />
                          Score: {content.factCheckScore}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
