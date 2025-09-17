import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Receipt, CheckCircle, ArrowLeft } from "lucide-react";

interface GSTBillProps {
  name: string;
  profit: number;
  gstAmount: number;
  discount: number;
  onClose: () => void;
  onBack: () => void;
}

const GSTBill = ({ name, profit, gstAmount, discount, onClose, onBack }: GSTBillProps) => {
  const billNumber = `GST-${Date.now().toString().slice(-8)}`;
  const currentDate = new Date();

  return (
    <div className="space-y-6 w-full max-w-md sm:max-w-lg h-[80vh] flex flex-col mx-auto px-4 sm:px-0">
      <Card className="bg-gradient-card border-0 shadow-glow h-full flex flex-col">
        <CardHeader className="text-center pb-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2 hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <Receipt className="h-6 w-6 text-success" />
              <CardTitle className="text-2xl bg-gradient-success bg-clip-text text-transparent">
                GST Payment Bill
              </CardTitle>
            </div>
            <div className="w-8"></div>
          </div>
          <div className="bg-success/10 p-3 rounded-lg">
            <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
            <p className="text-success font-medium">Payment Processed Successfully</p>
          </div>
        </CardHeader>

        <ScrollArea className="flex-1">
          <CardContent className="space-y-6">
          {/* Bill Header */}
          <div className="text-center pb-4 border-b">
            <h3 className="font-bold text-lg">InvestPro GST Services</h3>
            <p className="text-sm text-muted-foreground">Tax Registration: 12ABCDE1234F1Z5</p>
            <p className="text-sm text-muted-foreground">GST Bill #{billNumber}</p>
          </div>

          {/* Bill Details */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-success font-bold">{discount}% OFF</span>
              <span className="font-bold text-lg">₹{gstAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bill Time:</span>
              <span className="font-semibold">{currentDate.toLocaleTimeString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Customer Name:</span>
              <span className="font-semibold">{name}</span>
            </div>
          </div>

          {/* Transaction Summary */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-3">
            <h3 className="font-semibold text-center">Transaction Summary</h3>
            <div className="flex justify-between">
              <span>Profit Amount:</span>
              <span>₹{profit.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>GST Rate:</span>
              <span>18%</span>
            </div>
            <div className="flex justify-between">
              <span>Base GST:</span>
              <span>₹{(profit * 0.18).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-success">
              <span>Discount Applied:</span>
              <span>{discount}% OFF</span>
            </div>
            <div className="flex justify-between border-t pt-3 font-bold text-lg">
              <span>Amount Paid:</span>
              <span className="text-success">
                ₹{gstAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Payment Status */}
          <div className="bg-success/10 border border-success/20 p-4 rounded-lg text-center">
            <p className="text-success font-medium mb-2">✓ Payment Confirmed</p>
            <p className="text-sm text-muted-foreground">
              Your payout will be processed within 2-3 business days.
            </p>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground space-y-1">
            <p>This is a computer-generated bill.</p>
            <p>Thank you for using InvestPro services!</p>
          </div>
          </CardContent>
        </ScrollArea>

        {/* Close Button - Fixed at bottom */}
        <div className="p-4 sm:p-6 pt-4 flex-shrink-0">
          <Button
            onClick={onClose}
            className="w-full bg-gradient-success hover:shadow-success transition-all duration-300 text-sm sm:text-base py-3 sm:py-2"
          >
            Complete Transaction
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default GSTBill;