import React from "react";
import { Check, Rocket, Users, Info } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Tier } from "@/lib/constants/pricing-tier";

const PricingCard = ({ plan }: { plan: Tier }) => {
  // Group features by category
  const groupedFeatures = React.useMemo(() => {
    const groups: { [key: string]: string[] } = {};
    let currentGroup = "General";

    plan.features.forEach((feature) => {
      if (feature.startsWith("•")) {
        groups[currentGroup].push(feature.substring(2));
      } else {
        currentGroup = feature;
        if (!groups[currentGroup]) {
          groups[currentGroup] = [];
        }
      }
    });

    return groups;
  }, [plan.features]);

  return (
    <Card
      className={`relative w-full max-w-lg transition-all duration-300 hover:shadow-xl flex flex-col ${
        plan.highlighted
          ? "border-primary shadow-md hover:shadow-primary/20"
          : "border-muted hover:border-primary/50"
      }`}
    >
      {plan.highlighted && (
        <div className="absolute -top-px left-0 right-0 h-1.5 bg-gradient-to-r from-primary/60 via-primary to-primary/60 rounded-t-lg" />
      )}

      <div className="flex-1">
        <CardHeader className="space-y-4 pb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative w-14 h-14 flex-shrink-0">
                <Image
                  src={plan.icon}
                  alt={`${plan.name} plan icon`}
                  width={56}
                  height={56}
                  className="object-contain"
                />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold text-primary">
                  {plan.name}
                </CardTitle>
                {plan.badge && (
                  <Badge variant="secondary" className="font-medium">
                    {plan.badge}
                  </Badge>
                )}
              </div>
            </div>

            <div className="text-right">
              <div className="text-3xl font-bold tracking-tight">
                {plan.price}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {plan.period}
              </div>
            </div>
          </div>

          <CardDescription className="text-base">
            {plan.description}
          </CardDescription>

          {plan.idealFor && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2 bg-muted/50 p-2 rounded-lg">
              <Users className="w-4 h-4 text-primary min-w-4 min-h-4" />
              {plan.idealFor}
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {plan.featureHeading && (
            <h4 className="font-semibold text-sm">{plan.featureHeading}</h4>
          )}

          {Object.entries(groupedFeatures).map(([group, features], index) => (
            <div key={group} className={index !== 0 ? "pt-4" : ""}>
              {group !== "General" && (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <h4 className="font-semibold text-sm">{group}</h4>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-sm">
                            Key {group.toLowerCase()} features
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Separator className="mb-4" />
                </>
              )}
              <ul className="space-y-3">
                {features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground leading-tight">
                      {feature.trim()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </div>

      <CardFooter className="pt-6">
        <Link href="/auth/signup" className="w-full">
          <Button
            variant={plan.highlighted ? "default" : "outline"}
            size="lg"
            className={`w-full font-medium transition-all duration-200 ${
              plan.highlighted
                ? "shadow-lg shadow-primary/20 hover:shadow-primary/30"
                : "hover:bg-primary/5"
            }`}
          >
            {plan.highlighted && (
              <Rocket className="w-4 h-4 mr-2 animate-pulse" />
            )}
            {plan.cta}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PricingCard;
