import { useState, useEffect, useRef } from "react";
import { Chart } from "chart.js";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface CandlestickChartProps {
  initialPrice: number;
  finalPrice: number;
  duration: number;
  onDataUpdate?: (currentPrice: number) => void;
  onComplete?: () => void;
}

interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const CandlestickChart = ({ initialPrice, finalPrice, duration, onDataUpdate, onComplete }: CandlestickChartProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [currentPrice, setCurrentPrice] = useState(initialPrice);
  const [candles, setCandles] = useState<CandleData[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const generateCandle = (previousClose: number, targetPrice: number, progress: number, volatility: number = 0.015): CandleData => {
    // Market phases: create different behaviors throughout the progression
    const marketPhase = Math.floor(progress * 12) % 4; // 4 different market phases
    
    // Calculate overall trend (should be positive but with pullbacks)
    const trend = (targetPrice - initialPrice) * progress;
    
    // Market sentiment based on phase
    let bullishProbability = 0.5;
    let volatilityMultiplier = 1.0;
    
    switch (marketPhase) {
      case 0: // Accumulation phase - mixed, lower volatility
        bullishProbability = 0.45;
        volatilityMultiplier = 0.8;
        break;
      case 1: // Uptrend phase - more bullish
        bullishProbability = 0.65;
        volatilityMultiplier = 1.2;
        break;
      case 2: // Distribution/correction phase - more bearish
        bullishProbability = 0.3; // Even more bearish
        volatilityMultiplier = 1.8;
        break;
      case 3: // Recovery phase - mixed but leaning bullish
        bullishProbability = 0.55;
        volatilityMultiplier = 1.0;
        break;
    }
    
    // Add some randomness to the probability
    bullishProbability += (Math.random() - 0.5) * 0.3;
    bullishProbability = Math.max(0.2, Math.min(0.8, bullishProbability));
    
    // Determine if this candle should be bullish or bearish
    // Force some bearish candles especially in early/mid stages
    const forceBearish = progress < 0.7 && Math.random() < 0.4;
    const isBullish = !forceBearish && Math.random() < bullishProbability;
    
    const open = previousClose;
    
    // Calculate price movement with multiple factors
    const randomWalk = (Math.random() - 0.5) * volatility * volatilityMultiplier * previousClose;
    const momentum = Math.sin(progress * Math.PI * 8 + marketPhase) * volatility * previousClose * 0.8;
    const trendForce = trend * 0.05; // Gentle upward pull
    const meanReversion = (initialPrice * 1.5 - open) * 0.001; // Slight pull toward mean
    
    // Calculate close price
    let close;
    if (isBullish) {
      // Bullish candle - but not always guaranteed profit
      const upwardForce = Math.abs(randomWalk) * 0.7 + momentum * 0.6 + trendForce;
      const downwardForce = (Math.random() - 0.7) * volatility * previousClose * 0.3;
      close = open + upwardForce + downwardForce + meanReversion;
    } else {
      // Bearish candle - definite loss
      const downwardForce = Math.abs(randomWalk) * 0.8 + Math.abs(momentum) * 0.4;
      const upwardForce = (Math.random() - 0.8) * volatility * previousClose * 0.2;
      close = open - downwardForce + upwardForce + trendForce * 0.3 + meanReversion;
    }
    
    // Ensure close stays within reasonable bounds but allow for losses
    const minPrice = Math.min(initialPrice * 0.6, previousClose * 0.85); // Allow significant losses
    const maxPrice = Math.max(targetPrice * 1.1, previousClose * 1.2); // Allow gains but keep reasonable
    close = Math.max(minPrice, Math.min(maxPrice, close));
    
    // Generate high and low with realistic ranges
    const bodySize = Math.abs(close - open);
    const wickMultiplier = 2.0 + Math.random() * 3.0; // Wicks are 2-5x the body size
    
    let high, low;
    
    // High and low should extend beyond the body realistically
    if (isBullish) {
      // Bullish candle - typically higher high, lower low
      high = Math.max(open, close) + bodySize * wickMultiplier * (0.4 + Math.random() * 0.8);
      low = Math.min(open, close) - bodySize * wickMultiplier * (0.2 + Math.random() * 0.6);
    } else {
      // Bearish candle - typically lower low, but can have higher high
      high = Math.max(open, close) + bodySize * wickMultiplier * (0.3 + Math.random() * 0.7);
      low = Math.min(open, close) - bodySize * wickMultiplier * (0.5 + Math.random() * 0.8);
    }
    
    // Add extra randomness to wicks for more realistic appearance
    high += (Math.random() - 0.3) * volatility * previousClose * volatilityMultiplier;
    low -= (Math.random() - 0.3) * volatility * previousClose * volatilityMultiplier;
    
    // Ensure high is always the highest and low is always the lowest
    high = Math.max(open, close, high);
    low = Math.min(open, close, low);
    
    // Generate realistic volume based on price movement and market phase
    const baseVolume = 1500 + Math.random() * 10000;
    const volumeMultiplier = (bodySize / (volatility * previousClose)) + 0.2;
    const phaseVolumeMultiplier = marketPhase === 2 ? 1.5 : 1.0; // Higher volume in corrections
    const volume = Math.floor(baseVolume * volumeMultiplier * phaseVolumeMultiplier * (0.7 + Math.random() * 0.6));
    
    return {
      time: new Date().toLocaleTimeString(),
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume
    };
  };

  const drawCandlestickChart = () => {
    if (!chartRef.current || candles.length === 0) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Destroy previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const width = chartRef.current.width;
    const height = chartRef.current.height;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Calculate price range
    const allPrices = candles.flatMap(c => [c.high, c.low]);
    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);
    const priceRange = maxPrice - minPrice;

    // Draw background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = '#f3f4f6';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
      
      // Price labels
      const price = maxPrice - (priceRange / 5) * i;
      ctx.fillStyle = '#6b7280';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`₹${price.toFixed(0)}`, padding - 8, y + 4);
    }

    // Draw candlesticks
    const candleWidth = Math.max(6, chartWidth / candles.length - 4);
    
    candles.forEach((candle, index) => {
      const x = padding + (chartWidth / candles.length) * index + (chartWidth / candles.length) / 2;
      
      const yHigh = padding + ((maxPrice - candle.high) / priceRange) * chartHeight;
      const yLow = padding + ((maxPrice - candle.low) / priceRange) * chartHeight;
      const yOpen = padding + ((maxPrice - candle.open) / priceRange) * chartHeight;
      const yClose = padding + ((maxPrice - candle.close) / priceRange) * chartHeight;

      // Draw wick with gradient
      const wickGradient = ctx.createLinearGradient(x, yHigh, x, yLow);
      if (candle.close > candle.open) {
        // Bullish - green
        wickGradient.addColorStop(0, '#059669');
        wickGradient.addColorStop(1, '#10b981');
      } else {
        // Bearish - red
        wickGradient.addColorStop(0, '#dc2626');
        wickGradient.addColorStop(1, '#ef4444');
      }
      
      ctx.strokeStyle = wickGradient;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, yHigh);
      ctx.lineTo(x, yLow);
      ctx.stroke();

      // Draw body with gradient
      const bodyTop = Math.min(yOpen, yClose);
      const bodyHeight = Math.abs(yClose - yOpen);
      
      if (candle.close > candle.open) {
        // Bullish candle - green gradient
        const bodyGradient = ctx.createLinearGradient(x, bodyTop, x, bodyTop + bodyHeight);
        bodyGradient.addColorStop(0, '#34d399');
        bodyGradient.addColorStop(1, '#10b981');
        ctx.fillStyle = bodyGradient;
      } else {
        // Bearish candle - red gradient
        const bodyGradient = ctx.createLinearGradient(x, bodyTop, x, bodyTop + bodyHeight);
        bodyGradient.addColorStop(0, '#f87171');
        bodyGradient.addColorStop(1, '#ef4444');
        ctx.fillStyle = bodyGradient;
      }
      
      // Add subtle border
      ctx.strokeStyle = candle.close > candle.open ? '#059669' : '#dc2626';
      ctx.lineWidth = 0.5;
      
      ctx.fillRect(
        x - candleWidth / 2,
        bodyTop,
        candleWidth,
        Math.max(1, bodyHeight)
      );
      
      // Draw border
      ctx.strokeRect(
        x - candleWidth / 2,
        bodyTop,
        candleWidth,
        Math.max(1, bodyHeight)
      );

      // Time labels (show every 3rd candle to avoid crowding)
      if (index % 3 === 0) {
        ctx.fillStyle = '#9ca3af';
        ctx.font = '9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(candle.time, x, height - 8);
      }
    });

    // Draw title
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Live Trading Chart', width / 2, 20);
  };

  useEffect(() => {
    const interval = 1000; // Update every second
    const totalSteps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / totalSteps;
      
      const lastClose = candles.length > 0 ? candles[candles.length - 1].close : initialPrice;
      
      // Calculate target final price (102X to 104X of initial amount)
      const multiplier = 102 + (Math.random() * 2); // Random between 102 and 104
      const adjustedFinalPrice = initialPrice * multiplier;
      
      const newCandle = generateCandle(lastClose, adjustedFinalPrice, progress);
      
      setCandles(prev => {
        const newCandles = [...prev, newCandle];
        // Keep only last 20 candles for performance
        return newCandles.slice(-20);
      });
      
      setCurrentPrice(newCandle.close);
      onDataUpdate?.(newCandle.close);

      if (currentStep >= totalSteps) {
        clearInterval(timer);
        setIsComplete(true);
        // Ensure final price is sent to parent
        onDataUpdate?.(newCandle.close);
        // Notify parent that animation is complete
        onComplete?.();
        // Animation pauses here - chart remains visible but no new candles are generated
      }
    }, interval);

    return () => clearInterval(timer);
  }, [initialPrice, finalPrice, duration, candles.length]);

  useEffect(() => {
    drawCandlestickChart();
  }, [candles]);

  return (
    <div className="bg-card p-3 sm:p-6 rounded-xl shadow-card overflow-hidden">
      <div className="w-full h-48 sm:h-64">
        <canvas
          ref={chartRef}
          width={800}
          height={400}
          className="w-full h-full"
        />
      </div>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        <div className="text-center">
          <p className="text-muted-foreground">Open</p>
          <p className="font-semibold text-primary">₹{candles.length > 0 ? candles[candles.length - 1].open.toFixed(2) : initialPrice.toFixed(2)}</p>
        </div>
        <div className="text-center">
          <p className="text-muted-foreground">High</p>
          <p className="font-semibold text-success">₹{candles.length > 0 ? Math.max(...candles.slice(-5).map(c => c.high)).toFixed(2) : initialPrice.toFixed(2)}</p>
        </div>
        <div className="text-center">
          <p className="text-muted-foreground">Low</p>
          <p className="font-semibold text-destructive">₹{candles.length > 0 ? Math.min(...candles.slice(-5).map(c => c.low)).toFixed(2) : initialPrice.toFixed(2)}</p>
        </div>
        <div className="text-center">
          <p className="text-muted-foreground">Close</p>
          <p className="font-semibold text-foreground">₹{currentPrice.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default CandlestickChart;
