import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TrendingUp, Shield, Zap } from "lucide-react";
import InvestmentModal from "./InvestmentModal";

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-card/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                InvestPro
              </h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-foreground/80 hover:text-primary transition-colors">Home</a>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="text-foreground/80 hover:text-primary transition-colors">
                    Privacy Policy
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-gradient-card border-0 shadow-glow max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent text-center">
                      Privacy Policy
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 text-sm text-muted-foreground">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h3 className="font-semibold text-foreground mb-2">Investment Cancellation Policy</h3>
                      <p>
                        If your investment is cancelled at any stage of the process, 
                        the full investment amount will be refunded to your original 
                        payment method within 7-15 business days.
                      </p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h3 className="font-semibold text-foreground mb-2">Data Protection</h3>
                      <p>
                        We are committed to protecting your personal information and 
                        ensuring secure transactions. All data is encrypted and stored 
                        securely in compliance with industry standards.
                      </p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h3 className="font-semibold text-foreground mb-2">Contact Information</h3>
                      <p>
                        For any queries regarding refunds or privacy concerns, 
                        please contact our support team at support@investpro.com
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto px-4">
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
            Smart Investment
            <br />
            Opportunities
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
            Experience professional-grade investment tools with real-time analytics and guaranteed returns. Start your investment journey today.
          </p>

          <Button
            onClick={() => setIsModalOpen(true)}
            className="px-8 sm:px-12 py-4 sm:py-6 text-base sm:text-lg font-semibold bg-gradient-primary hover:shadow-glow transition-all duration-300 transform hover:scale-105"
          >
            Invest Now
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-20 px-4">
          <div className="bg-gradient-card rounded-xl p-8 shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105">
            <Shield className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-3">Secure Investment</h3>
            <p className="text-muted-foreground">
              Your investments are protected with enterprise-grade security and guaranteed returns.
            </p>
          </div>

          <div className="bg-gradient-card rounded-xl p-8 shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105">
            <TrendingUp className="h-12 w-12 text-success mb-4" />
            <h3 className="text-xl font-semibold mb-3">High Returns</h3>
            <p className="text-muted-foreground">
              Experience exceptional growth with our proven investment strategies and market analysis.
            </p>
          </div>

          <div className="bg-gradient-card rounded-xl p-8 shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105">
            <Zap className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-3">Instant Results</h3>
            <p className="text-muted-foreground">
              Real-time portfolio tracking with instant notifications and detailed analytics.
            </p>
          </div>
        </div>
      </main>

      <InvestmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default HomePage;