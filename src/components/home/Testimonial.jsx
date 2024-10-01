import React from "react";
import { FaQuoteLeft } from "react-icons/fa";

function Testimonial() {
  return (
    <>
      <section id="testimonials" className="bg-blue-50 py-12 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            What Our Users Say
          </h2>
          <div className="flex flex-wrap justify-center">
            <TestimonialCard
              quote="Uizzy transformed my classroom! Students are more engaged and eager to learn."
              author="- Teacher Jane Doe"
            />
            <TestimonialCard
              quote="I love how easy it is to create quizzes! It's super fun!"
              author="- Student John Smith"
            />
            <TestimonialCard
              quote="The analytics are a game changer. I can see exactly where my students struggle."
              author="- Teacher Sarah Lee"
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default Testimonial;

const TestimonialCard = ({ quote, author }) => (
  <div className="max-w-sm bg-white rounded-lg shadow-md p-6 mx-4 mb-4">
    <FaQuoteLeft className="text-gray-500 text-3xl mb-4" />
    <p className="text-gray-700 italic mb-2">{quote}</p>
    <p className="text-gray-500 font-semibold">{author}</p>
  </div>
);
