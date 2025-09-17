import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, XCircle, ArrowLeft } from "lucide-react";

interface CancelSlipProps {
  name: string;
  profit: number;
  onClose: () => void;
  onBack: () => void;
}

const CancelSlip = ({ name, profit, onClose, onBack }: CancelSlipProps) => {
  const cancellationId = `CANCEL-${Date.now().toString().slice(-8)}`;
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
              <XCircle className="h-6 w-6 text-destructive" />
              <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
                Investment Cancelled
              </CardTitle>
            </div>
            <div className="w-8"></div>
          </div>
          <div className="bg-destructive/10 p-3 rounded-lg">
            <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
            <p className="text-destructive font-medium">Investment Process Cancelled</p>
          </div>
        </CardHeader>

        <ScrollArea className="flex-1">
          <CardContent className="space-y-6">
            {/* Cancellation Header */}
            <div className="text-center pb-4 border-b">
              <h3 className="font-bold text-lg">InvestPro Cancellation Services</h3>
              <p className="text-sm text-muted-foreground">Customer Support: support@investpro.com</p>
              <p className="text-sm text-muted-foreground">Cancellation ID: #{cancellationId}</p>
            </div>

            {/* Cancellation Details */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cancellation Date:</span>
                <span className="font-semibold">{currentDate.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cancellation Time:</span>
                <span className="font-semibold">{currentDate.toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Customer Name:</span>
                <span className="font-semibold">{name}</span>
              </div>
            </div>

            {/* Investment Summary */}
            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              <h3 className="font-semibold text-center">Investment Summary</h3>
              <div className="flex justify-between">
                <span>Potential Profit:</span>
                <span>₹{profit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Investment Status:</span>
                <span className="text-destructive font-semibold">CANCELLED</span>
              </div>
              <div className="flex justify-between border-t pt-3 font-bold text-lg">
                <span>Refund Amount:</span>
                <span className="text-success">
                  Full Investment Amount
                </span>
              </div>
            </div>

            {/* Refund Information */}
            <div className="bg-success/10 border border-success/20 p-4 rounded-lg">
              <h3 className="font-semibold text-success mb-2">Refund Policy</h3>
              <div className="space-y-2 text-sm">
                <p>• Full investment amount will be refunded</p>
                <p>• Refund processing time: 7-15 business days</p>
                <p>• Refund will be credited to your original payment method</p>
                <p>• You will receive a confirmation email shortly</p>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Important Notice</h3>
              <div className="space-y-2 text-sm text-blue-700">
                <p>• No charges or penalties for cancellation</p>
                <p>• Your account remains active for future investments</p>
                <p>• Contact support for any queries: support@investpro.com</p>
                <p>• Keep this cancellation slip for your records</p>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-muted-foreground space-y-1">
              <p>This is a computer-generated cancellation slip.</p>
              <p>Thank you for considering InvestPro services!</p>
              <p>We hope to serve you again in the future.</p>
            </div>
          </CardContent>
        </ScrollArea>

        {/* Close Button - Fixed at bottom */}
        <div className="p-4 sm:p-6 pt-4 flex-shrink-0">
          <Button
            onClick={onClose}
            className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 text-sm sm:text-base py-3 sm:py-2"
          >
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CancelSlip;
