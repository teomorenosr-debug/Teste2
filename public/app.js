import { initialAssets, subcategoryLabels, subcategoryOptions } from './data.js';
import { formatCurrency, calculateNetWorth, calculateIncomeSummary } from './metrics.js';

let assets = JSON.parse(JSON.stringify(initialAssets));
let dashboardContainer = null;
let panelsWrapper = null;
const sectionRegistry = new Map();
const navRegistry = new Map();

const mainCategoryToSection = {
  IMOVEL: 'properties',
  VEICULO: 'vehicles',
  PROPRIEDADE_MOVEL: 'movables',
  RENDA: 'income'
};

const sectionConfigs = [
  { id: 'status', label: 'Status', renderer: renderStatusSection },
  { id: 'properties', label: 'Imóveis', renderer: renderPropertiesSection },
  { id: 'vehicles', label: 'Veículos', renderer: renderVehiclesSection },
  { id: 'movables', label: 'Coleções', renderer: renderMovablesSection },
  { id: 'income', label: 'Negócios', renderer: renderIncomeSection },
  { id: 'form', label: 'Adicionar', renderer: renderFormSection }
];

function groupAssetsByCategory(category) {
  return assets.filter((asset) => asset.mainCategory === category);
}

function createCard(header, body) {
  const card = document.createElement('section');
  card.className = 'card';
  if (header) {
    const title = document.createElement('h3');
    title.textContent = header;
    card.appendChild(title);
  }
  const content = document.createElement('div');
  content.className = 'card-content';
  if (typeof body === 'string') {
    content.innerHTML = body;
  } else if (body instanceof HTMLElement) {
    content.appendChild(body);
  } else if (Array.isArray(body)) {
    body.forEach((node) => content.appendChild(node));
  }
  card.appendChild(content);
  return card;
}

function createPhotoStrip(photos = []) {
  if (!photos || !photos.length) return null;
  const gallery = document.createElement('div');
  gallery.className = 'photo-strip';
  photos.forEach((photo) => {
    const figure = document.createElement('figure');
    figure.innerHTML = `<img src="${photo.url}" alt="${photo.caption ?? 'Foto do ativo'}" loading="lazy" /><figcaption>${
      photo.caption ?? ''
    }</figcaption>`;
    gallery.appendChild(figure);
  });
  return gallery;
}

function renderStatusSection(root) {
  const profile = assets.find((asset) => asset.mainCategory === 'PROFILE');
  const assetsWithoutProfile = assets.filter((asset) => asset.mainCategory !== 'PROFILE');
  const netWorth = calculateNetWorth(assetsWithoutProfile);

  const summary = document.createElement('div');
  summary.className = 'status-grid';
  summary.innerHTML = `
    <div>
      <p class="label">Personagem</p>
      <p class="value">${profile?.name ?? 'Desconhecido'}</p>
    </div>
    <div>
      <p class="label">Tag</p>
      <p class="value">${profile?.tag ?? '-'}</p>
    </div>
    <div>
      <p class="label">Plataforma</p>
      <p class="value">${profile?.platform ?? '-'}</p>
    </div>
    <div>
      <p class="label">Crew</p>
      <p class="value">${profile?.crew ?? '-'}</p>
    </div>
    <div>
      <p class="label">Net worth</p>
      <p class="value highlight">${formatCurrency(netWorth)}</p>
    </div>
  `;

  const breakdown = document.createElement('ul');
  breakdown.className = 'breakdown-list';
  ['IMOVEL', 'VEICULO', 'PROPRIEDADE_MOVEL', 'RENDA'].forEach((key) => {
    const subtotal = calculateNetWorth(assetsWithoutProfile.filter((asset) => asset.mainCategory === key));
    const labelMap = {
      IMOVEL: 'Imóveis',
      VEICULO: 'Veículos',
      PROPRIEDADE_MOVEL: 'Coleções',
      RENDA: 'Negócios'
    };
    const item = document.createElement('li');
    item.innerHTML = `<span>${labelMap[key]}</span><strong>${formatCurrency(subtotal)}</strong>`;
    breakdown.appendChild(item);
  });

  const actionBar = document.createElement('div');
  actionBar.className = 'action-bar';
  actionBar.innerHTML = `
    <button type="button" data-tab="properties">Ver imóveis</button>
    <button type="button" data-tab="vehicles">Ver veículos</button>
    <button type="button" data-tab="movables">Coleções</button>
    <button type="button" data-tab="income">Negócios</button>
  `;

  const card = createCard('Status SecuroServ', [summary, breakdown, actionBar]);
  root.appendChild(card);
}

