# Vercel Deployment Guide

## Vercel'de Deploy Etme

### 1. Vercel Dashboard'da Ayarlar

Vercel projenizde şu ayarları yapın:

**Settings > General:**
- **Root Directory:** `apps/web` olarak ayarlayın
- **Framework Preset:** Next.js
- **Build Command:** `npm run build` (otomatik algılanır)
- **Output Directory:** `.next` (otomatik algılanır)
- **Install Command:** `npm install` (otomatik algılanır)

### 2. Environment Variables

**Settings > Environment Variables** bölümüne şunları ekleyin:

```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_COFFEE_PORTAL_ADDRESS=your_deployed_contract_address
```

**Önemli:** 
- `NEXT_PUBLIC_` prefix'i olan değişkenler client-side'da kullanılabilir
- Her environment (Production, Preview, Development) için ayrı ayrı ekleyin

### 3. WalletConnect Project ID Alma

1. https://cloud.walletconnect.com adresine gidin
2. Ücretsiz hesap oluşturun
3. Yeni bir proje oluşturun
4. Project ID'yi kopyalayın
5. Vercel environment variables'a ekleyin

### 4. Deploy

1. GitHub repository'nizi Vercel'e bağlayın
2. Root directory'yi `apps/web` olarak ayarlayın
3. Environment variables'ları ekleyin
4. Deploy butonuna tıklayın

### 5. Sorun Giderme

Eğer hala hata alıyorsanız:

1. **Build Logs Kontrol:** Vercel dashboard'da build logs'u kontrol edin
2. **Environment Variables:** Tüm değişkenlerin doğru eklendiğinden emin olun
3. **Root Directory:** `apps/web` olarak ayarlandığından emin olun
4. **Node Version:** Vercel otomatik algılar, gerekirse `package.json`'a `"engines": { "node": ">=18" }` ekleyin

### 6. Yaygın Hatalar ve Çözümleri

**FUNCTION_INVOCATION_FAILED:**
- Environment variables eksik olabilir
- WalletConnect Project ID kontrol edin

**BUILD_ERROR:**
- Root directory yanlış olabilir
- `apps/web` olarak ayarlayın

**NOT_FOUND:**
- Output directory yanlış olabilir
- `.next` olarak ayarlayın

## Alternatif: Vercel CLI ile Deploy

```bash
cd apps/web
npm install -g vercel
vercel
```

Deploy sırasında sorular sorulacak:
- Root directory: `apps/web` (veya `.` eğer zaten apps/web içindeyseniz)
- Environment variables'ları ekleyin

