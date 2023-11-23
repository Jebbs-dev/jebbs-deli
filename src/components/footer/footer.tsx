import React from "react";
import Image from "next/image";
import { foot_wigs } from "./data/widgets";

import {
  FaTwitter,
  FaInstagram,
  FaFacebookF,
} from "react-icons/fa6";

const Footer = () => {
  return (
    <>
      <footer className="bg-orange-50 p-10">
        <div className=" max-w-[90vw] mx-auto grid int:grid-cols-footer gap-5 int:gap-2 md:grid-cols-3 md:gap-10 ">
          <div className="">
            <a href="/" className="flex items-center mb-4">
              <Image src="/images/img-bg-logo.png" width={40} height={40} alt="deliLogo" className="mr-2" />
              <span className="font-semibold text-slate-900 text-lg">
                Jebbs Deli
              </span>
            </a>
            <p className="text-black opacity-40">
              Indulge in a culinary journey of exquisite flavors at Jebbs Deli,
              where passion meets the plate. Discover a symphony of taste in
              every bite.
            </p>
            <div className="flex flex-row mt-5">
              <div className="flex rounded-full h-8 w-8 items-center justify-around bg-orange-400 text-white mr-3">
                <FaFacebookF className="align-middle" />
              </div>
              <div className="flex rounded-full h-8 w-8 items-center justify-around bg-orange-400 text-white mr-3">
                <FaTwitter className="align-middle" />
              </div>
              <div className="flex rounded-full h-8 w-8 items-center justify-around bg-orange-400 text-white">
                <FaInstagram  />
              </div>
            </div>
          </div>

          <div className="">
            <h3 className="text-[18px] text-hair font-semibold mb-7">Quick Links</h3>
            <div className="flex flex-col justify-around text-black opacity-40 space-y-2">
              <a href="/">
                <span>Popular dishes</span>
              </a>
              <a href="/">
                <span>Menu</span>
              </a>
              <a href="/">
                <span>Reservations</span>
              </a>
              <a href="/">
                <span>Review</span>
              </a>
            </div>
          </div>

          <div className="">
            <h3 className="text-[18px] font-semibold mb-7 text-hair">About Us</h3>
            <div className="flex flex-col justify-around text-black opacity-40  space-y-2">
              <a href="/" className="">
                <span>Terms and condtions</span>
              </a>
              <a href="/">
                <span>Privacy policy</span>
              </a>
              <a href="/">
                <span>Contact</span>
              </a>
              <a href="/">
                <span>About us</span>
              </a>
            </div>
          </div>

          <div className="">
            <h3 className="text-[18px] font-semibold mb-7 text-hair">Get in Touch</h3>

            {foot_wigs.map((foot) => {
              return (
                <>
                  <div
                    className="flex items-center space-x-2 mb-2 text-black opacity-40"
                    key={foot.id}
                  >
                    <div className="shrink-0 text-white stroke-orange-400">
                      <foot.icon
                        style={{ color: "#f2994a" }}
                      />
                    </div>
                    <div>
                      <p className="text-black">{foot.text}</p>
                    </div>
                  </div>
                </>
              );
            })}
          </div>

          <div className="">
            <h3 className="text-[18px] font-semibold mb-7 text-hair">
              Subscribe for Updates
            </h3>
            <div className="relative mb-20">
              <div className="absolute inset-y-0 left-[160px] flex items-center pl-3 pointer-events-none">
                <button className="bg-orange-400 p-[10px] rounded-md text-white">
                  Subscribe
                </button>
              </div>
              <input
                type="email"
                name="email"
                id="updates-email"
                placeholder="Enter email address"
                className="block w-5/6 py-3 px-2 text-sm rounded-md text-gray-900 border"
              />
            </div>
            <div>
              <p className="text-black opacity-40">
                &copy; Jebbs Deli 2023. All rights reserved{" "}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
