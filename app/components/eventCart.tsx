import Link from "next/link";
import Image from "next/image";

interface Props {
  title: string;
  image: string;
  location: string;
  date: string;
  time: string;
  slug: string;
}

const EventCard = ({ title, image, location, date, time, slug }: Props) => {
  return (
    <Link href={`/events/${slug}`} id="event-card">
      <Image src={image} alt={title} width={410} height={300} className="poster" />
      <div className="flex flex-row gap-2 items-center">
        <Image src="/icons/marker (1).png" alt="location" width={18} height={13} />
        <p>{location}</p>
      </div>
      <p className="title">{title}</p>

      <div className="datetime">
        <div className="flex flex-row gap-2 items-center">
          <Image src="/icons/calendar.png" alt="calendar" width={18} height={13} />
          <p>{date}</p>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <Image src="/icons/clock.png" alt="clock" width={23} height={11} />
          <p>{time}</p>
        </div>
      </div>
    </Link>
  );
};

export default EventCard
