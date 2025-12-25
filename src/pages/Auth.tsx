import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import braider1 from "@/assets/braider-1.jpg";
import braider2 from "@/assets/braider-2.jpg";
import braider3 from "@/assets/braider-3.jpg";

const Auth = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    // Check if this is a password reset flow
    const isReset = searchParams.get("reset") === "true";
    if (isReset) {
      setShowResetPassword(true);
    }
  }, [searchParams]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Only redirect if not in reset password flow
      if (session && !showResetPassword) {
        navigate("/escolher");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && !showResetPassword) {
        navigate("/escolher");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, showResetPassword]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupPassword !== signupConfirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    if (signupPassword.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    const { error } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPassword,
      options: {
        emailRedirectTo: `${window.location.origin}/escolher`,
      },
    });

    if (error) {
      let message = error.message;
      if (error.message.includes("already registered")) {
        message = "Este email já está cadastrado. Faça login.";
      }
      toast({
        title: "Erro ao criar conta",
        description: message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Conta criada com sucesso!",
        description: "Você já pode fazer login.",
      });
      setSignupEmail("");
      setSignupPassword("");
      setSignupConfirmPassword("");
    }
    setIsLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    if (error) {
      let message = error.message;
      if (error.message.includes("Invalid login credentials")) {
        message = "Email ou senha incorretos.";
      }
      toast({
        title: "Erro ao fazer login",
        description: message,
        variant: "destructive",
      });
    } else {
      toast({ 
        title: "Login realizado!", 
        description: "Redirecionando..." 
      });
    }
    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/auth?reset=true`,
    });

    if (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
      setShowForgotPassword(false);
      setResetEmail("");
    }
    setIsLoading(false);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmNewPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      toast({
        title: "Erro ao redefinir senha",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Senha redefinida!",
        description: "Sua senha foi alterada com sucesso.",
      });
      setShowResetPassword(false);
      setNewPassword("");
      setConfirmNewPassword("");
      navigate("/escolher");
    }
    setIsLoading(false);
  };

  // Reset Password Form
  if (showResetPassword) {
    return (
      <div className="min-h-screen bg-gradient-warm">
        <Navbar />
        
        <section className="pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-md">
            <Card className="border-none shadow-glow">
              <CardHeader>
                <CardTitle className="font-display text-2xl">Redefinir Senha</CardTitle>
                <CardDescription>
                  Digite sua nova senha
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nova Senha</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-new-password">Confirmar Nova Senha</Label>
                    <Input
                      id="confirm-new-password"
                      type="password"
                      placeholder="Repita a nova senha"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  <Button className="w-full" variant="hero" type="submit" disabled={isLoading}>
                    {isLoading ? "Salvando..." : "Salvar Nova Senha"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-warm">
      <Navbar />
      
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Images */}
            <div className="hidden lg:block space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src={braider1} 
                  alt="Modelo com tranças" 
                  className="rounded-2xl shadow-lg w-full h-64 object-cover"
                />
                <img 
                  src={braider2} 
                  alt="Modelo com tranças" 
                  className="rounded-2xl shadow-lg w-full h-64 object-cover mt-8"
                />
              </div>
              <img 
                src={braider3} 
                alt="Modelo com tranças" 
                className="rounded-2xl shadow-lg w-full h-48 object-cover"
              />
              <div className="text-center mt-6">
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                  Conectando você às melhores trancistas
                </h2>
                <p className="text-muted-foreground">
                  Encontre profissionais qualificadas na sua região
                </p>
              </div>
            </div>

            {/* Right side - Auth Forms */}
            <div className="w-full max-w-md mx-auto">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="login">Entrar</TabsTrigger>
                  <TabsTrigger value="signup">Criar Conta</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <Card className="border-none shadow-glow">
                    <CardHeader>
                      <CardTitle className="font-display text-2xl">Bem-vinda de volta!</CardTitle>
                      <CardDescription>
                        Entre com seu email e senha
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSignIn} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="login-email">Email</Label>
                          <Input 
                            id="login-email" 
                            type="email" 
                            placeholder="seu@email.com"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="login-password">Senha</Label>
                          <Input 
                            id="login-password" 
                            type="password"
                            placeholder="••••••••"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            required
                            minLength={6}
                          />
                        </div>
                        <Button className="w-full" variant="hero" type="submit" disabled={isLoading}>
                          {isLoading ? "Entrando..." : "Entrar"}
                        </Button>
                        <button
                          type="button"
                          onClick={() => setShowForgotPassword(true)}
                          className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          Esqueceu sua senha?
                        </button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Forgot Password Modal */}
                {showForgotPassword && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-md border-none shadow-glow">
                      <CardHeader>
                        <CardTitle className="font-display text-2xl">Recuperar Senha</CardTitle>
                        <CardDescription>
                          Digite seu email para receber o link de recuperação
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleForgotPassword} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="reset-email">Email</Label>
                            <Input
                              id="reset-email"
                              type="email"
                              placeholder="seu@email.com"
                              value={resetEmail}
                              onChange={(e) => setResetEmail(e.target.value)}
                              required
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              className="flex-1"
                              onClick={() => {
                                setShowForgotPassword(false);
                                setResetEmail("");
                              }}
                            >
                              Cancelar
                            </Button>
                            <Button className="flex-1" variant="hero" type="submit" disabled={isLoading}>
                              {isLoading ? "Enviando..." : "Enviar Email"}
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                )}

                <TabsContent value="signup">
                  <Card className="border-none shadow-glow">
                    <CardHeader>
                      <CardTitle className="font-display text-2xl">Criar Conta</CardTitle>
                      <CardDescription>
                        Cadastre-se para começar
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSignUp} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="signup-email">Email</Label>
                          <Input 
                            id="signup-email" 
                            type="email" 
                            placeholder="seu@email.com"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-password">Senha</Label>
                          <Input 
                            id="signup-password" 
                            type="password"
                            placeholder="Mínimo 6 caracteres"
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            required
                            minLength={6}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-confirm-password">Confirmar Senha</Label>
                          <Input 
                            id="signup-confirm-password" 
                            type="password"
                            placeholder="Repita a senha"
                            value={signupConfirmPassword}
                            onChange={(e) => setSignupConfirmPassword(e.target.value)}
                            required
                            minLength={6}
                          />
                        </div>
                        <Button className="w-full" variant="hero" type="submit" disabled={isLoading}>
                          {isLoading ? "Criando conta..." : "Criar Conta"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Auth;
