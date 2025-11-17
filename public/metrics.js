const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

export function formatCurrency(value = 0) {
  return currencyFormatter.format(value);
}

export function calculateNetWorth(assetList = []) {
  return assetList.reduce((total, asset) => {
    const value = Number(asset.estimatedValue ?? asset.purchasePrice ?? 0);
    return total + value;
  }, 0);
}

export function calculateIncomeSummary(incomeAssets = []) {
  const totalPerHour = incomeAssets.reduce((acc, asset) => acc + (asset.estimatedIncomePerHour || 0), 0);
  return {
    totalPerHour,
    items: incomeAssets.map((asset) => ({
      id: asset.id,
      name: asset.name,
      perHour: asset.estimatedIncomePerHour || 0,
      upgrades: asset.upgrades || []
    }))
  };
}
