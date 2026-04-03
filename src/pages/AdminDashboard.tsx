import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, Check, X, Users, MessageSquare, 
  TrendingUp, CreditCard, Star, Trash2, 
  Edit, Eye, Power, PowerOff 
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [braiders, setBraiders] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalBraiders: 0,
    activePlans: 0,
    totalLeads: 0,
    totalRevenue: 0
  });
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    checkAdminAndLoadData();
  }, []);

  const checkAdminAndLoadData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

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
    await loadData();
    setLoading(false);
  };

  const loadData = async () => {
    const [braidersRes, leadsRes, subsRes] = await Promise.all([
      supabase.from("braider_profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("leads").select("id", { count: "exact" }),
      supabase.from("subscriptions").select("amount").eq("status", "approved")
    ]);

    if (braidersRes.data) {
      setBraiders(braidersRes.data);
      const premiumCount = braidersRes.data.filter(b => b.is_premium).length;
      
      const totalRev = subsRes.data?.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) || 0;

      setStats({
        totalBraiders: braidersRes.data.length,
        activePlans: premiumCount,
        totalLeads: leadsRes.count || 0,
        totalRevenue: totalRev
      });
    }
  };

  const toggleStatus = async (braiderId: string, currentStatus: string) => {
    setProcessingId(braiderId);
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    
    const { error } = await supabase
      .from("braider_profiles")
      .update({ status: newStatus })
      .eq("id", braiderId);

    if (error) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Status atualizado",
        description: `Trancista agora está ${newStatus === "active" ? "ativa" : "inativa"}.`,
      });
      await loadData();
    }
    setProcessingId(null);
  };

  const deleteProfile = async (braiderId: string) => {
    if (!confirm("Tem certeza que deseja excluir este perfil? Esta ação é irreversível.")) return;
    
    setProcessingId(braiderId);
    const { error } = await supabase
      .from("braider_profiles")
      .delete()
      .eq("id", braiderId);

    if (error) {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Perfil excluído",
      });
      await loadData();
    }
    setProcessingId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-warm">
      <Navbar />
      
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="font-display text-4xl font-bold mb-2">Painel Administrativo</h1>
            <p className="text-muted-foreground">Gerenciamento completo da plataforma Trancei</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-card border-none shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Trancistas</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBraiders}</div>
                <p className="text-xs text-muted-foreground mt-1">Profissionais cadastradas</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-none shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Planos Ativos</CardTitle>
                <CreditCard className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activePlans}</div>
                <p className="text-xs text-muted-foreground mt-1">Assinaturas Pro/Premium</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-none shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Leads</CardTitle>
                <MessageSquare className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalLeads}</div>
                <p className="text-xs text-muted-foreground mt-1">Conexões geradas</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-none shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Faturamento Total</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                <p className="text-xs text-muted-foreground mt-1">Receita bruta</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="trancistas" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="trancistas">Trancistas</TabsTrigger>
              <TabsTrigger value="assinaturas">Assinaturas</TabsTrigger>
              <TabsTrigger value="config">Configurações</TabsTrigger>
            </TabsList>

            <TabsContent value="trancistas">
              <Card className="bg-gradient-card border-none shadow-soft">
                <CardHeader>
                  <CardTitle>Gerenciar Profissionais</CardTitle>
                  <CardDescription>Visualize e edite os perfis das trancistas</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome Profissional</TableHead>
                        <TableHead>Plano</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Localização</TableHead>
                        <TableHead>Leads</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {braiders.map((braider) => (
                        <TableRow key={braider.id}>
                          <TableCell className="font-medium">{braider.professional_name || braider.name}</TableCell>
                          <TableCell>
                            <Badge variant={braider.is_premium ? "hero" : "secondary"} className="capitalize">
                              {braider.plan_tier || "free"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={braider.status === "active" ? "default" : "destructive"} className={braider.status === "active" ? "bg-green-500" : ""}>
                              {braider.status === "active" ? "Ativo" : "Inativo"}
                            </Badge>
                          </TableCell>
                          <TableCell>{braider.city} / {braider.neighborhood}</TableCell>
                          <TableCell>{braider.whatsapp_click_count || 0}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => navigate(`/trancista/${braider.id}`)} title="Ver Perfil">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => toggleStatus(braider.id, braider.status)} disabled={processingId === braider.id}>
                                {braider.status === "active" ? <PowerOff className="h-4 w-4 text-orange-500" /> : <Power className="h-4 w-4 text-green-500" />}
                              </Button>
                              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteProfile(braider.id)} disabled={processingId === braider.id}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="assinaturas">
              <Card className="bg-gradient-card border-none shadow-soft">
                <CardHeader>
                  <CardTitle>Histórico de Assinaturas</CardTitle>
                  <CardDescription>Pagamentos processados via Mercado Pago</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-12">
                  <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Sistema de faturamento automático será integrado no passo 5.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
