import React from "react";
import { Github, ArrowUpRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import { FaXTwitter } from "react-icons/fa6";

// New component to show recent updates
const RecentUpdates = () => (
  <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-gray-100">
    <h3 className="font-semibold text-lg mb-4">Recent Updates</h3>
    <div className="space-y-3">
      {[
        {
          date: "2 days ago",
          title: "New: Custom Fields for Projects",
          type: "Feature",
        },
        {
          date: "5 days ago",
          title: "Performance: 30% Faster Page Loads",
          type: "Improvement",
        },
        {
          date: "1 week ago",
          title: "Fixed: Task Assignment Notifications",
          type: "Bugfix",
        },
      ].map((update, i) => (
        <div key={i} className="flex items-start gap-3 text-sm">
          <span
            className={`px-2 py-0.5 rounded text-xs ${
              update.type === "Feature"
                ? "bg-green-100 text-green-700"
                : update.type === "Improvement"
                ? "bg-blue-100 text-blue-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {update.type}
          </span>
          <div>
            <p className="font-medium">{update.title}</p>
            <p className="text-gray-500 text-xs">{update.date}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const BuiltInPublicSection = () => {
  return null;
  return (
    <section className="space-y-20 md:py-20 wrapper">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-bold text-gray-900 text-4xl leading-tight mb-4">
            Built in Public, Built for You
          </h2>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">
            Follow along as we build and improve Kakrola together
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <RecentUpdates />

          <div className="space-y-6">
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-gray-100">
              <h3 className="font-semibold text-lg mb-4">Join the Journey</h3>
              <div className="space-y-4">
                {/* <Link
                  href="https://github.com/rahijamil/kakrola-public"
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors"
                  target="_blank"
                >
                  <div className="flex items-center gap-3">
                    <Github className="w-5 h-5" />
                    <div className="text-sm">
                      <p className="font-medium">Public Roadmap</p>
                      <p className="text-gray-500">Vote on upcoming features</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4" />
                </Link> */}

                <Link
                  href="https://x.com/rahijamil_"
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors"
                  target="_blank"
                >
                  <div className="flex items-center gap-3">
                    <FaXTwitter className="w-5 h-5" />
                    <div className="text-sm">
                      <p className="font-medium">Development Updates</p>
                      <p className="text-gray-500">
                        Weekly progress & insights
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* <div className="bg-primary/5 rounded-lg p-6">
              <h3 className="font-semibold mb-2">Latest Numbers</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Active Users</p>
                  <p className="font-bold text-xl">1,234</p>
                </div>
                <div>
                  <p className="text-gray-500">Uptime</p>
                  <p className="font-bold text-xl">99.9%</p>
                </div>
                <div>
                  <p className="text-gray-500">Support Response</p>
                  <p className="font-bold text-xl"> 2h</p>
                </div>
                <div>
                  <p className="text-gray-500">Open Issues</p>
                  <p className="font-bold text-xl">12</p>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      <div className="text-center space-y-4">
        <p className="text-sm text-gray-500">
          Independently built with ❤️ for teams that value simplicity
        </p>
      </div>
    </section>
  );
};

export default BuiltInPublicSection;
