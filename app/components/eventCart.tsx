import Link from "next/link";
import Image from "next/image";

interface Props {
  title: string;
  image: string;
  slug: string;
location: string;
date: string;
time: string;
}

const EventCard = ({ title, image ,slug, location, date, time }: Props) => {
  return (
    <Link href={`/events`} id="event-card">
      <Image src={image} alt={title} width={410} height={300} className="poster"/>
      <div className="flex flex-row gap-2">
  <Image src="/icons/marker (1).png" alt="location" width={18} height={13} color="white" />
  <p>{location}</p>
</div>
      <p className="title">{title}</p>

      <div className="datetime">
      <div>
  <Image src="/icons/calendar.png" alt="calender" width={18} height={13}/>
  <p>{date}</p>
    </div>
  <div>
 <Image src="/icons/clock.png" alt="calender" width={23} height={11}/>
  {time}
  <p> {time}

  </p>
  </div>
  </div>

    </Link>
  )
}

export default EventCard