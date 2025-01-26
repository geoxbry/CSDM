import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Feature {
  title: string;
  description: string;
  implementationDate: string;
}

const features: Feature[] = [
  {
    title: "Zone Management",
    description: "Create, edit, and delete zones in the Main Canvas with automatic UI updates.",
    implementationDate: "2025-01-26T09:20:00",
  },
  {
    title: "Object Management",
    description: "Create objects with correct zone assignments from Main Canvas, featuring automatic UI updates and frontend integration.",
    implementationDate: "2025-01-26T09:45:00",
  },
];

// Sort features by implementation date
const sortedFeatures = [...features].sort((a, b) => 
  new Date(a.implementationDate).getTime() - new Date(b.implementationDate).getTime()
);

export default function ReleaseNotes() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Release Notes</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Feature Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {feature.description}
                  </p>
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
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
