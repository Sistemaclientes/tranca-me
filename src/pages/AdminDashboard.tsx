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
  Eye, Power, PowerOff, AlertTriangle, 
  Image as ImageIcon, BarChart3, ShieldAlert
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [braiders, setBraiders] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalBraiders: 0,
    activePlans: 0,
    totalLeads: 0,
    totalRevenue: 0,
    avgRating: 0,
    conversionRate: 0
  });
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    checkAdminAndLoadData();

    const timeout = setTimeout(() => {
      if (loading) {
        setLoading(false);
      }
    }, 15000);

    return () => clearTimeout(timeout);
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
    const [braidersRes, leadsRes, subsRes, reviewsRes, reportsRes] = await Promise.all([
      supabase.from("braider_profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("leads").select("id", { count: "exact" }),
      supabase.from("subscriptions").select("amount").eq("status", "active"),
      supabase.from("reviews").select("*, braider_profiles(professional_name)").order("created_at", { ascending: false }),
      supabase.from("reports").select("*, braider_profiles(professional_name)").order("created_at", { ascending: false })
    ]);

    if (braidersRes.data) {
      setBraiders(braidersRes.data);
      const premiumCount = braidersRes.data.filter(b => b.plan_tier === 'premium' || b.is_premium).length;
      const totalRev = subsRes.data?.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) || 0;
      
      const totalViews = braidersRes.data.reduce((acc, curr) => acc + (curr.view_count || 0), 0);
      const convRate = totalViews > 0 ? ((leadsRes.count || 0) / totalViews) * 100 : 0;
      
      const totalRatings = reviewsRes.data?.reduce((acc, curr) => acc + curr.rating, 0) || 0;
      const avgRating = reviewsRes.data && reviewsRes.data.length > 0 ? totalRatings / reviewsRes.data.length : 0;

      setStats({
        totalBraiders: braidersRes.data.length,
        activePlans: premiumCount,
        totalLeads: leadsRes.count || 0,
        totalRevenue: totalRev,
        avgRating,
        conversionRate: convRate
      });
    }

    if (reviewsRes.data) setReviews(reviewsRes.data);
    if (reportsRes.data) setReports(reportsRes.data);
  };

  const toggleStatus = async (braiderId: string, currentStatus: string) => {
    setProcessingId(braiderId);
    const newStatus = currentStatus === "active" ? "blocked" : "active";
    
    const { error } = await supabase
      .from("braider_profiles")
      .update({ status: newStatus })
      .eq("id", braiderId);

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sucesso", description: `Trancista ${newStatus === "active" ? "ativada" : "bloqueada"}.` });
      await loadData();
    }
    setProcessingId(null);
  };

  const deleteReview = async (reviewId: string) => {
    if (!confirm("Excluir esta avaliação?")) return;
    const { error } = await supabase.from("reviews").delete().eq("id", reviewId);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Avaliação excluída" });
      await loadData();
    }
  };

  const updateReportStatus = async (reportId: string, status: string) => {
    const { error } = await supabase.from("reports").update({ status }).eq("id", reportId);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Status da denúncia atualizado" });
      await loadData();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-warm pb-12">
      <Navbar />
      
      <section className="pt-24 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-4xl font-bold mb-2">Painel Adm Master</h1>
              <p className="text-muted-foreground">Gestão estratégica e operacional da Trancei</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => loadData()} variant="outline" size="sm">
                Atualizar Dados
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            <StatCard title="Trancistas" value={stats.totalBraiders} icon={<Users />} color="text-primary" />
            <StatCard title="Planos Pagos" value={stats.activePlans} icon={<CreditCard />} color="text-secondary" />
            <StatCard title="Leads" value={stats.totalLeads} icon={<MessageSquare />} color="text-blue-500" />
            <StatCard title="Faturamento" value={`R$ ${stats.totalRevenue}`} icon={<TrendingUp />} color="text-green-500" />
            <StatCard title="Avaliação Média" value={stats.avgRating.toFixed(1)} icon={<Star />} color="text-yellow-500" />
            <StatCard title="Conversão" value={`${stats.conversionRate.toFixed(1)}%`} icon={<BarChart3 />} color="text-purple-500" />
          </div>

          <Tabs defaultValue="trancistas" className="w-full">
            <TabsList className="bg-white/50 backdrop-blur-sm p-1 mb-8 overflow-x-auto flex-nowrap h-auto">
              <TabsTrigger value="trancistas">Profissionais</TabsTrigger>
              <TabsTrigger value="reviews">Avaliações</TabsTrigger>
              <TabsTrigger value="reports" className="relative">
                Denúncias
                {reports.filter(r => r.status === 'pending').length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="gallery">Galeria</TabsTrigger>
              <TabsTrigger value="subscriptions">Assinaturas</TabsTrigger>
            </TabsList>

            <TabsContent value="trancistas">
              <Card className="bg-white/80 backdrop-blur-sm border-none shadow-soft overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Profissional</TableHead>
                      <TableHead>Plano</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead>Cliques</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {braiders.map((braider) => (
                      <TableRow key={braider.id}>
                        <TableCell className="font-semibold">{braider.professional_name || braider.name}</TableCell>
                        <TableCell>
                          <Badge variant={braider.plan_tier === 'premium' ? "hero" : "secondary"}>
                            {braider.plan_tier || 'free'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            braider.status === 'active' ? 'bg-green-500' : 
                            braider.status === 'blocked' ? 'bg-destructive' : 'bg-gray-400'
                          }>
                            {braider.status === 'active' ? 'Ativo' : braider.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{braider.city} - {braider.neighborhood}</TableCell>
                        <TableCell>{braider.whatsapp_click_count || 0}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => navigate(`/trancista/${braider.id}`)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => toggleStatus(braider.id, braider.status)}>
                              {braider.status === 'active' ? <PowerOff className="h-4 w-4 text-destructive" /> : <Power className="h-4 w-4 text-green-500" />}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            <TabsContent value="reviews">
              <Card className="bg-white/80 backdrop-blur-sm border-none shadow-soft">
                <ScrollArea className="h-[500px]">
                  <div className="p-6 space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="flex items-start justify-between border-b pb-4 last:border-0">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold">{review.user_name || "Cliente"}</span>
                            <span className="text-muted-foreground text-sm">para</span>
                            <span className="text-primary font-medium">{review.braider_profiles?.professional_name}</span>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-3 w-3 ${i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}`} />
                            ))}
                          </div>
                          <p className="text-sm text-gray-700 italic">"{review.comment}"</p>
                        </div>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteReview(review.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {reviews.length === 0 && <p className="text-center py-12 text-muted-foreground">Nenhuma avaliação encontrada.</p>}
                  </div>
                </ScrollArea>
              </Card>
            </TabsContent>

            <TabsContent value="reports">
              <Card className="bg-white/80 backdrop-blur-sm border-none shadow-soft">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Alvo</TableHead>
                      <TableHead>Motivo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.braider_profiles?.professional_name}</TableCell>
                        <TableCell>{report.reason}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{report.status}</Badge>
                        </TableCell>
                        <TableCell className="text-xs">{new Date(report.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => updateReportStatus(report.id, 'resolved')}>
                              Resolver
                            </Button>
                            <Button size="sm" variant="ghost" className="text-destructive" onClick={() => updateReportStatus(report.id, 'dismissed')}>
                              Ignorar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            <TabsContent value="gallery">
              <Card className="bg-white/80 backdrop-blur-sm border-none shadow-soft p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {braiders.flatMap(b => [
                    b.image_url ? { url: b.image_url, name: b.professional_name } : null,
                    ...(b.gallery_urls || []).map((url: string) => ({ url, name: b.professional_name }))
                  ].filter(Boolean)).map((img, idx) => (
                    <div key={idx} className="group relative aspect-square rounded-lg overflow-hidden border border-white/20">
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center">
                        <span className="text-white text-[10px] mb-1 truncate w-full px-1">{img.name}</span>
                        <Button variant="destructive" size="icon" className="h-6 w-6">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="subscriptions">
              <Card className="bg-white/80 backdrop-blur-sm border-none shadow-soft p-12 text-center">
                <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Faturamento via Mercado Pago</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  A gestão detalhada de faturamento e assinaturas é feita via webhook.
                  Total acumulado: R$ {stats.totalRevenue.toFixed(2)}
                </p>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }: { title: string, value: string | number, icon: any, color: string }) => (
  <Card className="bg-white/80 backdrop-blur-sm border-none shadow-soft border-t-4 border-t-primary/20">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-xs font-bold text-muted-foreground uppercase">{title}</CardTitle>
      <div className={`${color}`}>{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

export default AdminDashboard;
