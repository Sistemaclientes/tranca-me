import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Check, X, Clock } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";

const AdminSuggestions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState<any[]>([]);
  const [neighborhoodSuggestions, setNeighborhoodSuggestions] = useState<any[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    checkAdminAndLoadData();
  }, []);

  const checkAdminAndLoadData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    // Check if user is admin
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roles) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para acessar esta página",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    setIsAdmin(true);
    await loadSuggestions();
    setLoading(false);
  };

  const loadSuggestions = async () => {
    const [citiesResponse, neighborhoodsResponse] = await Promise.all([
      supabase
        .from("city_suggestions")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("neighborhood_suggestions")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);

    if (citiesResponse.data) setCitySuggestions(citiesResponse.data);
    if (neighborhoodsResponse.data) setNeighborhoodSuggestions(neighborhoodsResponse.data);
  };

  const handleApproveCity = async (suggestionId: string) => {
    setProcessingId(suggestionId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase.rpc("approve_city_suggestion", {
        suggestion_id: suggestionId,
        reviewer_id: session.user.id,
      });

      if (error) throw error;

      toast({
        title: "Cidade aprovada!",
        description: "A cidade foi adicionada ao sistema.",
      });

      await loadSuggestions();
    } catch (error: any) {
      toast({
        title: "Erro ao aprovar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleApproveNeighborhood = async (suggestionId: string) => {
    setProcessingId(suggestionId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase.rpc("approve_neighborhood_suggestion", {
        suggestion_id: suggestionId,
        reviewer_id: session.user.id,
      });

      if (error) throw error;

      toast({
        title: "Bairro aprovado!",
        description: "O bairro foi adicionado ao sistema.",
      });

      await loadSuggestions();
    } catch (error: any) {
      toast({
        title: "Erro ao aprovar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const openRejectDialog = (suggestion: any, type: "city" | "neighborhood") => {
    setSelectedSuggestion({ ...suggestion, type });
    setRejectionReason("");
    setRejectDialogOpen(true);
  };

  const handleReject = async () => {
    if (!selectedSuggestion || !rejectionReason.trim()) {
      toast({
        title: "Erro",
        description: "Digite o motivo da rejeição",
        variant: "destructive",
      });
      return;
    }

    setProcessingId(selectedSuggestion.id);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const table = selectedSuggestion.type === "city" 
        ? "city_suggestions" 
        : "neighborhood_suggestions";

      const { error } = await supabase
        .from(table)
        .update({
          status: "rejected",
          rejection_reason: rejectionReason,
          reviewed_by: session.user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", selectedSuggestion.id);

      if (error) throw error;

      toast({
        title: "Sugestão rejeitada",
        description: "O usuário será notificado sobre a rejeição.",
      });

      setRejectDialogOpen(false);
      await loadSuggestions();
    } catch (error: any) {
      toast({
        title: "Erro ao rejeitar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { label: "Pendente", className: "bg-yellow-500" },
      approved: { label: "Aprovado", className: "bg-green-500" },
      rejected: { label: "Rejeitado", className: "bg-red-500" },
    };

    const variant = variants[status as keyof typeof variants] || variants.pending;
    
    return (
      <Badge className={variant.className}>
        {variant.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const pendingCities = citySuggestions.filter((s) => s.status === "pending");
  const pendingNeighborhoods = neighborhoodSuggestions.filter((s) => s.status === "pending");

  return (
    <div className="min-h-screen bg-gradient-warm">
      <Navbar />
      
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="font-display text-4xl font-bold mb-2">
              Gerenciar Sugestões
            </h1>
            <p className="text-muted-foreground">
              Aprove ou rejeite sugestões de cidades e bairros
            </p>
            <div className="flex gap-4 mt-4">
              <Badge variant="outline" className="text-lg py-2 px-4">
                <Clock className="h-4 w-4 mr-2" />
                {pendingCities.length} cidades pendentes
              </Badge>
              <Badge variant="outline" className="text-lg py-2 px-4">
                <Clock className="h-4 w-4 mr-2" />
                {pendingNeighborhoods.length} bairros pendentes
              </Badge>
            </div>
          </div>

          <Tabs defaultValue="cities" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="cities">Cidades</TabsTrigger>
              <TabsTrigger value="neighborhoods">Bairros</TabsTrigger>
            </TabsList>

            <TabsContent value="cities" className="space-y-4">
              {citySuggestions.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">
                      Nenhuma sugestão de cidade ainda
                    </p>
                  </CardContent>
                </Card>
              ) : (
                citySuggestions.map((suggestion) => (
                  <Card key={suggestion.id} className="bg-gradient-card border-none shadow-soft">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2">
                            {suggestion.name} - {suggestion.state}
                            {getStatusBadge(suggestion.status)}
                          </CardTitle>
                          <CardDescription className="mt-2">
                            Sugerido em {new Date(suggestion.created_at).toLocaleDateString("pt-BR")}
                          </CardDescription>
                          {suggestion.rejection_reason && (
                            <p className="mt-2 text-sm text-red-500">
                              Motivo da rejeição: {suggestion.rejection_reason}
                            </p>
                          )}
                        </div>
                        {suggestion.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleApproveCity(suggestion.id)}
                              disabled={processingId === suggestion.id}
                            >
                              {processingId === suggestion.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <Check className="h-4 w-4 mr-1" />
                                  Aprovar
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => openRejectDialog(suggestion, "city")}
                              disabled={processingId === suggestion.id}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Rejeitar
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="neighborhoods" className="space-y-4">
              {neighborhoodSuggestions.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">
                      Nenhuma sugestão de bairro ainda
                    </p>
                  </CardContent>
                </Card>
              ) : (
                neighborhoodSuggestions.map((suggestion) => (
                  <Card key={suggestion.id} className="bg-gradient-card border-none shadow-soft">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2">
                            {suggestion.name} - {suggestion.city_name}
                            {getStatusBadge(suggestion.status)}
                          </CardTitle>
                          <CardDescription className="mt-2">
                            Sugerido em {new Date(suggestion.created_at).toLocaleDateString("pt-BR")}
                          </CardDescription>
                          {suggestion.rejection_reason && (
                            <p className="mt-2 text-sm text-red-500">
                              Motivo da rejeição: {suggestion.rejection_reason}
                            </p>
                          )}
                        </div>
                        {suggestion.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleApproveNeighborhood(suggestion.id)}
                              disabled={processingId === suggestion.id}
                            >
                              {processingId === suggestion.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <Check className="h-4 w-4 mr-1" />
                                  Aprovar
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => openRejectDialog(suggestion, "neighborhood")}
                              disabled={processingId === suggestion.id}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Rejeitar
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rejeitar Sugestão</AlertDialogTitle>
            <AlertDialogDescription>
              Por favor, informe o motivo da rejeição. O usuário receberá esta mensagem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder="Ex: Esta cidade não pertence ao estado de Santa Catarina"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="min-h-[100px]"
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleReject} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Confirmar Rejeição
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminSuggestions;