import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

function FeaturedVendors() {

const vendors = [
{
name: "Royal Wedding Planners",
service: "Wedding Planner",
experience: "8 Years Experience",
rating: "4.8",
img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622"
},
{
name: "Dream Decor Studio",
service: "Event Decoration",
experience: "6 Years Experience",
rating: "4.7",
img: "https://images.unsplash.com/photo-1505236858219-8359eb29e329"
},
{
name: "Moments Photography",
service: "Photography",
experience: "5 Years Experience",
rating: "4.9",
img: "https://images.unsplash.com/photo-1519741497674-611481863552"
},
{
name: "Elite Catering",
service: "Catering",
experience: "10 Years Experience",
rating: "4.6",
img: "https://images.unsplash.com/photo-1555244162-803834f70033"
}
];

return (

<section className="bg-[#0f172a] py-20 px-10 text-white">

<h2 className="text-4xl font-bold text-center mb-12">
Featured Vendors
</h2>

<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

{vendors.map((vendor,index)=>(
<motion.div
key={index}
whileHover={{scale:1.05}}
className="bg-[#1e293b] rounded-xl overflow-hidden shadow-lg"
>

<img
src={vendor.img}
className="w-full h-52 object-cover"
/>

<div className="p-5">

<h3 className="text-xl font-semibold mb-2">
{vendor.name}
</h3>

<p className="text-gray-400 text-sm">
{vendor.service}
</p>

<p className="text-gray-400 text-sm">
{vendor.experience}
</p>

<div className="flex items-center gap-2 mt-2">
<FaStar className="text-yellow-400"/>
<span>{vendor.rating}</span>
</div>

<button className="mt-4 w-full bg-pink-500 py-2 rounded-lg hover:bg-pink-600">
Book Vendor
</button>

</div>
</motion.div>
))}

</div>

</section>

);
}

export default FeaturedVendors;