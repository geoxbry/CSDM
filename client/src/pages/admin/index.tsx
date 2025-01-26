import { Link } from "wouter";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Layout, Settings, Package, FileText } from "lucide-react";

export default function AdminDashboard() {
  const adminModules = [
    {
      title: "Zones Management",
      description: "Manage drop zones and their positions",
      icon: Layout,
      href: "/admin/zones"
    },
    {
      title: "Objects Management",
      description: "Manage draggable objects and their properties",
      icon: Package,
      href: "/admin/objects"
    },
    {
      title: "Scenarios Management",
      description: "Configure customer-specific training scenarios",
      icon: Settings,
      href: "/admin/scenarios"
    },
    {
      title: "Release Notes",
      description: "View implementation history and feature tracking",
      icon: FileText,
      href: "/admin/release-notes"
    }
  ];

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminModules.map((module) => {
          const Icon = module.icon;
          return (
            <Link key={module.href} href={module.href}>
              <Card className="hover:bg-accent/50 cursor-pointer transition-colors">
                <CardHeader>
                  <Icon className="w-8 h-8 mb-2 text-primary" />
                  <CardTitle>{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}