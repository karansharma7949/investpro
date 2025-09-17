import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Button } from "@/components/ui/button";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import PayoutSlip from "./PayoutSlip";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface InvestmentSimulationProps {
  name: string;
  amount: number;
  onComplete: () => void;
}

const InvestmentSimulation = ({ name, amount, onComplete }: InvestmentSimulationProps) => {
  const [progress, setProgress] = useState(0);
  const [chartData, setChartData] = useState<any>(null);
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

      // Generate realistic chart data
      const labels = Array.from({ length: currentStep + 1 }, (_, i) =>
        new Date(Date.now() - (steps - i) * interval).toLocaleTimeString()
      );

      const dataPoints = Array.from({ length: currentStep + 1 }, (_, i) => {
        const baseGrowth = (i / steps) * (finalAmount - amount);
        const volatility = Math.sin(i * 0.1) * (amount * 0.02);
        return Math.max(amount, amount + baseGrowth + volatility);
      });

      setChartData({
        labels: labels.slice(-20), // Show last 20 points
        datasets: [
          {
            label: "Investment Value (₹)",
            data: dataPoints.slice(-20),
            borderColor: "hsl(220, 95%, 50%)",
            backgroundColor: "hsl(220, 95%, 50%, 0.1)",
            borderWidth: 3,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6,
          },
        ],
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setIsComplete(true);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [amount, finalAmount]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Live Investment Performance",
        color: "hsl(215, 25%, 15%)",
        font: {
          size: 16,
          weight: "bold" as const,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: "hsl(215, 15%, 88%)",
        },
        ticks: {
          color: "hsl(215, 15%, 45%)",
          callback: function (value: any) {
            return "₹" + value.toLocaleString();
          },
        },
      },
      x: {
        grid: {
          color: "hsl(215, 15%, 88%)",
        },
        ticks: {
          color: "hsl(215, 15%, 45%)",
          maxTicksLimit: 5,
        },
      },
    },
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

      {/* Chart */}
      {chartData && (
        <div className="bg-card p-3 sm:p-6 rounded-xl shadow-card overflow-hidden">
          <div className="w-full h-48 sm:h-64">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      )}

      {/* Live Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-gradient-card p-3 sm:p-4 rounded-xl text-center">
          <p className="text-sm text-muted-foreground">Initial Investment</p>
          <p className="text-xl sm:text-2xl font-bold text-primary">₹{amount.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-card p-3 sm:p-4 rounded-xl text-center">
          <p className="text-sm text-muted-foreground">Current Value</p>
          <p className="text-xl sm:text-2xl font-bold text-success">
            ₹{chartData?.datasets[0]?.data?.slice(-1)[0]?.toLocaleString() || amount.toLocaleString()}
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