import React from 'react';
import { ChefHat, BellRing, CheckCircle2, Clock } from 'lucide-react';

const OrderTracker = ({ status, orderNumber }) => {
  const steps = [
    {
      id: 'preparing',
      label: 'Preparing',
      desc: 'Chef is preparing your food in the canteen',
      icon: ChefHat,
    },
    {
      id: 'ready',
      label: 'Ready for Pickup',
      desc: 'Your food is ready! Proceed to the counter',
      icon: BellRing,
    },
    {
      id: 'collected',
      label: 'Collected',
      desc: 'Order collected. Enjoy your meal!',
      icon: CheckCircle2,
    },
  ];

  const getStepIndex = (currentStatus) => {
    switch (currentStatus) {
      case 'preparing':
        return 0;
      case 'ready':
        return 1;
      case 'collected':
        return 2;
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex(status);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-gray-100 gap-2">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md">
            Live Order Status
          </span>
          <h2 className="text-2xl font-black text-gray-900 mt-2">
            Order #{orderNumber}
          </h2>
        </div>
        <div className="text-sm font-medium text-gray-500 flex items-center">
          <Clock className="w-4 h-4 mr-1.5 text-orange-500" />
          Status: <span className="ml-1 text-gray-900 font-bold capitalize">{status}</span>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-200">
        {steps.map((step, index) => {
          const isDone = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isPending = index > currentIndex;
          const Icon = step.icon;

          return (
            <div key={step.id} className="relative flex items-start group">
              {/* Status Circle Indicator */}
              <div
                className={`absolute -left-6 sm:-left-8 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 transition ${
                  isDone
                    ? 'bg-green-600 border-green-600 text-white'
                    : isCurrent
                    ? 'bg-orange-600 border-orange-600 text-white animate-pulse'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>

              {/* Step Details */}
              <div className="ml-4">
                <h4
                  className={`text-base font-bold ${
                    isCurrent
                      ? 'text-orange-600'
                      : isDone
                      ? 'text-gray-900'
                      : 'text-gray-400'
                  }`}
                >
                  {step.label}
                  {isCurrent && (
                    <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-semibold">
                      In Progress
                    </span>
                  )}
                  {isDone && (
                    <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                      Completed
                    </span>
                  )}
                </h4>
                <p className="text-sm text-gray-500 mt-0.5">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTracker;
