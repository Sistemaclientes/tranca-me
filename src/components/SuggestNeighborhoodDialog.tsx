import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus } from "lucide-react";

interface SuggestNeighborhoodDialogProps {
  cityName: string;
}

const SuggestNeighborhoodDialog = ({ cityName }: SuggestNeighborhoodDialogProps) => {
  const [open, setOpen] = useState(false);
  const [neighborhoodName, setNeighborhoodName] = useState("");
  const [loading, setLoading] = useState(false);
  const [cityId, setCityId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (cityName && open) {
      fetchCityId();
    }
  }, [cityName, open]);

  const fetchCityId = async () => {
    const { data } = await supabase
      .from("cities")
      .select("id")
      .eq("name", cityName)
      .single();

    if (data) {
      setCityId(data.id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!neighborhoodName.trim()) {
      toast({
        title: "Erro",
        description: "Digite o nome do bairro",
        variant: "destructive",
      });
      return;
    }

    if (!cityId) {
      toast({
        title: "Erro",
        description: "Cidade não encontrada",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para sugerir bairros",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("neighborhood_suggestions")
        .insert({
          city_id: cityId,
          city_name: cityName,
          name: neighborhoodName.trim(),
          suggested_by: session.user.id,
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Sugestão enviada!",
        description: "O bairro será avaliado por um administrador em breve.",
      });
      setNeighborhoodName("");
      setOpen(false);
    } catch (error: any) {
      console.error("Error suggesting neighborhood:", error);
      toast({
        title: "Erro ao enviar sugestão",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!cityName) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Sugerir novo bairro
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sugerir Novo Bairro</DialogTitle>
          <DialogDescription>
            Sua sugestão será avaliada por um administrador antes de ficar disponível.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Cidade</Label>
            <Input value={cityName} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="neighborhoodName">Nome do Bairro *</Label>
            <Input
              id="neighborhoodName"
              value={neighborhoodName}
              onChange={(e) => setNeighborhoodName(e.target.value)}
              placeholder="Ex: Centro"
              required
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar Sugestão"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SuggestNeighborhoodDialog;