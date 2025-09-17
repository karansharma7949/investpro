import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import InvestmentSimulation from "./InvestmentSimulation";

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InvestmentModal = ({ isOpen, onClose }: InvestmentModalProps) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !amount) {
      toast({
        title: "Required Fields",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    const investmentAmount = parseFloat(amount);
    if (investmentAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid investment amount.",
        variant: "destructive",
      });
      return;
    }

    setIsSimulating(true);
  };

  const handleSimulationComplete = () => {
    setIsSimulating(false);
    onClose();
    // Reset form
    setName("");
    setAmount("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-card border-0 shadow-glow mx-auto p-4 sm:p-6">
        {!isSimulating ? (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Start Your Investment
              </h2>
              <p className="text-muted-foreground mt-2">
                Enter your details to begin your investment journey
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="bg-background/50 border-border focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Investment Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter investment amount"
                  min="1"
                  step="0.01"
                  className="bg-background/50 border-border focus:border-primary"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 text-sm sm:text-base py-3 sm:py-2"
              >
                Start Investment
              </Button>
            </form>
          </div>
        ) : (
          <InvestmentSimulation
            name={name}
            amount={parseFloat(amount)}
            onComplete={handleSimulationComplete}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InvestmentModal;