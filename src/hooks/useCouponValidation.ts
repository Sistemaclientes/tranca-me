import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useCouponValidation = () => {
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const { toast } = useToast();

  const validateCoupon = async (code: string, planAmount: number) => {
    if (!code.trim()) {
      return { valid: false, discount: 0, finalAmount: planAmount };
    }

    setValidatingCoupon(true);
    try {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", code)
        .eq("is_active", true)
        .single();

      if (error || !data) {
        toast({
          title: "Cupom inválido",
          description: "O cupom informado não existe ou não está ativo.",
          variant: "destructive",
        });
        return { valid: false, discount: 0, finalAmount: planAmount };
      }

      // Check if coupon is expired
      if (data.valid_until && new Date(data.valid_until) < new Date()) {
        toast({
          title: "Cupom expirado",
          description: "Este cupom não está mais válido.",
          variant: "destructive",
        });
        return { valid: false, discount: 0, finalAmount: planAmount };
      }

      // Check if coupon reached max uses
      if (data.max_uses && data.current_uses >= data.max_uses) {
        toast({
          title: "Cupom esgotado",
          description: "Este cupom atingiu o limite de usos.",
          variant: "destructive",
        });
        return { valid: false, discount: 0, finalAmount: planAmount };
      }

      // Calculate discount
      let discount = 0;
      if (data.discount_percent) {
        discount = (planAmount * data.discount_percent) / 100;
      } else if (data.discount_amount) {
        discount = Number(data.discount_amount);
      }

      const finalAmount = Math.max(0, planAmount - discount);

      toast({
        title: "Cupom aplicado!",
        description: `Desconto de R$ ${discount.toFixed(2)} aplicado.`,
      });

      return { valid: true, discount, finalAmount, couponData: data };
    } catch (error) {
      console.error("Erro ao validar cupom:", error);
      toast({
        title: "Erro ao validar cupom",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
      return { valid: false, discount: 0, finalAmount: planAmount };
    } finally {
      setValidatingCoupon(false);
    }
  };

  return { validateCoupon, validatingCoupon };
};
