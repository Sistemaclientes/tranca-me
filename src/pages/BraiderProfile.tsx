import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, MapPin, Star, Phone, Mail, Instagram, Facebook, Edit, Heart, Flag, Search, MessageCircle, AlertTriangle, Loader2 } from "lucide-react";
import ImageGallery from "@/components/ImageGallery";
import FavoriteButton from "@/components/FavoriteButton";
import ReviewsSection from "@/components/ReviewsSection";
import FeaturedBraidersCarousel from "@/components/FeaturedBraidersCarousel";
import { useLeads } from "@/hooks/useLeads";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formatPhoneNumber = (phone: string): string => {
  const digits = phone.replace(/[^0-9]/g, '');
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return phone;
};

const BraiderProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [braider, setBraider] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);
  const { registerLead } = useLeads();

  useEffect(() => {
    loadProfile();
    const timeout = setTimeout(() => {
      if (loading) setLoading(false);
    }, 10000);
    return () => clearTimeout(timeout);
  }, [id]);

  const loadProfile = async () => {
    try {
      const { data: profile } = await supabase
        .from("braider_profiles")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (profile) {
        const { data: { session } } = await supabase.auth.getSession();
        const is_owner = session?.user?.id === profile.user_id;
        
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session?.user?.id)
          .eq("role", "admin")
          .maybeSingle();
        
        const is_admin = !!roleData;
        
        if ((profile.status === 'blocked' || profile.status === 'expired') && !is_owner && !is_admin) {
          navigate("/trancista-nao-encontrada");
          return;
        }

        setBraider(profile);
        setIsOwner(is_owner);
        await supabase.rpc('increment_view_count', { profile_id: id });
      } else {
        navigate("/trancista-nao-encontrada");
      }
    } catch (error) {
      navigate("/trancista-nao-encontrada");
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = async () => {
    const success = await registerLead(braider.id);
    if (success) {
      const message = encodeURIComponent(`Olá ${braider.name}! Encontrei seu perfil na plataforma de trancistas e gostaria de agendar um horário.`);
      window.open(`https://wa.me/${braider.whatsapp.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
    } else {
      toast.error("Erro ao registrar interesse. Tente novamente.");
    }
  };

  const handleReport = async () => {
    if (!reportReason) {
      toast.error("Por favor, selecione um motivo.");
      return;
    }

    setSubmittingReport(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast.error("Faça login para denunciar um perfil.");
      setSubmittingReport(false);
      return;
    }

    const { error } = await supabase.from("reports").insert({
      braider_id: id,
      reporter_id: session.user.id,
      reason: reportReason,
      description: reportDescription,
    });

    if (error) {
      toast.error("Erro ao enviar denúncia: " + error.message);
    } else {
      toast.success("Denúncia enviada com sucesso. Analisaremos o caso.");
      setIsReportDialogOpen(false);
      setReportReason("");
      setReportDescription("");
    }
    setSubmittingReport(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!braider) return null;

  return (
    <div className="min-h-screen bg-gradient-warm">
      <Navbar />
      
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {braider.status !== 'active' && braider.status !== 'trial' && (
            <Card className="mb-8 border-none bg-destructive/10 text-destructive shadow-soft">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-destructive/20 rounded-full"><Phone className="h-5 w-5" /></span>
                  <div>
                    <p className="font-bold">{braider.status === 'blocked' ? 'Perfil Bloqueado' : 'Plano Expirado'}</p>
                    <p className="text-sm opacity-90">{isOwner ? 'Seu perfil está oculto. Regularize seu pagamento.' : 'Perfil indisponível.'}</p>
                  </div>
                </div>
                {isOwner && <Button variant="destructive" onClick={() => navigate("/assinatura")}>Regularizar Agora</Button>}
              </CardContent>
            </Card>
          )}

          <Button variant="ghost" onClick={() => navigate("/buscar")} className="mb-6"><ArrowLeft className="h-4 w-4" /> Voltar</Button>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <Card className="bg-gradient-card border-none shadow-soft overflow-hidden">
                <img src={braider.image_url || "/placeholder.svg"} className="w-full aspect-square object-cover" alt="" />
                <CardContent className="p-6 space-y-4">
                  <h1 className="font-display text-2xl font-bold">{braider.professional_name || braider.name}</h1>
                  <div className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-4 w-4" /><span>{braider.neighborhood}, {braider.city}</span></div>
                  
                  <div className="flex flex-col gap-3">
                    <Button variant="hero" className="w-full h-12" onClick={handleWhatsApp} disabled={braider.status === 'blocked' || braider.status === 'expired'}>
                      <MessageCircle className="h-5 w-5 mr-2" /> Agendar via WhatsApp
                    </Button>
                    <FavoriteButton braiderId={id!} />
                    <Button variant="outline" className="w-full" onClick={() => setIsReportDialogOpen(true)}><Flag className="h-4 w-4 mr-2" /> Denunciar Perfil</Button>
                    {isOwner && <Button variant="outline" className="w-full border-primary/30" onClick={() => navigate("/perfil")}><Edit className="h-4 w-4 mr-2" /> Editar Perfil</Button>}
                  </div>
                </CardContent>
              </Card>

              {braider.video_url && (
                <Card className="bg-gradient-card border-none shadow-soft overflow-hidden">
                  <CardContent className="p-0"><div className="aspect-video"><video controls className="w-full h-full" src={braider.video_url} /></div></CardContent>
                </Card>
              )}
            </div>

            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-gradient-card border-none shadow-soft p-6">
                <h2 className="font-display text-xl font-semibold mb-4">Sobre & Contato</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3"><Phone className="h-5 w-5 text-primary" /><span>{formatPhoneNumber(braider.whatsapp)}</span></div>
                    <div className="flex items-center gap-3"><Mail className="h-5 w-5 text-primary" /><span>{braider.email}</span></div>
                    {braider.instagram && <div className="flex items-center gap-3"><Instagram className="h-5 w-5 text-primary" /><span>{braider.instagram}</span></div>}
                  </div>
                  <div className="space-y-3"><p>{braider.description}</p></div>
                </div>
                <Separator className="my-6" />
                <h2 className="font-display text-xl font-semibold mb-4">Serviços</h2>
                <div className="flex flex-wrap gap-2">
                  {(braider.braid_types || []).map((t: string) => <Badge key={t} variant="hero">{t}</Badge>)}
                  {(braider.services || []).map((s: string) => <Badge key={s} variant="secondary">{s}</Badge>)}
                </div>
                {braider.gallery_urls && (
                  <><Separator className="my-6" /><h2 className="font-display text-xl font-semibold mb-4">Galeria</h2><ImageGallery images={braider.gallery_urls} title={braider.professional_name} isPremium={braider.is_premium} /></>
                )}
                <Separator className="my-6" /><h2 className="font-display text-xl font-semibold mb-4">Avaliações</h2><ReviewsSection braiderId={id!} />
              </Card>
            </div>
          </div>

          <div className="mt-16"><h2 className="font-display text-3xl font-bold mb-8 text-center">Trancistas Recomendadas</h2><FeaturedBraidersCarousel /></div>
        </div>
      </section>

      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Denunciar Perfil</DialogTitle><DialogDescription>Informe o motivo da denúncia para análise da administração.</DialogDescription></DialogHeader>
          <div className="space-y-4 py-4">
            <Select onValueChange={setReportReason} value={reportReason}>
              <SelectTrigger><SelectValue placeholder="Selecione o motivo" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="fraude">Conteúdo Falso / Fraude</SelectItem>
                <SelectItem value="improprio">Conteúdo Impróprio</SelectItem>
                <SelectItem value="spam">Spam / Publicidade Indesejada</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
            <Textarea placeholder="Descreva mais detalhes (opcional)" value={reportDescription} onChange={(e) => setReportDescription(e.target.value)} />
          </div>
          <DialogFooter><Button variant="ghost" onClick={() => setIsReportDialogOpen(false)}>Cancelar</Button><Button variant="destructive" onClick={handleReport} disabled={submittingReport}>{submittingReport ? <Loader2 className="animate-spin" /> : "Enviar Denúncia"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BraiderProfile;
