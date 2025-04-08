"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";



const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <div>
      <form className="mt-5 space-y-4">
        <div className="flex flex-row gap-3">
          <Input
            id="name"
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e: any) => setName(e.target.value)}
          />
          <Input
            id="email"
            type="email"
            placeholder="Your Email Address"
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
          />
          <Input
            id="phone"
            type="text"
            placeholder="Your Phone Number"
            value={phone}
            onChange={(e: any) => setPhone(e.target.value)}
          />
        </div>

        <div className="my-10">
          <Textarea id="message" placeholder="Type a message" value={message}  onChange={(e: any) => setMessage(e.target.value)} />
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
};

export default ContactForm;
