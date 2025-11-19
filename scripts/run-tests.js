#!/usr/bin/env node
import { initialAssets } from '../public/data.js';
import { calculateNetWorth, calculateIncomeSummary } from '../public/metrics.js';

function run() {
  const netWorth = calculateNetWorth(initialAssets.filter((asset) => asset.mainCategory !== 'PROFILE'));
  if (netWorth <= 0) {
    throw new Error('Net worth should be greater than zero.');
  }
  const summary = calculateIncomeSummary(initialAssets.filter((asset) => asset.mainCategory === 'RENDA'));
  if (!summary || typeof summary.totalPerHour !== 'number' || summary.totalPerHour <= 0) {
    throw new Error('Income summary missing totalPerHour.');
  }
  console.log('Net worth:', netWorth.toFixed(2));
  console.log('Income per hour:', summary.totalPerHour.toFixed(2));
}

run();
