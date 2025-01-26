import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Feature {
  title: string;
  description: string;
  implementationDate: string;
  category: string;
  recreatePrompt: string;
}

const features: Feature[] = [
  // Technical Infrastructure
  {
    title: "UI Framework",
    description: "Professional theme implementation with responsive layout and toast notifications",
    implementationDate: "2025-01-26T21:50:00",
    category: "Technical Infrastructure",
    recreatePrompt: "Build a professional UI framework with responsive layout and toast notifications using shadcn components. Include a theme system for consistent styling."
  },
  {
    title: "Data Management",
    description: "Database integration with API endpoints and validation",
    implementationDate: "2025-01-26T21:50:00",
    category: "Technical Infrastructure",
    recreatePrompt: "Set up a PostgreSQL database with Drizzle ORM. Create API endpoints for CRUD operations with data validation using Zod. Implement proper error handling and response formatting."
  },

  // Game/Training Interface
  {
    title: "Drag and Drop Functionality",
    description: "Interactive drag and drop system for game objects with visual feedback",
    implementationDate: "2025-01-26T21:50:00",
    category: "Game/Training Interface",
    recreatePrompt: "Create a drag and drop system using react-dnd that allows users to drag objects from a sidebar and drop them into designated zones. Include visual feedback for dragging states."
  },
  {
    title: "Canvas Interaction System",
    description: "Interactive canvas with drop zones and placement validation",
    implementationDate: "2025-01-26T21:50:00",
    category: "Game/Training Interface",
    recreatePrompt: "Create a canvas that allows users to drag and drop objects into specific zones. The canvas should support multiple drop zones, validate object placement, and provide visual feedback when objects are placed correctly."
  },
  {
    title: "Score and Feedback System",
    description: "Real-time score tracking and user feedback mechanisms",
    implementationDate: "2025-01-26T21:50:00",
    category: "Game/Training Interface",
    recreatePrompt: "Implement a scoring system that tracks points based on correct object placements. Add a validation system that provides immediate feedback through toast notifications for both correct and incorrect placements."
  },

  // Admin Dashboard
  {
    title: "Zone Management",
    description: "Create, edit, and delete zones in the Main Canvas with automatic UI updates",
    implementationDate: "2025-01-26T21:50:00",
    category: "Admin Dashboard",
    recreatePrompt: "Create an admin interface for managing zones. Include forms for creating and editing zones with x,y coordinates and dimensions. Add delete functionality with confirmation dialogs. Ensure real-time UI updates using React Query."
  },
  {
    title: "Object Management",
    description: "Create objects with correct zone assignments from Main Canvas, featuring automatic UI updates and frontend integration",
    implementationDate: "2025-01-26T21:50:00",
    category: "Admin Dashboard",
    recreatePrompt: "Build an object management system where admins can create game objects, assign them to correct zones, set points, and customize success/error messages. Include automatic UI updates and proper integration with the main canvas."
  },
  {
    title: "Scenario Management",
    description: "Customer-specific scenario configuration with zone and object associations, including edit and delete functionality",
    implementationDate: "2025-01-26T21:50:00",
    category: "Admin Dashboard",
    recreatePrompt: "Create a scenario management system that allows admins to configure customer-specific training scenarios. Include the ability to associate multiple zones and objects with each scenario, add descriptions, and manage scenario metadata. Implement edit and delete functionality with confirmation dialogs."
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
                  <div className="mt-4 p-3 bg-muted/50 rounded-md">
                    <p className="text-sm font-medium mb-1">Prompt to Recreate:</p>
                    <p className="text-sm text-muted-foreground">{feature.recreatePrompt}</p>
                  </div>
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