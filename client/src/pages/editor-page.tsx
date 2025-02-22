import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Content, insertContentSchema } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import SidebarNav from "@/components/sidebar-nav";
import Editor from "@/components/editor";
import { useEffect } from "react";

type FormValues = {
  title: string;
  content: string;
  status: string;
};

export default function EditorPage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: content, isLoading: isLoadingContent } = useQuery<Content>({
    queryKey: id ? [`/api/contents/${id}`] : [],
    enabled: !!id,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(insertContentSchema),
    defaultValues: {
      title: "",
      content: "",
      status: "draft",
    },
  });

  // Update form values when content is loaded
  useEffect(() => {
    if (content) {
      form.reset({
        title: content.title,
        content: content.content,
        status: content.status,
      }, {
        keepDefaultValues: false
      });
    }
  }, [content, form]);

  const saveMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const res = await apiRequest(
        id ? "PATCH" : "POST",
        id ? `/api/contents/${id}` : "/api/contents",
        values
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contents"] });
      if (id) {
        queryClient.invalidateQueries({ queryKey: [`/api/contents/${id}`] });
      }
      toast({
        title: "Success",
        description: "Content saved successfully",
      });
      if (!id) {
        setLocation("/");
      }
    },
  });

  const factCheckMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest("POST", "/api/fact-check", { content });
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: `Fact Check Score: ${data.score}`,
        description: data.explanation,
      });
    },
  });

  async function onSubmit(values: FormValues) {
    await saveMutation.mutateAsync(values);
  }

  if (isLoadingContent) {
    return (
      <div className="flex min-h-screen">
        <SidebarNav />
        <main className="flex-1 p-8">
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <SidebarNav />

      <main className="flex-1 p-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={() => setLocation("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">
            {id ? "Edit Content" : "New Content"}
          </h1>
        </div>

        <Card className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Editor 
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const content = form.getValues("content");
                    factCheckMutation.mutate(content);
                  }}
                  disabled={factCheckMutation.isPending}
                >
                  {factCheckMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Fact Check
                </Button>

                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </Card>
      </main>
    </div>
  );
}