import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Zone } from "@/types/game";

const formSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  x: z.number().min(0, "X must be positive"),
  y: z.number().min(0, "Y must be positive"),
  width: z.number().min(50, "Width must be at least 50px"),
  height: z.number().min(50, "Height must be at least 50px"),
  description: z.string().optional(),
});

export default function ZonesManagement() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      x: 0,
      y: 0,
      width: 200,
      height: 150,
      description: "",
    },
  });

  const { data: zones, isLoading } = useQuery<Zone[]>({
    queryKey: ["/api/admin/zones"],
  });

  const createZoneMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const res = await fetch("/api/admin/zones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed to create zone");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Zone created successfully" });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Failed to create zone",
        variant: "destructive",
      });
    },
  });

  const updateZoneMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const res = await fetch(`/api/admin/zones/${values.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed to update zone");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Zone updated successfully" });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Failed to update zone",
        variant: "destructive",
      });
    },
  });

  const deleteZoneMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/zones/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete zone");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Zone deleted successfully" });
    },
    onError: () => {
      toast({
        title: "Failed to delete zone",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (values.id) {
      updateZoneMutation.mutate(values);
    } else {
      createZoneMutation.mutate(values);
    }
  };

  const handleEdit = (zone: Zone) => {
    form.reset(zone);
  };

  const handleDelete = (id: number) => {
    deleteZoneMutation.mutate(id);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Zones Management</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>
              {form.getValues("id") ? "Edit Zone" : "Create New Zone"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zone Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="x"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>X Position</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="y"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Y Position</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="width"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Width</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2">
                  <Button type="submit">
                    {form.getValues("id") ? "Update Zone" : "Create Zone"}
                  </Button>
                  {form.getValues("id") && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => form.reset()}
                    >
                      Cancel Edit
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Existing Zones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {zones?.map((zone) => (
                <div
                  key={zone.id}
                  className="p-4 border rounded-lg hover:bg-accent/50 relative group"
                >
                  <div className="absolute right-2 top-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(zone)}
                      className="p-2"
                      title="Edit zone"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="p-2 text-destructive hover:text-destructive/90" title="Delete zone">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Zone</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete the zone "{zone.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(zone.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>

                  <h3 className="font-semibold">{zone.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Position: ({zone.x}, {zone.y}) - Size: {zone.width}x
                    {zone.height}
                  </p>
                  {zone.description && (
                    <p className="text-sm mt-2">{zone.description}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}