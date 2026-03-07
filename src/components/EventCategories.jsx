const events = [
  {
    name: "Wedding",
    img: "https://images.unsplash.com/photo-1519741497674-611481863552",
  },
  {
    name: "Birthday",
    img: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3",
  },
  {
    name: "Corporate",
    img: "https://images.unsplash.com/photo-1515169067868-5387ec356754",
  },
];

const EventCategories = () => {
  return (
    <div className="p-10 bg-slate-800 text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Event Categories
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {events.map((e, i) => (
          <div key={i} className="bg-slate-700 rounded-xl overflow-hidden">
            <img src={e.img} className="h-48 w-full object-cover" />
            <h3 className="p-4 text-xl">{e.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventCategories;