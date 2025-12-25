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
    city: "Florianópolis",
    neighborhood: "Centro",
    whatsapp: "+55 48 98765-4321",
    email: "camila.trancas@email.com",
    instagram: "@camilatrancas",
    facebook: "CamilaTrançasFloripa",
    description: "Especialista em box braids e knotless braids com mais de 8 anos de experiência. Atendimento personalizado e produtos de qualidade premium.",
    services: ["Box Braids", "Knotless Braids", "Tranças Nagô", "Manutenção"],
    rating: 4.9,
    reviewCount: 127,
    image: "/src/assets/braider-1.jpg"
  },
  {
    id: "2",
    name: "Juliana Oliveira",
    city: "Florianópolis",
    neighborhood: "Trindade",
    whatsapp: "+55 48 97654-3210",
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
    city: "São José",
    neighborhood: "Kobrasol",
    whatsapp: "+55 48 99876-5432",
    email: "rafa.trancas@email.com",
    instagram: "@rafaelatrancassj",
    facebook: "RafaelaTrançasSJ",
    description: "Trancista profissional formada em técnicas africanas. Seu cabelo merece o melhor cuidado e estilo!",
    services: ["Box Braids", "Passion Twists", "Senegalese Twists", "Atendimento Domiciliar"],
    rating: 5.0,
    reviewCount: 156,
    image: "/src/assets/braider-3.jpg"
  },
  {
    id: "4",
    name: "Beatriz Ferreira",
    city: "São José",
    neighborhood: "Campinas",
    whatsapp: "+55 48 98765-1234",
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
    city: "Palhoça",
    neighborhood: "Pedra Branca",
    whatsapp: "+55 48 99123-4567",
    email: "mari.trancas@email.com",
    instagram: "@maritrancasph",
    description: "Seu cabelo é sua coroa! Trabalho com técnicas modernas e tradicionais para criar looks incríveis.",
    services: ["Knotless Braids", "Jumbo Braids", "Lemonade Braids", "Manutenção e Retirada"],
    rating: 4.9,
    reviewCount: 102,
    image: "/src/assets/braider-5.jpg"
  },
  {
    id: "6",
    name: "Amanda Rodrigues",
    city: "Biguaçu",
    neighborhood: "Centro",
    whatsapp: "+55 48 98234-5678",
    email: "amanda.trancista@email.com",
    instagram: "@amandatrancas",
    facebook: "AmandaTrançasBiguaçu",
    description: "Trancista com certificação internacional. Produtos naturais, ambiente acolhedor e muito carinho em cada trança.",
    services: ["Box Braids Coloridas", "Goddess Locs", "Tribal Braids", "Consultoria Capilar"],
    rating: 4.8,
    reviewCount: 118,
    image: "/src/assets/braider-6.jpg"
  }
];

export const cities = ["Florianópolis", "São José", "Palhoça", "Biguaçu"];

export const neighborhoodsByCity: Record<string, string[]> = {
  "Florianópolis": ["Centro", "Trindade", "Ingleses", "Canasvieiras", "Lagoa da Conceição", "Campeche", "Coqueiros", "Itacorubi", "Córrego Grande", "Agronômica"],
  "São José": ["Centro", "Kobrasol", "Campinas", "Barreiros", "Forquilhinhas", "Bela Vista"],
  "Palhoça": ["Centro", "Pedra Branca", "Pagani", "Aririu", "Ponte do Imaruim"],
  "Biguaçu": ["Centro", "Vendaval", "Jardim Janaína", "Bom Viver"]
};
