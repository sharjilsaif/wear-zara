import { notFound } from "next/navigation";

/** Any unknown URL renders the localised 404 page inside the normal layout. */
export default function CatchAll() {
  notFound();
}
