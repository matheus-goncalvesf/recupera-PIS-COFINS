// Based on "Tabela 4.3.10 - Produtos Sujeitos à Incidência Monofásica da Contribuição Social - Alíquotas Diferenciadas (CST 02 e 04)"
// This is a simplified subset for demonstration purposes.
export const MONOFASICO_NCM_TABLE = new Set([
  // Combustíveis
  '27101259', // Gasolina
  '27101922', // Diesel
  '27111910', // GLP (Gás de cozinha)
  '27112100', // Gás Natural
  
  // Farmacêuticos
  '30039056',
  '30049039',
  '30049069',
  
  // Perfumaria e Higiene
  '33030010', // Perfumes
  '33030000', // Perfumes NCM antigo, presente no exemplo
  '33049990', // Protetor solar, cremes
  '33051000', // Shampoos
  '34011190', // Sabões de toucador

  // Autopeças
  '40111000', // Pneus novos para automóveis
  '87089990', // Outras partes e acessórios de veículos
  '27101932', // Óleos lubrificantes
  
  // Bebidas Frias
  '22011000', // Águas minerais e gaseificadas
  '22021000', // Refrigerantes
  '22030000', // Cervejas
]);
