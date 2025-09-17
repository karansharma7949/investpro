import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Receipt, Clock, ArrowLeft } from "lucide-react";
import GSTBill from "./GSTBill";
import CancelSlip from "./CancelSlip";

interface PayoutSlipProps {
  name: string;
  initialAmount: number;
  finalAmount: number;
  onClose: () => void;
}

const PayoutSlip = ({ name, initialAmount, finalAmount, onClose }: PayoutSlipProps) => {
  const [discount, setDiscount] = useState("50");
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [showCancel, setShowCancel] = useState(false);
  const [showGSTBill, setShowGSTBill] = useState(false);

  const profit = finalAmount - initialAmount;
  const baseGST = profit * 0.18; // 18% GST
  const discountPercent = parseInt(discount) / 100;
  const finalGST = baseGST * (1 - discountPercent);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (showCancel) {
    return <CancelSlip name={name} profit={profit} onClose={onClose} onBack={() => setShowCancel(false)} />;
  }

  if (showGSTBill) {
    return (
      <GSTBill
        name={name}
        profit={profit}
        gstAmount={finalGST}
        discount={parseInt(discount)}
        onClose={onClose}
        onBack={() => setShowGSTBill(false)}
      />
    );
  }

  return (
    <div className="space-y-4 w-[95vw] max-w-sm sm:max-w-md h-[85vh] flex flex-col mx-auto px-2 sm:px-4">
      <Card className="bg-gradient-card border-0 shadow-glow h-full flex flex-col">
        <CardHeader className="text-center pb-3 flex-shrink-0 px-3 sm:px-6">
          <div className="flex items-center justify-between mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2 hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <Receipt className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <CardTitle className="text-lg sm:text-2xl bg-gradient-primary bg-clip-text text-transparent">
                Payout Slip
              </CardTitle>
            </div>
            <div className="w-8"></div>
          </div>
          <div className="flex items-center justify-center space-x-2 text-destructive">
            <Clock className="h-4 w-4" />
            <span className="font-mono text-base sm:text-lg font-bold">
              {formatTime(timeLeft)}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">Time remaining to pay GST</p>
        </CardHeader>

        <ScrollArea className="flex-1">
          <CardContent className="space-y-4 px-3 sm:px-6">
          {/* Investment Summary */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Investor Name:</span>
              <span className="font-semibold">{name}</span>
            </div>
            <div className="flex justify-between text-sm sm:text-base">
              <span className="text-muted-foreground">Initial Investment:</span>
              <span className="font-bold text-base sm:text-lg">₹{initialAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm sm:text-base">
              <span className="text-muted-foreground">Final Amount:</span>
              <span className="font-bold text-base sm:text-lg text-success">₹{finalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t pt-3 text-sm sm:text-base">
              <span className="font-semibold">Total Profit:</span>
              <span className="font-bold text-base sm:text-lg">₹{profit.toLocaleString()}</span>
            </div>
          </div>

          {/* GST Calculation */}
          <div className="bg-muted/50 p-3 sm:p-4 rounded-lg space-y-3">
            <h3 className="font-semibold text-center text-sm sm:text-base">GST Calculation (18% on Profit)</h3>
            <div className="flex justify-between text-sm sm:text-base">
              <span>Base GST Amount:</span>
              <span>₹{baseGST.toLocaleString()}</span>
            </div>

            {/* Discount Options */}
            <div className="space-y-2">
              <Label className="text-xs sm:text-sm font-medium">Select Discount:</Label>
              <RadioGroup value={discount} onValueChange={setDiscount}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="50" id="50" />
                  <Label htmlFor="50" className="text-xs sm:text-sm">50% discount on GST</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="30" id="30" />
                  <Label htmlFor="30" className="text-xs sm:text-sm">30% discount on GST</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="20" id="20" />
                  <Label htmlFor="20" className="text-xs sm:text-sm">20% discount on GST</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex justify-between border-t pt-3 font-bold text-sm sm:text-base">
              <span>Final GST Amount:</span>
              <span className="text-primary">
                ₹{finalGST.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Warning Message */}
          <div className="bg-destructive/10 border border-destructive/20 p-3 sm:p-4 rounded-lg text-center">
            <p className="text-destructive font-medium text-xs sm:text-sm">
              Please pay GST to proceed with your payout
            </p>
          </div>

          </CardContent>
        </ScrollArea>

        {/* Action Buttons - Fixed at bottom */}
        <div className="p-3 sm:p-6 pt-3 flex-shrink-0 space-y-2">
          <Button
            onClick={() => setShowGSTBill(true)}
            className="w-full bg-gradient-success hover:shadow-success transition-all duration-300 text-xs sm:text-base py-2 sm:py-3"
          >
            Pay GST
          </Button>
          <Button
            onClick={() => setShowCancel(true)}
            variant="destructive"
            className="w-full bg-red-600 hover:bg-red-700 text-white transition-all duration-300 text-xs sm:text-base py-2 sm:py-3"
          >
            Cancel Process
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PayoutSlip;