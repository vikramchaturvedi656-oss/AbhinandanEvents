import { motion } from "framer-motion";

function Testimonials(){

const reviews = [

{
name:"Ananya Sharma",
review:"Abhinandan Events made my wedding unforgettable. Everything was perfectly managed.",
img:"https://images.unsplash.com/photo-1494790108377-be9c29b29330"
},

{
name:"Rahul Verma",
review:"Amazing event planners. They handled my corporate event very professionally.",
img:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
},

{
name:"Priya Kapoor",
review:"Great vendors and seamless booking experience. Highly recommended!",
img:"https://images.unsplash.com/photo-1544005313-94ddf0286df2"
}

];

return(

<section className="bg-[#1e293b] py-20 px-10 text-white">

<h2 className="text-4xl font-bold text-center mb-12">
What Our Clients Say
</h2>

<div className="grid md:grid-cols-3 gap-8">

{reviews.map((review,index)=>(
<motion.div
key={index}
whileHover={{y:-8}}
className="bg-[#0f172a] p-6 rounded-xl shadow-lg"
>

<img
src={review.img}
className="w-16 h-16 rounded-full object-cover mb-4"
/>

<p className="text-gray-300 mb-4">
"{review.review}"
</p>

<h4 className="font-semibold">
{review.name}
</h4>

</motion.div>
))}

</div>

</section>

);
}

export default Testimonials;