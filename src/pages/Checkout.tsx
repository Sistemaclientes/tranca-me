import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, CreditCard, QrCode, Copy, Clock, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCouponValidation } from "@/hooks/useCouponValidation";
import { isValidCPF, formatCPF } from "@/lib/cpfValidator";

declare global {
  interface Window {
    MercadoPago: any;
  }
}

const PIX_EXPIRATION_MINUTES = 30;

const Checkout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { validateCoupon, validatingCoupon } = useCouponValidation();

  const planType = searchParams.get("plan") as "pro" | "premium";

  const [formData, setFormData] = useState({ name: "", email: "", cpf: "", coupon: "" });
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [qrCodeBase64, setQrCodeBase64] = useState("");
  const [discount, setDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [paymentId, setPaymentId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "credit_card">("pix");
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "approved" | "rejected" | "error">("idle");
  const [pixExpiresAt, setPixExpiresAt] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [pixExpired, setPixExpired] = useState(false);

  // Card form state
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [installments, setInstallments] = useState(1);

  const mpRef = useRef<any>(null);

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

  // Initialize Mercado Pago SDK
  useEffect(() => {
    const initMP = () => {
      if (window.MercadoPago) {
        mpRef.current = new window.MercadoPago(import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY || "APP_USR-1823332334143026", {
          locale: "pt-BR",
        });
      } else {
        setTimeout(initMP, 500);
      }
    };
    initMP();
  }, []);

  // Check session
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth?redirect=" + encodeURIComponent(window.location.pathname + window.location.search));
      }
    };
    checkSession();

    if (!planType || !plans[planType]) {
      navigate("/assinatura");
    }
  }, [planType, navigate]);

  // PIX polling
  useEffect(() => {
    if (!paymentId || paymentStatus === "approved") return;

    const interval = setInterval(async () => {
      try {
        const { data } = await supabase.functions.invoke("check-payment-status", {
          body: { payment_id: paymentId },
        });

        if (data?.status === "approved") {
          clearInterval(interval);
          setPaymentStatus("approved");
          toast({ title: "✅ Pagamento aprovado!", description: "Redirecionando para seu perfil..." });
          setTimeout(() => navigate("/perfil"), 2500);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 4000);

    const timeout = setTimeout(() => clearInterval(interval), PIX_EXPIRATION_MINUTES * 60 * 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [paymentId, paymentStatus, navigate, toast]);

  // PIX countdown timer
  useEffect(() => {
    if (!pixExpiresAt) return;

    const tick = setInterval(() => {
      const now = new Date();
      const diff = pixExpiresAt.getTime() - now.getTime();
      if (diff <= 0) {
        setPixExpired(true);
        setTimeLeft("Expirado");
        clearInterval(tick);
        return;
      }
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`);
    }, 1000);

    return () => clearInterval(tick);
  }, [pixExpiresAt]);

  if (!planType || !plans[planType]) return null;
  const plan = plans[planType];
  const currentAmount = finalAmount > 0 ? finalAmount : plan.price;

  const handleApplyCoupon = async () => {
    const result = await validateCoupon(formData.coupon, plan.price);
    setDiscount(result.discount);
    setFinalAmount(result.finalAmount);
  };

  const formatCardNumber = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  const handlePixPayment = async () => {
    if (!formData.name || !formData.email || !formData.cpf) {
      toast({ title: "Campos obrigatórios", description: "Preencha todos os campos", variant: "destructive" });
      return;
    }
    if (!isValidCPF(formData.cpf)) {
      toast({ title: "CPF inválido", description: "Insira um CPF válido", variant: "destructive" });
      return;
    }

    setLoading(true);
    setPaymentStatus("processing");
    try {
      const { data, error } = await supabase.functions.invoke("create-pix-payment", {
        body: {
          amount: currentAmount,
          name: formData.name,
          email: formData.email,
          cpf: formData.cpf,
          planType,
          paymentMethod: "pix",
        },
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || "Erro ao criar pagamento");

      setQrCode(data.qr_code);
      setQrCodeBase64(data.qr_code_base64);
      setPaymentId(data.payment_id);
      setPixExpiresAt(new Date(Date.now() + PIX_EXPIRATION_MINUTES * 60 * 1000));
      setPaymentStatus("idle");
      toast({ title: "QR Code gerado!", description: "Escaneie ou copie o código para pagar" });
    } catch (error: any) {
      console.error("PIX error:", error);
      setPaymentStatus("error");
      toast({ title: "Erro ao gerar PIX", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCardPayment = async () => {
    if (!formData.name || !formData.email || !formData.cpf) {
      toast({ title: "Campos obrigatórios", description: "Preencha todos os campos", variant: "destructive" });
      return;
    }
    if (!isValidCPF(formData.cpf)) {
      toast({ title: "CPF inválido", description: "Insira um CPF válido", variant: "destructive" });
      return;
    }
    if (!cardNumber || !cardExpiry || !cardCvv || !cardHolder) {
      toast({ title: "Dados do cartão", description: "Preencha todos os dados do cartão", variant: "destructive" });
      return;
    }

    if (!mpRef.current) {
      toast({ title: "Erro", description: "SDK de pagamento não carregado. Recarregue a página.", variant: "destructive" });
      return;
    }

    setLoading(true);
    setPaymentStatus("processing");

    try {
      const [expMonth, expYear] = cardExpiry.split("/");
      const cleanCardNumber = cardNumber.replace(/\s/g, "");

      // Create card token using MP SDK
      const cardData = {
        cardNumber: cleanCardNumber,
        cardholderName: cardHolder,
        cardExpirationMonth: expMonth,
        cardExpirationYear: "20" + expYear,
        securityCode: cardCvv,
        identificationType: "CPF",
        identificationNumber: formData.cpf.replace(/\D/g, ""),
      };

      const tokenResponse = await mpRef.current.createCardToken(cardData);

      if (!tokenResponse?.id) {
        throw new Error("Não foi possível tokenizar o cartão. Verifique os dados.");
      }

      // Detect payment method
      let paymentMethodId = "visa";
      const bin = cleanCardNumber.slice(0, 6);
      try {
        const methods = await mpRef.current.getPaymentMethods({ bin });
        if (methods?.results?.[0]) {
          paymentMethodId = methods.results[0].id;
        }
      } catch (e) {
        console.warn("Could not detect payment method, using default");
      }

      const { data, error } = await supabase.functions.invoke("create-card-payment", {
        body: {
          token: tokenResponse.id,
          name: formData.name,
          email: formData.email,
          cpf: formData.cpf,
          amount: currentAmount,
          planType,
          installments,
          payment_method_id: paymentMethodId,
        },
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || "Erro no pagamento");

      if (data.status === "approved") {
        setPaymentStatus("approved");
        toast({ title: "✅ Pagamento aprovado!", description: "Seu plano foi ativado com sucesso!" });
        setTimeout(() => navigate("/perfil"), 2500);
      } else if (data.status === "rejected") {
        setPaymentStatus("rejected");
        toast({
          title: "Pagamento recusado",
          description: getRejectReason(data.status_detail),
          variant: "destructive",
        });
      } else {
        setPaymentStatus("idle");
        setPaymentId(data.payment_id);
        toast({ title: "Pagamento em análise", description: "Aguarde a confirmação." });
      }
    } catch (error: any) {
      console.error("Card error:", error);
      setPaymentStatus("error");
      toast({ title: "Erro no pagamento", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const getRejectReason = (detail: string) => {
    const reasons: Record<string, string> = {
      cc_rejected_insufficient_amount: "Saldo insuficiente",
      cc_rejected_bad_filled_card_number: "Número do cartão incorreto",
      cc_rejected_bad_filled_date: "Data de validade incorreta",
      cc_rejected_bad_filled_security_code: "Código de segurança incorreto",
      cc_rejected_bad_filled_other: "Dados do cartão incorretos",
      cc_rejected_call_for_authorize: "Ligue para a operadora do cartão",
      cc_rejected_card_disabled: "Cartão desativado",
      cc_rejected_duplicated_payment: "Pagamento duplicado",
      cc_rejected_high_risk: "Pagamento recusado por segurança",
      cc_rejected_max_attempts: "Máximo de tentativas excedido",
      cc_rejected_other_reason: "Pagamento recusado pela operadora",
    };
    return reasons[detail] || "Pagamento recusado. Tente outro cartão.";
  };

  const copyQRCode = () => {
    navigator.clipboard.writeText(qrCode);
    toast({ title: "Copiado!", description: "Código PIX copiado" });
  };

  const handleSubmit = () => {
    if (paymentMethod === "pix") {
      handlePixPayment();
    } else {
      handleCardPayment();
    }
  };

  // === PIX QR Code View ===
  if (qrCode) {
    return (
      <div className="min-h-screen bg-gradient-warm">
        <Navbar />
        <section className="pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-md">
            {paymentStatus === "approved" ? (
              <Card className="bg-gradient-card border-none shadow-soft text-center">
                <CardContent className="pt-8 pb-8 space-y-4">
                  <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
                  <h2 className="text-2xl font-bold text-green-600">Pagamento Aprovado!</h2>
                  <p className="text-muted-foreground">Seu plano foi ativado. Redirecionando...</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gradient-card border-none shadow-soft">
                <CardHeader className="text-center">
                  <CardTitle className="font-display text-2xl">Pagamento PIX</CardTitle>
                  <CardDescription>Escaneie o QR Code ou copie o código</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Timer */}
                  <div className={`flex items-center justify-center gap-2 p-2 rounded-lg text-sm font-medium ${pixExpired ? "bg-red-100 text-red-700" : "bg-amber-50 text-amber-700"}`}>
                    <Clock className="h-4 w-4" />
                    {pixExpired ? "QR Code expirado" : `Expira em ${timeLeft}`}
                  </div>

                  {/* QR Code */}
                  <div className="flex justify-center bg-white p-4 rounded-xl border">
                    <img src={`data:image/png;base64,${qrCodeBase64}`} alt="QR Code PIX" className="w-56 h-56" />
                  </div>

                  {/* Copy */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Código PIX (Copia e Cola)</Label>
                    <div className="flex gap-2">
                      <Input value={qrCode} readOnly className="font-mono text-[10px]" />
                      <Button onClick={copyQRCode} variant="outline" size="sm" className="shrink-0 gap-1">
                        <Copy className="h-3 w-3" /> Copiar
                      </Button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="text-center p-4 bg-muted/50 rounded-lg space-y-1">
                    <p className="text-lg font-bold text-primary">R$ {currentAmount.toFixed(2)}</p>
                    <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Aguardando pagamento...
                    </div>
                  </div>

                  {pixExpired && (
                    <Button onClick={() => { setQrCode(""); setQrCodeBase64(""); setPixExpired(false); setPaymentStatus("idle"); }} className="w-full">
                      Gerar novo QR Code
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </div>
    );
  }

  // === Card Approved/Rejected Status ===
  if (paymentStatus === "approved") {
    return (
      <div className="min-h-screen bg-gradient-warm">
        <Navbar />
        <section className="pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-md">
            <Card className="bg-gradient-card border-none shadow-soft text-center">
              <CardContent className="pt-8 pb-8 space-y-4">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
                <h2 className="text-2xl font-bold text-green-600">Pagamento Aprovado!</h2>
                <p className="text-muted-foreground">Seu plano {plan.name} foi ativado com sucesso.</p>
                <p className="text-sm text-muted-foreground">Redirecionando para seu perfil...</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    );
  }

  // === Main Checkout Form ===
  return (
    <div className="min-h-screen bg-gradient-warm">
      <Navbar />
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8 space-y-2">
            <h1 className="font-display text-3xl lg:text-4xl font-bold">
              Finalizar <span className="bg-gradient-hero bg-clip-text text-transparent">Assinatura</span>
            </h1>
            <p className="text-muted-foreground">{plan.name} - R$ {plan.price.toFixed(2)}/mês</p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {/* Plan Summary */}
            <Card className="md:col-span-2 bg-gradient-card border-none shadow-soft h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="font-display text-xl">Resumo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-4 border-t space-y-2">
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Desconto:</span>
                      <span className="text-primary font-medium">-R$ {discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-primary">R$ {currentAmount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Form */}
            <Card className="md:col-span-3 bg-gradient-card border-none shadow-soft">
              <CardHeader className="pb-4">
                <CardTitle className="font-display text-xl">Pagamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as "pix" | "credit_card")}>
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="pix" className="gap-2 text-sm">
                      <QrCode className="h-4 w-4" /> PIX
                    </TabsTrigger>
                    <TabsTrigger value="credit_card" className="gap-2 text-sm">
                      <CreditCard className="h-4 w-4" /> Cartão
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                {/* Personal Info */}
                <div className="grid gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="name" className="text-xs">Nome Completo *</Label>
                    <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Seu nome completo" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="email" className="text-xs">E-mail *</Label>
                      <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="seu@email.com" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="cpf" className="text-xs">CPF *</Label>
                      <Input id="cpf" value={formData.cpf} onChange={(e) => setFormData({ ...formData, cpf: formatCPF(e.target.value) })} placeholder="000.000.000-00" />
                    </div>
                  </div>
                </div>

                {/* Credit Card Fields */}
                {paymentMethod === "credit_card" && (
                  <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-border/50">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Dados do Cartão</p>
                    <div className="space-y-1">
                      <Label className="text-xs">Número do Cartão</Label>
                      <Input value={cardNumber} onChange={(e) => setCardNumber(formatCardNumber(e.target.value))} placeholder="0000 0000 0000 0000" maxLength={19} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Nome no Cartão</Label>
                      <Input value={cardHolder} onChange={(e) => setCardHolder(e.target.value.toUpperCase())} placeholder="NOME COMO NO CARTÃO" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Validade</Label>
                        <Input value={cardExpiry} onChange={(e) => setCardExpiry(formatExpiry(e.target.value))} placeholder="MM/AA" maxLength={5} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">CVV</Label>
                        <Input type="password" value={cardCvv} onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="•••" maxLength={4} />
                      </div>
                    </div>
                    {currentAmount >= 10 && (
                      <div className="space-y-1">
                        <Label className="text-xs">Parcelas</Label>
                        <select
                          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                          value={installments}
                          onChange={(e) => setInstallments(Number(e.target.value))}
                        >
                          {Array.from({ length: Math.min(12, Math.floor(currentAmount / 5) || 1) }, (_, i) => i + 1).map((n) => (
                            <option key={n} value={n}>
                              {n}x de R$ {(currentAmount / n).toFixed(2)} {n === 1 ? "(à vista)" : ""}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                )}

                {/* Coupon */}
                <div className="space-y-1">
                  <Label className="text-xs">Cupom (opcional)</Label>
                  <div className="flex gap-2">
                    <Input value={formData.coupon} onChange={(e) => setFormData({ ...formData, coupon: e.target.value.toUpperCase() })} placeholder="CÓDIGO" />
                    <Button onClick={handleApplyCoupon} disabled={validatingCoupon || !formData.coupon} variant="outline" size="sm">
                      {validatingCoupon ? "..." : "Aplicar"}
                    </Button>
                  </div>
                  {discount > 0 && <p className="text-xs text-primary font-semibold">Desconto de R$ {discount.toFixed(2)} aplicado!</p>}
                </div>

                {/* Rejected feedback */}
                {paymentStatus === "rejected" && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    Pagamento recusado. Verifique os dados ou tente outro cartão.
                  </div>
                )}

                {/* Submit */}
                <Button onClick={handleSubmit} disabled={loading} className="w-full" size="lg">
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Processando...</>
                  ) : paymentMethod === "pix" ? (
                    <><QrCode className="h-4 w-4 mr-2" /> Gerar QR Code PIX</>
                  ) : (
                    <><CreditCard className="h-4 w-4 mr-2" /> Pagar R$ {currentAmount.toFixed(2)}</>
                  )}
                </Button>

                <p className="text-[10px] text-center text-muted-foreground">
                  Pagamento processado com segurança pelo Mercado Pago. Seus dados estão protegidos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Checkout;
