import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Auth = () => {
  return (
    <div className="min-h-screen bg-gradient-warm">
      <Navbar />
      
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-md">
          <Tabs defaultValue="client" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="client">Cliente</TabsTrigger>
              <TabsTrigger value="braider">Trancista</TabsTrigger>
            </TabsList>
            
            <TabsContent value="client">
              <Card className="border-none shadow-glow">
                <CardHeader>
                  <CardTitle className="font-display text-2xl">Entrar como Cliente</CardTitle>
                  <CardDescription>
                    Encontre as melhores trancistas da sua região
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="client-email">Email</Label>
                    <Input id="client-email" type="email" placeholder="seu@email.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-password">Senha</Label>
                    <Input id="client-password" type="password" />
                  </div>
                  <Button className="w-full" variant="hero">Entrar</Button>
                  <Button className="w-full" variant="outline">Criar Conta</Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="braider">
              <Card className="border-none shadow-glow">
                <CardHeader>
                  <CardTitle className="font-display text-2xl">Entrar como Trancista</CardTitle>
                  <CardDescription>
                    Divulgue seu trabalho e conquiste novos clientes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="braider-email">Email</Label>
                    <Input id="braider-email" type="email" placeholder="seu@email.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="braider-password">Senha</Label>
                    <Input id="braider-password" type="password" />
                  </div>
                  <Button className="w-full" variant="hero">Entrar</Button>
                  <Button className="w-full" variant="outline">Criar Conta Profissional</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default Auth;
