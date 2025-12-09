# 🔑 Guide : Obtenir les clés API Stripe

Ce guide vous explique comment obtenir vos clés API Stripe pour activer les paiements dans QSPELL.

---

## 📋 Prérequis

- Un compte Stripe (gratuit) : https://stripe.com
- Un navigateur web

---

## 🚀 Étapes pour obtenir les clés API Stripe

### 1. Créer un compte Stripe

1. Allez sur https://stripe.com
2. Cliquez sur **"Start now"** ou **"Sign in"** si vous avez déjà un compte
3. Remplissez le formulaire d'inscription (gratuit)
4. Vérifiez votre email si nécessaire

### 2. Accéder au Dashboard Stripe

1. Une fois connecté, vous serez redirigé vers le **Dashboard**
2. Si vous êtes nouveau, Stripe vous guidera à travers une configuration rapide
3. Vous pouvez ignorer cette configuration pour l'instant

### 3. Obtenir les clés API de test

1. Dans le menu de gauche, cliquez sur **"Developers"**
2. Cliquez sur **"API keys"** dans le sous-menu
3. Vous verrez deux sections :
   - **Publishable key** (commence par `pk_test_...`)
   - **Secret key** (commence par `sk_test_...`)

### 4. Récupérer la Secret Key

⚠️ **Important** : La Secret Key est sensible, ne la partagez jamais !

1. Dans la section **"Secret key"**, vous verrez `sk_test_...` masqué
2. Cliquez sur **"Reveal test key"** pour afficher la clé complète
3. Cliquez sur **"Copy"** pour copier la clé
4. Collez-la dans votre fichier `.env.local` comme `STRIPE_SECRET_KEY`

---

## 🔧 Configuration dans QSPELL

### Ajouter la clé dans .env.local

Ouvrez votre fichier `.env.local` à la racine du projet et ajoutez :

```env
# Stripe (Paiements)
STRIPE_SECRET_KEY=sk_test_votre_cle_ici
```

⚠️ **Ne commitez jamais** ce fichier sur Git ! Il est déjà dans `.gitignore`.

---

## 🧪 Tester avec les cartes de test Stripe

Stripe fournit des cartes de test pour tester les paiements sans utiliser de vraie carte :

### Carte de test réussie
- **Numéro** : `4242 4242 4242 4242`
- **Date d'expiration** : N'importe quelle date future (ex: `12/25`)
- **CVC** : N'importe quel 3 chiffres (ex: `123`)
- **Code postal** : N'importe quel code postal (ex: `75001`)

### Autres cartes de test utiles

**Carte refusée (insuffisant)**
- Numéro : `4000 0000 0000 9995`

**Carte nécessitant une authentification 3D Secure**
- Numéro : `4000 0027 6000 3184`

**Carte expirée**
- Numéro : `4000 0000 0000 0069`

📚 **Liste complète** : https://stripe.com/docs/testing

---

## 🔄 Mode Test vs Mode Production

### Mode Test (Développement)
- Clés commençant par `sk_test_...` et `pk_test_...`
- Utilisez ces clés pour le développement local
- Les paiements ne sont pas réels
- Vous pouvez tester sans limite

### Mode Production (Live)
- Clés commençant par `sk_live_...` et `pk_live_...`
- Utilisez ces clés uniquement en production
- Les paiements sont réels
- ⚠️ **Attention** : Les vrais paiements seront facturés !

Pour activer le mode production :
1. Allez dans **Developers** → **API keys**
2. Basculez sur **"Live mode"** (en haut à droite)
3. Récupérez les clés live (même processus)

---

## ✅ Vérification

Pour vérifier que votre configuration fonctionne :

1. Assurez-vous que `STRIPE_SECRET_KEY` est dans `.env.local`
2. Redémarrez votre serveur de développement :
   ```bash
   npm run dev
   ```
3. Testez un achat de QP dans l'application
4. Utilisez la carte de test `4242 4242 4242 4242`

Si tout fonctionne, vous verrez la transaction dans le Dashboard Stripe sous **"Payments"**.

---

## 🆘 Problèmes courants

### "Module not found: Can't resolve 'stripe'"
**Solution** :
```bash
npm install stripe
```

### "Invalid API Key provided"
**Cause** : La clé API est incorrecte ou mal formatée

**Solution** :
1. Vérifiez que la clé commence bien par `sk_test_...`
2. Vérifiez qu'il n'y a pas d'espaces avant/après la clé dans `.env.local`
3. Vérifiez que vous utilisez la **Secret key** et non la Publishable key

### "No such payment_intent"
**Cause** : Vous testez avec une clé de test mais le code attend une clé live (ou vice versa)

**Solution** : Assurez-vous d'utiliser les clés de test pour le développement

---

## 📚 Ressources

- **Documentation Stripe** : https://stripe.com/docs
- **Dashboard Stripe** : https://dashboard.stripe.com
- **Cartes de test** : https://stripe.com/docs/testing
- **API Reference** : https://stripe.com/docs/api

---

**💡 Astuce** : Gardez vos clés API dans un gestionnaire de mots de passe sécurisé !
