import ContactForm from "@/modules/contact/contact-form";
import Image from "next/image";
import React from "react";

const Contact = () => {
  return (
    <div className="bg-orange-50">
      <div className="">
        <Image
          src="/images/food-rel-bg.jpeg"
          alt="vector bg"
          width={1000}
          height={500}
          className="w-full h-[500px] relative -top-[110px]"
        />
      </div>
      <div className="w-[90vw] mx-auto border-[3px] outline-2 outline-orange-400 border-orange-400 bg-orange-50 rounded-lg relative -top-60 p-10 h-[500px]">
        <div className="flex justify-between py-5">
          <h2 className="text-5xl font-bold">Email Us</h2>
          <span>image</span>
        </div>

        <div>
          <ContactForm/>
        </div>
      </div>
    </div>
  );
};

export default Contact;
