import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCouponValidation } from "@/hooks/useCouponValidation";

const Assinatura = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { validateCoupon, validatingCoupon } = useCouponValidation();
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "premium" | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    coupon: "",
  });
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [qrCodeBase64, setQrCodeBase64] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "approved">("pending");
  const [discount, setDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);

  const plans = {
    basic: {
      name: "Plano Básico",
      price: 9.99,
      features: [
        "Perfil completo com foto",
        "Galeria de trabalhos",
        "Contato direto via WhatsApp",
        "Listagem em buscas",
        "Edição de perfil",
      ],
    },
    premium: {
      name: "Plano Premium",
      price: 49.90,
      features: [
        "Todos os benefícios do Básico",
        "Destaque na página inicial",
        "Badge Premium",
        "Prioridade nos resultados",
        "Aparecerá em campanha",
        "Suporte prioritário",
      ],
    },
  };

  const handleApplyCoupon = async () => {
    if (!selectedPlan) return;
    
    const result = await validateCoupon(formData.coupon, plans[selectedPlan].price);
    setDiscount(result.discount);
    setFinalAmount(result.finalAmount);
  };

  const handleCreatePayment = async () => {
    if (!selectedPlan || !formData.name || !formData.email || !formData.cpf) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para continuar",
        variant: "destructive",
      });
      return;
    }

    const cleanCpf = formData.cpf.replace(/\D/g, '');
    if (cleanCpf.length !== 11) {
      toast({
        title: "CPF inválido",
        description: "O CPF deve conter 11 dígitos",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const amount = finalAmount > 0 ? finalAmount : plans[selectedPlan].price;
      
      const { data, error } = await supabase.functions.invoke("create-pix-payment", {
        body: {
          amount: amount,
          name: formData.name,
          email: formData.email,
          cpf: formData.cpf,
          planType: selectedPlan,
          coupon: formData.coupon || null,
        },
      });

      if (error) throw error;

      if (data.qrCode && data.qrCodeBase64) {
        setQrCode(data.qrCode);
        setQrCodeBase64(data.qrCodeBase64);
        toast({
          title: "QR Code gerado!",
          description: "Escaneie o código para realizar o pagamento",
        });
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Erro ao gerar pagamento",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyQRCode = () => {
    navigator.clipboard.writeText(qrCode);
    toast({
      title: "Copiado!",
      description: "Código PIX copiado para a área de transferência",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-warm">
      <Navbar />
      
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 space-y-4">
            <h1 className="font-display text-4xl lg:text-5xl font-bold">
              Escolha seu{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Plano
              </span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Torne-se uma trancista destaque na plataforma
            </p>
          </div>

          {!qrCode ? (
            <>
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                {Object.entries(plans).map(([key, plan]) => (
                  <Card
                    key={key}
                    className={`bg-gradient-card border-none shadow-soft transition-all ${
                      selectedPlan === key ? "shadow-glow ring-2 ring-primary" : ""
                    }`}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between font-display text-2xl">
                        {plan.name}
                        {selectedPlan === key && (
                          <Check className="h-6 w-6 text-primary" />
                        )}
                      </CardTitle>
                      <CardDescription className="text-3xl font-bold text-primary pt-2">
                        R$ {plan.price.toFixed(2)}
                        <span className="text-base text-muted-foreground font-normal">/mês</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <ul className="space-y-3">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <span className="text-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        variant={selectedPlan === key ? "hero" : "outline"}
                        className="w-full"
                        size="lg"
                        onClick={() => navigate(`/checkout?plan=${key}`)}
                      >
                        Escolher plano
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {selectedPlan && (
                <Card className="max-w-md mx-auto bg-gradient-card border-none shadow-soft">
                  <CardHeader>
                    <CardTitle className="font-display text-2xl">Dados para Pagamento</CardTitle>
                    <CardDescription>
                      Preencha seus dados para gerar o QR Code PIX
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Seu nome completo"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF *</Label>
                      <Input
                        id="cpf"
                        value={formData.cpf}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 11);
                          const formatted = value
                            .replace(/(\d{3})(\d)/, '$1.$2')
                            .replace(/(\d{3})(\d)/, '$1.$2')
                            .replace(/(\d{3})(\d{1,2})/, '$1-$2');
                          setFormData({ ...formData, cpf: formatted });
                        }}
                        placeholder="000.000.000-00"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="coupon">Cupom de Desconto (opcional)</Label>
                      <div className="flex gap-2">
                        <Input
                          id="coupon"
                          type="text"
                          value={formData.coupon}
                          onChange={(e) => setFormData({ ...formData, coupon: e.target.value.toUpperCase() })}
                          placeholder="CÓDIGO"
                        />
                        <Button
                          onClick={handleApplyCoupon}
                          disabled={validatingCoupon || !formData.coupon}
                          variant="outline"
                        >
                          {validatingCoupon ? "Validando..." : "Aplicar"}
                        </Button>
                      </div>
                      {discount > 0 && (
                        <p className="text-sm text-primary font-semibold">
                          Desconto de R$ {discount.toFixed(2)} aplicado!
                        </p>
                      )}
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold">Total:</span>
                        <div className="text-right">
                          {discount > 0 && (
                            <span className="text-sm text-muted-foreground line-through block">
                              R$ {plans[selectedPlan].price.toFixed(2)}
                            </span>
                          )}
                          <span className="text-2xl font-bold text-primary">
                            R$ {(finalAmount > 0 ? finalAmount : plans[selectedPlan].price).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleCreatePayment}
                      disabled={loading}
                      className="w-full"
                      size="lg"
                    >
                      {loading ? "Gerando QR Code..." : "Gerar QR Code PIX"}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card className="max-w-md mx-auto bg-gradient-card border-none shadow-soft">
              <CardHeader>
                <CardTitle className="font-display text-2xl">Pagamento PIX</CardTitle>
                <CardDescription>
                  Escaneie o QR Code ou copie o código
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center bg-white p-4 rounded-lg">
                  <img
                    src={`data:image/png;base64,${qrCodeBase64}`}
                    alt="QR Code PIX"
                    className="w-64 h-64"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Código PIX (Copia e Cola)</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={qrCode} 
                      readOnly 
                      className="font-mono text-xs"
                    />
                    <Button onClick={copyQRCode} variant="outline">
                      Copiar
                    </Button>
                  </div>
                </div>
                <div className="text-center space-y-2 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Valor: <span className="font-bold text-primary text-lg">
                      R$ {selectedPlan && (finalAmount > 0 ? finalAmount : plans[selectedPlan].price).toFixed(2)}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Status: <span className="font-semibold capitalize">{paymentStatus === "pending" ? "Aguardando pagamento" : "Aprovado"}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-4">
                    Após a confirmação do pagamento, você receberá um e-mail e terá acesso imediato aos benefícios.
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setQrCode("");
                    setQrCodeBase64("");
                    setSelectedPlan(null);
                    setFormData({ name: "", email: "", cpf: "", coupon: "" });
                    setDiscount(0);
                    setFinalAmount(0);
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
      </section>
    </div>
  );
};

export default Assinatura;