function renderAssetCollection(title, items, formatter) {
  const list = document.createElement('div');
  list.className = 'asset-list';
  items.forEach((asset) => {
    const item = document.createElement('article');
    item.className = 'asset-item';
    item.innerHTML = formatter(asset);
    const gallery = createPhotoStrip(asset.photos);
    if (gallery) {
      item.appendChild(gallery);
    }
    list.appendChild(item);
  });
  return createCard(title, list);
}

function renderPropertiesSection(root) {
  const properties = groupAssetsByCategory('IMOVEL');
  if (!properties.length) {
    root.appendChild(createCard('Imóveis', '<p>Nenhum imóvel cadastrado ainda.</p>'));
    return;
  }
  root.appendChild(
    renderAssetCollection('Imóveis', properties, (property) => `
      <h4>${property.name}</h4>
      <p class="meta">${subcategoryLabels[property.subcategory] ?? property.subcategory}</p>
      <p>${property.location ?? 'Localização não informada'}</p>
      <p class="value">${formatCurrency(property.estimatedValue ?? property.purchasePrice)}</p>
      ${property.notes ? `<p class="notes">${property.notes}</p>` : ''}
    `)
  );
}

function renderVehiclesSection(root) {
  const vehicles = groupAssetsByCategory('VEICULO');
  if (!vehicles.length) {
    root.appendChild(createCard('Veículos', '<p>Nenhum veículo cadastrado.</p>'));
    return;
  }
  root.appendChild(
    renderAssetCollection('Veículos', vehicles, (vehicle) => `
      <h4>${vehicle.name}</h4>
      <p class="meta">${vehicle.type ?? subcategoryLabels[vehicle.subcategory] ?? 'Veículo'}</p>
      <p>Garage: ${vehicle.garageSlot ?? 'N/A'}</p>
      <p class="value">${formatCurrency(vehicle.estimatedValue ?? vehicle.purchasePrice)}</p>
      ${vehicle.tags ? `<p class="notes">Tags: ${vehicle.tags.join(', ')}</p>` : ''}
    `)
  );
}

function renderMovablesSection(root) {
  const movables = groupAssetsByCategory('PROPRIEDADE_MOVEL');
  if (!movables.length) {
    root.appendChild(createCard('Propriedades móveis', '<p>Nenhuma coleção cadastrada.</p>'));
    return;
  }
  root.appendChild(
    renderAssetCollection('Propriedades móveis', movables, (movable) => `
      <h4>${movable.name}</h4>
      <p class="meta">${subcategoryLabels[movable.subcategory] ?? movable.subcategory}</p>
      <p class="value">${formatCurrency(movable.estimatedValue ?? movable.purchasePrice)}</p>
      ${movable.notes ? `<p class="notes">${movable.notes}</p>` : ''}
    `)
  );
}

function renderIncomeSection(root) {
  const incomeAssets = groupAssetsByCategory('RENDA');
  if (!incomeAssets.length) {
    root.appendChild(createCard('Negócios de renda', '<p>Adicione um negócio para calcular a renda/h.</p>'));
    return;
  }
  const summary = calculateIncomeSummary(incomeAssets);
  const header = document.createElement('div');
  header.className = 'income-summary';
  header.innerHTML = `
    <p class="label">Renda total estimada / hora</p>
    <p class="value highlight">${formatCurrency(summary.totalPerHour)}</p>
  `;

  const list = document.createElement('div');
  list.className = 'asset-list';
  summary.items.forEach((item) => {
    const assetData = incomeAssets.find((asset) => asset.id === item.id);
    const node = document.createElement('article');
    node.className = 'asset-item';
    node.innerHTML = `
      <h4>${item.name}</h4>
      <p class="meta">${subcategoryLabels[assetData?.subcategory] ?? assetData?.subcategory ?? ''}</p>
      <p class="value">${formatCurrency(item.perHour)} / h</p>
      ${item.upgrades?.length ? `<p class="notes">Upgrades: ${item.upgrades.join(', ')}</p>` : ''}
    `;
    const gallery = createPhotoStrip(assetData?.photos);
    if (gallery) {
      node.appendChild(gallery);
    }
    list.appendChild(node);
  });

  const container = document.createElement('div');
  container.appendChild(header);
  container.appendChild(list);
  root.appendChild(createCard('Negócios de renda', container));
}

