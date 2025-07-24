import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen text-gray-900 px-6 py-12 flex flex-col items-center justify-center">
      <section className="max-w-4xl text-center space-y-6">
        <h1 className="text-5xl font-bold leading-tight">
          Streamline Your YouTube Video Editing & Publishing
        </h1>
        <p className="text-lg text-gray-600">
          YouTubeLayer helps <b>creators</b> and <b>editors</b> collaborate seamlessly — upload raw footage, edit remotely, and publish to YouTube effortlessly.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link href={"/auth"}>
            <Button className="px-6 py-3 text-lg">
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link href={"https://github.com/roydevashish/youtubelayer#readme"} target="_blank">
            <Button variant="outline" className="px-6 py-3 text-lg">
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        <div className="bg-gray-50 p-6 rounded-2xl shadow-sm">
          <h3 className="text-xl font-semibold mb-2">Centralized Dashboard</h3>
          <p className="text-gray-600">
            Track project status, assign editors, and manage all your content in one place.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-2xl shadow-sm">
          <h3 className="text-xl font-semibold mb-2">AWS-Powered Uploads</h3>
          <p className="text-gray-600">
            Securely upload raw footage to S3 and enable editors to work remotely without delays.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-2xl shadow-sm">
          <h3 className="text-xl font-semibold mb-2">Auto Publish to YouTube</h3>
          <p className="text-gray-600">
            Automatically publish final videos via secure containers integrated with the YouTube API.
          </p>
        </div>
      </section>
    </main>
  );
}