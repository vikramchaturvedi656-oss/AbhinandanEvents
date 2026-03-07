import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function CTASection(){

return(

<section className="bg-gradient-to-r from-pink-500 to-purple-600 py-20 text-center text-white">

<motion.h2
initial={{opacity:0,y:40}}
whileInView={{opacity:1,y:0}}
transition={{duration:0.6}}
className="text-4xl font-bold mb-4"
>

Ready to Plan Your Dream Event?

</motion.h2>

<p className="mb-8 text-lg">
Join Abhinandan Events and connect with the best planners and vendors.
</p>

<div className="flex justify-center gap-6">

<Link to="/signup">
<button className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:scale-105">
Get Started
</button>
</Link>

<Link to="/vendor-register">
<button className="border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-black">
Become a Vendor
</button>
</Link>

</div>

</section>

);
}

export default CTASection;