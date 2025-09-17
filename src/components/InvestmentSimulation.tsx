import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import CandlestickChart from "./CandlestickChart";
import PayoutSlip from "./PayoutSlip";

interface InvestmentSimulationProps {
  name: string;
  amount: number;
  onComplete: () => void;
}

const InvestmentSimulation = ({ name, amount, onComplete }: InvestmentSimulationProps) => {
  const [progress, setProgress] = useState(0);
  const [currentValue, setCurrentValue] = useState(amount);
  const [isComplete, setIsComplete] = useState(false);
  const [showPayout, setShowPayout] = useState(false);
  const finalAmount = amount * 102;

  useEffect(() => {
    const duration = 90000; // 1.5 minutes
    const interval = 100; // Update every 100ms
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = (currentStep / steps) * 100;
      setProgress(newProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        setIsComplete(true);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [amount, finalAmount]);

  const handlePriceUpdate = (newPrice: number) => {
    setCurrentValue(newPrice);
  };

  const handleChartComplete = () => {
    // Chart is complete, current value should already be at final profit
    setIsComplete(true);
  };


  if (showPayout) {
    return <PayoutSlip name={name} initialAmount={amount} finalAmount={finalAmount} onClose={onComplete} />;
  }

  return (
    <div className="space-y-3 sm:space-y-6 w-full max-w-full px-2 sm:px-4">
      <div className="text-center px-2">
        <h2 className="text-lg sm:text-2xl font-bold mb-2">Investment Analysis in Progress</h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          AI is analyzing market conditions for {name}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-3">
        <div
          className="bg-gradient-primary h-3 rounded-full transition-all duration-100 shadow-glow"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Candlestick Chart */}
      <CandlestickChart 
        initialPrice={amount}
        finalPrice={finalAmount}
        duration={90000}
        onDataUpdate={handlePriceUpdate}
        onComplete={handleChartComplete}
      />

      {/* Live Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-gradient-card p-3 sm:p-4 rounded-xl text-center">
          <p className="text-sm text-muted-foreground">Initial Investment</p>
          <p className="text-xl sm:text-2xl font-bold text-primary">₹{amount.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-card p-3 sm:p-4 rounded-xl text-center">
          <p className="text-sm text-muted-foreground">Current Value</p>
          <p className="text-xl sm:text-2xl font-bold text-success">
            ₹{currentValue.toLocaleString()}
          </p>
        </div>
      </div>

      {isComplete && (
        <div className="text-center space-y-3 sm:space-y-4 animate-fade-in px-2">
          <div className="bg-gradient-success p-3 sm:p-6 rounded-xl shadow-success">
            <h3 className="text-lg sm:text-2xl font-bold text-success-foreground mb-2">
              Investment Complete! 🎉
            </h3>
            <p className="text-sm sm:text-base text-success-foreground/90 mb-3 sm:mb-4">
              Your investment has grown by {((finalAmount - amount) / amount * 100).toFixed(0)}%
            </p>
            <div className="text-xl sm:text-4xl font-bold text-success-foreground">
              ₹{finalAmount.toLocaleString()}
            </div>
          </div>
          <Button
            onClick={() => setShowPayout(true)}
            className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-sm sm:text-base py-3 sm:py-2"
          >
            View Payout Details
          </Button>
        </div>
      )}
    </div>
  );
};

export default InvestmentSimulation;