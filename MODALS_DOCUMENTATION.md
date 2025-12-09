# Système de Modals

Ce document décrit le système de modals personnalisé qui remplace les `alert()`, `confirm()` et `prompt()` natifs du navigateur.

## Architecture

Le système de modals est composé de :

1. **ModalService** (`src/app/services/modal.service.ts`) - Service gérant l'état et la logique des modals
2. **ModalComponent** (`src/app/components/modal/modal.component.*`) - Composant UI affichant les modals

## Utilisation

### 1. Importer le service dans votre composant

```typescript
import { ModalService } from '../../services/modal.service';

constructor(private modalService: ModalService) {}
```

### 2. Utiliser les méthodes du service

#### Alert (Information)

Affiche un message d'information avec un seul bouton "OK".

```typescript
await this.modalService.alert('Titre', 'Votre message ici');
```

**Exemple :**
```typescript
await this.modalService.alert(
  'Succès',
  'Votre commande a été créée avec succès !'
);
```

#### Confirm (Confirmation)

Affiche un message avec deux boutons : "Confirmer" et "Annuler". Retourne `true` si confirmé, `false` sinon.

```typescript
const confirmed = await this.modalService.confirm(
  'Titre',
  'Message de confirmation',
  'Texte bouton confirmer',  // optionnel, défaut: "Confirmer"
  'Texte bouton annuler'      // optionnel, défaut: "Annuler"
);

if (confirmed) {
  // Action confirmée
}
```

**Exemple :**
```typescript
const confirmed = await this.modalService.confirm(
  'Supprimer le produit',
  'Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.',
  'Supprimer',
  'Annuler'
);

if (confirmed) {
  this.deleteProduct(id);
}
```

#### Prompt (Saisie utilisateur)

Affiche un champ de saisie. Retourne la valeur saisie si confirmé, `null` si annulé.

```typescript
const value = await this.modalService.prompt(
  'Titre',
  'Message',
  'Placeholder',    // optionnel
  'Valeur défaut'   // optionnel
);

if (value !== null) {
  // Utiliser la valeur saisie
}
```

**Exemple :**
```typescript
const quantity = await this.modalService.prompt(
  'Quantité',
  'Combien de croissants voulez-vous ajouter ?',
  'Quantité',
  '1'
);

if (quantity) {
  const qty = parseInt(quantity);
  if (qty > 0) {
    this.addToCart(product, qty);
  }
}
```

## Points importants

1. **Async/Await** : Toutes les méthodes retournent des Promises, utilisez `await` ou `.then()`

2. **Fonction async** : Les fonctions qui utilisent le ModalService doivent être déclarées comme `async`
   ```typescript
   async deleteItem(): Promise<void> {
     const confirmed = await this.modalService.confirm(...);
   }
   ```

3. **Fermeture automatique** : Le modal se ferme automatiquement lors du clic sur un bouton

4. **Clic sur le backdrop** : Cliquer en dehors du modal l'annule (équivalent au bouton Annuler)

5. **Touche Entrée** : Dans les prompts, appuyer sur Entrée valide automatiquement

## Personnalisation du style

Le style des modals est défini dans `modal.component.css` :

- **Couleurs** : Le thème utilise les couleurs de la pâtisserie (marron #8B4513)
- **Animations** : Fade-in du backdrop, slide-in du modal
- **Responsive** : Adapté aux écrans mobiles

### Modifier les couleurs

Éditez `modal.component.css` :

```css
.modal-header {
  background: linear-gradient(135deg, #VotreCouleur1 0%, #VotreCouleur2 100%);
}

.btn-confirm {
  background: linear-gradient(135deg, #VotreCouleur1 0%, #VotreCouleur2 100%);
}
```

## Migration depuis alert/confirm/prompt

### Avant
```typescript
alert('Message');
if (confirm('Êtes-vous sûr ?')) { ... }
const value = prompt('Entrez une valeur', 'défaut');
```

### Après
```typescript
await this.modalService.alert('Titre', 'Message');
if (await this.modalService.confirm('Titre', 'Êtes-vous sûr ?')) { ... }
const value = await this.modalService.prompt('Titre', 'Entrez une valeur', '', 'défaut');
```

## Avantages par rapport aux natives

✅ **Design personnalisé** - S'intègre au design de l'application
✅ **Responsive** - Adapté aux mobiles
✅ **Cohérence** - Même apparence sur tous les navigateurs
✅ **Accessibilité** - Support clavier (Entrée, Échap)
✅ **Animation** - Transitions fluides
✅ **Multilingue** - Textes personnalisables
✅ **Testable** - Facilement testable avec Jasmine/Karma

## Tests

Les tests unitaires sont disponibles dans `modal.component.spec.ts`.

Pour exécuter les tests :
```bash
npm test
```

## Composants utilisant le système de modals

- ✅ AdminComponent - Confirmation de suppression, alertes d'accès
- ✅ CartComponent - Confirmation vider panier, retrait article, validation commande
- ✅ ProductListComponent - Saisie quantité, ajout panier
- ✅ HomeComponent - Saisie quantité, ajout panier

## Support

Pour toute question ou problème, consultez la documentation Angular ou contactez l'équipe de développement.
