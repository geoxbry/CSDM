import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Feature {
  title: string;
  description: string;
  implementationDate: string;
  category: string;
}

const features: Feature[] = [
  // Game/Training Interface
  {
    title: "Drag and Drop Functionality",
    description: "Interactive drag and drop system for game objects with visual feedback",
    implementationDate: "2025-01-26T09:20:00",
    category: "Game/Training Interface"
  },
  {
    title: "Canvas Interaction System",
    description: "Interactive canvas with drop zones and placement validation",
    implementationDate: "2025-01-26T09:25:00",
    category: "Game/Training Interface"
  },
  {
    title: "Score and Feedback System",
    description: "Real-time score tracking and user feedback mechanisms",
    implementationDate: "2025-01-26T09:30:00",
    category: "Game/Training Interface"
  },

  // Admin Dashboard
  {
    title: "Zone Management",
    description: "Create, edit, and delete zones in the Main Canvas with automatic UI updates",
    implementationDate: "2025-01-26T09:35:00",
    category: "Admin Dashboard"
  },
  {
    title: "Object Management",
    description: "Create objects with correct zone assignments from Main Canvas, featuring automatic UI updates and frontend integration",
    implementationDate: "2025-01-26T09:45:00",
    category: "Admin Dashboard"
  },
  {
    title: "Scenario Management",
    description: "Customer-specific scenario configuration with zone and object associations",
    implementationDate: "2025-01-26T09:50:00",
    category: "Admin Dashboard"
  },

  // Technical Infrastructure
  {
    title: "Data Management",
    description: "Database integration with API endpoints and validation",
    implementationDate: "2025-01-26T09:15:00",
    category: "Technical Infrastructure"
  },
  {
    title: "UI Framework",
    description: "Professional theme implementation with responsive layout and toast notifications",
    implementationDate: "2025-01-26T09:10:00",
    category: "Technical Infrastructure"
  }
];

// Sort features by implementation date for timeline view
const sortedFeatures = [...features].sort((a, b) => 
  new Date(a.implementationDate).getTime() - new Date(b.implementationDate).getTime()
);

// Group features by category for comprehensive view
const groupedFeatures = features.reduce((acc, feature) => {
  if (!acc[feature.category]) {
    acc[feature.category] = [];
  }
  acc[feature.category].push(feature);
  return acc;
}, {} as Record<string, Feature[]>);

export default function ReleaseNotes() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Release Notes</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Feature Overview by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(groupedFeatures).map(([category, categoryFeatures]) => (
                <div key={category} className="space-y-4">
                  <h2 className="text-xl font-semibold text-primary">{category}</h2>
                  <div className="space-y-3">
                    {categoryFeatures.map((feature, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <h3 className="font-semibold">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {feature.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Implementation Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedFeatures.map((feature, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{feature.title}</h3>
                    <span className="text-xs text-muted-foreground">
                      {new Date(feature.implementationDate).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                  <span className="inline-block mt-2 text-xs px-2 py-1 bg-accent rounded">
                    {feature.category}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}