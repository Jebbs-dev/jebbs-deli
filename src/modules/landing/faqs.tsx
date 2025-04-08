import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import Image from "next/image";

const Faqs = () => {
  const [selectedFaq, setSelectedFaq] = useState(1);

  const faqs = [
    {
      id: 1,
      question: "What is Deli?",
      answer:
        "Deli is a food delivery service that offers a variety of local and African cuisines to its customers. Our mission is to provide high-quality, fresh, and locally sourced food to help you enjoy your meal without the hassle of searching for food in your area.",
    },
    {
      id: 2,
      question: "What is Service Fee?",
      answer:
        "Deli charges a service fee of 15% on the total price of your order. This fee is included in your order confirmation and will be deducted from your account balance after your order is delivered.",
    },
    {
      id: 3,
      question: "Why do we charge service fee?",
      answer:
        "Service fees are a necessary component of our business model to cover our costs and ensure that our customers receive the best possible experience. By charging a service fee, we help to fund our operations, invest in new restaurants, and support our team of delivery drivers.",
    },
    {
      id: 4,
      question: "How do I create an account on Deli?",
      answer:
        "To create an account on Deli, simply visit our website, enter your name, email address, and password, and click the 'Sign Up' button. You will receive a confirmation email to verify your account and set up your profile.",
    },
    {
      id: 5,
      question: "How do I update my profile?",
      answer:
        "To update your profile, simply visit your account settings page, make your desired changes, and click the 'Update Profile' button. You will receive a confirmation email to verify your changes.",
    },
    {
      id: 6,
      question: "What Locations do we currently deliver to?",
      answer:
        "We currently pick up and also deliver food to places in Lagos.This means you can find your favourite restaurants and food vendors who are in these locations and order your meals from them.",
    },
  ];

  return (
    <div className="w-full pt-20" id="faqs">
      <div className="w-[90vw] mx-auto border-[3px] outline-2 outline-orange-400 border-orange-400 bg-orange-50 rounded-lg relative -top-60 p-5 md:p-10">
        <div className="flex flex-col md:flex-row gap-5">
          <div className=" w-full md:w-1/2 flex flex-col order-2 md:order-1 gap-10 h-40 md:h-full ">
            <h2 className="text-3xl hidden md:block md:text-5xl font-bold">FAQs</h2>
            <h2 className="text-3xl md:hidden md:text-5xl font-bold">Questions</h2>
            <div className="gap-5 flex flex-row md:flex-col overflow-scroll">
              {faqs.map((faq) => (
                <Button
                  className={`md:w-[90%] h-14 text-lg md:text-xl md:block text-left justify-start border-white ${selectedFaq === faq.id ? 'bg-green-700 text-white hover:bg-green-800' : ''}`}
                  key={faq.id}
                  onClick={() => setSelectedFaq(faq.id)}
                >
                  {faq.question}
                </Button>
              ))}
            </div>
          </div>

          <div className="md:w-1/2 flex flex-col order-1 md:order-2 gap-10">
            <h2 className="text-3xl hidden md:block md:text-5xl font-bold">Answer</h2>
            <h2 className="text-3xl md:hidden md:text-5xl font-bold">FAQs</h2>
            <div className="px-5">
              <Image
                src="/images/icons8-star-48.png"
                alt="star"
                width={50}
                height={50}
                className="w-10 h-10 mb-5"
              />
              <p className="text-xl leading-relaxed">
                {faqs.find(faq => faq.id === selectedFaq)?.answer}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faqs;
