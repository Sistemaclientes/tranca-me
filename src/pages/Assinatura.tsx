import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Check } from "lucide-react";
import Navbar from "@/components/Navbar";

const Assinatura = () => {
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "premium" | null>(null);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [qrCodeBase64, setQrCodeBase64] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const { toast } = useToast();

  const plans = {
    basic: {
      name: "Plano Básico",
      price: 9.99,
      features: [
        "Acesso à página de busca",
        "Visualizar perfis de trancistas",
        "Ver avaliações",
        "Contato direto via WhatsApp",
      ],
    },
    premium: {
      name: "Plano Premium",
      price: 19.99,
      features: [
        "Todos os recursos do Plano Básico",
        "Perfil em destaque na página inicial",
        "Prioridade nos resultados de busca",
        "Badge especial de destaque",
      ],
    },
  };

  const handleCreatePayment = async () => {
    if (!selectedPlan || !userName) {
      toast({
        title: "Erro",
        description: "Por favor, preencha seu nome e selecione um plano",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setQrCode(null);
    setQrCodeBase64(null);
    setPaymentStatus(null);

    try {
      const { data, error } = await supabase.functions.invoke("create-pix-payment", {
        body: {
          userName,
          email: email || `${userName.replace(/\s/g, '')}@trancabrasil.com`,
          amount: plans[selectedPlan].price,
          planType: plans[selectedPlan].name,
        },
      });

      if (error) throw error;

      if (data.success) {
        setQrCode(data.qrCode);
        setQrCodeBase64(data.qrCodeBase64);
        setPaymentStatus(data.status);
        
        toast({
          title: "QR Code gerado!",
          description: "Escaneie o QR Code para realizar o pagamento via PIX",
        });
      }
    } catch (error: any) {
      console.error("Error creating payment:", error);
      toast({
        title: "Erro ao gerar pagamento",
        description: error.message || "Tente novamente mais tarde",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyQRCode = () => {
    if (qrCode) {
      navigator.clipboard.writeText(qrCode);
      toast({
        title: "Copiado!",
        description: "Código PIX copiado para a área de transferência",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 gradient-text">
              Escolha seu Plano
            </h1>
            <p className="text-muted-foreground text-lg">
              Assinatura mensal com pagamento via PIX
            </p>
          </div>

          {!qrCode ? (
            <>
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {Object.entries(plans).map(([key, plan]) => (
                  <Card
                    key={key}
                    className={`transition-all ${
                      selectedPlan === key
                        ? "border-primary shadow-glow"
                        : "hover:border-primary/50"
                    }`}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {plan.name}
                        {selectedPlan === key && (
                          <Check className="h-6 w-6 text-primary" />
                        )}
                      </CardTitle>
                      <CardDescription>
                        <span className="text-3xl font-bold text-primary">
                          R$ {plan.price.toFixed(2)}
                        </span>
                        <span className="text-muted-foreground">/mês</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        variant={selectedPlan === key ? "hero" : "outline"}
                        className="w-full"
                        onClick={() => setSelectedPlan(key as "basic" | "premium")}
                      >
                        Escolher plano
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {selectedPlan && (
                <Card className="max-w-md mx-auto">
                  <CardHeader>
                    <CardTitle>Dados para Pagamento</CardTitle>
                    <CardDescription>
                      Preencha seus dados para gerar o QR Code PIX
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="userName">Nome Completo *</Label>
                      <Input
                        id="userName"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Seu nome completo"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">E-mail (opcional)</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                      />
                    </div>
                    <Button
                      onClick={handleCreatePayment}
                      disabled={loading || !selectedPlan || !userName}
                      className="w-full"
                      size="lg"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Gerando QR Code...
                        </>
                      ) : (
                        "Gerar QR Code PIX"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Pagamento PIX</CardTitle>
                <CardDescription>
                  Escaneie o QR Code abaixo para pagar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  {qrCodeBase64 && (
                    <img
                      src={`data:image/png;base64,${qrCodeBase64}`}
                      alt="QR Code PIX"
                      className="w-64 h-64"
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Código PIX (Copiar e Colar)</Label>
                  <div className="flex gap-2">
                    <Input value={qrCode || ""} readOnly className="font-mono text-xs" />
                    <Button onClick={copyQRCode} variant="outline">
                      Copiar
                    </Button>
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Valor: <span className="font-bold text-primary">
                      R$ {selectedPlan && plans[selectedPlan].price.toFixed(2)}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Status: <span className="font-semibold">{paymentStatus}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-4">
                    Após o pagamento, seu acesso será liberado automaticamente.
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setQrCode(null);
                    setQrCodeBase64(null);
                    setPaymentStatus(null);
                    setSelectedPlan(null);
                    setUserName("");
                    setEmail("");
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Voltar
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Assinatura;