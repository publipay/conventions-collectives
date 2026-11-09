# Réseaux de transports publics urbains de voyageurs — IDCC 1424

- [2025.1](1424-reseaux-transports-publics-urbains.2025.1.publicodes) : 1er janvier 2025, autres employeurs à partir du 5 juillet 2025 (accord du 20 février 2025, point à 9,85 €).
- [2026.1](1424-reseaux-transports-publics-urbains.2026.1.publicodes) : 1er janvier 2026, autres employeurs à partir du 31 mai 2026 (accord du 18 février 2026, point à 9,97 €).

La valeur Publicodes est `réseaux de transports urbains` ; les règles sont sous `salarié . convention collective . réseaux de transports urbains`.

## Règles implémentées

- `catégorie` : `ouvriers et employés` (ateliers, services techniques, mouvement, administratif et gestion), `maîtrise` (avec les techniciens et dessinateurs) ou `ingénieurs et cadres`. Les coefficients 205, 210, 220 et 300 existent dans deux barèmes.
- `coefficient` : coefficient du barème de la catégorie.
- `ancienneté dans l'entreprise` : en mois complets, paliers à 6 mois, 1, 3, 5, 10, 15, 20, 25 et 30 ans.
- `minimum à l'embauche`, `majoration d'ancienneté`, `barème` : le montant forfaitaire des coefficients 145 à 190, ou le coefficient multiplié par la valeur du point, majoré selon l'ancienneté et arrondi au centime. Les tests comparent tous les montants de l'annexe.
- `salaire minimum conventionnel` : le barème multiplié par `salarié . contrat . temps de travail . quotité` de modele-social.
- `coefficient hors grille` signale un coefficient absent du barème de la catégorie.

## Limites

- **Ingénieurs et cadres :** seul le montant à l'embauche est modélisé. L'annexe VI prévoit des majorations de 5 % tous les deux ans et demi pendant dix ans, puis de 10 % tous les cinq ans, mais dans un même grade : cette ancienneté n'est pas celle de l'entreprise, et le barème de l'accord ne les chiffre pas.
- Seuls les minima de salaire sont modélisés : primes, 13e mois, maintien de salaire, indemnités de rupture, santé et prévoyance ne le sont pas.
- Le SMIC reste un plancher à appliquer par le moteur de paie.

## Sources

- Accord du 20 février 2025 : https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000051998756 (arrêté du 1er juillet 2025, JORF du 5 juillet 2025).
- Accord du 18 février 2026 : https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054177295 (arrêté du 27 mai 2026, JORF du 31 mai 2026).
- Annexe VI, accord national de salaires : https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000005669239
- Convention collective nationale du 11 avril 1986, conteneur KALICONT000005635740.

## Financement du paritarisme

Les révisions 2025.2 (version 2025.1) et 2026.2 (version 2026.1), à la date d'effet de chaque version, ajoutent `financement du paritarisme` : contribution des entreprises au financement du dialogue social de branche : 0,1 % de la masse salariale brute (article 4 de l'accord du 3 décembre 2007). Le montant mensuel est une provision : 0,1 % du brut du mois (KALITEXT000018772924). Lu sur Légifrance le 9 novembre 2026. Elle s'ajoute à `salarié . cotisations . employeur`, en provision mensuelle ; la régularisation annuelle n'est pas calculée.

## Contribution conventionnelle de formation

Les révisions 2025.3 (version 2025.2) et 2026.3 (version 2026.2), à la date d'effet de chaque version, ajoutent `formation professionnelle conventionnelle` : contribution supplémentaire conventionnelle de formation professionnelle : 0,3 % de la masse salariale brute (accord du 6 février 2024), versée à l'opérateur de compétences de la branche. Le montant mensuel est une provision : 0,3 % du brut du mois (KALITEXT000049620584). Lu sur Légifrance le 9 novembre 2026. Elle s'ajoute à `salarié . cotisations . employeur`, à côté de la contribution légale ; la régularisation annuelle n'est pas calculée.
