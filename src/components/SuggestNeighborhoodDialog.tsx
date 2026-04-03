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
        <Button variant="outline" size="sm" className="w-full border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
          <Plus className="h-4 w-4 mr-2 text-primary" />
          Sugerir novo bairro
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] overflow-hidden border-none p-0 bg-background shadow-2xl">
        <div className="h-2 w-full bg-gradient-to-r from-primary via-secondary to-primary animate-gradient-x" />
        <div className="p-6">
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-full bg-primary/10">
                <Plus className="h-5 w-5 text-primary" />
              </div>
              <DialogTitle className="text-2xl font-bold tracking-tight">Sugerir Novo Bairro</DialogTitle>
            </div>
            <DialogDescription className="text-muted-foreground text-sm">
              Sua sugestão será avaliada por um administrador antes de ficar disponível.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  Cidade selecionada
                </Label>
                <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg border border-muted-foreground/10">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="font-medium text-foreground">{cityName}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="neighborhoodName" className="text-sm font-semibold flex items-center gap-2">
                  Nome do Bairro <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="neighborhoodName"
                  value={neighborhoodName}
                  onChange={(e) => setNeighborhoodName(e.target.value)}
                  placeholder="Ex: Centro"
                  className="h-12 border-muted focus-visible:ring-primary/30 focus-visible:border-primary transition-all bg-muted/20"
                  required
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-4 border-t border-muted/30">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                disabled={loading}
                className="hover:bg-muted/50 font-medium"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 px-8 font-semibold transition-all duration-300 active:scale-95"
              >
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuggestNeighborhoodDialog;