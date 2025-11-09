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
        <Button variant="outline" size="sm" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Sugerir nova cidade
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sugerir Nova Cidade</DialogTitle>
          <DialogDescription>
            Sua sugestão será avaliada por um administrador antes de ficar disponível.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cityName">Nome da Cidade *</Label>
            <Input
              id="cityName"
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
              placeholder="Ex: Santo Amaro da Imperatriz"
              required
            />
            <p className="text-xs text-muted-foreground">
              Estado: Santa Catarina (SC)
            </p>
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

export default SuggestCityDialog;