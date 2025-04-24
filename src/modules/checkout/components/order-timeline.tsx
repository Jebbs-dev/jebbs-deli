import React from 'react';

const steps = [
  {
    title: 'Order Received',
    description: 'Waiting for vendor to confirm your order.',
    time: '10:44am',
  },
  {
    title: 'Preparing Your Order',
    description: 'Your order will be ready in 35 minutes',
    time: '10:44am',
  },
  {
    title: 'Order Ready',
    description: 'Your order is ready for pickup.',
    time: '11:06am',
  },
  {
    title: 'Rider Accepted Order',
    description: 'Your order has been assigned to a rider.',
    time: '11:10am',
  },
  {
    title: 'Rider At The Vendor',
    description: 'Rider is waiting to pick up your order',
    time: '11:18am',
  },
  {
    title: 'Rider Picked Up Order',
    description: 'Your order is on its way.',
    time: '11:20am',
  },
];

const OrderTimeline = () => {
  return (
    <div className="max-w-md mx-auto p-4">
      <div className="mb-4">
        <p className="text-sm text-gray-400">Delivery Time</p>
        <h2 className="text-2xl font-semibold">1 hour 5 mins</h2>
      </div>
      <div className="border-l-2 border-green-500 pl-4 space-y-6">
        {steps.map((step, idx) => (
          <div key={idx} className="relative">
            <div className="absolute -left-[25px] top-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow" />
            <h3 className="text-green-700 font-medium">{step.title}</h3>
            <p className="text-sm text-gray-500">{step.description}</p>
            <p className="text-sm text-gray-400 mt-1">{step.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTimeline;
