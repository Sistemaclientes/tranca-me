import { useState } from "react";
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

const SuggestCityDialog = () => {
  const [open, setOpen] = useState(false);
  const [cityName, setCityName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cityName.trim()) {
      toast({
        title: "Erro",
        description: "Digite o nome da cidade",
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
          description: "Você precisa estar logado para sugerir cidades",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("city_suggestions")
        .insert({
          name: cityName.trim(),
          state: "SC",
          suggested_by: session.user.id,
        });

      if (error) {
        if (error.code === "23505") { // Unique constraint violation
          toast({
            title: "Cidade já sugerida",
            description: "Esta cidade já existe ou já foi sugerida anteriormente",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Sugestão enviada!",
          description: "A cidade será avaliada por um administrador em breve.",
        });
        setCityName("");
        setOpen(false);
      }
    } catch (error: any) {
      console.error("Error suggesting city:", error);
      toast({
        title: "Erro ao enviar sugestão",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
          <Plus className="h-4 w-4 mr-2 text-primary" />
          Sugerir nova cidade
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
              <DialogTitle className="text-2xl font-bold tracking-tight">Sugerir Nova Cidade</DialogTitle>
            </div>
            <DialogDescription className="text-muted-foreground text-sm">
              Sua sugestão será avaliada por um administrador antes de ficar disponível.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cityName" className="text-sm font-semibold flex items-center gap-2">
                  Nome da Cidade <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="cityName"
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                  placeholder="Ex: Santo Amaro da Imperatriz"
                  className="h-12 border-muted focus-visible:ring-primary/30 focus-visible:border-primary transition-all bg-muted/20"
                  required
                />
                <div className="flex items-center gap-2 px-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                    Estado: Santa Catarina (SC)
                  </p>
                </div>
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

export default SuggestCityDialog;