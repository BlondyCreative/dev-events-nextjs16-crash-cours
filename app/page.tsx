import { IEvent } from "@/database";
import EventCard from "./components/eventCart";
import ExploreBtn from "./components/exploreBtn";
import { cache } from "react";
import { cacheLife } from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

// Revalidate the page every 60 seconds to show new events
export const revalidate = 60;

export default async function Page() {

  const response = await fetch(`${BASE_URL}/api/events`, {
    next: { revalidate: 60 }
  })
 'use cache' 
 cacheLife('')
  const { events } = await response.json()

  return (
    <section className="mt-5">
<h1 className="text-center">The Hub for Every Dev <br /> Event You Cant Miss</h1>
<p className="text-center mt-5">Hackathons, Meetups, and Conferences, All in One Place</p>
<ExploreBtn/>
<div className="mt-20 space-y-7">
  <h3>Featured Events</h3>

<ul className="events">
  {events && events.length > 0 && events.map((event: IEvent) => (
    <li key={event._id?.toString()}>
      <EventCard {...event}/>
    </li>
  ))}
</ul>
</div>
</section>

  )
}
