import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, CreditCard, QrCode } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCouponValidation } from "@/hooks/useCouponValidation";
import { isValidCPF, formatCPF } from "@/lib/cpfValidator";
const Checkout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { validateCoupon, validatingCoupon } = useCouponValidation();
  
  const planType = searchParams.get("plan") as "pro" | "premium";
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    coupon: "",
  });
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [qrCodeBase64, setQrCodeBase64] = useState("");
  const [discount, setDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [paymentId, setPaymentId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "credit_card">("pix");

  const plans = {
    pro: {
      name: "Plano Profissional",
      price: 9.99,
      features: [
        "Aparecer nos resultados de busca",
        "Perfil completo sem limites",
        "Galeria ilimitada de fotos",
        "Contato direto via WhatsApp",
        "Badge Verificado",
        "Suporte por WhatsApp",
      ],
    },
    premium: {
      name: "Plano Premium",
      price: 29.99,
      features: [
        "Destaque máximo na página inicial",
        "Topo dos resultados de busca",
        "Destaque visual exclusivo (Glow)",
        "Slide fluido no carrossel principal",
        "Relatório detalhado de leads",
        "Prioridade total na região",
      ],
    },
  };

  useEffect(() => {
    if (!planType || !plans[planType]) {
      navigate("/assinatura");
    }
  }, [planType, navigate]);

  useEffect(() => {
    if (!paymentId) return;

    const checkPaymentStatus = setInterval(async () => {
      const { data } = await supabase
        .from("payment_attempts")
        .select("status")
        .eq("payment_id", paymentId)
        .single();

      if (data?.status === "approved") {
        clearInterval(checkPaymentStatus);
        toast({
          title: "Pagamento aprovado!",
          description: "Redirecionando para seu perfil...",
        });
        setTimeout(() => {
          navigate("/perfil");
        }, 2000);
      }
    }, 3000);

    return () => clearInterval(checkPaymentStatus);
  }, [paymentId, navigate, toast]);

  if (!planType || !plans[planType]) {
    return null;
  }

  const plan = plans[planType];

  const handleApplyCoupon = async () => {
    const result = await validateCoupon(formData.coupon, plan.price);
    setDiscount(result.discount);
    setFinalAmount(result.finalAmount);
  };

  const handleCreatePayment = async () => {
    if (!formData.name || !formData.email || !formData.cpf) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para continuar",
        variant: "destructive",
      });
      return;
    }

    if (!isValidCPF(formData.cpf)) {
      toast({
        title: "CPF inválido",
        description: "Por favor, insira um CPF válido",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const amount = finalAmount > 0 ? finalAmount : plan.price;
      
      const { data, error } = await supabase.functions.invoke("create-pix-payment", {
        body: {
          amount: amount,
          name: formData.name,
          email: formData.email,
          cpf: formData.cpf,
          planType: planType,
          coupon: formData.coupon || null,
        },
      });

      if (error) throw error;

      if (data.qrCode && data.qrCodeBase64 && data.paymentId) {
        setQrCode(data.qrCode);
        setQrCodeBase64(data.qrCodeBase64);
        setPaymentId(data.paymentId);
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
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 space-y-4">
            <h1 className="font-display text-4xl lg:text-5xl font-bold">
              Finalizar{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Assinatura
              </span>
            </h1>
            <p className="text-muted-foreground text-lg">
              {plan.name} - R$ {plan.price.toFixed(2)}/mês
            </p>
          </div>

          {!qrCode ? (
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gradient-card border-none shadow-soft">
                <CardHeader>
                  <CardTitle className="font-display text-2xl">Resumo do Plano</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

            <Card className="bg-gradient-card border-none shadow-soft">
              <CardHeader>
                <CardTitle className="font-display text-2xl">Pagamento</CardTitle>
                <CardDescription>
                  Escolha como deseja pagar sua assinatura
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as "pix" | "credit_card")}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="pix" className="gap-2">
                      <QrCode className="h-4 w-4" /> PIX
                    </TabsTrigger>
                    <TabsTrigger value="credit_card" className="gap-2">
                      <CreditCard className="h-4 w-4" /> Cartão
                    </TabsTrigger>
                  </TabsList>

                  <div className="space-y-4">
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
                        onChange={(e) => setFormData({ ...formData, cpf: formatCPF(e.target.value) })}
                        placeholder="000.000.000-00"
                        required
                      />
                    </div>

                    <TabsContent value="credit_card">
                      <div className="p-4 bg-muted/50 rounded-lg border border-dashed border-primary/50 text-center space-y-2">
                        <CreditCard className="h-8 w-8 mx-auto text-primary opacity-50" />
                        <p className="text-sm font-medium">Pagamento via Cartão de Crédito</p>
                        <p className="text-xs text-muted-foreground">
                          Você será redirecionado para o ambiente seguro do Mercado Pago para finalizar com seu cartão.
                        </p>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>

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
                            R$ {plan.price.toFixed(2)}
                          </span>
                        )}
                        <span className="text-2xl font-bold text-primary">
                          R$ {(finalAmount > 0 ? finalAmount : plan.price).toFixed(2)}
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
            </div>
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
                      R$ {(finalAmount > 0 ? finalAmount : plan.price).toFixed(2)}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Status: <span className="font-semibold">Aguardando pagamento...</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-4">
                    Após a confirmação do pagamento, você será redirecionado automaticamente para criar seu perfil.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
};

export default Checkout;
