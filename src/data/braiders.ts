export interface Braider {
  id: string;
  name: string;
  city: string;
  neighborhood: string;
  whatsapp: string;
  email: string;
  instagram: string;
  facebook?: string;
  description: string;
  services: string[];
  rating: number;
  reviewCount: number;
  image: string;
}

export const braiders: Braider[] = [
  {
    id: "1",
    name: "Camila Santos",
    city: "São Paulo",
    neighborhood: "Vila Mariana",
    whatsapp: "+55 11 98765-4321",
    email: "camila.trancas@email.com",
    instagram: "@camilatrancas",
    facebook: "CamilaTrançasSP",
    description: "Especialista em box braids e knotless braids com mais de 8 anos de experiência. Atendimento personalizado e produtos de qualidade premium.",
    services: ["Box Braids", "Knotless Braids", "Tranças Nagô", "Manutenção"],
    rating: 4.9,
    reviewCount: 127,
    image: "/src/assets/braider-1.jpg"
  },
  {
    id: "2",
    name: "Juliana Oliveira",
    city: "São Paulo",
    neighborhood: "Itaim Bibi",
    whatsapp: "+55 11 97654-3210",
    email: "ju.trancista@email.com",
    instagram: "@julianatrancas",
    description: "Apaixonada por tranças afro! Trabalho com amor e dedicação para realçar a beleza natural de cada cliente.",
    services: ["Goddess Braids", "Fulani Braids", "Twist Braids", "Cornrows"],
    rating: 4.8,
    reviewCount: 93,
    image: "/src/assets/braider-2.jpg"
  },
  {
    id: "3",
    name: "Rafaela Costa",
    city: "Rio de Janeiro",
    neighborhood: "Copacabana",
    whatsapp: "+55 21 99876-5432",
    email: "rafa.trancas@email.com",
    instagram: "@rafaelatrancasrj",
    facebook: "RafaelaTrançasRio",
    description: "Trancista profissional formada em técnicas africanas. Seu cabelo merece o melhor cuidado e estilo!",
    services: ["Box Braids", "Passion Twists", "Senegalese Twists", "Atendimento Domiciliar"],
    rating: 5.0,
    reviewCount: 156,
    image: "/src/assets/braider-3.jpg"
  },
  {
    id: "4",
    name: "Beatriz Ferreira",
    city: "Rio de Janeiro",
    neighborhood: "Ipanema",
    whatsapp: "+55 21 98765-1234",
    email: "bia.trancista@email.com",
    instagram: "@biatrancas",
    description: "Especializada em tranças sofisticadas e penteados para eventos. Transformo seu visual com arte e técnica!",
    services: ["Cornrows", "Feed-in Braids", "Penteados para Festas", "Tranças Embutidas"],
    rating: 4.7,
    reviewCount: 84,
    image: "/src/assets/braider-4.jpg"
  },
  {
    id: "5",
    name: "Mariana Silva",
    city: "Belo Horizonte",
    neighborhood: "Savassi",
    whatsapp: "+55 31 99123-4567",
    email: "mari.trancas@email.com",
    instagram: "@maritrancasbh",
    description: "Seu cabelo é sua coroa! Trabalho com técnicas modernas e tradicionais para criar looks incríveis.",
    services: ["Knotless Braids", "Jumbo Braids", "Lemonade Braids", "Manutenção e Retirada"],
    rating: 4.9,
    reviewCount: 102,
    image: "/src/assets/braider-5.jpg"
  },
  {
    id: "6",
    name: "Amanda Rodrigues",
    city: "Belo Horizonte",
    neighborhood: "Lourdes",
    whatsapp: "+55 31 98234-5678",
    email: "amanda.trancista@email.com",
    instagram: "@amandatrancas",
    facebook: "AmandaTrançasBH",
    description: "Trancista com certificação internacional. Produtos naturais, ambiente acolhedor e muito carinho em cada trança.",
    services: ["Box Braids Coloridas", "Goddess Locs", "Tribal Braids", "Consultoria Capilar"],
    rating: 4.8,
    reviewCount: 118,
    image: "/src/assets/braider-6.jpg"
  }
];

export const cities = ["São Paulo", "Rio de Janeiro", "Belo Horizonte"];

export const neighborhoodsByCity: Record<string, string[]> = {
  "São Paulo": ["Vila Mariana", "Itaim Bibi", "Pinheiros", "Moema", "Jardins"],
  "Rio de Janeiro": ["Copacabana", "Ipanema", "Leblon", "Botafogo", "Tijuca"],
  "Belo Horizonte": ["Savassi", "Lourdes", "Funcionários", "Serra", "Pampulha"]
};
