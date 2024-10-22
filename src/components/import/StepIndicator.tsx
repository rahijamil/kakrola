// components/import/StepIndicator.tsx
interface StepIndicatorProps {
  currentStep: "select" | "configure" | "preview" | "importing";
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { id: "configure", label: "Configure" },
    { id: "preview", label: "Preview" },
    { id: "importing", label: "Import" },
  ];

  return (
    <div className="flex items-center space-x-2">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div
            className={`w-2 h-2 rounded-full ${
              currentStep === step.id
                ? "bg-primary-500"
                : steps.indexOf({ id: currentStep } as any) > index
                ? "bg-primary-200"
                : "bg-gray-200"
            }`}
          />
          {index < steps.length - 1 && (
            <div
              className={`w-8 h-0.5 ${
                steps.indexOf({ id: currentStep } as any) > index
                  ? "bg-primary-200"
                  : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