function generateId() {
  return `custom-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function parsePhotos(value) {
  if (!value) return [];
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((url) => ({ url }));
}

function renderFormSection(root) {
  const form = document.createElement('form');
  form.className = 'asset-form';

  const title = document.createElement('p');
  title.className = 'form-title';
  title.textContent = 'Adicionar ativo / negócio';
  form.appendChild(title);

  const mainField = document.createElement('label');
  mainField.textContent = 'Categoria principal';
  const mainSelect = document.createElement('select');
  mainSelect.name = 'mainCategory';
  ['IMOVEL', 'VEICULO', 'PROPRIEDADE_MOVEL', 'RENDA'].forEach((value) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    mainSelect.appendChild(option);
  });
  mainField.appendChild(mainSelect);
  form.appendChild(mainField);

  const subField = document.createElement('label');
  subField.textContent = 'Subcategoria';
  const subSelect = document.createElement('select');
  subSelect.name = 'subcategory';
  subField.appendChild(subSelect);
  form.appendChild(subField);

  const nameField = document.createElement('label');
  nameField.textContent = 'Nome do ativo';
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.name = 'name';
  nameInput.required = true;
  nameField.appendChild(nameInput);
  form.appendChild(nameField);

  const locationField = document.createElement('label');
  locationField.textContent = 'Localização / garagem';
  const locationInput = document.createElement('input');
  locationInput.type = 'text';
  locationInput.name = 'location';
  locationField.appendChild(locationInput);
  form.appendChild(locationField);

  const purchaseField = document.createElement('label');
  purchaseField.textContent = 'Valor de compra (GTA$)';
  const purchaseInput = document.createElement('input');
  purchaseInput.type = 'number';
  purchaseInput.name = 'purchasePrice';
  purchaseField.appendChild(purchaseInput);
  form.appendChild(purchaseField);

  const valueField = document.createElement('label');
  valueField.textContent = 'Valor estimado (GTA$)';
  const valueInput = document.createElement('input');
  valueInput.type = 'number';
  valueInput.name = 'estimatedValue';
  valueField.appendChild(valueInput);
  form.appendChild(valueField);

  const incomeToggle = document.createElement('label');
  incomeToggle.className = 'checkbox-field';
  const incomeInput = document.createElement('input');
  incomeInput.type = 'checkbox';
  incomeInput.name = 'isIncomeGenerating';
  incomeToggle.appendChild(incomeInput);
  incomeToggle.append(' Negócio que gera renda');
  form.appendChild(incomeToggle);

  const incomeField = document.createElement('label');
  incomeField.textContent = 'Renda por hora (GTA$)';
  const incomeInputValue = document.createElement('input');
  incomeInputValue.type = 'number';
  incomeInputValue.name = 'estimatedIncomePerHour';
  incomeField.appendChild(incomeInputValue);
  form.appendChild(incomeField);

  const notesField = document.createElement('label');
  notesField.textContent = 'Notas';
  const notesInput = document.createElement('textarea');
  notesInput.name = 'notes';
  notesField.appendChild(notesInput);
  form.appendChild(notesField);

  const photosField = document.createElement('label');
  photosField.textContent = 'URLs de imagens (uma por linha)';
  const photosInput = document.createElement('textarea');
  photosInput.name = 'photos';
  photosInput.placeholder = 'https://...';
  photosField.appendChild(photosInput);
  form.appendChild(photosField);

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Salvar ativo';
  form.appendChild(submitButton);

  const feedback = document.createElement('p');
  feedback.className = 'form-feedback';
  form.appendChild(feedback);

  function populateSubcategories(category) {
    subSelect.innerHTML = '';
    const options = subcategoryOptions[category] ?? [];
    options.forEach((value) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = subcategoryLabels[value] ?? value;
      subSelect.appendChild(option);
    });
  }

  populateSubcategories(mainSelect.value);
  mainSelect.addEventListener('change', () => populateSubcategories(mainSelect.value));

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const newAsset = {
      id: generateId(),
      mainCategory: formData.get('mainCategory'),
      subcategory: formData.get('subcategory'),
      name: formData.get('name'),
      location: formData.get('location') || undefined,
      purchasePrice: Number(formData.get('purchasePrice')) || undefined,
      estimatedValue: Number(formData.get('estimatedValue')) || undefined,
      notes: formData.get('notes') || undefined,
      photos: parsePhotos(formData.get('photos'))
    };

    if (newAsset.mainCategory === 'RENDA' || formData.get('isIncomeGenerating') === 'on') {
      newAsset.isIncomeGenerating = true;
      const incomeValue = Number(formData.get('estimatedIncomePerHour')) || 0;
      newAsset.estimatedIncomePerHour = incomeValue;
    }

    assets.push(newAsset);
    form.reset();
    populateSubcategories(mainSelect.value);
    feedback.textContent = 'Ativo adicionado ao dashboard!';
    feedback.classList.add('is-visible');
    renderAllSections();
    const nextSection = mainCategoryToSection[newAsset.mainCategory];
    if (nextSection) {
      setActiveSection(nextSection);
    }
  });

  root.appendChild(createCard('Cadastro rápido', form));
}

function renderAllSections() {
  sectionConfigs.forEach((section) => {
    const panel = sectionRegistry.get(section.id);
    if (!panel) return;
    panel.innerHTML = '';
    section.renderer(panel);
  });
}

function setActiveSection(id) {
  sectionRegistry.forEach((panel, key) => {
    if (key === id) {
      panel.classList.add('is-active');
    } else {
      panel.classList.remove('is-active');
    }
  });
  navRegistry.forEach((button, key) => {
    if (key === id) {
      button.classList.add('is-active');
    } else {
      button.classList.remove('is-active');
    }
  });
}

function enableTabShortcuts() {
  document.body.addEventListener('click', (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.dataset.tab) {
      setActiveSection(target.dataset.tab);
    }
  });
}

function buildDashboardShell(root) {
  dashboardContainer = document.createElement('div');
  dashboardContainer.id = 'dashboard';
  dashboardContainer.className = 'dashboard is-hidden';

  const nav = document.createElement('nav');
  nav.className = 'tab-nav';
  sectionConfigs.forEach((section, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = section.label;
    button.addEventListener('click', () => setActiveSection(section.id));
    nav.appendChild(button);
    navRegistry.set(section.id, button);
    if (index === 0) {
      button.classList.add('is-active');
    }
  });

  panelsWrapper = document.createElement('div');
  panelsWrapper.className = 'tab-panels';
  sectionConfigs.forEach((section, index) => {
    const panel = document.createElement('section');
    panel.className = 'tab-panel';
    if (index === 0) {
      panel.classList.add('is-active');
    }
    sectionRegistry.set(section.id, panel);
    panelsWrapper.appendChild(panel);
  });

  dashboardContainer.appendChild(nav);
  dashboardContainer.appendChild(panelsWrapper);
  root.appendChild(dashboardContainer);
}

function showDashboard() {
  if (!dashboardContainer) return;
  dashboardContainer.classList.remove('is-hidden');
  dashboardContainer.classList.add('is-visible');
}

function startAuthSequence(heroCard) {
  if (!heroCard || heroCard.classList.contains('authenticated') || heroCard.classList.contains('authenticating')) {
    return;
  }

  heroCard.classList.add('authenticating');
  const tagline = heroCard.querySelector('.tagline');
  const button = heroCard.querySelector('button');

  if (tagline) {
    tagline.textContent = 'CONNECTING...';
  }

  if (button) {
    button.textContent = 'Establishing link';
    button.disabled = true;
  }

  setTimeout(() => {
    heroCard.classList.remove('authenticating');
    heroCard.classList.add('authenticated');
    if (tagline) {
      tagline.textContent = 'ACCESS GRANTED';
    }
    if (button) {
      button.textContent = 'Online';
      button.classList.add('success');
    }
    showDashboard();
  }, 1600);
}

function renderLoginHero(root) {
  const hero = document.createElement('section');
  hero.className = 'login-hero';
  hero.innerHTML = `
    <div class="hero-card">
      <div class="logo" aria-hidden="true">
        <svg class="securoserv-emblem" viewBox="0 0 200 200" role="img" aria-label="SecuroServ emblem">
          <defs>
            <linearGradient id="triShade" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#ff5a5a" />
              <stop offset="55%" stop-color="#d63131" />
              <stop offset="100%" stop-color="#8c1212" />
            </linearGradient>
            <linearGradient id="triInnerShade" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#ff8c8c" />
              <stop offset="100%" stop-color="#c62828" />
            </linearGradient>
          </defs>
          <polygon points="100,10 185,180 15,180" fill="url(#triShade)"></polygon>
          <polygon points="100,40 165,172 35,172" fill="url(#triInnerShade)" opacity="0.95"></polygon>
          <ellipse cx="100" cy="123" rx="58" ry="28" fill="#fff" stroke="#b8b8b8" stroke-width="2"></ellipse>
          <circle cx="100" cy="123" r="18" fill="#d41e1e"></circle>
          <circle cx="100" cy="123" r="8" fill="#5c0b0b"></circle>
        </svg>
        <p class="logo-text">SecuroServ</p>
      </div>
      <p class="tagline">PLEASE LOG IN</p>
      <label>Username<input type="text" placeholder="Gamertag" value="${assets[0]?.tag ?? ''}" /></label>
      <label>Password<input type="password" placeholder="••••••" value="hunter2" /></label>
      <button type="button">Log in</button>
      <p class="version">VERSION 1.0.0</p>
      <div class="login-wave" aria-hidden="true"></div>
    </div>
  `;
  const card = hero.querySelector('.hero-card');
  const button = hero.querySelector('button');
  if (card && button) {
    button.addEventListener('click', () => startAuthSequence(card));
  }
  root.appendChild(hero);
}

function bootstrap() {
  const root = document.getElementById('app');
  if (!root) return;

  renderLoginHero(root);
  buildDashboardShell(root);
  renderAllSections();
  enableTabShortcuts();
}

document.addEventListener('DOMContentLoaded', bootstrap);
