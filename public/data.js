export const subcategoryLabels = {
  apto_alto: 'Apartamento (Alto)',
  apto_medio: 'Apartamento (Médio)',
  apto_baixo: 'Apartamento (Baixo)',
  casa_alto: 'Casa (Alto)',
  casa_medio: 'Casa (Médio)',
  casa_baixo: 'Casa (Baixo)',
  garagem: 'Garagem',
  penthouse: 'Penthouse',
  agencia: 'Agência',
  escritorio: 'Escritório',
  armazem: 'Armazém',
  armazem_veiculos: 'Armazém de Veículos',
  carro: 'Carro',
  moto: 'Moto',
  barco: 'Barco',
  helicoptero: 'Helicóptero',
  aviao: 'Avião',
  veiculo_especial: 'Veículo Especial',
  obra_arte: 'Obra de Arte',
  decoracao: 'Decoração',
  colecionavel: 'Colecionável',
  arma_rara: 'Arma Especial',
  bunker: 'Bunker',
  hangar: 'Hangar',
  complexo: 'Complexo',
  boate: 'Boate',
  arena_oficina: 'Oficina da Arena',
  arcade: 'Arcade',
  oficina_tuning: 'Oficina de Tuning',
  ferro_velho: 'Ferro-Velho',
  escritorio_fianca: 'Escritório de Fiança',
  fabrica_roupas: 'Fábrica de Roupas',
  hangar_mckenzie: 'Hangar McKenzie',
  lava_rapido: 'Lava-Rápido',
  higgins_helitour: 'Higgins Helitour',
  smoke_on_the_water: 'Smoke on the Water',
  mc_cocaine: 'MC - Cocaína',
  mc_maconha: 'MC - Maconha',
  mc_dinheiro_falso: 'MC - Dinheiro Falso',
  mc_meth: 'MC - Metanfetamina',
  mc_docs_falsos: 'MC - Documentos Falsos'
};

export const subcategoryOptions = {
  IMOVEL: [
    'apto_alto',
    'apto_medio',
    'apto_baixo',
    'casa_alto',
    'casa_medio',
    'casa_baixo',
    'garagem',
    'penthouse',
    'agencia',
    'escritorio',
    'armazem',
    'armazem_veiculos'
  ],
  VEICULO: ['carro', 'moto', 'barco', 'helicoptero', 'aviao', 'veiculo_especial'],
  PROPRIEDADE_MOVEL: ['obra_arte', 'decoracao', 'colecionavel', 'arma_rara', 'veiculo_especial'],
  RENDA: [
    'bunker',
    'hangar',
    'complexo',
    'boate',
    'arena_oficina',
    'arcade',
    'oficina_tuning',
    'ferro_velho',
    'escritorio_fianca',
    'fabrica_roupas',
    'hangar_mckenzie',
    'lava_rapido',
    'higgins_helitour',
    'smoke_on_the_water',
    'mc_cocaine',
    'mc_maconha',
    'mc_dinheiro_falso',
    'mc_meth',
    'mc_docs_falsos'
  ]
};

export const initialAssets = [
  {
    id: 'profile',
    name: 'Lena "Ghost" Almeida',
    tag: 'GHOST-23',
    platform: 'PC',
    crew: 'SecuroServ Elite',
    mainCategory: 'PROFILE'
  },
  {
    id: 'apt-1',
    name: 'Eclipse Towers 31',
    location: 'Vinewood',
    tier: 'ALTO',
    mainCategory: 'IMOVEL',
    subcategory: 'apto_alto',
    purchasePrice: 1100000,
    estimatedValue: 1250000,
    notes: 'Base dos golpes do cassino',
    slots: 10,
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=60',
        caption: 'Vista da Eclipse Towers'
      }
    ]
  },
  {
    id: 'house-1',
    name: 'Richman Mansion',
    location: 'Richman',
    tier: 'ALTO',
    mainCategory: 'IMOVEL',
    subcategory: 'casa_alto',
    purchasePrice: 2200000,
    estimatedValue: 2400000,
    notes: 'Mansão principal do personagem',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1505692794400-5e0d8c9a1c5a?auto=format&fit=crop&w=600&q=60',
        caption: 'Entrada principal'
      }
    ]
  },
  {
    id: 'garage-1',
    name: 'Garagem Maze Bank West',
    location: 'Del Perro',
    tier: 'MEDIO',
    mainCategory: 'IMOVEL',
    subcategory: 'garagem',
    purchasePrice: 350000,
    estimatedValue: 400000,
    slots: 60
  },
  {
    id: 'deluxo',
    name: 'Deluxo',
    mainCategory: 'VEICULO',
    subcategory: 'carro',
    type: 'Sports Classic',
    purchasePrice: 4721250,
    estimatedValue: 3500000,
    garageSlot: 'Eclipse 31 - Slot 4',
    tags: ['heist', 'voador'],
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=600&q=60',
        caption: 'Deluxo pronto para heist'
      }
    ]
  },
  {
    id: 'oppressor',
    name: 'Oppressor Mk II',
    mainCategory: 'VEICULO',
    subcategory: 'moto',
    type: 'Special',
    purchasePrice: 3800000,
    estimatedValue: 3200000,
    garageSlot: 'Terrorbyte',
    tags: ['missao', 'pvp']
  },
  {
    id: 'kosatka',
    name: 'Kosatka Submarino',
    mainCategory: 'PROPRIEDADE_MOVEL',
    subcategory: 'veiculo_especial',
    purchasePrice: 2180000,
    estimatedValue: 2500000,
    notes: 'Base dos heists do Cayo Perico',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=600&q=60',
        caption: 'Kosatka atracado'
      }
    ]
  },
  {
    id: 'penthouse-art',
    name: 'Coleção Penthouse Cassino',
    mainCategory: 'PROPRIEDADE_MOVEL',
    subcategory: 'obra_arte',
    purchasePrice: 950000,
    estimatedValue: 1200000,
    notes: 'Peças raras obtidas em eventos'
  },
  {
    id: 'bunker',
    name: 'Bunker de Chumash',
    mainCategory: 'RENDA',
    subcategory: 'bunker',
    purchasePrice: 1650000,
    estimatedValue: 2100000,
    isIncomeGenerating: true,
    estimatedIncomePerHour: 94000,
    upgrades: ['equipamentos', 'funcionarios', 'seguranca']
  },
  {
    id: 'nightclub',
    name: 'Boate West Vinewood',
    mainCategory: 'RENDA',
    subcategory: 'boate',
    purchasePrice: 1080000,
    estimatedValue: 1800000,
    isIncomeGenerating: true,
    estimatedIncomePerHour: 52000,
    upgrades: ['tecnico adicional', 'popularidade máxima']
  },
  {
    id: 'mc-cocaine',
    name: 'MC - Laboratório de Cocaína',
    mainCategory: 'RENDA',
    subcategory: 'mc_cocaine',
    location: 'Morningwood',
    purchasePrice: 975000,
    estimatedValue: 1300000,
    isIncomeGenerating: true,
    estimatedIncomePerHour: 67000,
    upgrades: ['equipamentos', 'funcionarios']
  },
  {
    id: 'mc-weed',
    name: 'MC - Fazenda de Maconha',
    mainCategory: 'RENDA',
    subcategory: 'mc_maconha',
    purchasePrice: 715000,
    estimatedValue: 850000,
    isIncomeGenerating: true,
    estimatedIncomePerHour: 21000
  }
];
