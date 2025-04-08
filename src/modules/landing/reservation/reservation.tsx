import React from "react";
import Image from "next/image";

const Reservation = () => {
  return (
    <div
      className="int:h-[100vh] max-w-[90vw] mx-auto flex flex-col md:flex-row py-10 gap-20 md:gap-5 mb-10"
      id="contact"
    >
      <div className="bg-orange-400 rounded-md p-10 md:w-1/2">
        <h1 className="text-5xl font-bold mb-6">Place your order in seconds</h1>
      </div>
      <div className="md:w-1/2">
        <Image
          src="/images/Foodie.jpg"
          alt="foodie"
          width={600}
          height={600}
          className="h-full w-full my-auto rounded-lg "
        />
      </div>
    </div>
  );
};

export default Reservation;
