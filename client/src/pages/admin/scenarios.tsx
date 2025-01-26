import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Scenario, Zone, GameObject } from "@/types/game";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  customerName: z.string().min(1, "Customer name is required"),
  description: z.string().optional(),
  zoneIds: z.array(z.number()).min(1, "At least one zone must be selected"),
  objectIds: z.array(z.number()).min(1, "At least one object must be selected"),
});

export default function ScenariosManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      customerName: "",
      description: "",
      zoneIds: [],
      objectIds: [],
    },
  });

  const { data: scenarios } = useQuery<Scenario[]>({
    queryKey: ["/api/admin/scenarios"],
  });

  const { data: zones } = useQuery<Zone[]>({
    queryKey: ["/api/admin/zones"],
  });

  const { data: objects } = useQuery<GameObject[]>({
    queryKey: ["/api/admin/objects"],
  });

  const createScenarioMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const res = await fetch("/api/admin/scenarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed to create scenario");
      return res.json();
    },
    onSuccess: (newScenario) => {
      toast({ title: "Scenario created successfully" });
      form.reset();
      // Update the cache immediately
      queryClient.setQueryData(["/api/admin/scenarios"], (old: Scenario[] | undefined) => {
        return [...(old || []), newScenario];
      });
      // Invalidate to ensure consistency with server
      queryClient.invalidateQueries({ queryKey: ["/api/admin/scenarios"] });
    },
    onError: () => {
      toast({
        title: "Failed to create scenario",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createScenarioMutation.mutate(values);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Scenarios Management</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Create New Scenario</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Scenario Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

                <FormField
                  control={form.control}
                  name="zoneIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zones</FormLabel>
                      <Select
                        onValueChange={(value) => 
                          field.onChange([...field.value, Number(value)])
                        }
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Add zones" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {zones?.map((zone) => (
                            <SelectItem key={zone.id} value={zone.id.toString()}>
                              {zone.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {field.value.map((zoneId) => {
                          const zone = zones?.find((z) => z.id === zoneId);
                          return zone ? (
                            <div
                              key={zone.id}
                              className="bg-accent px-2 py-1 rounded-md text-sm flex items-center gap-2"
                            >
                              <span>{zone.name}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  field.onChange(
                                    field.value.filter((id) => id !== zone.id)
                                  )
                                }
                                className="text-muted-foreground hover:text-foreground"
                              >
                                ×
                              </button>
                            </div>
                          ) : null;
                        })}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="objectIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Objects</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange([...field.value, Number(value)])
                        }
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Add objects" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {objects?.map((obj) => (
                            <SelectItem key={obj.id} value={obj.id.toString()}>
                              {obj.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {field.value.map((objectId) => {
                          const obj = objects?.find((o) => o.id === objectId);
                          return obj ? (
                            <div
                              key={obj.id}
                              className="bg-accent px-2 py-1 rounded-md text-sm flex items-center gap-2"
                            >
                              <span>{obj.name}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  field.onChange(
                                    field.value.filter((id) => id !== obj.id)
                                  )
                                }
                                className="text-muted-foreground hover:text-foreground"
                              >
                                ×
                              </button>
                            </div>
                          ) : null;
                        })}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit">Create Scenario</Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Existing Scenarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scenarios?.map((scenario) => (
                <div
                  key={scenario.id}
                  className="p-4 border rounded-lg hover:bg-accent/50"
                >
                  <h3 className="font-semibold">{scenario.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Customer: {scenario.customerName}
                  </p>
                  {scenario.description && (
                    <p className="text-sm mt-2">{scenario.description}</p>
                  )}
                  <div className="mt-2">
                    <p className="text-sm font-medium">Zones:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {scenario.zoneIds.map((zoneId) => (
                        <span
                          key={zoneId}
                          className="text-xs bg-accent px-2 py-1 rounded"
                        >
                          {zones?.find((z) => z.id === zoneId)?.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}