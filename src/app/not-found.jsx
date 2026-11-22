import Breadcrumb from "@/components/ui/breadcrumb";
import Button from "@/components/ui/button";

export const metadata = { title: "Page Not Found" };

export default function NotFound() {
  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: "404 Error" }]} />
      <div className="flex flex-col items-center py-20 text-center sm:py-28">
        <h1 className="text-6xl font-semibold tracking-tight sm:text-8xl">404 Not Found</h1>
        <p className="mt-8 max-w-md text-fg-muted">The page you&apos;re looking for doesn&apos;t exist or may have been moved.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button href="/" size="lg">
            Back to Home
          </Button>
          <Button href="/shop" size="lg" variant="outline">
            Browse Products
          </Button>
        </div>
      </div>
    </div>
  );
}
